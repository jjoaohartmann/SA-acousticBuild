import json

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from models import User, Simulacao
from auth import get_current_user
from formulas import calcular
from criteria import classificar
from suggestions import gerar_sugestoes, narrar
from schemas import CalcularRequest, SimulacaoCreate, SimulacaoResponse

router = APIRouter(prefix="/acustica", tags=["Calculadora Acustica"])


def _serializar_simulacao(sim: Simulacao) -> dict:
    """Converte o registro (com campos Text JSON) em dict para o SimulacaoResponse."""
    return {
        "id": sim.id,
        "tipo_analise": sim.tipo_analise,
        "dados_entrada": json.loads(sim.dados_entrada),
        "resultado": json.loads(sim.resultado),
        "criado_em": sim.criado_em,
    }


def _montar_resposta(tipo: str, resultado: dict, incluir_narrativa: bool = True):
    principal = resultado['indicador_principal']

    # NBR 15575 julgamento: para aereo o criterio usa DnT; demais usam o principal.
    if tipo == 'aereo':
        valor_criterio = resultado.get('detalhes', {}).get('dnt', principal['valor'])
        criterio_nome = 'DnT'
    else:
        valor_criterio = principal['valor']
        criterio_nome = principal['nome']

    classificacao = classificar(tipo, valor_criterio)
    sugestoes = gerar_sugestoes(tipo, resultado)

    resposta = {
        "tipo": tipo,
        "indicador_principal": principal,
        "indicador_secundario": resultado.get('indicador_secundario'),
        "classificacao": classificacao['classificacao'],
        "criterios": {
            "norma": "NBR 15575",
            "indicador": criterio_nome,
            "valor": round(valor_criterio, 4),
            "referencia": classificacao.get('limite'),
            "unidade": "dB",
        },
        "motivo": classificacao['motivo'],
        "sugestoes": sugestoes,
        "detalhes": resultado.get('detalhes', {}),
    }

    if incluir_narrativa and sugestoes:
        resposta["narrativa"] = narrar(tipo, resultado, sugestoes)['narrativa']

    return resposta


@router.post("/calcular", response_model=dict)
def calcular(request: CalcularRequest):
    """
    PUBLICO — calcula isolamento/impacto sem exigir autenticacao.
    Retorna o indicador principal, classificacao e sugestoes (Camada 1).
    """
    payload = request.model_dump()
    try:
        import formulas
        resultado = formulas.calcular(payload)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_CONTENT, detail=str(e))

    return _montar_resposta(payload.get('tipo_analise', 'aereo'), resultado)


@router.post("/salvar", response_model=SimulacaoResponse, status_code=201)
def salvar_simulacao(
    sim: SimulacaoCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """PROTEGIDO — grava a simulacao do usuario logado."""
    nova = Simulacao(
        user_id=user.id,
        tipo_analise=sim.tipo_analise,
        dados_entrada=json.dumps(sim.dados_entrada, ensure_ascii=False),
        resultado=json.dumps(sim.resultado, ensure_ascii=False),
    )
    db.add(nova)
    db.commit()
    db.refresh(nova)
    return _serializar_simulacao(nova)


@router.get("/simulacoes", response_model=list[SimulacaoResponse])
def listar_simulacoes(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """PROTEGIDO — lista somente as simulacoes do usuario logado."""
    rows = (
        db.query(Simulacao)
        .filter(Simulacao.user_id == user.id)
        .order_by(Simulacao.criado_em.desc())
        .all()
    )
    return [_serializar_simulacao(r) for r in rows]
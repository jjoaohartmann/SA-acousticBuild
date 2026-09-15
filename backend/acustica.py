import json
import math
from contextlib import suppress
from typing import Any

from auth import get_current_user
from conforto import avaliar_conforto, resolver_ambiente
from criteria import CRITERIOS_CENARIOS, avaliar_reverberacao, classificar
from database import get_db
from fastapi import APIRouter, Depends, HTTPException, status
from formulas import calcular as executar_calculo
from models import Simulacao, User
from schemas import CalcularRequest, SimulacaoCreate, SimulacaoResponse
from sqlalchemy.orm import Session
from suggestions import gerar_sugestoes, narrar

router = APIRouter(prefix="/acustica", tags=["Calculadora Acústica"])


def _serializar_simulacao(sim: Simulacao) -> dict[str, Any]:
    """Converte o registro (com campos Text JSON) em dict para o SimulacaoResponse."""
    dados_entrada_str = str(sim.dados_entrada) if sim.dados_entrada is not None else "{}"
    resultado_str = str(sim.resultado) if sim.resultado is not None else "{}"
    return {
        "id": int(sim.id),  # type: ignore[arg-type]
        "tipo_analise": str(sim.tipo_analise),
        "dados_entrada": json.loads(dados_entrada_str),
        "resultado": json.loads(resultado_str),
        "criado_em": sim.criado_em,
    }


def _montar_resposta(
    tipo: str,
    resultado: dict[str, Any],
    cenario: str | None = None,
    incluir_narrativa: bool = True,
    metadados: dict[str, Any] | None = None,
    ambiente_tipo: str | None = None,
    l1: float | None = None,
) -> dict[str, Any]:
    principal = resultado.get('indicador_principal')
    if principal is None and resultado.get('resultado'):
        principal = resultado['resultado'].get('indicador_principal')

    # Se não foi possível calcular o indicador (ex: composição sem dado acústico documentado)
    if principal is None:
        return {
            "tipo": tipo,
            "indicador_principal": None,
            "indicador_secundario": None,
            "classificacao": "NÃO DETERMINADO",
            "nivel": None,
            "motivo": "Não foi possível calcular o indicador acústico por ausência de dados de ensaio documentados.",
            "criterios": None,
            "reverberacao_avaliacao": None,
            "sugestoes": [],
            "confiabilidade": resultado.get("confiabilidade", "sem_dado"),
            "origem": resultado.get("origem", "Sistema sem dado acústico documentado"),
            "fontes": resultado.get("fontes", []),
            "limitacoes": resultado.get("limitacoes", []),
            "composicao": resultado.get("composicao", []),
            "propriedades_fisicas": resultado.get("propriedades_fisicas", {}),
            "detalhes": resultado.get("detalhes", {}),
            "metadados": metadados or {},
        }

    # Julgamento normativo NBR 15575 por cenário selecionado
    if tipo in ('aereo', 'dnt'):
        valor_criterio = resultado.get('detalhes', {}).get('dnt', principal['valor'])
        criterio_nome = 'DnT,w' if 'w' in principal.get('nome', '') else 'DnT'
    else:
        valor_criterio = resultado.get('detalhes', {}).get('lnt', principal['valor'])
        criterio_nome = "L'nT,w" if 'w' in principal.get('nome', '') else "L'nT"

    classificacao = classificar(tipo, float(valor_criterio), cenario_id=cenario)
    sugestoes = gerar_sugestoes(tipo, resultado, classificacao)

    t_val = resultado.get('detalhes', {}).get('t')
    # A reverberação é julgada com o mesmo ambiente usado no conforto, para as
    # duas leituras não citarem normas diferentes sobre o mesmo cômodo.
    ambiente_resolvido = resolver_ambiente(cenario, ambiente_tipo)
    avaliacao_reverb = (
        avaliar_reverberacao(float(t_val), ambiente_resolvido) if t_val is not None else None
    )

    # Nível que efetivamente chega ao ambiente receptor — é ele que se compara
    # com a NBR 10152 (escala intuitiva: menos decibéis é sempre melhor).
    det = resultado.setdefault('detalhes', {})
    if tipo in ('aereo', 'dnt'):
        # O L1 escolhido no passo 2 precisa chegar até aqui. Os caminhos por
        # sistema do catálogo e por estimativa não o devolvem em `detalhes`, e o
        # nível recebido era calculado sempre com 85 dB — o seletor não fazia efeito.
        if det.get('l1') is None:
            det['l1'] = float(l1) if l1 is not None else 85.0
            det['l1_padrao'] = l1 is None
        nivel_recebido = det.get('l2_previsto', det.get('l2'))
        # nesses caminhos o L2 é reconstruído do indicador padronizado:
        # L2 = L1 - DnT + 10*log10(T/T0)
        if nivel_recebido is None and det.get('dnt') is not None and det.get('t'):
            nivel_recebido = (
                float(det['l1']) - float(det['dnt']) + 10.0 * math.log10(float(det['t']) / 0.5)
            )
            det['l2_previsto'] = round(nivel_recebido, 2)
    else:
        nivel_recebido = det.get('lnt', det.get('ln'))

    conforto = avaliar_conforto(nivel_recebido, cenario, ambiente_tipo, tipo=tipo)

    # Status direto em relação ao critério selecionado (ATENDE / NÃO ATENDE)
    status_atendimento = "ATENDE" if classificacao.get("nivel") in ("minimo", "intermediario", "superior", "atende") else "NÃO ATENDE"

    resposta: dict[str, Any] = {
        "tipo": tipo,
        "indicador_principal": principal,
        # a estimativa pela lei da massa aninha o Rw teórico em `resultado`
        "indicador_secundario": (
            resultado.get('indicador_secundario')
            or (resultado.get('resultado') or {}).get('indicador_secundario')
        ),
        "classificacao": classificacao['classificacao'],
        "nivel_normativo": classificacao.get('nivel'),
        "status_atendimento": status_atendimento,
        "criterios": {
            "norma": "NBR 15575",
            "cenario": classificacao.get('cenario_nome'),
            "indicador": criterio_nome,
            "valor": round(float(valor_criterio), 2),
            "referencia": classificacao.get('limite'),
            "limites": classificacao.get('limites'),
            "status": status_atendimento,
            "unidade": "dB",
        },
        "reverberacao_avaliacao": avaliacao_reverb,
        "conforto": conforto,
        "nivel_recebido": round(float(nivel_recebido), 2) if nivel_recebido is not None else None,
        "motivo": classificacao['motivo'],
        "confiabilidade": resultado.get("confiabilidade", "documentado"),
        "origem": resultado.get("origem", "Resultado calculado pelo motor técnico"),
        "fontes": resultado.get("fontes", []),
        "limitacoes": resultado.get("limitacoes", []),
        "composicao": resultado.get("composicao", []),
        "propriedades_fisicas": resultado.get("propriedades_fisicas", {}),
        "sugestoes": sugestoes,
        "detalhes": resultado.get('detalhes', {}),
        "metadados": metadados or {},
    }

    if incluir_narrativa and sugestoes:
        # A narrativa e' um enfeite: se faltar chave no resultado, o calculo
        # continua valido e a resposta sai sem ela.
        with suppress(KeyError, ValueError, TypeError):
            resposta["narrativa"] = narrar(tipo, resultado, sugestoes)['narrativa']

    return resposta


@router.get("/cenarios", response_model=dict[str, Any])
def listar_cenarios():
    """Retorna os critérios e cenários normativos parametrizados da ABNT NBR 15575."""
    return CRITERIOS_CENARIOS


@router.post("/calcular", response_model=dict)
def calcular(request: CalcularRequest, db: Session = Depends(get_db)):
    """
    PÚBLICO — executa o motor acústico com o fluxo estrito da AcousticBuild.
    Retorna indicadores, julgamento por cenário, fontes técnicas, limites e propriedades físicas.
    """
    payload = request.model_dump()
    try:
        resultado = executar_calculo(payload, db=db)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT, detail=str(e)
        ) from e

    tipo = str(payload.get('tipo_analise', 'aereo'))
    cenario = payload.get('cenario')
    metadados = {
        "ambiente_emissor": payload.get('ambiente_emissor'),
        "ambiente_receptor": payload.get('ambiente_receptor'),
        "elemento_separador": payload.get('elemento_separador'),
        "sistema_codigo": payload.get('sistema_codigo'),
        "cenario": cenario,
    }

    return _montar_resposta(
        tipo,
        resultado,
        cenario=cenario,
        metadados=metadados,
        ambiente_tipo=payload.get('ambiente_receptor_tipo'),
        l1=payload.get('l1'),
    )


@router.post("/salvar", response_model=SimulacaoResponse, status_code=201)
def salvar_simulacao(
    sim: SimulacaoCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """PROTEGIDO — grava a simulação do usuário logado."""
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
    """PROTEGIDO — lista somente as simulações do usuário logado."""
    rows = (
        db.query(Simulacao)
        .filter(Simulacao.user_id == user.id)
        .order_by(Simulacao.criado_em.desc())
        .all()
    )
    return [_serializar_simulacao(r) for r in rows]
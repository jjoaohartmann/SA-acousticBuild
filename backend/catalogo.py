"""Router da API para o Catálogo de Materiais e Sistemas Construtivos.

Endpoints:
- GET /materiais: Lista materiais e suas variações dimensionais.
- GET /materiais/{id}: Detalhes de um material específico.
- GET /sistemas: Lista sistemas construtivos documentados (filtrável por tipo_elemento).
- GET /sistemas/{codigo}: Composição, dados acústicos e fontes rastreáveis de um sistema.
- POST /sistemas/montar: Validação de composição de camadas, propriedades físicas e correspondência documental.
"""
from typing import Any

from database import get_db
from engine import buscar_correspondencia_exata, resolver_propriedades_camadas
from fastapi import APIRouter, Depends, HTTPException, Query, status
from models import Material, SistemaConstrutivo
from schemas import (
    MaterialOut,
    MontarSistemaRequest,
    SistemaOut,
)
from sqlalchemy.orm import Session, joinedload

router = APIRouter(tags=["Catálogo Construtivo"])


@router.get("/materiais", response_model=list[MaterialOut])
def listar_materiais(
    categoria: str | None = Query(None, description="Filtrar por categoria (alvenaria, concreto, revestimento, etc.)"),
    db: Session = Depends(get_db)
):
    """Retorna o catálogo de materiais individuais e suas variações físicas documentadas."""
    query = db.query(Material).options(joinedload(Material.variacoes))
    if categoria:
        query = query.filter(Material.categoria == categoria)
    return query.all()


@router.get("/materiais/{material_id}", response_model=MaterialOut)
def obter_material(material_id: int, db: Session = Depends(get_db)):
    """Retorna os detalhes e variações de um material individual pelo ID."""
    material = (
        db.query(Material)
        .options(joinedload(Material.variacoes))
        .filter(Material.id == material_id)
        .first()
    )
    if not material:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Material com ID {material_id} não encontrado."
        )
    return material


def _formatar_sistema(sistema: SistemaConstrutivo) -> dict[str, Any]:
    camadas_out = []
    for c in sistema.camadas:
        esp_cm = round(c.espessura * 100.0, 2) if c.espessura is not None else None
        camadas_out.append({
            "id": c.id,
            "ordem": c.ordem,
            "material_id": c.material_id,
            "variacao_id": c.variacao_id,
            "material_nome": c.material.nome if c.material else None,
            "espessura": c.espessura,
            "espessura_cm": esp_cm,
            "posicao": c.posicao
        })

    dados_acusticos_out = []
    for d in sistema.dados_acusticos:
        dados_acusticos_out.append({
            "id": d.id,
            "tipo_ruido": d.tipo_ruido,
            "r": d.r,
            "rw": d.rw,
            "ln": d.ln,
            "ln_w": d.ln_w,
            "l_nt_w": d.l_nt_w,
            "delta_lw": d.delta_lw,
            "rigidez_dinamica": d.rigidez_dinamica,
            "norma_ensaio": d.norma_ensaio,
            "condicao_ensaio": d.condicao_ensaio,
            "confiabilidade": d.confiabilidade,
            "fonte": d.fonte
        })

    return {
        "id": sistema.id,
        "codigo": sistema.codigo,
        "nome": sistema.nome,
        "tipo_elemento": sistema.tipo_elemento,
        "descricao": sistema.descricao,
        "espessura_total": sistema.espessura_total,
        "massa_superficial_total": sistema.massa_superficial_total,
        "camadas": camadas_out,
        "dados_acusticos": dados_acusticos_out
    }


@router.get("/sistemas", response_model=list[SistemaOut])
def listar_sistemas(
    tipo_elemento: str | None = Query(None, description="Filtrar por 'parede' ou 'piso_laje'"),
    db: Session = Depends(get_db)
):
    """Lista todos os sistemas construtivos documentados no catálogo."""
    query = (
        db.query(SistemaConstrutivo)
        .options(
            joinedload(SistemaConstrutivo.camadas),
            joinedload(SistemaConstrutivo.dados_acusticos)
        )
    )
    if tipo_elemento:
        query = query.filter(SistemaConstrutivo.tipo_elemento == tipo_elemento)

    sistemas = query.all()
    return [_formatar_sistema(s) for s in sistemas]


@router.get("/sistemas/{codigo}", response_model=SistemaOut)
def obter_sistema_por_codigo(codigo: str, db: Session = Depends(get_db)):
    """Retorna os detalhes completos, camadas, ensaios e fontes de um sistema pelo código (ex: PAR-CER-014)."""
    sistema = (
        db.query(SistemaConstrutivo)
        .options(
            joinedload(SistemaConstrutivo.camadas),
            joinedload(SistemaConstrutivo.dados_acusticos)
        )
        .filter(SistemaConstrutivo.codigo == codigo.upper())
        .first()
    )
    if not sistema:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Sistema com código '{codigo}' não encontrado no catálogo."
        )
    return _formatar_sistema(sistema)


@router.post("/sistemas/montar", response_model=dict[str, Any])
def montar_sistema_personalizado(request: MontarSistemaRequest, db: Session = Depends(get_db)):
    """
    Recebe uma composição de camadas personalizadas:
    - Valida cada camada e espessura informada;
    - Calcula espessura total e massa superficial (se as densidades forem conhecidas);
    - Verifica se existe correspondência exata documentada no banco;
    - Retorna dados físicos e acústicos documentados sem inventar estimativas arbitrárias.
    """
    if not request.camadas:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail="Informe ao menos uma camada para montar o sistema."
        )

    camadas_dict = [c.model_dump() for c in request.camadas]
    try:
        propriedades = resolver_propriedades_camadas(camadas_dict, db=db)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail=str(e)
        ) from e

    # Verifica correspondência documental exata
    sistema_correspondente = buscar_correspondencia_exata(propriedades["camadas"], db=db)

    dados_acusticos_list = []
    fontes = []
    limitacoes = []

    if sistema_correspondente:
        for da in sistema_correspondente.dados_acusticos:
            dados_acusticos_list.append({
                "tipo_ruido": da.tipo_ruido,
                "rw": da.rw,
                "ln_w": da.ln_w,
                "delta_lw": da.delta_lw,
                "norma_ensaio": da.norma_ensaio,
                "confiabilidade": da.confiabilidade,
                "fonte": da.fonte
            })
            if da.fonte not in fontes:
                fontes.append(da.fonte)
        status_correspondencia = "correspondencia_exata_encontrada"
        sistema_info = {
            "codigo": sistema_correspondente.codigo,
            "nome": sistema_correspondente.nome,
            "tipo_elemento": sistema_correspondente.tipo_elemento
        }
    else:
        status_correspondencia = "sem_correspondencia_exata"
        sistema_info = None
        limitacoes.append("Não existe ensaio acústico documentado no catálogo para esta composição exata.")
        if not propriedades["massa_completa"]:
            limitacoes.append("Uma ou mais camadas não possuem densidade documentada; massa superficial total não pôde ser calculada.")

    return {
        "status": status_correspondencia,
        "espessura_total_cm": propriedades["espessura_total_cm"],
        "espessura_total_m": propriedades["espessura_total_m"],
        "massa_superficial_total": propriedades["massa_superficial_total"],
        "massa_completa": propriedades["massa_completa"],
        "camadas": propriedades["camadas"],
        "sistema_correspondente": sistema_info,
        "dados_acusticos": dados_acusticos_list,
        "fontes": fontes,
        "limitacoes": limitacoes
    }

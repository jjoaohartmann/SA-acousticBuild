"""Motor de Cálculo Acústico Técnico - AcousticBuild.

Implementa o fluxo de decisão estrito da Fase 0 e Fase 3 do Relatório Mestre:
1. Distinção rigorosa entre grandezas (R != Rw, DnT != DnT,w).
2. Não assume valores arbitrários (null != 0).
3. Propriedades físicas (densidade, espessura, massa superficial) != dados acústicos (Rw, Ln,w).
4. Sem "sistema parecido" (não herda desempenho acústico de outros sistemas).
5. Estrutura de resposta padronizada com:
   resultado, método, confiabilidade, composição, fontes, limitacoes.
"""
from __future__ import annotations

import math
from typing import Any

from database import SessionLocal
from formatar import num
from models import (
    DadoAcustico,
    Material,
    SistemaConstrutivo,
    VariacaoMaterial,
)

T0 = 0.5   # s (tempo de reverberação de referência NBR 15575 / ISO 16283)
A0 = 10.0  # m² (área de absorção equivalente de referência ISO 717-2)
K  = 0.16  # s/m (constante de Sabine)
F_REFERENCIA = 500.0  # Hz — banda em que a lei da massa é avaliada (ISO 717-1)


def _fontes_das_densidades(composicao: list[dict[str, Any]]) -> list[str]:
    """Fontes das densidades usadas, uma linha por material, sem repetir.

    A massa superficial vem das densidades das camadas; quando não há ensaio,
    o resultado inteiro depende delas. Declarar a origem aqui evita um relatório
    que cita o modelo teórico mas esconde de onde vieram os números de entrada.
    """
    vistos: dict[str, str] = {}
    for camada in composicao:
        fonte = camada.get("fonte_densidade")
        nome = camada.get("material_nome")
        if fonte and nome and nome not in vistos:
            vistos[nome] = fonte
    return [f"Densidade de {nome}: {fonte}" for nome, fonte in vistos.items()]


def calcular_absorcao_sabine(volume: float, tempo_reverb: float) -> float:
    """Calcula a absorção equivalente pela fórmula de Sabine: A = 0.16 * V / T."""
    if tempo_reverb <= 0:
        raise ValueError("Tempo de reverberação deve ser estritamente maior que zero.")
    if volume <= 0:
        raise ValueError("Volume do receptor deve ser estritamente maior que zero.")
    return K * volume / tempo_reverb


def resolver_propriedades_camadas(
    camadas_input: list[dict[str, Any]],
    db: Any | None = None
) -> dict[str, Any]:
    """
    Calcula espessura total e massa superficial total a partir de uma lista de camadas.
    Regra central: se uma camada não possui densidade documentada nem massa superficial,
    massa superficial total = None (null != 0).
    """
    should_close_db = False
    if db is None:
        db = SessionLocal()
        should_close_db = True

    try:
        espessura_total = 0.0
        massa_superficial_total = 0.0
        possui_massa_completa = True
        camadas_detalhadas = []

        for idx, cam in enumerate(camadas_input):
            mat_id = cam.get("material_id")
            var_id = cam.get("variacao_id")
            esp = cam.get("espessura")  # metros
            if esp is None and cam.get("espessura_cm") is not None:
                esp = float(cam["espessura_cm"]) / 100.0

            material = None
            variacao = None

            if var_id:
                variacao = db.query(VariacaoMaterial).filter(VariacaoMaterial.id == var_id).first()
                if variacao:
                    material = variacao.material
                    if esp is None:
                        esp = variacao.espessura

            if material is None and mat_id:
                material = db.query(Material).filter(Material.id == mat_id).first()

            nome_mat = material.nome if material else cam.get("material_nome", f"Camada {idx + 1}")
            densidade = material.densidade if material else cam.get("densidade")

            # Validação de espessura
            if esp is not None:
                if esp <= 0:
                    raise ValueError(f"Espessura da camada '{nome_mat}' deve ser maior que zero (recebido: {esp}).")
                espessura_total += float(esp)
            else:
                espessura_total = None  # Espessura total fica indeterminada se faltar espessura

            # Cálculo de massa superficial da camada
            massa_camada = None
            if variacao and variacao.massa_superficial is not None:
                massa_camada = float(variacao.massa_superficial)
            elif densidade is not None and esp is not None:
                massa_camada = float(densidade) * float(esp)

            if massa_camada is not None and possui_massa_completa:
                massa_superficial_total += massa_camada
            else:
                possui_massa_completa = False

            # A origem da densidade viaja junto com a camada: sem ensaio, o
            # resultado inteiro se apoia nela, e ela precisa ser rastreável.
            fonte_densidade = None
            if variacao is not None and getattr(variacao, "fonte", None):
                fonte_densidade = variacao.fonte
            elif material is not None and getattr(material, "fonte", None):
                fonte_densidade = material.fonte

            camadas_detalhadas.append({
                "ordem": idx + 1,
                "material_id": material.id if material else mat_id,
                "material_nome": nome_mat,
                "espessura_m": round(esp, 4) if esp is not None else None,
                "espessura_cm": round(esp * 100.0, 2) if esp is not None else None,
                "densidade": densidade,
                "fonte_densidade": fonte_densidade,
                "massa_superficial_camada": round(massa_camada, 2) if massa_camada is not None else None,
                "posicao": cam.get("posicao")
            })

        return {
            "espessura_total_m": round(espessura_total, 4) if espessura_total is not None else None,
            "espessura_total_cm": round(espessura_total * 100.0, 2) if espessura_total is not None else None,
            "massa_superficial_total": round(massa_superficial_total, 2) if possui_massa_completa else None,
            "camadas": camadas_detalhadas,
            "massa_completa": possui_massa_completa
        }
    finally:
        if should_close_db:
            db.close()


def buscar_correspondencia_exata(
    camadas_resolvidas: list[dict[str, Any]],
    db: Any
) -> SistemaConstrutivo | None:
    """
    Verifica se a composição fornecida corresponde EXATAMENTE a algum sistema cadastrado.
    Regra 12: NÃO aproximar sistemas por semelhança! Exige correspondência exata
    de quantidade de camadas, materiais e espessuras (tolerância de 5 mm).
    """
    if not camadas_resolvidas:
        return None

    qtd_camadas = len(camadas_resolvidas)
    # Filtra sistemas com mesma quantidade de camadas
    candidatos = (
        db.query(SistemaConstrutivo)
        .join(SistemaConstrutivo.camadas)
        .all()
    )

    for sistema in candidatos:
        if len(sistema.camadas) != qtd_camadas:
            continue

        correspondencia = True
        for i, camada_db in enumerate(sistema.camadas):
            camada_usr = camadas_resolvidas[i]
            # Mesma identificação de material
            if camada_db.material_id != camada_usr.get("material_id"):
                correspondencia = False
                break
            # Mesma espessura aproximada (tolerância ± 5 mm = 0.005 m)
            esp_db = camada_db.espessura or 0.0
            esp_usr = camada_usr.get("espessura_m") or 0.0
            if abs(esp_db - esp_usr) > 0.005:
                correspondencia = False
                break

        if correspondencia:
            return sistema

    return None


def executar_calculo_motor(dados: dict[str, Any], db: Any | None = None) -> dict[str, Any]:
    """
    Executa o cálculo acústico seguindo rigorosamente a matriz de decisão da Fase 0.
    """
    should_close_db = False
    if db is None:
        db = SessionLocal()
        should_close_db = True

    try:
        tipo_analise = str(dados.get("tipo_analise") or "aereo").lower()
        if tipo_analise in ("dnt", "aereo"):
            tipo_analise = "aereo"
        elif tipo_analise in ("lnt", "impacto"):
            tipo_analise = "impacto"

        # 1. Parâmetros do ambiente receptor
        S = dados.get("area_elemento") or dados.get("s")
        V = dados.get("volume_receptor") or dados.get("v")
        T = dados.get("reverberacao") or dados.get("t") or dados.get("t2")

        if S is None or float(S) <= 0:
            raise ValueError("Área do elemento separador (S) deve ser maior que zero.")
        if float(S) > 500.0:
            raise ValueError("Área do elemento (S) acima de 500 m² foge da faixa prevista pela ISO 12354-1.")
        if V is None or float(V) <= 0:
            raise ValueError("Volume do receptor (V) deve ser maior que zero.")
        if float(V) > 10000.0:
            raise ValueError("Volume do receptor (V) acima de 10.000 m³ foge da faixa de aplicação do modelo.")
        if T is None or float(T) <= 0:
            raise ValueError("Tempo de reverberação (T) deve ser maior que zero.")
        if not (0.1 <= float(T) <= 5.0):
            raise ValueError("Tempo de reverberação (T) deve ficar entre 0,1 s e 5,0 s — fora disso o valor não é fisicamente plausível para ambientes construídos.")

        S = float(S)
        V = float(V)
        T = float(T)
        A = calcular_absorcao_sabine(V, T)

        # 2. Verificar se há Override Manual ou Medição Direta
        L1 = dados.get("l1")
        L2 = dados.get("l2")
        Li = dados.get("nivel_impacto") or dados.get("li")
        R_manual = dados.get("reducao_sonora") or dados.get("r")

        # CASO A: Medição in situ de ruído aéreo com L1 e L2
        if tipo_analise == "aereo" and L1 is not None and L2 is not None:
            L1 = float(L1)
            L2 = float(L2)
            if L1 <= 0 or L2 <= 0:
                raise ValueError("Níveis de pressão sonora medidos L1 e L2 devem ser maiores que zero.")
            if not (20.0 <= L1 <= 140.0) or not (0.0 < L2 <= 140.0):
                raise ValueError("Níveis medidos fora da faixa plausível (20 a 140 dB). Verifique a leitura do sonômetro.")
            if L2 > L1:
                raise ValueError("O nível no ambiente receptor (L2) não pode ser maior que o do emissor (L1).")

            DnT = (L1 - L2) + 10.0 * math.log10(T / T0)
            R_aparente = (L1 - L2) + 10.0 * math.log10(S / A)

            return {
                "tipo": "aereo",
                "resultado": {
                    "indicador_principal": {
                        "nome": "DnT",
                        "descricao": "Diferença de nível padronizada in situ",
                        "valor": round(DnT, 2),
                        "valor_exato": DnT,
                        "unidade": "dB",
                    },
                    "indicador_secundario": {
                        "nome": "R'",
                        "descricao": "Índice de redução sonora aparente in situ",
                        "valor": round(R_aparente, 2),
                        "valor_exato": R_aparente,
                        "unidade": "dB",
                    }
                },
                "metodo": {
                    "nome": "Medição in situ de isolamento aéreo",
                    "norma": "ABNT NBR ISO 16283-1 / ISO 717-1",
                    "equacao": "DnT = (L1 - L2) + 10*log10(T / T0)"
                },
                "confiabilidade": "medicao_usuario",
                "origem": "Resultado baseado em medição informada pelo usuário",
                "composicao": [],
                "propriedades_fisicas": {},
                "fontes": ["Medição in situ realizada e informada pelo usuário"],
                "limitacoes": [
                    "Resultado calculado diretamente a partir dos níveis de pressão sonora informados.",
                    "A confiabilidade depende da calibração dos equipamentos e conformidade com o procedimento da ISO 16283-1."
                ],
                "detalhes": {
                    "dnt": round(DnT, 2),
                    "r": round(R_aparente, 2),
                    "l1": L1,
                    "l2": L2,
                    "s": S,
                    "v": V,
                    "t": T,
                    "absorcao_equivalente": round(A, 2),
                    "modo": "medicao"
                }
            }

        # CASO B: Medição in situ de ruído de impacto com máquina de percussão (Li medido)
        if tipo_analise == "impacto" and Li is not None:
            Li = float(Li)
            if Li <= 0:
                raise ValueError("Nível de impacto Li medido deve ser maior que zero.")

            LnT = Li - 10.0 * math.log10(T / T0)
            Ln = Li + 10.0 * math.log10(A / A0)

            return {
                "tipo": "impacto",
                "resultado": {
                    "indicador_principal": {
                        "nome": "L'nT",
                        "descricao": "Nível de pressão sonora de impacto padronizado in situ",
                        "valor": round(LnT, 2),
                        "valor_exato": LnT,
                        "unidade": "dB",
                    },
                    "indicador_secundario": {
                        "nome": "L'n",
                        "descricao": "Nível de pressão sonora de impacto normalizado in situ",
                        "valor": round(Ln, 2),
                        "valor_exato": Ln,
                        "unidade": "dB",
                    }
                },
                "metodo": {
                    "nome": "Medição in situ de ruído de impacto com máquina de percussão padronizada",
                    "norma": "ABNT NBR ISO 16283-2 / ISO 717-2",
                    "equacao": "L'nT = Li - 10*log10(T / T0)"
                },
                "confiabilidade": "medicao_usuario",
                "origem": "Resultado baseado em medição informada pelo usuário",
                "composicao": [],
                "propriedades_fisicas": {},
                "fontes": ["Medição in situ com máquina de percussão padronizada informada pelo usuário"],
                "limitacoes": [
                    "Resultado obtido diretamente do nível de impacto Li informado pelo usuário.",
                    "Requer posicionamento normativo de fontes e microfones conforme ISO 16283-2."
                ],
                "detalhes": {
                    "lnt": round(LnT, 2),
                    "ln": round(Ln, 2),
                    "li": Li,
                    "s": S,
                    "v": V,
                    "t": T,
                    "absorcao_equivalente": round(A, 2),
                    "modo": "medicao"
                }
            }

        # CASO C: Valor manual de Rw ou R informado pelo usuário
        if tipo_analise == "aereo" and R_manual is not None:
            R_val = float(R_manual)
            if R_val <= 0:
                raise ValueError("Redução sonora R informada deve ser maior que zero.")
            if R_val > 80.0:
                raise ValueError("Redução sonora R acima de 80 dB não é alcançável por sistemas construtivos reais. Confira o valor do catálogo.")

            L1_base = float(L1) if L1 is not None else 85.0
            L2_previsto = L1_base - R_val + 10.0 * math.log10(S / A)
            DnT = (L1_base - L2_previsto) + 10.0 * math.log10(T / T0)

            return {
                "tipo": "aereo",
                "resultado": {
                    "indicador_principal": {
                        "nome": "DnT",
                        "descricao": "Diferença de nível padronizada estimada",
                        "valor": round(DnT, 2),
                        "valor_exato": DnT,
                        "unidade": "dB",
                    },
                    "indicador_secundario": {
                        "nome": "R",
                        "descricao": "Índice de redução sonora informado",
                        "valor": round(R_val, 2),
                        "valor_exato": R_val,
                        "unidade": "dB",
                    }
                },
                "metodo": {
                    "nome": "Previsão acústica baseada em valor de R informado pelo usuário",
                    "norma": "EN 12354-1 / ISO 16283-1",
                    "equacao": "L2 = L1 - R + 10*log10(S / A); DnT = (L1 - L2) + 10*log10(T / T0)"
                },
                "confiabilidade": "informado_usuario",
                "origem": "Valor acústico informado diretamente pelo usuário",
                "composicao": [],
                "propriedades_fisicas": {},
                "fontes": ["Valor informado manualmente pelo usuário"],
                "limitacoes": [
                    "O cálculo assume que o valor informado de R corresponde ao índice de redução sonora do elemento.",
                    "Não foram consideradas perdas por flancos marginais de obra."
                ],
                "detalhes": {
                    "dnt": round(DnT, 2),
                    "l2_previsto": round(L2_previsto, 2),
                    "r": round(R_val, 2),
                    "l1": L1_base,
                    "s": S,
                    "v": V,
                    "t": T,
                    "absorcao_equivalente": round(A, 2),
                    "modo": "previsao"
                }
            }

        # 3. Análise Construtiva (Sistema Cadastrado OU Camadas Personalizadas)
        sistema_db = None
        codigo_sistema = dados.get("sistema_codigo") or dados.get("codigo")
        sistema_id = dados.get("sistema_id")

        if codigo_sistema:
            sistema_db = db.query(SistemaConstrutivo).filter(SistemaConstrutivo.codigo == codigo_sistema).first()
            if sistema_db is None:
                raise ValueError(f"Sistema construtivo '{codigo_sistema}' não existe no catálogo.")
        elif sistema_id:
            sistema_db = db.query(SistemaConstrutivo).filter(SistemaConstrutivo.id == int(sistema_id)).first()
            if sistema_db is None:
                raise ValueError(f"Sistema construtivo de id {sistema_id} não existe no catálogo.")

        camadas_input = dados.get("camadas")
        propriedades_fisicas = {}
        composicao_detalhada = []

        if sistema_db:
            # Reconstrói a composição a partir do sistema cadastrado
            camadas_input = [
                {
                    "material_id": c.material_id,
                    "variacao_id": c.variacao_id,
                    "espessura": c.espessura,
                    "posicao": c.posicao
                }
                for c in sistema_db.camadas
            ]
            propriedades_fisicas = resolver_propriedades_camadas(camadas_input, db)
            composicao_detalhada = propriedades_fisicas["camadas"]
        elif camadas_input:
            propriedades_fisicas = resolver_propriedades_camadas(camadas_input, db)
            composicao_detalhada = propriedades_fisicas["camadas"]
            # Tenta correspondência exata
            sistema_db = buscar_correspondencia_exata(composicao_detalhada, db)

        # 4. Cálculo com Sistema Documentado Correspondente
        if sistema_db:
            dado_acustico = (
                db.query(DadoAcustico)
                .filter(
                    DadoAcustico.sistema_id == sistema_db.id,
                    DadoAcustico.tipo_ruido == tipo_analise
                )
                .first()
            )

            if dado_acustico:
                if tipo_analise == "aereo" and dado_acustico.rw is not None:
                    rw = float(dado_acustico.rw)
                    # ISO 16283-1 / ISO 717-1:
                    #   D   = R - 10*log10(S / A)      (diferença de nível bruta)
                    #   DnT = D + 10*log10(T / T0)     (padronizada)
                    # => DnT,w = Rw - 10*log10(S / A) + 10*log10(T / T0)
                    # Sala mais absorvente (A maior) => menos som acumulado => DnT maior.
                    dnt_w = rw - 10.0 * math.log10(S / A) + 10.0 * math.log10(T / T0)

                    return {
                        "tipo": "aereo",
                        "resultado": {
                            "indicador_principal": {
                                "nome": "DnT,w",
                                "descricao": "Diferença de nível padronizada ponderada estimada",
                                "valor": round(dnt_w, 2),
                                "valor_exato": dnt_w,
                                "unidade": "dB",
                            },
                            "indicador_secundario": {
                                "nome": "Rw",
                                "descricao": "Índice de redução sonora ponderado documentado",
                                "valor": round(rw, 2),
                                "valor_exato": rw,
                                "unidade": "dB",
                            }
                        },
                        "metodo": {
                            "nome": "Previsão simplificada em campo baseada em ensaio de laboratório",
                            "norma": dado_acustico.norma_ensaio or "ABNT NBR ISO 12354-1 / ISO 717-1",
                            "equacao": "DnT,w ≈ Rw - 10*log10(S / A) + 10*log10(T / T0)"
                        },
                        "confiabilidade": dado_acustico.confiabilidade or "ensaio_laboratorio",
                        "origem": f"Resultado baseado em ensaio documentado do sistema ({sistema_db.codigo})",
                        "sistema_utilizado": {
                            "codigo": sistema_db.codigo,
                            "nome": sistema_db.nome,
                            "tipo": sistema_db.tipo_elemento
                        },
                        "composicao": composicao_detalhada,
                        "propriedades_fisicas": {
                            "espessura_total_cm": propriedades_fisicas.get("espessura_total_cm"),
                            "massa_superficial_kg_m2": propriedades_fisicas.get("massa_superficial_total")
                        },
                        "fontes": [dado_acustico.fonte],
                        "limitacoes": [
                            "O cálculo utiliza o Rw ensaiado em laboratório e assume transmissão direta sem perdas laterais de flanco (flanking transmission).",
                            "A NBR 15575 estabelece critérios para DnT,w em campo; desvios de execução em obra podem reduzir o isolamento real.",
                            f"Ensaio de referência: {dado_acustico.fonte}."
                        ],
                        "detalhes": {
                            "dnt": round(dnt_w, 2),
                            "rw": round(rw, 2),
                            "s": S,
                            "v": V,
                            "t": T,
                            "absorcao_equivalente": round(A, 2),
                            "modo": "previsao_sistema"
                        }
                    }

                elif tipo_analise == "impacto" and dado_acustico.ln_w is not None:
                    ln_w = float(dado_acustico.ln_w)
                    # ISO 16283-2 / ISO 717-2:
                    #   Ln  = Li + 10*log10(A / A0)   =>  Li = Ln - 10*log10(A / A0)
                    #   LnT = Li - 10*log10(T / T0)
                    # => L'nT,w = Ln,w - 10*log10(A / A0) - 10*log10(T / T0)
                    l_nt_w = ln_w - 10.0 * math.log10(A / A0) - 10.0 * math.log10(T / T0)

                    return {
                        "tipo": "impacto",
                        "resultado": {
                            "indicador_principal": {
                                "nome": "L'nT,w",
                                "descricao": "Nível de pressão sonora de impacto padronizado ponderado",
                                "valor": round(l_nt_w, 2),
                                "valor_exato": l_nt_w,
                                "unidade": "dB",
                            },
                            "indicador_secundario": {
                                "nome": "Ln,w",
                                "descricao": "Nível de pressão de impacto ponderado de laboratório",
                                "valor": round(ln_w, 2),
                                "valor_exato": ln_w,
                                "unidade": "dB",
                            }
                        },
                        "metodo": {
                            "nome": "Previsão simplificada in situ de ruído de impacto",
                            "norma": dado_acustico.norma_ensaio or "ABNT NBR ISO 12354-2 / ISO 717-2",
                            "equacao": "L'nT,w ≈ Ln,w - 10*log10(A / A0) - 10*log10(T / T0)"
                        },
                        "confiabilidade": dado_acustico.confiabilidade or "documentado",
                        "origem": f"Resultado baseado em ensaio/dado documentado ({sistema_db.codigo})",
                        "sistema_utilizado": {
                            "codigo": sistema_db.codigo,
                            "nome": sistema_db.nome,
                            "tipo": sistema_db.tipo_elemento
                        },
                        "composicao": composicao_detalhada,
                        "propriedades_fisicas": {
                            "espessura_total_cm": propriedades_fisicas.get("espessura_total_cm"),
                            "massa_superficial_kg_m2": propriedades_fisicas.get("massa_superficial_total"),
                            "delta_lw": dado_acustico.delta_lw
                        },
                        "fontes": [dado_acustico.fonte],
                        "limitacoes": [
                            "Previsão direta a partir de ensaio padronizado de laboratório.",
                            "Pontes de rigidez acústica perimetrais no contrapiso flutuante podem degradar o isolamento in situ."
                        ],
                        "detalhes": {
                            "lnt": round(l_nt_w, 2),
                            "ln_w": round(ln_w, 2),
                            "s": S,
                            "v": V,
                            "t": T,
                            "absorcao_equivalente": round(A, 2),
                            "modo": "previsao_impacto"
                        }
                    }

        # 5. Composição Personalizada SEM Correspondência Documentada
        massa_total = propriedades_fisicas.get("massa_superficial_total")

        # A lei da massa vale para o elemento que vibra como UM corpo só. Isso inclui
        # várias camadas rígidas coladas entre si (bloco + argamassa dos dois lados, por
        # exemplo) — o que importa é a massa superficial somada, não o número de camadas.
        #
        # Já uma camada leve/resiliente (lã de vidro, manta) desacopla as faces e cria um
        # sistema massa-mola-massa, cujo comportamento a lei da massa NÃO descreve. Nesse
        # caso o cálculo continua exigindo ensaio.
        DENSIDADE_MIN_RIGIDA = 100.0  # kg/m³ — abaixo disso a camada é resiliente/cavidade

        camadas_resilientes = [
            c for c in composicao_detalhada
            if c.get("densidade") is not None and float(c["densidade"]) < DENSIDADE_MIN_RIGIDA
        ]
        densidade_desconhecida = any(c.get("densidade") is None for c in composicao_detalhada)
        elemento_monolitico = (
            len(composicao_detalhada) >= 1
            and not camadas_resilientes
            and not densidade_desconhecida
        )

        if tipo_analise == "aereo" and elemento_monolitico and massa_total is not None and massa_total > 10.0:
            # Lei da massa avaliada na banda de referência de 500 Hz:
            #   R = 20*log10(m' * f) - 47   =>   R(500 Hz) = 20*log10(m') + 6,98
            # A constante fica escrita como a conta que a origina, para não
            # poder divergir da fórmula citada (antes era +10, sem origem).
            rw_estimado = 20.0 * math.log10(massa_total) + (
                20.0 * math.log10(F_REFERENCIA) - 47.0
            )
            # mesma relação normativa dos demais caminhos (ISO 16283-1):
            # DnT = R - 10*log10(S / A) + 10*log10(T / T0)
            dnt_w = rw_estimado - 10.0 * math.log10(S / A) + 10.0 * math.log10(T / T0)

            return {
                "tipo": "aereo",
                "resultado": {
                    "indicador_principal": {
                        "nome": "DnT,w (Estimado)",
                        "descricao": "Diferença de nível padronizada teórica aproximada",
                        "valor": round(dnt_w, 2),
                        "valor_exato": dnt_w,
                        "unidade": "dB",
                    },
                    "indicador_secundario": {
                        "nome": "Rw (Teórico)",
                        "descricao": "Índice de redução sonora estimado pela Lei da Massa",
                        "valor": round(rw_estimado, 2),
                        "valor_exato": rw_estimado,
                        "unidade": "dB",
                    }
                },
                "metodo": {
                    "nome": "Estimativa teórica simplificada por Lei da Massa",
                    "norma": "Formulação acústica clássica para painéis simples homogêneos",
                    "equacao": (
                        "Rw ≈ 20*log10(m') + (20*log10(500) − 47) = 20*log10(m') + 6,98; "
                        "DnT,w ≈ Rw − 10*log10(S/A) + 10*log10(T/T0)"
                    )
                },
                "confiabilidade": "estimativa_teorica",
                "origem": "Resultado estimado via modelo teórico (Lei da Massa)",
                "composicao": composicao_detalhada,
                "propriedades_fisicas": {
                    "espessura_total_cm": propriedades_fisicas.get("espessura_total_cm"),
                    "massa_superficial_kg_m2": round(massa_total, 2)
                },
                # Sem ensaio, o resultado repousa sobre as densidades das camadas:
                # elas entram nas fontes junto com o modelo.
                "fontes": [
                    "Lei da massa (R = 20·log10(m'·f) − 47) avaliada em 500 Hz — modelo teórico, não é ensaio",
                    *_fontes_das_densidades(composicao_detalhada),
                ],
                "limitacoes": [
                    "Não existe ensaio acústico de laboratório documentado para esta composição específica.",
                    f"O resultado é uma estimativa teórica aproximada calculada a partir da massa superficial ({num(massa_total, 1)} kg/m²).",
                    (
                        f"A composição tem {len(composicao_detalhada)} camadas rígidas coladas entre si; "
                        "elas foram tratadas como um único elemento vibrando em conjunto. "
                        "Se houver qualquer descolamento ou cavidade de ar na execução, o desempenho real será diferente."
                    ) if len(composicao_detalhada) > 1 else
                    "Elemento tratado como camada única homogênea.",
                    "Modelos analíticos não consideram ressonâncias estruturais, amortecimento ou frequência crítica.",
                    "Esta estimativa serve apenas para anteprojeto e não substitui ensaios ou laudos acústicos."
                ],
                "detalhes": {
                    "dnt": round(dnt_w, 2),
                    "rw": round(rw_estimado, 2),
                    "s": S,
                    "v": V,
                    "t": T,
                    "absorcao_equivalente": round(A, 2),
                    "modo": "estimativa_massa"
                }
            }

        # Caso Sem Dado Acústico Documentado e Sem Modelo Teórico Confiável
        return {
            "tipo": tipo_analise,
            "resultado": None,
            "metodo": {
                "nome": "Cálculo suspenso por falta de dado acústico documentado",
                "norma": "Princípio da AcousticBuild: dado acústico desconhecido não é inventado"
            },
            "confiabilidade": "sem_dado",
            "origem": "Sistema sem dados acústicos documentados disponíveis",
            "composicao": composicao_detalhada,
            "propriedades_fisicas": {
                "espessura_total_cm": propriedades_fisicas.get("espessura_total_cm"),
                "massa_superficial_kg_m2": propriedades_fisicas.get("massa_superficial_total")
            },
            "fontes": [],
            "limitacoes": [
                "Não existe dado acústico documentado no banco para esta composição personalizada.",
                "Sistemas multicamadas sem ensaio de referência não admitem estimativa acústica confiável por formulações simples.",
                "A calculadora calculou as propriedades físicas do elemento, mas não gera decibéis arbitrários sem fundamento experimental.",
                "Recomenda-se selecionar um dos sistemas construtivos documentados no catálogo ou fornecer o valor de ensaio do fabricante."
            ],
            "detalhes": {
                "s": S,
                "v": V,
                "t": T,
                "absorcao_equivalente": round(A, 2),
                "modo": "nao_determinado"
            }
        }
    finally:
        if should_close_db:
            db.close()

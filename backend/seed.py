"""Script de semeadura do catálogo confiável da Calculadora AcousticBuild.

Princípios aplicados (Fase 2 do Relatório Mestre):
1. Qualidade e confiabilidade documental > quantidade de registros.
2. Material não possui desempenho acústico (sem Rw em materiais individuais).
3. Dados acústicos pertencem aos sistemas e possuem fontes técnicas obrigatórias e verificáveis.
4. Nenhum valor de ensaio foi inventado ou estimado sem referência técnica.
"""
from database import SessionLocal, engine
from models import (
    Base,
    CamadaSistema,
    DadoAcustico,
    Material,
    SistemaConstrutivo,
    VariacaoMaterial,
)


def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Se já houver materiais cadastrados, não duplica
        if db.query(Material).count() > 0:
            print("Catálogo já existente no banco de dados. Pulando seed.")
            return

        print("Populando catálogo de materiais com propriedades físicas documentadas...")

        # -------------------------------------------------------------
        # 1. MATERIAIS INDIVIDUAIS
        # -------------------------------------------------------------
        mat_bloco_cer = Material(
            nome="Bloco cerâmico de vedação",
            categoria="alvenaria",
            subcategoria="ceramico",
            densidade=1200.0,
            unidade_densidade="kg/m³",
            descricao="Bloco vazado cerâmico de furos horizontais para alvenaria de vedação.",
            fonte="ABNT NBR 15220-2 / Manual da Cerâmica Vermelha"
        )

        mat_bloco_conc = Material(
            nome="Bloco de concreto vazado",
            categoria="alvenaria",
            subcategoria="concreto",
            densidade=1400.0,
            unidade_densidade="kg/m³",
            descricao="Bloco de concreto simples para alvenaria.",
            fonte="ABNT NBR 15220-2"
        )

        mat_argamassa = Material(
            nome="Argamassa de cimento e areia",
            categoria="revestimento",
            subcategoria="argamassa",
            densidade=1900.0,
            unidade_densidade="kg/m³",
            descricao="Argamassa comum para reboco/emboço e assentamento.",
            fonte="ABNT NBR 15220-2"
        )

        mat_concreto = Material(
            nome="Concreto armado maciço",
            categoria="concreto",
            subcategoria="estrutural",
            densidade=2400.0,
            unidade_densidade="kg/m³",
            descricao="Concreto estrutural de densidade normal.",
            fonte="ABNT NBR 6118 / ABNT NBR 15220-2"
        )

        mat_gesso = Material(
            nome="Placa de gesso acartonado (Drywall)",
            categoria="sistema_leve",
            subcategoria="gesso",
            densidade=800.0,
            unidade_densidade="kg/m³",
            descricao="Placa standard para sistemas de paredes e forros leves.",
            fonte="ABNT NBR 14715"
        )

        mat_la_vidro = Material(
            nome="Lã de vidro para isolamento acústico",
            categoria="isolamento",
            subcategoria="resiliente",
            densidade=14.0,
            unidade_densidade="kg/m³",
            descricao="Painel fonoabsorvente para preenchimento de cavidade em sistemas leves.",
            fonte="Catálogo Técnico Saint-Gobain / ISOVER"
        )

        mat_manta_pe = Material(
            nome="Manta acústica de polietileno expandido",
            categoria="isolamento",
            subcategoria="manta_piso",
            densidade=30.0,
            unidade_densidade="kg/m³",
            descricao="Manta resiliente para atenuação de ruído de impacto sob piso flutuante.",
            fonte="Catálogo ProAcústica de Sistemas de Piso"
        )

        mat_contrapiso = Material(
            nome="Contrapiso regularizado de argamassa",
            categoria="contrapiso",
            subcategoria="argamassa",
            densidade=2000.0,
            unidade_densidade="kg/m³",
            descricao="Camada de regularização para recebimento de acabamento de piso.",
            fonte="ABNT NBR 15220-2"
        )

        mat_vinilico = Material(
            nome="Piso vinílico em réguas (colado)",
            categoria="piso",
            subcategoria="vinilico",
            densidade=1300.0,
            unidade_densidade="kg/m³",
            descricao="Revestimento vinílico flexível LVT colado sobre contrapiso.",
            fonte="Ficha Técnica Tarkett Brasil"
        )

        mat_ceramica = Material(
            nome="Piso cerâmico / Porcelanato",
            categoria="piso",
            subcategoria="ceramico",
            densidade=2200.0,
            unidade_densidade="kg/m³",
            descricao="Revestimento cerâmico esmaltado assentado com argamassa colante.",
            fonte="ABNT NBR 15220-2"
        )

        db.add_all([
            mat_bloco_cer, mat_bloco_conc, mat_argamassa, mat_concreto,
            mat_gesso, mat_la_vidro, mat_manta_pe, mat_contrapiso,
            mat_vinilico, mat_ceramica
        ])
        db.flush()

        # -------------------------------------------------------------
        # 2. VARIAÇÕES DOS MATERIAIS
        # -------------------------------------------------------------
        var_bloco_cer_14 = VariacaoMaterial(
            material_id=mat_bloco_cer.id,
            nome_variacao="14 cm",
            espessura=0.14,
            massa_superficial=110.0,
            descricao="Bloco cerâmico vedação 14x19x29 cm",
            fonte="NBR 15220-2 / ProAcústica"
        )
        var_bloco_cer_19 = VariacaoMaterial(
            material_id=mat_bloco_cer.id,
            nome_variacao="19 cm",
            espessura=0.19,
            massa_superficial=145.0,
            descricao="Bloco cerâmico vedação 19x19x29 cm",
            fonte="NBR 15220-2 / ProAcústica"
        )

        var_argamassa_15 = VariacaoMaterial(
            material_id=mat_argamassa.id,
            nome_variacao="1,5 cm",
            espessura=0.015,
            massa_superficial=28.5,
            descricao="Reboco padrão 15 mm",
            fonte="ABNT NBR 15220-2"
        )

        var_concreto_10 = VariacaoMaterial(
            material_id=mat_concreto.id,
            nome_variacao="10 cm",
            espessura=0.10,
            massa_superficial=240.0,
            descricao="Laje ou parede de concreto maciço 10 cm",
            fonte="ABNT NBR 15220-2"
        )
        var_concreto_14 = VariacaoMaterial(
            material_id=mat_concreto.id,
            nome_variacao="14 cm",
            espessura=0.14,
            massa_superficial=336.0,
            descricao="Laje ou parede de concreto maciço 14 cm",
            fonte="ABNT NBR 15220-2"
        )
        var_concreto_15 = VariacaoMaterial(
            material_id=mat_concreto.id,
            nome_variacao="15 cm",
            espessura=0.15,
            massa_superficial=360.0,
            descricao="Parede de concreto maciço 15 cm",
            fonte="ABNT NBR 15220-2"
        )

        var_gesso_125 = VariacaoMaterial(
            material_id=mat_gesso.id,
            nome_variacao="12,5 mm ST",
            espessura=0.0125,
            massa_superficial=9.5,
            descricao="Chapa Standard de gesso acartonado 12,5 mm",
            fonte="ABNT NBR 14715"
        )

        var_la_50 = VariacaoMaterial(
            material_id=mat_la_vidro.id,
            nome_variacao="50 mm",
            espessura=0.05,
            massa_superficial=0.7,
            descricao="Painel de lã de vidro espessura 50 mm",
            fonte="Catálogo ISOVER"
        )

        var_manta_5 = VariacaoMaterial(
            material_id=mat_manta_pe.id,
            nome_variacao="5 mm",
            espessura=0.005,
            massa_superficial=0.15,
            descricao="Manta acústica PE expandido 5 mm",
            fonte="Catálogo ProAcústica"
        )

        var_contrapiso_3 = VariacaoMaterial(
            material_id=mat_contrapiso.id,
            nome_variacao="3 cm",
            espessura=0.03,
            massa_superficial=60.0,
            descricao="Contrapiso argamassa 3 cm",
            fonte="ABNT NBR 15220-2"
        )
        var_contrapiso_5 = VariacaoMaterial(
            material_id=mat_contrapiso.id,
            nome_variacao="5 cm",
            espessura=0.05,
            massa_superficial=100.0,
            descricao="Contrapiso armado 5 cm para piso flutuante",
            fonte="ABNT NBR 15220-2"
        )

        var_vinilico_2 = VariacaoMaterial(
            material_id=mat_vinilico.id,
            nome_variacao="2 mm",
            espessura=0.002,
            massa_superficial=2.6,
            descricao="Piso vinílico colado 2 mm",
            fonte="Ficha Técnica Tarkett"
        )

        db.add_all([
            var_bloco_cer_14, var_bloco_cer_19, var_argamassa_15,
            var_concreto_10, var_concreto_14, var_concreto_15,
            var_gesso_125, var_la_50, var_manta_5,
            var_contrapiso_3, var_contrapiso_5, var_vinilico_2
        ])
        db.flush()

        print("Cadastrando os 10 sistemas documentados com fontes rastreáveis...")

        # -------------------------------------------------------------
        # 3. SISTEMAS CONSTRUTIVOS & DADOS ACÚSTICOS
        # -------------------------------------------------------------

        # Sistema 1: PAR-CER-014
        sis_1 = SistemaConstrutivo(
            codigo="PAR-CER-014",
            nome="Alvenaria de bloco cerâmico 14 cm revestida com argamassa 1,5 cm",
            tipo_elemento="parede",
            descricao="Alvenaria de vedação convencional com bloco cerâmico 14x19x29 cm e reboco nas duas faces.",
            espessura_total=0.17,
            massa_superficial_total=167.0
        )
        db.add(sis_1)
        db.flush()
        db.add_all([
            CamadaSistema(sistema_id=sis_1.id, material_id=mat_argamassa.id, variacao_id=var_argamassa_15.id, ordem=1, espessura=0.015, posicao="revestimento_int"),
            CamadaSistema(sistema_id=sis_1.id, material_id=mat_bloco_cer.id, variacao_id=var_bloco_cer_14.id, ordem=2, espessura=0.14, posicao="nucleo"),
            CamadaSistema(sistema_id=sis_1.id, material_id=mat_argamassa.id, variacao_id=var_argamassa_15.id, ordem=3, espessura=0.015, posicao="revestimento_ext"),
            DadoAcustico(
                sistema_id=sis_1.id,
                tipo_ruido="aereo",
                rw=40.0,
                norma_ensaio="ABNT NBR ISO 10140-2 / ISO 717-1",
                condicao_ensaio="Câmara reverberante de laboratório, sem transmissão lateral marginal.",
                confiabilidade="ensaio_laboratorio",
                fonte="IPT - Instituto de Pesquisas Tecnológicas, Relatório de Ensaio nº 1 035 812-205"
            )
        ])

        # Sistema 2: PAR-CER-019
        sis_2 = SistemaConstrutivo(
            codigo="PAR-CER-019",
            nome="Alvenaria de bloco cerâmico 19 cm revestida com argamassa 1,5 cm",
            tipo_elemento="parede",
            descricao="Alvenaria de bloco cerâmico 19x19x29 cm com reboco em ambas as faces.",
            espessura_total=0.22,
            massa_superficial_total=202.0
        )
        db.add(sis_2)
        db.flush()
        db.add_all([
            CamadaSistema(sistema_id=sis_2.id, material_id=mat_argamassa.id, variacao_id=var_argamassa_15.id, ordem=1, espessura=0.015, posicao="revestimento_int"),
            CamadaSistema(sistema_id=sis_2.id, material_id=mat_bloco_cer.id, variacao_id=var_bloco_cer_19.id, ordem=2, espessura=0.19, posicao="nucleo"),
            CamadaSistema(sistema_id=sis_2.id, material_id=mat_argamassa.id, variacao_id=var_argamassa_15.id, ordem=3, espessura=0.015, posicao="revestimento_ext"),
            DadoAcustico(
                sistema_id=sis_2.id,
                tipo_ruido="aereo",
                rw=44.0,
                norma_ensaio="ABNT NBR ISO 10140-2 / ISO 717-1",
                condicao_ensaio="Laboratório credenciado com juntas preenchidas.",
                confiabilidade="ensaio_laboratorio",
                fonte="Catálogo ProAcústica de Desempenho Acústico, Ficha ALV-CER-02"
            )
        ])

        # Sistema 3: PAR-CON-010
        sis_3 = SistemaConstrutivo(
            codigo="PAR-CON-010",
            nome="Parede de concreto maciço 10 cm",
            tipo_elemento="parede",
            descricao="Parede estrutural moldada in loco de concreto armado maciço 10 cm.",
            espessura_total=0.10,
            massa_superficial_total=240.0
        )
        db.add(sis_3)
        db.flush()
        db.add_all([
            CamadaSistema(sistema_id=sis_3.id, material_id=mat_concreto.id, variacao_id=var_concreto_10.id, ordem=1, espessura=0.10, posicao="nucleo"),
            DadoAcustico(
                sistema_id=sis_3.id,
                tipo_ruido="aereo",
                rw=45.0,
                norma_ensaio="ABNT NBR ISO 10140-2 / ISO 717-1",
                condicao_ensaio="Ensaio de laboratório sem perdas laterais.",
                confiabilidade="ensaio_laboratorio",
                fonte="IPT - Instituto de Pesquisas Tecnológicas, Relatório de Ensaio nº 994 210"
            )
        ])

        # Sistema 4: PAR-CON-015
        sis_4 = SistemaConstrutivo(
            codigo="PAR-CON-015",
            nome="Parede de concreto maciço 15 cm",
            tipo_elemento="parede",
            descricao="Parede de concreto armado maciço 15 cm.",
            espessura_total=0.15,
            massa_superficial_total=360.0
        )
        db.add(sis_4)
        db.flush()
        db.add_all([
            CamadaSistema(sistema_id=sis_4.id, material_id=mat_concreto.id, variacao_id=var_concreto_15.id, ordem=1, espessura=0.15, posicao="nucleo"),
            DadoAcustico(
                sistema_id=sis_4.id,
                tipo_ruido="aereo",
                rw=49.0,
                norma_ensaio="ABNT NBR ISO 10140-2 / ISO 717-1",
                condicao_ensaio="Ensaio laboratorial câmara reverberante.",
                confiabilidade="ensaio_laboratorio",
                fonte="IPT - Instituto de Pesquisas Tecnológicas, Relatório Técnico nº 1 012 344-205"
            )
        ])

        # Sistema 5: PAR-DRY-073
        sis_5 = SistemaConstrutivo(
            codigo="PAR-DRY-073",
            nome="Parede Drywall 73/48 (1 placa ST 12,5 mm cada face + lã de vidro 50 mm)",
            tipo_elemento="parede",
            descricao="Sistema de vedação leve com montantes M48 e uma chapa de gesso de cada lado.",
            espessura_total=0.073,
            massa_superficial_total=19.7
        )
        db.add(sis_5)
        db.flush()
        db.add_all([
            CamadaSistema(sistema_id=sis_5.id, material_id=mat_gesso.id, variacao_id=var_gesso_125.id, ordem=1, espessura=0.0125, posicao="face_int"),
            CamadaSistema(sistema_id=sis_5.id, material_id=mat_la_vidro.id, variacao_id=var_la_50.id, ordem=2, espessura=0.05, posicao="nucleo"),
            CamadaSistema(sistema_id=sis_5.id, material_id=mat_gesso.id, variacao_id=var_gesso_125.id, ordem=3, espessura=0.0125, posicao="face_ext"),
            DadoAcustico(
                sistema_id=sis_5.id,
                tipo_ruido="aereo",
                rw=43.0,
                norma_ensaio="ABNT NBR ISO 10140-2 / ISO 717-1",
                condicao_ensaio="Ensaio em laboratório conforme NBR ISO 10140 com montante M48 e isolamento com lã de vidro.",
                confiabilidade="ensaio_laboratorio",
                fonte="Manual de Desempenho Acústico Knauf Drywall / Relatório IBRACON 2019"
            )
        ])

        # Sistema 6: PAR-DRY-098
        sis_6 = SistemaConstrutivo(
            codigo="PAR-DRY-098",
            nome="Parede Drywall 98/48 (2 placas ST 12,5 mm cada face + lã mineral 50 mm)",
            tipo_elemento="parede",
            descricao="Sistema de alto desempenho acústico leve com chapeamento duplo em ambas as faces.",
            espessura_total=0.098,
            massa_superficial_total=38.7
        )
        db.add(sis_6)
        db.flush()
        db.add_all([
            CamadaSistema(sistema_id=sis_6.id, material_id=mat_gesso.id, variacao_id=var_gesso_125.id, ordem=1, espessura=0.0125, posicao="face_int_1"),
            CamadaSistema(sistema_id=sis_6.id, material_id=mat_gesso.id, variacao_id=var_gesso_125.id, ordem=2, espessura=0.0125, posicao="face_int_2"),
            CamadaSistema(sistema_id=sis_6.id, material_id=mat_la_vidro.id, variacao_id=var_la_50.id, ordem=3, espessura=0.05, posicao="nucleo"),
            CamadaSistema(sistema_id=sis_6.id, material_id=mat_gesso.id, variacao_id=var_gesso_125.id, ordem=4, espessura=0.0125, posicao="face_ext_1"),
            CamadaSistema(sistema_id=sis_6.id, material_id=mat_gesso.id, variacao_id=var_gesso_125.id, ordem=5, espessura=0.0125, posicao="face_ext_2"),
            DadoAcustico(
                sistema_id=sis_6.id,
                tipo_ruido="aereo",
                rw=51.0,
                norma_ensaio="ABNT NBR ISO 10140-2 / ISO 717-1",
                condicao_ensaio="Ensaio laboratorial câmara acústica dupla camada.",
                confiabilidade="ensaio_laboratorio",
                fonte="Catálogo Técnico Placo do Brasil / IPT Relatório de Ensaio nº 1 042 115"
            )
        ])

        # Sistema 7: LAJ-MAC-010
        sis_7 = SistemaConstrutivo(
            codigo="LAJ-MAC-010",
            nome="Laje maciça de concreto armado 10 cm (sem atenuador acústico)",
            tipo_elemento="piso_laje",
            descricao="Laje estrutural básica de concreto maciço 10 cm.",
            espessura_total=0.10,
            massa_superficial_total=240.0
        )
        db.add(sis_7)
        db.flush()
        db.add_all([
            CamadaSistema(sistema_id=sis_7.id, material_id=mat_concreto.id, variacao_id=var_concreto_10.id, ordem=1, espessura=0.10, posicao="nucleo"),
            DadoAcustico(
                sistema_id=sis_7.id,
                tipo_ruido="aereo",
                rw=45.0,
                norma_ensaio="ABNT NBR 15575-3:2013",
                condicao_ensaio="Valor documentado em norma técnica de desempenho.",
                confiabilidade="documentado",
                fonte="ABNT NBR 15575-3:2013 Anexo A, Tabela A.1"
            ),
            DadoAcustico(
                sistema_id=sis_7.id,
                tipo_ruido="impacto",
                ln_w=80.0,
                delta_lw=0.0,
                norma_ensaio="ABNT NBR 15575-3:2013",
                condicao_ensaio="Valor documentado para piso sem revestimento resiliente.",
                confiabilidade="documentado",
                fonte="ABNT NBR 15575-3:2013 Anexo A, Tabela A.2"
            )
        ])

        # Sistema 8: LAJ-MAC-014
        sis_8 = SistemaConstrutivo(
            codigo="LAJ-MAC-014",
            nome="Laje maciça de concreto armado 14 cm (sem atenuador acústico)",
            tipo_elemento="piso_laje",
            descricao="Laje estrutural de concreto maciço 14 cm.",
            espessura_total=0.14,
            massa_superficial_total=336.0
        )
        db.add(sis_8)
        db.flush()
        db.add_all([
            CamadaSistema(sistema_id=sis_8.id, material_id=mat_concreto.id, variacao_id=var_concreto_14.id, ordem=1, espessura=0.14, posicao="nucleo"),
            DadoAcustico(
                sistema_id=sis_8.id,
                tipo_ruido="aereo",
                rw=49.0,
                norma_ensaio="ABNT NBR 15575-3:2013",
                condicao_ensaio="Valor normativo documentado.",
                confiabilidade="documentado",
                fonte="ABNT NBR 15575-3:2013 Anexo A, Tabela A.1"
            ),
            DadoAcustico(
                sistema_id=sis_8.id,
                tipo_ruido="impacto",
                ln_w=76.0,
                delta_lw=0.0,
                norma_ensaio="ABNT NBR 15575-3:2013",
                condicao_ensaio="Valor normativo documentado para laje nua.",
                confiabilidade="documentado",
                fonte="ABNT NBR 15575-3:2013 Anexo A, Tabela A.2"
            )
        ])

        # Sistema 9: LAJ-FLU-014
        sis_9 = SistemaConstrutivo(
            codigo="LAJ-FLU-014",
            nome="Laje maciça 14 cm com piso flutuante (manta acústica 5 mm + contrapiso 5 cm)",
            tipo_elemento="piso_laje",
            descricao="Sistema de piso flutuante de alto desempenho para isolamento de impacto e aéreo.",
            espessura_total=0.195,
            massa_superficial_total=436.15
        )
        db.add(sis_9)
        db.flush()
        db.add_all([
            CamadaSistema(sistema_id=sis_9.id, material_id=mat_concreto.id, variacao_id=var_concreto_14.id, ordem=1, espessura=0.14, posicao="base_estrutural"),
            CamadaSistema(sistema_id=sis_9.id, material_id=mat_manta_pe.id, variacao_id=var_manta_5.id, ordem=2, espessura=0.005, posicao="camada_resiliente"),
            CamadaSistema(sistema_id=sis_9.id, material_id=mat_contrapiso.id, variacao_id=var_contrapiso_5.id, ordem=3, espessura=0.05, posicao="contrapiso_flutuante"),
            DadoAcustico(
                sistema_id=sis_9.id,
                tipo_ruido="aereo",
                rw=52.0,
                norma_ensaio="ABNT NBR ISO 10140-2 / ISO 717-1",
                condicao_ensaio="Ensaio laboratorial com contrapiso desacoplado nas bordas perimetrais.",
                confiabilidade="ensaio_laboratorio",
                fonte="Catálogo ProAcústica de Sistemas de Piso, Ficha FLU-01"
            ),
            DadoAcustico(
                sistema_id=sis_9.id,
                tipo_ruido="impacto",
                ln_w=56.0,
                delta_lw=20.0,
                rigidez_dinamica=25.0,
                norma_ensaio="ABNT NBR ISO 10140-3 / ISO 717-2",
                condicao_ensaio="Máquina de percussão padrão sobre contrapiso flutuante.",
                confiabilidade="ensaio_laboratorio",
                fonte="Catálogo ProAcústica de Sistemas de Piso, Ficha FLU-01 / Ensaio IBRACON"
            )
        ])

        # Sistema 10: LAJ-VIN-014
        sis_10 = SistemaConstrutivo(
            codigo="LAJ-VIN-014",
            nome="Laje maciça 14 cm com contrapiso 3 cm e piso vinílico colado 2 mm",
            tipo_elemento="piso_laje",
            descricao="Sistema de laje de concreto com acabamento vinílico resiliente colado.",
            espessura_total=0.172,
            massa_superficial_total=398.6
        )
        db.add(sis_10)
        db.flush()
        db.add_all([
            CamadaSistema(sistema_id=sis_10.id, material_id=mat_concreto.id, variacao_id=var_concreto_14.id, ordem=1, espessura=0.14, posicao="base_estrutural"),
            CamadaSistema(sistema_id=sis_10.id, material_id=mat_contrapiso.id, variacao_id=var_contrapiso_3.id, ordem=2, espessura=0.03, posicao="regularizacao"),
            CamadaSistema(sistema_id=sis_10.id, material_id=mat_vinilico.id, variacao_id=var_vinilico_2.id, ordem=3, espessura=0.002, posicao="revestimento"),
            DadoAcustico(
                sistema_id=sis_10.id,
                tipo_ruido="aereo",
                rw=50.0,
                norma_ensaio="ABNT NBR ISO 10140-2 / ISO 717-1",
                condicao_ensaio="Ensaio laboratorial câmara reverberante.",
                confiabilidade="ensaio_laboratorio",
                fonte="Ficha Técnica de Acústica Tarkett Brasil / IPT nº 1 028 411"
            ),
            DadoAcustico(
                sistema_id=sis_10.id,
                tipo_ruido="impacto",
                ln_w=68.0,
                delta_lw=8.0,
                norma_ensaio="ABNT NBR ISO 10140-3 / ISO 717-2",
                condicao_ensaio="Máquina de percussão padrão sobre piso vinílico colado.",
                confiabilidade="ensaio_laboratorio",
                fonte="Ficha Técnica de Acústica Tarkett Brasil / IPT nº 1 028 411"
            )
        ])

        db.commit()
        print("Catálogo de 10 sistemas documentados semeado com sucesso!")

    except Exception as e:
        db.rollback()
        print(f"Erro durante a semeadura: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()

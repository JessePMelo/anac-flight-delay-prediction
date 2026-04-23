# CRISP-DM Framework
- 1 Business Understanding
Problema de negócio: Atrasaos de voos consomem recursos de todos os envolvidos.
Objetivo: Prever a probabilidade de atrasos e descrever os motivos do resultado.
KPI principal: Recall porque é melhor falar que um voo vai atrasar e ele não atrasar,consome menos recursos e da a possbilidade dos envolvidos se prepararem.
Critério de sucesso: Ter recall de no minimo  60 %.

2 Data Understanding
Fontes de dados: Dados oficiais da Agencia nacional de aviação vindo da tabela 'Voos Regulares Ativos (VRA) do ano de 2025.
Variável target: Foi criada uma nova coluna (is_delayed) se a coluna partida real ter valor acima de  minutos do que a partida prevista, a coluna recebe valor 1. Resumindo a variavel alvo e is_delayed.
Período dos dados: 2025
Problemas conhecidos: Algumas colunas tem os valores tanto de partida prevista quanto partida real em brancos e tem alguns aeroportos regionais que não seguem padrão de nomeclatura internacional oque afetou a geolocalização. Mas os dados faltantes ou inconsistentes são poucos não afetou o resultado final.


3 Data Preparation
Pipeline esperado:

🔹 Data Loading  
→ 🔹 Data Inspection  
→ 🔹 Data Cleaning  
→ 🔹 Feature Engineering  
→ 🔹 Leakage Prevention  
→ 🔹 Feature Selection  
→ 🔹 Preprocessing Pipeline  
→ 🔹 Model Training  
→ 🔹 Model Evaluation & Export

4 Modeling
Baseline: Regressão Xgboost foi oque teve melhor performance 
Modelos candidatos: Regressão Logistica foi oque teve melhor exxplicabilidade.


5 Evaluation
Métricas: Precision 0.21      Recall 0.59      F1-Score 0.31    Support 143020

6 Deployment (visão inicial)
Tipo de inferência: 
batch
API
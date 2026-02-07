# TERMO DE ESCOPO  
# E ACEITE DE PROJETO (FRAMEWORK)

## Projeto de Data Science — Do Problema ao Impacto

> **Nota:**  
> Este documento representa um framework de projeto aplicado a um estudo público de Data Science com dados da ANAC.  
> Prazos, valores e condições comerciais aqui descritos são ilustrativos, não vinculantes,  
> e têm finalidade exclusivamente educacional e de portfólio.

---

# CAMADA 0 — RESUMO EXECUTIVO

**Problema de negócio**  
Atrasos recorrentes em voos impactam negativamente a experiência dos passageiros, aumentam custos operacionais e dificultam o planejamento de companhias aéreas e aeroportos. Atualmente, a previsibilidade desses atrasos é limitada.

**Objetivo do projeto**  
Desenvolver um modelo de Data Science capaz de prever a probabilidade de atraso de voos no Brasil a partir de dados históricos públicos da ANAC.

**Resultado esperado**  
Apoiar a tomada de decisão relacionada ao planejamento operacional, gestão de riscos, alocação de recursos e melhoria da experiência do passageiro.

**Entregáveis principais**  
Análise exploratória dos dados, modelo preditivo de atraso de voos, notebook documentado e relatório analítico com insights.

**Prazo estimado**  
A definir — projeto demonstrativo para fins educacionais.

---

# PARTE A — ESCOPO DO PROJETO

---

## 1. Identificação do Projeto

**Projeto**  
Projeto de Previsão de Atrasos de Voos — ANAC

**Cliente / Contratante**  
Projeto demonstrativo com dados públicos da ANAC (portfólio)

**Responsável Técnico**  
Jessé Melo — Data Scientist

**Data de início**  
A definir (projeto demonstrativo)

**Data prevista de entrega**  
A definir, conforme escopo e disponibilidade

**Observação sobre prazo**  
Por se tratar de um projeto educacional e demonstrativo, os prazos não estão vinculados a compromissos comerciais reais.

---

## 2. Entendimento do Problema (Negócio)

**Descrição do problema de negócio**  
A imprevisibilidade de atrasos em voos dificulta o planejamento operacional e impacta negativamente a eficiência das operações aéreas e a experiência dos passageiros.

**Decisão que será tomada a partir deste projeto**  
Antecipar voos com maior risco de atraso para apoiar decisões operacionais, preventivas e estratégicas.

**Área(s) impactada(s)**  
- [x] Operações  
- [x] Negócio  
- [x] Financeiro  
- [x] Outro: Experiência do passageiro

**Risco de não realização do projeto**  
Manutenção de ineficiências operacionais, aumento de custos e impacto negativo na percepção de qualidade do serviço aéreo.

---

## 3. Objetivo Analítico

**Tipo de problema**  
- [x] Classificação *(voo atrasado / não atrasado)*

**Pergunta analítica principal**  
Qual a probabilidade de um voo sofrer atraso com base em suas características operacionais e temporais?

**Variável alvo (se aplicável)**  
Indicador de atraso do voo (0 = voo no horário, 1 = voo atrasado)

**Horizonte temporal da análise**  
Previsão de atraso no dia do voo.

---

## 4. Critérios de Sucesso e Métricas

**Métrica(s) principal(is)**  
Recall da classe “voo atrasado”, Precision e AUC-ROC.

**Erro mais custoso para o negócio**  
- [x] Falso negativo *(não identificar um voo que irá atrasar)*

**Critério mínimo aceitável**  
Recall mínimo de 65% para a classe de atraso, considerando o caráter exploratório do projeto.

---

## 5. Premissas e Restrições

**Premissas assumidas**  
Dados históricos da ANAC refletem padrões relevantes de atrasos operacionais.

**Restrições identificadas**  
- [x] Limitação de dados *(ausência de variáveis externas como condições climáticas)*  
- [x] Infraestrutura *(execução em notebook local)*  
- [x] Necessidade de interpretabilidade dos modelos  

---

## 6. Hipóteses de Negócio

1. Voos em determinados horários e dias da semana apresentam maior probabilidade de atraso.  
2. Atrasos recorrentes em aeroportos específicos aumentam o risco de novos atrasos.  
3. Características operacionais do voo impactam diretamente o risco de atraso.

---

## 7. Entendimento dos Dados

**Fonte(s) dos dados**  
Base pública de voos disponibilizada pela ANAC.

**Descrição geral dos dados**  
Dados históricos de voos domésticos no Brasil, contendo informações operacionais, temporais e de status do voo.

**Responsabilidade sobre os dados**  
Os dados são públicos e utilizados exclusivamente para fins educacionais e analíticos.

---

## 8. Planejamento da Análise

**Análises previstas**  
Análise exploratória dos dados, análise temporal, análise por aeroportos e companhias aéreas.

**Visualizações previstas**  
Histogramas, gráficos de linha, boxplots e curvas ROC.

**Transformações nos dados**  
Tratamento de valores ausentes, codificação de variáveis categóricas e engenharia de atributos temporais.

---

## 9. Estratégia Técnica

**Abordagem / modelos previstos**  
Regressão Logística e Random Forest.

**Justificativa técnica**  
Equilíbrio entre interpretabilidade e capacidade preditiva.

**Trade-offs assumidos**  
Priorizar recall em detrimento de precisão para reduzir falsos negativos.

---

## 10. Entregáveis, Comunicação e Revisões

**Entregáveis previstos**  
Notebook analítico, relatório de insights e documentação técnica.

**Revisões incluídas**  
Revisões analíticas conforme evolução do projeto.

**Comunicação**  
Comunicação assíncrona por meio de documentação e histórico do repositório.

---

## 11. Itens Fora do Escopo

Não fazem parte deste projeto:
- Deploy em produção  
- Monitoramento contínuo  
- Manutenção pós-entrega  
- Integrações externas não especificadas  

---

## 12. Critério de Aceite

O projeto será considerado concluído após a entrega dos artefatos analíticos e da documentação associada.

---

# PARTE B — CONDIÇÕES FINANCEIRAS  
*(Referência Metodológica)*

> Esta seção é apresentada exclusivamente como parte do framework de planejamento  
> e **não representa uma proposta comercial real**.

---

## Estrutura de Estimativa (Exemplo)

| Etapa | Descrição |
|------|----------|
| Análise e planejamento | Entendimento do problema, dados e métricas |
| Modelagem / Análises | EDA, engenharia de atributos e modelagem |
| Comunicação / Entregáveis | Documentação e apresentação de resultados |

---

## Declaração Final

Este documento estabelece um **framework de boas práticas** para projetos de Data Science, demonstrando organização, pensamento analítico e alinhamento entre negócio e técnica.

---

## Assinaturas

**Cliente / Contratante**  
Projeto demonstrativo — Dados públicos

**Responsável Técnico**  
Jessé Melo

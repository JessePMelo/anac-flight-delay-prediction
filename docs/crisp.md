# CRISP-DM Framework

## 1. Business Understanding
Business problem: Flight delays consume resources for all stakeholders involved.

Objective: Predict the probability of flight delays and explain the main factors behind the predictions.

Main KPI: Recall, because it is preferable to predict that a flight will be delayed (even if it is not) than to miss an actual delay. This approach minimizes operational impact and allows stakeholders to prepare in advance.

Success criteria: Achieve at least 60% recall.

---

## 2. Data Understanding
Data sources: Official data from the Brazilian National Civil Aviation Agency (ANAC), specifically from the "Voos Regulares Ativos (VRA)" dataset for the year 2025.

Target variable: A new column called `is_delayed` was created. If the actual departure time exceeds the scheduled departure time by a defined threshold, the value is set to 1; otherwise, 0.

Data period: 2025

Known issues: Some records have missing values for both scheduled and actual departure times. Additionally, certain regional airports do not follow international naming standards, which affected geolocation. However, the number of missing or inconsistent records is low and did not significantly impact the final results.

---

## 3. Data Preparation
Expected pipeline:

- Data Loading  
- Data Inspection  
- Data Cleaning  
- Feature Engineering  
- Leakage Prevention  
- Feature Selection  
- Preprocessing Pipeline  
- Model Training  
- Model Evaluation & Export  

---

## 4. Modeling
Baseline: XGBoost classifier achieved the best performance.

Candidate models: Logistic Regression provided the best interpretability.

---

## 5. Evaluation
Metrics:

- Precision: 0.21  
- Recall: 0.59  
- F1-Score: 0.31  
- Support: 143,020  

---

## 6. Deployment (initial approach)

Type of inference:
- Online (real-time / single prediction)

Access method:
- REST API

Technologies:
- Python  
- FastAPI  
- Uvicorn  
- Possible cloud deployment (VPS - ServerSpace)

Input:
- Flight data (airline, time, origin, destination, etc.)

Output:
- Delay classification (0 or 1) and probability
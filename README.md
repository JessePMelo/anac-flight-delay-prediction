# Radar de Atrasos ✈️

Machine Learning system that predicts flight departure delays in Brazil using ANAC aviation data and provides model explainability through SHAP.

🌐 **Live Demo:** [Radar de Atrasos](http://92.246.128.191/)

<p align="center">
  <img src="docs/interface.png" width="750">
</p>

# Project Overview

Flight delays are a major operational challenge for airlines and airports. Late departures impact passengers, increase operational costs, and disrupt airport logistics.

This project uses historical flight data from the Brazilian Civil Aviation Agency (ANAC) to build machine learning models capable of predicting whether a flight will depart late.

The final system includes:

- Data analysis and feature engineering
- Machine learning classification models
- Delay prediction interface
- Model explainability using SHAP

# Architecture Overview

The system architecture integrates the prediction interface, backend services and the machine learning model responsible for estimating flight delays.
1. ANAC Dataset  
2. Data Cleaning  
3. Feature Engineering  
4. Feature Selection  
5. Model Training (Logistic Regression / Random Forest / XGBoost)  
6. Model Evaluation  
7. SHAP Explainability  
8. Prediction Interface

# Live Prediction Interface

The project includes a prediction interface that allows users to simulate flight conditions and obtain delay predictions.

Inputs include:

- Airline
- Origin airport
- Destination airport
- Flight time

The system returns:

- Delay probability
- Predicted status (delayed or on-time)
- Main factors influencing the prediction


# Machine Learning Pipeline

The modeling process follows a structured workflow:

1. Data collection from ANAC public datasets
2. Data cleaning and validation
3. Feature engineering
4. Leakage prevention
5. Feature selection (Correlation + VIF)
6. Model training
7. Model evaluation
8. Model explainability using SHAP


# Model Card

Model Type  
Binary classification model predicting whether a flight will depart late.

Target Definition  
A flight is considered delayed if departure delay > 15 minutes.

Models Tested

- Logistic Regression
- Random Forest
- XGBoost

Selected Model

XGBoost was selected as the primary model due to its performance and ability to capture nonlinear relationships.

Evaluation Metrics

The models were evaluated using:

- Accuracy
- Precision
- Recall
- Confusion Matrix

Explainability

SHAP (SHapley Additive Explanations) was used to interpret model predictions and identify the most influential features.


# Data Dictionary

Main variables used in the project:

| Feature | Description |
|--------|-------------|
| airline | Airline operating the flight |
| origin | Departure airport |
| destination | Arrival airport |
| flight_hour | Hour of the flight |
| previous_delay | Delay history for that route |
| airport_traffic | Estimated airport traffic level |
| route_volume | Volume of flights on the route |

Target variable:

| Variable | Description |
|---------|-------------|
| delayed | Binary variable indicating whether the flight departed late |

# Key Insights

Analysis of the ANAC flight dataset revealed several patterns associated with flight delays:

- Flights scheduled during early morning waves show increased delay probability due to accumulated operational constraints.
- High route traffic volume increases the likelihood of departure delays.
- Some airlines demonstrate consistently lower delay rates, suggesting operational efficiency differences.
- Holiday proximity and peak travel periods contribute to increased delay risk.

These insights highlight the importance of operational context when modeling flight delays and demonstrate how machine learning can support decision making in aviation operations.

# Technologies Used

- Python
- Pandas
- Scikit-Learn
- XGBoost
- Matplotlib
- SHAP
- Jupyter Notebook

# Project Structure

```
.
├── .git                # Version control (Git)
├── .gitignore          # Files ignored by Git
├── CONTRACT.md         # Project scope and rules
├── LICENSE             # Project license
├── README.md           # Main documentation

├── backend             # API and backend logic
│   ├── model
│   │   ├── historical_stats_v5.pkl  # Precomputed statistics
│   │   └── xgb_pipeline.pkl         # Trained model (XGBoost)
│   └── services
│       └── model_wrapper.py         # Model interface for the API

├── data_science        # Data analysis and model training
│   ├── data
│   │   ├── processed
│   │   │   ├── airports.csv         # Airport dataset
│   │   │   ├── geollicalizacao_lat_lon_codigo_aeroporto.csv  # Airport coordinates
│   │   │   ├── importance_nonzero_xgb.csv  # Feature importance (non-zero)
│   │   │   ├── model_df_clean.parquet     # Cleaned dataset
│   │   │   └── vra_anac_2023_2025.parquet # Processed raw flight data
│   │   └── sampled
│   │       └── sample_df.parquet    # Sampled dataset
│   ├── model
│   │   ├── historical_stats_v5.pkl  # Model artifacts (replicated)
│   │   └── xgb_pipeline.pkl
│   ├── notebooks
│   │   └── 01_exploratory_data_analysis_anac.ipynb  # Exploratory Data Analysis (EDA)
│   └── src
│       └── model_wrapper.py        # Reusable model logic

├── docs                # Technical and visual documentation
│   ├── architecture.png  # System architecture diagram
│   ├── crisp.md          # CRISP-DM methodology documentation
│   └── interface.png     # User interface preview

├── frontend            # User interface (client-side)
│   ├── assets
│   │   ├── airline_lookup.js  # Airline lookup logic
│   │   ├── airport_lookup.js  # Airport lookup logic
│   │   ├── script.js          # Main frontend logic
│   │   └── styles.css         # Styling
│   └── index.html             # Main HTML entry point
└── requirements.txt    # Project dependencies
```
backend/
Handles the API layer, exposing endpoints for model inference and integrating trained models into a production-ready service.

data_science/
Contains the full data pipeline, including data cleaning, feature engineering, exploratory analysis, and model development.

frontend/
Provides the user interface to simulate flight scenarios and interact with the prediction system.

docs/
Project documentation, including architecture diagrams, methodology (CRISP-DM), and interface previews.

data/
Stores raw, processed, and sampled datasets used throughout the project lifecycle.

notebooks/
Jupyter notebooks for exploratory data analysis (EDA), experimentation, and validation of modeling approaches.

src/
Reusable scripts and modules for data processing, feature engineering, and model training logic.

model/ (or artifacts/)
Serialized model files and precomputed data (e.g., trained pipelines, feature statistics) used for inference.

# How to Run

Clone the repository

git clone https://github.com/JessePMelo/anac-flight-delay-prediction.git

Install dependencies

pip install -r requirements.txt

Then open the notebook to explore the analysis or run the prediction interface.


# Author

Jessé Pereira de Melo

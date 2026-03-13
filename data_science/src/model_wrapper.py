
import joblib
import shap
import numpy as np
import pandas as pd


class FlightDelayPredictor:

    def __init__(self, model_path: str, threshold: float = 0.5):
        """
        model_path: caminho do pipeline salvo (.pkl)
        threshold: limite mínimo para classificar como delay
        """
        self.pipeline = joblib.load(model_path)
        self.threshold = threshold

        self.preprocessor = self.pipeline.named_steps["preprocessor"]
        self.model = self.pipeline.named_steps["model"]

        # SHAP explainer
        self.explainer = shap.TreeExplainer(self.model)

        self.feature_names = self.preprocessor.get_feature_names_out()

    # ====================================================
    # 🔹 Converter hora → sin/cos (ANTES do pipeline)
    # ====================================================
    def _encode_hour(self, hour: int):
        hour_sin = np.sin(2 * np.pi * hour / 24)
        hour_cos = np.cos(2 * np.pi * hour / 24)
        return hour_sin, hour_cos

    # ====================================================
    # 🔹 Preparar input para pipeline
    # ====================================================
    def _prepare_input(self, input_data: dict):

        if "hour" not in input_data:
            raise ValueError("Input must contain 'hour' field.")

        input_copy = input_data.copy()

        hour = input_copy.pop("hour")

        hour_sin, hour_cos = self._encode_hour(hour)

        input_copy["hour_sin"] = hour_sin
        input_copy["hour_cos"] = hour_cos

        X = pd.DataFrame([input_copy])

        return X

    # ====================================================
    # 🔹 Predict com threshold customizado
    # ====================================================
    def predict(self, input_data: dict):

        X = self._prepare_input(input_data)

        probs = self.pipeline.predict_proba(X)[0]

        prob_no_delay = float(probs[0])
        prob_delay = float(probs[1])

        predicted_class = int(prob_delay >= self.threshold)
        label = "Delayed" if predicted_class == 1 else "On Time"

        return {
            "prediction": predicted_class,
            "label": label,
            "probability_delay": prob_delay,
            "probability_no_delay": prob_no_delay,
            "threshold_used": self.threshold
        }

    # ====================================================
    # 🔹 SHAP Explain
    # ====================================================
    def explain(self, input_data: dict, top_n: int = 10):

        X = self._prepare_input(input_data)

        # transformar manualmente (igual pipeline faz internamente)
        X_transformed = self.preprocessor.transform(X)

        if hasattr(X_transformed, "toarray"):
            X_transformed = X_transformed.toarray()

        shap_values = self.explainer(X_transformed)
        values = shap_values.values[0]

        idx_sorted = np.argsort(np.abs(values))[::-1]

        top_features = []

        for i in idx_sorted:
            feature_name = self.feature_names[i]

            # remover sin/cos da explicação para humano
            if "hour_sin" in feature_name or "hour_cos" in feature_name:
                continue

            top_features.append({
                "feature": feature_name,
                "impact": float(values[i])
            })

            if len(top_features) >= top_n:
                break

        return top_features

    # ====================================================
    # 🔹 Resposta completa
    # ====================================================
    def predict_with_explanation(self, input_data: dict, top_n: int = 10):

        prediction_output = self.predict(input_data)
        shap_output = self.explain(input_data, top_n=top_n)

        return {
            **prediction_output,
            "departure_hour": input_data["hour"],
            "top_factors": shap_output
        }

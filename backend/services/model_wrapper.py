
import joblib
import shap
import numpy as np
import pandas as pd
import holidays


class FlightDelayPredictor:

    def __init__(self, model_path: str,
                 stats_path: str = "historical_stats_v5.pkl",
                 threshold: float = 0.5):

        # Load pipeline
        self.pipeline = joblib.load(model_path)
        self.threshold = threshold

        self.preprocessor = self.pipeline.named_steps["preprocessor"]
        self.model = self.pipeline.named_steps["model"]

        # Load historical stats
        self.historical_stats = joblib.load(stats_path)

        self.origin_volume_map = self.historical_stats["origin_volume"]
        self.destination_volume_map = self.historical_stats["destination_volume"]
        self.route_volume_map = self.historical_stats["route_volume"]
        self.airline_delay_rate_map = self.historical_stats["airline_delay_rate"]
        self.hour_delay_rate_map = self.historical_stats["hour_delay_rate"]
        self.global_delay_rate = self.historical_stats["global_delay_rate"]

        # SHAP
        self.explainer = shap.TreeExplainer(self.model)
        self.feature_names = self.preprocessor.get_feature_names_out()

    # ====================================================
    # Hour encoding
    # ====================================================
    def _encode_hour(self, hour: int):
        hour_sin = np.sin(2 * np.pi * hour / 24)
        hour_cos = np.cos(2 * np.pi * hour / 24)
        return hour_sin, hour_cos

    # ====================================================
    # Date features (replicates ETL)
    # ====================================================
    def _apply_date_features(self, df: pd.DataFrame):

        df["departure_datetime"] = pd.to_datetime(
            df["departure_datetime"],
            errors="coerce"
        )

        if df["departure_datetime"].isna().any():
            raise ValueError("Invalid departure_datetime format.")

        df["hour"] = df["departure_datetime"].dt.hour
        df["day_of_week"] = df["departure_datetime"].dt.dayofweek.astype("Int8")
        df["is_weekend"] = (df["day_of_week"] >= 5).astype("Int8")

        dates = df["departure_datetime"].dt.normalize()
        years = dates.dt.year.unique()

        br_holidays = holidays.Brazil(years=years)
        holiday_dates = pd.DatetimeIndex(br_holidays.keys()).normalize()

        df["is_holiday"] = dates.isin(holiday_dates).astype("Int8")
        df["is_pre_holiday"] = (
            (dates + pd.Timedelta(days=1)).isin(holiday_dates)
        ).astype("Int8")

        df["is_post_holiday"] = (
            (dates - pd.Timedelta(days=1)).isin(holiday_dates)
        ).astype("Int8")

        df["is_first_wave"] = (df["hour"] <= 7).astype("Int8")
        df["is_last_wave"] = (df["hour"] >= 20).astype("Int8")

        hour_sin, hour_cos = self._encode_hour(df["hour"].iloc[0])
        df["hour_sin"] = hour_sin
        df["hour_cos"] = hour_cos

        return df

    # ====================================================
    # Historical aggregations
    # ====================================================
    def _apply_aggregations(self, df: pd.DataFrame):

        df["route"] = df["origin_airport"] + "_" + df["destination_airport"]

        df["origin_volume"] = df["origin_airport"].map(self.origin_volume_map)
        df["destination_volume"] = df["destination_airport"].map(self.destination_volume_map)
        df["route_volume"] = df["route"].map(self.route_volume_map)

        df["airline_delay_rate"] = df["airline"].map(self.airline_delay_rate_map)
        df["hour_delay_rate"] = df["hour"].map(self.hour_delay_rate_map)

        df["airline_delay_rate"] = df["airline_delay_rate"].fillna(self.global_delay_rate)
        df["hour_delay_rate"] = df["hour_delay_rate"].fillna(self.global_delay_rate)

        df = df.drop(columns=["route", "departure_datetime"])

        return df

    # ====================================================
    # Prepare input
    # ====================================================
    def _prepare_input(self, input_data: dict):

        required_fields = [
            "airline",
            "origin_airport",
            "destination_airport",
            "departure_datetime"
        ]

        for field in required_fields:
            if field not in input_data:
                raise ValueError(f"Missing required field: {field}")

        X = pd.DataFrame([input_data])

        X = self._apply_date_features(X)
        X = self._apply_aggregations(X)

        return X

    # ====================================================
    # Predict
    # ====================================================
    def predict(self, input_data: dict):

        X = self._prepare_input(input_data)

        probs = self.pipeline.predict_proba(X)[0]

        prob_no_delay = float(np.nan_to_num(probs[0]))
        prob_delay = float(np.nan_to_num(probs[1]))

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
    # SHAP explanation (API-ready)
    # ====================================================
    def explain(self, input_data: dict, top_n: int = 10):

        X = self._prepare_input(input_data)
        X_original = X.iloc[0]

        X_transformed = self.preprocessor.transform(X)

        if hasattr(X_transformed, "toarray"):
            X_transformed = X_transformed.toarray()

        shap_values = self.explainer(X_transformed)
        values = shap_values.values[0]

        idx_sorted = np.argsort(np.abs(values))[::-1]

        top_features = []

        for i in idx_sorted:

            feature_name = self.feature_names[i]
            transformed_value = X_transformed[0][i]

            # Ignore inactive OneHot
            if "cat__" in feature_name and abs(transformed_value) < 1e-9:
                continue

            if "hour_sin" in feature_name or "hour_cos" in feature_name:
                continue

            clean_name = (
                feature_name
                .replace("cont__", "")
                .replace("bin__", "")
                .replace("cat__", "")
            )

            impact = float(np.nan_to_num(values[i]))

            # Extract correct value
            if clean_name.startswith("airline_") and clean_name != "airline_delay_rate":
                original_value = input_data["airline"]

            elif clean_name.startswith("origin_airport_"):
                original_value = input_data["origin_airport"]

            elif clean_name.startswith("destination_airport_"):
                original_value = input_data["destination_airport"]

            else:
                original_value = X_original.get(clean_name, None)

            # Convert numpy types
            if isinstance(original_value, (np.integer,)):
                original_value = int(original_value)

            if isinstance(original_value, (np.floating,)):
                original_value = float(original_value)

            top_features.append({
                "feature": clean_name,
                "value": original_value,
                "impact": impact,
                "direction": "increase_delay" if impact > 0 else "decrease_delay"
            })

            if len(top_features) >= top_n:
                break

        return top_features

    # ====================================================
    # Full response
    # ====================================================
    def predict_with_explanation(self, input_data: dict, top_n: int = 10):

        prediction_output = self.predict(input_data)
        shap_output = self.explain(input_data, top_n=top_n)

        return {
            **prediction_output,
            "departure_datetime": input_data["departure_datetime"],
            "top_factors": shap_output
        }

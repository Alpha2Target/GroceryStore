from fastapi import FastAPI
from pydantic import BaseModel
import joblib 
import pandas as pd
import os

# Define paths relative to this file
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Load model and encoders
model = joblib.load(os.path.join(BASE_DIR, "ml", "model.pkl"))
product_encoder = joblib.load(os.path.join(BASE_DIR, "ml", "product_encoder.pkl"))
company_encoder = joblib.load(os.path.join(BASE_DIR, "ml", "company_encoder.pkl"))
category_encoder = joblib.load(os.path.join(BASE_DIR, "ml", "category_encoder.pkl"))

app = FastAPI()

# Request model
class PredictionRequest(BaseModel):
    product_name: str
    company_name: str
    product_type: str
    base_price: float
    days_to_expiry: int
    inventory: int
    demand: int

@app.post("/predict")
def predict_price(request: PredictionRequest):
    try:
        input_data = [
            product_encoder.transform([request.product_name])[0],
            company_encoder.transform([request.company_name])[0],
            category_encoder.transform([request.product_type])[0],
            request.base_price,
            request.days_to_expiry,
            request.inventory,
            request.demand
        ]
        prediction = model.predict([input_data])[0]
        final_price = round(min(prediction, request.base_price), 2)

        return {"predicted_price": final_price}
    except Exception as e:
        return {"error": str(e)}

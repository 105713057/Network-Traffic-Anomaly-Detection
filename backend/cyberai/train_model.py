"""
Model Training Script
Trains and saves the classification models for network traffic anomaly detection
"""
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, classification_report, confusion_matrix
import joblib
from pathlib import Path
import json

# Get the script directory
script_dir = Path(__file__).parent

# Create outputs folder if not exists
outputs_dir = script_dir / "outputs" / "models"
metrics_dir = script_dir / "outputs" / "metrics"
outputs_dir.mkdir(parents=True, exist_ok=True)
metrics_dir.mkdir(parents=True, exist_ok=True)

print("Loading processed dataset...")
# Use CICIDS dataset
data_path = script_dir / "data" / "processed" / "cicids_processed.csv"
df = pd.read_csv(data_path)

# Define features (X) and target (y)
y = df["is_attack"]
X = df.drop(columns=["is_attack", "attack_type"], errors="ignore")

# Save feature names for later use
feature_names = list(X.columns)
print(f"Features: {len(feature_names)}")

# Train/Test split
print("Splitting data...")
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)

# Scale features
print("Scaling features...")
scaler = StandardScaler()
Xtr_s = scaler.fit_transform(Xtr)
Xte_s = scaler.transform(Xte)

# Train Logistic Regression
print("\nTraining Logistic Regression...")
logreg = LogisticRegression(max_iter=1000, random_state=42)
logreg.fit(Xtr_s, ytr)
pred_lr = logreg.predict(Xte_s)

lr_accuracy = accuracy_score(yte, pred_lr)
lr_precision = precision_score(yte, pred_lr, zero_division=0)
lr_recall = recall_score(yte, pred_lr, zero_division=0)
lr_f1 = f1_score(yte, pred_lr, zero_division=0)

print("\nLogistic Regression Results")
print(f"Accuracy: {lr_accuracy:.4f}")
print(f"Precision: {lr_precision:.4f}")
print(f"Recall: {lr_recall:.4f}")
print(f"F1-Score: {lr_f1:.4f}")

# Train KNN models and find best
print("\nTraining KNN models...")
best_knn = None
best_knn_model = None
best_k = None
best_knn_acc = None
best_knn_prec = None
best_knn_rec = None

for k in [3, 5, 7]:
    knn = KNeighborsClassifier(n_neighbors=k)
    knn.fit(Xtr_s, ytr)
    pred_knn = knn.predict(Xte_s)
    
    f1 = f1_score(yte, pred_knn, zero_division=0)
    acc = accuracy_score(yte, pred_knn)
    prec = precision_score(yte, pred_knn, zero_division=0)
    rec = recall_score(yte, pred_knn, zero_division=0)
    print(f"\nKNN (k={k}) Results")
    print(f"Accuracy: {acc:.4f}, Precision: {prec:.4f}, Recall: {rec:.4f}, F1-Score: {f1:.4f}")
    
    if best_knn is None or f1 > best_knn:
        best_knn = f1
        best_knn_model = knn
        best_k = k
        best_knn_acc = acc
        best_knn_prec = prec
        best_knn_rec = rec

print(f"\nBest KNN was k={best_k} with F1={best_knn:.4f}")

# Save models and scaler
print("\nSaving models...")
model_dir = outputs_dir
joblib.dump(logreg, model_dir / "logistic_regression.pkl")
joblib.dump(best_knn_model, model_dir / "knn.pkl")
joblib.dump(scaler, model_dir / "scaler.pkl")

# Save feature names and metadata
metadata = {
    "feature_names": feature_names,
    "num_features": len(feature_names),
    "best_knn_k": best_k,
    "logistic_regression": {
        "accuracy": float(lr_accuracy),
        "precision": float(lr_precision),
        "recall": float(lr_recall),
        "f1_score": float(lr_f1)
    },
    "knn": {
        "k": best_k,
        "accuracy": float(best_knn_acc),
        "precision": float(best_knn_prec),
        "recall": float(best_knn_rec),
        "f1_score": float(best_knn)
    }
}

with open(model_dir / "model_metadata.json", "w") as f:
    json.dump(metadata, f, indent=2)

print(f"\nModels saved to {model_dir}")
print("Training complete!")


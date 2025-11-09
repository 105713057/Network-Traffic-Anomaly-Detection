"""
Fast Model Training Script - Uses Sample Data for Quick Training
Trains models on a sample of the dataset for faster training (10-15 minutes instead of hours)
"""
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
import joblib
from pathlib import Path
import json
import time

# Get the script directory
script_dir = Path(__file__).parent

# Create outputs folder if not exists
outputs_dir = script_dir / "outputs" / "models"
metrics_dir = script_dir / "outputs" / "metrics"
outputs_dir.mkdir(parents=True, exist_ok=True)
metrics_dir.mkdir(parents=True, exist_ok=True)

print("=" * 60)
print("FAST MODEL TRAINING - Using Sample Data")
print("=" * 60)
print("\nThis script uses a sample of the data for faster training.")
print("Training time: ~10-15 minutes (instead of hours)")
print("=" * 60)

# Try to use basic dataset first (much smaller - 25K rows)
basic_data_path = script_dir / "data" / "processed" / "basic_processed.csv"
cicids_data_path = script_dir / "data" / "processed" / "cicids_processed.csv"

use_basic = False
if basic_data_path.exists():
    print(f"\nFound basic dataset: {basic_data_path}")
    print("Using basic dataset (25K rows) - will be very fast (~2-5 minutes)")
    use_basic = True
    data_path = basic_data_path
else:
    print(f"\nBasic dataset not found, using CICIDS dataset")
    print("Will use a sample of 100K rows for faster training")
    data_path = cicids_data_path

print(f"\nLoading dataset from: {data_path}")
start_time = time.time()

df = pd.read_csv(data_path)
print(f"Dataset loaded: {df.shape[0]} rows, {df.shape[1]} columns")
print(f"Time taken: {time.time() - start_time:.2f} seconds")

# If using CICIDS and it's large, sample it
if not use_basic and len(df) > 100000:
    sample_size = 100000
    print(f"\nSampling {sample_size} rows from {len(df)} rows for faster training...")
    df = df.sample(n=sample_size, random_state=42)
    print(f"Sampled dataset: {df.shape[0]} rows")

# Define features (X) and target (y)
y = df["is_attack"]
X = df.drop(columns=["is_attack", "attack_type", "label"], errors="ignore")

# Save feature names for later use
feature_names = list(X.columns)
print(f"\nFeatures: {len(feature_names)}")

# Train/Test split
print("\nSplitting data...")
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)
print(f"Training set: {len(Xtr)} rows")
print(f"Test set: {len(Xte)} rows")

# Scale features
print("\nScaling features...")
scaler = StandardScaler()
Xtr_s = scaler.fit_transform(Xtr)
Xte_s = scaler.transform(Xte)
print("Scaling complete")

# Train Logistic Regression
print("\n" + "=" * 60)
print("Training Logistic Regression...")
print("=" * 60)
lr_start = time.time()
logreg = LogisticRegression(max_iter=1000, random_state=42, n_jobs=-1)
logreg.fit(Xtr_s, ytr)
pred_lr = logreg.predict(Xte_s)
lr_time = time.time() - lr_start

lr_accuracy = accuracy_score(yte, pred_lr)
lr_precision = precision_score(yte, pred_lr, zero_division=0)
lr_recall = recall_score(yte, pred_lr, zero_division=0)
lr_f1 = f1_score(yte, pred_lr, zero_division=0)

print(f"\nLogistic Regression Results (trained in {lr_time:.2f} seconds)")
print(f"Accuracy: {lr_accuracy:.4f}")
print(f"Precision: {lr_precision:.4f}")
print(f"Recall: {lr_recall:.4f}")
print(f"F1-Score: {lr_f1:.4f}")

# Train KNN models and find best
print("\n" + "=" * 60)
print("Training KNN models...")
print("=" * 60)
knn_start = time.time()
best_knn = None
best_knn_model = None
best_k = None
best_knn_acc = None
best_knn_prec = None
best_knn_rec = None

for k in [3, 5, 7]:
    print(f"\nTraining KNN with k={k}...")
    knn = KNeighborsClassifier(n_neighbors=k, n_jobs=-1)
    knn.fit(Xtr_s, ytr)
    pred_knn = knn.predict(Xte_s)
    
    f1 = f1_score(yte, pred_knn, zero_division=0)
    acc = accuracy_score(yte, pred_knn)
    prec = precision_score(yte, pred_knn, zero_division=0)
    rec = recall_score(yte, pred_knn, zero_division=0)
    print(f"KNN (k={k}) - Accuracy: {acc:.4f}, Precision: {prec:.4f}, Recall: {rec:.4f}, F1-Score: {f1:.4f}")
    
    if best_knn is None or f1 > best_knn:
        best_knn = f1
        best_knn_model = knn
        best_k = k
        best_knn_acc = acc
        best_knn_prec = prec
        best_knn_rec = rec

knn_time = time.time() - knn_start
print(f"\nBest KNN was k={best_k} with F1={best_knn:.4f}")
print(f"KNN training time: {knn_time:.2f} seconds")

# Save models and scaler
print("\n" + "=" * 60)
print("Saving models...")
print("=" * 60)
model_dir = outputs_dir
joblib.dump(logreg, model_dir / "logistic_regression.pkl")
joblib.dump(best_knn_model, model_dir / "knn.pkl")
joblib.dump(scaler, model_dir / "scaler.pkl")

# Save feature names and metadata
metadata = {
    "feature_names": feature_names,
    "num_features": len(feature_names),
    "best_knn_k": best_k,
    "dataset_used": "basic" if use_basic else "cicids_sample",
    "training_samples": len(Xtr),
    "logistic_regression": {
        "accuracy": float(lr_accuracy),
        "precision": float(lr_precision),
        "recall": float(lr_recall),
        "f1_score": float(lr_f1),
        "training_time_seconds": float(lr_time)
    },
    "knn": {
        "k": best_k,
        "accuracy": float(best_knn_acc),
        "precision": float(best_knn_prec),
        "recall": float(best_knn_rec),
        "f1_score": float(best_knn),
        "training_time_seconds": float(knn_time)
    }
}

with open(model_dir / "model_metadata.json", "w") as f:
    json.dump(metadata, f, indent=2)

total_time = time.time() - start_time
print(f"\nModels saved to {model_dir}")
print(f"\nTotal training time: {total_time:.2f} seconds ({total_time/60:.2f} minutes)")
print("=" * 60)
print("Training complete!")
print("=" * 60)


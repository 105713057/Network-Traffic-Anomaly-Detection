# CYBERAI-Network-Traffic-Classification-for-Anomaly-Detection-project
This project will design and plan an ML-driven workflow for network traffic classification and anomaly detection.

Project Title
Network Traffic Classification for Anomaly Detection
Environment Setup
1.	Install Python 3.10 or later on your machine.
2.	Open the project folder in Visual Studio Code (VS Code).
3.	Create and activate a virtual environment:
o	Windows:
o	python -m venv .venv
o	.venv\Scripts\activate
o	macOS/Linux:
o	python -m venv .venv
o	source .venv/bin/activate
4.	Install the required libraries:
5.	pip install -r requirements.txt
Data Preparation
1.	Place the original datasets into data/raw/:
o	basic.csv – the small base dataset
o	cicids2017_cleaned.csv – cleaned Kaggle dataset, saved as CSV
2.	Run the following notebooks to process and prepare the datasets:
o	10_clean_basic.ipynb → generates basic_processed.csv
o	11_clean_cicids.ipynb → generates cicids_processed.csv
The processed datasets will be saved in data/processed/.
Running the Models
Classification (Supervised Learning)
Notebook: 20_model_classification.ipynb
•	Logistic Regression
•	K-Nearest Neighbors (k=3, k=5)
•	Outputs include: performance reports, ROC curves, confusion matrices, trained models
Clustering (Unsupervised Learning)
Notebook: 21_model_clustering.ipynb
•	MiniBatch K-Means – elbow curve, silhouette score, PCA scatter plot
•	DBSCAN – k-distance plot, clustering results, silhouette score
•	Outputs include: cluster profiles and visualisations
Expected Outputs
•	Figures generated during experiments are stored in outputs/figures/
•	Metrics (such as classification reports and cluster profiles) are stored in outputs/metrics/
•	Trained Models are saved in outputs/models/

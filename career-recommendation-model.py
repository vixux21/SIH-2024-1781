import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.multioutput import MultiOutputClassifier
from sklearn.metrics import accuracy_score, classification_report
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import TruncatedSVD
import joblib

class CareerRecommendationModel:
    def __init__(self):
        self.scaler = StandardScaler()
        self.tfidf = TfidfVectorizer(max_features=1000)
        self.svd = TruncatedSVD(n_components=100)
        self.model = MultiOutputClassifier(GradientBoostingClassifier(n_estimators=100, random_state=42))

    def preprocess_data(self, data):
        # Numeric features
        numeric_features = ['years_of_experience', 'education_level_encoded']
        X_numeric = self.scaler.fit_transform(data[numeric_features])

        # Text features
        text_features = ['skills', 'interests']
        X_text = self.tfidf.fit_transform(data[text_features].apply(lambda x: ' '.join(x), axis=1))
        X_text_svd = self.svd.fit_transform(X_text)

        # Combine features
        X = np.hstack((X_numeric, X_text_svd))
        return X

    def train(self, X, y):
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        self.model.fit(X_train, y_train)
        
        y_pred = self.model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        print(f"Model Accuracy: {accuracy}")
        print(classification_report(y_test, y_pred))

    def predict(self, user_data):
        X = self.preprocess_data(user_data)
        return self.model.predict_proba(X)

    def save_model(self, path):
        joblib.dump(self, path)

    @classmethod
    def load_model(cls, path):
        return joblib.load(path)

def prepare_training_data(assessments, career_paths):
    # Combine assessment results and career path data
    # Return X (features) and y (career paths)
    pass

def train_and_save_model():
    assessments = load_assessments_from_database()
    career_paths = load_career_paths_from_database()
    X, y = prepare_training_data(assessments, career_paths)

    model = CareerRecommendationModel()
    X_processed = model.preprocess_data(X)
    model.train(X_processed, y)
    model.save_model('career_recommendation_model.joblib')

def generate_recommendations(user_data):
    model = CareerRecommendationModel.load_model('career_recommendation_model.joblib')
    recommendations = model.predict(user_data)
    # Process recommendations to return top career paths with confidence scores
    return recommendations

if __name__ == "__main__":
    train_and_save_model()

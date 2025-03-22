from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import numpy as np
import pandas as pd
from datetime import datetime

# Import models from our modules
from models.recommendation.collaborative_filtering import CollaborativeFilteringModel
from models.recommendation.content_based import ContentBasedRecommender
from models.recommendation.hybrid import HybridRecommender
from models.trends.forecasting import TrendForecaster
from models.sentiment.analyzer import SentimentAnalyzer
from models.anomaly.detector import AnomalyDetector

app = Flask(__name__)
CORS(app)

# Initialize models
collab_model = CollaborativeFilteringModel()
content_model = ContentBasedRecommender()
hybrid_model = HybridRecommender(collab_model, content_model)
trend_model = TrendForecaster()
sentiment_model = SentimentAnalyzer()
anomaly_model = AnomalyDetector()

# Load sample data for demo - in a real app, these would come from a database
# Load sample datasets
def load_sample_data():
    # In a real application, this would load from a database
    # For this example, we'll create some synthetic data
    
    # Sample users
    num_users = 1000
    users = pd.DataFrame({
        'user_id': [f'user_{i}' for i in range(1, num_users + 1)],
        'age': np.random.randint(18, 45, num_users),
        'gender': np.random.choice(['M', 'F', 'NB'], num_users, p=[0.48, 0.49, 0.03]),
        'city': np.random.choice(['New York', 'Los Angeles', 'Chicago', 'Miami', 'Seattle'], num_users),
        'signup_date': [datetime.now().date() - pd.Timedelta(days=np.random.randint(1, 365)) for _ in range(num_users)]
    })
    
    # Sample events
    num_events = 500
    event_categories = ['Music', 'Sports', 'Arts', 'Food', 'Tech', 'Nightlife', 'Workshop', 'Conference']
    events = pd.DataFrame({
        'event_id': [f'event_{i}' for i in range(1, num_events + 1)],
        'title': [f'Event Title {i}' for i in range(1, num_events + 1)],
        'category': np.random.choice(event_categories, num_events),
        'location': np.random.choice(['New York', 'Los Angeles', 'Chicago', 'Miami', 'Seattle'], num_events),
        'date': [datetime.now().date() + pd.Timedelta(days=np.random.randint(1, 90)) for _ in range(num_events)],
        'price': np.random.randint(20, 200, num_events)
    })
    
    # Sample interactions (views, clicks, tickets purchased)
    num_interactions = 10000
    interactions = pd.DataFrame({
        'user_id': np.random.choice(users['user_id'], num_interactions),
        'event_id': np.random.choice(events['event_id'], num_interactions),
        'interaction_type': np.random.choice(['view', 'click', 'purchase'], num_interactions, p=[0.6, 0.3, 0.1]),
        'timestamp': [datetime.now() - pd.Timedelta(days=np.random.randint(1, 30)) for _ in range(num_interactions)]
    })
    
    return users, events, interactions

users_df, events_df, interactions_df = load_sample_data()

# API routes
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})

@app.route('/api/recommendations/personalized', methods=['GET'])
def get_personalized_recommendations():
    user_id = request.args.get('user_id')
    limit = int(request.args.get('limit', 10))
    
    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400
    
    # Get recommendations using the hybrid model
    try:
        recommendations = hybrid_model.get_recommendations(
            user_id, 
            interactions_df, 
            events_df, 
            limit=limit
        )
        
        return jsonify({
            'success': True,
            'recommendations': recommendations.to_dict(orient='records')
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/recommendations/trending', methods=['GET'])
def get_trending_recommendations():
    limit = int(request.args.get('limit', 10))
    location = request.args.get('location')
    category = request.args.get('category')
    
    try:
        filters = {}
        if location:
            filters['location'] = location
        if category:
            filters['category'] = category
        
        trending_events = trend_model.get_trending_events(
            events_df, 
            interactions_df, 
            filters=filters, 
            limit=limit
        )
        
        return jsonify({
            'success': True,
            'trending_events': trending_events.to_dict(orient='records')
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/recommendations/discovery', methods=['GET'])
def get_discovery_recommendations():
    user_id = request.args.get('user_id')
    limit = int(request.args.get('limit', 10))
    
    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400
    
    try:
        # Get recommendations for exploration/discovery
        discovery_events = hybrid_model.get_discovery_recommendations(
            user_id, 
            interactions_df, 
            events_df, 
            limit=limit
        )
        
        return jsonify({
            'success': True,
            'discovery_events': discovery_events.to_dict(orient='records')
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/analytics/sales-forecast', methods=['GET'])
def get_sales_forecast():
    event_id = request.args.get('event_id')
    days_ahead = int(request.args.get('days_ahead', 30))
    
    if not event_id:
        return jsonify({'error': 'Event ID is required'}), 400
    
    try:
        # Get sales forecast for the event
        forecast = trend_model.forecast_ticket_sales(
            event_id, 
            interactions_df, 
            days_ahead=days_ahead
        )
        
        return jsonify({
            'success': True,
            'forecast': forecast.to_dict(orient='records')
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/analytics/sentiment', methods=['POST'])
def analyze_sentiment():
    data = request.json
    
    if not data or 'text' not in data:
        return jsonify({'error': 'Text content is required'}), 400
    
    try:
        sentiment = sentiment_model.analyze(data['text'])
        
        return jsonify({
            'success': True,
            'sentiment': sentiment
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/analytics/anomaly-detection', methods=['POST'])
def detect_anomalies():
    data = request.json
    
    if not data or 'metrics' not in data or 'event_id' not in data:
        return jsonify({'error': 'Metrics and event ID are required'}), 400
    
    try:
        anomalies = anomaly_model.detect(
            data['metrics'], 
            data['event_id']
        )
        
        return jsonify({
            'success': True,
            'anomalies': anomalies
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/analytics/price-optimization', methods=['POST'])
def optimize_price():
    data = request.json
    
    if not data or 'event_id' not in data:
        return jsonify({'error': 'Event ID is required'}), 400
    
    try:
        optimized_price = trend_model.optimize_pricing(
            data['event_id'],
            interactions_df,
            events_df,
            current_price=data.get('current_price'),
            target_attendance=data.get('target_attendance')
        )
        
        return jsonify({
            'success': True,
            'optimized_price': optimized_price
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
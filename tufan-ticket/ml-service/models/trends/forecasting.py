import pandas as pd
import numpy as np
from prophet import Prophet
from sklearn.linear_model import LinearRegression
from datetime import datetime, timedelta

class TrendForecaster:
    def __init__(self):
        self.prophet_model = None
        self.price_model = None
    
    def get_trending_events(self, events_df, interactions_df, filters=None, limit=10):
        """Identify trending events based on interaction velocity"""
        # Copy dataframes to avoid modifying the originals
        events = events_df.copy()
        interactions = interactions_df.copy()
        
        # Apply filters if provided
        if filters:
            for key, value in filters.items():
                if key in events.columns:
                    events = events[events[key] == value]
            
            # Filter interactions to only include filtered events
            interactions = interactions[interactions['event_id'].isin(events['event_id'])]
        
        # Calculate trend score: recent activity with time decay
        now = datetime.now()
        interactions['days_ago'] = interactions['timestamp'].apply(
            lambda x: (now - x).days
        )
        
        # Apply exponential decay factor to weight recent interactions more
        interactions['weight'] = interactions['days_ago'].apply(
            lambda days: np.exp(-0.1 * days)  # Decay factor
        )
        
        # Weight by interaction type
        interaction_weights = {'view': 1, 'click': 3, 'purchase': 10}
        interactions['type_weight'] = interactions['interaction_type'].map(interaction_weights)
        
        # Compute final weight
        interactions['final_weight'] = interactions['weight'] * interactions['type_weight']
        
        # Calculate trending score for each event
        trend_scores = interactions.groupby('event_id')['final_weight'].sum().reset_index()
        trend_scores = trend_scores.rename(columns={'final_weight': 'trend_score'})
        
        # Merge with events data
        trending_events = events.merge(trend_scores, on='event_id', how='inner')
        
        # Sort by trend score
        trending_events = trending_events.sort_values('trend_score', ascending=False)
        
        # Return top trending events
        return trending_events.head(limit)
    
    def forecast_ticket_sales(self, event_id, interactions_df, days_ahead=30):
        """Forecast ticket sales for a specific event"""
        # Filter to purchase interactions for this event
        event_purchases = interactions_df[
            (interactions_df['event_id'] == event_id) & 
            (interactions_df['interaction_type'] == 'purchase')
        ]
        
        if len(event_purchases) < 5:
            # Not enough data for forecasting, return simple linear projection
            return self._linear_forecast(event_id, interactions_df, days_ahead)
        
        # Prepare data for Prophet
        df = event_purchases.groupby(event_purchases['timestamp'].dt.date).size().reset_index()
        df.columns = ['ds', 'y']
        
        # Fit Prophet model
        model = Prophet(
            daily_seasonality=True,
            yearly_seasonality=False,
            weekly_seasonality=True
        )
        model.fit(df)
        
        # Create future dataframe
        future = model.make_future_dataframe(periods=days_ahead)
        
        # Generate forecast
        forecast = model.predict(future)
        
        # Extract relevant columns
        result = forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail(days_ahead)
        result = result.rename(columns={
            'ds': 'date',
            'yhat': 'predicted_sales',
            'yhat_lower': 'lower_bound',
            'yhat_upper': 'upper_bound'
        })
        
        # Ensure values are non-negative
        for col in ['predicted_sales', 'lower_bound', 'upper_bound']:
            result[col] = result[col].apply(lambda x: max(0, x))
        
        return result
    
    def _linear_forecast(self, event_id, interactions_df, days_ahead):
        """Simple linear forecast when not enough data for Prophet"""
        # Filter to purchase interactions for this event
        event_purchases = interactions_df[
            (interactions_df['event_id'] == event_id) & 
            (interactions_df['interaction_type'] == 'purchase')
        ]
        
        # Get purchase counts by date
        purchases_by_date = event_purchases.groupby(
            event_purchases['timestamp'].dt.date
        ).size().reset_index()
        purchases_by_date.columns = ['date', 'sales']
        
        if len(purchases_by_date) < 2:
            # Not enough data for linear regression
            # Use average of available data or default value
            avg_sales = purchases_by_date['sales'].mean() if not purchases_by_date.empty else 1
            
            # Create future dates
            future_dates = [datetime.now().date() + timedelta(days=i) for i in range(1, days_ahead + 1)]
            forecast = pd.DataFrame({
                'date': future_dates,
                'predicted_sales': [avg_sales] * days_ahead,
                'lower_bound': [max(0, avg_sales * 0.8)] * days_ahead,
                'upper_bound': [avg_sales * 1.2] * days_ahead
            })
            
            return forecast
        
        # Prepare data for linear regression
        x = np.array(range(len(purchases_by_date))).reshape(-1, 1)
        y = purchases_by_date['sales'].values
        
        # Fit linear model
        model = LinearRegression()
        model.fit(x, y)
        
        # Create future dates
        future_dates = [datetime.now().date() + timedelta(days=i) for i in range(1, days_ahead + 1)]
        
        # Predict future sales
        future_x = np.array(range(len(purchases_by_date), len(purchases_by_date) + days_ahead)).reshape(-1, 1)
        predictions = model.predict(future_x)
        
        # Create forecast dataframe
        forecast = pd.DataFrame({
            'date': future_dates,
            'predicted_sales': predictions,
            'lower_bound': predictions * 0.8,  # Simple confidence interval
            'upper_bound': predictions * 1.2   # Simple confidence interval
        })
        
        # Ensure values are non-negative
        for col in ['predicted_sales', 'lower_bound', 'upper_bound']:
            forecast[col] = forecast[col].apply(lambda x: max(0, x))
        
        return forecast
    
    def optimize_pricing(self, event_id, interactions_df, events_df, current_price=None, target_attendance=None):
        """Optimize pricing for an event based on historical data and price elasticity"""
        # Get the event details
        event = events_df[events_df['event_id'] == event_id]
        
        if event.empty:
            raise ValueError(f"Event {event_id} not found")
        
        if current_price is None:
            current_price = event['price'].values[0]
        
        # Get similar events based on category
        category = event['category'].values[0]
        similar_events = events_df[events_df['category'] == category]
        
        # Get purchase data for similar events
        purchase_data = []
        for _, similar_event in similar_events.iterrows():
            similar_id = similar_event['event_id']
            price = similar_event['price']
            
            # Count purchases for this event
            purchases = interactions_df[
                (interactions_df['event_id'] == similar_id) & 
                (interactions_df['interaction_type'] == 'purchase')
            ].shape[0]
            
            purchase_data.append({
                'event_id': similar_id,
                'price': price,
                'purchases': purchases
            })
        
        if not purchase_data:
            # No similar events with purchase data
            return current_price
        
        # Create dataframe for price optimization
        price_df = pd.DataFrame(purchase_data)
        
        # Fit price-demand model
        if len(price_df) >= 3:
            # Log-linear model for price elasticity
            price_df['log_price'] = np.log(price_df['price'])
            price_df['log_purchases'] = np.log(price_df['purchases'] + 1)  # Add 1 to handle zero purchases
            
            # Fit linear regression
            X = price_df['log_price'].values.reshape(-1, 1)
            y = price_df['log_purchases'].values
            
            model = LinearRegression()
            model.fit(X, y)
            
            # Calculate price elasticity (coefficient from log-linear model)
            elasticity = model.coef_[0]
            
            # Calculate optimal price based on elasticity
            if target_attendance is not None:
                # If target attendance is specified, find price that achieves it
                # log(target) = intercept + elasticity * log(optimal_price)
                intercept = model.intercept_
                log_target = np.log(target_attendance + 1)
                log_optimal_price = (log_target - intercept) / elasticity if elasticity != 0 else 0
                optimal_price = np.exp(log_optimal_price)
                
                # Constrain within reasonable bounds (±30% of current price)
                optimal_price = max(current_price * 0.7, min(current_price * 1.3, optimal_price))
            else:
                # Without target attendance, find profit-maximizing price
                # For profit maximization with constant elasticity:
                # optimal_markup = -elasticity / (1 + elasticity)
                
                if elasticity >= -1:
                    # Inelastic demand - higher price increases revenue
                    optimal_price = current_price * 1.1  # Increase by 10%
                else:
                    # Elastic demand - optimal markup
                    optimal_markup = -elasticity / (1 + elasticity)
                    optimal_price = current_price * (1 + optimal_markup)
            
            return round(optimal_price, 2)
        else:
            # Not enough data for regression
            # Return current price with small adjustment based on sales performance
            avg_purchases = np.mean(price_df['purchases'])
            if avg_purchases < 10:
                # Low demand - reduce price by 5%
                return round(current_price * 0.95, 2)
            elif avg_purchases > 50:
                # High demand - increase price by 5%
                return round(current_price * 1.05, 2)
            else:
                # Moderate demand - keep price
                return current_price
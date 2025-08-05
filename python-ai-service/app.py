from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import tensorflow as tf
from tensorflow import keras
import base64
import io
from PIL import Image
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Material classes
MATERIAL_CLASSES = {
    0: 'plastic',
    1: 'paper', 
    2: 'glass',
    3: 'aluminum',
    4: 'electronic'
}

MATERIAL_NAMES = {
    'plastic': 'Plástico (PET)',
    'paper': 'Papel/Cartón',
    'glass': 'Vidrio', 
    'aluminum': 'Aluminio',
    'electronic': 'Electrónicos'
}         

class MaterialRecognizer:
    def __init__(self):
        self.model = None
        self.load_model()
    
    def load_model(self):
        """Load or create the material recognition model"""
        try:
            # Try to load existing model
            if os.path.exists('models/material_classifier.h5'):
                self.model = keras.models.load_model('models/material_classifier.h5')
                logger.info("Loaded existing model")
            else:
                # Create a simple CNN model for demonstration
                self.model = self.create_demo_model()
                logger.info("Created demo model")
        except Exception as e:
            logger.error(f"Error loading model: {e}")
            self.model = self.create_demo_model()
    
    def create_demo_model(self):
        """Create a demo CNN model for material classification"""
        model = keras.Sequential([
            keras.layers.Conv2D(32, (3, 3), activation='relu', input_shape=(224, 224, 3)),
            keras.layers.MaxPooling2D((2, 2)),
            keras.layers.Conv2D(64, (3, 3), activation='relu'),
            keras.layers.MaxPooling2D((2, 2)),
            keras.layers.Conv2D(64, (3, 3), activation='relu'),
            keras.layers.Flatten(),
            keras.layers.Dense(64, activation='relu'),
            keras.layers.Dropout(0.5),
            keras.layers.Dense(5, activation='softmax')  # 5 material classes
        ])
        
        model.compile(
            optimizer='adam',
            loss='categorical_crossentropy',
            metrics=['accuracy']
        )
        
        # Create models directory if it doesn't exist
        os.makedirs('models', exist_ok=True)
        
        return model
    
    def preprocess_image(self, image):
        """Preprocess image for model prediction"""
        try:
            # Resize image to model input size
            image = cv2.resize(image, (224, 224))
            
            # Normalize pixel values
            image = image.astype(np.float32) / 255.0
            
            # Add batch dimension
            image = np.expand_dims(image, axis=0)
            
            return image
        except Exception as e:
            logger.error(f"Error preprocessing image: {e}")
            return None
    
    def extract_features(self, image):
        """Extract visual features for material classification"""
        try:
            # Convert to different color spaces for analysis
            hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            
            # Calculate color histograms
            hist_b = cv2.calcHist([image], [0], None, [256], [0, 256])
            hist_g = cv2.calcHist([image], [1], None, [256], [0, 256])
            hist_r = cv2.calcHist([image], [2], None, [256], [0, 256])
            
            # Calculate texture features using Laplacian
            laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()
            
            # Calculate mean colors
            mean_b, mean_g, mean_r = np.mean(image, axis=(0, 1))
            
            # Simple heuristic-based classification
            features = {
                'mean_colors': [mean_r, mean_g, mean_b],
                'texture_variance': laplacian_var,
                'brightness': np.mean(gray)
            }
            
            return features
        except Exception as e:
            logger.error(f"Error extracting features: {e}")
            return None
    
    def classify_by_heuristics(self, features):
        """Simple heuristic-based material classification"""
        try:
            mean_r, mean_g, mean_b = features['mean_colors']
            texture_var = features['texture_variance']
            brightness = features['brightness']
            
            # Simple rules for material classification
            predictions = {}
            
            # Glass: typically transparent/reflective, high brightness variation
            if brightness > 150 and texture_var > 1000:
                predictions['glass'] = 0.7
            else:
                predictions['glass'] = 0.1
            
            # Aluminum: metallic, high reflectivity, gray tones
            if abs(mean_r - mean_g) < 20 and abs(mean_g - mean_b) < 20 and brightness > 100:
                predictions['aluminum'] = 0.6
            else:
                predictions['aluminum'] = 0.15
            
            # Paper: typically white/brown, low texture variance
            if (mean_r > 180 and mean_g > 180 and mean_b > 180) or texture_var < 500:
                predictions['paper'] = 0.65
            else:
                predictions['paper'] = 0.2
            
            # Plastic: varied colors, medium texture
            if texture_var > 200 and texture_var < 2000:
                predictions['plastic'] = 0.6
            else:
                predictions['plastic'] = 0.25
            
            # Electronic: dark colors, complex textures
            if brightness < 80 and texture_var > 800:
                predictions['electronic'] = 0.5
            else:
                predictions['electronic'] = 0.1
            
            # Normalize predictions
            total = sum(predictions.values())
            if total > 0:
                predictions = {k: v/total for k, v in predictions.items()}
            
            return predictions
        except Exception as e:
            logger.error(f"Error in heuristic classification: {e}")
            return {'plastic': 0.4, 'paper': 0.3, 'glass': 0.1, 'aluminum': 0.1, 'electronic': 0.1}
    
    def predict(self, image):
        """Predict material type from image"""
        try:
            # Extract features for heuristic classification
            features = self.extract_features(image)
            if features is None:
                return None
            
            # Use heuristic classification (more reliable than untrained CNN)
            predictions = self.classify_by_heuristics(features)
            
            # Get top prediction
            top_material = max(predictions.keys(), key=lambda k: predictions[k])
            confidence = predictions[top_material]
            
            # Get suggestions (other likely materials)
            sorted_predictions = sorted(predictions.items(), key=lambda x: x[1], reverse=True)
            suggestions = [material for material, conf in sorted_predictions[1:3] if conf > 0.1]
            
            return {
                'material': top_material,
                'confidence': confidence,
                'all_predictions': predictions,
                'suggestions': suggestions
            }
        except Exception as e:
            logger.error(f"Error in prediction: {e}")
            return None

# Initialize the recognizer
recognizer = MaterialRecognizer()

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'Material Recognition AI',
        'model_loaded': recognizer.model is not None
    })

@app.route('/api/recognize-material', methods=['POST'])
def recognize_material():
    """Recognize material from uploaded image"""
    try:
        # Check if image was uploaded
        if 'image' not in request.files:
            return jsonify({
                'success': False,
                'message': 'No se encontró imagen en la solicitud'
            }), 400
        
        file = request.files['image']
        if file.filename == '':
            return jsonify({
                'success': False,
                'message': 'No se seleccionó ningún archivo'
            }), 400
        
        # Read and process image
        image_bytes = file.read()
        nparr = np.frombuffer(image_bytes, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if image is None:
            return jsonify({
                'success': False,
                'message': 'No se pudo procesar la imagen'
            }), 400
        
        # Predict material
        result = recognizer.predict(image)
        
        if result is None:
            return jsonify({
                'success': False,
                'message': 'Error en el análisis de la imagen'
            }), 500
        
        return jsonify({
            'success': True,
            'material': result['material'],
            'confidence': result['confidence'],
            'material_name': MATERIAL_NAMES.get(result['material'], result['material']),
            'suggestions': result['suggestions'],
            'all_predictions': result['all_predictions']
        })
        
    except Exception as e:
        logger.error(f"Error in recognize_material: {e}")
        return jsonify({
            'success': False,
            'message': f'Error interno del servidor: {str(e)}'
        }), 500

@app.route('/api/train-model', methods=['POST'])
def train_model():
    """Endpoint to retrain model with new data (for future use)"""
    return jsonify({
        'success': False,
        'message': 'Entrenamiento de modelo no implementado en esta versión demo'
    })

if __name__ == '__main__':
    logger.info("Starting Material Recognition AI Service...")
    logger.info("Available materials: " + ", ".join(MATERIAL_CLASSES.values()))
    app.run(host='0.0.0.0', port=5000, debug=True)
# Material Recognition AI Service

This Python service provides AI-powered material recognition for the EcoRewards recycling platform. It uses computer vision and machine learning to identify recyclable materials from camera images.

## Features

- **Real-time Material Recognition**: Identifies plastic, paper, glass, aluminum, and electronics
- **Confidence Scoring**: Provides confidence levels for predictions
- **Multiple Suggestions**: Returns alternative material possibilities
- **REST API**: Easy integration with the React frontend
- **Heuristic Classification**: Uses visual features for reliable material identification

## Supported Materials

- **Plastic (PET)**: Bottles, containers, packaging
- **Paper/Cardboard**: Documents, boxes, newspapers
- **Glass**: Bottles, jars, containers
- **Aluminum**: Cans, foil, containers
- **Electronics**: Phones, computers, components

## Installation

1. **Create virtual environment**:
```bash
cd python-ai-service
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. **Install dependencies**:
```bash
pip install -r requirements.txt
```

3. **Run the service**:
```bash
python app.py
```

The service will start on `http://localhost:5000`

## API Endpoints

### Health Check
```
GET /api/health
```

### Material Recognition
```
POST /api/recognize-material
Content-Type: multipart/form-data
Body: image file
```

**Response**:
```json
{
  "success": true,
  "material": "plastic",
  "confidence": 0.85,
  "material_name": "Plástico (PET)",
  "suggestions": ["paper", "aluminum"],
  "all_predictions": {
    "plastic": 0.85,
    "paper": 0.10,
    "glass": 0.03,
    "aluminum": 0.02,
    "electronic": 0.00
  }
}
```

## How It Works

### 1. Image Preprocessing
- Resizes images to standard dimensions
- Normalizes pixel values
- Converts to appropriate color spaces

### 2. Feature Extraction
- **Color Analysis**: Mean RGB values and histograms
- **Texture Analysis**: Laplacian variance for surface texture
- **Brightness Analysis**: Overall luminance characteristics

### 3. Heuristic Classification
- **Glass**: High brightness variation, reflective properties
- **Aluminum**: Metallic appearance, gray tones, high reflectivity
- **Paper**: Light colors, low texture variance
- **Plastic**: Varied colors, medium texture complexity
- **Electronics**: Dark colors, complex surface patterns

### 4. Confidence Scoring
- Normalizes predictions across all material types
- Provides confidence levels based on feature matching
- Returns alternative suggestions for uncertain classifications

## Improving Accuracy

### For Production Use:
1. **Collect Training Data**: Gather labeled images of each material type
2. **Train Custom Model**: Use TensorFlow/Keras with your specific dataset
3. **Data Augmentation**: Rotate, scale, and adjust lighting in training images
4. **Transfer Learning**: Use pre-trained models like MobileNet or ResNet
5. **Ensemble Methods**: Combine multiple models for better accuracy

### Tips for Better Recognition:
- **Good Lighting**: Ensure materials are well-lit
- **Clean Background**: Use neutral backgrounds when possible
- **Close-up Shots**: Fill the frame with the material
- **Multiple Angles**: Try different perspectives for unclear results

## Integration with Frontend

The React frontend automatically connects to this service when users click the "Escanear" button. The service processes camera images and returns material classifications in real-time.

## Development

### Adding New Materials:
1. Update `MATERIAL_CLASSES` and `MATERIAL_NAMES` dictionaries
2. Add classification logic in `classify_by_heuristics()`
3. Update the frontend material options

### Improving Classification:
1. Modify feature extraction in `extract_features()`
2. Adjust heuristic rules in `classify_by_heuristics()`
3. Add new visual features (edges, shapes, etc.)

## Troubleshooting

### Common Issues:
- **OpenCV Installation**: May require system dependencies on Linux
- **TensorFlow GPU**: Requires CUDA for GPU acceleration
- **CORS Errors**: Ensure Flask-CORS is properly configured
- **Image Format**: Supports JPEG, PNG, WebP formats

### Performance Optimization:
- Use smaller image sizes for faster processing
- Implement image caching for repeated requests
- Consider using TensorFlow Lite for mobile deployment

## Future Enhancements

- **Deep Learning Models**: Train CNN models on large datasets
- **Real-time Video**: Process video streams for continuous recognition
- **Multi-object Detection**: Identify multiple materials in one image
- **Quality Assessment**: Evaluate material condition and recyclability
- **Barcode Integration**: Combine with barcode scanning for product identification

## License

This AI service is part of the EcoRewards platform and follows the same MIT license.
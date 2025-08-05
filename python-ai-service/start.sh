#!/bin/bash

# Material Recognition AI Service Startup Script

echo "🤖 Starting EcoRewards Material Recognition AI Service..."

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install/update dependencies
echo "📚 Installing dependencies..."
pip install -r requirements.txt

# Create models directory
mkdir -p models

# Start the Flask service
echo "🚀 Starting AI service on http://localhost:5000"
echo "📸 Ready to recognize recyclable materials!"
echo "🔗 Frontend integration: Camera recognition enabled"
echo ""
echo "Supported materials:"
echo "  🥤 Plastic (PET)"
echo "  📄 Paper/Cardboard" 
echo "  🍾 Glass"
echo "  🥫 Aluminum"
echo "  📱 Electronics"
echo ""

python app.py
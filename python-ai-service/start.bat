@echo off
echo 🤖 Starting EcoRewards Material Recognition AI Service...

REM Check if virtual environment exists
if not exist "venv" (
    echo 📦 Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo 🔧 Activating virtual environment...
call venv\Scripts\activate

REM Install/update dependencies
echo 📚 Installing dependencies...
pip install -r requirements.txt

REM Create models directory
if not exist "models" mkdir models

REM Start the Flask service
echo 🚀 Starting AI service on http://localhost:5000
echo 📸 Ready to recognize recyclable materials!
echo 🔗 Frontend integration: Camera recognition enabled
echo.
echo Supported materials:
echo   🥤 Plastic (PET)
echo   📄 Paper/Cardboard
echo   🍾 Glass
echo   🥫 Aluminum
echo   📱 Electronics
echo.

python app.py
pause
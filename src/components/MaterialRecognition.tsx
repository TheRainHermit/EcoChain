import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera, Upload, X, CheckCircle, AlertCircle, RotateCcw } from 'lucide-react';

interface MaterialRecognitionProps {
  onMaterialDetected: (material: string, confidence: number) => void;
  onClose: () => void;
}

interface RecognitionResult {
  material: string;
  confidence: number;
  suggestions?: string[];
}

const MATERIAL_LABELS = {
  plastic: 'Plástico (PET)',
  paper: 'Papel/Cartón',
  glass: 'Vidrio',
  aluminum: 'Aluminio',
  electronic: 'Electrónicos'
};

export const MaterialRecognition: React.FC<MaterialRecognitionProps> = ({
  onMaterialDetected,
  onClose
}) => {
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<RecognitionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [useCamera, setUseCamera] = useState(true);

  const analyzeImage = async (imageData: string) => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      // Convert base64 to blob
      const response = await fetch(imageData);
      const blob = await response.blob();
      
      // Create FormData for the Python backend
      const formData = new FormData();
      formData.append('image', blob, 'material.jpg');
      
      // Send to Python AI service
      const analysisResponse = await fetch('http://localhost:5000/api/recognize-material', {
        method: 'POST',
        body: formData,
      });
      
      if (!analysisResponse.ok) {
        throw new Error('Error en el análisis de imagen');
      }
      
      const analysisResult = await analysisResponse.json();
      
      if (analysisResult.success) {
        const recognitionResult: RecognitionResult = {
          material: analysisResult.material,
          confidence: analysisResult.confidence,
          suggestions: analysisResult.suggestions
        };
        
        setResult(recognitionResult);
        
        // Auto-select if confidence is high enough
        if (analysisResult.confidence > 0.8) {
          setTimeout(() => {
            onMaterialDetected(analysisResult.material, analysisResult.confidence);
          }, 2000);
        }
      } else {
        setError(analysisResult.message || 'No se pudo reconocer el material');
      }
    } catch (error) {
      console.error('Error analyzing image:', error);
      setError('Error al conectar con el servicio de reconocimiento. Asegúrate de que el servidor Python esté ejecutándose.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const capturePhoto = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
      analyzeImage(imageSrc);
    }
  }, [webcamRef]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setCapturedImage(imageData);
        analyzeImage(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setResult(null);
    setError(null);
  };

  const confirmSelection = () => {
    if (result) {
      onMaterialDetected(result.material, result.confidence);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <Camera className="h-6 w-6 mr-2 text-green-500" />
              Reconocimiento de Material
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          {/* Mode Toggle */}
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setUseCamera(true)}
              className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                useCamera 
                  ? 'bg-white text-gray-800 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Camera className="h-4 w-4 inline mr-2" />
              Cámara
            </button>
            <button
              onClick={() => setUseCamera(false)}
              className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                !useCamera 
                  ? 'bg-white text-gray-800 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Upload className="h-4 w-4 inline mr-2" />
              Subir imagen
            </button>
          </div>

          {/* Camera/Upload Section */}
          {!capturedImage && (
            <div className="mb-6">
              {useCamera ? (
                <div className="relative">
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    className="w-full rounded-lg"
                    videoConstraints={{
                      width: 640,
                      height: 480,
                      facingMode: "environment"
                    }}
                  />
                  <div className="absolute inset-0 border-2 border-dashed border-green-400 rounded-lg pointer-events-none">
                    <div className="absolute inset-4 border border-green-400 rounded-lg">
                      <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-green-400"></div>
                      <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-green-400"></div>
                      <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-green-400"></div>
                      <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-green-400"></div>
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <button
                      onClick={capturePhoto}
                      disabled={isAnalyzing}
                      className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-colors disabled:opacity-50"
                    >
                      <Camera className="h-6 w-6" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Selecciona una imagen del material reciclable</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Seleccionar imagen
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Captured Image */}
          {capturedImage && (
            <div className="mb-6">
              <div className="relative">
                <img 
                  src={capturedImage} 
                  alt="Material capturado" 
                  className="w-full rounded-lg"
                />
                <button
                  onClick={retakePhoto}
                  className="absolute top-2 right-2 bg-white hover:bg-gray-100 p-2 rounded-full shadow-lg transition-colors"
                >
                  <RotateCcw className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            </div>
          )}

          {/* Analysis Status */}
          {isAnalyzing && (
            <div className="text-center py-8">
              <div className="inline-flex items-center space-x-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                <span className="text-lg text-gray-600">Analizando material...</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Usando inteligencia artificial para identificar el tipo de material
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-red-800">Error de reconocimiento</h4>
                  <p className="text-red-700 mt-1">{error}</p>
                  <button
                    onClick={retakePhoto}
                    className="mt-2 text-red-600 hover:text-red-800 font-medium"
                  >
                    Intentar de nuevo
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          {result && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-semibold text-green-800 mb-2">
                    Material detectado: {MATERIAL_LABELS[result.material as keyof typeof MATERIAL_LABELS]}
                  </h4>
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-green-700">Confianza</span>
                      <span className="text-sm font-medium text-green-800">
                        {(result.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-green-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${result.confidence * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {result.suggestions && result.suggestions.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm text-green-700 mb-2">Otras posibilidades:</p>
                      <div className="flex flex-wrap gap-2">
                        {result.suggestions.map((suggestion, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
                          >
                            {MATERIAL_LABELS[suggestion as keyof typeof MATERIAL_LABELS] || suggestion}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          {!capturedImage && !isAnalyzing && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-blue-800 mb-2">Consejos para mejor reconocimiento:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Asegúrate de que el material esté bien iluminado</li>
                <li>• Coloca el objeto sobre un fondo neutro</li>
                <li>• Mantén la cámara estable y enfocada</li>
                <li>• El material debe ocupar la mayor parte de la imagen</li>
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            {result && (
              <button
                onClick={confirmSelection}
                className="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
              >
                Usar este material
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
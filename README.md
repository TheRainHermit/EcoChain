# 🌱 EcoChain - Plataforma de Reciclaje con Recompensas en Blockchain

EcoChain es una aplicación descentralizada (DApp) que incentiva el reciclaje mediante un sistema de recompensas con criptomonedas (EcoCoins) y NFTs. La plataforma combina tecnología blockchain, inteligencia artificial y un sistema de puntos para promover prácticas sostenibles.

## 🌟 Características Principales

- **Recompensas en Criptomonedas**: Gana EcoCoins (basados en ETH) por reciclar
- **Sistema de EcoPuntos**: Los materiales reciclados se convierten en puntos canjeables
- **NFTs Exclusivos**: Desbloquea NFTs únicos por logros de reciclaje
- **Asistente de IA**: Chatbot inteligente que ofrece consejos personalizados de reciclaje
- **Seguimiento de Materiales**: Soporte para plástico, papel, vidrio, aluminio y electrónicos
- **Conversión en Tiempo Real**: Visualización del valor de las recompensas en USD
- **Historial de Transacciones**: Registro completo de todas las actividades de reciclaje
- **Integración de Billetera**: Conexión con MetaMask para transacciones seguras
- **Diseño Adaptativo**: Interfaz optimizada para dispositivos móviles y de escritorio

## 🏗️ Arquitectura del Proyecto

### Frontend (React + TypeScript)
- React 18 con TypeScript
- Estilizado con Tailwind CSS
- Integración Web3 con ethers.js
- Conexión con MetaMask
- Diseño responsive con enfoque mobile-first

### Backend (Node.js + Express)
- API REST para gestión de transacciones
- Almacenamiento en memoria (extensible a base de datos)
- Configuración CORS para peticiones cruzadas
- Manejo de errores y registro de actividades

### Contratos Inteligentes (Solidity)
- Funcionalidad ERC-721 para NFTs
- Cálculo y distribución de recompensas
- Protección contra reentrada
- Controles de acceso y medidas de seguridad

### Servicio de IA (Python)
- Modelos de IA para recomendaciones personalizadas
- API REST para integración con el frontend
- Procesamiento de lenguaje natural para el chatbot
- Sistema de aprendizaje automático para sugerencias de reciclaje

## 🚀 Comenzando

### Requisitos Previos
- Node.js 16+ y npm
- Python 3.8+
- MetaMask instalado en el navegador
- Git

### Instalación

1. **Clonar el repositorio**
```bash
git clone <repositorio-url>
cd EcoChain
```

2. **Instalar dependencias del frontend**
```bash
npm install
```

3. **Instalar dependencias del backend**
```bash
cd backend
npm install
cd ..
```

4. **Configurar el servicio de IA**
```bash
cd python-ai-service
pip install -r requirements.txt
cd ..
```

5. **Configurar variables de entorno**
```bash
cp backend/.env.example backend/.env
# Editar las variables según sea necesario
```

## 🚦 Ejecución

1. **Iniciar el servidor backend**
```bash
cd backend
npm run dev
```

2. **Iniciar el servicio de IA**
```bash
cd python-ai-service
python app.py
```

3. **Iniciar el frontend**
```bash
npm run dev
```

## 📱 Uso Básico

### Opciones de Billetera

EcoChain ofrece dos formas de gestionar tus activos:

#### 1. Billetera Custodial de EcoChain
Nuestra billetera integrada te permite gestionar tus EcoCoins y NFTs de forma segura sin necesidad de instalar software adicional.

**Características principales:**
- Creación de billetera con frase semilla de recuperación
- Almacenamiento seguro de claves privadas
- Interfaz web intuitiva
- Gestión de NFTs
- Historial de transacciones

**Para usar la billetera custodial:**
1. Ve a la sección de Billetera en la aplicación
2. Crea una nueva billetera o importa una existente
3. Asegúrate de guardar tu frase semilla de recuperación en un lugar seguro
4. ¡Listo! Ya puedes recibir y enviar EcoCoins y NFTs

#### 2. Billeteras Externas (MetaMask/Coinbase/Trust Wallet)
También puedes conectar tu billetera preferida compatible con la red Ethereum.

**Billeteras soportadas:**
- MetaMask (recomendado)
- Coinbase Wallet
- Trust Wallet
- Cualquier billetera compatible con EIP-1193

**Para conectar una billetera externa:**
1. Haz clic en "Conectar Billetera" en la esquina superior derecha
2. Selecciona tu proveedor de billetera
3. Autoriza la conexión en la ventana emergente
4. Asegúrate de estar en la red correcta (Ethereum Mainnet o la red de pruebas correspondiente)

### Flujo de Reciclaje

1. **Conecta tu billetera** (EcoChain o externa)
2. **Selecciona Material**: Elige el tipo de material reciclable
3. **Ingresa el Peso**: Especifica el peso en kilogramos
4. **Calcula tu Recompensa**: Visualiza la cantidad de EcoCoins que ganarás
5. **Confirma el Depósito**: Firma la transacción con tu billetera
6. **Sigue tu Progreso**: Monitorea tu saldo, NFTs e historial de reciclaje

## 🛠️ Stack Tecnológico

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Blockchain**: Ethereum, Solidity, Hardhat
- **Billetera**: Python (Flask), Web3.js, ethers.js
- **IA/ML**: Python, Transformers, Scikit-learn
- **Web3**: ethers.js, MetaMask, Web3Modal
- **Herramientas**: Vite, ESLint, Prettier

## 🔒 Seguridad

### Billetera Custodial
- Las claves privadas se cifran antes de almacenarse
- Autenticación de dos factores opcional
- Frases de recuperación generadas localmente
- Transacciones firmadas en el navegador del usuario

### Billeteras Externas
- Conexión segura mediante proveedores Web3
- Las claves privadas nunca abandonan tu dispositivo
- Compatible con hardware wallets para máxima seguridad
- Transacciones firmadas directamente en tu billetera

## 🧠 Servicio de IA

El módulo de IA de EcoChain incluye:
- Chatbot interactivo para resolver dudas sobre reciclaje
- Recomendaciones personalizadas basadas en el historial de reciclaje
- Clasificación automática de materiales
- Análisis de patrones de reciclaje

## 📈 Próximos Pasos

- [ ] Desarrollo de aplicación móvil nativa
- [ ] Integración con estaciones de reciclaje físicas
- [ ] Soporte para múltiples cadenas de bloques (Polygon, BSC)
- [ ] Gobernanza DAO para tasas de recompensa
- [ ] Alianzas con empresas de reciclaje
- [ ] Mercado para comercio de NFTs
- [ ] Juego de EcoChain estilo Pokémon GO para incentivar el reciclaje

## 🤝 Contribuir

1. Buscamos inversores que permitan que el desarrollo del proyecto sea sostenible.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 🙏 Agradecimientos

- A todos los contribuyentes que han ayudado a hacer de EcoChain una realidad
- A los usuarios que creen en un futuro más sostenible a través de la tecnología
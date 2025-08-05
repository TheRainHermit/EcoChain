-- Tabla de usuarios
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    wallet_address VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Catálogo de materiales reciclables
CREATE TABLE material (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT
);

-- Ubicaciones (ciudades, barrios, etc.)
CREATE TABLE ubicacion (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    ciudad VARCHAR(100) NOT NULL,
    direccion TEXT
);

-- Puntos de reciclaje (asociados a una ubicación)
CREATE TABLE punto_reciclaje (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    ubicacion_id INTEGER REFERENCES ubicacion(id) ON DELETE CASCADE,
    descripcion TEXT,
    horario VARCHAR(100)
);

-- Transacciones de reciclaje
CREATE TABLE recycling_transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    material_id INTEGER REFERENCES material(id) ON DELETE SET NULL,
    punto_reciclaje_id INTEGER REFERENCES punto_reciclaje(id) ON DELETE SET NULL,
    weight_kg NUMERIC(10,3) NOT NULL,
    eco_points INTEGER NOT NULL,
    eco_coins NUMERIC(18,8) NOT NULL,
    tx_hash VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Transacciones de la billetera (EcoCoins, EcoPoints, etc.)
CREATE TABLE wallet_transactions (
    id SERIAL PRIMARY KEY,
    sender VARCHAR(128),
    recipient VARCHAR(128),
    amount NUMERIC NOT NULL,
    crypto VARCHAR(8) NOT NULL,
    type VARCHAR(32) NOT NULL, -- 'recycling', 'marketplace', 'conversion', etc.
    reference_id INTEGER,      -- ID de la transacción relacionada (ej: recycling_transactions.id)
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Consulta para obtener el balance de un usuario en EcoCoins
-- Esta consulta asume que el usuario tiene una dirección de billetera única
-- y que las transacciones están registradas en la tabla wallet_transactions.
SELECT
  COALESCE(SUM(
    CASE WHEN recipient = $1 THEN amount
         WHEN sender = $1 THEN -amount
         ELSE 0 END
  ), 0) AS balance
FROM wallet_transactions
WHERE crypto = 'ECO';

-- Recomendaciones dinámicas
CREATE TABLE recommendations (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    valid_from TIMESTAMP DEFAULT NOW(),
    valid_to TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- NFTs obtenidos por el usuario
CREATE TABLE user_nfts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    token_id VARCHAR(100) NOT NULL,
    metadata JSONB,
    minted_at TIMESTAMP DEFAULT NOW()
);

-- Marketplace de NFTs
CREATE TABLE marketplace_listings (
    id SERIAL PRIMARY KEY,
    nft_id INTEGER REFERENCES user_nfts(id) ON DELETE CASCADE,
    seller_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    price_eth NUMERIC(18,8) NOT NULL,
    status VARCHAR(20) DEFAULT 'active', -- active, sold, cancelled
    created_at TIMESTAMP DEFAULT NOW(),
    sold_at TIMESTAMP
);

-- Transacciones de NFTs (compras, ventas, transferencias)
CREATE TABLE nft_transactions (
    id SERIAL PRIMARY KEY,
    nft_id INTEGER REFERENCES user_nfts(id) ON DELETE CASCADE,
    from_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    to_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    tx_type VARCHAR(32) NOT NULL, -- 'mint', 'transfer', 'marketplace_sale', etc.
    price_eth NUMERIC(18,8),
    tx_hash VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Conversión de EcoPoints a EcoCoins
CREATE TABLE ecopoint_conversions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    eco_points INTEGER NOT NULL,
    eco_coins NUMERIC(18,8) NOT NULL,
    converted_at TIMESTAMP DEFAULT NOW()
);

-- Logs del chatbot para análisis y mejora
CREATE TABLE chatbot_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Índices útiles
CREATE INDEX idx_user_wallet ON users(wallet_address);
CREATE INDEX idx_recommendations_active ON recommendations(is_active);
CREATE INDEX idx_marketplace_status ON marketplace_listings(status);
CREATE INDEX idx_punto_reciclaje_ubicacion ON punto_reciclaje(ubicacion_id);
CREATE INDEX idx_recycling_transactions_user ON recycling_transactions(user_id);
CREATE INDEX idx_recycling_transactions_material ON recycling_transactions(material_id);
CREATE INDEX idx_recycling_transactions_punto ON recycling_transactions(punto_reciclaje_id);

-- Materiales reciclables
INSERT INTO material (name, description) VALUES
  ('Plástico (PET)', 'Botellas, envases y otros productos de plástico tipo PET'),
  ('Papel/Cartón', 'Hojas, cajas, periódicos y cartón corrugado'),
  ('Vidrio', 'Botellas, frascos y recipientes de vidrio'),
  ('Aluminio', 'Latas de bebidas, papel aluminio y otros productos de aluminio'),
  ('Electrónicos', 'Pequeños aparatos electrónicos, cables y baterías');

-- Ubicaciones (ciudades/barrios)
INSERT INTO ubicacion (nombre, ciudad, direccion) VALUES
  ('Centro', 'Ciudad Verde', 'Av. Principal 123'),
  ('Norte', 'Ciudad Verde', 'Calle 45 #67-89'),
  ('Sur', 'Ciudad Verde', 'Carrera 10 #20-30'),
  ('Parque Industrial', 'Ciudad Azul', 'Zona Industrial, Bodega 5');

-- Puntos de reciclaje
INSERT INTO punto_reciclaje (nombre, ubicacion_id, descripcion, horario) VALUES
  ('Punto Ecológico Central', 1, 'Punto principal en el centro de la ciudad', 'Lunes a Sábado 8:00-18:00'),
  ('Recicla Norte', 2, 'Punto de reciclaje en el sector norte', 'Lunes a Viernes 9:00-17:00'),
  ('EcoSur', 3, 'Punto de reciclaje en el sur', 'Todos los días 7:00-19:00'),
  ('Punto Industrial Azul', 4, 'Reciclaje para empresas y fábricas', 'Lunes a Viernes 8:00-16:00');

-- Recomendaciones dinámicas
INSERT INTO recommendations (text, valid_from, is_active) VALUES
  ('Reduce el uso de plásticos de un solo uso llevando tu propia bolsa reutilizable.', NOW(), TRUE),
  ('Asegúrate de limpiar los envases antes de reciclarlos para evitar contaminación.', NOW(), TRUE),
  ('Participa en los retos de reciclaje mensuales y gana EcoPoints extra.', NOW(), TRUE),
  ('Recicla tus electrónicos en puntos certificados para evitar daños ambientales.', NOW(), TRUE),
  ('Aplasta las cajas de cartón para optimizar el espacio en el contenedor.', NOW(), TRUE);
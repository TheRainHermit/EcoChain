/*import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import FormData from 'form-data';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

// Middleware para validar JWT:
function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
}

// --- Usuarios ---
app.get('/api/users/:wallet_address', async (req, res) => {
  const { wallet_address } = req.params;
  const result = await pool.query('SELECT * FROM users WHERE wallet_address = $1', [wallet_address]);
  res.json(result.rows[0] || null);
});

app.post('/api/users', async (req, res) => {
  const { wallet_address, email } = req.body;
  if (!wallet_address) return res.status(400).json({ error: 'wallet_address required' });
  const result = await pool.query(
    'INSERT INTO users (wallet_address, email) VALUES ($1, $2) ON CONFLICT (wallet_address) DO NOTHING RETURNING *',
    [wallet_address, email]
  );
  res.json(result.rows[0] || null);
});

// --- Registro a la wallet custodial de EcoChain ---
app.post('/api/custodial/register', async (req, res) => {
  const { email, password, mnemonic } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña requeridos.' });
  }

  try {
    // Verifica si el email ya existe
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'El email ya está registrado.' });
    }

    // Genera mnemonic si no viene (puedes usar una librería real en producción)
    const userMnemonic = mnemonic || randomBytes(16).toString('hex');
    // Crea una wallet_address simulada
    const wallet_address = 'eco_' + randomBytes(8).toString('hex');

    // Guarda el usuario (ajusta la tabla según tu modelo)
    const result = await pool.query(
      'INSERT INTO users (wallet_address, email, password, mnemonic) VALUES ($1, $2, $3, $4) RETURNING id, wallet_address, email',
      [wallet_address, email, password, userMnemonic]
    );

    res.json({
      wallet_address,
      mnemonic: userMnemonic
    });
  } catch (err) {
    console.error('Error en /api/custodial/register:', err);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

// --- Materiales reciclables ---
app.get('/api/materials', async (req, res) => {
  const result = await pool.query('SELECT * FROM material ORDER BY name');
  res.json(result.rows);
});

app.get('/api/materials/:id', async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('SELECT * FROM material WHERE id = $1', [id]);
  res.json(result.rows[0] || null);
});

// --- Ubicaciones y puntos de reciclaje ---
app.get('/api/ubicaciones', async (req, res) => {
  const result = await pool.query('SELECT * FROM ubicacion ORDER BY ciudad, nombre');
  res.json(result.rows);
});

app.get('/api/puntos-reciclaje', async (req, res) => {
  const result = await pool.query(
    `SELECT p.*, u.nombre as ubicacion_nombre, u.ciudad, u.direccion
     FROM punto_reciclaje p
     JOIN ubicacion u ON p.ubicacion_id = u.id
     ORDER BY p.nombre`
  );
  res.json(result.rows);
});

app.get('/api/puntos-reciclaje/:id', async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(
    `SELECT p.*, u.nombre as ubicacion_nombre, u.ciudad, u.direccion
     FROM punto_reciclaje p
     JOIN ubicacion u ON p.ubicacion_id = u.id
     WHERE p.id = $1`, [id]
  );
  res.json(result.rows[0] || null);
});

// --- Transacciones de reciclaje ---
app.get('/api/recycling-transactions/:wallet_address', async (req, res) => {
  const { wallet_address } = req.params;
  const user = await pool.query('SELECT id FROM users WHERE wallet_address = $1', [wallet_address]);
  if (!user.rows[0]) return res.json([]);
  const user_id = user.rows[0].id;
  const result = await pool.query(
    `SELECT rt.*, m.name as material_name, p.nombre as punto_nombre
     FROM recycling_transactions rt
     LEFT JOIN material m ON rt.material_id = m.id
     LEFT JOIN punto_reciclaje p ON rt.punto_reciclaje_id = p.id
     WHERE rt.user_id = $1
     ORDER BY rt.created_at DESC`, [user_id]
  );
  res.json(result.rows);
});

app.post('/api/recycling-transactions', async (req, res) => {
  const { wallet_address, material_id, punto_reciclaje_id, weight_kg, eco_points, eco_coins, tx_hash, image } = req.body;
  if (!wallet_address || !material_id || !punto_reciclaje_id || !weight_kg || !eco_points || !eco_coins) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Validación opcional con python-ai-service
  if (image) {
    const form = new FormData();
    form.append('image', Buffer.from(image, 'base64'), { filename: 'material.jpg' });
    const response = await fetch('http://localhost:5000/api/recognize-material', {
      method: 'POST',
      body: form,
    });
    const result = await response.json();
    if (!result.success) {
      return res.status(400).json({ error: 'Material no reconocido por IA' });
    }
    // Puedes usar result.material para validar material_id
  }

  const user = await pool.query('SELECT id FROM users WHERE wallet_address = $1', [wallet_address]);
  if (!user.rows[0]) return res.status(400).json({ error: 'User not found' });
  const user_id = user.rows[0].id;
  const result = await pool.query(
    `INSERT INTO recycling_transactions (user_id, material_id, punto_reciclaje_id, weight_kg, eco_points, eco_coins, tx_hash)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [user_id, material_id, punto_reciclaje_id, weight_kg, eco_points, eco_coins, tx_hash]
  );
  res.json(result.rows[0]);
});

// --- Recomendaciones ---
app.get('/api/recommendations', async (req, res) => {
  const result = await pool.query('SELECT * FROM recommendations WHERE is_active = TRUE ORDER BY created_at DESC');
  res.json(result.rows);
});

app.post('/api/recommendations', async (req, res) => {
  const { text, valid_from, valid_to, is_active } = req.body;
  if (!text) return res.status(400).json({ error: 'Text required' });
  const result = await pool.query(
    `INSERT INTO recommendations (text, valid_from, valid_to, is_active)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [text, valid_from || new Date(), valid_to, is_active !== undefined ? is_active : true]
  );
  res.json(result.rows[0]);
});

app.put('/api/recommendations/:id', async (req, res) => {
  const { id } = req.params;
  const { text, valid_from, valid_to, is_active } = req.body;
  const result = await pool.query(
    `UPDATE recommendations SET text = $1, valid_from = $2, valid_to = $3, is_active = $4 WHERE id = $5 RETURNING *`,
    [text, valid_from, valid_to, is_active, id]
  );
  res.json(result.rows[0]);
});

app.delete('/api/recommendations/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM recommendations WHERE id = $1', [id]);
  res.json({ success: true });
});

// --- NFTs y Marketplace ---
app.get('/api/nfts/:wallet_address', async (req, res) => {
  const { wallet_address } = req.params;
  const user = await pool.query('SELECT id FROM users WHERE wallet_address = $1', [wallet_address]);
  if (!user.rows[0]) return res.json([]);
  const user_id = user.rows[0].id;
  const result = await pool.query('SELECT * FROM user_nfts WHERE user_id = $1 ORDER BY minted_at DESC', [user_id]);
  res.json(result.rows);
});

app.post('/api/nfts', async (req, res) => {
  const { wallet_address, token_id, metadata } = req.body;
  if (!wallet_address || !token_id) return res.status(400).json({ error: 'Missing required fields' });
  const user = await pool.query('SELECT id FROM users WHERE wallet_address = $1', [wallet_address]);
  if (!user.rows[0]) return res.status(400).json({ error: 'User not found' });
  const user_id = user.rows[0].id;
  const result = await pool.query(
    `INSERT INTO user_nfts (user_id, token_id, metadata) VALUES ($1, $2, $3) RETURNING *`,
    [user_id, token_id, metadata || {}]
  );
  res.json(result.rows[0]);
});

app.get('/api/marketplace', async (req, res) => {
  const result = await pool.query(
    `SELECT ml.*, un.token_id, un.metadata, u.wallet_address as seller_wallet
     FROM marketplace_listings ml
     JOIN user_nfts un ON ml.nft_id = un.id
     LEFT JOIN users u ON ml.seller_id = u.id
     ORDER BY ml.created_at DESC`
  );
  res.json(result.rows);
});

app.post('/api/marketplace', async (req, res) => {
  const { nft_id, seller_wallet, price_eth } = req.body;
  if (!nft_id || !seller_wallet || !price_eth) return res.status(400).json({ error: 'Missing required fields' });
  const user = await pool.query('SELECT id FROM users WHERE wallet_address = $1', [seller_wallet]);
  if (!user.rows[0]) return res.status(400).json({ error: 'Seller not found' });
  const seller_id = user.rows[0].id;
  const result = await pool.query(
    `INSERT INTO marketplace_listings (nft_id, seller_id, price_eth) VALUES ($1, $2, $3) RETURNING *`,
    [nft_id, seller_id, price_eth]
  );
  res.json(result.rows[0]);
});

app.post('/api/marketplace/buy/:listing_id', async (req, res) => {
  const { listing_id } = req.params;
  const result = await pool.query(
    `UPDATE marketplace_listings SET status = 'sold', sold_at = NOW() WHERE id = $1 RETURNING *`,
    [listing_id]
  );
  res.json(result.rows[0]);
});

// --- Conversión EcoPoints/EcoCoins ---
app.get('/api/ecopoint-conversions/:wallet_address', async (req, res) => {
  const { wallet_address } = req.params;
  const user = await pool.query('SELECT id FROM users WHERE wallet_address = $1', [wallet_address]);
  if (!user.rows[0]) return res.json([]);
  const user_id = user.rows[0].id;
  const result = await pool.query(
    'SELECT * FROM ecopoint_conversions WHERE user_id = $1 ORDER BY converted_at DESC',
    [user_id]
  );
  res.json(result.rows);
});

app.post('/api/ecopoint-conversions', async (req, res) => {
  const { wallet_address, eco_points, eco_coins } = req.body;
  if (!wallet_address || !eco_points || !eco_coins) return res.status(400).json({ error: 'Missing required fields' });
  const user = await pool.query('SELECT id FROM users WHERE wallet_address = $1', [wallet_address]);
  if (!user.rows[0]) return res.status(400).json({ error: 'User not found' });
  const user_id = user.rows[0].id;
  const result = await pool.query(
    `INSERT INTO ecopoint_conversions (user_id, eco_points, eco_coins) VALUES ($1, $2, $3) RETURNING *`,
    [user_id, eco_points, eco_coins]
  );
  res.json(result.rows[0]);
});

// --- Chatbot ---
app.post('/api/chatbot', async (req, res) => {
  const { wallet_address, question } = req.body;
  if (!question) return res.status(400).json({ error: 'Question required' });
  // Simulación de respuesta
  const answer = "¡Reciclar es el primer paso hacia un futuro sostenible!";
  let user_id = null;
  if (wallet_address) {
    const user = await pool.query('SELECT id FROM users WHERE wallet_address = $1', [wallet_address]);
    if (user.rows[0]) user_id = user.rows[0].id;
  }
  await pool.query(
    `INSERT INTO chatbot_logs (user_id, question, answer) VALUES ($1, $2, $3)`,
    [user_id, question, answer]
  );
  res.json({ answer });
});

app.get('/api/chatbot/logs/:wallet_address', async (req, res) => {
  const { wallet_address } = req.params;
  const user = await pool.query('SELECT id FROM users WHERE wallet_address = $1', [wallet_address]);
  if (!user.rows[0]) return res.json([]);
  const user_id = user.rows[0].id;
  const result = await pool.query(
    'SELECT * FROM chatbot_logs WHERE user_id = $1 ORDER BY created_at DESC',
    [user_id]
  );
  res.json(result.rows);
});

// --- Balance de Wallet ---
app.get('/api/wallet/balance/:wallet_address', async (req, res) => {
  const { wallet_address } = req.params;
  const result = await pool.query(`
    SELECT
      COALESCE(SUM(
        CASE WHEN recipient = $1 THEN amount
             WHEN sender = $1 THEN -amount
             ELSE 0 END
      ), 0) AS balance
    FROM wallet_transactions
    WHERE crypto = 'ECO'
  `, [wallet_address]);
  res.json({ balance: result.rows[0].balance });
});

// --- Historial de transacciones ---
app.get('/api/wallet/transactions/:wallet_address', async (req, res) => {
  const { wallet_address } = req.params;
  const result = await pool.query(`
    SELECT * FROM wallet_transactions
    WHERE sender = $1 OR recipient = $1
    ORDER BY timestamp DESC
  `, [wallet_address]);
  res.json(result.rows);
});

// Transferir EcoCoins entre usuarios
app.post('/api/wallet/transfer', async (req, res) => {
  const { sender, recipient, amount, crypto } = req.body;
  if (!sender || !recipient || !amount || !crypto) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  // Validar saldo suficiente
  const balanceResult = await pool.query(`
    SELECT COALESCE(SUM(
      CASE WHEN recipient = $1 THEN amount
           WHEN sender = $1 THEN -amount
           ELSE 0 END
    ), 0) AS balance
    FROM wallet_transactions
    WHERE crypto = $2
  `, [sender, crypto]);
  if (parseFloat(balanceResult.rows[0].balance) < amount) {
    return res.status(400).json({ error: 'Saldo insuficiente' });
  }
  // Registrar la transferencia
  const result = await pool.query(`
    INSERT INTO wallet_transactions (sender, recipient, amount, crypto, type)
    VALUES ($1, $2, $3, $4, 'transfer') RETURNING *
  `, [sender, recipient, amount, crypto]);
  res.json(result.rows[0]);
});

// --- Mintear (crear) un NFT
app.post('/api/nfts/mint', async (req, res) => {
  const { wallet_address, token_id, metadata } = req.body;
  if (!wallet_address || !token_id) return res.status(400).json({ error: 'Missing required fields' });
  const user = await pool.query('SELECT id FROM users WHERE wallet_address = $1', [wallet_address]);
  if (!user.rows[0]) return res.status(400).json({ error: 'User not found' });
  const user_id = user.rows[0].id;
  // Insertar NFT
  const nftResult = await pool.query(
    `INSERT INTO user_nfts (user_id, token_id, metadata) VALUES ($1, $2, $3) RETURNING *`,
    [user_id, token_id, metadata || {}]
  );
  // Registrar minteo en nft_transactions
  await pool.query(
    `INSERT INTO nft_transactions (nft_id, from_user_id, to_user_id, tx_type)
     VALUES ($1, NULL, $2, 'mint')`,
    [nftResult.rows[0].id, user_id]
  );
  res.json(nftResult.rows[0]);
});

// --- Transferir un NFT ---
app.post('/api/nfts/transfer', async (req, res) => {
  const { nft_id, from_wallet, to_wallet } = req.body;
  if (!nft_id || !from_wallet || !to_wallet) return res.status(400).json({ error: 'Missing required fields' });
  const fromUser = await pool.query('SELECT id FROM users WHERE wallet_address = $1', [from_wallet]);
  const toUser = await pool.query('SELECT id FROM users WHERE wallet_address = $1', [to_wallet]);
  if (!fromUser.rows[0] || !toUser.rows[0]) return res.status(400).json({ error: 'User not found' });
  // Cambiar propietario
  await pool.query('UPDATE user_nfts SET user_id = $1 WHERE id = $2 AND user_id = $3',
    [toUser.rows[0].id, nft_id, fromUser.rows[0].id]);
  // Registrar transferencia en nft_transactions
  await pool.query(
    `INSERT INTO nft_transactions (nft_id, from_user_id, to_user_id, tx_type)
     VALUES ($1, $2, $3, 'transfer')`,
    [nft_id, fromUser.rows[0].id, toUser.rows[0].id]
  );
  res.json({ success: true });
});

// --- Firmar transacciones con python-wallet ---
app.post('/api/wallet/sign', async (req, res) => {
  const { sender, recipient, amount, crypto } = req.body;
  // Llama al microservicio python-wallet para firmar la transacción
  const response = await fetch('http://localhost:5000/api/wallet/sign', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwtToken}` // jwtToken obtenido tras login
    },
    body: JSON.stringify({ sender, recipient, amount, crypto })
  });
  const data = await response.json();
  res.json(data);
});

// --- Health check ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// --- Error y 404 ---
app.use((error, req, res, next) => {
  res.status(500).json({ error: 'Something went wrong!' });
});

app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

export default app;*/
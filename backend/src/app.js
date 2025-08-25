import express, { json } from "express";
import cors from "cors";
import "dotenv/config";
const app = express();

app.use(cors()); // Habilita CORS para todas las rutas
app.use(json());

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`EcoChain backend escuchando en http://localhost:${PORT}`);
});

// ...otros middlewares y rutas...
app.use("/api", (await import("./routes/contact.js")).default);

// Ruta simple para saber que el backend está corriendo
app.get("/", (req, res) => {
  res.send("EcoChain backend corriendo 🚀");
});

// ...manejo de errores y export...
export default app;
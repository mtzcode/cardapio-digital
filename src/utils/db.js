import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Por favor, defina a variável de ambiente MONGODB_URI no arquivo .env.local"
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn; // Retorna a conexão existente
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true, // Compatibilidade com parsing de URLs antigas
      useUnifiedTopology: true, // Garante uso da topologia moderna do driver
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null; // Reseta o cache em caso de erro
    throw error;
  }

  return cached.conn;
}

export default connectToDatabase;

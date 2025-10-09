import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Opções de conexão (não são mais necessárias nas versões novas do Mongoose)
    })

    console.log(`✅ MongoDB conectado: ${conn.connection.host}`)
    console.log(`📦 Database: ${conn.connection.name}`)
  } catch (error) {
    console.error(`❌ Erro ao conectar ao MongoDB: ${error.message}`)
    process.exit(1)
  }
}

export default connectDB
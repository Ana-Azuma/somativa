import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/smpm',
      {
        // No Mongoose 6+, estas opções não são mais necessárias
      }
    )

    console.log(`✅ MongoDB conectado: ${conn.connection.host}`)
    console.log(`✅ Database: ${conn.connection.name}`)
    
  } catch (error) {
    console.error(`❌ Erro ao conectar ao MongoDB: ${error.message}`)
    process.exit(1)
  }
}

export default connectDB
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/database.js'
import userRoutes from './routes/users.js'
import machineRoutes from './routes/machines.js'
import maintenanceRoutes from './routes/maintenances.js'

// Configurações
dotenv.config()
const app = express()
const PORT = process.env.PORT || 3000

// Conectar ao MongoDB
connectDB()

// Middlewares
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Rotas
app.get('/', (req, res) => {
  res.json({ message: 'API do Sistema de Manutenção Preventiva de Máquinas' })
})

app.use('/api/users', userRoutes)
app.use('/api/machines', machineRoutes)
app.use('/api/maintenances', maintenanceRoutes)

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`)
  console.log(`📡 http://localhost:${PORT}`)
})
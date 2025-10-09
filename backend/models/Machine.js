import mongoose from 'mongoose'

const machineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nome da máquina é obrigatório'],
    unique: true,
    trim: true
  },
  sector: {
    type: String,
    required: [true, 'Setor é obrigatório'],
    enum: ['Produção', 'Embalagem', 'Logística', 'Qualidade'],
    default: 'Produção'
  },
  status: {
    type: String,
    enum: ['verde', 'amarelo', 'vermelho'],
    default: 'verde'
  },
  lastMaintenance: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String,
    trim: true
  },
  manufacturer: {
    type: String,
    trim: true
  },
  model: {
    type: String,
    trim: true
  },
  serialNumber: {
    type: String,
    trim: true
  },
  acquisitionDate: {
    type: Date
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

const Machine = mongoose.model('Machine', machineSchema)

export default Machine
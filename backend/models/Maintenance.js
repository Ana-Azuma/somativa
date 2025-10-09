import mongoose from 'mongoose'

const maintenanceSchema = new mongoose.Schema({
  machine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Machine',
    required: [true, 'Máquina é obrigatória']
  },
  machineName: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: [true, 'Data é obrigatória']
  },
  technician: {
    type: String,
    required: [true, 'Técnico é obrigatório'],
    trim: true
  },
  type: {
    type: String,
    enum: ['Preventiva', 'Corretiva', 'Preditiva'],
    required: [true, 'Tipo é obrigatório']
  },
  status: {
    type: String,
    enum: ['Agendada', 'Em Andamento', 'Concluída', 'Pendente'],
    default: 'Agendada'
  },
  description: {
    type: String,
    required: [true, 'Descrição é obrigatória'],
    trim: true
  },
  sector: {
    type: String,
    required: true
  },
  observations: {
    type: String,
    trim: true
  },
  cost: {
    type: Number,
    min: 0
  }
}, {
  timestamps: true
})

const Maintenance = mongoose.model('Maintenance', maintenanceSchema)

export default Maintenance
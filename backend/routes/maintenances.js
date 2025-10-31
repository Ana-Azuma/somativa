import express from 'express'
import Maintenance from '../models/Maintenance.js'
import Machine from '../models/Machine.js'

const router = express.Router()

// GET /api/maintenances - Listar todas as manutenções
router.get('/', async (req, res) => {
  try {
    const { status, type, machine } = req.query
    const filter = {}
    
    if (status) filter.status = status
    if (type) filter.type = type
    if (machine) filter.machine = machine
    
    const maintenances = await Maintenance.find(filter)
      .populate('machine', 'name sector status')
      .sort({ date: -1 })
    
    // ✅ CORREÇÃO: Formata os dados para o frontend
    const formattedMaintenances = maintenances.map(m => ({
      _id: m._id,
      id: m._id.toString(),
      machineId: m.machine._id.toString(),  // ✅ ID da máquina
      machine: m.machine.name,              // ✅ Nome da máquina
      machineName: m.machine.name,          // ✅ Nome da máquina (alias)
      sector: m.sector || m.machine.sector,
      date: m.date,
      technician: m.technician,
      type: m.type,
      status: m.status,
      description: m.description,
      createdAt: m.createdAt,
      updatedAt: m.updatedAt
    }))
    
    res.json({
      success: true,
      count: formattedMaintenances.length,
      data: formattedMaintenances
    })
  } catch (error) {
    console.error('❌ Erro ao buscar manutenções:', error)
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar manutenções',
      error: error.message
    })
  }
})

// GET /api/maintenances/:id - Buscar manutenção por ID
router.get('/:id', async (req, res) => {
  try {
    const maintenance = await Maintenance.findById(req.params.id)
      .populate('machine', 'name sector status')
    
    if (!maintenance) {
      return res.status(404).json({
        success: false,
        message: 'Manutenção não encontrada'
      })
    }
    
    // ✅ Formata os dados
    const formatted = {
      _id: maintenance._id,
      id: maintenance._id.toString(),
      machineId: maintenance.machine._id.toString(),
      machine: maintenance.machine.name,
      machineName: maintenance.machine.name,
      sector: maintenance.sector || maintenance.machine.sector,
      date: maintenance.date,
      technician: maintenance.technician,
      type: maintenance.type,
      status: maintenance.status,
      description: maintenance.description,
      createdAt: maintenance.createdAt,
      updatedAt: maintenance.updatedAt
    }
    
    res.json({
      success: true,
      data: formatted
    })
  } catch (error) {
    console.error('❌ Erro ao buscar manutenção:', error)
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar manutenção',
      error: error.message
    })
  }
})

// POST /api/maintenances - Criar nova manutenção
router.post('/', async (req, res) => {
  try {
    console.log('📥 POST /api/maintenances - Body recebido:', req.body)
    
    const { machine: machineId } = req.body
    
    // Buscar informações da máquina
    const machine = await Machine.findById(machineId)
    if (!machine) {
      return res.status(404).json({
        success: false,
        message: 'Máquina não encontrada'
      })
    }
    
    console.log('✅ Máquina encontrada:', machine)
    
    // Adicionar informações da máquina
    const maintenanceData = {
      ...req.body,
      machineName: machine.name,
      sector: machine.sector
    }
    
    console.log('📝 Criando manutenção com dados:', maintenanceData)
    
    const maintenance = await Maintenance.create(maintenanceData)
    
    console.log('✅ Manutenção criada:', maintenance)
    
    // Atualizar última manutenção da máquina se for concluída
    if (maintenance.status === 'Concluída') {
      await Machine.findByIdAndUpdate(machineId, {
        lastMaintenance: maintenance.date,
        status: 'verde'
      })
    }
    
    // Busca a manutenção criada com populate para retornar formatado
    const createdMaintenance = await Maintenance.findById(maintenance._id)
      .populate('machine', 'name sector status')
    
    // ✅ Formata a resposta
    const formatted = {
      _id: createdMaintenance._id,
      id: createdMaintenance._id.toString(),
      machineId: createdMaintenance.machine._id.toString(),
      machine: createdMaintenance.machine.name,
      machineName: createdMaintenance.machine.name,
      sector: createdMaintenance.sector || createdMaintenance.machine.sector,
      date: createdMaintenance.date,
      technician: createdMaintenance.technician,
      type: createdMaintenance.type,
      status: createdMaintenance.status,
      description: createdMaintenance.description,
      createdAt: createdMaintenance.createdAt,
      updatedAt: createdMaintenance.updatedAt
    }
    
    res.status(201).json({
      success: true,
      message: 'Manutenção criada com sucesso',
      data: formatted
    })
  } catch (error) {
    console.error('❌ Erro ao criar manutenção:', error)
    res.status(400).json({
      success: false,
      message: 'Erro ao criar manutenção',
      error: error.message
    })
  }
})

// PUT /api/maintenances/:id - Atualizar manutenção
router.put('/:id', async (req, res) => {
  try {
    console.log('📥 PUT /api/maintenances/:id - Body:', req.body)
    
    const maintenance = await Maintenance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('machine', 'name sector status')
    
    if (!maintenance) {
      return res.status(404).json({
        success: false,
        message: 'Manutenção não encontrada'
      })
    }
    
    // Se mudou para Concluída, atualizar máquina
    if (req.body.status === 'Concluída') {
      await Machine.findByIdAndUpdate(maintenance.machine._id, {
        lastMaintenance: maintenance.date,
        status: 'verde'
      })
    }
    
    // ✅ Formata a resposta
    const formatted = {
      _id: maintenance._id,
      id: maintenance._id.toString(),
      machineId: maintenance.machine._id.toString(),
      machine: maintenance.machine.name,
      machineName: maintenance.machine.name,
      sector: maintenance.sector || maintenance.machine.sector,
      date: maintenance.date,
      technician: maintenance.technician,
      type: maintenance.type,
      status: maintenance.status,
      description: maintenance.description,
      createdAt: maintenance.createdAt,
      updatedAt: maintenance.updatedAt
    }
    
    res.json({
      success: true,
      message: 'Manutenção atualizada com sucesso',
      data: formatted
    })
  } catch (error) {
    console.error('❌ Erro ao atualizar manutenção:', error)
    res.status(400).json({
      success: false,
      message: 'Erro ao atualizar manutenção',
      error: error.message
    })
  }
})

// DELETE /api/maintenances/:id - Deletar manutenção
router.delete('/:id', async (req, res) => {
  try {
    const maintenance = await Maintenance.findByIdAndDelete(req.params.id)
    
    if (!maintenance) {
      return res.status(404).json({
        success: false,
        message: 'Manutenção não encontrada'
      })
    }
    
    res.json({
      success: true,
      message: 'Manutenção deletada com sucesso'
    })
  } catch (error) {
    console.error('❌ Erro ao deletar manutenção:', error)
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar manutenção',
      error: error.message
    })
  }
})

// GET /api/maintenances/stats/summary - Resumo de estatísticas
router.get('/stats/summary', async (req, res) => {
  try {
    const stats = await Maintenance.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ])
    
    res.json({
      success: true,
      data: stats
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar estatísticas',
      error: error.message
    })
  }
})

// GET /api/maintenances/machine/:machineId - Histórico por máquina
router.get('/machine/:machineId', async (req, res) => {
  try {
    const maintenances = await Maintenance.find({ 
      machine: req.params.machineId 
    })
    .populate('machine', 'name sector status')
    .sort({ date: -1 })
    
    // ✅ Formata os dados
    const formatted = maintenances.map(m => ({
      _id: m._id,
      id: m._id.toString(),
      machineId: m.machine._id.toString(),
      machine: m.machine.name,
      machineName: m.machine.name,
      sector: m.sector || m.machine.sector,
      date: m.date,
      technician: m.technician,
      type: m.type,
      status: m.status,
      description: m.description,
      createdAt: m.createdAt,
      updatedAt: m.updatedAt
    }))
    
    res.json({
      success: true,
      count: formatted.length,
      data: formatted
    })
  } catch (error) {
    console.error('❌ Erro ao buscar histórico:', error)
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar histórico',
      error: error.message
    })
  }
})

export default router
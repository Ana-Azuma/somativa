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
      .populate('machine', 'name sector')
      .sort({ date: -1 })
    
    res.json({
      success: true,
      count: maintenances.length,
      data: maintenances
    })
  } catch (error) {
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
    
    res.json({
      success: true,
      data: maintenance
    })
  } catch (error) {
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
    const { machine: machineId } = req.body
    
    // Buscar informações da máquina
    const machine = await Machine.findById(machineId)
    if (!machine) {
      return res.status(404).json({
        success: false,
        message: 'Máquina não encontrada'
      })
    }
    
    // Adicionar informações da máquina
    req.body.machineName = machine.name
    req.body.sector = machine.sector
    
    const maintenance = await Maintenance.create(req.body)
    
    // Atualizar última manutenção da máquina
    if (maintenance.status === 'Concluída') {
      await Machine.findByIdAndUpdate(machineId, {
        lastMaintenance: maintenance.date,
        status: 'verde'
      })
    }
    
    res.status(201).json({
      success: true,
      message: 'Manutenção criada com sucesso',
      data: maintenance
    })
  } catch (error) {
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
    const maintenance = await Maintenance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    
    if (!maintenance) {
      return res.status(404).json({
        success: false,
        message: 'Manutenção não encontrada'
      })
    }
    
    // Se mudou para Concluída, atualizar máquina
    if (req.body.status === 'Concluída') {
      await Machine.findByIdAndUpdate(maintenance.machine, {
        lastMaintenance: maintenance.date,
        status: 'verde'
      })
    }
    
    res.json({
      success: true,
      message: 'Manutenção atualizada com sucesso',
      data: maintenance
    })
  } catch (error) {
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
    }).sort({ date: -1 })
    
    res.json({
      success: true,
      count: maintenances.length,
      data: maintenances
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar histórico',
      error: error.message
    })
  }
})

export default router
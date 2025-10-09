import express from 'express'
import Machine from '../models/Machine.js'

const router = express.Router()

// GET /api/machines - Listar todas as máquinas
router.get('/', async (req, res) => {
  try {
    const { sector, status } = req.query
    const filter = { active: true }
    
    if (sector) filter.sector = sector
    if (status) filter.status = status
    
    const machines = await Machine.find(filter).sort({ name: 1 })
    
    res.json({
      success: true,
      count: machines.length,
      data: machines
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar máquinas',
      error: error.message
    })
  }
})

// GET /api/machines/:id - Buscar máquina por ID
router.get('/:id', async (req, res) => {
  try {
    const machine = await Machine.findById(req.params.id)
    
    if (!machine) {
      return res.status(404).json({
        success: false,
        message: 'Máquina não encontrada'
      })
    }
    
    res.json({
      success: true,
      data: machine
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar máquina',
      error: error.message
    })
  }
})

// POST /api/machines - Criar nova máquina
router.post('/', async (req, res) => {
  try {
    const machine = await Machine.create(req.body)
    
    res.status(201).json({
      success: true,
      message: 'Máquina criada com sucesso',
      data: machine
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Erro ao criar máquina',
      error: error.message
    })
  }
})

// PUT /api/machines/:id - Atualizar máquina
router.put('/:id', async (req, res) => {
  try {
    const machine = await Machine.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    
    if (!machine) {
      return res.status(404).json({
        success: false,
        message: 'Máquina não encontrada'
      })
    }
    
    res.json({
      success: true,
      message: 'Máquina atualizada com sucesso',
      data: machine
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Erro ao atualizar máquina',
      error: error.message
    })
  }
})

// PATCH /api/machines/:id/status - Atualizar apenas o status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body
    
    const machine = await Machine.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )
    
    if (!machine) {
      return res.status(404).json({
        success: false,
        message: 'Máquina não encontrada'
      })
    }
    
    res.json({
      success: true,
      message: 'Status atualizado com sucesso',
      data: machine
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Erro ao atualizar status',
      error: error.message
    })
  }
})

// DELETE /api/machines/:id - Deletar máquina (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const machine = await Machine.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true }
    )
    
    if (!machine) {
      return res.status(404).json({
        success: false,
        message: 'Máquina não encontrada'
      })
    }
    
    res.json({
      success: true,
      message: 'Máquina desativada com sucesso'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar máquina',
      error: error.message
    })
  }
})

// GET /api/machines/stats/status - Estatísticas de status
router.get('/stats/status', async (req, res) => {
  try {
    const stats = await Machine.aggregate([
      { $match: { active: true } },
      { $group: { 
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

export default router
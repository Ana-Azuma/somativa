import express from 'express'
import User from '../models/User.js'

const router = express.Router()

// GET /api/users - Listar todos os usuários
router.get('/', async (req, res) => {
  try {
    const users = await User.find({ active: true }).select('-password')
    res.json({
      success: true,
      count: users.length,
      data: users
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar usuários',
      error: error.message
    })
  }
})

// GET /api/users/:id - Buscar usuário por ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password')
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      })
    }
    
    res.json({
      success: true,
      data: user
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar usuário',
      error: error.message
    })
  }
})

// POST /api/users - Criar novo usuário
router.post('/', async (req, res) => {
  try {
    const { name, email, password, role } = req.body
    
    // Verificar se usuário já existe
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email já cadastrado'
      })
    }
    
    const user = await User.create({ name, email, password, role })
    
    // Remover senha da resposta
    user.password = undefined
    
    res.status(201).json({
      success: true,
      message: 'Usuário criado com sucesso',
      data: user
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Erro ao criar usuário',
      error: error.message
    })
  }
})

// PUT /api/users/:id - Atualizar usuário
router.put('/:id', async (req, res) => {
  try {
    const { name, email, role, active } = req.body
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role, active },
      { new: true, runValidators: true }
    ).select('-password')
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      })
    }
    
    res.json({
      success: true,
      message: 'Usuário atualizado com sucesso',
      data: user
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Erro ao atualizar usuário',
      error: error.message
    })
  }
})

// DELETE /api/users/:id - Deletar usuário (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true }
    )
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      })
    }
    
    res.json({
      success: true,
      message: 'Usuário desativado com sucesso'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar usuário',
      error: error.message
    })
  }
})

export default router
import { Router } from 'express'
import {
  getAllNodes,
  getNodeById,
  createNode,
  updateNode,
  deleteNode,
  updateNodePosition,
} from '../db/nodes.js'

export const nodesRouter = Router()

/**
 * GET /api/payload
 * Fetch all nodes. Matches the external API endpoint.
 */
nodesRouter.get('/payload', (req, res) => {
  try {
    const nodes = getAllNodes()
    res.json(nodes)
  } catch (error) {
    console.error('Error fetching nodes:', error)
    res.status(500).json({ error: 'Failed to fetch nodes' })
  }
})

/**
 * POST /api/nodes
 * Create a new node.
 */
nodesRouter.post('/nodes', (req, res) => {
  try {
    const { name, type, parentId, data } = req.body

    if (!type) {
      return res.status(400).json({ error: 'Missing required field: type' })
    }

    const newNode = createNode({
      name,
      type,
      parentId,
      data,
    })

    res.status(201).json(newNode)
  } catch (error) {
    console.error('Error creating node:', error)
    res.status(500).json({ error: 'Failed to create node' })
  }
})

/**
 * GET /api/nodes/:id
 * Get a node by ID.
 */
nodesRouter.get('/nodes/:id', (req, res) => {
  try {
    const node = getNodeById(req.params.id)

    if (!node) {
      return res.status(404).json({ error: 'Node not found' })
    }

    res.json(node)
  } catch (error) {
    console.error('Error fetching node:', error)
    res.status(500).json({ error: 'Failed to fetch node' })
  }
})

/**
 * PATCH /api/nodes/:id
 * Update a node's data.
 */
nodesRouter.patch('/nodes/:id', (req, res) => {
  try {
    const { name, type, parentId, data } = req.body
    const patch = {}

    if (name !== undefined) patch.name = name
    if (type !== undefined) patch.type = type
    if (parentId !== undefined) patch.parentId = parentId
    if (data !== undefined) patch.data = data

    const updatedNode = updateNode(req.params.id, patch)

    if (!updatedNode) {
      return res.status(404).json({ error: 'Node not found' })
    }

    res.json(updatedNode)
  } catch (error) {
    console.error('Error updating node:', error)
    res.status(500).json({ error: 'Failed to update node' })
  }
})

/**
 * DELETE /api/nodes/:id
 * Delete a node and all its children.
 */
nodesRouter.delete('/nodes/:id', (req, res) => {
  try {
    const deletedIds = deleteNode(req.params.id)

    if (!deletedIds) {
      return res.status(404).json({ error: 'Node not found' })
    }

    res.json({ deletedIds })
  } catch (error) {
    console.error('Error deleting node:', error)
    res.status(500).json({ error: 'Failed to delete node' })
  }
})

/**
 * PATCH /api/nodes/:id/position
 * Update a node's position on the canvas.
 */
nodesRouter.patch('/nodes/:id/position', (req, res) => {
  try {
    const { x, y } = req.body

    if (x === undefined || y === undefined) {
      return res.status(400).json({ error: 'Missing required fields: x, y' })
    }

    const updatedNode = updateNodePosition(req.params.id, { x, y })

    if (!updatedNode) {
      return res.status(404).json({ error: 'Node not found' })
    }

    res.json(updatedNode)
  } catch (error) {
    console.error('Error updating node position:', error)
    res.status(500).json({ error: 'Failed to update node position' })
  }
})

import express from 'express'
import cors from 'cors'
import { nodesRouter } from './routes/nodes.js'

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

// Routes
app.use('/api', nodesRouter)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' })
})

// Error handler
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`)
  console.log(`📊 API endpoints:`)
  console.log(`   GET  /api/payload - Fetch all nodes`)
  console.log(`   POST /api/nodes - Create a node`)
  console.log(`   GET  /api/nodes/:id - Get a node`)
  console.log(`   PATCH /api/nodes/:id - Update a node`)
  console.log(`   DELETE /api/nodes/:id - Delete a node`)
  console.log(`   PATCH /api/nodes/:id/position - Update node position`)
})

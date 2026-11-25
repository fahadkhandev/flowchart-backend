/**
 * In-memory node store for development.
 * In production, replace with a database (PostgreSQL, MongoDB, etc.)
 */

// Seed data - matches the structure from the external API
const initialNodes = [
  {
    id: '1',
    name: 'Trigger(Fahadtest)',
    type: 'trigger',
    parentId: null,
    data: {
      type: 'message_received',
    },
  },
  {
    id: '2',
    name: 'Send Message(ok fine)',
    type: 'sendMessage',
    parentId: '1',
    data: {
      payload: [
        {
          type: 'text',
          text: 'Hello! How can we help you today? thank you for your patience',
        },
      ],
    },
  },
  {
    id: '3',
    name: 'Business Hours',
    type: 'dateTime',
    parentId: '2',
    data: {
      timezone: 'UTC',
      times: [
        { day: 'mon', startTime: '09:00', endTime: '17:00' },
        { day: 'tue', startTime: '09:00', endTime: '17:00' },
        { day: 'wed', startTime: '09:00', endTime: '17:00' },
        { day: 'thu', startTime: '09:00', endTime: '17:00' },
        { day: 'fri', startTime: '09:00', endTime: '17:00' },
      ],
      connectors: ['3-success', '3-failure'],
    },
  },
  {
    id: '3-success',
    type: 'dateTimeConnector',
    parentId: '3',
    data: {
      connectorType: 'success',
    },
  },
  {
    id: '3-failure',
    type: 'dateTimeConnector',
    parentId: '3',
    data: {
      connectorType: 'failure',
    },
  },
  {
    id: '4',
    name: 'Add Comment',
    type: 'addComment',
    parentId: '3-success',
    data: {
      comment: 'Customer contacted during business hours',
    },
  },
]

// In-memory storage
let nodesStore = JSON.parse(JSON.stringify(initialNodes))

/**
 * Get all nodes
 */
export function getAllNodes() {
  return JSON.parse(JSON.stringify(nodesStore))
}

/**
 * Get a node by ID
 */
export function getNodeById(id) {
  const node = nodesStore.find((n) => n.id === String(id))
  return node ? JSON.parse(JSON.stringify(node)) : null
}

/**
 * Create a new node
 */
export function createNode(nodeData) {
  const newNode = {
    id: crypto.randomUUID(),
    name: nodeData.name,
    type: nodeData.type || 'sendMessage',
    parentId: nodeData.parentId || null,
    data: nodeData.data || {},
  }

  nodesStore.push(newNode)
  return JSON.parse(JSON.stringify(newNode))
}

/**
 * Update a node
 */
export function updateNode(id, patch) {
  const index = nodesStore.findIndex((n) => n.id === String(id))
  if (index === -1) {
    return null
  }

  nodesStore[index] = {
    ...nodesStore[index],
    ...patch,
    data: {
      ...nodesStore[index].data,
      ...patch.data,
    },
  }

  return JSON.parse(JSON.stringify(nodesStore[index]))
}

/**
 * Delete a node and all its children
 */
export function deleteNode(id) {
  const rootId = String(id)
  const toRemove = new Set()
  const queue = [rootId]

  while (queue.length > 0) {
    const current = queue.shift()
    toRemove.add(current)

    for (const node of nodesStore) {
      const parentId = node.parentId
      if (parentId && String(parentId) === current && !toRemove.has(node.id)) {
        queue.push(node.id)
      }
    }
  }

  if (!toRemove.has(rootId)) {
    return null
  }

  nodesStore = nodesStore.filter((n) => !toRemove.has(n.id))
  return Array.from(toRemove)
}

/**
 * Update node position
 */
export function updateNodePosition(id, position) {
  const index = nodesStore.findIndex((n) => n.id === String(id))
  if (index === -1) {
    return null
  }

  nodesStore[index].position = position
  return JSON.parse(JSON.stringify(nodesStore[index]))
}

/**
 * Reset store to initial state (for testing)
 */
export function resetStore() {
  nodesStore = JSON.parse(JSON.stringify(initialNodes))
}

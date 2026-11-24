# Flowchart Backend API

Backend server for the flowchart application. Provides REST API endpoints for node management operations.

## Setup

```bash
npm install
```

## Development

Run with file watching:

```bash
npm run dev
```

The server will start on http://localhost:3000

## Production

```bash
npm start
```

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
NODE_ENV=production
```

## API Endpoints

### GET `/api/payload`
Fetch all nodes.

**Response:**
```json
[
  {
    "id": "1",
    "name": "Trigger",
    "type": "trigger",
    "parentId": null,
    "data": {
      "type": "message_received"
    }
  }
]
```

### POST `/api/nodes`
Create a new node.

**Body:**
```json
{
  "title": "Send Message",
  "type": "sendMessage",
  "parentId": "1",
  "data": {
    "payload": [
      {
        "type": "text",
        "text": "Hello"
      }
    ]
  }
}
```

### GET `/api/nodes/:id`
Get a specific node by ID.

### PATCH `/api/nodes/:id`
Update a node.

### DELETE `/api/nodes/:id`
Delete a node and all its children.

### PATCH `/api/nodes/:id/position`
Update a node's position on the canvas.

## Deployment to AWS EC2

1. Create an EC2 instance (Ubuntu 20.04 LTS recommended)
2. SSH into the instance
3. Install Node.js:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```
4. Clone this repository
5. Install dependencies: `npm install`
6. Set up environment variables in `.env`
7. Use PM2 or systemd to keep the server running

## Development Notes

- The backend stores nodes in-memory during development
- In production, integrate with a database (PostgreSQL, MongoDB, etc.)
- Currently mimics the external API structure for easy integration

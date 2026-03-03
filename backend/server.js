const express = require('express')
const cors = require('cors')
const tasksRouter = require('./routes/tasks')
const errorHandler = require('./middleware/errorHandler')

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/tasks', tasksRouter)

app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.url} not found` })
})

app.use(errorHandler)

app.listen(4000, () => console.log('Server running on port 4000'))
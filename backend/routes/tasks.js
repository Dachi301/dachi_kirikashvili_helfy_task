const express = require('express');
const router = express.Router();

let tasks = [];
let nextId = 1;

router.get('/', (req, res, next) => {
    try {
      let result = [...tasks]
  
      if (req.query.completed !== undefined) {
        const completed = req.query.completed === 'true'
        result = result.filter(t => t.completed === completed)
      }
  
      if (req.query.priority) {
        result = result.filter(t => t.priority === req.query.priority)
      }
  
      if (req.query.sort === 'title') {
        result.sort((a, b) => a.title.localeCompare(b.title))
      } else if (req.query.sort === 'priority') {
        const order = { high: 1, medium: 2, low: 3 }
        result.sort((a, b) => order[a.priority] - order[b.priority])
      } else if (req.query.sort === 'createdAt') {
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      }
  
      res.status(200).json(result)
    } catch (err) {
      next(err)
    }
})

router.post('/', (req, res) => {
    const { title, description, priority, dueDate } = req.body;

    const validPriorities = ['low', 'medium', 'high'];

    if (!title) {
        return res.status(400).json({ error: 'Title is required' });
    }

    if (priority && !validPriorities.includes(priority)) {
        return res.status(400).json({ error: 'Priority must be low, medium, or high' });
    }

    const task = {
        id: nextId++,
        title,
        description: description || '',
        completed: false,
        createdAt: new Date(),
        priority: priority || 'medium',
        dueDate: dueDate || null,
    };

    tasks.push(task);
    res.status(201).json({ message: 'Task created successfully', task });
});

router.put('/:id', (req, res) => {
    const task = tasks.find(t => t.id === parseInt(req.params.id));
    const { title, description, priority, dueDate } = req.body;

    const validPriorities = ['low', 'medium', 'high'];

    if (!task) {
        return res.status(404).json({ error: `Task with id ${req.params.id} not found` });
    }

    if (priority && !validPriorities.includes(priority)) {
        return res.status(400).json({ error: 'Priority must be low, medium, or high' });
    }

    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (priority) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;

    res.status(200).json({ message: 'Task updated successfully', task });
});

router.delete('/:id', (req, res) => {
    const index = tasks.findIndex(t => t.id === parseInt(req.params.id));

    if (index === -1) {
        return res.status(404).json({ error: `Task with id ${req.params.id} not found` });
    }

    tasks.splice(index, 1);
    res.status(204).send();
});

router.patch('/:id/toggle', (req, res) => {
    const task = tasks.find(t => t.id === parseInt(req.params.id));

    if (!task) {
        return res.status(404).json({ error: `Task with id ${req.params.id} not found` });
    }

    task.completed = !task.completed;
    res.status(200).json({ message: 'Task toggled successfully', task });
});

module.exports = router;
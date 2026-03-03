const express = require('express');
const router = express.Router();

let tasks = [];
let nextId = 1;

router.get('/', (req, res) => {
    res.status(200).json(tasks);
});

router.post('/', (req, res) => {
    const { title, description, priority } = req.body;

    if (!title) {
        return res.status(400).json({ error: 'Title is required' });
    }

    const task = {
        id: nextId++,
        title,
        description: description || '',
        completed: false,
        createdAt: new Date(),
        priority: priority || 'medium',
    };

    tasks.push(task);
    res.status(201).json({ message: 'Task created successfully', task });
});

router.put('/:id', (req, res) => {
    const task = tasks.find(t => t.id === parseInt(req.params.id));

    if (!task) {
        return res.status(404).json({ error: `Task with id ${req.params.id} not found` });
    }

    const { title, description, priority } = req.body;

    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (priority) task.priority = priority;

    res.status(200).json({ message: 'Task updated successfully', task });
});

router.delete('/:id', (req, res) => {
    const index = tasks.findIndex(t => t.id === parseInt(req.params.id));

    if (index === -1) {
        return res.status(404).json({ error: `Task with id ${req.params.id} not found` });
    }

    tasks.splice(index, 1);
    res.status(200).json({ message: 'Task deleted successfully' });
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
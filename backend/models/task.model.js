const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    text: { type: String, required: true },
    createdBy: String,
    createdAt: { type: Date, default: Date.now }
});

const Task = mongoose.model('Task', TaskSchema);

module.exports = Task;
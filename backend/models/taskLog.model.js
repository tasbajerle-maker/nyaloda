const mongoose = require('mongoose');

const TaskLogSchema = new mongoose.Schema({
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
    userId: String,
    storeId: String,
    completionDate: { type: Date, default: Date.now }
});

const TaskLog = mongoose.model('TaskLog', TaskLogSchema);

module.exports = TaskLog;
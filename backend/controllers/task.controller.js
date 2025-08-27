const Task = require('../models/task.model');
const TaskLog = require('../models/taskLog.model');
const User = require('../models/user.model');

// Helper function to convert Mongoose docs to plain objects with an 'id' field
const toJSONWithId = (doc) => {
    if (!doc) return null;
    const jsonObj = doc.toJSON({ virtuals: true });
    jsonObj.id = jsonObj._id.toString();
    delete jsonObj._id;
    delete jsonObj.__v;
    return jsonObj;
};

exports.createTask = async (req, res) => {
    try {
        const { text } = req.body;
        const user = await User.findById(req.user.userId);
        const task = new Task({ text, createdBy: user.email });
        await task.save();
        res.status(201).json(toJSONWithId(task));
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).json({ message: 'Feladat nem található.' });
        
        await TaskLog.deleteMany({ taskId: req.params.id });
        res.json({ message: 'Feladat sikeresen törölve.' });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

exports.logTask = async (req, res) => {
    try {
        const { taskId, storeId, isCompleted } = req.body;
        const user = await User.findById(req.user.userId);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const existingLog = await TaskLog.findOne({
            taskId,
            userId: user.email,
            storeId,
            completionDate: { $gte: today }
        });

        if (isCompleted && !existingLog) {
            const newLog = new TaskLog({ taskId, userId: user.email, storeId });
            await newLog.save();
        } else if (!isCompleted && existingLog) {
            await TaskLog.findByIdAndDelete(existingLog._id);
        }
        
        res.status(200).json({ message: 'Napló frissítve.' });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};
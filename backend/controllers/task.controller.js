const Task = require('../models/task.model');
const TaskLog = require('../models/taskLog.model');

// A toJSONWithId helperre itt nincs szükség, mert a User modellt már nem használjuk direktben

exports.createTask = async (req, res) => {
    try {
        const { text } = req.body;
        // Most már közvetlenül a req.user-ből olvassuk az emailt
        const task = new Task({ text, createdBy: req.user.email });
        await task.save();
        res.status(201).json(task);
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
        // A user objektumot már a middleware betette a req.user-be, nem kell újra lekérdezni.
        const user = req.user;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const existingLog = await TaskLog.findOne({
            taskId,
            // A user ID-t és emailt is a req.user-ből vesszük
            userId: user._id, 
            storeId,
            completionDate: { $gte: today }
        });

        if (isCompleted && !existingLog) {
            const newLog = new TaskLog({ taskId, userId: user._id, storeId });
            await newLog.save();
        } else if (!isCompleted && existingLog) {
            await TaskLog.findByIdAndDelete(existingLog._id);
        }
        
        res.status(200).json({ message: 'Napló frissítve.' });
    } catch (e) {
        // A console.error segít a hibakeresésben
        console.error("Hiba a feladat naplózásakor:", e);
        res.status(500).json({ message: e.message });
    }
};
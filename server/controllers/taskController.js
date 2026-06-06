const Task = require("../models/Task");

const createTask = async (req, res) => {
  const { title, description } = req.body;

  const task = await Task.create({
    title,
    description,
    userId: req.user._id,
  });

  res.status(201).json(task);
};

const getTasks = async (req, res) => {
  const tasks = await Task.find({
    userId: req.user._id,
  });

  res.json(tasks);
};

const updateTask = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({
      message: "Task not found",
    });
  }

  if (task.userId.toString() !== req.user._id.toString()) {
    return res.status(401).json({
      message: "Not authorized",
    });
  }

  task.title = req.body.title || task.title;
  task.description = req.body.description || task.description;
  task.status = req.body.status || task.status;

  const updatedTask = await task.save();

  res.json(updatedTask);
};

const deleteTask = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({
      message: "Task not found",
    });
  }

  if (task.userId.toString() !== req.user._id.toString()) {
    return res.status(401).json({
      message: "Not authorized",
    });
  }

  await task.deleteOne();

  res.json({
    message: "Task deleted",
  });
};

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
};
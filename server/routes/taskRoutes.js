const express = require("express");
const router = express.Router();


const { createTask } = require("../controllers/taskController");
const { protect } = require("../middleware/authMiddleware");
const { getTasks } = require("../controllers/taskController");
const { updateTask } = require("../controllers/taskController");
const { deleteTask } = require("../controllers/taskController");

router.get("/", protect, getTasks);
router.post("/", protect, createTask);
router.put("/:id", protect, updateTask);
router.delete("/:id", protect, deleteTask);

module.exports = router; 
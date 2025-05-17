const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  addComment,
  uploadAttachment,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Main Task Routes
router.post('/', protect, createTask);
router.get('/', protect, getTasks);
router.put('/:id', protect, updateTask);
router.delete('/:id', protect, deleteTask);

// Add Comment Route
router.post('/:id/comments', protect, addComment);

// Upload Attachment Route
router.post('/:id/attachments', protect, upload.single('file'), uploadAttachment);

module.exports = router;

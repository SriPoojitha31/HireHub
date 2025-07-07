import express from 'express';
import {
    addBookmark,
    changePassword,
    deleteUser,
    getAllUsers,
    getAppliedJobs,
    getBookmarks,
    getNotifications,
    getProfile,
    markNotificationRead,
    removeBookmark,
    updateProfile,
    uploadResume
} from '../controllers/userController.js';
import { admin, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected routes
router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);
router.get('/applied-jobs', getAppliedJobs);
router.post('/upload-resume', uploadResume);

// Bookmarks
router.post('/bookmark/:jobId', addBookmark);
router.delete('/bookmark/:jobId', removeBookmark);
router.get('/bookmarks', getBookmarks);

// Notifications
router.get('/notifications', getNotifications);
router.put('/notifications/:id/read', markNotificationRead);

// Admin routes (parameterized routes first, then static routes)
router.delete('/:id', admin, deleteUser);
router.get('/', admin, getAllUsers);

export default router;

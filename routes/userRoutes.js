const express = require('express');
const router = express.Router();
const { createdUser, loginUser, getAllUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');
// const auth = require('../middleware/authMiddleware');


router.route('/').get(getAllUsers).post(createdUser)
router.route('/login').post(loginUser)
router.route('/:id').get(getUserById).put(updateUser).delete(deleteUser)



module.exports = router;

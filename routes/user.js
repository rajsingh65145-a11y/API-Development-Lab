const express = require('express');
const {
    handleGetAllUsers,
    handlegetUserById,
    handleUpdateUser,
    handleDeleteUser,
    handleCreateUser,
} = require('../Controllers/controllers');

const router = express.Router();

router.route('/')
    .get(handleGetAllUsers)
    .post(handleCreateUser);

router.route('/:id')
    .get(handlegetUserById)
    .patch(handleUpdateUser)
    .delete(handleDeleteUser);

module.exports = router;

const User = require('../Models/user');

async function handleGetAllUsers(req, res) {
    try {
        const allDbusers = await User.find({});
        return res.json(allDbusers);
    } catch (error) {
        return res.status(500).json({ status: 'error', message: error.message });
    }
}

async function handlegetUserById(req, res) {
    try {
        const foundUser = await User.findById(req.params.id);
        if (!foundUser) return res.status(404).json({ status: 'error', message: 'User not found' });
        return res.json(foundUser);
    } catch (error) {
        return res.status(400).json({ status: 'error', message: 'Invalid user ID' });
    }
}

async function handleUpdateUser(req, res) {
    try {
        const body = req.body;
        const updateData = {};
        if (body.first_name || body.firstName) updateData.firstName = body.first_name || body.firstName;
        if (body.last_name || body.lastName) updateData.lastName = body.last_name || body.lastName;
        if (body.email) updateData.email = body.email;
        if (body.Job_title || body.job_title || body.jobTitle) updateData.jobTitle = body.Job_title || body.job_title || body.jobTitle;

        const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!updatedUser) return res.status(404).json({ status: 'error', message: 'User not found' });
        return res.json({ status: 'success', message: 'User updated', data: updatedUser });
    } catch (error) {
        return res.status(400).json({ status: 'error', message: 'Invalid user ID or update failed' });
    }
}

async function handleDeleteUser(req, res) {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ status: 'error', message: 'User not found' });
        return res.json({ status: 'success', message: 'User deleted' });
    } catch (error) {
        return res.status(400).json({ status: 'error', message: 'Invalid user ID or delete failed' });
    }
}

async function handleCreateUser(req, res) {
    try {
        const body = req.body;
        const firstName = body.first_name || body.firstName;
        const lastName = body.last_name || body.lastName;
        const email = body.email;
        const jobTitle = body.Job_title || body.job_title || body.jobTitle;

        if (!firstName || !lastName || !email || !jobTitle) {
            return res.status(400).json({
                status: 'error',
                message: 'All fields are required',
            });
        }

        const result = await User.create({
            firstName,
            lastName,
            email,
            jobTitle,
        });

        return res.status(201).json({
            status: 'success',
            message: 'User created',
            data: result,
            id: result._id,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                status: 'error',
                message: 'Email already exists',
            });
        }
        return res.status(500).json({
            status: 'error',
            message: error.message,
        });
    }
}

module.exports = {
    handleGetAllUsers,
    handlegetUserById,
    handleUpdateUser,
    handleDeleteUser,
    handleCreateUser,
};

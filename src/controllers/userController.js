const User = require('../models/userModel');

// READ ALL
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        if (users.length > 0) {
            return res.status(200).json(users);
        }
        res.status(404).json({
            code: 404,
            message: 'No hay usuarios por mostrar.'
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            message: 'Error al obtener los usuarios.',
            details: error.message
        });
    }
};

// READ BY EMAIL
const getUserByEmail = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email });
        if (!user) {
            return res.status(404).json({
                code: 404,
                message: 'Usuario no encontrado.'
            });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({
            code: 500,
            message: 'Error al obtener el usuario.',
            details: error.message
        });
    }
};

// CREATE
const createUser = async (req, res) => {
    try {
        const {
            creationDate,
            lastDataModification,
            _id,
            ...data
        } = req.body;

        delete data._id;
        delete data.creationDate;
        delete data.lastDataModification;

        const newUser = new User(data);
        const createdUser = await newUser.save();

        res.status(201).json(createdUser);
    } catch (error) {
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                code: 400,
                message: 'Error al validar los datos de entrada.',
                details: validationErrors
            });
        }

        if (error.code === 11000 && error.keyPattern?.email) {
            return res.status(422).json({
                code: 422,
                message: 'El correo electrónico ya se encuentra registrado.'
            });
        }

        res.status(500).json({
            code: 500,
            message: 'Error interno del servidor.',
            details: error.message
        });
    }
};

// UPDATE BY EMAIL
const updateUserByEmail = async (req, res) => {
    try {
        const {
            _id,
            email,
            creationDate,
            lastDataModification,
            ...data
        } = req.body;

        delete data.email;
        delete data._id;
        delete data.creationDate;

        const updatedUser = await User.findOneAndUpdate(
            { email: req.params.email },
            data,
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({
                code: 404,
                message: 'Usuario no encontrado.'
            });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                code: 400,
                message: 'Error al validar los datos de entrada.',
                details: validationErrors
            });
        }

        if (error.code === 11000 && error.keyPattern?.email) {
            return res.status(422).json({
                code: 422,
                message: 'El correo electrónico ya se encuentra registrado.'
            });
        }

        res.status(500).json({
            code: 500,
            message: 'Error al actualizar el usuario.',
            details: error.message
        });
    }
};

// DELETE BY EMAIL
const deleteUserByEmail = async (req, res) => {
    try {
        const deletedUser = await User.findOneAndDelete({ email: req.params.email });
        if (!deletedUser) {
            return res.status(404).json({
                code: 404,
                message: 'Usuario no encontrado.'
            });
        }

        res.status(200).json({
            message: 'Usuario eliminado exitosamente.',
            deletedUser
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            message: 'Error al eliminar el usuario.',
            details: error.message
        });
    }
};

module.exports = {
    createUser,
    getAllUsers,
    getUserByEmail,
    updateUserByEmail,
    deleteUserByEmail
};

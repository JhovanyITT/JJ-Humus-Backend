const Product = require('../models/productModel');

// READ ALL
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        if (products.length > 0) {
            return res.status(200).json(products);
        }
        res.status(404).json({
            code: 404,
            message: 'No hay productos por mostrar.'
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            message: 'Error al obtener los productos.',
            details: error.message
        });
    }
};

// READ BY ID
const getProductById = async (req, res) => {
    try {
        const product = await Product.findOne({ code: req.params.code });
        if (!product) {
            return res.status(404).json({
                code: 404,
                message: 'Producto no encontrado.'
            });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({
            code: 500,
            message: 'Error al obtener el producto.',
            details: error.message
        });
    }
};

// CREATE
const createProduct = async (req, res) => {
    try {
        const {
            _id,
            creationDate,
            lastDataModification,
            ...data
        } = req.body;

        delete data._id;
        delete data.creationDate;
        delete data.lastDataModification;

        const newProduct = new Product(data);
        const createdProduct = await newProduct.save();

        res.status(201).json(createdProduct);
    } catch (error) {
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                code: 400,
                message: 'Error al validar los datos de entrada.',
                details: validationErrors
            });
        }

        res.status(500).json({
            code: 500,
            message: 'Error interno del servidor.',
            details: error.message
        });
    }
};

// UPDATE
const updateProduct = async (req, res) => {
    try {
        const {
            _id,
            creationDate,
            lastDataModification,
            ...data
        } = req.body;

        delete data._id;
        delete data.code;
        delete data.creationDate;
        data.lastDataModification = new Date();

        const code = req.params.code;

        const updatedProduct = await Product.findOneAndUpdate(
            { code },
            data,
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({
                code: 404,
                message: 'Producto no encontrado.'
            });
        }

        res.status(200).json(updatedProduct);
    } catch (error) {
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                code: 400,
                message: 'Error al validar los datos de entrada.',
                details: validationErrors
            });
        }

        res.status(500).json({
            code: 500,
            message: 'Error al actualizar el producto.',
            details: error.message
        });
    }
};

// DELETE
const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findOneAndDelete({ code: req.params.code });
        if (!deletedProduct) {
            return res.status(404).json({
                code: 404,
                message: 'Producto no encontrado.'
            });
        }

        res.status(200).json({
            message: 'Producto eliminado exitosamente.',
            deletedProduct
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            message: 'Error al eliminar el producto.',
            details: error.message
        });
    }
};

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
};
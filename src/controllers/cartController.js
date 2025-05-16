const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const User = require('../models/userModel');

// Helper para calcular totales
const calculateCartTotals = async (cart) => {
  let subtotal = 0;
  for (const item of cart.products) {
    const product = await Product.findById(item.product);
    if (product) {
      subtotal += product.price * item.quantity;
    }
  }
  const iva = subtotal * 0.16;
  const total = subtotal + iva;

  cart.subtotal = subtotal;
  cart.iva = iva;
  cart.total = total;
};

// READ ALL
const getAllCarts = async (req, res) => {
  try {
    const carts = await Cart.find().populate('user').populate('products.product');

    if (carts.length > 0) {
      return res.status(200).json(carts);
    }
    res.status(404).json({
      code: 404,
      message: 'No hay carritos por mostrar.'
    });
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor.', details: error.message });
  }
};

// READ BY ID
const getCartById = async (req, res) => {
  try {
    const cart = await Cart.findOne({ code: req.params.id }).populate('user').populate('products.product');
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado.' });
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor.', details: error.message });
  }
};

// CREATE
const createCart = async (req, res) => {
  try {
    const { _id, creationDate, closingDate, subtotal, total, iva, status, ...data } = req.body;

    delete data._id;
    delete data.creationDate;
    delete data.closingDate;
    delete data.subtotal;
    delete data.total;
    delete data.iva;
    delete data.status;

    const user_Id = await User.findOne({ email: data.user });

    if (!user_Id) {
      return res.status(404).json({
        code: 404,
        message: "Usuario no encontrado"
      });
    }

    data.user = user_Id._id;

    const newCart = new Cart(data);
    await calculateCartTotals(newCart);
    const savedCart = await newCart.save();
    res.status(201).json(savedCart);
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor.', details: error.message });
  }
};

// HISTORY
const getHistoryUserCarts = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.id });

    if (!user) {
      return res.status(404).json({
        code: 404,
        message: "Usuario no encontrado"
      });
    }
    const carts = await Cart.find({ user: user._id, status: 'CLOSED' }).populate('products.product');
    if (carts.length > 0) {
      return res.status(200).json(carts);
    }
    res.status(404).json({
      code: 404,
      message: 'No hay historial de carritos para este usuario.'
    });
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor.', details: error.message });
  }
};

// ADD PRODUCT
const addProduct = async (req, res) => {
  try {
    const { cartId, productId, quantity } = req.body;
    const cart = await Cart.findOne({ code: cartId });
    if (!cart || cart.status === 'CLOSED') {
      return res.status(400).json({ message: 'Carrito inválido o cerrado.' });
    }

    const product = await Product.findOne({ code: productId }).exec();

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado.' });
    }

    const existingProduct = cart.products.find(p => p.product.toString() === product._id);
    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.products.push({ product: product._id, quantity });
    }

    await calculateCartTotals(cart);
    const updatedCart = await cart.save();
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor.', details: error.message });
  }
};

// REMOVE PRODUCT
const removeProduct = async (req, res) => {
  try {
    const { cartId, productId } = req.body;
    const cart = await Cart.findOne({ code: cartId });
    if (!cart || cart.status === 'CLOSED') {
      return res.status(400).json({ message: 'Carrito inválido o cerrado.' });
    }

    const product = await Product.findOne({ code: productId }).exec();

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado.' });
    }

    cart.products = cart.products.filter(p => p.product.toString() !== product._id.toString());
    await calculateCartTotals(cart);
    const updatedCart = await cart.save();
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar producto.', details: error.message });
  }
};

// CLOSE CART
const closeCart = async (req, res) => {
  try {
    const { cartId } = req.body;
    const cart = await Cart.findOne({ code: cartId });
    if (!cart || cart.status === 'CLOSED') {
      return res.status(400).json({ message: 'Carrito inválido o ya cerrado.' });
    }

    cart.status = 'CLOSED';
    cart.closingDate = new Date();
    await calculateCartTotals(cart);
    const closedCart = await cart.save();
    res.status(200).json(closedCart);
  } catch (error) {
    res.status(500).json({ message: 'Error al cerrar el carrito.', details: error.message });
  }
};

module.exports = {
  createCart,
  getAllCarts,
  getCartById,
  getHistoryUserCarts,
  addProduct,
  removeProduct,
  closeCart
};
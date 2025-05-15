const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const appConf = require('./conf-files/app.conf');

const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');

mongoose.connect(appConf.MONGO_URL)
  .then(() => console.log('Conexión a MongoDB exitosa'))
  .catch((error) => {
    console.error('Error al conectar a MongoDB:', error);
    process.exit(1);
  });

const app = express();
app.use(cors());

app.use(bodyParser.json());
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);

// Ruta por defecto
app.use((req, res, next) => {
  res.status(404).json({ code: 404, message: "Ruta no encontrada" });
});

module.exports = app;
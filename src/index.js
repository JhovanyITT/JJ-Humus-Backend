require('dotenv').config();
const app = require('./app');
const PORT = process.env.APP_PORT || 3000;

app.listen(PORT, () => {
    console.log(`Escuchando en el puerto: ${PORT}`);
});

module.exports = { app };
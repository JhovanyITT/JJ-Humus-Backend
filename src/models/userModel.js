const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        required: true,
        type: String,
        minlength: 2,
        maxlength: 85
    },
    paternalSurname: {
        required: true,
        type: String,
        minlength: 2,
        maxlength: 84
    },
    maternalSurname: {
        type: String,
        required: true,
        maxlength: 83
    },
    email: {
        required: true,
        unique: true,
        type: String,
        match: [/\S+@\S+\.\S+/, 'Correo electrónico inválido']
    },
    password: {
        required: true,
        select: false,
        type: String,
    },
    direction: {
        type: String,
        maxlength: 255
    },
    phone: {
        type: String,
        match: [/^\+?\d{7,15}$/, 'Número de teléfono inválido']
    },
    rol: {
        required: true,
        type: String,
        enum: ['Customer', 'Admin'],
        default: 'Customer'
    },
    preferedPayMethod: {
        type: String,
        enum: ['CreditCard', 'DebitCard']
    },
}, { versionKey: false, timestamps: { createdAt: 'creationDate', updatedAt: 'lastDataModification' } });


// Middleware antes de guardar
userSchema.pre('save', async function (next) {
    this.username = this.username?.toUpperCase().trim();
    this.paternalSurname = this.paternalSurname?.toUpperCase().trim();
    this.motherSurname = this.motherSurname?.toUpperCase().trim();

    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password.trim(), 10);
    }
    next();
});


// Middleware antes de findOneAndUpdate
userSchema.pre('findOneAndUpdate', async function (next) {
    const update = this.getUpdate();

    if (update.username) {
        update.username = update.username.toUpperCase().trim();
    }
    if (update.paternalSurname) {
        update.paternalSurname = update.paternalSurname.toUpperCase().trim();
    }
    if (update.motherSurname) {
        update.motherSurname = update.motherSurname.toUpperCase().trim();
    }
    if (update.password) {
        update.password = await bcrypt.hash(update.password.trim(), 10);
    }
    next();
});

module.exports = mongoose.model('User', userSchema);

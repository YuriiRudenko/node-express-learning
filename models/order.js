const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    items: [
        {
            productId: {
                type: Schema.Types.ObjectId,
                required: true,
                ref: 'Product',
            },
            quantity: {
                type: Number,
                required: true,
                defaultValue: 0,
            },
            price: {
                type: Number,
                required: true,
                defaultValue: 0,
            },
            totalPrice: {
                type: Number,
                required: true,
                defaultValue: 0,
            },
            title: {
                type: String,
                required: true,
            }
        }
    ],
    totalPrice: {
        type: Number,
        required: true,
        defaultValue: 0,
    },
    userName: {
        type: String,
        required: true,
    },
    userEmail: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
});

module.exports = mongoose.model("Order", orderSchema);
/*jshint esversion: 6 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductShema = mongoose.Schema({
    name: String,
    picture: String,
    price: { type: Number, default: 0 },
    category: { type: String, enum:['computers', 'phones', 'accesories'] },
    description: String,
    //email: { type: String, unique: true, lowercase: true },
});

module.exports = mongoose.model('Product', ProductShema);
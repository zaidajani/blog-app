const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 5,
        max: 25
    },
    email: {
        type: String,
        required: true,
        min: 5,
        max: 255
    },
    password: {
        type: String,
        required: true,
        min: 5,
        max: 255
    },
    isAdmin: {
        type: Boolean,
        required: true
    }
});

function validateUser(user) {
    const schema = {
        name: Joi.string().min(5).max(25).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
    }

    return Joi.validate(user, schema);
}

function validateAuth(user) {
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
    }

    return Joi.validate(user, schema);
}

schema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, config.get("jwtPrivateKey"));
    return token;
};

const Users = mongoose.model('Admin', schema);

exports.validateUser = validateUser;
exports.schema = schema;
exports.Users = Users;
exports.validateAuth = validateAuth;
const express = require('express');
const { schema, validateUser, Users } = require('./../models/admin') 
const router = express.Router();
const { Data, validate } = require('./../models/model');
const bcrypt = require('bcrypt');
const _ = require('lodash');
router.use(express.json());
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('./../middlewares/auth');
const slugify = require('slugify');

router.post('/post/', auth, async (req, res) => {
    const user = await Users.findOne({ _id: { $eq: req.user._id } });
    if(user.isAdmin == false) {
        return res.status(403).send('Access forbidden. You dont have privilages to aply changes to our blogs.');
    }

    const { error } = validate(req.body);
    if(error) return res.send(error.details[0].message);

    const newData = new Data({
        title: req.body.title,
        createdAt: Date.now(),
        description: req.body.description,
        content: req.body.content
    });
    await newData.save();

    res.send(newData);
});

router.delete('/post/:id', auth, async (req, res) => {
    const user = await Users.findOne({ _id: { $eq: req.user._id } });
    if(user.isAdmin == false) {
        return res.status(403).send('Access forbidden. You dont have privilages to aply changes to our blogs.');
    }

    let article = await Data.findById(req.params.id);

    if(!article) return res.status(404).send('Article with the given Id is not being found.');

    article = await Data.findByIdAndDelete(req.params.id);

    res.send(article);
});

router.post('/new/', async (req, res) => {
    const { error } = validateUser(req.body);

    if(error) return res.status(400).send(error.details[0].message);

    let user = await Users.findOne({ email: req.body.email });
    if(user) return res.status(400).send('User with this email allready exits.');

    const password = req.body.password;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newData = {
        "name": req.body.name,
        "email": req.body.email,
        "password": hashedPassword,
        "isAdmin": false
    }

    const model = new Users(newData);
    await model.save();

    const token = model.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(model, ['name', 'email', '_id']));
});

router.put('/post/:id', auth, async (req, res) => {
    const user = await Users.findOne({ _id: { $eq: req.user._id } });
    if(user.isAdmin == false) {
        return res.status(403).send('Access forbidden. You dont have privilages to aply changes to our blogs.');
    }

    const { error } = validate(req.body);
    if(error) return res.send(error.details[0].message);

    const newOne = {
        title: req.body.title,
        createdAt: Date.now(),
        description: req.body.description,
        content: req.body.content,
        slug: slugify(req.body.title, { 
            lower: true,
            strict: true,
        })
    }
    
    const done = await Data.findByIdAndUpdate(req.params.id, newOne, {
        new: true
    });

    res.send(done);
});

module.exports = router;
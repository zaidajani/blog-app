const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;
const { Data, schema } = require('./models/model');
const articleRoutes = require('./routes/articles');
const admin = require('./routes/admin');
const auth = require('./routes/auth');
const config = require('config');
const path = require('path');

if(!config.get('jwtPrivateKey')) {
    console.error('Fatal error: jwtPrivateKey is not defined.');
    process.exit(1);
}

mongoose.connect('mongodb://localhost/blog', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => {
    console.log('connnected to mongoDb...');
}).catch(err => {
    console.log('cannot connect to mongodb...');
});

app.use(express.json());
app.set('view engine', 'ejs');
app.use('/articles/', articleRoutes);
app.use('/admin/', admin);
app.use('/auth/', auth);
app.use('/static', express.static(path.join(__dirname, 'static')));

app.get('/', async (req, res) => {
    const articles = await Data.find().sort({ createdAt: 'desc' });
    res.render('index.ejs', { articles });
});

app.get('*', (req, res) => {
    res.status(404).render('notfound');
});

app.listen(port, () => {
    console.log(`listening on port ${port}...`);
});
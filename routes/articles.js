const express = require('express');
const router = express.Router();
const { Data } = require('./../models/model');
 
router.get('/:slug', async (req, res) => {
    const article = await Data.findOne({ slug: req.params.slug });
    if (article == null) return res.redirect('/')
    res.render('show', { article: article })
});

module.exports = router;
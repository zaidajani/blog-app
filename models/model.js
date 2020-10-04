const mongoose = require('mongoose');
const Joi = require('joi');
const slugify = require('slugify');
const marked = require('marked');
const createDomPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const dompurify = createDomPurify(new JSDOM().window)

const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    sanitizedHtml: {
        type: String,
        required: true,
    }
});

schema.pre("validate", function (next) {
    if (this.title) {
      this.slug = slugify(this.title, {
        lower: true,
        strict: true,
      });
    }

    if(this.content) {
        this.sanitizedHtml = dompurify.sanitize(marked(this.content));
    }

    next();
});
  
function validate(article) {
    const schema = {
        title: Joi.string().required(),
        description: Joi.string().required(),
        content: Joi.string().required()
    }

    return Joi.validate(article, schema);
}

const Data = mongoose.model("Article", schema);

exports.schema = schema;
exports.Data = Data;
exports.validate = validate;
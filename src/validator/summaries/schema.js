const Joi = require('joi');

const PostSummaryPayloadSchema = Joi.object({
  language: Joi.string().valid('id', 'en').required(),
  originalContent: Joi.alternatives().try(
    Joi.string().min(10),
    Joi.object(),
  ).required(),
});

const PutSummaryPayloadSchema = Joi.object({
  summary: Joi.string().required(),
  title: Joi.string().required(),
});

module.exports = { PostSummaryPayloadSchema, PutSummaryPayloadSchema };

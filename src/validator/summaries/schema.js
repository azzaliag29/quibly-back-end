const Joi = require('joi');

const PostSummaryPayloadSchema = Joi.object({
  language: Joi.binary().required(),
  originalContent: Joi.binary().required(),
});

const PutSummaryPayloadSchema = Joi.object({
  summary: Joi.binary().required(),
  title: Joi.binary().required(),
});

module.exports = { PostSummaryPayloadSchema, PutSummaryPayloadSchema };

const Joi = require('joi');

const createRoomSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  isPublic: Joi.boolean().default(true),
  password: Joi.string().max(50).allow(null).optional(),
});

const updateRoomSchema = Joi.object({
  name: Joi.string().min(3).max(100).optional(),
  isPublic: Joi.boolean().optional(),
  password: Joi.string().max(50).allow(null).optional(),
});

const joinRoomSchema = Joi.object({
  memberId: Joi.string().required(),
  memberName: Joi.string().min(2).max(50).required(),
  password: Joi.string().max(50).allow('').optional(),
});

const uploadFileSchema = Joi.object({
  filename: Joi.string().required(),
  mimetype: Joi.string().default('application/octet-stream'),
  uploaderName: Joi.string().min(2).max(50).required(),
});

module.exports = {
  createRoomSchema,
  updateRoomSchema,
  joinRoomSchema,
  uploadFileSchema,
};

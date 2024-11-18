import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  DB_TYPE: Joi.string().required(),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.string().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required().allow(''),
  DB_NAME: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  NODE_ENV: Joi.string().required(),
  APPWRITE_ENDPOINT: Joi.string().required(),
  APPWRITE_DATABASE_ID: Joi.string().required(),
  APPWRITE_USER_PROFILE_COLLECTION_ID: Joi.string().required(),
  APPWRITE_PROJECT_ID: Joi.string().required(),
  APPWRITE_API_KEY: Joi.string().required(),
  APPWRITE_ROLES_COLLECTION_ID: Joi.string().required(),
  APPWRITE_ROLE_PERMISSIONS_COLLECTION_ID: Joi.string().required(),
  APPWRITE_PERMISSIONS_COLLECTION_ID: Joi.string().required(),
});

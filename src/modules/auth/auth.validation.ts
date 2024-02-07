import Joi from 'joi';
// import { password } from '../validate/custom.validation';
import { NewRegisteredUser } from '../user/user.interfaces';

const registerBodySchema: Record<keyof NewRegisteredUser, any> = {
  email: Joi.string().required().email(),
  // password: Joi.string().required().custom(password),
  password: Joi.string().required(),
  name: Joi.string().required(),
};

export const registerSchema = {
  body: Joi.object().keys(registerBodySchema),
};

export const loginSchema = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

export const logoutSchema = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

export const refreshTokensSchema = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

export const forgotPasswordSchema = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

export const resetPasswordSchema = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    // password: Joi.string().required().custom(password),
    password: Joi.string().required(),
  }),
};

export const verifyEmailSchema = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

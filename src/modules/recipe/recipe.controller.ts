import mongoose from 'mongoose';
import httpStatus from 'http-status';
import { Request, Response } from 'express';
import { catchAsync } from '../utils';
import { ApiError } from '../errors';
import * as recipeService from './recipe.service';
import createSuccessResponse from '../success/SuccessResponse';

export const createRecipeHandler = catchAsync(async (req: Request, res: Response) => {
  const businessId = req.user.businessId ? req.user.businessId : new mongoose.Types.ObjectId(req.body.businessId);
  if (!businessId) throw new ApiError(httpStatus.BAD_REQUEST, 'Please select a business for the category.');

  console.log('create recipe');
  const recipe = await recipeService.createRecipe({ ...req.body, businessId });
  res.status(httpStatus.CREATED).send(createSuccessResponse({ recipe }));
});

export const getRecipesHandler = catchAsync(async (req: Request, res: Response) => {
  const { businessId } = req.user;

  const recipes = await recipeService.getRecipesByBusinessId(businessId);

  res.send(createSuccessResponse({ recipes }));
});

export const getRecipeHandler = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['recipeId'] === 'string') {
    const recipe = await recipeService.findRecipeById(new mongoose.Types.ObjectId(req.params['recipeId']));
    if (!recipe) throw new ApiError(httpStatus.NOT_FOUND, 'Recipe not found.');
    res.send(createSuccessResponse({ recipe }));
  }
});

export const updateRecipeHandler = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['recipeId'] === 'string') {
    const businessId = req.user.businessId ? req.user.businessId : new mongoose.Types.ObjectId(req.body.businessId);
    if (!businessId) throw new ApiError(httpStatus.BAD_REQUEST, 'Please select a business for the category.');

    const recipe = await recipeService.updateRecipeById(new mongoose.Types.ObjectId(req.params['recipeId']), {
      ...req.body,
      businessId,
    });

    res.status(httpStatus.OK).send(createSuccessResponse({ recipe }));
  }
});

export const deleteRecipeHandler = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.query['recipeId'] === 'string') {
    await recipeService.deleteRecipesById(req.query['recipeId'], req.user.businessId);
    res.send(createSuccessResponse());
  }
});

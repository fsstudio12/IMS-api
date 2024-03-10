import mongoose from 'mongoose';
import httpStatus from 'http-status';
import { Request, Response } from 'express';
import { catchAsync, extractBusinessId } from '../utils';
import { ApiError } from '../errors';
import * as recipeService from './recipe.service';
import createSuccessResponse from '../success/SuccessResponse';

export const createRecipeHandler = catchAsync(async (req: Request, res: Response) => {
  const businessId = extractBusinessId(req);

  console.log('create recipe');
  const recipe = await recipeService.createRecipe({ ...req.body, businessId });
  res.status(httpStatus.CREATED).send(createSuccessResponse({ recipe }));
});

export const getRecipesHandler = catchAsync(async (req: Request, res: Response) => {
  const businessId = extractBusinessId(req);
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
    const businessId = extractBusinessId(req);

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

export const recipeTableListHandler = catchAsync(async (req: Request, res: Response) => {
  const businessId = extractBusinessId(req);

  const tableListRecipes = await recipeService.getRecipeTableListHandler(businessId);

  res.send(createSuccessResponse({ recipes: tableListRecipes }));
});

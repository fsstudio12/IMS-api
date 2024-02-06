import mongoose from 'mongoose';
import httpStatus, { NO_CONTENT } from 'http-status';
import { Request, Response } from 'express';
import { catchAsync, pick } from '../utils';
import { IOptions } from '../paginate/paginate';
import * as categoryService from './category.service';
import { ApiError } from '../errors';
import createSuccessResponse from '../success/SuccessResponse';

export const createCategoryHandler = catchAsync(async (req: Request, res: Response) => {
  const category = await categoryService.createCategory(req.body);
  res.status(httpStatus.CREATED).send(createSuccessResponse(category));
});

export const getCategoriesHandler = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['name']);
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy']);
  const results = await categoryService.queryCategories(filter, options);
  res.send(createSuccessResponse(results));
});

export const getCategoryHandler = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['categoryId'] === 'string') {
    const category = await categoryService.getCategoryById(new mongoose.Types.ObjectId(req.params['categoryId']));
    if (!category) throw new ApiError(httpStatus.NOT_FOUND, 'Category not found.');
    res.send(createSuccessResponse(category));
  }
});

export const updateCategoryHandler = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['categoryId'] === 'string') {
    const category = await categoryService.updateCategoryById(
      new mongoose.Types.ObjectId(req.params['categoryId']),
      req.body
    );
    res.send(createSuccessResponse(category));
  }
});

export const deleteCategoryHandler = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['categoryId'] === 'string') {
    await categoryService.deleteCategoryById(new mongoose.Types.ObjectId(req.params['categoryId']));
    res.status(NO_CONTENT).send();
  }
});

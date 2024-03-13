import mongoose from 'mongoose';
import httpStatus, { NO_CONTENT } from 'http-status';
import { Request, Response } from 'express';
import { catchAsync, extractBusinessId } from '../utils';
import * as categoryService from './category.service';
import { ApiError } from '../errors';
import createSuccessResponse from '../success/SuccessResponse';

export const createCategoryHandler = catchAsync(async (req: Request, res: Response) => {
  const businessId = extractBusinessId(req);

  const category = await categoryService.createCategory({ ...req.body, businessId });
  res.status(httpStatus.CREATED).send(createSuccessResponse({ category }));
});

export const getCategoriesHandler = catchAsync(async (req: Request, res: Response) => {
  const businessId = extractBusinessId(req);
  const categories = await categoryService.getCategories(businessId);
  res.send(createSuccessResponse({ categories }));
});

export const getCategoryHandler = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['categoryId'] === 'string') {
    const category = await categoryService.getCategoryById(new mongoose.Types.ObjectId(req.params['categoryId']));
    if (!category) throw new ApiError(httpStatus.NOT_FOUND, 'Category not found.');
    res.send(createSuccessResponse({ category }));
  }
});

export const updateCategoryHandler = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['categoryId'] === 'string') {
    const category = await categoryService.updateCategoryById(
      new mongoose.Types.ObjectId(req.params['categoryId']),
      req.employee,
      req.body
    );
    res.send(createSuccessResponse({ category }));
  }
});

export const deleteCategoryHandler = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['categoryId'] === 'string') {
    await categoryService.deleteCategoryById(new mongoose.Types.ObjectId(req.params['categoryId']), req.employee);
    res.status(NO_CONTENT).send();
  }
});

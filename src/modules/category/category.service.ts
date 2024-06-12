import mongoose from 'mongoose';
import httpStatus from 'http-status';
import ApiError from '../errors/ApiError';
import Category from './category.model';
import { ICategoryDoc, NewCategory, UpdateCategory } from './category.interfaces';
import { IOptions, QueryResult } from '../paginate/paginate';
import { IEmployeeForAuth } from '../employee/employee.interfaces';
import { stringifyObjectId } from '../utils/common';

/**
 * Create a category
 * @param {NewCategory} categoryBody
 * @returns {Promise<ICategoryDoc>}
 */
export const createCategory = async (categoryBody: NewCategory): Promise<ICategoryDoc> => {
  if (await Category.isNameTaken(categoryBody.name)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Category with the entered name already exists.');
  }
  return Category.create(categoryBody);
};

export const queryCategories = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  const categories = await Category.paginate(filter, options);
  return categories;
};

export const getCategoryById = async (id: mongoose.Types.ObjectId): Promise<ICategoryDoc | null> => Category.findById(id);

export const updateCategoryById = async (
  categoryId: mongoose.Types.ObjectId,
  employee: IEmployeeForAuth,
  updateBody: UpdateCategory
): Promise<ICategoryDoc | null> => {
  const category = await getCategoryById(categoryId);
  if (!category) throw new ApiError(httpStatus.NOT_FOUND, 'Category not found.');

  if (employee.role !== 'super_admin' && stringifyObjectId(employee.business._id) !== stringifyObjectId(category.businessId))
    throw new ApiError(httpStatus.BAD_REQUEST, 'You can only update your own categories.');

  Object.assign(category, updateBody);
  await category.save();
  return category;
};

export const deleteCategoryById = async (
  categoryId: mongoose.Types.ObjectId,
  employee: IEmployeeForAuth
): Promise<ICategoryDoc | null> => {
  const category = await getCategoryById(categoryId);
  if (!category) throw new ApiError(httpStatus.NOT_FOUND, 'Category not found.');

  if (employee.role !== 'super_admin' && stringifyObjectId(employee.business._id) !== stringifyObjectId(category.businessId))
    throw new ApiError(httpStatus.BAD_REQUEST, 'You can only update your own categories.');

  await category.deleteOne();
  return category;
};

export const getCategories = async (businessId: mongoose.Types.ObjectId | null): Promise<ICategoryDoc[]> => {
  let matchQuery: any = {};

  if (businessId) {
    matchQuery = {
      businessId,
    };
  }

  const categories = await Category.aggregate([
    {
      $match: matchQuery,
    },
    {
      $project: {
        updatedAt: 0,
        __v: 0,
      },
    },
  ]);

  return categories;
};

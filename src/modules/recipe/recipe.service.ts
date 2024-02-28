import mongoose, { ClientSession, FilterQuery } from 'mongoose';
import httpStatus from 'http-status';
import { ApiError } from '../errors';
import { IRecipeDoc, NewRecipe, UpdateRecipe } from './recipe.interfaces';
import Recipe from './recipe.model';
import runInTransaction from '../utils/transactionWrapper';
import { sanitizeItemParams } from '../item/item.service';
import { splitFromQuery, stringifyObjectId } from '../utils/common';

export const getRecipesWithMatchQuery = async (matchQuery: FilterQuery<IRecipeDoc>): Promise<IRecipeDoc[]> => {
  return Recipe.aggregate([
    {
      $match: matchQuery,
    },
  ]);
};

export const getRecipesByBusinessId = async (businessId: mongoose.Types.ObjectId): Promise<IRecipeDoc[]> => {
  return getRecipesWithMatchQuery({ businessId });
};

export const findRecipesByFilterQuery = async (filterQuery: FilterQuery<IRecipeDoc>): Promise<IRecipeDoc[]> =>
  Recipe.find(filterQuery);

export const findRecipeById = async (id: mongoose.Types.ObjectId): Promise<IRecipeDoc | null> => Recipe.findById(id);

export const findRecipeByFilterQuery = async (filterQuery: FilterQuery<IRecipeDoc>): Promise<IRecipeDoc | null> =>
  Recipe.findOne(filterQuery);

export const findRecipeByIdAndBusinessId = async (
  _id: mongoose.Types.ObjectId,
  businessId: mongoose.Types.ObjectId
): Promise<IRecipeDoc | null> => {
  return findRecipeByFilterQuery({ _id, businessId });
};

export const createRecipe = async (recipeBody: NewRecipe): Promise<IRecipeDoc> => {
  if (await Recipe.isNameTaken(recipeBody.name, recipeBody.businessId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Recipe with the entered name already exists.');
  }

  const copiedRecipeCreateBody = { ...recipeBody };

  copiedRecipeCreateBody.combinationItems = await sanitizeItemParams(recipeBody.combinationItems);

  return Recipe.create(copiedRecipeCreateBody);
};

export const updateRecipeById = async (
  recipeId: mongoose.Types.ObjectId,
  updateBody: UpdateRecipe
): Promise<IRecipeDoc | null> => {
  const recipe = await findRecipeById(recipeId);
  if (!recipe) throw new ApiError(httpStatus.NOT_FOUND, 'Recipe not found.');

  if (await Recipe.isNameTaken(updateBody.name!, updateBody.businessId!, recipeId))
    throw new ApiError(httpStatus.NOT_FOUND, 'Recipe with the entered name already exists.');
  if (stringifyObjectId(updateBody.businessId!) !== stringifyObjectId(recipe.businessId))
    throw new ApiError(httpStatus.BAD_REQUEST, 'You can only update your own recipes.');

  const copiedRecipeUpdateBody = { ...updateBody };

  copiedRecipeUpdateBody.combinationItems = await sanitizeItemParams(updateBody.combinationItems!);

  Object.assign(recipe, copiedRecipeUpdateBody);
  await recipe.save();
  return recipe;
};

export const deleteRecipesById = async (queryRecipeIds: string, businessId?: mongoose.Types.ObjectId): Promise<void> => {
  const recipeIds = splitFromQuery(queryRecipeIds);
  const mappedRecipeIds = recipeIds.map((recipeId: string) => {
    return new mongoose.Types.ObjectId(recipeId);
  });

  const matchQuery: FilterQuery<IRecipeDoc> = {
    _id: { $in: mappedRecipeIds },
  };

  if (businessId) {
    matchQuery.businessId = businessId;
  }

  const updateRecipes = await findRecipesByFilterQuery({
    'combinationItems._id': {
      $in: mappedRecipeIds,
    },
  });

  await runInTransaction(async (session: ClientSession) => {
    await Promise.all(
      updateRecipes.map(async (dbRecipe) => {
        for (const [index, combinationItem] of Object.entries(dbRecipe.combinationItems)) {
          if (recipeIds.includes(stringifyObjectId(combinationItem._id))) {
            console.log(parseInt(index, 10));
            dbRecipe.combinationItems.splice(parseInt(index, 10), 1);
          }
        }
        await dbRecipe.save({ session });
      })
    );
    await Recipe.deleteMany(matchQuery).session(session);
  });
};

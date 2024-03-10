import mongoose from 'mongoose';
import httpStatus from 'http-status';

import { SortType } from '../../config/enums';
import { ApiError } from '../errors';

export const parseToString = (value: any): string => value.toString();

export const parseToInteger = (value: string): number => parseInt(value, 10);

export const stringifyObjectId = (_id: mongoose.Types.ObjectId) => _id.toString();

export const splitFromQuery = (queryParams: string) => queryParams.split(',');

export const setTwoDecimalPlaces = (amount: number) => parseFloat(amount.toFixed(2));

export const sortArrayByDate = <T>(arrayToSort: T[], dateField: keyof T, sortType: SortType = SortType.DESC): T[] =>
  arrayToSort.sort((a: T, b: T) =>
    sortType === SortType.DESC
      ? (new Date(b[dateField] as any) as any) - (new Date(a[dateField] as any) as any)
      : (new Date(a[dateField] as any) as any) - (new Date(b[dateField] as any) as any)
  );

export const getTotalOfArrayByField = <T>(array: T[], sumField: keyof T): number =>
  array.reduce((total: number, object: T) => setTwoDecimalPlaces(total + (object[sumField] as number)), 0);

export const findObjectFromArrayByField = <T>(
  array: T[],
  compareValue: string | number | mongoose.Types.ObjectId,
  findField: keyof T
) => {
  if (typeof compareValue === 'string' || typeof compareValue === 'number') {
    return array.find((object: T) => object[findField] === compareValue) || null;
  }

  if (compareValue instanceof mongoose.Types.ObjectId) {
    return (
      array.find(
        (object: T) => stringifyObjectId(object[findField] as mongoose.Types.ObjectId) === stringifyObjectId(compareValue)
      ) || null
    );
  }

  return null;
};

export const mapFromArrayByField = <T>(array: T[], mapField: keyof T) => array.map((object: T) => object[mapField]);

export const findIndexOfObjectFromArrayByField = <T>(
  array: T[],
  compareValue: string | number | mongoose.Types.ObjectId,
  findField: keyof T
): number => {
  if (typeof compareValue === 'string' || typeof compareValue === 'number') {
    return array.findIndex((object: T) => object[findField] === compareValue);
  }

  if (compareValue instanceof mongoose.Types.ObjectId) {
    return array.findIndex(
      (object: T) => stringifyObjectId(object[findField] as mongoose.Types.ObjectId) === stringifyObjectId(compareValue)
    );
  }

  return -1;
};

const getDifference = (firstArray: object[], secondArray: object[]) =>
  firstArray.filter(
    (firstArrayObject: any) =>
      !secondArray.some((secondArrayObject: any) => {
        if (!firstArrayObject._id || !secondArrayObject._id) {
          return !firstArrayObject._id && !secondArrayObject._id;
        }
        return stringifyObjectId(firstArrayObject._id) === stringifyObjectId(secondArrayObject._id);
      })
  );

export const getAddRemoveEditArrays = (newArray: object[], oldArray: object[]): any => {
  const addEntities = getDifference(newArray, oldArray);
  const removeEntities = getDifference(oldArray, newArray);
  const editEntities = getDifference(oldArray, [...addEntities, ...removeEntities]);

  return {
    addEntities,
    removeEntities,
    editEntities,
  };
};

export const getOrderString = (number: number): string => {
  if (number < 1) throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid input.');

  const lastDigit: number = number % 10;

  if (number === 1) return '1st';
  if (number === 2) return '2nd';
  if (number === 3) return '3rd';

  let suffix: string;

  if (number > 10 && number < 20) {
    suffix = 'th';
  } else if (lastDigit === 1) {
    suffix = 'st';
  } else if (lastDigit === 2) {
    suffix = 'nd';
  } else if (lastDigit === 3) {
    suffix = 'rd';
  } else {
    suffix = 'th';
  }

  return `${number}${suffix}`;
};

export const deepCopy = (dataToCopy: any) => JSON.parse(JSON.stringify(dataToCopy));

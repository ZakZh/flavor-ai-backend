import { z } from 'zod';
import {
  createStringValidator,
  createArrayValidator,
  positiveIntValidator,
  optionalPositiveIntValidator,
  urlValidator,
} from './common.validators';

export const ratingValidator = z
  .number()
  .int()
  .min(1, 'Rating must be at least 1')
  .max(5, 'Rating cannot exceed 5');

export const recipeCreationValidator = z.object({
  title: createStringValidator(1, 200),
  description: createStringValidator(0, 1000).optional(),
  instructions: createStringValidator(1, 5000),
  ingredients: createArrayValidator(createStringValidator(1, 200), 1, 100),
  cookTime: optionalPositiveIntValidator,
  imageUrl: urlValidator.optional(),
});

export const recipeUpdateValidator = z
  .object({
    title: createStringValidator(1, 200).optional(),
    description: createStringValidator(0, 1000).optional(),
    instructions: createStringValidator(1, 5000).optional(),
    ingredients: createArrayValidator(
      createStringValidator(1, 200),
      1,
      100,
    ).optional(),
    cookTime: optionalPositiveIntValidator,
    imageUrl: urlValidator.optional(),
  })
  .refine(
    (data) => {
      return Object.values(data).some((value) => value !== undefined);
    },
    {
      message: 'At least one field must be provided for update',
    },
  );

export const recipeNoteValidator = z.object({
  content: createStringValidator(1, 1000),
});

export const recipeRatingValidator = z.object({
  rating: ratingValidator,
});

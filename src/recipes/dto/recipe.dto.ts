import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import {
  recipeCreationValidator,
  recipeUpdateValidator,
  recipeRatingValidator,
  recipeNoteValidator,
} from '../../common/validators/recipe.validators';

// Schemas
export const CreateRecipeSchema = recipeCreationValidator;

export const UpdateRecipeSchema = recipeUpdateValidator;
export const RateRecipeSchema = recipeRatingValidator;
export const CreateRecipeNoteSchema = recipeNoteValidator;

// DTOs
export class CreateRecipeDto extends createZodDto(CreateRecipeSchema) {}
export class UpdateRecipeDto extends createZodDto(UpdateRecipeSchema) {}
export class RateRecipeDto extends createZodDto(RateRecipeSchema) {}
export class CreateRecipeNoteDto extends createZodDto(CreateRecipeNoteSchema) {}

// Types
export type CreateRecipeType = z.infer<typeof CreateRecipeSchema>;
export type UpdateRecipeType = z.infer<typeof UpdateRecipeSchema>;
export type RateRecipeType = z.infer<typeof RateRecipeSchema>;
export type CreateRecipeNoteType = z.infer<typeof CreateRecipeNoteSchema>;

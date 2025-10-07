import { z } from 'zod';

export const emailValidator = z.string().email('Invalid email format');

export const passwordValidator = z
  .string()
  .min(6, 'Password must be at least 6 characters')
  .max(128, 'Password cannot exceed 128 characters');

export const usernameValidator = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .max(30, 'Username cannot exceed 30 characters')
  .regex(
    /^[a-zA-Z0-9_-]+$/,
    'Username can only contain letters, numbers, underscores, and hyphens',
  );

export const urlValidator = z
  .string()
  .url('Invalid URL format')
  .or(z.literal(''));

export const positiveIntValidator = z.number().int().positive();

export const optionalPositiveIntValidator = z
  .number()
  .int()
  .positive()
  .optional();

export const createStringValidator = (
  minLength?: number,
  maxLength?: number,
) => {
  let validator = z.string();

  if (minLength !== undefined) {
    validator = validator.min(
      minLength,
      `Must be at least ${minLength} characters`,
    );
  }

  if (maxLength !== undefined) {
    validator = validator.max(
      maxLength,
      `Cannot exceed ${maxLength} characters`,
    );
  }

  return validator;
};

export const createArrayValidator = <T>(
  itemValidator: z.ZodType<T>,
  minItems?: number,
  maxItems?: number,
) => {
  let validator = z.array(itemValidator);

  if (minItems !== undefined) {
    validator = validator.min(minItems, `Must have at least ${minItems} items`);
  }

  if (maxItems !== undefined) {
    validator = validator.max(
      maxItems,
      `Cannot have more than ${maxItems} items`,
    );
  }

  return validator;
};

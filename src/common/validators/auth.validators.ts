import { z } from 'zod';
import {
  emailValidator,
  passwordValidator,
  usernameValidator,
} from './common.validators';

export const userRegistrationValidator = z
  .object({
    email: emailValidator,
    username: usernameValidator,
    password: passwordValidator,
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.confirmPassword && data.password !== data.confirmPassword) {
        return false;
      }
      return true;
    },
    {
      message: "Passwords don't match",
      path: ['confirmPassword'],
    },
  );

export const loginValidator = z.object({
  email: emailValidator,
  password: z.string().min(1, 'Password is required'),
});

import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import {
  userRegistrationValidator,
  loginValidator,
} from '../../common/validators/auth.validators';

// Re-export validators as schemas for backward compatibility
export const CreateUserSchema = userRegistrationValidator;
export const LoginSchema = loginValidator;

// DTOs
export class CreateUserDto extends createZodDto(CreateUserSchema) {}
export class LoginDto extends createZodDto(LoginSchema) {}

// Types
export type CreateUserType = z.infer<typeof CreateUserSchema>;
export type LoginType = z.infer<typeof LoginSchema>;

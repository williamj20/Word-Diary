import z from 'zod';

const EmailSchema = z.email({ error: 'Please enter a valid email.' });

export const PasswordFormSchema = z
  .object({
    password: z
      .string()
      .min(8, { error: 'Be at least 8 characters long.' })
      .regex(/[a-zA-Z]/, { error: 'Contain at least one letter.' })
      .regex(/[0-9]/, { error: 'Contain at least one number.' })
      .regex(/[^a-zA-Z0-9]/, {
        error: 'Contain at least one special character.',
      }),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    error: 'Passwords do not match.',
  });

export const SignupFormSchema = PasswordFormSchema.safeExtend({
  email: EmailSchema,
});

export const getEmailErrors = (email: string): string | undefined => {
  const result = EmailSchema.safeParse(email);
  return result.success ? undefined : result.error.issues[0].message;
};

export const getPasswordErrors = (
  fields: z.input<typeof PasswordFormSchema>
): Pick<SignupErrors, 'password' | 'confirmPassword'> | undefined => {
  const result = PasswordFormSchema.safeParse(fields);
  return result.success ? undefined : z.flattenError(result.error).fieldErrors;
};

export interface SignupErrors {
  email?: string[];
  password?: string[];
  confirmPassword?: string[];
}

export const getSignupErrors = (
  fields: z.input<typeof SignupFormSchema>
): SignupErrors | undefined => {
  const validatedFields = SignupFormSchema.safeParse(fields);
  return validatedFields.success
    ? undefined
    : z.flattenError(validatedFields.error).fieldErrors;
};

export type SignupFormState =
  | {
      fields?: {
        email?: string;
      };
      errors?: SignupErrors;
      message?: string;
    }
  | undefined;

export type LoginFormState =
  | {
      fields?: {
        email?: string;
      };
      errors?: string[];
    }
  | undefined;

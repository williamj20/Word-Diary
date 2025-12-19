import { FormState, SignupFormSchema } from '@/app/lib/definitions';
import z from 'zod';

export const signup = async (_state: FormState, formData: FormData) => {
  const name = String(formData.get('name'));
  const email = String(formData.get('email'));
  const password = String(formData.get('password'));
  const confirmPassword = String(formData.get('confirmPassword'));

  const validatedFields = SignupFormSchema.safeParse({
    name,
    email,
    password,
    confirmPassword,
  });
  if (!validatedFields.success) {
    const tree = z.treeifyError(validatedFields.error);
    return {
      fields: {
        name,
        email,
      },
      errors: {
        name: tree.properties?.name?.errors,
        email: tree.properties?.email?.errors,
        password: tree.properties?.password?.errors,
        confirmPassword: tree.properties?.confirmPassword?.errors,
      },
    };
  }
};

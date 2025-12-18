import { FormState, SignupFormSchema } from '@/app/lib/definitions';
import z from 'zod';

export const signup = async (_state: FormState, formData: FormData) => {
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });
  if (!validatedFields.success) {
    const tree = z.treeifyError(validatedFields.error);
    return {
      errors: {
        name: tree.properties?.name?.errors,
        email: tree.properties?.email?.errors,
        password: tree.properties?.password?.errors,
      },
    };
  }
};

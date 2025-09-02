'use server';

import { moderateContent } from '@/ai/flows/content-moderation';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const schema = z.object({
  content: z.string().min(1, { message: 'Post cannot be empty.' }).max(280, { message: 'Post must be 280 characters or less.' }),
});

export async function createPostAction(
  prevState: any,
  formData: FormData
) {
  const validatedFields = schema.safeParse({
    content: formData.get('content'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: null,
      success: false,
    };
  }

  const text = validatedFields.data.content;

  try {
    const moderationResult = await moderateContent({
      text,
      authorId: 'user-123-kaya', // Mock author ID
      contentType: 'post',
    });

    if (!moderationResult.isAppropriate) {
      return {
        errors: {},
        message: `Post blocked: ${moderationResult.reason}`,
        success: false,
      };
    }

    // Here you would typically save the post to a database.
    // We'll revalidate the path to simulate data refresh.
    revalidatePath('/');
    return {
      errors: {},
      message: 'Post created successfully!',
      success: true,
    };
  } catch (error) {
    console.error('Error during post creation:', error);
    return {
      errors: {},
      message: 'An unexpected error occurred. Please try again.',
      success: false,
    };
  }
}

const articleSchema = z.object({
  title: z.string().min(1, { message: 'Title is required.' }).max(120, { message: 'Title must be 120 characters or less.' }),
  content: z.string().min(50, { message: 'Article must be at least 50 characters.' }),
});

export async function createArticleAction(
  prevState: any,
  formData: FormData
) {
  const validated = articleSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
  });
  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: null,
      success: false,
    };
  }
  const { title, content } = validated.data;
  try {
    const moderationResult = await moderateContent({
      text: `${title}\n\n${content}`,
      authorId: 'user-123-kaya',
      contentType: 'post',
    });
    if (!moderationResult.isAppropriate) {
      return { errors: {}, message: `Article blocked: ${moderationResult.reason}`, success: false };
    }
    revalidatePath('/articles');
    return { errors: {}, message: 'Article approved.', success: true };
  } catch (e) {
    console.error(e);
    return { errors: {}, message: 'Unexpected error. Try again.', success: false };
  }
}

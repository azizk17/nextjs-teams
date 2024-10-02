# Creating a Form in Next.js with Server Actions, Zod, and Error Handling

This guide will walk you through creating a form in Next.js using the new server actions approach, along with Zod for schema validation and error handling both per field and globally.

## 1. Set up the Zod Schema

First, use drizzle zod shcema or define your form schema using Zod. 

```ts
import { z } from 'zod';

export const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters' }),
});
```

## 2. Create the Form Component

Create a form component that uses the schema for validation.

```tsx
"use client";
import { useActionState } from 'react';
export function ContactForm() {
    const [state, action, isPending] = useActionState(contactFormAction)

    return (
        <form action={action}>

        <div className="grid gap-4">
            {state?.success === false && (
              <div className="text-sm text-destructive-500">
                {state.message}
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" required />
                <span className="text-sm text-muted-foreground">
                Your email will be displayed on your profile.
              </span>

              {state?.errors?.email && (
                <span className="text-sm text-destructive-500">{state?.errors.email}</span>
              )}
            </div>
        </div>
        <Button type="submit" disabled={isPending}>
            {isPending ? 'Submitting...' : 'Submit'}
        </Button>
        </form>
    )
}
```

_actions.ts
```ts

export async function contactFormAction(prevState: any, formData: FormData): Promise<ActionResponse> {

    // validate the data
    const validated = ContactFormSchema.pick({ emai: true }).safeParse({
        email: formData.get("email"),
        // description: formData.get(""),
        // etc ...
    })
    // throw an error if the data is not valid
    if (!validated.success) return { success: false, status: 401, errors: validated.error.flatten().fieldErrors, }

    try {
        // your logic to send an email

        revalidatePath("/contact")
        return { success: true, data: updated }
    } catch (error) {
        return { success: false, status: 500, message: error?.message, data: { formData } }
    }
}

```
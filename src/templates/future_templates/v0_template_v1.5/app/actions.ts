"use server"

import { z } from "zod"

export interface FormState {
  message: string
  success: boolean
}

export async function submitContactForm(prevState: FormState, formData: FormData): Promise<FormState> {
  const schema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    message: z.string().min(10, { message: "Message must be at least 10 characters." }),
  })

  const parsed = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  })

  if (!parsed.success) {
    const errorMessage = parsed.error.errors.map((e) => e.message).join(", ")
    return { message: errorMessage, success: false }
  }

  const { name, email, message } = parsed.data

  // In a real application, you would integrate an email service here (e.g., Resend, SendGrid).
  // For now, we'll just log the data to the console and simulate a network delay.
  console.log("New contact form submission:")
  console.log({ name, email, message })
  await new Promise((resolve) => setTimeout(resolve, 1500))

  return { message: `Thank you, ${name}! Your message has been sent.`, success: true }
}

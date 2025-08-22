"use client"

import { useActionState, useEffect, useRef } from "react"
import { toast } from "sonner"
import { submitContactForm, type FormState } from "@/app/actions"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"

const initialState: FormState = {
  message: "",
  success: false,
}

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContactForm, initialState)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state.success) {
      toast.success(state.message)
      formRef.current?.reset()
    } else if (state.message && !state.success) {
      toast.error(state.message)
    }
  }, [state])

  return (
    <form ref={formRef} action={formAction} className="space-y-6 w-full max-w-lg text-left">
      <div className="space-y-2">
        <label htmlFor="name" className="font-serif text-xl text-foreground/80">
          Full Name
        </label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="Your Name"
          required
          className="bg-card/50 border-border/30 text-lg py-6"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="email" className="font-serif text-xl text-foreground/80">
          Email Address
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="your.email@example.com"
          required
          className="bg-card/50 border-border/30 text-lg py-6"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="message" className="font-serif text-xl text-foreground/80">
          Message
        </label>
        <Textarea
          id="message"
          name="message"
          placeholder="Let's create something amazing together..."
          required
          rows={5}
          className="bg-card/50 border-border/30 text-lg"
        />
      </div>
      <Button
        type="submit"
        disabled={isPending}
        className="w-full px-6 py-4 text-base sm:px-8 sm:py-6 sm:text-xl font-semibold rounded-full bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isPending ? (
          "Sending..."
        ) : (
          <>
            <Send className="mr-3 h-5 w-5" />
            Send Message
          </>
        )}
      </Button>
    </form>
  )
}

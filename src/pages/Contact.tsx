import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Toaster, toast } from "sonner"
import type { z } from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { contactFormSchema } from "@/lib/schemas"

type ContactFormValues = z.infer<typeof contactFormSchema>

export default function Contact() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
  })

  const onSubmit = async (data: ContactFormValues) => {
    try {
      const response = await fetch('http://localhost:3001/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      toast.success('Message sent successfully!')
      reset()
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Failed to send message. Please try again.')
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <Toaster />
      
      <main className="flex-1 container max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center space-y-8 py-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter">Contact Us</h1>
            <p className="text-muted-foreground max-w-[600px] mx-auto">
              Have questions or feedback? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          <Card className="w-full max-w-xl">
            <CardHeader>
              <CardTitle>Send a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    {...register("name")}
                    placeholder="Your name"
                    aria-describedby="name-error"
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive" id="name-error">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="your@email.com"
                    aria-describedby="email-error"
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive" id="email-error">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    {...register("subject")}
                    placeholder="Message subject"
                    aria-describedby="subject-error"
                  />
                  {errors.subject && (
                    <p className="text-sm text-destructive" id="subject-error">
                      {errors.subject.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    {...register("message")}
                    placeholder="Your message"
                    className="min-h-[150px]"
                    aria-describedby="message-error"
                  />
                  {errors.message && (
                    <p className="text-sm text-destructive" id="message-error">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
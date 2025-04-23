import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter'
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { Save, X, Code, Tag, Loader } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { ToastProvider } from '@/components/ui/toast'
import { db } from '@/lib/firebase'
import { collection, addDoc } from 'firebase/firestore'

const snippetSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  code: z.string().min(1, 'Code is required'),
  language: z.string().min(1, 'Language is required'),
  tags: z.array(z.string()).optional()
})

type SnippetFormData = z.infer<typeof snippetSchema>

interface SnippetModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
}

export function SnippetModal({ isOpen, onClose, userId }: SnippetModalProps) {
  const [tags, setTags] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const form = useForm<SnippetFormData>({
    resolver: zodResolver(snippetSchema),
    defaultValues: {
      title: '',
      code: '',
      language: 'javascript',
      tags: []
    }
  })

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value) {
      e.preventDefault()
      const newTag = e.currentTarget.value.trim()
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag])
        e.currentTarget.value = ''
      }
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const onSubmit = async (data: SnippetFormData) => {
    setIsSubmitting(true)
    try {
      await addDoc(collection(db, 'users', userId, 'snippets'), {
        ...data,
        tags,
        createdAt: new Date()
      })
      toast({
        title: 'Success',
        description: 'Snippet created successfully!',
        variant: 'default'
      })
      onClose()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create snippet',
        variant: 'destructive'
      })
    }
    setIsSubmitting(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Snippet</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-gray-700 border-gray-600" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Code className="w-4 h-4" />
                    Language
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="bg-gray-700 border-gray-600">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="javascript">JavaScript</SelectItem>
                      <SelectItem value="typescript">TypeScript</SelectItem>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="html">HTML</SelectItem>
                      <SelectItem value="css">CSS</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code</FormLabel>
                  <FormControl>
                    <div className="relative min-h-[200px] rounded-md border border-gray-600">
                      <textarea
                        {...field}
                        onKeyDown={(e) => {
                          if (e.key === 'Tab') {
                            e.preventDefault();
                            const start = e.currentTarget.selectionStart;
                            const end = e.currentTarget.selectionEnd;
                            const value = field.value;
                            field.onChange(value.substring(0, start) + '  ' + value.substring(end));
                            // Set cursor position after tab
                            setTimeout(() => {
                              e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 2;
                            }, 0);
                          }
                        }}
                        className="absolute inset-0 w-full h-full font-mono p-4 bg-transparent text-transparent caret-white resize-none z-10"
                      />
                      <SyntaxHighlighter
                        language={form.watch('language')}
                        style={dracula}
                        className="!m-0 !bg-transparent"
                        showLineNumbers
                        customStyle={{
                          padding: '1rem',
                          margin: 0,
                          background: 'transparent',
                        }}
                      >
                        {field.value || ' '}
                      </SyntaxHighlighter>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Tags
              </FormLabel>
              <Input
                onKeyDown={handleTagInput}
                className="bg-gray-700 border-gray-600"
                placeholder="Press Enter to add tags"
              />
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-teal-600 hover:bg-teal-500"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-2 hover:text-gray-300"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="bg-gray-700 hover:bg-gray-600"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-teal-600 hover:bg-teal-500"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export function App() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const currentUser = { uid: '12345' } // Example user object

  return (
    <ToastProvider>
      <div>
        <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
        <SnippetModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          userId={currentUser.uid}
        />
      </div>
    </ToastProvider>
  )
}

function useToast(): { toast: any } {
  throw new Error('Function not implemented.')
}

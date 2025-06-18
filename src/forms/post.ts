import { z } from "zod"

export const postFormSchema = z.object({
  title: z.string().min(4, { message: "Title Must Have 4 Characters" }),
  description: z.string().min(4, { message: "Description Must have 4 Characters" }),
  content: z.string().min(4, { message: "Content Must have 4 Characters" }),
  topics: z.array(z.string()).min(1, { message: "At Least One Topic Is Required" })
})

export type PostFormSchema = z.infer<typeof postFormSchema>

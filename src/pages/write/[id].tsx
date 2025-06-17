import React, { ReactElement, useEffect, useState } from "react"
import { NextPageWithLayout } from "../_app"
import WriteLayout from "@/components/layouts/WriteLayout"
import { zodResolver } from '@hookform/resolvers/zod';

import { useForm } from "react-hook-form"
import { PostFormSchema, postFormSchema } from "@/forms/post";
import { Form } from "@/components/ui/form";
import PostForm from "@/components/form/PostForm";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { skipToken } from "@tanstack/react-query";
import { useSavingStore } from "@/stores/SavingStore";

const WritePage: NextPageWithLayout = () => {
  const router = useRouter()
  const { id } = router.query

   const postId = typeof id === "string" ? id : Array.isArray(id) ? id[0] : null 

  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const { setIsSaving } = useSavingStore()

  const {data: responsePost} = trpc.post.getPost.useQuery(postId ? { id: postId } : skipToken)
  const {mutate: updatePost} = trpc.post.updatePost.useMutation({
    onMutate: () => setIsSaving(true),
    onSettled: () => setIsSaving(false)
  })

  const updatePostForm = useForm<PostFormSchema>({ resolver: zodResolver(postFormSchema) })
  const watchUpdatePostForm = updatePostForm.watch()

  useEffect(() => {
    if (responsePost) {
      updatePostForm.reset({...responsePost})
      setImageUrl(responsePost.imageUrl)
    }
  }, [responsePost, updatePostForm])

  useEffect(() => {
    if (!responsePost || !watchUpdatePostForm) return

    const timeOut = setTimeout(() => {
      updatePost({
        id: responsePost.id,
        title: watchUpdatePostForm.title,
        description: watchUpdatePostForm.description,
        content: watchUpdatePostForm.content,
        imageUrl: imageUrl ?? ""
      })
    }, 3000)

    return () => clearTimeout(timeOut)
  }, [watchUpdatePostForm.title, watchUpdatePostForm.description, watchUpdatePostForm.content, imageUrl])

  return (
    <div className="w-screen p-4 flex justify-center items-center">
      <div className="w-4xl flex flex-col">
        <Form {...updatePostForm}>
          <PostForm 
            imageUrl={imageUrl ?? ""} 
            setImageUrl={(imageUrl) => setImageUrl(imageUrl)} 
            onSubmit={() => console.log("on submit")} 
          />
        </Form>
      </div>
    </div>
  )
}

WritePage.getLayout = (page: ReactElement) => { return <WriteLayout>{page}</WriteLayout> }
export default WritePage

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
import { useFormPostStore } from "@/stores/FormPostStore";

const WritePage: NextPageWithLayout = () => {
  const router = useRouter()
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const { setIsSaving } = useSavingStore()
  const { setForm } = useFormPostStore()

  const updatePostForm = useForm<PostFormSchema>({ resolver: zodResolver(postFormSchema) })
  const watchUpdatePostForm = updatePostForm.watch()

  const { id } = router.query
  const postId = typeof id === "string" ? id : Array.isArray(id) ? id[0] : null  

  const { data: responseUserPost, isLoading: loadingUserPost, error: errorUserPost } = trpc.post.getUserPost.useQuery(postId ? { id: postId } : skipToken)
  const { data: responseTopicOnPost, isLoading: loadingTopicOnPost } = trpc.topic.getTopicOnPost.useQuery(postId ? { id: postId } : skipToken)
  const { mutate: updatePost } = trpc.post.updatePost.useMutation({ onMutate: () => setIsSaving(true), onSettled: () => setIsSaving(false) }) 

  if (errorUserPost) {
    if (errorUserPost.data?.code === "FORBIDDEN") router.replace("/")
  }

  useEffect(() => {
    if (responseUserPost && responseTopicOnPost) {
      updatePostForm.reset({...responseUserPost, topics: responseTopicOnPost.map((topic) => topic.topicId)})
      setImageUrl(responseUserPost.imageUrl)
    }
  }, [responseUserPost, responseTopicOnPost, updatePostForm])

  useEffect(() => {
    if (!responseUserPost || !watchUpdatePostForm) return

    const timeOut = setTimeout(() => {
      updatePost({
        id: responseUserPost.id,
        title: watchUpdatePostForm.title,
        description: watchUpdatePostForm.description,
        content: watchUpdatePostForm.content, 
        imageUrl: imageUrl ?? "",
        topics: watchUpdatePostForm.topics
      })
    }, 1000)

    setForm(updatePostForm)

    return () => clearTimeout(timeOut)
  }, [updatePostForm, watchUpdatePostForm.title, watchUpdatePostForm.description, watchUpdatePostForm.content, watchUpdatePostForm.topics, imageUrl]) 

  return (
    <div className="w-screen p-4 flex justify-center items-center"> 
      <div className="w-4xl">
        { loadingUserPost && loadingTopicOnPost && <span>Loading...</span> }
        { responseUserPost && responseTopicOnPost && 
          <Form {...updatePostForm}>
            <PostForm 
              imageUrl={imageUrl ?? ""} 
              setImageUrl={(imageUrl) => setImageUrl(imageUrl)} 
            />
          </Form>
        }
      </div>
    </div>
  )
}

WritePage.getLayout = (page: ReactElement) => { return <WriteLayout>{page}</WriteLayout> }
export default WritePage

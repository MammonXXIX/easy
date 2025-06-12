import React, { ReactElement, useState } from "react"
import { NextPageWithLayout } from "../_app"
import WriteLayout from "@/components/layouts/WriteLayout"
import { zodResolver } from '@hookform/resolvers/zod';

import { useForm } from "react-hook-form"
import { PostFormSchema, postFormSchema } from "@/forms/post";
import { Form } from "@/components/ui/form";
import PostForm from "@/components/form/PostForm";

const WritePage: NextPageWithLayout = () => { 
  const createPostForm = useForm<PostFormSchema>({ resolver: zodResolver(postFormSchema) })

  return (
    <div className="w-screen p-4 flex justify-center items-center">
      <div className="w-2xl flex flex-col">
        <Form {...createPostForm}>
          <PostForm />
        </Form>
      </div>
    </div>
  )
}

WritePage.getLayout = (page: ReactElement) => { return <WriteLayout>{page}</WriteLayout> }
export default WritePage

import { Bucket } from '@/server/supabase/bucket';
import { createClient } from '@supabase/supabase-js';

export const supabaseClient = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

type createSupabaseUploadToSignedUrlProps = { path: string; token: string; file: File; bucket: Bucket }
export const createSupabaseUploadToSignedUrl = (async ({ path, token, file, bucket }: createSupabaseUploadToSignedUrlProps) => {
  try {
    const { data, error } = await supabaseClient.storage.from(bucket).uploadToSignedUrl(path, token, file)
    
    if (error) throw error
    if (!data) throw new Error("No Image Uploaded")

    const { publicUrl } = supabaseClient.storage.from(bucket).getPublicUrl(data.path).data

    return publicUrl
  } catch (error) {
    throw error
  }
})


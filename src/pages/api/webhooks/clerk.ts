import { prisma } from '@/server/trpc/prisma';
import { UserJSON } from '@clerk/nextjs/server';
import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== "POST") return res.status(404).send("UNAUTHORIZED")

    const { data, type } = await verifyWebhook(req)

    if (type !== "user.created") return res.status(404).send("UNAUTHORIZED")

    const { id, email_addresses, first_name, image_url } = data as UserJSON  

    await prisma.user.create({
      data: {
        id: id,
        email: email_addresses[0].email_address,
        firstName: first_name ?? "",
        imageUrl: image_url
      }
    })

    return res.status(200).send("Webhook Received")
  } catch (error) {
    console.error('Error Verifying Webhook:', error)
    return res.status(400).send("Error verifying Webhook")
  }
}

export default handler

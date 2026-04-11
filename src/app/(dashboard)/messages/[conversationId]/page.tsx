import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { MessageThread } from "@/components/messages/message-thread";

export const metadata = {
  title: "Conversation",
};

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/signin");

  const { conversationId } = await params;
  const userId = session.user.id;

  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      buyer: { select: { id: true, name: true, image: true } },
      seller: { select: { id: true, name: true, image: true } },
      product: { select: { id: true, title: true, slug: true } },
      messages: {
        orderBy: { createdAt: "asc" },
        include: {
          sender: { select: { id: true, name: true, image: true } },
        },
      },
    },
  });

  if (!conversation) notFound();

  // Verify user is part of this conversation
  if (conversation.buyerId !== userId && conversation.sellerId !== userId) {
    redirect("/messages");
  }

  // Mark unread messages as read
  await prisma.message.updateMany({
    where: {
      conversationId,
      receiverId: userId,
      read: false,
    },
    data: { read: true },
  });

  const otherUser =
    conversation.buyer.id === userId
      ? conversation.seller
      : conversation.buyer;

  return (
    <MessageThread
      conversation={JSON.parse(JSON.stringify(conversation))}
      currentUserId={userId}
      otherUser={otherUser}
    />
  );
}

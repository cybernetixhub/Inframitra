import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ConversationList } from "@/components/messages/conversation-list";

export const metadata = {
  title: "Messages",
};

export default async function MessagesPage() {
  const session = await auth();
  if (!session?.user) redirect("/signin");

  const userId = session.user.id;

  const conversations = await prisma.conversation.findMany({
    where: {
      OR: [{ buyerId: userId }, { sellerId: userId }],
    },
    orderBy: { updatedAt: "desc" },
    include: {
      buyer: { select: { id: true, name: true, image: true } },
      seller: { select: { id: true, name: true, image: true } },
      product: { select: { id: true, title: true, slug: true } },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: {
          id: true,
          content: true,
          senderId: true,
          read: true,
          createdAt: true,
        },
      },
    },
  });

  // Get unread counts
  const conversationsWithUnread = await Promise.all(
    conversations.map(async (conv) => {
      const unreadCount = await prisma.message.count({
        where: {
          conversationId: conv.id,
          receiverId: userId,
          read: false,
        },
      });
      return { ...conv, unreadCount };
    })
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Messages</h1>
        <p className="text-muted-foreground">
          Your conversations with buyers and sellers.
        </p>
      </div>

      <ConversationList
        conversations={JSON.parse(JSON.stringify(conversationsWithUnread))}
        currentUserId={userId}
      />
    </div>
  );
}

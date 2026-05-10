import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { getPaymentProvider, type PaymentDetails } from "@/lib/payment";
import { Prisma } from "@/generated/prisma";

const TAX_RATE = 0.18; // GST 18%
const FREE_SHIPPING_THRESHOLD = 25000; // Free shipping above ₹25,000
const SHIPPING_COST = 1999; // ₹1,999 flat shipping

function generateOrderNumber(): string {
  const date = new Date();
  const datePart = date.toISOString().slice(0, 10).replace(/-/g, "");
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${datePart}-${randomPart}`;
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      shippingName,
      shippingAddress,
      shippingCity,
      shippingState,
      shippingZip,
      shippingCountry,
      shippingPhone,
      paymentDetails,
    } = body as {
      shippingName: string;
      shippingAddress: string;
      shippingCity: string;
      shippingState: string;
      shippingZip: string;
      shippingCountry: string;
      shippingPhone?: string;
      paymentDetails: PaymentDetails;
    };

    if (
      !shippingName ||
      !shippingAddress ||
      !shippingCity ||
      !shippingState ||
      !shippingZip ||
      !shippingCountry
    ) {
      return NextResponse.json(
        { error: "Shipping information is required" },
        { status: 400 }
      );
    }

    if (!paymentDetails) {
      return NextResponse.json(
        { error: "Payment details are required" },
        { status: 400 }
      );
    }

    // Fetch cart items
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: session.user.id },
      include: {
        product: {
          select: {
            id: true,
            title: true,
            price: true,
            quantity: true,
            sellerId: true,
            status: true,
            images: {
              orderBy: { sortOrder: "asc" },
              take: 1,
            },
          },
        },
      },
    });

    if (cartItems.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    // Create order in a transaction with stock validation inside the transaction
    const order = await prisma.$transaction(async (tx) => {
      // Validate stock inside the transaction to prevent race conditions
      for (const item of cartItems) {
        const product = await tx.product.findUnique({
          where: { id: item.product.id },
          select: { quantity: true, status: true, title: true },
        });

        if (!product || product.status !== "ACTIVE") {
          throw new Error(
            `VALIDATION:"${item.product.title}" is no longer available`
          );
        }
        if (product.quantity < item.quantity) {
          throw new Error(
            `VALIDATION:Insufficient stock for "${item.product.title}" (available: ${product.quantity})`
          );
        }
      }

      // Calculate totals
      const subtotal = cartItems.reduce(
        (sum, item) => sum + Number(item.product.price) * item.quantity,
        0
      );
      const tax = subtotal * TAX_RATE;
      const shippingCost =
        subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
      const total = subtotal + tax + shippingCost;

      // Create order in PENDING state first
      const newOrder = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          buyerId: session.user.id,
          status: "PENDING",
          paymentStatus: "PENDING",
          subtotal: new Prisma.Decimal(subtotal.toFixed(2)),
          tax: new Prisma.Decimal(tax.toFixed(2)),
          shippingCost: new Prisma.Decimal(shippingCost.toFixed(2)),
          total: new Prisma.Decimal(total.toFixed(2)),
          shippingName,
          shippingAddress,
          shippingCity,
          shippingState,
          shippingZip,
          shippingCountry,
          shippingPhone: shippingPhone || null,
          paymentMethod: "card",
          items: {
            create: cartItems.map((item) => ({
              productId: item.product.id,
              sellerId: item.product.sellerId,
              quantity: item.quantity,
              unitPrice: item.product.price,
              totalPrice: new Prisma.Decimal(
                (Number(item.product.price) * item.quantity).toFixed(2)
              ),
              productTitle: item.product.title,
              productImage: item.product.images[0]?.url || null,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      // Process payment
      const provider = getPaymentProvider();
      const paymentResult = await provider.processPayment(
        total,
        "INR",
        paymentDetails
      );

      if (!paymentResult.success) {
        // Payment failed — mark order as CANCELLED
        await tx.order.update({
          where: { id: newOrder.id },
          data: {
            status: "CANCELLED",
            paymentStatus: "FAILED",
          },
        });
        throw new Error(
          `PAYMENT:${paymentResult.error || "Payment failed"}`
        );
      }

      // Payment succeeded — update order to CONFIRMED
      const confirmedOrder = await tx.order.update({
        where: { id: newOrder.id },
        data: {
          status: "CONFIRMED",
          paymentStatus: "PAID",
          paymentRef: paymentResult.transactionId,
        },
        include: {
          items: true,
        },
      });

      // Decrement product quantities
      for (const item of cartItems) {
        await tx.product.update({
          where: { id: item.product.id },
          data: {
            quantity: {
              decrement: item.quantity,
            },
          },
        });
      }

      // Clear cart
      await tx.cartItem.deleteMany({
        where: { userId: session.user.id },
      });

      return confirmedOrder;
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.startsWith("VALIDATION:")) {
        return NextResponse.json(
          { error: error.message.replace("VALIDATION:", "") },
          { status: 400 }
        );
      }
      if (error.message.startsWith("PAYMENT:")) {
        return NextResponse.json(
          { error: error.message.replace("PAYMENT:", "") },
          { status: 400 }
        );
      }
    }
    console.error("Error processing checkout:", error);
    return NextResponse.json(
      { error: "Failed to process checkout" },
      { status: 500 }
    );
  }
}

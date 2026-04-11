import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const signUpSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    role: z.enum(["BUYER", "SELLER"]),
    storeName: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      if (data.role === "SELLER" && (!data.storeName || data.storeName.length < 2)) {
        return false;
      }
      return true;
    },
    {
      message: "Store name is required for sellers",
      path: ["storeName"],
    }
  );

export const productSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().positive("Price must be positive"),
  comparePrice: z.coerce.number().positive().optional().nullable(),
  condition: z.enum(["NEW", "REFURBISHED", "USED"]),
  categoryId: z.string().min(1, "Category is required"),
  brandId: z.string().optional().nullable(),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
  sku: z.string().optional(),
  warranty: z.string().optional(),
  shippingInfo: z.string().optional(),
});

export const checkoutSchema = z.object({
  shippingName: z.string().min(2, "Name is required"),
  shippingAddress: z.string().min(5, "Address is required"),
  shippingCity: z.string().min(2, "City is required"),
  shippingState: z.string().min(2, "State is required"),
  shippingZip: z.string().min(3, "ZIP code is required"),
  shippingCountry: z.string().min(2, "Country is required"),
  shippingPhone: z.string().optional(),
});

export const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  title: z.string().optional(),
  comment: z.string().optional(),
});

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;

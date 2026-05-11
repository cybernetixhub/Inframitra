export const PERMISSIONS = {
  ADMIN_DASHBOARD: "admin.dashboard",
  ADMIN_USERS_READ: "admin.users.read",
  ADMIN_USERS_WRITE: "admin.users.write",
  ADMIN_USERS_DELETE: "admin.users.delete",
  ADMIN_USERS_RBAC: "admin.users.rbac",
  ADMIN_PRODUCTS_READ: "admin.products.read",
  ADMIN_PRODUCTS_WRITE: "admin.products.write",
  ADMIN_PRODUCTS_DELETE: "admin.products.delete",
  ADMIN_ORDERS_READ: "admin.orders.read",
  ADMIN_ORDERS_WRITE: "admin.orders.write",
  ADMIN_CATEGORIES_READ: "admin.categories.read",
  ADMIN_CATEGORIES_WRITE: "admin.categories.write",
  ADMIN_LEADS_READ: "admin.leads.read",
  ADMIN_LEADS_WRITE: "admin.leads.write",
  ADMIN_REQUESTS_READ: "admin.requests.read",
  ADMIN_REQUESTS_WRITE: "admin.requests.write",
  SELLER_PRODUCTS: "seller.products",
  SELLER_ORDERS: "seller.orders",
  BUYER_ORDERS: "buyer.orders",
  BUYER_CART: "buyer.cart",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const ALL_PERMISSIONS = Object.values(PERMISSIONS);

export const PERMISSION_GROUPS: Record<string, Permission[]> = {
  "Admin Access": [
    PERMISSIONS.ADMIN_DASHBOARD,
    PERMISSIONS.ADMIN_USERS_READ,
    PERMISSIONS.ADMIN_USERS_WRITE,
    PERMISSIONS.ADMIN_USERS_DELETE,
    PERMISSIONS.ADMIN_USERS_RBAC,
  ],
  "Product Management": [
    PERMISSIONS.ADMIN_PRODUCTS_READ,
    PERMISSIONS.ADMIN_PRODUCTS_WRITE,
    PERMISSIONS.ADMIN_PRODUCTS_DELETE,
  ],
  "Order Management": [
    PERMISSIONS.ADMIN_ORDERS_READ,
    PERMISSIONS.ADMIN_ORDERS_WRITE,
  ],
  "Category Management": [
    PERMISSIONS.ADMIN_CATEGORIES_READ,
    PERMISSIONS.ADMIN_CATEGORIES_WRITE,
  ],
  "Sales & Leads": [
    PERMISSIONS.ADMIN_LEADS_READ,
    PERMISSIONS.ADMIN_LEADS_WRITE,
    PERMISSIONS.ADMIN_REQUESTS_READ,
    PERMISSIONS.ADMIN_REQUESTS_WRITE,
  ],
  "Seller Access": [
    PERMISSIONS.SELLER_PRODUCTS,
    PERMISSIONS.SELLER_ORDERS,
  ],
  "Buyer Access": [
    PERMISSIONS.BUYER_ORDERS,
    PERMISSIONS.BUYER_CART,
  ],
};

export const PERMISSION_LABELS: Record<string, string> = {
  [PERMISSIONS.ADMIN_DASHBOARD]: "View admin dashboard",
  [PERMISSIONS.ADMIN_USERS_READ]: "View users",
  [PERMISSIONS.ADMIN_USERS_WRITE]: "Create/edit users",
  [PERMISSIONS.ADMIN_USERS_DELETE]: "Delete users",
  [PERMISSIONS.ADMIN_USERS_RBAC]: "Manage user roles/groups",
  [PERMISSIONS.ADMIN_PRODUCTS_READ]: "View products",
  [PERMISSIONS.ADMIN_PRODUCTS_WRITE]: "Create/edit products",
  [PERMISSIONS.ADMIN_PRODUCTS_DELETE]: "Delete/archive products",
  [PERMISSIONS.ADMIN_ORDERS_READ]: "View orders",
  [PERMISSIONS.ADMIN_ORDERS_WRITE]: "Update order status",
  [PERMISSIONS.ADMIN_CATEGORIES_READ]: "View categories",
  [PERMISSIONS.ADMIN_CATEGORIES_WRITE]: "Manage categories",
  [PERMISSIONS.ADMIN_LEADS_READ]: "View sales leads",
  [PERMISSIONS.ADMIN_LEADS_WRITE]: "Update leads",
  [PERMISSIONS.ADMIN_REQUESTS_READ]: "View service requests",
  [PERMISSIONS.ADMIN_REQUESTS_WRITE]: "Update service requests",
  [PERMISSIONS.SELLER_PRODUCTS]: "Manage own products",
  [PERMISSIONS.SELLER_ORDERS]: "View own seller orders",
  [PERMISSIONS.BUYER_ORDERS]: "View own orders",
  [PERMISSIONS.BUYER_CART]: "Use cart/checkout",
};

export const DEFAULT_GROUPS = [
  {
    name: "Super Admin",
    description: "Full access to everything",
    permissions: ALL_PERMISSIONS,
    isSystem: true,
  },
  {
    name: "Admin",
    description: "Admin access without user deletion",
    permissions: ALL_PERMISSIONS.filter(
      (p) => p !== PERMISSIONS.ADMIN_USERS_DELETE
    ),
    isSystem: true,
  },
  {
    name: "Sales Manager",
    description: "Manage leads and service requests",
    permissions: [
      PERMISSIONS.ADMIN_DASHBOARD,
      PERMISSIONS.ADMIN_LEADS_READ,
      PERMISSIONS.ADMIN_LEADS_WRITE,
      PERMISSIONS.ADMIN_REQUESTS_READ,
      PERMISSIONS.ADMIN_REQUESTS_WRITE,
    ],
    isSystem: true,
  },
  {
    name: "Product Manager",
    description: "Manage products and categories",
    permissions: [
      PERMISSIONS.ADMIN_DASHBOARD,
      PERMISSIONS.ADMIN_PRODUCTS_READ,
      PERMISSIONS.ADMIN_PRODUCTS_WRITE,
      PERMISSIONS.ADMIN_PRODUCTS_DELETE,
      PERMISSIONS.ADMIN_CATEGORIES_READ,
      PERMISSIONS.ADMIN_CATEGORIES_WRITE,
    ],
    isSystem: true,
  },
  {
    name: "Seller",
    description: "Manage own products and orders",
    permissions: [
      PERMISSIONS.SELLER_PRODUCTS,
      PERMISSIONS.SELLER_ORDERS,
    ],
    isSystem: true,
  },
  {
    name: "Buyer",
    description: "Browse and purchase products",
    permissions: [
      PERMISSIONS.BUYER_ORDERS,
      PERMISSIONS.BUYER_CART,
    ],
    isSystem: true,
  },
];

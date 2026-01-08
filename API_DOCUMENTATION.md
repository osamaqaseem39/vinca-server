# Vinca Backend API Documentation

Complete API documentation for Vinca Optics and Glasses E-commerce Platform.

## Base URL
```
http://localhost:5000/api
```

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### Register User
```http
POST /api/auth/register
```
**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890"
}
```

### Login
```http
POST /api/auth/login
```
**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
**Response:** Returns user data and JWT token

### Get Current User
```http
GET /api/auth/me
```
**Headers:** `Authorization: Bearer <token>`

### Forgot Password
```http
POST /api/auth/forgot-password
```
**Body:**
```json
{
  "email": "john@example.com"
}
```

### Reset Password
```http
POST /api/auth/reset-password
```
**Body:**
```json
{
  "email": "john@example.com",
  "password": "newpassword123",
  "resetToken": "token"
}
```

---

## Product Endpoints

### Get All Products
```http
GET /api/products
```
**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 12)
- `sort` - Sort field (default: createdAt)
- `order` - Sort order: asc/desc (default: desc)
- `category` - Category slug
- `brand` - Brand name
- `frameType` - Frame type filter
- `frameMaterial` - Frame material filter
- `lensType` - Lens type filter
- `gender` - Gender filter (men/women/unisex/kids)
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `inStock` - Filter by stock status (true/false)
- `search` - Search term

**Example:**
```
GET /api/products?category=eyeglasses&minPrice=50&maxPrice=200&gender=men
```

### Get Single Product
```http
GET /api/products/:id
```

### Get Featured Products
```http
GET /api/products/featured
```

### Get Products by Brand
```http
GET /api/products/brand/:brand
```

### Create Product (Admin)
```http
POST /api/products
```
**Body:**
```json
{
  "name": "Classic Aviator",
  "description": "Timeless aviator style frames",
  "brand": "Vinca",
  "category": "category_id",
  "price": 149.99,
  "discountPrice": 129.99,
  "images": ["url1", "url2"],
  "stockQuantity": 50,
  "sku": "VINCA-AVI-001",
  "frameType": "aviator",
  "frameMaterial": "metal",
  "frameColor": "Black",
  "lensType": "sunglasses",
  "lensMaterial": "polycarbonate",
  "gender": "unisex",
  "size": {
    "eye": 58,
    "bridge": 18,
    "temple": 140
  },
  "features": ["UV Protection", "Polarized"]
}
```

### Update Product (Admin)
```http
PUT /api/products/:id
```

### Delete Product (Admin)
```http
DELETE /api/products/:id
```

---

## Category Endpoints

### Get All Categories
```http
GET /api/categories
```

### Get Single Category
```http
GET /api/categories/:id
```

### Create Category (Admin)
```http
POST /api/categories
```
**Body:**
```json
{
  "name": "Eyeglasses",
  "description": "Prescription eyeglasses",
  "image": "url",
  "parent": "parent_category_id"
}
```

### Update Category (Admin)
```http
PUT /api/categories/:id
```

### Delete Category (Admin)
```http
DELETE /api/categories/:id
```

---

## Cart Endpoints

All cart endpoints require authentication.

### Get Cart
```http
GET /api/cart
```

### Add to Cart
```http
POST /api/cart
```
**Body:**
```json
{
  "productId": "product_id",
  "quantity": 1,
  "prescription": "prescription_id",
  "lensOptions": {
    "type": "single-vision",
    "coating": ["anti-reflective", "blue-light"],
    "tint": "none"
  }
}
```

### Update Cart Item
```http
PUT /api/cart/:itemId
```
**Body:**
```json
{
  "quantity": 2,
  "prescription": "prescription_id",
  "lensOptions": {}
}
```

### Remove from Cart
```http
DELETE /api/cart/:itemId
```

### Clear Cart
```http
DELETE /api/cart
```

---

## Order Endpoints

All order endpoints require authentication.

### Get User Orders
```http
GET /api/orders
```

### Get Single Order
```http
GET /api/orders/:id
```

### Create Order
```http
POST /api/orders
```
**Body:**
```json
{
  "shippingAddress": {
    "type": "home",
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "United States",
    "isDefault": true
  },
  "billingAddress": {
    "type": "home",
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "United States"
  },
  "paymentMethod": "card",
  "paymentIntentId": "stripe_payment_intent_id"
}
```

### Cancel Order
```http
PUT /api/orders/:id/cancel
```

### Update Order Status (Admin)
```http
PUT /api/orders/:id/status
```
**Body:**
```json
{
  "orderStatus": "shipped",
  "trackingNumber": "TRACK123456"
}
```

---

## Prescription Endpoints

All prescription endpoints require authentication.

### Get User Prescriptions
```http
GET /api/prescriptions
```

### Get Single Prescription
```http
GET /api/prescriptions/:id
```

### Create Prescription
```http
POST /api/prescriptions
```
**Body:**
```json
{
  "type": "single-vision",
  "rightEye": {
    "sphere": -2.5,
    "cylinder": -0.5,
    "axis": 90
  },
  "leftEye": {
    "sphere": -2.0,
    "cylinder": -0.25,
    "axis": 85
  },
  "pupillaryDistance": 62,
  "notes": "First prescription"
}
```

### Update Prescription
```http
PUT /api/prescriptions/:id
```

### Delete Prescription
```http
DELETE /api/prescriptions/:id
```

### Set Active Prescription
```http
PUT /api/prescriptions/:id/active
```

---

## Review Endpoints

### Get Product Reviews
```http
GET /api/reviews/product/:productId
```
**Query Parameters:**
- `page` - Page number
- `limit` - Items per page

### Create Review
```http
POST /api/reviews
```
**Body:**
```json
{
  "product": "product_id",
  "rating": 5,
  "title": "Great glasses!",
  "comment": "Very comfortable and stylish"
}
```

### Update Review
```http
PUT /api/reviews/:id
```

### Delete Review
```http
DELETE /api/reviews/:id
```

### Mark Review as Helpful
```http
PUT /api/reviews/:id/helpful
```

---

## User Endpoints

All user endpoints require authentication.

### Get Profile
```http
GET /api/users/profile
```

### Update Profile
```http
PUT /api/users/profile
```
**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "dateOfBirth": "1990-01-01"
}
```

### Change Password
```http
PUT /api/users/change-password
```
**Body:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

### Get Addresses
```http
GET /api/users/addresses
```

### Add Address
```http
POST /api/users/addresses
```
**Body:**
```json
{
  "type": "home",
  "street": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001",
  "country": "United States",
  "isDefault": true
}
```

### Update Address
```http
PUT /api/users/addresses/:id
```

### Delete Address
```http
DELETE /api/users/addresses/:id
```

---

## Payment Endpoints

### Create Payment Intent
```http
POST /api/payments/create-intent
```
**Body:**
```json
{
  "shippingAddress": {},
  "billingAddress": {}
}
```
**Response:**
```json
{
  "clientSecret": "pi_xxx_secret_xxx",
  "amount": 159.99
}
```

### Stripe Webhook
```http
POST /api/payments/webhook
```
**Note:** This endpoint is called by Stripe, not directly by clients.

---

## Admin Endpoints

All admin endpoints require admin role.

### Get Dashboard Statistics
```http
GET /api/admin/stats
```

### Get All Users
```http
GET /api/admin/users
```
**Query Parameters:**
- `page` - Page number
- `limit` - Items per page
- `search` - Search term

### Get Single User
```http
GET /api/admin/users/:id
```

### Update User
```http
PUT /api/admin/users/:id
```
**Body:**
```json
{
  "name": "John Doe",
  "role": "admin"
}
```

### Delete User
```http
DELETE /api/admin/users/:id
```

### Get All Orders
```http
GET /api/admin/orders
```
**Query Parameters:**
- `page` - Page number
- `limit` - Items per page
- `status` - Filter by order status

### Update Product Stock
```http
PUT /api/admin/products/:id/stock
```
**Body:**
```json
{
  "stockQuantity": 100
}
```

---

## Error Responses

All errors follow this format:
```json
{
  "success": false,
  "error": "Error message"
}
```

**Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

---

## Product Schema

```typescript
{
  name: string;
  description: string;
  brand: string;
  category: ObjectId;
  price: number;
  discountPrice?: number;
  images: string[];
  inStock: boolean;
  stockQuantity: number;
  sku: string;
  frameType: 'full-rim' | 'semi-rimless' | 'rimless' | 'browline' | 'cat-eye' | 'round' | 'square' | 'aviator';
  frameMaterial: 'acetate' | 'metal' | 'titanium' | 'plastic' | 'wood' | 'carbon-fiber';
  frameColor: string;
  lensType: 'single-vision' | 'bifocal' | 'progressive' | 'reading' | 'sunglasses';
  lensMaterial?: 'polycarbonate' | 'trivex' | 'high-index' | 'glass';
  gender: 'men' | 'women' | 'unisex' | 'kids';
  size: {
    eye: number;      // 40-70mm
    bridge: number;   // 10-30mm
    temple: number;   // 120-160mm
  };
  features: string[];
  ratings: {
    average: number;
    count: number;
  };
}
```

---

## Notes

- All prices are in USD
- JWT tokens expire in 7 days (configurable)
- Free shipping on orders over $100
- Tax rate is 8% (configurable)
- Stock is automatically updated when orders are created/cancelled
- Product ratings are automatically calculated from reviews


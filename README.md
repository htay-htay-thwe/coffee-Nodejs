# ☕ Coffee Shop API

A robust RESTful API built with Node.js and Express for managing a coffee shop's operations, including product management, order processing, cart functionality, and user authentication.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [API Endpoints](#-api-endpoints)
- [Authentication](#-authentication)
- [Usage Examples](#-usage-examples)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 🔐 User Management
- User registration with email validation
- Secure password hashing with bcrypt
- Google OAuth integration
- JWT-based authentication
- Role-based access control (Admin/User)
- User profile management with image upload

### ☕ Product Management
- Create, read, update, and delete coffee products
- Category management for coffee and cakes
- Image upload support for products
- Product type classification (Hot/Cold/Frappe)
- Price and description management

### 🛒 Shopping Cart
- Add products to cart
- Remove items from cart
- View cart items
- Support for both coffee and cake products
- User-specific cart management

### 📦 Order Management
- Create orders from cart
- Direct order creation
- Order history tracking
- Order status updates (Pending/Preparing/Ready/Completed)
- Payment status tracking (Paid/Unpaid)
- Admin dashboard with all orders
- Clear order functionality

### 🪑 Table Management
- Create and manage table numbers
- Table reservation system

## 🛠️ Tech Stack

- **Runtime Environment:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens) & Google OAuth
- **Password Hashing:** bcrypt
- **Validation:** express-validator
- **File Upload:** Multer
- **Security:** CORS, Cookie Parser
- **Development Tools:** Morgan (HTTP logger), Nodemon
- **Environment Management:** dotenv

## 📁 Project Structure

```
coffee-Nodejs/
├── controllers/           # Request handlers
│   ├── CartController.js
│   ├── CoffeeController.js
│   ├── OrderController.js
│   ├── TableController.js
│   └── UserController.js
├── models/               # Database schemas
│   ├── CakeCategories.js
│   ├── Carts.js
│   ├── Categories.js
│   ├── Coffees.js
│   ├── Orders.js
│   ├── TableNos.js
│   └── Users.js
├── routes/               # API route definitions
│   ├── order.js
│   ├── product.js
│   └── user.js
├── middlewares/          # Custom middleware
│   └── AuthMiddleware.js
├── jwt/                  # JWT utilities
│   └── createToken.js
├── validations/          # Request validation
│   └── HandleValidation.js
├── uploads/              # Uploaded files storage
├── server.js             # Application entry point
├── package.json
└── .env                  # Environment variables
```

## 🚀 Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/htay-htay-thwe/coffee-Nodejs.git
   cd coffee-Nodejs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   MONGODB_URL=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

4. **Create uploads directory**
   ```bash
   mkdir uploads
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   The server will run on `http://localhost:3000`

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port number | Yes |
| `MONGODB_URL` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for JWT signing | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | Optional |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | Optional |

### CORS Configuration

The API is configured to accept requests from:
- All origins (*)
- `http://localhost:5173` (Frontend development server)

Modify the CORS settings in `server.js` for production deployment.

## 📡 API Endpoints

### 🔐 Authentication & User Routes (`/api/user`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register new user | No |
| POST | `/login` | User login | No |
| POST | `/google-login` | Google OAuth login | No |
| GET | `/profile` | Get user profile | Yes |
| PUT | `/update-profile` | Update user profile | Yes |
| POST | `/logout` | User logout | Yes |

### ☕ Product Routes (`/api/coffee`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/create` | Create new product | Yes (Admin) |
| GET | `/get` | Get all products | Yes |
| GET | `/edit/:id` | Get product by ID | Yes |
| POST | `/update` | Update product | Yes (Admin) |
| GET | `/delete/:id` | Delete product | Yes (Admin) |
| POST | `/category` | Create coffee category | Yes (Admin) |
| POST | `/cake/category` | Create cake category | Yes (Admin) |
| GET | `/get/category` | Get all coffee categories | Yes |
| GET | `/get/cake/category` | Get all cake categories | Yes |
| POST | `/create/table` | Create table number | Yes (Admin) |

### 🛒 Order & Cart Routes (`/api/order`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/create/cart` | Add item to cart | Yes |
| POST | `/create/cart/cake` | Add cake to cart | Yes |
| GET | `/get/cart/:id/:userId` | Get cart items | Yes |
| GET | `/delete/cart/:id/:userId` | Remove from cart | Yes |
| GET | `/get/item/:id` | Get cart item details | Yes |
| POST | `/create` | Create order from cart | Yes |
| POST | `/direct/create` | Create direct order | Yes |
| POST | `/direct/create/cake` | Create direct cake order | Yes |
| GET | `/get/:id` | Get order by ID | Yes |
| GET | `/all/get` | Get all orders (Admin) | Yes (Admin) |
| GET | `/get/history/order` | Get user order history | Yes |
| POST | `/update` | Update order status | Yes (Admin) |
| POST | `/update/paid` | Update payment status | Yes (Admin) |
| POST | `/delete` | Clear orders | Yes (Admin) |
| GET | `/get/all/data` | Get analytics data | Yes (Admin) |

## 🔒 Authentication

This API uses **JWT (JSON Web Tokens)** for authentication. The token is stored in HTTP-only cookies for security.

### How it works:

1. **Register/Login**: User provides credentials
2. **Token Generation**: Server generates JWT token
3. **Token Storage**: Token stored in HTTP-only cookie
4. **Protected Routes**: Token verified via `AuthMiddleware`
5. **Authorization**: Role-based access control

### Making Authenticated Requests

Include the JWT token in cookies:

```javascript
fetch('http://localhost:3000/api/coffee/get', {
  method: 'GET',
  credentials: 'include', // Important for cookies
  headers: {
    'Content-Type': 'application/json'
  }
})
```

## 💡 Usage Examples

### 1. Register a New User

```javascript
POST /api/user/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "confirmPassword": "securePassword123"
}
```

### 2. Login

```javascript
POST /api/user/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

### 3. Create a Product (Admin)

```javascript
POST /api/coffee/create
Content-Type: multipart/form-data
Authorization: Bearer <token>

{
  "categoryId": "507f1f77bcf86cd799439011",
  "name": "Cappuccino",
  "type": "Hot",
  "price": 4.99,
  "description": "Rich espresso with steamed milk",
  "image": <file>
}
```

### 4. Add to Cart

```javascript
POST /api/order/create/cart
Content-Type: application/json
Authorization: Bearer <token>

{
  "coffeeId": "507f1f77bcf86cd799439011",
  "userId": "507f191e810c19729de860ea",
  "kind": "Hot",
  "quantity": 2
}
```

### 5. Create Order

```javascript
POST /api/order/create
Content-Type: application/json
Authorization: Bearer <token>

{
  "userId": "507f191e810c19729de860ea",
  "tableNo": "5",
  "items": [
    {
      "productId": "507f1f77bcf86cd799439011",
      "quantity": 2,
      "price": 4.99
    }
  ]
}
```

## 📊 Database Models

### User Schema
- name (String)
- email (String, unique)
- password (String, hashed)
- googleId (String, optional)
- image (String)
- role (String: "user" | "admin")

### Coffee/Product Schema
- categoryId (ObjectId)
- name (String)
- type (String)
- price (Number)
- image (String)
- description (String)

### Order Schema
- userId (ObjectId)
- items (Array)
- tableNo (String)
- status (String: "pending" | "preparing" | "ready" | "completed")
- paid (Boolean)
- totalAmount (Number)
- createdAt (Timestamp)

### Cart Schema
- userId (ObjectId)
- productId (ObjectId)
- quantity (Number)
- kind (String)

## 🔧 Development

### Run in Development Mode
```bash
npm run dev
```

### Run in Production Mode
```bash
npm start
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Htay Htay Thwe**

- GitHub: [@htay-htay-thwe](https://github.com/htay-htay-thwe)

## 🙏 Acknowledgments

- Express.js for the robust web framework
- MongoDB for the flexible database solution
- JWT for secure authentication
- All contributors and supporters of this project

---

<div align="center">
  Made with ☕ and ❤️
</div>

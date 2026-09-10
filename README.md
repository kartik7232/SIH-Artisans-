# 🧵 AI-Driven Market Linkage & Smart Cataloging for Artisans

> **Smart cataloging. Better pricing. Wider markets. Empowering marginalized artisans with AI.**

An AI-powered digital marketplace solution designed to help marginalized and traditional artisans **digitize their products, generate professional product catalogs, receive AI-assisted pricing recommendations, and connect with potential customers**.

This project was developed as a prototype for **Smart India Hackathon (SIH)**.

---

## 🚀 Problem Statement

Many marginalized artisans struggle to bring their products to digital marketplaces because of:

* Lack of technical knowledge for creating product listings
* Difficulty writing professional product descriptions
* Uncertainty about competitive product pricing
* Limited access to wider markets
* Lack of digital product catalogs
* Dependence on intermediaries who reduce artisan earnings

Our solution aims to simplify this process using **AI-assisted product cataloging and market linkage**.

---

## 💡 Our Solution

The platform allows an artisan to upload an image of their handmade product.

The system can then use AI to analyze the product and assist with:

1. 🖼️ **Product Image Analysis**
2. 🏷️ **Automatic Product Categorization**
3. ✍️ **AI-Generated Product Description**
4. 💰 **AI-Assisted Price Recommendation**
5. 📦 **Digital Product Catalog**
6. 🛍️ **Marketplace Listing**
7. 🔐 **Role-Based Authentication**
8. ☁️ **Cloud Image Storage**

### Example Workflow

```text
Artisan
   │
   ▼
Upload Product Image
   │
   ▼
AI Image Analysis
   │
   ├── Product Category
   ├── Product Description
   └── Price Recommendation
   │
   ▼
Artisan Reviews / Edits Details
   │
   ▼
Product Saved to Database
   │
   ▼
Digital Marketplace
   │
   ▼
Customers Discover Artisan Products
```

---

# 🧠 AI Features

The platform integrates **Google Gemini** to assist artisans with product catalog creation.

### Image → Product Information

Instead of manually entering every detail, the artisan can provide a product image.

The AI analyzes the image and generates relevant information such as:

```text
Category:
Wall Poster

Description:
AI-generated description of the handmade product...

Price Recommendation:
Minimum: ₹450
Recommended: ₹850
Maximum: ₹1500
```

The recommended price is intended as **decision support**, allowing artisans to review and modify the final price.

---

# 🏗️ System Architecture

```text
                 ┌─────────────────────┐
                 │      Frontend       │
                 │   Web Application   │
                 └──────────┬──────────┘
                            │
                         REST API
                            │
                            ▼
                 ┌─────────────────────┐
                 │       FastAPI       │
                 │      Backend        │
                 └─────────┬───────────┘
                           │
             ┌─────────────┼─────────────┐
             │             │             │
             ▼             ▼             ▼
       ┌──────────┐   ┌──────────┐  ┌──────────┐
       │Supabase  │   │ Gemini   │  │   JWT    │
       │PostgreSQL│   │   AI     │  │   Auth   │
       └──────────┘   └──────────┘  └──────────┘
             │
             ▼
       ┌──────────┐
       │ Supabase │
       │ Storage  │
       └──────────┘
```

---

# 🛠️ Tech Stack

## Frontend

* Web-based frontend
* REST API integration
* Product catalog interface
* Authentication interface
* Product image upload

## Backend

* **Python**
* **FastAPI**
* **SQLAlchemy**
* **JWT Authentication**
* **bcrypt**
* **Pydantic**
* **Uvicorn**

## Database & Cloud

* **Supabase**
* **PostgreSQL**
* **Supabase Storage**

## Artificial Intelligence

* **Google Gemini**
* Multimodal image analysis
* Product categorization
* Product description generation
* AI-assisted pricing recommendation

## Development

* Git
* GitHub
* Swagger / OpenAPI
* VS Code

---

# 📂 Project Structure

```text
SIH-Artisans/
│
├── Frontend/
│   └── ...
│
├── Backend/
│   │
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py
│   │   └── product.py
│   │
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── user.py
│   │   └── product.py
│   │
│   ├── auth.py
│   ├── database.py
│   ├── main.py
│   ├── requirements.txt
│   ├── .env
│   └── .gitignore
│
└── README.md
```

> `.env` contains sensitive configuration and must **never be committed** to the repository.

---

# 🔐 Authentication & Authorization

The backend implements JWT-based authentication.

### Authentication

Users can:

* Register
* Login
* Receive an access token
* Access authenticated endpoints

### Authorization

Different user roles can have different permissions.

Example:

```text
User
 │
 ├── Artisan
 │     ├── Create products
 │     ├── Manage products
 │     └── Upload product images
 │
 └── Admin
       ├── Administrative access
       └── Protected admin endpoints
```

The system therefore separates:

> **Authentication — Who are you?**

from

> **Authorization — What are you allowed to do?**

---

# 📦 Product Management

Products contain information such as:

```text
Product
├── ID
├── Artisan ID
├── Name
├── Description
├── Price
├── Category
└── Image URL
```

Products are associated with the authenticated artisan.

---

# 🖼️ Image Storage

Product images are stored using **Supabase Storage**.

The general flow is:

```text
Product Image
      │
      ▼
Supabase Storage
      │
      ▼
Public / Accessible Image URL
      │
      ▼
Product Database Record
```

The database stores the image URL rather than the raw image itself.

---

# 🔌 API

The backend exposes REST APIs through FastAPI.

Interactive API documentation is automatically generated by FastAPI.

When the backend is running locally:

```text
http://127.0.0.1:8000/docs
```

OpenAPI specification:

```text
http://127.0.0.1:8000/openapi.json
```

---

# 📡 Core API Flow

### Authentication

```text
POST /register
POST /login
GET  /profile
```

### Products

```text
POST /products
GET  /products
```

### AI

```text
POST /products/analyze-image
```

The AI endpoint analyzes an uploaded product image and provides cataloging information and pricing assistance.

---

# ⚙️ Local Setup

## 1. Clone the Repository

```bash
git clone https://github.com/kartik7232/SIH-Artisans-.git
cd SIH-Artisans-
```

---

## 2. Create a Virtual Environment

```bash
cd Backend

python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

---

## 3. Install Dependencies

```bash
pip install -r requirements.txt
```

---

## 4. Configure Environment Variables

Create a `.env` file inside the `Backend` directory.

Example:

```env
DATABASE_URL=your_database_connection_string
GEMINI_API_KEY=your_gemini_api_key
```

**Do not commit this file to GitHub.**

---

## 5. Start the Backend

```bash
uvicorn main:app --reload
```

The backend should be available at:

```text
http://127.0.0.1:8000
```

Swagger documentation:

```text
http://127.0.0.1:8000/docs
```

---

# 🧪 Testing

The backend APIs can be tested using:

* FastAPI Swagger UI
* Postman
* Frontend integration

Swagger provides an interactive interface for testing authentication, products, AI endpoints, and protected routes.

---

# 🔒 Security

Sensitive credentials are kept outside the source code.

The project uses:

* Environment variables
* JWT authentication
* Password hashing with bcrypt
* Role-based authorization
* Protected API endpoints
* Supabase database security

### Never commit:

```text
.env
database passwords
API keys
JWT secrets
service-role keys
```

---

# 🌟 Key Differentiator

Traditional marketplace platforms generally require artisans to manually create product listings.

Our approach introduces an **AI-assisted cataloging workflow**:

```text
Traditional Approach

Image → Manual Category → Manual Description → Manual Pricing
```

versus:

```text
Our Approach

Image → AI Analysis → Category + Description + Price Assistance
                         ↓
                   Artisan Review
                         ↓
                   Final Listing
```

The artisan remains in control while AI reduces the technical and documentation burden.

---

# 🎯 Target Users

### Primary Users

* Traditional artisans
* Marginalized artisans
* Rural artisans
* Handicraft producers
* Small-scale craft businesses

### Secondary Users

* Customers looking for handmade products
* Marketplace administrators
* Organizations supporting artisans
* Craft communities

---

# 🔮 Future Scope

Potential future improvements include:

* 🌐 Multilingual AI-generated listings
* 🗣️ Voice-based product listing
* 📱 Dedicated mobile application
* 💳 Integrated payments
* 🚚 Order and delivery management
* 📊 Artisan sales analytics
* 🔍 AI-powered product search
* 🌍 International marketplace support
* 🤝 Direct customer-to-artisan communication
* 📈 Market trend analysis
* 🧠 Personalized pricing using historical market data
* 🏆 Artisan verification and digital identity

---

# 📊 Current Prototype

The current prototype demonstrates the core technical pipeline:

```text
✅ User Registration
✅ JWT Login
✅ Authentication
✅ Role-Based Authorization
✅ Artisan Product Creation
✅ Product Retrieval
✅ PostgreSQL Database
✅ Supabase Integration
✅ Supabase Image Storage
✅ AI Image Analysis
✅ AI Product Categorization
✅ AI Description Generation
✅ AI Price Recommendation
🔄 Frontend ↔ Backend Integration
```

---

# 👥 Team

Built by a student team for **Smart India Hackathon**.

### Team Roles

* **Tech Lead / Backend**

  * Backend architecture
  * API development
  * Database integration
  * Authentication & authorization
  * AI integration
  * Frontend-backend integration

* **Frontend Developers**

  * Web interface
  * Product catalog
  * Authentication UI
  * API integration

* **Presentation / Research**

  * Problem research
  * Solution presentation
  * Documentation
  * Demonstration

---

# 🏆 Smart India Hackathon

This project was developed as a prototype for **Smart India Hackathon (SIH)** with the goal of exploring how artificial intelligence and digital marketplaces can reduce barriers faced by marginalized artisans.

---

# 📜 License

This project is currently developed as an **educational hackathon prototype**.

---

## ⭐ Project Vision

> **Give every artisan the ability to turn a handmade product into a professional digital listing with minimal technical effort.**

**From handmade → AI-assisted → digitally discoverable.**

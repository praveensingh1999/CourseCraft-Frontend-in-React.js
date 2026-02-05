# 🎓 Course Craft – Full Stack Online Learning Platform

Course Craft is a **production-ready MERN stack online learning platform** that enables users to learn, teach, and manage courses efficiently.  
It supports **secure authentication, instructor dashboards, course creation, payments, reviews, and role-based access control**.

---

## 🚀 Live Links

- **Frontend (Vercel)**  
  https://course-craft-frontend-in-react-js.vercel.app

- **Backend (Render)**  
  https://coursecraft-backend-with-node-js-1.onrender.com

---

## 🧠 Features

### 👥 Authentication
- JWT-based authentication
- Signup with email OTP verification
- Login & logout
- Forgot / reset password flow
- Role-based access (Student / Instructor / Admin)

---

### 📚 Courses
- Create, update, delete courses (Instructor)
- Course categories & filtering
- Section-based structured content
- Upload thumbnails & videos via Cloudinary
- Draft & publish course workflow

---

### ⭐ Reviews & Ratings
- Students can review & rate courses
- Average rating calculation
- Dynamic review slider on homepage

---

### 🛒 Cart & Payments
- Add/remove courses from cart
- Razorpay payment gateway integration
- Secure checkout
- Automatic enrollment after payment

---

### 📊 Dashboards

#### Student Dashboard
- Enrolled courses
- Course progress
- Profile & settings

#### Instructor Dashboard
- Create and manage courses
- Instructor analytics
- Revenue insights

---

### 📩 Contact & Support
- Contact Us form
- Backend email handling

---

## 🧩 Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- Redux Toolkit
- React Router
- Axios

### Backend
- Node.js
- Express.js
- MongoDB & Mongoose
- JWT & Bcrypt
- Cloudinary
- Razorpay
- Nodemailer

### Deployment
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

---

## 🗂 Project Structure

Course-Craft/
│
├── client/ # Frontend (React)
│ ├── src/
│ ├── components/
│ ├── pages/
│ ├── redux/
│ └── services/
│
├── server/ # Backend (Node.js)
│ ├── controllers/
│ ├── routes/
│ ├── models/
│ ├── middlewares/
│ ├── config/
│ └── index.js
│
└── README.md


---

## 🔐 Environment Variables

### Backend (`server/.env`)

MONGODB_URL=your_mongodb_uri
JWT_SECRET=your_secret
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
MAIL_HOST=smtp_host
MAIL_USER=email
MAIL_PASS=password


### Frontend (`.env`)

VITE_BASE_URL=https://coursecraft-backend-with-node-js-1.onrender.com



---

## 🛠 Installation & Setup

### 1️⃣ Clone Repository
```bash
git clone https://github.com/praveensingh1999/Course-Craft.git
cd Course-Craft


2️⃣ Backend Setup
cd server
npm install
npm run dev

3️⃣ Frontend Setup
cd client
npm install
npm run dev


🌍 API Overview

Method	          Endpoint	                           Description

POST	             /api/v1/auth/signup	               User Signup
POST	            /api/v1/auth/login	                   User Login
GET	                /api/v1/course/showAllCategories	   Get Categories
POST	            /api/v1/course/createCourse	           Create Course
POST	           /api/v1/payment/capturePayment	       Payment



🔒 Security

Password hashing using bcrypt
JWT token verification
Protected routes
Role-based access control
Secure CORS configuration


🚀 Future Enhancements

Course completion certificates
Admin analytics dashboard
Wishlist feature
AI-based course recommendations
Video streaming optimization


👨‍💻 Author

Praveen Singh
Full Stack MERN Developer
GitHub: https://github.com/praveensingh1999


⭐ Support

If you find this project helpful:
⭐ Star the repository
🍴 Fork the project
🧠 Use it as a learning reference

---
![Homepage](assets/coursecreaft.jpg)
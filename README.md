# **SDK Alkaline Water Co. Management System**

## **Overview**

The SDK Alkaline Water Co. Management System is a web-based application designed to streamline stock management and user authentication for workers and administrators. It allows users to manage stock data, track water levels, and handle production and dispatch records efficiently.

---

## **Features**

* **Authentication** : Role-based login for workers and administrators.
* **Stock Management** : Add, view, and manage stock data, including production, dispatch, and water levels.
* **File Uploads** : Upload images for labels and shrink wrap stock.
* **Admin Dashboard** : View summarized stock data and analytics.
* **Responsive Design** : Optimized for desktop and mobile devices.

---

## **Technologies Used**

### **Frontend**

* React.js
* React Router
* Ant Design (UI components)
* CSS for custom styling

### **Backend**

* Node.js with Express.js
* MongoDB with Mongoose
* Multer for file uploads
* JWT for authentication

---

## **Installation**

### **Prerequisites**

* Node.js installed on your machine
* MongoDB installed and running locally or on a cloud service

## **Usage**

### **1. Authentication**

* **Workers** : Sign in to manage stock data.
* **Admins** : Access the admin dashboard for analytics and stock summaries.

### **2. Stock Management**

* Fill out the stock form with production, dispatch, and water level details.
* Upload images for labels and shrink wrap stock.
* Submit the form to save data to the backend.

### **3. Admin Dashboard**

* View summarized stock data, including production trends and water level alerts.
* Access uploaded images for verification.

---

## **Folder Structure**

**sdk-alkaline/**

**├── frontend/**

**│   ├── src/**

**│   │   ├── components/**

**│   │   │   ├── Auth/**

**│   │   │   │   ├── SignIn.js**

**│   │   │   │   ├── SignUp.js**

**│   │   │   ├── Stock/**

**│   │   │   │   ├── stockForm.js**

**│   │   │   ├── Admin/**

**│   │   │   │   ├── AdminDash.js**

**│   │   ├── styles/**

**│   │   │   ├── signin.css**

**│   │   │   ├── stock.css**

**│   │   │   ├── dashboard.css**

**│   ├── public/**

**│   ├── package.json**

**├── backend/**

**│   ├── models/**

**│   │   ├── User.js**

**│   │   ├── Stock.js**

**│   ├── controllers/**

**│   │   ├── authController.js**

**│   │   ├── stockController.js**

**│   ├── routes/**

**│   │   ├── authRoutes.js**

**│   │   ├── stockRoutes.js**

**│   ├── middleware/**

**│   │   ├── auth.js**

**│   ├── uploads/**

**│   ├── server.js**

**│   ├── package.json**

---

## **API Endpoints**

### **Authentication**

* `POST /api/auth/signup`: Register a new user.
* `POST /api/auth/login`: Log in and receive a JWT token.

### **Stock Management**

* `POST /api/stocks/save`: Save stock data and uploaded images.
* `GET /api/stocks/all`: Retrieve all stock data.

# Contributions

Contibutions eare allowed! Please follow these steps: 

1. Fork the repository.
2. Create a new branch:
   git checkout -b feature-name
3. Commit your changes:
   git commit -m "Add feature-name"
4. Push to the branch:
   git push origin feature-name
5. Open a pull request


## **License**

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

## **Contact**

For questions or support, please contact:


* **Name** : Your Name
* **Email** mensahanni98@gmail.com
* **GitHub** : [M](vscode-file://vscode-app/c:/Users/LENOVO%20i5/AppData/Local/Programs/Microsoft%20VS%20Code/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html)cAnnison

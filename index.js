const express = require('express');
const app = express();
require('dotenv').config();

app.set('view engine', 'ejs');

// Serve static files from the "public" directory
app.use(express.static('public'));

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded



const mongoose = require('mongoose');
const userController = require('./controllers/userControllers');

const session = require('express-session');

const secret_key = 'alphanyx';

app.use(session({
    secret: secret_key,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));


// Middleware to check if the user is logged in
function isLoggedIn(req, res, next) {
  if (req.session.userId) {
      next(); // If there's a userId in the session, proceed to the next middleware/route handler
  } else {
      res.redirect('/login'); // If not logged in, redirect to the login page
  }
}

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Database connected successfully'))
  .catch(err => console.error('Database connection error: ', err));
  
// Define routes
app.get('/',
   (req, res) => {
  res.render('pages/homepage');
});

app.get('/ordersummary', (req, res) => {
const dummyOrderData = {
    orderItems: [
        { name: "Product 1", quantity: 2, price: 15.99 },
        { name: "Product 2", quantity: 1, price: 25.99 },
        { name: "Product 3", quantity: 3, price: 9.99 }
    ],
    paymentMethod: "Credit Card",
    totalAmount: 77.95
};

  
  res.render('pages/ordersummary',dummyOrderData);
});



app.get('/signup', (req, res) => {
  res.render('pages/signup');
});

app.get('/login', (req, res) => {
  res.render('pages/login');
}
);

app.get('/cart', (req, res) => {
  res.render('pages/cart');
}
);

app.get('/admin/product', (req, res) => {
  res.render('pages/adminproduct');
}
);

app.get('/forgotpassword', (req, res) => {
  res.render('pages/forgotpassword');
}
);

app.get('/resetpassword', (req, res) => {
  res.render('pages/resetpassword');
}
);


app.get('/homepage',isLoggedIn, (req, res) => {
  res.render('pages/homepage');
}
);


app.get('/products', (req, res) => {
  res.render('pages/products');
}
);

app.get('/productdetails', (req, res) => {
  res.render('pages/productdetails');
});

app.get('/profile', (req, res) => {
  res.render('pages/profile');
});

app.post('/signup', userController.signup);

app.post('/login', userController.login);

app.get('/logout', userController.logout);


// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
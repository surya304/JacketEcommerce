const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const Product = require('./models/product');
console.log('Product:');


const userController = require('./controllers/usercontrollers');
require('dotenv').config();

const app = express();

app.set('view engine', 'ejs');

// Serve static files from the "public" directory
app.use(express.static('public'));

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Session configuration
const secret_key = 'alphanyx';
app.use(session({
    secret: secret_key,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to false for development, true for production with HTTPS
}));

// Middleware to check if user is logged in
function isLoggedIn(req, res, next) {
    console.log('isLoggedIn:', req.session.userId);
    console.log('isLoggedIn:', req.session.isLoggedIn);
    if (req.session.userId) {
        next(); // If there's a userId in the session, proceed to the next middleware/route handler
    } else {
        res.redirect('/login'); // If not logged in, redirect to the login page
    }
}

// set locals 
app.use((req, res, next) => {
    res.locals.isLoggedIn = req.session.isLoggedIn;
    console.log('res.locals.isLoggedIn:', res.locals.isLoggedIn);
    next();
});

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database connected successfully'))
    .catch(err => console.error('Database connection error: ', err));

// Define routes
app.get('/', isLoggedIn, (req, res) => {
    res.render('pages/homepage');
});

app.get('/aboutus', (req, res) => {

    res.render('pages/aboutus');
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

    res.render('pages/ordersummary', dummyOrderData);
});

app.get('/signup', (req, res) => {
    res.render('pages/signup');
});

app.get('/login', (req, res) => {
    res.render('pages/login');
});

app.get('/cart', (req, res) => {
    res.render('pages/cart');
});

app.get('/admin/product', (req, res) => {
    res.render('pages/adminproduct');
});

app.get('/forgotpassword', (req, res) => {
    res.render('pages/forgotpassword');
});

app.get('/resetpassword/:token', (req, res) => {
    const { token } = req.params;
    res.render('pages/resetpassword', { token });
});
const Category = require('./models/Category'); // Adjust the path as necessary

app.get('/products', isLoggedIn, async (req, res) => {
  try {
      res.render('pages/products');
  } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).send('Internal Server Error');
  }
});

app.get('/api/products', async (req, res) => {
  try {
      const { categoryId, priceOrder, search } = req.query;
      const filter = {};
      if (categoryId) filter.categoryId = categoryId;
      if (search) filter.name = new RegExp(search, 'i'); // Case-insensitive search

      let productsQuery = Product.find(filter).populate('categoryId');
      if (priceOrder) {
          const sortOrder = priceOrder === 'asc' ? 1 : -1;
          productsQuery = productsQuery.sort({ price: sortOrder });
      }
      const products = await productsQuery;
      res.json(products);
  } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).send('Internal Server Error');
  }
});
app.get('/api/cart/count', isLoggedIn, async (req, res) => {
  try {
      const userId = req.session.userId;
      const cart = await Cart.findOne({ user_id: userId });
      const cartCount = cart ? cart.product_id.length : 0;
      res.json({ count: cartCount });
  } catch (error) {
      console.error('Error fetching cart count:', error);
      res.status(500).send('Internal Server Error');
  }
});

app.get('/api/categories', async (req, res) => {
  try {
      const categories = await Category.find();
      res.json(categories);
  } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).send('Internal Server Error');
  }
}
);



app.get('/profile', (req, res) => {
    res.render('pages/profile');
});

app.post('/signup', userController.signup);

app.post('/login', userController.login);

app.get('/logout', userController.logout);

app.post('/forgotpassword', userController.forgotPassword);

app.post('/resetpassword', userController.resetPassword);


const Cart = require('./models/cart'); // Adjust the path as necessary

app.get('/productDetails/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).send('Product not found');
        }
        res.render('pages/productdetails', { product });
    } catch (error) {
        console.error('Error fetching product details:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/addToCart', isLoggedIn, async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.session.userId;

        let cart = await Cart.findOne({ user_id: userId });
        if (!cart) {
            cart = new Cart({ user_id: userId, product_id: [], quantity: 0 });
        }

        cart.product_id.push(productId);
        cart.quantity += quantity;
        await cart.save();

        res.redirect('/cart');
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).send('Internal Server Error');
    }
});


// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

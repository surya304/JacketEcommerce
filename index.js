const express = require('express');
const app = express();
require('dotenv').config();

app.set('view engine', 'ejs');

// Serve static files from the "public" directory
app.use(express.static('public'));

const mongoose = require('mongoose');

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Database connected successfully'))
  .catch(err => console.error('Database connection error: ', err));
  
// Define routes
app.get('/', (req, res) => {
  res.render('pages/homepage');

});


app.get('/signup', (req, res) => {
  res.render('pages/signup');
});

app.get('/login', (req, res) => {
  res.render('pages/login');
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


app.get('/homepage', (req, res) => {
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


// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
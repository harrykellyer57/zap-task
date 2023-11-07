/**
 * Filename: complexCode.js
 *
 * Description: This complex code example showcases a simulated e-commerce application
 *              with multiple functionalities and demonstrates various advanced concepts
 *              such as modules, classes, AJAX requests, handling events, and more.
 */

// Import external libraries and initialize modules
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

// Import custom modules
const User = require('./models/User');
const Product = require('./models/Product');
const Cart = require('./models/Cart');

// Configure Express.js
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set up routes
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  // Validate user credentials
  User.authenticate(username, password)
    .then(user => {
      const token = jwt.sign({ userId: user.id }, 'secret-key', { expiresIn: '1h' });
      res.status(200).json({ token });
    })
    .catch(err => {
      res.status(401).json({ error: err.message });
    });
});

app.get('/api/products', (req, res) => {
  // Fetch all products from the database
  Product.getAll()
    .then(products => {
      res.status(200).json({ products });
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});

app.post('/api/cart', (req, res) => {
  const { productId, quantity } = req.body;
  
  // Create a new Cart instance
  const cart = new Cart();
  
  // Add the product to the cart
  cart.addProduct(productId, quantity)
    .then(() => {
      res.status(200).json({ message: 'Product added to cart successfully' });
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});

// Handle other routes and errors
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});

/////////////////////////////////////////////
// Simulated Database using local variables //
/////////////////////////////////////////////

// In a real scenario, you would use an actual database like MySQL or MongoDB

class Database {
  constructor() {
    this.users = [
      { id: 1, username: 'admin', password: 'password' },
      { id: 2, username: 'user', password: '123456' },
    ];
    
    this.products = [
      { id: 1, name: 'Product 1', price: 9.99 },
      { id: 2, name: 'Product 2', price: 19.99 },
    ];
  }
  
  getUser(username) {
    return new Promise((resolve, reject) => {
      const user = this.users.find(u => u.username === username);
      if (user) {
        resolve(user);
      } else {
        reject(new Error('Invalid username'));
      }
    });
  }
  
  getProduct(productId) {
    return new Promise((resolve, reject) => {
      const product = this.products.find(p => p.id === productId);
      if (product) {
        resolve(product);
      } else {
        reject(new Error('Invalid product ID'));
      }
    });
  }
}

const db = new Database();

/////////////////
// Models Module
/////////////////

class UserModel {
  static authenticate(username, password) {
    return db.getUser(username).then(user => {
      if (user.password === password) {
        return user;
      } else {
        throw new Error('Invalid password');
      }
    });
  }
}

class ProductModel {
  static getAll() {
    return Promise.resolve(db.products);
  }
}

class CartModel {
  constructor() {
    this.items = [];
  }
  
  addProduct(productId, quantity) {
    return db.getProduct(productId)
      .then(product => {
        if (product) {
          const item = { product, quantity };
          this.items.push(item);
          return item;
        } else {
          throw new Error('Invalid product ID');
        }
      });
  }
}

User.setModel(UserModel);
Product.setModel(ProductModel);
Cart.setModel(CartModel);

module.exports = app;

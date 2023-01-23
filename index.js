const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const libxmljs = require("libxmljs");

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true });


// Create a Mongoose model for user registration
const User = mongoose.model('User', {
  email: String,
  password: String
});

const Xml = mongoose.model('Xml', {
  xml: mongoose.Schema.Types.Mixed,
});

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.text({ type: "application/xml" }));

app.post('/register', async (req, res) => {
  const user = new User({ email: req.body.email, password: req.body.password });
  await user.save();
  res.send('User registered successfully!');
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;
  
    User.findOne({ email: email }, (err, user) => {
      if (err) {
        return res.status(500).send("Error on the server.");
      }
      if (!user) {
        return res.status(404).send("No user found.");
      }
      if (user.password !== password) {
        return res.status(401).send("Invalid credentials.");
      }
      return res.status(200).send("Successfully logged in.");
    });
  });
  

app.post("/upload", (req, res) => {
    const xml = req.body;
    const doc = libxmljs.parseXml(xml, { noent: true });
    console.log(doc);
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});

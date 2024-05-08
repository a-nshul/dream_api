const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const teamRoutes = require('./Routes/teamRoutes');
require('dotenv').config();

const app = express();

mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("Database connection successful!");
})
.catch((error) => {
  console.error("Error connecting to database:", error);
});

app.use(bodyParser.json());

app.use('/api/team', teamRoutes);
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

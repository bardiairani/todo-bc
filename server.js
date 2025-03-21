require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Todo API',
      version: '1.0.0',
      description: 'مستندات API پروژه Todo',
    },
    servers: [
      {
        url: 'http://localhost:5000', 
      },
    ],
  },
  apis: ['./routes/*.js'], 
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);


connectDB();
const app = express();
app.use(express.json());
app.use(cors());




app.get("/", (req, res) => {
  res.send("API is running...");
});


const PORT = process.env.PORT || 5000;
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/todos", require("./routes/todoRoutes"));
app.use("/api/", require("./routes/todos"));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



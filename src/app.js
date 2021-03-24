if (process.env.USER) require("dotenv").config(); //ask mentor about this
const express = require("express");
const cors = require("cors");
const logger = require("./config/logger");
const app = express();

const moviesRouter = require("./movies/movies.router");
const theatersRouter = require("./theaters/theaters.router");
const reviewsRouter = require("./reviews/reviews.router");

const errorHandler = require("./errors/errorHandler");
const notFound = require("./errors/notFound");

app.use(cors());
app.use(logger);
app.use(express.json());

app.use("/movies", moviesRouter);
app.use("/theaters", theatersRouter);
app.use("/reviews", reviewsRouter);

app.use(notFound);
app.use(errorHandler);

module.exports = app;

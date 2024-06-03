const express = require("express");
const cors = require("cors");
const router = require("./routes");
const logger = require("morgan");
const { MORGAN_FORMAT } = require("./config/logger");

const app = express();

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

app.use(express.json());
app.use(logger(MORGAN_FORMAT));

app.use(
    cors({
        origin: "*",
        methods: "GET, POST, PUT, PATCH, DELETE",
        allowedHeaders: "Content-Type, Authorization",
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//* Force the output to be application/json and remove fingerprinting
app.use((req, res, next) => {
    res.removeHeader("X-Powered-By");
    res.setHeader("Content-Type", "application/json");
    next();
});

app.use(router);

//* Error Handler with http-errors
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        status: false,
        message: err.message,
    });
});

//* 404 Response Handler
app.use((req, res) => {
    const url = req.url;
    const method = req.method;
    res.status(404).json({
        status: false,
        code: 404,
        method,
        url,
        message: "Not Found!",
    });
});

module.exports = app;

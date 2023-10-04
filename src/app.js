import express from "express";
import helmet from "helmet";
import hpp from "hpp";
import morgan from "morgan";
import hbs from "express-handlebars";
import path from "path";
import { __dirname } from "./utils/dirname.js";

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(hpp());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "..", "/views"));
app.engine(
    "hbs",
    hbs.engine({
        defaultLayout: "main",
        extname: "hbs",
        layoutsDir: path.resolve(__dirname, "..", "/views/layouts"),
    })
);

// ROUTES

// ERROR HANDLERS

export default app;

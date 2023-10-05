import express from "express";
// import helmet from "helmet";
import hpp from "hpp";
import morgan from "morgan";
import hbs from "express-handlebars";
import path from "path";
import { __dirname } from "./utils/dirname.js";
import flash from "connect-flash";
import session from "express-session";
import indexRouter from "./routes/index.routes.js";

const app = express();

// TODO: fix helmet's csp policy to allow file downloads (password protected)
app.use(morgan("dev"));
// app.use(helmet());
app.use(hpp());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/media", express.static(path.join(__dirname, "..", "..", "public")));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "..", "/views"));
app.engine(
    "hbs",
    hbs.engine({
        defaultLayout: "main",
        extname: "hbs",
        layoutsDir: path.resolve(__dirname, "..", "views/layouts"),
    })
);
app.use(
    session({
        secret: "changeit",
        resave: false,
        saveUninitialized: false,
    })
);
app.use(flash());

// ROUTES
app.use("/", indexRouter);

// ERROR HANDLERS
// 404 handler
app.use((req, res) => {
    return res.render("notfound", {
        title: "NOT FOUND",
    });
});

export default app;

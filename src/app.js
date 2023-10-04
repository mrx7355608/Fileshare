import express from "express";
import helmet from "helmet";
import hpp from "hpp";
import morgan from "morgan";
import hbs from "express-handlebars";
import path from "path";
import { __dirname } from "./utils/dirname.js";
import flash from "connect-flash";
import session from "express-session";
import { FileServices } from "../services/file.services.js";
import multer from "multer";
import { CloudinaryServices } from "../services/cloudinary.services.js";
import { FileModel } from "./models/file.model.js";

const upload = multer({ storage: multer.memoryStorage() });

const app = express();

app.use(morgan("dev"));
app.use(helmet());
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
app.get("/", async (req, res) => {
    const files = await FileModel.find().sort("-createdAt");
    const formattedFiles = files.map((f) => {
        return {
            name: f.name,
            type: f.type.toUpperCase(),
            size: f.size,
            downloadURL: f.downloadURL,
            isPasswordProtected: f.isPasswordProtected,
            createdAt: new Date(f.createdAt).toDateString(),
        };
    });
    return res.render("home", {
        title: "Home",
        success_message: req.flash("success"),
        files: formattedFiles,
    });
});
app.get("/upload-file", (req, res) => {
    return res.render("uploadfile", {
        title: "Upload File",
        error_message: req.flash("error"),
    });
});
app.post("/upload-file", upload.single("file"), async (req, res) => {
    try {
        const { password } = req.body;
        const fileServices = new FileServices(req.file, password);
        const message = fileServices.validate();
        if (message !== "ok") {
            req.flash("error", message);
            return res.redirect("/upload-file");
        }

        // Upload file to cloudinary
        const cloudinaryService = new CloudinaryServices(req.file);
        cloudinaryService.setup();
        const uploadedFile = await cloudinaryService.upload();
        // Create a download URL
        const downloadURL = cloudinaryService.createDownloadURL(uploadedFile);
        console.log({ downloadURL });

        // Save file in database
        const data = {
            name: fileServices.name,
            size: fileServices.size,
            type: fileServices.type,
            password: fileServices.filePassword,
            isPasswordProtected: fileServices.isPasswordProtected,
            downloadURL,
        };
        await FileModel.create(data);
        // Redirect to homepage
        req.flash("success", "File uploaded successfully!");
        res.redirect("/");
    } catch (err) {
        console.log(err.message);
        res.redirect("/");
    }
});

// ERROR HANDLERS

export default app;

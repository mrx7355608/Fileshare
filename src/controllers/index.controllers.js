import { indexServices } from "../services/index.services.js";

const renderHomePage = async (req, res) => {
    const files = await indexServices.listAllFiles();
    return res.render("home", {
        title: "Home",
        success_message: req.flash("success"),
        files,
    });
};

const renderUploadFilePage = (req, res) => {
    return res.render("uploadfile", {
        title: "Upload File",
        error_message: req.flash("error"),
    });
};

const uploadFile = async (req, res) => {
    try {
        const password = req.body.password;
        const file = req.file;

        const message = indexServices.validateFile(file, password);
        if (message !== "ok") {
            req.flash("error", message);
            return res.redirect("/upload-file");
        }
        // Upload file to cloudinary
        const downloadURL = await indexServices.uploadToCloudinary(file);

        // Save file in database
        const data = indexServices.createFileObject(
            file,
            password,
            downloadURL
        );
        await indexServices.addFileInDB(data);

        // Redirect to homepage
        req.flash("success", "File uploaded successfully!");
        res.redirect("/");
    } catch (err) {
        // redirect to an error page that shows a internal server error
        console.log({ msg: err.message });
        res.redirect("/");
    }
};

const renderDownloadFilePage = (req, res) => {
    return res.render("downloadfile", {
        title: "Download File",
        error_message: req.flash("error"),
    });
};

const downloadFile = async (req, res) => {
    const fileID = req.params.id;
    const { password } = req.body;
    const { ok, resp } = await indexServices.downloadPasswordProtectedFile(
        fileID,
        password
    );
    if (!ok) {
        req.flash("error", resp);
        return res.redirect(`/download-file/${fileID}`);
    }
    console.log({ resp });
    res.redirect(resp);
};

export const indexControllers = {
    renderHomePage,
    renderUploadFilePage,
    uploadFile,
    renderDownloadFilePage,
    downloadFile,
};

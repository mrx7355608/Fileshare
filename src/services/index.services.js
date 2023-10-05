import { FileModel } from "../models/file.model.js";
import { FileServices } from "../utils/file.services.js";
import { CloudinaryServices } from "../utils/cloudinary.services.js";
import validator from "validator";
import bcpt from "bcryptjs";

async function listAllFiles() {
    const files = await FileModel.find().sort("-createdAt");
    const formattedFiles = files.map((f) => {
        return {
            id: f._id,
            name: f.name,
            type: f.type.toUpperCase(),
            size: f.size,
            downloadURL: f.downloadURL,
            isPasswordProtected: f.isPasswordProtected,
            createdAt: new Date(f.createdAt).toDateString(),
        };
    });
    return formattedFiles;
}

function validateFile(file, password) {
    const fileServices = new FileServices(file, password);
    const message = fileServices.validate();
    return message;
}

async function uploadToCloudinary(file) {
    const cloudinaryService = new CloudinaryServices(file);
    cloudinaryService.setup();
    const uploadedFile = await cloudinaryService.upload();
    const downloadURL = cloudinaryService.createDownloadURL(uploadedFile);
    return downloadURL;
}

function createFileObject(file, password, downloadURL) {
    const fileServices = new FileServices(file, password);
    return fileServices.createFileObject(downloadURL);
}

async function addFileInDB(data) {
    await FileModel.create(data);
}

async function downloadPasswordProtectedFile(fileID, password) {
    if (!fileID) {
        return {
            ok: false,
            resp: "File id is missing",
        };
    }
    if (!validator.isMongoId(fileID)) {
        return {
            ok: false,
            resp: "Invalid file id",
        };
    }

    const file = await FileModel.findById(fileID);
    if (!file) {
        return {
            ok: false,
            resp: "File does not exist",
        };
    }

    const isValidPassword = await bcpt.compare(password, file.password);
    if (!isValidPassword) {
        return {
            ok: false,
            resp: "File password is incorrect",
        };
    }

    return {
        ok: true,
        resp: file.downloadURL,
    };
}

export const indexServices = {
    listAllFiles,
    validateFile,
    uploadToCloudinary,
    createFileObject,
    addFileInDB,
    downloadPasswordProtectedFile,
};

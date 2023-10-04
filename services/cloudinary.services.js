import { v2 as cloudinary } from "cloudinary";
import crypto from "crypto";

export class CloudinaryServices {
    constructor(file) {
        this.file = file;
    }

    setup() {
        cloudinary.config({
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        });
    }

    generateID() {
        return crypto.randomBytes(8).toString("hex");
    }
    async upload() {
        const b64 = Buffer.from(this.file.buffer).toString("base64");
        let dataURI = "data:" + this.file.mimetype + ";base64," + b64;
        const result = await cloudinary.uploader.upload(dataURI, {
            resource_type: "auto",
            folder: "fshare",
            public_id: `${this.generateID()}-${this.file.originalname}`,
        });
        return result;
    }

    createDownloadURL(uploadedFile) {
        let downloadURL;

        if (uploadedFile.resource_type !== "image") {
            downloadURL = cloudinary.url(uploadedFile.public_id, {
                flags: "attachment",
                resource_type: uploadedFile.resource_type,
            });
        } else {
            const fileParts = this.file.originalname.split(".");
            const fileType = fileParts[fileParts.length - 1];

            downloadURL = cloudinary.url(uploadedFile.public_id, {
                flags: "attachment",
                resource_type: uploadedFile.resource_type,
                format: fileType,
            });
        }
        return downloadURL;
    }
}

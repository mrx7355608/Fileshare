import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

const fileSchema = new mongoose.Schema(
    {
        name: String,
        size: String,
        type: String,
        downloadURL: String,
        isPasswordProtected: {
            type: Boolean,
            default: false,
        },
        password: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

fileSchema.pre("save", async function (next) {
    if (this.isNew && this.password) {
        const hashedPassword = await bcryptjs.hash(this.password, 10);
        this.password = hashedPassword;
        return next();
    }
    next();
});

export const FileModel = mongoose.model("File", fileSchema);

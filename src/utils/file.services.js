export class FileServices {
    constructor(file, password) {
        this.file = file;
        this.password = password;
    }

    validate() {
        if (!this.file) {
            return "No file was selected!";
        }
        if (this.file.size === 0) {
            return "Empty files cannot be uploaded";
        }
        if (!this.validateFilename()) {
            return "Invalid filename";
        }
        const message = this.validatePassword();
        if (message !== "ok") {
            return message;
        }
        const sizeMessage = this.validateFileSize();
        if (sizeMessage !== "ok") {
            return sizeMessage;
        }
        return "ok";
    }

    validateFilename() {
        const fileNameRegex = /^[a-z0-9_.@()-]+\.[^.]+$/i;
        return fileNameRegex.test(this.file.originalname);
    }

    validatePassword() {
        if (this.password) {
            if (this.password.length < 8) {
                return "Password too short";
            } else if (this.password.length > 30) {
                return "Password cannot be longer than 30 characters";
            } else {
                return "ok";
            }
        } else {
            return "ok";
        }
    }

    validateFileSize() {
        if (this.file.size > 25000000) {
            return "File size should be less than 25 MB";
        } else {
            return "ok";
        }
    }

    get name() {
        return this.file.originalname;
    }

    get size() {
        if (this.file.size < 1000000) {
            const Kbs = this.file.size / 1000;
            return `${Kbs.toFixed(2)} KB`;
        } else {
            const Mbs = this.file.size / 1000000;
            return `${Mbs.toFixed(2)} MB`;
        }
    }

    get type() {
        // user.services.js => ["user", "services", "js"]
        const fileParts = this.file.originalname.split(".");

        // ["user", "services", "js"] => "js"
        const fileType = fileParts[fileParts.length - 1];
        return fileType;
    }

    get filePassword() {
        return this.password;
    }

    get isPasswordProtected() {
        return this.password ? true : false;
    }

    createFileObject(downloadURL) {
        return {
            name: this.name,
            size: this.size,
            password: this.filePassword,
            type: this.type.toUpperCase(),
            isPasswordProtected: this.isPasswordProtected,
            downloadURL,
        };
    }
}

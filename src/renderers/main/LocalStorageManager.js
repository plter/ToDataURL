const LocalStorageManager = {
    set selectedFormat(value) {
        value = (value == "base64" || value == "dataurl") ? value : "dataurl";
        localStorage.setItem("selectedFormat", value);
    },
    get selectedFormat() {
        return localStorage.getItem("selectedFormat") || "dataurl";
    }
};

module.exports = LocalStorageManager;
// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

window.$ = window.jQuery = require("jquery");
require("bootstrap");
const Vue = require("vue/dist/vue");
const electron = require("electron");
const LocalStorageManager = require("./LocalStorageManager");
const SelectedFormat = require("./SelectedFormat");
const fs = require("fs");
const path = require("path");

let Main = {
    init() {
        this.initUI();
        this.addListeners();
    },

    initUI() {
        this.initVueApp();

        this.root = document.querySelector("#root");
        this.resizeByWindow();

        this.fileField = document.querySelector("#file-filed");
    },

    initVueApp() {
        let self = this;
        this.vueApp = new Vue({
            el: "#root",
            data: {
                output: "", status: "", selectedFormat: LocalStorageManager.selectedFormat
            },
            methods: {
                btnOpenFileClicked: function () {
                    self.fileField.click();
                },
                fileFieldChangeHandler: function (event) {
                    if (event.target.files && event.target.files.length) {
                        self._currentFile = event.target.files[0];
                        self.readAndShowFileData(self._currentFile);
                    }
                },
                btnCopyClickedHandler: function () {
                    if (this.output) {
                        electron.clipboard.writeText(this.output);
                        this.status = "已拷贝到剪贴板";
                    } else {
                        this.status = "文本框中没有内容";
                    }
                },
                btnSaveClickedHandler: function () {
                    if (this.output) {
                        let path = electron.remote.dialog.showSaveDialog(electron.remote.getCurrentWindow(), {
                            title: "保存文件"
                        });
                        if (path) {
                            fs.writeFileSync(path, this.output);
                            this.status = "已保存";
                        } else {
                            this.status = "保存操作已取消";
                        }
                    } else {
                        this.status = "文本框中没有内容"
                    }
                },
                btnDonateClickedHandler: function () {
                    let window = new electron.remote.BrowserWindow({
                        parent: electron.remote.getCurrentWindow(),
                        title: "捐助",
                        width: 500,
                        height: 600,
                        modal: true
                    });

                    window.loadFile(path.join(electron.remote.app.getAppPath(), "src", "renderers", "donate", "donate.html"));
                },
                btnDecodeAndSaveClickedHandler: function () {
                    if (this.output) {
                        let path = electron.remote.dialog.showSaveDialog(electron.remote.getCurrentWindow(), {
                            title: "保存文件"
                        });
                        if (path) {
                            let dataText = this.output;
                            if (this.selectedFormat == SelectedFormat.DATA_URL) {
                                dataText = self.translateDataUrlToBase64(dataText);
                            }
                            try {
                                fs.writeFileSync(path, Buffer.from(dataText, "base64"));
                                this.status = "已保存";
                            } catch (e) {
                                console.log(e);
                                this.status = "解码失败";
                            }
                        } else {
                            this.status = "保存操作已取消";
                        }
                    } else {
                        this.status = "文本框中没有内容"
                    }
                },
                btnAboutClickedHandler: function () {
                    let window = new electron.remote.BrowserWindow({
                        parent: electron.remote.getCurrentWindow(),
                        title: "关于",
                        modal: true,
                        width: 500,
                        height: 300
                    });
                    window.loadFile(path.join(electron.remote.app.getAppPath(), "src", "renderers", "about", "about.html"));
                }
            },
            watch: {
                selectedFormat: function (value) {
                    LocalStorageManager.selectedFormat = value;
                    self.readAndShowFileData(self._currentFile);
                }
            }
        });
    },

    translateDataUrlToBase64(dataUrl) {
        return dataUrl.substr(dataUrl.indexOf(",") + 1)
    },

    readAndShowFileData(file) {
        if (file) {
            let reader = new FileReader();
            reader.onload = () => {
                if (this.vueApp.selectedFormat == SelectedFormat.BASE64) {
                    this.vueApp.output = this.translateDataUrlToBase64(reader.result);
                } else {
                    this.vueApp.output = reader.result;
                }
            };
            reader.readAsDataURL(file);
        }
    },

    addListeners() {
        window.onresize = this.resizeByWindow.bind(this);
    },

    resizeByWindow() {
        this.root.style.height = `${window.innerHeight}px`;
    }
};


Main.init();
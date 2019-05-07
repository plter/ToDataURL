// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.


window.$ = window.jQuery = require("jquery");
require("popper.js");
require("bootstrap");
const Vue = require("vue/dist/vue");
const electron = require("electron");
const fs = require("fs")
const path = require("path")

const Main = {

    init: function () {

        let self = this;

        this._vueApp = new Vue({
            el: "#root",
            data: {
                label: "Hello World",
                rootHeight: window.innerHeight,
                output: "",
                dataType: localStorage.getItem("dataType") || "DataURL"
            },
            methods: {
                btnOpenFileClicked: function (e) {
                    $("#file-input").click();
                    // let result = electron.remote.dialog.showOpenDialog(
                    //     electron.remote.getCurrentWindow(),
                    //     {
                    //         title: "选择一个文件"
                    //     }
                    // );
                    // if (result && result.length) {
                    //     let file = result[0];
                    //     self.readFile(file);
                    // }
                },

                fileInputChanged: function (e) {
                    if (e.target.files && e.target.files.length) {
                        self.currentSelectedFile = e.target.files[0];
                        self.readFile(self.currentSelectedFile);
                    }
                },

                btnCopyClicked: function (e) {
                    electron.clipboard.writeText(this.output)
                },
                btnSaveClicked: function (e) {
                    let path = electron.remote.dialog.showSaveDialog(
                        electron.remote.getCurrentWindow(),
                        {title: "选择保存"}
                    )

                    if (path) {
                        fs.writeFileSync(path, this.output)
                    }
                },
                btnAboutClicked: function (e) {
                    let window = new electron.remote.BrowserWindow({
                        width: 400,
                        height: 300,
                        modal: true,
                        parent: electron.remote.getCurrentWindow()
                    });
                    window.loadFile(path.join(__dirname, "about.html"))
                },
                btnDonateClicked: function (e) {
                    let window = new electron.remote.BrowserWindow({
                        width: 400,
                        height: 500,
                        modal: true,
                        parent: electron.remote.getCurrentWindow()
                    });
                    window.loadFile(path.join(__dirname, "donate.html"))
                }
            },
            watch: {
                dataType: function (val, oldVal) {
                    localStorage.setItem("dataType", val);

                    if (self.currentSelectedFile) {
                        self.readFile(self.currentSelectedFile);
                    }
                }
            }
        });

        this.addListeners();
    },


    readFile(file) {
        let self = this;
        let reader = new FileReader();
        reader.onload = function () {
            self.showData(reader.result)
        };
        reader.readAsDataURL(file);
    },

    showData(data) {
        if (this._vueApp.dataType === "Base64") {
            data = data.substr(data.indexOf(",") + 1)
        }
        this._vueApp.output = data
    },

    addListeners() {
        window.onresize = e => this._vueApp.rootHeight = window.innerHeight;
    }
};


Main.init();

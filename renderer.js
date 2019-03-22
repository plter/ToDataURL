// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

window.$ = window.jQuery = require("jquery");
require("bootstrap");
const Vue = require("vue/dist/vue");

let Main = {
    init() {
        this.initUI();
        this.addListeners();
    },

    initUI() {
        this.root = document.querySelector("#root");
        this.resizeByWindow();

        this.initVueApp();

        this.fileField = document.querySelector("#file-filed");
    },

    initVueApp() {
        let self = this;
        this.vueApp = new Vue({
            el: "#root", data: {output: ""}, methods: {
                btnOpenFileClicked: function () {
                    self.fileField.click();
                },
                fileFieldChangeHandler: function (event) {
                    if (event.target.files && event.target.files.length) {
                        self._currentFile = event.target.files[0];
                        self.readAndShowFileData(self._currentFile);
                    }
                }
            }
        });
    },

    readAndShowFileData(file) {
        let reader = new FileReader();
        reader.onload = () => {
            this.vueApp.output = reader.result;
        };
        reader.readAsDataURL(file);
    },

    addListeners() {
        window.onresize = this.resizeByWindow.bind(this);
    },

    resizeByWindow() {
        this.root.style.height = `${window.innerHeight}px`;
    }
};


Main.init();
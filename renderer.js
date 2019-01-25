// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

window.$ = window.jQuery = require("jquery");
require("bootstrap");

$("#file-filed").change(e => {
    if (e.target.files && e.target.files.length) {
        let f = e.target.files[0];
        let reader = new FileReader();
        reader.onload = function () {
            $("#output").val(reader.result);
        };
        reader.readAsDataURL(f);
    }
});
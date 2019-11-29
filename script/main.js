import { Header } from "https://cdn.jsdelivr.net/gh/riku1227/materialy/script/module/Header.min.js";
import { Ripple } from "https://cdn.jsdelivr.net/gh/riku1227/materialy/script/module/Ripple.min.js";
import { TextField } from "https://cdn.jsdelivr.net/gh/riku1227/materialy@latest/script/module/TextField.min.js";

const loadFile = (url, callback) => {
    const request = new XMLHttpRequest();
    request.open("get", url, true);
    request.callback = callback
    request.onloadend = function () {
        this.callback.call(this, request.responseText);
    }
    request.send(null);
}

const getBaseURL = () => {
    const replacedURL = document.URL.replace("css/", "").replace("images/", "").replace("module/", "").replace("script/", "").replace("effect/", "").replace("rawtext/", "").replace(/\/$/, "");
    return replacedURL;
}

console.log(getBaseURL());

const setupNavigationDrawer = (html) => {
    //const baseUrl = document.URL.replace("http://", "").replace("https://", "").split("/")[0];
    let replacedHtml = html.replace(/\$baseUrl/g, getBaseURL());
    document.getElementsByClassName("materialy-navigation-drawer")[0].innerHTML = replacedHtml;

    Ripple.autoSetupRippleEffect();
}

loadFile(`${getBaseURL()}/module/header.html`, (html) => {
    Header.setupHeader(html);
});

loadFile(`${getBaseURL()}/module/navigation-drawer.html`, setupNavigationDrawer);

TextField.autoSetupTextFieldEffect();
TextField.autoUpdateTextFields();

let timer = 0;
window.onresize = () => {
    if (timer > 0) {
        clearTimeout(timer);
    }

    timer = setTimeout(function () {
        Header.updateHeader();
    }, 150);
};
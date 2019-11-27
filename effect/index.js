import { TextField } from "https://cdn.jsdelivr.net/gh/riku1227/materialy@latest/script/module/TextField.min.js";

let nowEffectID = "";

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
    const replacedURL = document.URL.replace("css/", "").replace("images/", "").replace("module/", "").replace("script/", "").replace("effect/", "").replace(/\/$/, "");
    return replacedURL;
}

const baseURL = getBaseURL();

window.generateEffectCommand = (effectID) => {
    nowEffectID = effectID;
    const selector = TextField.getValueByTextFieldDiv(document.getElementById("selector"));
    const amplifier = TextField.getValueByTextFieldDiv(document.getElementById("amplifier"));
    const seconds = TextField.getValueByTextFieldDiv(document.getElementById("seconds"));
    const hideParticles = TextField.getValueByTextFieldDiv(document.getElementById("hideParticles"));
    const result = `/effect ${selector} ${nowEffectID} ${seconds} ${(parseInt(amplifier) - 1)} ${hideParticles}`;
    TextField.setValueByTextFieldDiv(
        document.getElementById("resultCommand"),
        result
    );
}

const createEffectTableItem = (effectData) => {
    return `
<tr onclick="window.generateEffectCommand('${effectData.id}');">
    <td class="mcbe-command-gen-table--center">
        <img src="${baseURL}/images/effect_icon/${effectData.icon}.png">
    </td>
    <td>${effectData.name}</td>
    <td>
        ${effectData.description}
    </td>
</tr>
    `;
}

loadFile(`${baseURL}/effect/effect_data.json`, (text) => {
    const json = JSON.parse(text);
    const table = document.getElementById("effectTable");

    const tableHeader = `
    <tr>
        <th class="mcbe-command-gen-table--icon">アイコン</th>
        <th class="mcbe-command-gen-table--name">エフェクト名</th>
        <th class="mcbe-command-gen-table--description">詳細</th>
    </tr>`;


    let tabelItem = ""

    json.effect_data.forEach(effectData => {
        tabelItem += createEffectTableItem(effectData);
    });

    table.innerHTML = tableHeader + tabelItem;
});

new ClipboardJS('.materialy-button--outline__primary');

window.amplifierKeyUp = (input) => {
    if(parseInt(input.value) > 256) {
        input.value = "256";
    } else if(parseInt(input.value) < 0) {
        input.value = "0";
    }
}

window.secondsKeyUp = (input) => {
    if(parseFloat(input.value) > 2147483647) {
        input.value = "2147483647";
    } else if(parseInt(input.value) < 0) {
        input.value = "0";
    }
}
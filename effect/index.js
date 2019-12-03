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

const getCookieValue = (key) => {
    if (document.cookie.indexOf(key) != -1) {
        const splitCookie = document.cookie.split(";");
        const keyCookie = splitCookie.filter((value) => {
            if (value.indexOf(`${key}=`) != -1) {
                return true;
            } else {
                return false;
            }
        });
        return keyCookie[0].split("=")[1];
    } else {
        return false;
    }
}

const isAllowCookie = () => {
    if(document.cookie.indexOf("allow_cookie") != -1) {
        return (getCookieValue("allow_cookie") == "true");
    } else {
        return false;
    }
}

const baseURL = getBaseURL();

const generateEffectCommand = (effectID) => {
    nowEffectID = effectID;
    let result = "";
    if(getCookieValue("effect_name_only") == "true") {
        result = nowEffectID;
    } else {
        const selector = TextField.getValueByTextFieldDiv(document.getElementById("selector"));
        const amplifier = TextField.getValueByTextFieldDiv(document.getElementById("amplifier"));
        const seconds = TextField.getValueByTextFieldDiv(document.getElementById("seconds"));
        const hideParticles = TextField.getValueByTextFieldDiv(document.getElementById("hideParticles"));
        result = `/effect ${selector} ${nowEffectID} ${seconds} ${(parseInt(amplifier) - 1)} ${hideParticles}`;
    }
    TextField.setValueByTextFieldDiv(
        document.getElementById("resultCommand"),
        result
    );

    return result;
}

const createEffectTableItem = (effectData) => {
    return `
<tr class="tableItem" id="${effectData.id}">
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
const tabelItemClipboard = new ClipboardJS(".tableItem", {
    text: (trigger) => {
        return generateEffectCommand(trigger.id);
    }
});

const updateStickyEffectCard = () => {
    const effectCard = document.getElementById("effectCard");
    if(document.getElementById("stickyEffectCard").checked) {
        effectCard.classList.add("sticky");
    } else {
        effectCard.classList.remove("sticky");
    }
}

const loadCookieSetting = () => {
    if(isAllowCookie()) {
        document.getElementById("allowCookie").checked = true;
        document.getElementById("stickyEffectCard").checked = getCookieValue("sticky_effect_card") == "true";
        document.getElementById("effectNameOnly").checked = getCookieValue("effect_name_only") == "true";
        updateStickyEffectCard();
    }
}

const deleteAllCookie = ()=> {
    document.cookie = "allow_cookie=false;max-age=0";
    document.cookie = "sticky_effect_card=false;max-age=0";
    document.cookie = "effect_name_only=false;max-age=0";
}

const writeAllCookie = () => {
    document.cookie = "allow_cookie=true";
    document.cookie = `sticky_effect_card=${document.getElementById("stickyEffectCard").checked}`;
    document.cookie = `effect_name_only=${document.getElementById("effectNameOnly").checked}`;
}

loadCookieSetting();

document.getElementById("allowCookie").addEventListener("change", (event) => {
    if(event.target.checked) {
        writeAllCookie();
    } else {
        deleteAllCookie();
    }
});

document.getElementById("stickyEffectCard").addEventListener("change", (event) => {
    updateStickyEffectCard();
    if(event.target.checked) {
        if(isAllowCookie()) {
            document.cookie = "sticky_effect_card=true";
        }
    } else {
        if(isAllowCookie()) {
            document.cookie = "sticky_effect_card=false";
        }
    }
});

document.getElementById("effectNameOnly").addEventListener("change", (event) => {
    if(event.target.checked) {
        if(isAllowCookie()) {
            document.cookie = "effect_name_only=true";
        }
    } else {
        if(isAllowCookie()) {
            document.cookie = "effect_name_only=false";
        }
    }
})

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
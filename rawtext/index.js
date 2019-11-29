import { TextField } from "https://cdn.jsdelivr.net/gh/riku1227/materialy@latest/script/module/TextField.min.js";
new ClipboardJS("#generateAndCopy", {
    text: function(trigger) {
        const inputText = TextField.getValueByTextFieldDiv(document.getElementById("text"));
    const replacesText = inputText.replace(/\r?\n/g, "\n");
    const rawTextObject = {
        rawtext: [
            {
                text: replacesText
            }
        ]
    }

    const jsonStr = JSON.stringify(rawTextObject);
    TextField.setValueByTextFieldDiv(
        document.getElementById("result"),
        jsonStr
    );
    return jsonStr;
    }
});

new ClipboardJS("#resultCopy");
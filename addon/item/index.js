import { TextField } from "https://cdn.jsdelivr.net/gh/riku1227/materialy@latest/script/module/TextField.min.js";

let effectCount = 0;

new ClipboardJS(".copyButton");

const generateEffectContainer = () => {
    effectCount++;
    const result = 
`<div class="materialy-layout--linearlayout__horizontal outline" id="effectTextFieldContainer_${effectCount}">

<div class="materialy-text-field" id="effectNameTextField_${effectCount}">
    <input type="text" class="materialy-text-field--input" placeholder=" ">
    <div class="materialy-text-field--border__accent">
        <div class="materialy-text-field--border--first materialy-text-field--border__style-no-radius"></div>
        <div class="materialy-text-field--border--hint materialy-text-field--border__style-no-radius">
            <span class="materialy-text-field--hint">エフェクト名</span>
        </div>
        <div class="materialy-text-field--border--end materialy-text-field--border__style-no-radius"></div>
    </div>
</div>

<div class="materialy-text-field" id="effecSecondTextField_${effectCount}">
    <input type="text" class="materialy-text-field--input" placeholder=" ">
    <div class="materialy-text-field--border__primary">
        <div class="materialy-text-field--border--first materialy-text-field--border__style-no-radius"></div>
        <div class="materialy-text-field--border--hint materialy-text-field--border__style-no-radius">
            <span class="materialy-text-field--hint">付与時間</span>
        </div>
        <div class="materialy-text-field--border--end materialy-text-field--border__style-no-radius"></div>
    </div>
</div>

<div class="materialy-text-field" id="effecAmplifierTextField_${effectCount}">
    <input type="text" class="materialy-text-field--input" placeholder=" ">
    <div class="materialy-text-field--border__primary">
        <div class="materialy-text-field--border--first materialy-text-field--border__style-no-radius"></div>
        <div class="materialy-text-field--border--hint materialy-text-field--border__style-no-radius">
            <span class="materialy-text-field--hint">付与レベル</span>
        </div>
        <div class="materialy-text-field--border--end materialy-text-field--border__style-no-radius"></div>
    </div>
</div>

<div class="materialy-text-field" id="effecChanceTextField_${effectCount}">
    <input type="text" class="materialy-text-field--input" placeholder=" " value="1.0">
    <div class="materialy-text-field--border__primary">
        <div class="materialy-text-field--border--first materialy-text-field--border__style-no-radius"></div>
        <div class="materialy-text-field--border--hint materialy-text-field--border__style-no-radius">
            <span class="materialy-text-field--hint">付与確率</span>
        </div>
        <div class="materialy-text-field--border--end materialy-text-field--border__style-no-radius"></div>
    </div>
</div>
</div>`;
    return result;
}

const addEffectTextFieldContainer = () => {
    document.getElementById("invisibleContainer").innerHTML = generateEffectContainer();
    const originalNode =  document.getElementById(`effectTextFieldContainer_${effectCount}`);
    const cloneNode = originalNode.cloneNode(true);
    originalNode.remove();
    document.getElementById("effectContainer").appendChild(cloneNode);
}

document.getElementById("is_block").addEventListener("change", (event) => {
    const blockTextField = document.getElementById("block");
    if(event.target.checked) {
        blockTextField.classList.remove("invisile");
    } else {
        blockTextField.classList.add("invisile");
    }
});

document.getElementById("is_food").addEventListener("change", (event) => {
    const foodContainer = document.getElementById("foodContainer");
    if(event.target.checked) {
        foodContainer.classList.remove("invisile");
        TextField.autoUpdateTextFields();
    } else {
        foodContainer.classList.add("invisile");
    }
});

document.getElementById("is_cooltime").addEventListener("change", (event) => {
    const cooltime = document.getElementById("cooltime");
    if(event.target.checked) {
        cooltime.classList.remove("invisile");
    } else {
        cooltime.classList.add("invisile");
    }
});

document.getElementById("is_using_converts_to").addEventListener("change", (event) => {
    const using_converts_to = document.getElementById("using_converts_to");
    if(event.target.checked) {
        using_converts_to.classList.remove("invisile");
    } else {
        using_converts_to.classList.add("invisile");
    }
});

document.getElementById("addEffect").addEventListener("click", (event) => {
    addEffectTextFieldContainer();
    TextField.autoSetupTextFieldEffect();
    TextField.autoUpdateTextFields();
});

document.getElementById("removeEffect").addEventListener("click", (event) => {
    if(effectCount !== 0) {
        document.getElementById(`effectTextFieldContainer_${effectCount}`).remove();
        effectCount--;
    }
});

const getIconName = () => {
    const itemDefinition = TextField.getValueByTextFieldDiv(document.getElementById("item_definition"));
    let iconName = "";
    const iconNameTextField = TextField.getValueByTextFieldDiv(document.getElementById("item_icon"));
    if(iconNameTextField == "") {
        if(itemDefinition.indexOf(":") != -1) {
            iconName = itemDefinition.split(":")[1];
        } else {
            iconName = itemDefinition;
        }
    } else {
        iconName = iconNameTextField;
    }
    return iconName;
}

const generateResourceItemJson = () => {
    const itemDefinition = TextField.getValueByTextFieldDiv(document.getElementById("item_definition"));
    const jsonObject = {
        format_version: "1.10",
        "minecraft:item": {
            description: {
                identifier: itemDefinition
            }
        }
    };

    const itemCategory =  document.getElementById("item_category").value;
    if(itemCategory != "none") {
        jsonObject["minecraft:item"]["description"]["category"] = itemCategory;
    }

    
    jsonObject["minecraft:item"]["components"] = {
        "minecraft:icon": getIconName()
    };

    if(document.getElementById("is_food").checked) {
        jsonObject["minecraft:item"]["components"]["minecraft:use_animation"] = "eat";
    }

    return jsonObject;
}

const generateResourceTextsLang = () => {
    const itemDefinition = TextField.getValueByTextFieldDiv(document.getElementById("item_definition"));
    const itemName = TextField.getValueByTextFieldDiv(document.getElementById("item_name"));
    if(itemName == "") {
        return "";
    }
    return `item.${itemDefinition}.name=${itemName}`;
}

const generateResourceTextureJson = () => {
    const iconName = getIconName();
    return `"${iconName}": {
    "textures": "textures/items/${iconName}"
}`;
}

const generateBehaviorItemJson = () => {
    const jsonObject = {
        format_version: "1.12.0",
        "minecraft:item": {
            description: {
                identifier: TextField.getValueByTextFieldDiv(document.getElementById("item_definition"))
            },
            components: {
                "minecraft:hand_equipped": document.getElementById("hand_equipped").checked,
                "minecraft:stacked_by_data": document.getElementById("stacked_by_data").checked,
                "minecraft:foil": document.getElementById("foil").checked
            }
        }
    }

    let maxStackSize = TextField.getValueByTextFieldDiv(document.getElementById("max_stack_size"));
    if(maxStackSize == "") {
        maxStackSize = "64";
    }
    jsonObject["minecraft:item"]["components"]["minecraft:max_stack_size"] = parseInt(maxStackSize);

    if(document.getElementById("is_block").checked) {
        jsonObject["minecraft:item"]["components"]["minecraft:block"] = TextField.getValueByTextFieldDiv(document.getElementById("block"));
    }

    if(document.getElementById("is_food").checked) {
        let nutrition = TextField.getValueByTextFieldDiv(document.getElementById("nutrition"));
        if(nutrition == "") {
            nutrition = 0;
        }

        const saturation_modifier = document.getElementById("saturation_modifier").value;

        let use_duration = TextField.getValueByTextFieldDiv(document.getElementById("use_duration"));
        if(use_duration == "") {
            use_duration = "32";
        }

        jsonObject["minecraft:item"]["components"]["minecraft:use_duration"] = parseInt(use_duration);

        jsonObject["minecraft:item"]["components"]["minecraft:food"] = {
            "nutrition": parseInt(nutrition),
            "saturation_modifier": saturation_modifier
        };

        if(document.getElementById("is_using_converts_to").checked) {
            const using_converts_to = TextField.getValueByTextFieldDiv(document.getElementById("using_converts_to"));
            if(using_converts_to != "") {
                jsonObject["minecraft:item"]["components"]["minecraft:food"]["using_converts_to"] = using_converts_to;
            }
        }

        if(document.getElementById("is_cooltime").checked) {
            let cooltime = TextField.getValueByTextFieldDiv(document.getElementById("cooltime"));
            if(cooltime == "") {
                cooltime = "0";
            }

            jsonObject["minecraft:item"]["components"]["minecraft:food"]["cooldown_type"] = "chorusfruit";
            jsonObject["minecraft:item"]["components"]["minecraft:food"]["cooldown_time"] = parseInt(cooltime);
        }

        jsonObject["minecraft:item"]["components"]["minecraft:food"]["can_always_eat"] = document.getElementById("can_always_eat").checked;

        if(effectCount > 0) {
            const effectArray = [];
            for(let i = 1; i <= effectCount; i++) {
                let effectName = TextField.getValueByTextFieldDiv(document.getElementById(`effectNameTextField_${i}`));
                if(effectName == "") {
                    continue;
                }

                let effectSecond = TextField.getValueByTextFieldDiv(document.getElementById(`effecSecondTextField_${i}`));
                if(effectSecond == "") {
                    effectSecond = "60";
                }

                let effectAmplifier = TextField.getValueByTextFieldDiv(document.getElementById(`effecAmplifierTextField_${i}`));
                if(effectAmplifier == "") {
                    effectAmplifier = "0";
                }

                let effecChance = TextField.getValueByTextFieldDiv(document.getElementById(`effecChanceTextField_${i}`));
                if(effecChance == "") {
                    effecChance = "1.0";
                }

                effectArray.push(
                    {
                        name: effectName,
                        chance: parseFloat(effecChance),
                        duration: parseInt(effectSecond),
                        amplifier: parseInt(effectAmplifier)
                    }
                );
            }

            jsonObject["minecraft:item"]["components"]["minecraft:food"]["effects"] = effectArray;
        }
    }

    return jsonObject;
}

const getFileName = () => {
    const itemDefinition = TextField.getValueByTextFieldDiv(document.getElementById("item_definition"));
    if(itemDefinition.indexOf(":") != -1) {
        return itemDefinition.split(":")[1];
    } else {
        return itemDefinition;
    }
}

document.getElementById("generate").addEventListener("click", (event) => {
    TextField.setValueByTextFieldDiv(
        document.getElementById("resultResourceItemJson"),
        JSON.stringify(generateResourceItemJson(), null, 4)
    );

    document.getElementById("resourceItemJsonName").textContent = document.getElementById("resourceItemJsonName").textContent.replace("$itemDefinition", getFileName());

    TextField.setValueByTextFieldDiv(
        document.getElementById("resultResourceTextsLang"),
        generateResourceTextsLang()
    );

    TextField.setValueByTextFieldDiv(
        document.getElementById("resultResourceTextureJson"),
        generateResourceTextureJson()
    );

    TextField.setValueByTextFieldDiv(
        document.getElementById("resultBehaviorItemJson"),
        JSON.stringify(generateBehaviorItemJson(), null, 4)
    );
    document.getElementById("behaviorItemJsonName").textContent = document.getElementById("resourceItemJsonName").textContent.replace("$itemDefinition", getFileName());

    TextField.autoUpdateTextFields();
});

const setTextByJson = (jsonObject, jsonKey, elementId) => {
    if(jsonObject[jsonKey] != undefined) {
        TextField.setValueByTextFieldDiv(
            document.getElementById(elementId),
            jsonObject[jsonKey]
        );
    }
}

const setCheckBoxByJson = (jsonObject, jsonKey, elementId) => {
    const element = document.getElementById(elementId);

    if(jsonObject[jsonKey] != undefined) {
        element.checked = jsonObject[jsonKey];
    } else {
        element.checked = false;
    }

    const event = new Event("change");
    element.dispatchEvent(event, true, true);
}

const setSelectBoxByJson = (jsonObject, jsonKey, elementId) => {
    if(jsonObject[jsonKey] != undefined) {
        document.getElementById(elementId).value = jsonObject[jsonKey];
    }
}

const loadEffectArrayByJson = (jsonArray) => {
    for(let i = 0; i < jsonArray.length; i++) {
        addEffectTextFieldContainer();
        TextField.setValueByTextFieldDiv(document.getElementById(`effectNameTextField_${effectCount}`), jsonArray[i]["name"]);
        TextField.setValueByTextFieldDiv(document.getElementById(`effecSecondTextField_${effectCount}`), jsonArray[i]["duration"]);
        TextField.setValueByTextFieldDiv(document.getElementById(`effecAmplifierTextField_${effectCount}`), jsonArray[i]["amplifier"]);
        TextField.setValueByTextFieldDiv(document.getElementById(`effecChanceTextField_${effectCount}`), jsonArray[i]["chance"]);
    }
}

document.getElementById("loadJsonFile").addEventListener("click", () => {
    const fileInput = document.getElementById("jsonFile");

    if(fileInput.files.length > 0) {
        const fileData = fileInput.files[0];
        const fileReader = new FileReader();

        fileReader.onload = (load) => {
            try {
                const jsonObject = JSON.parse(load.target.result);
                if(jsonObject["minecraft:item"] != undefined) {
                    const minecraftItem = jsonObject["minecraft:item"];
                    const minecraftDescription = minecraftItem["description"];
                    const minecraftComponents = minecraftItem["components"];

                    if(minecraftDescription != undefined) {
                        setTextByJson(minecraftDescription, "identifier", "item_definition");
                        setSelectBoxByJson(minecraftDescription, "category", "item_category");
                    }

                    if(minecraftComponents != undefined) {
                        setTextByJson(minecraftComponents, "minecraft:max_stack_size", "max_stack_size");
                        setCheckBoxByJson(minecraftComponents, "minecraft:hand_equipped", "hand_equipped");
                        setCheckBoxByJson(minecraftComponents, "minecraft:stacked_by_data", "stacked_by_data");
                        setCheckBoxByJson(minecraftComponents, "minecraft:foil", "foil");

                        const minecraftBlock = minecraftComponents["minecraft:block"];
                        const blockCheckBox = document.getElementById("is_block");
                        if(minecraftBlock != undefined && minecraftBlock != null && minecraftBlock != "") {
                            blockCheckBox.checked = true;
                        } else {
                            blockCheckBox.checked = false;
                        }
                        setTextByJson(minecraftComponents, "minecraft:block", "block");
                        blockCheckBox.dispatchEvent(new Event("change"));
                        TextField.updateTextFieldByDiv(document.getElementById("block"));

                        const minecraftFood = minecraftComponents["minecraft:food"];
                        const isFoodChechBox = document.getElementById("is_food");
                        if(minecraftFood != undefined) {
                            isFoodChechBox.checked = true;
                            
                            setTextByJson(minecraftFood, "nutrition", "nutrition");
                            setSelectBoxByJson(minecraftFood, "saturation_modifier", "saturation_modifier");
                            setTextByJson(minecraftComponents, "minecraft:use_duration", "use_duration");

                            const usingConvertsTo = minecraftFood["using_converts_to"];
                            if(usingConvertsTo != undefined && usingConvertsTo != null && usingConvertsTo != "") {
                                document.getElementById("is_using_converts_to").checked = true;
                                setTextByJson(minecraftFood, "using_converts_to", "using_converts_to");
                            } else {
                                document.getElementById("is_using_converts_to").checked = false;
                            }

                            const coolTime = minecraftFood["cooldown_type"];
                            if(coolTime != undefined && coolTime != null && coolTime == "chorusfruit") {
                                document.getElementById("is_cooltime").checked = true;
                                setTextByJson(minecraftFood, "cooldown_time", "cooltime");
                            } else {
                                document.getElementById("is_cooltime").checked = false;
                            }

                            setCheckBoxByJson(minecraftFood, "can_always_eat", "can_always_eat");

                            const effectArray = minecraftFood["effects"];
                            if(effectArray != undefined && effectArray.length >= 0) {
                                loadEffectArrayByJson(effectArray);
                            }
                        } else {
                            isFoodChechBox.checked = false;
                        }
                        isFoodChechBox.dispatchEvent(new Event("change"));
                    }
                } else {
                    alert("Item jsonを読み込んでください");
                }
            } catch (error) {
                console.log(error);
                alert("JSONファイルを読み込んでください");
            }
        }

        fileReader.readAsText(fileData);
    }
});
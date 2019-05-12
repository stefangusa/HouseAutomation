$(document).ready(function() {

    let configuration = null;
    let colors = ["primary", "secondary", "success", "danger", "warning", "info"];

    function initControls() {
        $.get("server/initialConfiguration.json").done(function (data) {
            configuration = data;

            let components = "";
            Object.keys(configuration).forEach(function (room) {
                let randomIndex = Math.floor(Math.random() * colors.length);

                components += `<li class="list-group-item list-group-item-${colors[randomIndex]}" id=list-${room}>
                                 <h2 id="title-${room}"> ${room.charAt(0).toUpperCase() + room.slice(1)} </h2>
                                 <p id=attr-${room}></p>
                               </li>`;
            });

            $(".list-group").append(components);
            addAttributes()
        });
    }

    function addAttributes() {
        Object.keys(configuration).forEach(function (room) {
            Object.entries(configuration[room]).forEach(function ([attribute, value]) {
                let attributeContainer = $(`#attr-${room}`);
                let attributeHtml = `<p id="${attribute}-${room}">`;
                attributeHtml += `${attribute.charAt(0).toUpperCase() + attribute.slice(1)}: `;

                switch (attribute) {
                    case "light":
                    case "curtains":
                        attributeHtml += createToggleButton(value, attribute, room);
                        attributeContainer.append(attributeHtml + `</p>`);

                        $(`#checkbox-${attribute}-${room}`).click(function () {
                            configuration[room][attribute] =
                                configuration[room][attribute].localeCompare("on") === 0 ? "off" : "on";

                            if (attribute.localeCompare("curtains") === 0) {
                                if (configuration[room][attribute].localeCompare("on") === 0) {
                                    $(`.${room}-curtains`).show();
                                    changeColor(room, "darken");
                                }
                                else {
                                    $(`.${room}-curtains`).hide();
                                    changeColor(room, "brighten");
                                }
                            } else {
                                if (configuration[room][attribute].localeCompare("on") === 0) {
                                    changeColor(room, "brighten");
                                } else {
                                    changeColor(room, "darken");
                                }
                            }
                        });

                        break;

                    case "temperature":
                        attributeHtml += createMinusButton(attribute, room);
                        attributeHtml += ` <span id="${attribute}-${room}-value">${value}</span> `;
                        attributeHtml += createPlusButton(attribute, room);

                        attributeContainer.append(attributeHtml + `</p>`);

                        let roomTemperature = $(`.${room}-temperature`);
                        roomTemperature.html(configuration[room][attribute] + "&#176;C");

                        $(`#button-${attribute}-${room}-minus`).click(function () {
                            let temperature = parseFloat(configuration[room][attribute]);
                            if (temperature > 16) {
                                configuration[room][attribute] = (temperature - 0.5).toString();
                                $(`#${attribute}-${room}-value`).text(configuration[room][attribute]);
                                roomTemperature.html(configuration[room][attribute] + "&#176;C");
                            }
                        });

                        $(`#button-${attribute}-${room}-plus`).click(function () {
                            let temperature = parseFloat(configuration[room][attribute]);
                            if (temperature < 26) {
                                configuration[room][attribute] = (temperature + 0.5).toString();
                                $(`#${attribute}-${room}-value`).text(configuration[room][attribute]);
                                roomTemperature.html(configuration[room][attribute] + "&#176;C");
                            }
                        });

                    // Can be extended with other options
                }
            });

            $(`#title-${room}`).click(function() {
                $(`#attr-${room}`).slideToggle("slow");
            })
        })
    }

    function createToggleButton(value, attribute, room) {
        let checked = value.localeCompare("on") === 0 ? "checked" : "";

        if (attribute.localeCompare("curtains") === 0 && checked.localeCompare("") === 0) {
            $(`.${room}-curtains`).hide();
        }

        return `<label class="switch">
                  <input type="checkbox" ${checked} id="checkbox-${attribute}-${room}">
                  <span class="slider round"></span>
                </label>`
    }

    function createMinusButton(attribute, room) {
        return `<button type="button" 
                        id="button-${attribute}-${room}-minus"
                        class="btn btn-primary btn-sm">
                    -
                </button>`;
    }


    function createPlusButton(attribute, room) {
        return `<button type="button" 
                        id="button-${attribute}-${room}-plus"
                        class="btn btn-danger btn-sm">
                    +
                </button>`;
    }


    function changeColor(room, flag) {
        let roomElement = $(`.${room}`);
        let color = roomElement.css("fill");
        let rgb = color.split('(')[1].split(')')[0].split(", ");
        let finalRGB = "rgb(";

        rgb.forEach(function(valueStr) {
            let value = parseInt(valueStr);

            if (value > 0) {
                if (flag.localeCompare("darken") === 0) {
                    value -= 100;
                } else {
                    value += 100;
                }
            }

            if (value < 0) {
                value = 0;
            } else if (value > 255) {
                value = 255;
            }

            finalRGB += value.toString() + ", "
        });

        finalRGB = finalRGB.slice(0, finalRGB.length - 2) + ")";
        roomElement.css("fill", finalRGB);
    }


    initControls();
});
$(document).ready(function() {

    let configuration = null;
    let colors = ["primary", "secondary", "success", "danger", "warning", "info"];
    let CHANGING_STEP = 100;
    let COLOR_MIN = 0;
    let COLOR_MAX = 255;

    // function where initial data about the house are read from the server
    // each room of the house creates a new <li> component inside the existent <ul> in index.html
    function createControls() {
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

            addAttributes();
        });
    }


    // function where for each room its attributes are converted in a new component
    function addAttributes() {

        Object.keys(configuration).forEach(function (room) {
            Object.entries(configuration[room]).forEach(function ([attribute, value]) {

                // a new <p> for each attribute is created
                let attributeContainer = $(`#attr-${room}`);
                let attributeHtml = `<p id="${attribute}-${room}">`;
                attributeHtml += `${attribute.charAt(0).toUpperCase() + attribute.slice(1)}: `;

                // depending on the attribute, different components are added to its <p>
                switch (attribute) {
                    // in case of light and curtains, toggle buttons will be added
                    case "light":
                    case "curtains":
                        attributeHtml += createToggleButton(value, attribute, room);
                        attributeContainer.append(attributeHtml + `</p>`);

                        // a click handler is added to the toggle button
                        $(`#toggle-${attribute}-${room}`).click(function () {

                            // firstly, the attribute value is changed
                            configuration[room][attribute] =
                                configuration[room][attribute].localeCompare("on") === 0 ? "off" : "on";

                            /*
                                then, if the attribute is curtains and they are being closed (off),
                                the room is enlightened and they do not show up on the image, otherwise
                                the room is darkened and the curtains show up on the image
                            */
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
                                /*
                                    if the attribute is light, when it is switched on, the room
                                    enlightens, otherwise the room is darkened
                                 */
                                if (configuration[room][attribute].localeCompare("on") === 0) {
                                    changeColor(room, "brighten");
                                } else {
                                    changeColor(room, "darken");
                                }
                            }
                        });

                        break;

                    case "temperature":
                        // in case of temperature, two buttons (+ and -) are create along with
                        // the current value of the temperature (in Celsius)
                        attributeHtml += createButton(attribute, room, "minus");
                        attributeHtml += ` <span id="${attribute}-${room}-value">${value}</span> `;
                        attributeHtml += createButton(attribute, room, "plus");

                        attributeContainer.append(attributeHtml + `</p>`);

                        // the current temperature is also displayed in the image
                        let roomTemperature = $(`.${room}-temperature`);
                        roomTemperature.html(configuration[room][attribute] + "&#176;C");

                        // a click handler is attached for each button
                        // for the minus button, the temperature is lowered by 0.5oC until 16oC
                        $(`#button-${attribute}-${room}-minus`).click(function () {
                            let temperature = parseFloat(configuration[room][attribute]);
                            if (temperature > 16) {
                                configuration[room][attribute] = (temperature - 0.5).toString();
                                $(`#${attribute}-${room}-value`).text(configuration[room][attribute]);
                                roomTemperature.html(configuration[room][attribute] + "&#176;C");
                            }
                        });

                        // for the plus button, the temperature is raised by 0.5oC until 28oC
                        $(`#button-${attribute}-${room}-plus`).click(function () {
                            let temperature = parseFloat(configuration[room][attribute]);
                            if (temperature < 28) {
                                configuration[room][attribute] = (temperature + 0.5).toString();
                                $(`#${attribute}-${room}-value`).text(configuration[room][attribute]);
                                roomTemperature.html(configuration[room][attribute] + "&#176;C");
                            }
                        });

                    // here, the code can be extended with other attributes
                }
            });

            // the attributes paragraph slides when clicking on the room name
            $(`#title-${room}`).click(function() {
                $(`#attr-${room}`).slideToggle("slow");
            })
        })
    }


    // method that creates a toggle button, with id and value based on parameters
    function createToggleButton(value, attribute, room) {
        let checked = value.localeCompare("on") === 0 ? "checked" : "";

        if (attribute.localeCompare("curtains") === 0 && checked.localeCompare("") === 0) {
            $(`.${room}-curtains`).hide();
        }

        return `<label class="switch">
                  <input type="checkbox" ${checked} id="toggle-${attribute}-${room}">
                  <span class="slider round"></span>
                </label>`
    }


    // method that creates a button with id and displayed text based on parameters
    function createButton(attribute, room, value) {
        let displayedValue = value;
        let color = colors[0];

        if (value.localeCompare("plus") === 0) {
            displayedValue = "+";
            color = colors[3];
        } else if (value.localeCompare("minus") === 0) {
            displayedValue = "-";
            color = colors[0]
        }

        return `<button type="button" 
                        id="button-${attribute}-${room}-${value}"
                        class="btn btn-${color} btn-sm">
                    ${displayedValue}
                </button>`;
    }


    // method that changes the colour of a component with CHANGING_STEP based on the flag
    function changeColor(room, flag) {
        let roomElement = $(`.${room}`);
        let color = roomElement.css("fill");
        let rgb = color.split('(')[1].split(')')[0].split(", ");
        let finalRGB = "rgb(";

        rgb.forEach(function(valueStr) {
            let value = parseInt(valueStr);

            if (value > 0) {
                // if the flag is "darken", the rgb values are lowered by CHANGING_STEP, otherwise raised
                if (flag.localeCompare("darken") === 0) {
                    value -= CHANGING_STEP;
                } else {
                    value += CHANGING_STEP;
                }

                // make sure rgb values do not exceed the limits
                if (value < COLOR_MIN) {
                    value = COLOR_MIN;
                } else if (value > COLOR_MAX) {
                    value = COLOR_MAX;
                }
            }

            finalRGB += value.toString() + ", "
        });

        finalRGB = finalRGB.slice(0, finalRGB.length - 2) + ")";
        roomElement.css("fill", finalRGB);
    }

    createControls();
});
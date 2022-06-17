createBulbs()

/*  if 'l' is pressed:
 *  - HOST: lights on/off
 *  - GUEST: display warning pop-up
 */
document.addEventListener('keypress', function (event) {
    if (event.key == 'l') {
        if (sessionStorage.getItem("userRole") == 'HOST') {
        roomLightsConnector();
        roomBulbConnector();
        }
        else if (sessionStorage.getItem("userRole") == 'GUEST') {
            createPopUp("You don't have permission to do this.");
        }
    }
});

let light = true;

function roomLightsConnector() {
    NAF.connection.broadcastDataGuaranteed("room-light", "Room light on/off");
    roomLights();
}

function roomBulbConnector() {
    NAF.connection.broadcastDataGuaranteed("turnLight", "Room light on/off");
    changeLights();
}

function roomLights() {
    const light = document.querySelector('#room-light');
    light.emit('on-off');
    const animation = light.getAttribute('animation');
    const from = animation.from;
    const to = animation.to;
    animation.from = to;
    animation.to = from;
}


function changeLights() {
    if (light === false) {
        turnOnLight();
    } else {
        turnOffLight();
    }
}

function turnOffLight() {
    const bulb = document.getElementById("bulb")
    let animationBulb = bulb.getAttribute('animation');
    animationBulb.from = "#ffffff"
    animationBulb.to = "#555555";
    bulb.emit('openLight');

    light = false
}

function turnOnLight() {
    const bulb = document.getElementById("bulb")
    let animationBulb = bulb.getAttribute('animation');
    animationBulb.from = "#555555"
    animationBulb.to = "#ffffff";
    bulb.emit('openLight');

    light = true
}


function createBulbs() {
    scene.appendChild(document.createElement('a-circle')).id = "bulb"
    let blinder = document.getElementById("bulb");
    blinder.setAttribute('position', {
        x: 0,
        y: 4.9,
        z: 0
    });

    blinder.setAttribute('geometry', {
        primitive: "ring",
        radiusInner: 0.5,
        radiusOuter: 1
    });

    blinder.setAttribute('rotation', {
        x: 90,
        y: 0,
        z: 0
    })

    blinder.setAttribute('material', {
        side: "double",
        color: "#ffffff"
    })

    blinder.setAttribute('animation', {
        property: "material.color",
        from: "#ffffff",
        to: "#555555",
        dir: "alternate",
        dur: 2000,
        startEvents: "openLight"
    })

}

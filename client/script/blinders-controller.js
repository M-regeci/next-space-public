var scene = document.querySelector('a-scene')
scene.gammaInput = true;
scene.gammaOutput = true;

createBlinders("blinder-long", -5, 5, 0, 90, 10, 5, 15);
createBlinders("blinder-short", 0, 5, 5, 180, 10, 5, 15);

/*  if 'b' is pressed:
 *  - HOST: open/close blinders
 *  - GUEST: display warning pop-up
 */
document.addEventListener('keypress', function (event) {
    if (event.key == 'b') {
        if (sessionStorage.getItem("userRole") == 'HOST') {
            openCloseBlindersConnector();
        }
        else if (sessionStorage.getItem("userRole") == 'GUEST') {
            createPopUp("You don't have permission to do this.");
        }
    }
});

let blind = false;

function createBlinders(idPrefix, x, y, z, yRot, length, height, no) {
    const blinderHeight = height / no;
    scene.appendChild(document.createElement('a-entity')).id = idPrefix;
    const blindersGroup = document.getElementById(idPrefix);
    for (let i = 0; i < no; i++) {
        blindersGroup.appendChild(document.createElement('a-plane')).id = idPrefix + "-" + i;

        let blinder = document.getElementById(idPrefix + "-" + i);
        blinder.setAttribute('shadow', {
            receive: true,
            cast: true,
        });
        blinder.setAttribute('position', {
            x: x,
            y: y - (i * blinderHeight) - blinderHeight / 2,
            z: z
        });

        blinder.setAttribute('material', {
            side: "double"
        });
        blinder.setAttribute('rotation', {
            x: 170,
            y: yRot,
            z: 0
        });
        blinder.setAttribute('geometry', {
            width: length,
            height: blinderHeight,
        });
        blinder.setAttribute('animation', {
            property: "rotation",
            from: "170 " + yRot + " 0",
            to: "100 " + yRot + " 0",
            dir: "alternate",
            dur: 2000,
            startEvents: "open-close"
        })
    }
}

function openCloseBlindersConnector() {
    NAF.connection.broadcastDataGuaranteed("blinders", "blinders open/close");
    openCloseBlinders();
}

function openCloseBlinders() {
    console.log("--------")
    var a = document.getElementById("blinder-long-1")
    var x = (a.getAttribute("rotation"))
    console.log(x[Object.keys(x)[0]])

    if (blind === false) {
        openBlinders();
    } else {
        closeBlinders();
    }
}

function openBlinders() {
    document.querySelector('#blinder-long').childNodes.forEach(element => {
        const animation = element.getAttribute("animation");
        const from = "170 " + 90 + " 0"
        const to = "170 " + 90 + " 0"
        animation.from = "170 " + 90 + " 0"
        animation.to = "100 " + 90 + " 0"

        element.emit('open-close');

    });

    document.querySelector('#blinder-short').childNodes.forEach(element => {
        const animation = element.getAttribute("animation");
        animation.from = "170 " + 180 + " 0"
        animation.to = "100 " + 180 + " 0"

        element.emit('open-close');
    });

    blind = true;
}

function closeBlinders() {
    document.querySelector('#blinder-long').childNodes.forEach(element => {
        const animation = element.getAttribute("animation");
        animation.from = "100 " + 90 + " 0"
        animation.to = "170 " + 90 + " 0"

        element.emit('open-close');

    });

    document.querySelector('#blinder-short').childNodes.forEach(element => {
        const animation = element.getAttribute("animation");
        animation.from = "100 " + 180 + " 0"
        animation.to = "170 " + 180 + " 0"

        element.emit('open-close');
    });

    blind = false;

}

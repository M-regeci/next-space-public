AFRAME.registerComponent("emojis", {
    init: function () {
        // keep track of each avatar / networkID / clientID
        // const usersMap = {};

        document.body.addEventListener("entityCreated", function (evt) {
            console.log("Nova entita prisla : entityCreated event. clientId =", evt.detail.el);
            const el = evt.detail.el;
            createPopUpConnected(el.children[0].components.text.attrValue.value);


            Object.keys(usersMap).forEach(function (key) {
                console.log(usersMap[key].el.children[0].components.text.attrValue.value);
            });
            
            // add text on board + dropdown menu ('Players') for every new user, different for both rooms
            var html, html2;
            let scene = document.querySelector('a-scene');
            if (scene.getAttribute('networked-scene').room == 'office-space') {
                [html, html2] = updateOfficeBoard();
            } else {
                [html, html2] = updateOpenBoard();
            }

            var clients = document.getElementById("clients");
            clients.setAttribute("value", html2);
            document.getElementById("add").innerHTML = html;
            const networkedComponent = el.getAttribute("networked");
            usersMap[networkedComponent.creator] = {
                networkId: networkedComponent.networkId,
                el: el
            };
        });

        document.body.addEventListener("clientDisconnected", function (evt) {
            var username = usersMap[evt.detail.clientId].el.children[0].components.text.attrValue.value;
            var role = usersMap[evt.detail.clientId].el.children[1].components.text.attrValue.value;
            createPopUp(username + ((role == 'KICKED') ? " has been kicked." : " left the room."));

            if (usersMap[evt.detail.clientId]){
                delete usersMap[evt.detail.clientId];

                // if HOST leaves, choose a new one
                if (role == 'HOST') {
                    chooseNewHost();
                }

                // rewrite (without disconnected user) text on board + dropdown menu ('Players'), different for both rooms
                var html, html2;
                let scene = document.querySelector('a-scene');
                if (scene.getAttribute('networked-scene').room == 'office-space') {
                    [html, html2] = updateOfficeBoard();
                } else {
                    [html, html2] = updateOpenBoard();
                }
                
                var clients = document.getElementById("clients");
                clients.setAttribute("value", html2);
                document.getElementById("add").innerHTML = html;
            }
        });

        // send data to others


        // receive and react

        // <a-cylinder color="white" theta-start="0" theta-length="180" side="double" scale="0.2 0 0.2"
//					rotation="0 90 260"  position="0 -0.2 -0.37"></a-cylinder>
function createPopUpConnected(text) {
    const popUp = document.createElement("p");
    const popUps = document.getElementById('popups');
    if (sessionStorage.getItem("lastname")==text) {
        popUps.style.display = "none";
        setTimeout(function () {
            popUps.style.display = "flex";
        }, 6000);

    }
    else if (sessionStorage.getItem("lastname")!=text) {
          popUp.innerHTML = text+" joined the room.";
          popUp.setAttribute('id','popup')

    popUps.appendChild(popUp);
    setTimeout(function(){
        popUp.classList.toggle("fade");
     }, 3000);
     setTimeout(function () {
         popUp.remove();
     }, 3300);
    }
    return popUp;
}

        function createSmileClient(parent) {
            var indicator = document.createElement("a-entity");
            var sphere = document.createElement("a-cylinder");
            sphere.setAttribute("color", "white");
            sphere.setAttribute("theta-start", "0");
            sphere.setAttribute("theta-length", "180");
            sphere.setAttribute("scale", "0.2 0 0.2");
            sphere.setAttribute("rotation", "0 90 265");
            sphere.setAttribute("position", "0 -0.1 -0.35");
            indicator.appendChild(sphere);


            /*
            var box = document.createElement("a-box");
            box.setAttribute("color", "red");
            box.setAttribute("depth", "0.1");
            box.setAttribute("height", "0.01");
            box.setAttribute("width", "0.06");
            box.setAttribute("rotation", "0 90 260");
            box.setAttribute("position", "0 -0.3 0.08");
            indicator.appendChild(box);
            */

            parent.appendChild(indicator);


            return indicator;
        }

        function surpriseClient(parent) {
            var indicator = document.createElement("a-entity");
            var sphere = document.createElement("a-cylinder");
            sphere.setAttribute("color", "black");

            sphere.setAttribute("scale", "0.15 0 0.15");
            sphere.setAttribute("rotation", "0 90 265");
            sphere.setAttribute("position", "0 -0.2 -0.35");
            indicator.appendChild(sphere);
            /*
            var box = document.createElement("a-box");
            box.setAttribute("color", "red");
            box.setAttribute("depth", "0.1");
            box.setAttribute("height", "0.01");
            box.setAttribute("width", "0.06");
            box.setAttribute("rotation", "0 90 260");
            box.setAttribute("position", "0 -0.3 0.08");
            indicator.appendChild(box);
            */

            parent.appendChild(indicator);


            return indicator;
        }

        function tiredClient(parent) {
            var indicator = document.createElement("a-entity");

            var png = document.createElement("a-image");
            png.setAttribute("src", "../asset/emojis/zzz.png")
            png.setAttribute("scale", "0.4 0.4 0.4")
            png.setAttribute("position", "-0.1 0.5 -0.4")
            indicator.appendChild(png);

            parent.appendChild(indicator);
            return indicator;
        }

        function angryClient(parent) {
            var indicator = document.createElement("a-entity");

            var png1 = document.createElement("a-image");
            png1.setAttribute("src", "../asset/emojis/curved-line.png")
            png1.setAttribute("scale", "0.3 0.3 0.3")
            png1.setAttribute("rotation", "0 0 0");

            png1.setAttribute("position", "0.2 0.2 -0.35")
            indicator.appendChild(png1);

            var png2 = document.createElement("a-image");
            png2.setAttribute("src", "../asset/emojis/curved-line.png")
            png2.setAttribute("rotation", "0 0 270");

            png2.setAttribute("scale", "0.3 0.3 0.3")
            png2.setAttribute("position", "-0.2 0.2 -0.35")
            indicator.appendChild(png2);

            var sphere = document.createElement("a-ring");
            sphere.setAttribute("color", "black");
            sphere.setAttribute("theta-start", "0");
            sphere.setAttribute("theta-length", "180");
            sphere.setAttribute("scale", "0.15 0.15 0.15")
            sphere.setAttribute("height", "90")

            sphere.setAttribute("rotation", "180 0 180");
            sphere.setAttribute("position", "0 -0.3 -0.35");
            indicator.appendChild(sphere);

            parent.appendChild(indicator);


            return indicator;
        }

        function loveClient(parent) {
            var indicator = document.createElement("a-entity");

            var png1 = document.createElement("a-image");
            png1.setAttribute("src", "../asset/emojis/love.png")
            png1.setAttribute("scale", "0.3 0.3 0.3")

            png1.setAttribute("position", "0.27 0.07 -0.35")
            indicator.appendChild(png1);

            var png2 = document.createElement("a-image");
            png2.setAttribute("src", "../asset/emojis/love.png")
            png2.setAttribute("scale", "0.3 0.3 0.3")

            png2.setAttribute("position", "-0.27 0.07 -0.35")
            indicator.appendChild(png2);

            parent.appendChild(indicator);


            return indicator;
        }


        function thumbsUpClient(parent) {
            var indicator = document.createElement("a-entity");

            var png = document.createElement("a-image");
            png.setAttribute("src", "../asset/emojis/thumbs-up.png")
            png.setAttribute("scale", "0.4 0.4 0.4")
            png.setAttribute("position", "0.6 0 -0.4")
            indicator.appendChild(png);

            parent.appendChild(indicator);


            return indicator;
        }


        function sadClient(parent) {
            var indicator = document.createElement("a-entity");
            var sphere = document.createElement("a-ring");
            sphere.setAttribute("color", "black");
            sphere.setAttribute("theta-start", "0");
            sphere.setAttribute("theta-length", "180");
            sphere.setAttribute("scale", "0.15 0.15 0.15")
            sphere.setAttribute("height", "90")

            sphere.setAttribute("rotation", "180 0 180");
            sphere.setAttribute("position", "0 -0.3 -0.35");
            indicator.appendChild(sphere);
            /*
            var box = document.createElement("a-box");
            box.setAttribute("color", "red");
            box.setAttribute("depth", "0.1");
            box.setAttribute("height", "0.01");
            box.setAttribute("width", "0.06");
            box.setAttribute("rotation", "0 90 260");
            box.setAttribute("position", "0 -0.3 0.08");
            indicator.appendChild(box);
            */

            parent.appendChild(indicator);


            return indicator;
        }


        function thumbsDownClient(parent) {
            var indicator = document.createElement("a-entity");

            var png = document.createElement("a-image");
            png.setAttribute("src", "../asset/emojis/thumbs-down.png")
            png.setAttribute("scale", "0.4 0.4 0.4")
            png.setAttribute("position", "0.6 0 -0.4")
            indicator.appendChild(png);

            parent.appendChild(indicator);


            return indicator;
        }

        function raiceClient(parent) {
            var indicator = document.createElement("a-entity");

            var png = document.createElement("a-image");
            png.setAttribute("src", "../asset/emojis/raise.png")
            png.setAttribute("scale", "0.4 0.4 0.4")
            png.setAttribute("position", "0.6 0 -0.4")
            indicator.appendChild(png);

            parent.appendChild(indicator);


            return indicator;
        }

        NAF.connection.subscribeToDataChannel("first", function newData(
            sender,
            type,
            data,
            target
        ) {
            if (!usersMap[sender]) {
                console.log("unknown sender");
                return;
            }
            let clientData = usersMap[sender];
            if (clientData.indicator) {
                clientData.el.removeChild(clientData.indicator);
                clientData.indicator = null;
            }

            clientData.indicator = createSmileClient(clientData.el)
            setTimeout(function () {
                clientData.el.removeChild(clientData.indicator);
                clientData.indicator = null;
            }, 5000);
        });


        NAF.connection.subscribeToDataChannel("second", function newData(
            sender,
            type,
            data,
            target
        ) {
            if (!usersMap[sender]) {
                console.log("unknown sender");
                return;
            }
            let clientData = usersMap[sender];
            if (clientData.indicator) {
                clientData.el.removeChild(clientData.indicator);
                clientData.indicator = null;
            }
        
            clientData.indicator = thumbsUpClient(clientData.el)
            setTimeout(function () {
                clientData.el.removeChild(clientData.indicator);
                clientData.indicator = null;
            }, 5000);
        });

        NAF.connection.subscribeToDataChannel("sad", function newData(
            sender,
            type,
            data,
            target
        ) {
            if (!usersMap[sender]) {
                console.log("unknown sender");
                return;
            }
            let clientData = usersMap[sender];
            if (clientData.indicator) {
                clientData.el.removeChild(clientData.indicator);
                clientData.indicator = null;
            }

            clientData.indicator = sadClient(clientData.el)
            setTimeout(function () {
                clientData.el.removeChild(clientData.indicator);
                clientData.indicator = null;
            }, 5000);
        });

        NAF.connection.subscribeToDataChannel("thumbsDown", function newData(
            sender,
            type,
            data,
            target
        ) {
            if (!usersMap[sender]) {
                console.log("unknown sender");
                return;
            }
            let clientData = usersMap[sender];
            if (clientData.indicator) {
                clientData.el.removeChild(clientData.indicator);
                clientData.indicator = null;
            }

            clientData.indicator = thumbsDownClient(clientData.el)
            setTimeout(function () {
                clientData.el.removeChild(clientData.indicator);
                clientData.indicator = null;
            }, 5000);
        });

        NAF.connection.subscribeToDataChannel("angry", function newData(
            sender,
            type,
            data,
            target
        ) {
            if (!usersMap[sender]) {
                console.log("unknown sender");
                return;
            }
            let clientData = usersMap[sender];
            if (clientData.indicator) {
                clientData.el.removeChild(clientData.indicator);
                clientData.indicator = null;
            }

            clientData.indicator = angryClient(clientData.el)
            setTimeout(function () {
                clientData.el.removeChild(clientData.indicator);
                clientData.indicator = null;
            }, 5000);
        });

        NAF.connection.subscribeToDataChannel("raise", function newData(
            sender,
            type,
            data,
            target
        ) {
            if (!usersMap[sender]) {
                console.log("unknown sender");
                return;
            }
            let clientData = usersMap[sender];
            if (clientData.indicator) {
                clientData.el.removeChild(clientData.indicator);
                clientData.indicator = null;
            }

            clientData.indicator = raiceClient(clientData.el)
            setTimeout(function () {
                clientData.el.removeChild(clientData.indicator);
                clientData.indicator = null;
            }, 5000);
        });

        NAF.connection.subscribeToDataChannel("love", function newData(
            sender,
            type,
            data,
            target
        ) {
            if (!usersMap[sender]) {
                console.log("unknown sender");
                return;
            }
            let clientData = usersMap[sender];
            if (clientData.indicator) {
                clientData.el.removeChild(clientData.indicator);
                clientData.indicator = null;
            }

            clientData.indicator = loveClient(clientData.el)
            setTimeout(function () {
                clientData.el.removeChild(clientData.indicator);
                clientData.indicator = null;
            }, 5000);
        });

        NAF.connection.subscribeToDataChannel("tired", function newData(
            sender,
            type,
            data,
            target
        ) {
            if (!usersMap[sender]) {
                console.log("unknown sender");
                return;
            }
            let clientData = usersMap[sender];
            if (clientData.indicator) {
                clientData.el.removeChild(clientData.indicator);
                clientData.indicator = null;
            }

            clientData.indicator = tiredClient(clientData.el)
            setTimeout(function () {
                clientData.el.removeChild(clientData.indicator);
                clientData.indicator = null;
            }, 5000);
        });

        NAF.connection.subscribeToDataChannel("surprise", function newData(
            sender,
            type,
            data,
            target
        ) {
            if (!usersMap[sender]) {
                console.log("unknown sender");
                return;
            }
            let clientData = usersMap[sender];
            if (clientData.indicator) {
                clientData.el.removeChild(clientData.indicator);
                clientData.indicator = null;
            }

            clientData.indicator = surpriseClient(clientData.el)
            setTimeout(function () {
                clientData.el.removeChild(clientData.indicator);
                clientData.indicator = null;
            }, 5000);
        });

    }
});


/**
 * General function for creating a pop-up
 * @param text to be displayed 
 * @returns created pop-up
 */
function createPopUp(text) {
    const popUp = document.createElement("p");
    const popUps = document.getElementById('popups');
    const container = document.querySelectorAll('#popup');

    // if there already is a pop-up with the same message,
    // don't display it again, to prevent flood of pop-ups
    for (const popupElement of container) {
        if(popupElement.innerHTML === text) return;
    }

    popUp.innerHTML = text;
    popUp.setAttribute('id','popup');
    popUps.appendChild(popUp);
    setTimeout(function(){
       popUp.classList.toggle("fade");
    }, 3000);
    setTimeout(function () {
        popUp.remove();
    }, 3300);

    return popUp;
}


function makeSmile() {
    NAF.connection.broadcastDataGuaranteed("first", "some-info");

}

function showEmoji(emoji) {
    document.getElementById("myImage").src = emoji
    document.getElementById("myImage").style.visibility = "visible"

    setTimeout(function () {
        document.getElementById("myImage").style.visibility = "hidden";
    }, 5000);


}

function angry() {
    NAF.connection.broadcastDataGuaranteed("angry", "some-info");

}


function makeSurprise() {
    NAF.connection.broadcastDataGuaranteed("surprise", "some-info");

}


function thumbsUp() {
    NAF.connection.broadcastDataGuaranteed("second", "some-info");

}

function thumbsDown() {
    NAF.connection.broadcastDataGuaranteed("thumbsDown", "some-info");

}

function raise() {
    NAF.connection.broadcastDataGuaranteed("raise", "some-info");

}

function sad() {
    NAF.connection.broadcastDataGuaranteed("sad", "some-info");

}

function tired() {
    NAF.connection.broadcastDataGuaranteed("tired", "some-info");

}

function love() {
    NAF.connection.broadcastDataGuaranteed("love", "some-info");

}
	
	
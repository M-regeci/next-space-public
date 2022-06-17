document.body.addEventListener('clientConnected', function (evt) {
    console.log('clientConnected event. clientId =', evt.detail.clientId);

});


document.body.addEventListener('entityCreated', function (evt) {
    console.log('entityCreated event. entity =', evt.detail.el);

    // generate nametag above user
    setNameTag();

    // generate role above user if in Office Space
    let scene = document.querySelector('a-scene');
    if (scene.getAttribute('networked-scene').room == 'office-space') {
        setRole();
    }

    const networkedComponent2 = evt.detail.el.getAttribute("networked");
    usersMap[networkedComponent2.creator] = {
        networkId: networkedComponent2.networkId,
        el: evt.detail.el,
    };

    // if in Open Space, don't try to set attributes that exist only in Office Space
    if (scene.getAttribute('networked-scene').room == 'open-space') return;

    let blinder = document.getElementById("bulb");

    let colorLight = blinder.getAttribute("material");

    var light = colorLight[Object.keys(colorLight)[1]];

    if (light === "rgba(85,85,85,1)") {
        NAF.connection.broadcastDataGuaranteed("turnOffLight", "blinders open/close");

    }

    var blindObject = document.getElementById("blinder-long-1")
    var rota = (blindObject.getAttribute("rotation"))

    if (rota[Object.keys(rota)[0]] === 100) {
        NAF.connection.broadcastDataGuaranteed("openBlinders", "blinders open/close");

    }

    console.log("entityCreated event. clientId =", evt.detail.el);
    console.log(evt)
    const el = evt.detail.el;
    const networkedComponent = el.getAttribute("networked");
    usersMap[networkedComponent.creator] = {
        networkId: networkedComponent.networkId,
        el: el
    };
});


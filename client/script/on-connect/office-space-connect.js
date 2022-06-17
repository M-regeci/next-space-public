function onConnect() {
    console.log('onConnect event');

    turnOffAllMedia();
    addAudioControls();
    addVideoControls();
    addStreamControls();

    NAF.connection.subscribeToDataChannel("blinders", (senderId, dataType, data, targetId) => {
        openCloseBlinders();
    });

    NAF.connection.subscribeToDataChannel("room-light", (senderId, dataType, data, targetId) => {
        roomLights();
    });

    NAF.connection.subscribeToDataChannel("openBlinders", (senderId, dataType, data, targetId) => {
        if (blind === false) {
            openBlinders();

        }
    });

    NAF.connection.subscribeToDataChannel("turnOffLight", (senderId, dataType, data, targetId) => {
        if (light === true) {
            turnOffLight();
            roomLights();
        }

    });

    NAF.connection.subscribeToDataChannel("turnLight", (senderId, dataType, data, targetId) => {
        changeLights();
    });

    waitForData();
}
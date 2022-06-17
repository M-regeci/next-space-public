let playerNumber = 0;

function checkPlayerNumber() {
    playerNumber = 0;
    const joinTime = NAF.connection.adapter._myRoomJoinTime;
    let players = NAF.connection.getConnectedClients();
    Object.keys(players).forEach(el => {
        if(players[el].roomJoinTime < joinTime){
            //player number by roomjointime
            playerNumber += 1;
            // console.log("Increasing player number. New value: ", playerNumber);
        }
    });
}

function waitForData() {
    console.log("Zaciatok");
    setTimeout(() => {
        if (NAF.connection.isConnected()) {
            console.log("You connected at ", NAF.connection.adapter._myRoomJoinTime);
            checkPlayerNumber();
            //playerNumber = Object.keys(NAF.connection.getConnectedClients()).length;
            console.log("You are participant number " + playerNumber);
            spawnPlayer();
        } else waitForData();
    }, 1000);
}

function spawnPlayer() {
    //list of all positions
    let positions = ['0 2 -2', '0 2 2', '2 2 0', '-2 2 0'];
    //number of deleted positions -- if equal to playerNumber, he can spawn
    let positionsDeleted = 0;
    var loader = document.querySelector('.loading');
    var text = document.querySelector('#text');
    if (playerNumber < 4) {
        var splash = document.querySelector('#splash');
        let playerEl = document.createElement('a-entity');
        
        // SET ROLES -> show them above the player (nametag.js)
        (playerNumber < 1) ? sessionStorage.setItem("userRole", "HOST") : sessionStorage.setItem("userRole", "GUEST");
        
        playerEl.setAttribute('id', 'player');
        playerEl.setAttribute('networked', 'template', '#avatar-template');
        playerEl.setAttribute('networked', 'attachTemplateToLocal', 'true');
        playerEl.setAttribute('camera', '');
        playerEl.setAttribute('look-controls', '');
        //daj userovi volnu poziciu
        //console.log("Player number: " + playerNumber);
        playerEl.setAttribute('position', '100 100 100');
        document.querySelector('a-scene').appendChild(playerEl);
        //console.log(playerEl);
        //number of deleted positions, have to be playerNumber, for each player on a map one position;
        function waitForPositions() {
            setTimeout(() => {
                if (positionsDeleted < playerNumber) {
                    checkPlayerNumber();
                    Object.keys(usersMap).forEach(el => {
                        const pos = usersMap[el].el.components.networked.bufferPosition;
                        const actualPosition = pos.x + ' ' + pos.y + ' ' + pos.z;
                        if(positions.indexOf(actualPosition) > -1){
                            positions.splice(positions.indexOf(actualPosition), 1);
                            positionsDeleted += 1;
                            //console.log("position ", actualPosition, " deleted");
                        } 
                    });        
                    waitForPositions();
                }
                else {
                    let position = positions.shift();
                    playerEl.setAttribute('position', position);
                    splash.style.display = 'none';
                }
            }, 200);
        }
        waitForPositions();
    } else {
        //zobraz info ze je roomka full
        loader.style.display = 'none';
        text.style.display = 'inline';
    }
}
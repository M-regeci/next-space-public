function getPermissions() {
    navigator.mediaDevices.getUserMedia({audio: true, video: true}).then()
}

function turnOffAllMedia(){
    NAF.connection.adapter.enableMicrophone(false);
    NAF.connection.adapter.enableCamera(false);
}

getPermissions();
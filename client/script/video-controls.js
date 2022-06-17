let isVideoEnabled = false;
const videoButton = document.getElementById('video-button');

const addVideoControls = function () {
    NAF.connection.adapter.enableCamera(isVideoEnabled);

    videoButton.addEventListener('click', function () {
        isVideoEnabled = !isVideoEnabled;
        NAF.connection.adapter.enableCamera(isVideoEnabled);
        if (isVideoEnabled) {
            navigator.mediaDevices.getUserMedia({video: isVideoEnabled}).then(handleSuccess)
        } else {
            videoPlayback.srcObject = null;
        }
        videoButton.innerHTML = isVideoEnabled ? 'Stop video  ' + '<i style="font-size: 18px; color: green;" class="fa fa-camera"></i>' : 'Start video  ' + '<i style="font-size: 18px; color: red;" class="fa fa-camera"></i>';

    });

    const handleSuccess = function (stream) {
        videoPlayback.srcObject = stream;
    };
    const videoPlayback = document.getElementById('video-playback');
}





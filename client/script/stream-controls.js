// Screen share status
let screenEnabled = false;
// Screen share button element
const screenBtnEle = document.getElementById('stream-button');

const addStreamControls = function() {
    screenBtnEle.addEventListener('click', function() {
        if (screenEnabled) {
          let scene = document.querySelector('a-scene');
          let screenPlane = document.getElementById('stream-plane');
          NAF.connection.adapter.removeLocalMediaStream("screen");
          scene.removeChild(screenPlane);
          screenEnabled = false;
          screenBtnEle.textContent = 'Share screen';
          // after 1st use remove button so the player cannot start streaming again (not working yet) 
          screenBtnEle.parentNode.removeChild(screenBtnEle);

        } else {
          let screenPlane = document.createElement('a-plane');
          screenPlane.setAttribute('id', 'stream-plane');
          screenPlane.setAttribute('networked', 'template', '#stream-template');
          //screenPlane.setAttribute('networked', 'attachTemplateToLocal', 'false');
          let scene = document.querySelector('a-scene');
         scene.appendChild(screenPlane);
          navigator.mediaDevices.getDisplayMedia().then((stream) => {
            NAF.connection.adapter.addLocalMediaStream(stream, "screen");
            screenEnabled = true;
            screenBtnEle.textContent = 'Stop Sharing';
          });
        }
      });
}
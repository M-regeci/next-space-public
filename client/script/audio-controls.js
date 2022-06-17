let isAudioEnabled = false;
const audioButton = document.getElementById('audio-button');

const addAudioControls = function () {
    NAF.connection.adapter.enableMicrophone(isAudioEnabled);

    audioButton.addEventListener('click', function () {
        toggleMicrophone();
    });

    // Listens for 'mute' signal from host's menu, mutes user if triggered
    NAF.connection.subscribeToDataChannel("mute", function (sender, type, data, target) {
      if (isAudioEnabled) {
        toggleMicrophone();
        createPopUp("You have been muted by the HOST.");
      } else {
        NAF.connection.sendDataGuaranteed(sender, 'muted', data);
      }
    });

    // Listens for 'toggleMicrophone' signal from user, changes host's dropdown icon if triggered
    NAF.connection.subscribeToDataChannel("toggleMicrophoneIcon", function (sender, type, data, target) {
      var icon = document.getElementById(`${sender}-icon`);
      if (data === true) {
        console.log("UNMUTE");
        icon.setAttribute('class', 'fa fa-microphone');
        icon.setAttribute('style', 'color: green');
      } else {
        console.log("MUTE");
        console.log(data);
        icon.setAttribute('class', 'fa fa-microphone-slash');
        icon.setAttribute('style', 'color: red');
      }
    });

    document.addEventListener('keypress', function (event) {
        if (event.key == 'v' && !isAudioEnabled) {
            toggleMicrophone();
            
        }
    });

    document.addEventListener('keyup', function (event) {
        if (event.key == 'v' && isAudioEnabled) {
            toggleMicrophone();
        }
    });

    function toggleMicrophone() {
        NAF.connection.adapter.enableMicrophone(!isAudioEnabled);
        isAudioEnabled = !isAudioEnabled;
        Object.keys(usersMap).forEach(function (key) {
          if (usersMap[key].el.children[1].components.text.attrValue.value == 'HOST') {
            NAF.connection.sendDataGuaranteed(key, 'toggleMicrophoneIcon', isAudioEnabled);
          }
        });
        updateButton();
        NAF.connection.broadcastDataGuaranteed("data", "some-info");

    }

    function updateButton() {
      audioButton.innerHTML = isAudioEnabled ? 'Mute  ' + '<i style="font-size: 18px; color: green;" class="fa fa-microphone"></i>' : 'Unmute  ' + '<i style="font-size: 18px; color: red;" class="fa fa-microphone-slash"></i>';
      // audioButton.style.background = isAudioEnabled ? '#DC143C' : 'white';
    }

};
const usersMap = {};

AFRAME.registerComponent("excuse-me", {
    init: function() {
      // keep track of each avatar / networkID / clientID
     // const usersMap = {};


      document.body.addEventListener("entityCreated", function(evt) {
        console.log("entityCreated event. clientId =", evt.detail.el);
        console.log(evt)
        const el = evt.detail.el;
        const networkedComponent = el.getAttribute("networked");
        usersMap[networkedComponent.creator] = {
          networkId: networkedComponent.networkId,
          el: el
        };
      });

      // document.body.addEventListener("clientDisconnected", function(evt) {
      //   if (usersMap[evt.detail.clientId])
      //     delete usersMap[evt.detail.clientId];
      // });

      // send data to others
    //   const button = document.getElementById('audio-button');
    //   button.addEventListener("click", e => {
    //     NAF.connection.broadcastDataGuaranteed("data", "some-info");
    //   });

      // receive and react

      function createIndicator(parent) {
        var indicator = document.createElement("a-image");
        indicator.innerHTML='<a-image src="../asset/image/sound.png" position="0 1 0" rotation="0 ' + 180 + ' 0" scale= "0.2 0.2 0.2" look-at="#player"></a-image>';
        //indicator.setAttribute("src","../asset/image/speaking.png")
        // indicator.setAttribute("src","../asset/image/speaking.png");
        // indicator.setAttribute("material","transparent: true");
        // indicator.setAttribute("alpha-test","");
        // indicator.setAttribute("position", "0 1.2 0");
        // indicator.setAttribute("scale","0.2 0.2 0.2")
        // indicator.setAttribute('rotation', '0 ' + 180 + ' 0');
        // indicator.setAttribute("look-at","#player");
        //png.setAttribute("position","0 0 0")
        //indicator.appendChild(png);
        console.log(indicator);
      //   var box = document.createElement("a-box");
      //   box.setAttribute("scale", "0.1 0.7 0.1");
      //   box.setAttribute("position", "0 0.1 0.2");
      //   indicator.appendChild(box);

        parent.appendChild(indicator);
        return indicator;
      }
      NAF.connection.subscribeToDataChannel("data", function newData(
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
        if (clientData.voiceIndicator) {
          clientData.el.removeChild(clientData.voiceIndicator);
          clientData.voiceIndicator = null;
        } else {
          clientData.voiceIndicator = createIndicator(clientData.el);
        }
      });
    }
  });
function waitForData() {
  setTimeout(() => {
      if (NAF.connection.isConnected()) {
          spawnPlayer();
      } else waitForData();
  }, 100);

  function spawnPlayer() {
    var splash = document.querySelector('#splash2');
    //var loader = document.querySelector('.loading');
    //var text = document.querySelector('#text');
    let playerEl = document.createElement('a-entity');
    playerEl.setAttribute('id', 'player');
    playerEl.setAttribute('networked', 'template', '#avatar-template');
    playerEl.setAttribute('networked', 'attachTemplateToLocal', 'true');
    playerEl.setAttribute('camera', '');
    playerEl.setAttribute('look-controls', '');
    playerEl.setAttribute('wasd-controls', '');
    playerEl.setAttribute('position', '0 1 0');
    playerEl.setAttribute('spawn-in-circle', 'radius:2');
    let scene = document.querySelector('a-scene');
    scene.appendChild(playerEl);
    splash.style.display = 'none';
  }
}

/* global AFRAME, THREE */
AFRAME.registerComponent('spawn-in-circle', {
  schema: {
    radius: {type: 'number', default: 1}
  },

  init: function() {
    var el = this.el;
    var center = el.getAttribute('position');

    var angleRad = this.getRandomAngleInRadians();
    var circlePoint = this.randomPointOnCircle(this.data.radius, angleRad);
    var worldPoint = {x: circlePoint.x + center.x, y: center.y, z: circlePoint.y + center.z};
    el.setAttribute('position', worldPoint);
    // console.log('world point', worldPoint);

    var angleDeg = angleRad * 180 / Math.PI;
    var angleToCenter = -1 * angleDeg + 90;
    angleRad = THREE.Math.degToRad(angleToCenter);
    el.object3D.rotation.set(0, angleRad, 0);
    // console.log('angle deg', angleDeg);
  },

  getRandomAngleInRadians: function() {
    return Math.random()*Math.PI*2;
  },

  randomPointOnCircle: function (radius, angleRad) {
    var x = Math.cos(angleRad)*radius;
    var y = Math.sin(angleRad)*radius;
    return {x: x, y: y};
  }
});
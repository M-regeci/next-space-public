AFRAME.registerComponent('pupil-entity', {
  schema: {
    color: {
      default: 'grey'
    },
    size: {
      default: 1
    },
  },

  update: function() {
    var material = new THREE.MeshBasicMaterial({
      color: this.data.color,
    });
    
    const geometry = new THREE.BufferGeometry();

    const vertices = new Float32Array( [
        -1.0*this.data.size, -1.0*this.data.size,  0.0,
         0.5*this.data.size, -0.5*this.data.size,  0.0,
         1.0*this.data.size,  1.0*this.data.size,  0.0,
    
         1.0*this.data.size,  1.0*this.data.size,  0.0,
        -0.5*this.data.size,  0.5*this.data.size,  0.0,
        -1.0*this.data.size, -1.0*this.data.size,  0.0
    ] );
    
    geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );

    this.el.setObject3D('mesh', new THREE.Mesh(geometry, material));
  },

  remove: function() {
    this.el.removeObject3D('mesh');
  }
});
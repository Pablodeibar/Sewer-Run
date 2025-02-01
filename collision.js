AFRAME.registerComponent('obb-collision-responder', {
    schema: {
        color: { type: 'color', default: '#FF0000' },
        scale: { type: 'vec3', default: { x: 2, y: 2, z: 2 } }
    },

    init: function () {
        this.originalColor = this.el.getAttribute('material')?.color || '#FFFFFF';
        this.originalScale = this.el.object3D.scale.clone();

        this.onCollisionStarted = this.onCollisionStarted.bind(this);
        this.onCollisionEnded = this.onCollisionEnded.bind(this);

        this.el.addEventListener('obbcollisionstarted', this.onCollisionStarted);
        this.el.addEventListener('obbcollisionended', this.onCollisionEnded);
    },

    onCollisionStarted: function () {
        this.el.setAttribute('material', 'color', this.data.color);

        this.el.object3D.scale.set(
            this.data.scale.x,
            this.data.scale.y,
            this.data.scale.z
        );
    },

    onCollisionEnded: function () {
        this.resetObject();
    },

    resetObject: function () {
        this.el.setAttribute('material', 'color', this.originalColor);
        this.el.object3D.scale.copy(this.originalScale);
    },

    remove: function () {
        this.el.removeEventListener('obbcollisionstarted', this.onCollisionStarted);
        this.el.removeEventListener('obbcollisionended', this.onCollisionEnded);
    }
});

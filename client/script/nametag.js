NAF.schemas.add({
    template: '#avatar-template',
    components: [
        'position',
        'rotation',
        {
            selector: '.role',
            component: 'text',
            property: 'value'
        },
        {
            selector: '.nametag',
            component: 'text',
            property: 'value'
        }
    ]
});

NAF.schemas.add({
    template: '#avatar-template2',
    components: [
        'position',
        'rotation',
        {
            selector: '.role',
            component: 'text',
            property: 'value'
        },
        {
            selector: '.nametag',
            component: 'text',
            property: 'value'
        }
    ]
});

/**
 *  Takes stored role and puts it as an <a-entity> element in 'office-space.html'
 *  Role is shown above the user's head.
 *  Roles:  HOST - first user to join (create) a room
 *          GUEST - other users
 */
function setRole() {
    var playerElement = document.getElementById('player');
    var roleElement = playerElement.querySelector('.role');
    var role = ((sessionStorage.getItem("userRole") == null) ? " " : sessionStorage.getItem("userRole"));
    console.log("Setting role " + role + " for " + sessionStorage.getItem("lastname"));
    roleElement.setAttribute('text', 'value', role);
}

function setNameTag() {
    var playerElement = document.getElementById('player');
    var nametagElement = playerElement.querySelector('.nametag');
    console.log("Setting name for " + sessionStorage.getItem("lastname"));
    nametagElement.setAttribute('text', 'value', sessionStorage.getItem("lastname"));
}

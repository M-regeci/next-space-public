// Functions send signals to users specified by 'key'
function muteUser(key) {NAF.connection.sendDataGuaranteed(key, 'mute')}
function kickUser(key) {
    usersMap[key].el.children[1].components.text.attrValue.value = 'KICKED';
    NAF.connection.sendDataGuaranteed(key, 'kick');
}
// Function broadcasts signal to all users except the sender
// 'no-popups' data -> to avoid unnecessary popups, like 'XxXx is already muted'
function muteAll() {NAF.connection.broadcastDataGuaranteed('mute', 'no-popups');}

NAF.connection.subscribeToDataChannel("muted", function (sender, type, data, target) {
    if (data != 'no-popups') {
        createPopUp(usersMap[sender].el.children[0].components.text.attrValue.value + " is already muted.");
    }
});

// Redirects kicked user to the 'main menu' page
NAF.connection.subscribeToDataChannel("kick", function (sender, type, data, target) {
    createPopUp("You have been kicked by the HOST.");
    location.replace("../../");
});


/**
 * Function combines all user's roles + names => pushes this list to board + dropdown list ('Players') in Office Space
 * HOST is always first in this list
 * Adds kick & mute buttons for HOST in the dropdown menu
 * @returns html, html2 - strings that contain each user's role + name
 */
 function updateOfficeBoard() {
    var html="";
    var html2="";

    // Mute ALL option for host only
    if (sessionStorage.getItem("userRole") == 'HOST') {
        html += '<a href="#">Mute All ' + ` <button id="mute-button" onclick="muteAll()">` + '<i style="color: red;" class="fa fa-microphone-slash"></i>' + '</button>' + '</a>';
    }

    Object.keys(usersMap).forEach(function (key) {
        var role = usersMap[key].el.children[1].components.text.attrValue.value;
        var name = usersMap[key].el.children[0].components.text.attrValue.value;
        if (role == 'HOST') {
            html += '<a href="#">' + role + "  " + name + '</a>';
            html2 += role + "  " + name + "\n";
        }
    });

    Object.keys(usersMap).forEach(function (key) {
        var role = usersMap[key].el.children[1].components.text.attrValue.value;
        var name = usersMap[key].el.children[0].components.text.attrValue.value;
        if (role == 'HOST') return;
        if (sessionStorage.getItem("userRole") == 'HOST') {
            html += 
            '<a href="#">' + role + "  " + name + "&nbsp" +
                `<button id="mute-button" onclick="muteUser('${key}')">` +
                    `<i style="color: red;" class="fa fa-microphone-slash" id="${key}-icon"></i>` +
                '</button>' +
                `<button id="kick-button" onclick="kickUser('${key}')">` +
                    '<i style="color: red;" class="fa fa-sign-out"></i>' +
                '</button>' +
            '</a>';
            html2 += role + "  " + name + "\n";
        } else {
            html += '<a href="#">' + role + "  " + name + "</a>";
            html2 += role + "  " + name + "\n";
        }
    });
    
    return [html, html2];
}

/**
 * Function combines all user's names => pushes this list to board + dropdown list ('Players') in Open Space
 * @returns html, html2 - strings that contain all names
 */
function updateOpenBoard() {
    var html="";
    var html2="";

    Object.keys(usersMap).forEach(function (key) {
        var name = usersMap[key].el.children[0].components.text.attrValue.value;
        html += '<a href="#">' + name + '</a>';
        html2 += name + "\n";
    });
    
    return [html, html2];
}

/**
 * Function sorts all the keys alphabetically (to make all user's keys in sync)
 * Chooses the first key -> this user becomes the NEW HOST
 * Changes HOST's role in nametag
 * Displays a pop-up stating, who's the new HOST
 */
function chooseNewHost() {
    let keys = Object.keys(usersMap);
    keys.sort(function (a, b) {return a.localeCompare(b)});
    usersMap[keys[0]].el.children[1].components.text.attrValue.value = 'HOST';
    if (usersMap[keys[0]].el.children[0].components.text.attrValue.value == sessionStorage.getItem('lastname')) {
        sessionStorage.setItem("userRole", "HOST");
        setRole();
    }
    createPopUp(usersMap[keys[0]].el.children[0].components.text.attrValue.value + ' is the new HOST');
}
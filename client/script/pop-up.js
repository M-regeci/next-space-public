function saveName() {
    // Get the value of the input field with id="numb"
    let x = document.getElementById("to").value;
    if(x.length<2 || x.length > 15){
        document.getElementById("to").style.borderColor="red";
        document.getElementById("to").style.borderStyle="solid";
        document.getElementById("message").style.display="inline-block";

    }
    else{
        sessionStorage.setItem("lastname", x);
        document.getElementById("demos").innerHTML = x
        document.getElementById("to").style.borderColor="black";
        document.getElementById("message").style.display="none";
        document.getElementById("overlay").remove();
        $('.popup').hide();
    }
    // If x is Not a Number or less than one or greater than 10
    
}

document.getElementById("demos").innerHTML = sessionStorage.getItem("lastname");

$(function () {
    if (sessionStorage.getItem("lastname") == null) {

        var overlay = $('<div id="overlay" class="x"></div>');

        overlay.show();

        overlay.appendTo(document.body);
        $('.popup').show();
        document.getElementById("to").style.borderColor="black";
            document.getElementById("message").style.display="none";
        $('.close').click(function () {
            document.getElementById("to").style.borderColor="black";
            document.getElementById("message").style.display="none";
            $('.popup').hide();
            overlay.appendTo(document.body).remove();
            return false;
        });
    }

    $('.x').click(function () {
        document.getElementById("to").style.borderColor="black";
        document.getElementById("message").style.display="none";
        $('.popup').hide();
        overlay.appendTo(document.body).remove();
        return false;
    });
});

// CREATE A REFERENCE TO FIREBASE
var messagesRef = new Firebase('https://codelabg.firebaseio.com/');

// REGISTER DOM ELEMENTS
var messageField = $('#messageInput');
var nameField = $('#nameInput');
var messageList = $('#example-messages');

// LISTEN FOR KEYPRESS EVENT
messageField.keypress(function (e) {
    if (e.keyCode == 13) {
        sendMessage();
    }
});

var sendMessage = function(){
    //FIELD VALUES
    var username = nameField.val();
    var message = messageField.val();

    //SAVE DATA TO FIREBASE AND EMPTY FIELD
    messagesRef.push({
        name: username,
        text: message
    });
    messageField.val('');
};

// Add a callback that is triggered for each chat message.
messagesRef.limitToLast(20).on('child_added', function (snapshot) {
    //GET DATA
    var data = snapshot.val();
    var username = data.name || "anonymous";
    var message = data.text;
    var avatar = "assets/img/avatar.png";

    //CREATE ELEMENTS MESSAGE & SANITIZE TEXT
    var template = "<li class=\"media\"><div class=\"media-body\"><div class=\"media\"><a class=\"pull-left\" href=\"#\"><img class=\"media-object img-circle \" src=\"{avatar}\"/></a><div class=\"media-body\">{message}<br/><small class=\"text-muted\">{user}</small><hr/></div></div></div></li>";
    template = template.replace("{message}",message).replace("{user}",username).replace("{avatar}",avatar);
    var messageElement = $(template);

    //ADD MESSAGE
    messageList.append(messageElement);

    //SCROLL TO BOTTOM OF MESSAGE LIST
    messageList[0].scrollTop = messageList[0].scrollHeight;
});
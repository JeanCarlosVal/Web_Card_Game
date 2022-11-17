function buildChatBox(socket, sid, lobby) {
    console.log("ChatBox is here");
    var chat = document.getElementById("chatbox");

    var feed = document.createElement("ul");
        feed.setAttribute("id", "feed");

    var form = document.createElement("form");
        form.setAttribute("id", "form");
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            if (text.value) {
                console.log(text.value);
                socket.emit('chat-message', {lobbyid:lobby, sender:sid, message:text.value});
                text.value = '';
            }
        });

    var text = document.createElement("input");
        text.setAttribute("id", "text");

    var send = document.createElement("button");
        send.setAttribute("id", "send");
        send.setAttribute("type", "input");
        send.innerText = "Send";

    var oc = document.createElement("button");
        oc.setAttribute("id", "chatbox-open-close");
        oc.innerText = "Open";
        oc.addEventListener('click', (e) => {
            if (chat.style.width === "20%") {
                console.log("close");
                // chat.setAttribute("class", "closed");
                chat.style.width = "0px";

                // chat.style.width = "0px";
            }
            else {
                console.log("open");
                // chat.setAttribute("class", "open");
                chat.style.width = "20%";
            }
        });

    var game = document.getElementById("game");
    game.appendChild(oc);

    form.appendChild(text);
    form.appendChild(send);

    chat.appendChild(feed);
    chat.appendChild(form);

    socket.on('chat-message', (pkg) => {
        newChat(pkg.sender, pkg.message);
    });

    socket.on('your-turn', (pkg) => {
        newChat("", "Your Turn!");
    });

    socket.on("player-leave", (pkg) => {
        newChat("", `${pkg.leaver} has left.`);
    });
    
    socket.on("player-join", (pkg) => {
        newChat("", `${pkg.joiner} has joined.`);
    });

    function newChat(sender, message) {
        var msg = document.createElement("li");
        msg.innerText = sender + " : " + message;
        msg.setAttribute("class", "message");
        feed.appendChild(msg);
    }
}

export { buildChatBox };
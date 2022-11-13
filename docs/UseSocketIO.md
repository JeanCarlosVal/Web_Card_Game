# Setting Up Online Games:

## Server-Side
Create a new folder in server-attachements named after your game.
Create names for events in the game (eg draw, hit, select-cards, pass, etc).
Create a function called onConnect(socket). This is where the event names will be handled.
For each game event, call socket.on('event-name', callback(package)) where it will be handled.
The package contains information about the event like the sender, the room, the game, and anything else you need
The function should look something like:

function onConnect(socket) {
    socket.on('draw', (package) => {
        info1 = package.info1;
        ...
    });
}

Make sure to export onConnect!

You may also need to import room management functionality, but Sam is still working on this.

## Client-Side
In the .ejs file for your game, either import your client-side logic or include it in the file.
Import client-side socket.io (below)
Note the game logic itself shouldn't be in here. Only the things that for sending the client's responses.
In your logic, you will probably attach event listeners. But sending emissions with socket.io is easy:
socket.emit('event-name', package); where 'event-name' is your custom event name (handled by your server-side logic), and package is any extra needed information.
It should look something like:

<body>
    <!-- The rest of the page -->
    <script src="/socket.io/socket.io.js"></script>
    <script>
        const socket = io('/yourgame');
        // your client-side logic here..
        tag.addEventListener('click', (e) =>  {
            e.preventDefault(); // this function may be needed btw
            socket.emit('click-tag', {clicks:numClicks, msg:"Hi, Mom!"});
        });
    <script>
</body>

## Attaching to Server
Once you have our logic set up, you can attach this to the server by following this format:

    const yourGame = require('./server-attachements/yourGame');
    const yourGamensp = io.of('/yourGame');
    messagernsp.on('connection', (socket) => {yourGame.onConnect(socket);});

Make sure to put this after the setup of socket.io (close to the bottom)





import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";

var slider = document.getElementById("myRange");
    var output = document.getElementById("demo");
    output.innerHTML = slider.value;

    slider.oninput = function () {
        output.innerHTML = this.value;
    }

var poker = io("http://localhost:8080/poker")

var check = document.getElementById("check")
var fold = document.getElementById("fold")
var raise = document.getElementById("raise")

check.addEventListener("click", e => {
    poker.emit("check")
})
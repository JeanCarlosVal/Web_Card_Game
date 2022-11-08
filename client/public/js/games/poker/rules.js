function playerRotation(players) {
    var k = 1
    function reverse(arr, start, end) {
        while (start < end) {
            [arr[start], arr[end]] = [arr[end], arr[start]];
            start++;
            end--;
        }
    }

    k %= players.length;

    reverse(players, 0, (players.length - 1));
    reverse(players, 0, (k - 1));
    reverse(players, k, (players.length - 1));

    return players
}


export {
    playerRotation
}
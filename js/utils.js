function rectangularCollision(rectangle1, rectangle2) {

    return (rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
        rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height)

}

function determineWinner(player, enemy, timerId) {
    clearTimeout(timerId)
    document.querySelector('.displayMsg').style.display = "flex"
    if (player.health === enemy.health) {
        document.querySelector('.displayMsg').innerHTML = "Tie"
    }
    else if (player.health > enemy.health) {
        document.querySelector('.displayMsg').innerHTML = "!! Player 1 wins!!"
    }
    else {
        document.querySelector('.displayMsg').innerHTML = "!! Player 2 wins!!"
    }
}
let attackDirection = "rightLeft"

// sets thge attack direction for player and enemy based on whether they cross eachother or not

function setAttackDirection(player1, player2) {
    if (player1.position.x > player2.position.x) {
        player1.attackBox.offset.x = -235
        player2.attackBox.offset.x = 0
        return "leftRight"

    }
    else if (player1.position.x < player2.position.x) {
        player1.attackBox.offset.x = 0
        player2.attackBox.offset.x = -235
        return "rightLeft"
    }
}


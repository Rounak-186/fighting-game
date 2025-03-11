const canvas = document.querySelector("canvas")
const c = canvas.getContext('2d')
let width = 1024
let height = 576
canvas.width = width
canvas.height = height


c.fillRect(0, 0, width, height)

const gravity = 0.7

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './assets/background.png',

})

const shop = new Sprite({
    position: {
        x: 610,
        y: 135
    },
    imageSrc: './assets/shop.png',
    scale: 2.7,
    maxFrames: 6
})

const player = new Fighter({
    position: {
        x: 150,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'red',
    attackBox: {
        position: {
            x: 0,
            y: 0
        },
        offset: {
            x: 105,
            y: 50
        },
        width: 185,
        height: 50
    },
    imageSrc: './assets/samuraiMack/Idle.png',
    maxFrames: 8,
    scale: 2.5,
    imageOffset: {
        x: 285,
        y: 155
    },
    sprites: {
        idle: {
            imageSrc: './assets/samuraiMack/Idle.png',
            maxFrames: 8,
            scale: 2.5
        },
        run: {
            imageSrc: './assets/samuraiMack/run.png',
            maxFrames: 8,
            scale: 2.5
        },
        jump: {
            imageSrc: './assets/samuraiMack/Jump.png',
            maxFrames: 2,
            scale: 2.5
        },
        fall: {
            imageSrc: './assets/samuraiMack/Fall.png',
            maxFrames: 2,
            scale: 2.5
        },
        attack1: {
            imageSrc: './assets/samuraiMack/Attack1.png',
            maxFrames: 6,
            scale: 2.5
        },
        takeHit: {
            imageSrc: './assets/samuraiMack/Take Hit - white silhouette.png',
            maxFrames: 4,
            scale: 2.5
        },
        death: {
            imageSrc: './assets/samuraiMack/Death.png',
            maxFrames: 6,
            scale: 2.5
        }

    }
})

const enemy = new Fighter({
    position: {
        x: 930,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    attackBox: {
        position: {
            x: 0,
            y: 0
        },
        offset: {
            x: -170,
            y: 50
        },
        width: 185,
        height: 50
    },
    imageSrc: './assets/kenji/Idle.png',
    maxFrames: 4,
    scale: 2.5,
    imageOffset: {
        x: 285,
        y: 167
    },
    sprites: {
        idle: {
            imageSrc: './assets/kenji/Idle.png',
            maxFrames: 4,
            scale: 2.5
        },
        run: {
            imageSrc: './assets/kenji/run.png',
            maxFrames: 8,
            scale: 2.5
        },
        jump: {
            imageSrc: './assets/kenji/Jump.png',
            maxFrames: 2,
            scale: 2.5
        },
        fall: {
            imageSrc: './assets/kenji/Fall.png',
            maxFrames: 2,
            scale: 2.5
        },
        attack1: {
            imageSrc: './assets/kenji/Attack1.png',
            maxFrames: 4,
            scale: 2.5
        },
        takeHit: {
            imageSrc: './assets/kenji/Take Hit.png',
            maxFrames: 3,
            scale: 2.5
        },
        death: {
            imageSrc: './assets/kenji/Death.png',
            maxFrames: 7,
            scale: 2.5
        }

    }
})

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
}
let lastKey

function animate() {

    window.requestAnimationFrame(animate)// creates an infinite loop
    
    // clearing the canvas before drawing next frame

    c.fillStyle = "black"
    c.fillRect(0, 0, width, height)

    background.update()
    shop.update()
    
    // reducing opacity of background

    c.fillStyle = 'rgba(255,255,255,0.15)'
    c.fillRect(0, 0, width, height)
    setAttackDirection(player, enemy)


    player.update()
    enemy.update()
    
    player.velocity.x = 0
    enemy.velocity.x = 0

    // player movement


    if (keys.a.pressed && player.lastKey === 'a' && player.position.x - 60 >= 5) {
        player.velocity.x = -5
        player.selectSprite('run')

    }
    else if (keys.d.pressed && player.lastKey === 'd' && player.position.x <= width - 5) {
        player.velocity.x = 5
        player.selectSprite('run')

    }
    else {
        player.selectSprite("idle")
    }

    // player jumping

    if (player.velocity.y > 0) {
        player.selectSprite('fall')
    }
    else if (player.velocity.y < 0) {
        player.selectSprite('jump')
    }

    // enemy Movement

    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft' && enemy.position.x - 60 >= 5) {
        enemy.velocity.x = -5
        enemy.selectSprite('run')
    }
    else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight' && enemy.position.x <= width - 5) {
        enemy.velocity.x = 5
        enemy.selectSprite('run')
    }
    else {
        enemy.selectSprite("idle")
    }

    //enemy jumping

    if (enemy.velocity.y > 0) {
        enemy.selectSprite('fall')
    }
    else if (enemy.velocity.y < 0) {
        enemy.selectSprite('jump')
    }

    //detect collision

    // enemy gets hit

    if (rectangularCollision(player, enemy) &&
        player.isAttacking &&
        player.currentFrames === 4) {
        enemy.takeHit()
        player.isAttacking = false
        document.querySelector('.enemy-health-remaining').style.width = enemy.health + '%'
    }

    //if player misses
    if (player.isAttacking && player.currentFrames === 4) {
        player.isAttacking = false
    }
    
    // player gets hit

    if (rectangularCollision(enemy, player) &&
        enemy.isAttacking && enemy.currentFrames === 2) {
        player.takeHit()
        enemy.isAttacking = false
        document.querySelector('.player-health-remaining').style.width = player.health + '%'

    }

    //if enemy misses

    if (enemy.isAttacking && enemy.currentFrames === 2) {
        enemy.isAttacking = false
    }


    //end game based on health
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner(player, enemy, timerId)
    }
}

// decreasing timer

let timer = 60
let timerId
function decreaseTimer() {
    if (timer > 0) {
        timerId = setTimeout(decreaseTimer, 1000)
        timer--
        document.querySelector('.timer').innerHTML = timer
    }

    if (timer === 0) {
        document.querySelector('.displayMsg').style.display = "flex"

        determineWinner(player, enemy, timerId)
    }
}

// detecting user input for player or enenmy

window.addEventListener('keydown', (event) => {
    
    if (!player.dead) {


        switch (event.key) {
            case "d":
            case "D":
                keys.d.pressed = true
                player.lastKey = "d"
                break
            case "a":
            case "A":
                keys.a.pressed = true
                player.lastKey = "a"
                break
            case "w":
            case "W":
                if (player.position.y - 300 >= 0) {
                    player.velocity.y = -20
                }
                break
            case " ":

                player.attack()
                if (player.position.x > enemy.position.x) {
                    player.flip = 2
                }
                else {
                    player.flip = 1
                }
                break
        }
    }

    if (!enemy.dead) {
        switch (event.key) {

            case "ArrowRight":
                keys.ArrowRight.pressed = true
                enemy.lastKey = "ArrowRight"
                break
            case "ArrowLeft":
                keys.ArrowLeft.pressed = true
                enemy.lastKey = "ArrowLeft"
                break
            case "ArrowUp":
                if (enemy.position.y - 300 >= 0) {
                    enemy.velocity.y = -20
                }
                break
            case "0":
                enemy.attack()
                if (player.position.x > enemy.position.x) {
                    enemy.flip = 2
                }
                else {
                    enemy.flip = 1
                }
                break

        }
    }
})

window.addEventListener('keyup', (event) => {


    switch (event.key) {
        case "d":
        case "D":
            keys.d.pressed = false
            break
        case "a":
        case "A":
            keys.a.pressed = false
            break
        case "ArrowRight":
            keys.ArrowRight.pressed = false
            break
        case "ArrowLeft":
            keys.ArrowLeft.pressed = false
            break
    }

})

// calling our functions to constantly draw and re-draw frames

decreaseTimer()
animate()
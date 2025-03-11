class Sprite {
    constructor({ position, imageSrc, scale = 1, maxFrames = 1, imageOffset = { x: 0, y: 0 } }) {
        this.position = position
        this.width = 50
        this.height = 150
        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale
        this.maxFrames = maxFrames
        this.currentFrames = 0
        this.framesElapsed = 0
        this.framesHold = 5
        this.imageOffset = imageOffset
    }
    draw() {
        c.drawImage(
            this.image,
            this.currentFrames * (this.image.width / this.maxFrames),//crop location x
            0,//crop location y
            (this.image.width / this.maxFrames),
            this.image.height,
            this.position.x - this.imageOffset.x,
            this.position.y - this.imageOffset.y,
            this.image.width / this.maxFrames * this.scale,
            this.image.height * this.scale)
    }
    animateFrames() {

        this.framesElapsed++
        if (this.framesElapsed % this.framesHold === 0) {
            if (this.currentFrames < this.maxFrames - 1)
                this.currentFrames++
            else
                this.currentFrames = 0
        }
    }

    update() {
        this.draw()
        this.animateFrames()
    }
}

class Fighter extends Sprite {

    constructor({ position,
        velocity,
        color = 'red',
        attackBox = { offset: {}, width: undefined, height: undefined },
        imageSrc,
        scale = 1,
        maxFrames = 1,
        imageOffset = { x: 0, y: 0 },
        sprites }) {

        super({
            position,
            imageSrc,
            scale,
            maxFrames,
            imageOffset
        })


        this.velocity = velocity
        this.width = 50
        this.height = 150
        this.lastKey
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset: {
                x: attackBox.offset.x,
                y: attackBox.offset.y
            },
            width: attackBox.width,
            height: attackBox.height

        }
        this.color = color
        this.isAttacking
        this.health = 100
        this.currentFrames = 0
        this.framesElapsed = 0
        this.framesHold = 5
        this.sprites = sprites
        this.dead = false
        this.flip = 1

        for (const sprite in this.sprites) {
            sprites[sprite].image = new Image()
            sprites[sprite].image.src = sprites[sprite].imageSrc
        }
    }
    drawPlayer() {

        // selecting either to draw images flipped or not based on enemy and player direction
        if (this.flip === 1) {
            //changing offset as per normal image

            this.imageOffset.x = 285

            // draws player normally
            c.drawImage(
                this.image,
                this.currentFrames * (this.image.width / this.maxFrames),//crop location x
                0,//crop location y
                (this.image.width / this.maxFrames),
                this.image.height,
                this.position.x - this.imageOffset.x,
                this.position.y - this.imageOffset.y,
                this.image.width / this.maxFrames * this.scale,
                this.image.height * this.scale)
        }
        else {
            //changing offset as per flipped image

            this.imageOffset.x = 215

            //draws player flipped
            c.scale(-1, 1)
            c.drawImage(
                this.image,
                this.currentFrames * (this.image.width / this.maxFrames),//crop location x
                0,//crop location y
                (this.image.width / this.maxFrames),
                this.image.height,
                -(this.position.x + this.imageOffset.x),
                this.position.y - this.imageOffset.y,
                this.image.width / this.maxFrames * this.scale,
                this.image.height * this.scale)
            c.scale(1, 1)
        }

    }

    drawEnemy() {

        // selecting either to draw images flipped or not based on enemy and player direction

        if (this.flip === 1) {
            //changing offset as per normal image

            this.imageOffset.x = 285

            // draws enemy normally
            c.drawImage(
                this.image,
                this.currentFrames * (this.image.width / this.maxFrames),//crop location x
                0,//crop location y
                (this.image.width / this.maxFrames),
                this.image.height,
                this.position.x - this.imageOffset.x,
                this.position.y - this.imageOffset.y,
                this.image.width / this.maxFrames * this.scale,
                this.image.height * this.scale)
        }
        else {
            //changing offset as per flipped image

            this.imageOffset.x = 215

            // draws enemy flipped
            c.scale(-1, 1)
            c.drawImage(
                this.image,
                this.currentFrames * (this.image.width / this.maxFrames),//crop location x
                0,//crop location y
                (this.image.width / this.maxFrames),
                this.image.height,
                -(this.position.x + this.imageOffset.x),
                this.position.y - this.imageOffset.y,
                this.image.width / this.maxFrames * this.scale,
                this.image.height * this.scale)
            c.scale(1, 1)
        }

    }


    update() {
       // selecting whether to draw player or enemy
        if (this.color === 'red')
            this.drawPlayer()
        else (this.color === ' blue')
        this.drawEnemy()
        if (!this.dead)
            this.animateFrames()
        
        // updating x,y position for attackbox based on player's or enemy's position
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y


        //this is where we draw attack box
        // c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)

        this.position.y += this.velocity.y
        this.position.x += this.velocity.x



        //gravity function

        if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
            this.velocity.y = 0
            this.position.y = 330
        }
        else {
            this.velocity.y += gravity
        }
    }
    attack() {
        this.selectSprite('attack1')
        this.hasAttacked = true
        this.isAttacking = true
    }

    takeHit() {

        this.health -= 10


        if (this.health <= 0) {
            this.selectSprite("death")
        }
        else {
            this.selectSprite("takeHit")

        }
    }

    selectSprite(sprite) {
        //overriding all other animations with the attack animation
        if (this.image === this.sprites.attack1.image &&
            this.currentFrames < this.sprites.attack1.maxFrames - 1)
            return

        //overriding all other animations with the take hit animation
        if (this.image === this.sprites.takeHit.image &&
            this.currentFrames < this.sprites.takeHit.maxFrames - 1)
            return

        //overriding all other animations with the take hit animation
        if (this.image === this.sprites.death.image) {
            if (this.currentFrames === this.sprites.death.maxFrames - 1) {
                this.dead = true
            }
            return
        }

        switch (sprite) {
            case "idle":
                if (this.image != this.sprites.idle.image) {
                    this.image = this.sprites.idle.image
                    this.maxFrames = this.sprites.idle.maxFrames
                    this.currentFrames = 0
                }
                break;
            case "run":
                if (this.image != this.sprites.run.image) {
                    this.image = this.sprites.run.image
                    this.maxFrames = this.sprites.run.maxFrames
                    this.currentFrames = 0
                }
                break;

            case "jump":
                if (this.image != this.sprites.jump.image) {
                    this.image = this.sprites.jump.image
                    this.maxFrames = this.sprites.jump.maxFrames
                    this.currentFrames = 0
                }
                break;

            case "fall":
                if (this.image != this.sprites.fall.image) {
                    this.image = this.sprites.fall.image
                    this.maxFrames = this.sprites.fall.maxFrames
                    this.currentFrames = 0
                }
                break;

            case "attack1":
                if (this.image != this.sprites.attack1.image) {
                    this.image = this.sprites.attack1.image
                    this.maxFrames = this.sprites.attack1.maxFrames
                    this.currentFrames = 0
                }
                break;

            case "takeHit":
                if (this.image != this.sprites.takeHit.image) {
                    this.image = this.sprites.takeHit.image
                    this.maxFrames = this.sprites.takeHit.maxFrames
                    this.currentFrames = 0
                }
                break;

            case "death":
                if (this.image != this.sprites.death.image) {
                    this.image = this.sprites.death.image
                    this.maxFrames = this.sprites.death.maxFrames
                    this.currentFrames = 0
                }
                break;
        }
    }
}
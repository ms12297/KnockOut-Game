let WIDTH = 1400;
let HEIGHT = 720;
let game;

// time variables are created to keep track of item generation
let time1 = (new Date()).getTime() / 1000

let stage = 0
let gamestart = false

//to disable scrolling on arrow keys and spacebar
window.addEventListener("keydown", function (e) {
  if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) > -1) {
    e.preventDefault();
  }
}, false);

// Preload all the images and sounds
function preload() {
  pistolimg = loadImage('images/pistol.png');
  sniperimg = loadImage('images/sniper.png');
  arimg = loadImage('images/assaultr.png');
  bulletimg = loadImage('images/bullet.png');
  heartimg = loadImage('images/heart.png');
  bgimg = loadImage('images/background.png');
  platimg = loadImage("images/platform.png");
  p1img = loadImage("images/RedChar.png");
  p2img = loadImage("images/BlueChar.png");
  grenadeimg = loadImage("images/grenade.png");
  crateimg = loadImage("images/crate.png");
  heartimg = loadImage("images/heart.png");
  shieldimg = loadImage("images/shield.png");
  arrow_key = loadImage("images/arrow_key.png");
  wasd = loadImage("images/wasd.png");
  c = loadImage("images/c.png");
  v = loadImage("images/v.png");
  forward_slash = loadImage("images/forward_slash.png");
  period = loadImage("images/period.png");
  graybg = loadImage("images/grayBackground.jpg")
  title = loadImage("images/title.png")
  redimg = loadImage("images/redWin.png")
  blueimg = loadImage("images/blueWin.png")
  youwin = loadImage("images/youWin1.png")  


  pistolsound = loadSound("sounds/pistol.mp3");
  grenadesound = loadSound("sounds/grenade.mp3");
  itemsound = loadSound("sounds/item.mp3");
  snipersound = loadSound("sounds/sniper.mp3");
  assaultrsound = loadSound("sounds/assultr.mp3");



}


function setup() {
  var canvas = createCanvas(WIDTH, HEIGHT);
  canvas.id("canvas1");
  canvas.parent("#center");
  fill(0, 0, 0)
  textSize(25)
  pistolsound.setVolume(0.1);
  snipersound.setVolume(0.1);
  assaultrsound.setVolume(0.05);
  grenadesound.setVolume(0.3);
  itemsound.setVolume(0.1);
}


function draw() {
  //Stage 0 for start screen
  if (stage == 0) {
    fill(0, 0, 0)  
    textSize(25) 
    background(graybg)
    image(title, 300, 100, 800, 100)
    text("Player 2", 300, 300)
    image(wasd, 100, 400, 200, 140)
    image(c, 100, 550, 50, 50)
    text("Shoot", 160, 580)
    image(v, 100, 610, 50, 50)
    text("Throw Grenade", 160, 640)
    image(redimg, 350, 350, 250, 300)

    text("Player 1", 1000, 300)
    image(arrow_key, 800, 390, 210, 150)
    image(forward_slash, 800, 550, 50, 50)
    text("Shoot", 860, 580)
    image(period, 800, 610, 50, 50)
    text("Throw Grenade", 860, 640)
    image(blueimg, 1050, 350, 250, 300)

    text("Press Space bar to Start!", 530, 270)
  }

  // Stage 1 for game play 
  else if (stage == 1) {
    if (gamestart == true) {
      game = new Game();
      gamestart = false
    }
    image(bgimg, 0, 0);
    game.display();

  }

  // Stage 2 for red win
  else if (stage == 2) {
    fill(0, 0, 0)  
    textSize(25) 
    background(graybg)
    image(youwin, 0, 0, 1400, 720)
    image(redimg, 225, 170, 250, 300,)
    text("Press R to restart!", 600, 100)
  }

  // Stage 3 for blue win
  else if (stage == 3) {
    fill(0, 0, 0)  
    textSize(25) 
    background(graybg)
    image(youwin, 0, 0, 1400, 720)
    image(blueimg, 900, 170, 250, 300)
    text("Press R to retart!", 600, 100)
  }


}

class Player {
  constructor(x, y, r, g, dir, name, width, height, num_frames) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.radius = 35;
    this.g = g;
    this.dir = dir
    this.vx = 0
    this.vy = 0
    this.img_w = width;
    this.img_h = height;
    this.key_handler = { "left": false, "right": false, "UP": false, "DOWN": false };
    this.name = name;
    this.dead = false;
    this.lives = 5;
    this.frame = 0;
    this.num_frames = num_frames
    if (this.name == "player1") {
      this.img = p1img;
    }
    else if (this.name == "player2") {
      this.img = p2img;
    }
    this.shieldLast = 4
    this.grenadehit = false
    this.grenades = 4
    this.shieldeat = false
    this.shieldActive = false
    this.shield = false
  }

  display() {
    this.update();
    if (this.dir == "right") {
      image(this.img, this.x - Math.floor(this.img_w / 2), this.y - Math.floor(this.img_h / 2), this.img_w, this.img_h, this.frame * this.img_w, 0, this.img_w, this.img_h);
    }
    else if (this.dir == "left") {
      push();
      scale(-1, 1);
      image(this.img, -(this.x + Math.floor(this.img_w / 2)), this.y - Math.floor(this.img_h / 2), this.img_w, this.img_h, this.frame * this.img_w, 0, this.img_w, this.img_h);
      pop();
    }

    // if shield is eaten, it actives a Timer class. It also sets shield active to true
    if (this.shieldeat) {
      this.shielddelay = new Timer()
      this.shieldActive = true
      this.shieldeat = false
    }

    // when shield is eaten, it triggers this to be true and starts running the Timer. The shield active is set to false after 4 seconds (this.shieldLast = 4)
    if (this.shieldActive) {
      this.shielddelay.run()
      if (this.shielddelay.counter < this.shieldLast) {
        this.displayShield()
      }
      else if (this.shielddelay.counter >= this.shieldLast) {
        this.shieldActive = false
      }
    }
  }

  // gravity and friciton for smooth movements
  gravityftiction() {
    if (this.y + this.r >= this.g && this.grenadehit == false) {
      this.vy = 0
    }
    else {
      this.vy += 0.7
      if (this.y + this.r + this.vy > this.g) {
        this.vy = this.g - (this.y + this.r)
      }
    }

    for (let i = 0; i < game.platforms.length; i++) {
      let p = game.platforms[i];
      if (this.y + this.r <= p.y && this.x + this.r >= p.x && this.x - this.r <= p.x + p.w && this.key_handler["DOWN"] != true) {
        this.g = p.y
        break
      }
      else {
        this.g = game.g
      }
    }

    if (this.y + this.r == game.g) {
      this.dead = true
      this.respawn()
    }

    if (this.vx == 0) {
      this.vx = 0
      return
    }

    else if (this.vx > 0) {
      this.vx += -0.05 * this.vx
      return
    }

    else if (this.vx < 0) {
      this.vx += 0.05 * -this.vx
      return
    }
  }

  update() {
    this.gravityftiction();

    if (frameCount % 5 == 0 && this.vx != 0 && this.vy < 1 && this.key_handler["right"] == true) {
      this.frame = (this.frame + 1) % this.num_frames;
    }
    if (frameCount % 5 == 0 && this.vx != 0 && this.vy < 1 && this.key_handler["left"] == true) {
      this.frame = (this.frame + 1) % this.num_frames;
    }

    if (this.y + this.r == this.g) {
      this.isGrounded = true
      this.can_double_jump = true
    }
    else {
      this.isGrounded = false
    }
    if (this.key_handler["UP"] == true) {
      if (this.isGrounded == true) {
        this.vy = -12
        this.key_handler["UP"] = false
      } else {
        if (this.can_double_jump == true) {
          this.vy = -12
          this.can_double_jump = false
        }
      }
    }
    if (this.key_handler["left"] == true && this.vx > -7) {
      this.vx += - 1
      this.dir = "left"
    }
    else if (this.key_handler["right"] == true && this.vx < +7) {
      this.vx += 1
      this.dir = "right"
    }

    this.x += this.vx
    this.y += this.vy
  }

  // players respawn when they die
  respawn() {
    if (this.name == "player1") {
      this.x = 1100
      this.y = 100
      game.gun1 = new Weapons("gun1")
      this.lives -= 1
      this.vx = 0
      // this.shieldActive = true
    }

    else if (this.name == "player2") {
      this.x = 300
      this.y = 100
      game.gun2 = new Weapons("gun2")
      this.lives -= 1
      this.vx = 0
      // this.shieldActive = true
    }
  }

  displayShield() {
    push();
    noFill()
    stroke(153 + this.shielddelay.counter * 30, 51 + this.shielddelay.counter * 50, 255 + this.shielddelay.counter * 0)
    strokeWeight(6 - this.shielddelay.counter)
    ellipse(this.x, this.y, 100 - this.shielddelay.counter * 15, 100 - this.shielddelay.counter * 15)
    pop();
  }

}


class Grenade {
  constructor(x, y, dir, img_name, img_w, img_h) {
    this.x = x
    this.y = y
    this.dir = dir
    this.blastr = 100
    this.grcounter = 0
    this.vx = 0
    this.vy = -10
    this.r = 10 / 2
    this.g = game.g
    this.img = grenadeimg
    this.img_w = img_w
    this.img_h = img_h
    this.knockbackTotal = 30
    this.reductionRatio = 10
    this.grenadeSound = grenadesound
  }

  display() {
    image(this.img, this.x - Math.floor(this.img_w / 2), this.y - Math.floor(this.img_h / 2) - 2, this.img_w, this.img_h)
    this.update()
  }

  // Blast animation for explostion of grenade
  blastanimation() {
    push();
    stroke(0 + this.grcounter * 2, 0 + this.grcounter * 2, 0 + this.grcounter * 2)
    strokeWeight(5)
    noFill()
    if (this.grcounter < 100) {
      ellipse(this.x, this.y, 10 + this.grcounter, 6 + this.grcounter)
      this.grcounter += 5
      pop();
      return
    }

    game.blast_list.splice(this, 1)
    pop();
  }

  update() {
    this.parabolic()
    //moves left and right
    if (this.dir == "left") {
      this.vx = -10
    }
    else if (this.dir == "right") {
      this.vx = 10
    }
    this.x += this.vx
    this.y += this.vy
  }

  //For the parabolic motion of the grenades        
  parabolic() {
    if (this.y + this.r >= this.g) {
      this.vy = 0
    }
    else {
      this.vy += 0.7
      if (this.y + this.r + this.vy > this.g) {
        this.vy = this.g - (this.y + this.r)
      }
    }

    for (let p = 0; p < game.platforms.length; p++) {
      if (this.y + this.r <= game.platforms[p].y && this.x + this.r >= game.platforms[p].x && this.x - this.r <= game.platforms[p].x + game.platforms[p].w) {
        this.g = game.platforms[p].y
        break
      }
      else { this.g = game.g }
    }

    if (this.vx == 0) {
      this.vx = 0
      return
    }
    else if (this.dir == "right") {
      this.vx += -0.5 * this.vx
      return
    }

    else if (this.dir == "left") {
      this.vx += 0.5 * this.vx
      return
    }
  }

  // explode knocksback the player when they are in the proximity of the grenade explosion     
  // Uses to calculate the angle based on the coordinates of the player and grenade 
  // Knockback direction depends on the angle and power depends on the direction
  explode(x, y) {
    let dist = ((game.player1.x - x) ** 2 + (game.player1.y - y) ** 2) ** 0.5
    if (dist <= this.blastr && game.player1.shieldActive != true) {
      game.player1.grenadehit = true
      let dir = Math.atan2(game.player1.y - y, game.player1.x - x)
      game.player1.vy = (this.knockbackTotal - dist / this.reductionRatio) * Math.sin(dir)
      game.player1.vx = (this.knockbackTotal - dist / this.reductionRatio) * Math.cos(dir)
      game.player1.grenadehit = false
    }

    dist = ((game.player2.x - x) ** 2 + (game.player2.y - y) ** 2) ** 0.5;
    if (dist <= this.blastr && game.player2.shieldActive != true) {
      game.player2.grenadehit = true
      let dir = Math.atan2(game.player2.y - y, game.player2.x - x)
      game.player2.vy = (this.knockbackTotal - dist / this.reductionRatio) * Math.sin(dir)
      game.player2.vx = (this.knockbackTotal - dist / this.reductionRatio) * Math.cos(dir)
      game.player2.grenadehit = false
    }
  }
}


// Class for boster item generation and behavior     
class BoosterItem {
  constructor(platforms, img, name) {
    this.randomPlatform = 0
    this.randomXcoordinate = 0
    this.platforms = platforms
    this.randomPlatform = 0
    this.randomXcoordinate = 0
    this.randomYcoordinate = 0
    this.sizeofItem = 40
    if (name == "shield") {
      this.img = shieldimg
    }
    else if (name == "grenade") {
      this.img = grenadeimg
    }
    else if (name == "heart") {
      this.img = heartimg
    }
    // this.img = loadImage("/images/" + img)
    this.name = name
    this.numHeart = 0
    this.numGrenade = 0
    this.counterGrenade = 0
    this.counterHeart = 0
    this.numShield = 0
    this.counter = 0
    this.rateofSpawn_heart = 30
    this.rateofSpawn_grenade = 10
    this.ratioofSpawn_shield = 20
    this.item = itemsound
  }

  // chooses a random platform
  choosePlatform() {
    this.randomPlatform = random(this.platforms)
  }

  // #selects random x and y      
  selectXandY() {
    this.randomXcoordinate = Math.floor(random(this.randomPlatform.x, (this.randomPlatform.x + this.randomPlatform.w) - this.sizeofItem))
    this.randomYcoordinate = this.randomPlatform.y
  }

  generateItem() {
    this.choosePlatform()
    this.selectXandY()
  }

  // displays different images for each item   
  display() {
    image(this.img, this.randomXcoordinate, this.randomYcoordinate - this.sizeofItem, this.sizeofItem, this.sizeofItem)
    if (this.name == "heart") {
      this.gameplayHeart()
    }
    if (this.name == "grenade") {
      this.gameplayGrenade()
    }
    if (this.name == "shield") {
      this.gameplayShield()
    }
  }

  gameplayHeart() {

    if (game.tElapsed % this.rateofSpawn_heart == 0 && this.numHeart == 0 && game.tElapsed != 0) {
      this.numHeart = 1
      this.generateItem()
    }

    // when the player contacts heart item, it plays the sound live of player increases by 1                
    if (((game.player1.x - this.randomXcoordinate) ** 2 + (game.player1.y - this.randomYcoordinate) ** 2) ** 0.5 <= game.player1.r + this.sizeofItem && this.name == "heart") {
      game.heart.splice(game.heart.length - 1, 1)
      this.item.play()
      game.heart.push(new BoosterItem(game.platforms, "heart.png", "heart"))
      this.numHeart = 0
      game.player1.lives += 1
      game.player1lives.push(new HUD(1350 - (game.player1.lives - 1) * 20, 50, "life", "heart.png"))
      print(game.player1.lives)
    }

    // same for player2    
    if (((game.player2.x - this.randomXcoordinate) ** 2 + (game.player2.y - this.randomYcoordinate) ** 2) ** 0.5 <= game.player2.r + this.sizeofItem && this.name == "heart") {
      game.heart.splice(game.heart.length - 1)
      this.item.play()
      game.heart.push(new BoosterItem(game.platforms, "heart.png", "heart"))
      this.numHeart = 0
      game.player2.lives += 1
      game.player2lives.push(new HUD(50 + (game.player2.lives - 1) * 20, 50, "life", "heart.png"))
    }
  }

  gameplayGrenade() {

    if (game.tElapsed % this.rateofSpawn_grenade == 0 && this.numGrenade == 0 && game.tElapsed != 0) {
      this.numGrenade = 1
      this.generateItem()
    }

    // if player contacts grenade item, it gives player +1 grenade
    if (((game.player1.x - this.randomXcoordinate) ** 2 + (game.player1.y - this.randomYcoordinate) ** 2) ** 0.5 <= game.player1.r + this.sizeofItem && this.name == "grenade") {
      game.grenade.splice(game.grenade.length - 1, 1)
      this.item.play()
      game.grenade.push(new BoosterItem(game.platforms, "grenade.png", "grenade"))
      this.numGrenade = 0
      game.player1.grenades += 1
      game.player1grenades.push(new HUD(1350 - (game.player1.grenades - 1) * 20, 75, "grenade", "grenade.png"))
    }


    if (((game.player2.x - this.randomXcoordinate) ** 2 + (game.player2.y - this.randomYcoordinate) ** 2) ** 0.5 <= game.player2.r + this.sizeofItem && this.name == "grenade") {
      game.grenade.splice(game.grenade.length - 1, 1)
      this.item.play()
      game.grenade.push(new BoosterItem(game.platforms, "grenade.png", "grenade"))
      this.numGrenade = 0
      game.player2.grenades += 1
      game.player2grenades.push(new HUD(50 + (game.player2.grenades - 1) * 20, 75, "grenade", "grenade.png"))
    }
  }


  gameplayShield() {

    if (game.tElapsed % this.ratioofSpawn_shield == 0 && this.numShield == 0 && game.tElapsed != 0) {
      this.numShield = 1
      this.generateItem()
    }

    // if player contacts the shield item turns shieldeat to true, which actives the shieldActive flag to true and makes player invincible  
    if (((game.player1.x - this.randomXcoordinate) ** 2 + (game.player1.y - this.randomYcoordinate) ** 2) ** 0.5 <= game.player1.r + this.sizeofItem && this.name == "shield") {
      game.shield.splice(game.shield.length - 1, 1)
      this.item.play()
      game.shield.push(new BoosterItem(this.platforms, "shield.png", "shield"))
      this.numShield = 0
      game.player1.shieldeat = true
    }


    if (((game.player2.x - this.randomXcoordinate) ** 2 + (game.player2.y - this.randomYcoordinate) ** 2) ** 0.5 <= game.player2.r + this.sizeofItem && this.name == "shield") {
      game.shield.splice(game.shield.length - 1, 1)
      this.item.play()
      game.shield.push(new BoosterItem(this.platforms, "shield.png", "shield"))
      this.numShield = 0
      game.player2.shieldeat = true
    }
  }
}

// timer ticks counter every 60 frames (~1sec)                
class Timer {
  constructor() {
    this.counter = 0
  }

  run() {
    if (frameCount % 60 == 0) {
      this.counter += 1
    }
  }
}


//takes platform as input so that it spawns randomly on the platform        
class Crate {
  constructor(platforms, img, name) {
    this.randomPlatform = 0
    this.randomXcoordinate = 0
    this.platforms = platforms
    this.randomPlatform = 0
    this.randomXcoordinate = 0
    this.randomYcoordinate = 0
    this.sizeofCrate = 40
    this.img = crateimg
    this.name = name
    this.numCrate = 0
    this.rateofSpawn_crate = 25
    this.item = itemsound
  }
  //chooses a random platform
  choosePlatform() {
    this.randomPlatform = random(this.platforms)
  }
  //selects random x and y coordinates from the platform chosen
  selectXandY() {
    this.randomXcoordinate = Math.floor((this.randomPlatform.x, (this.randomPlatform.x + this.randomPlatform.w) - this.sizeofCrate))
    this.randomYcoordinate = this.randomPlatform.y
  }
  //generates the crate    
  generateCrate() {
    this.choosePlatform()
    this.selectXandY()
  }
  //display the crate    
  display() {
    image(this.img, this.randomXcoordinate, this.randomYcoordinate - this.sizeofCrate, this.sizeofCrate, this.sizeofCrate)
    this.gameplayCrate()
  }

  gameplayCrate() {
    //only generates one crate at a time according to the rate of spawn
    if (game.tElapsed % this.rateofSpawn_crate == 0 && this.numCrate == 0 && game.tElapsed != 0) {
      this.numCrate = 1
      this.generateCrate()
    }

    //when the player contacts the crate, it removes the crate, and generates a random weapon (sniper or assfultrifle)            
    if (((game.player1.x - this.randomXcoordinate) ** 2 + (game.player1.y - this.randomYcoordinate) ** 2) ** 0.5 <= game.player1.r + this.sizeofCrate && this.name == "crate") {
      game.crate.splice(game.crate.length - 1, 1)
      this.item.play()
      let gunchoice = random([1, 2])
      if (gunchoice == 1) {
        game.gun1 = new Weapons("gun1", "sniper.png")
      }
      else if (gunchoice == 2) {
        game.gun1 = new Weapons("gun1", "assaultr.png")
      }
      game.crate.push(new Crate(game.platforms, "crate.png", "crate"))
      this.numCrate = 0
    }

    //same code for player2
    if (((game.player2.x - this.randomXcoordinate) ** 2 + (game.player2.y - this.randomYcoordinate) ** 2) ** 0.5 <= game.player2.r + this.sizeofCrate && this.name == "crate") {
      game.crate.splice(game.crate.length - 1, 1)
      this.item.play()
      let gunchoice = random([1, 2])
      if (gunchoice == 1) {
        game.gun2 = new Weapons("gun2", "sniper.png")
      }
      else if (gunchoice == 2) {
        game.gun2 = new Weapons("gun2", "assaultr.png")
      }
      game.crate.push(new Crate(game.platforms, "crate.png", "crate"))
      this.numCrate = 0
    }
  }
}

class Game {
  constructor() {

    this.g = 900;

    this.player1 = new Player(1100, 100, 28, this.g, "left", "player1", 70, 60, 2);
    this.player2 = new Player(300, 100, 28, this.g, "right", "player2", 70, 60, 2);
    this.gun1 = new Weapons("gun1")
    this.gun2 = new Weapons("gun2")

    this.platforms = []
    this.grenade_list = []
    this.blast_list = []
    this.tElapsed = 0
    this.numCrate = 0
    this.numHeart = 0
    this.storePosition = []

    // calls the platform class and appends it into a list
    this.platforms.push(new Platform(175, 200, 250, 30))
    this.platforms.push(new Platform(975, 200, 250, 30))
    this.platforms.push(new Platform(325, 300, 250, 30))
    this.platforms.push(new Platform(825, 300, 250, 30))
    this.platforms.push(new Platform(100, 375, 200, 30))
    this.platforms.push(new Platform(1100, 375, 200, 30))
    this.platforms.push(new Platform(300, 450, 150, 30))
    this.platforms.push(new Platform(950, 450, 150, 30))
    this.platforms.push(new Platform(500, 525, 400, 30))
    this.platforms.push(new Platform(225, 600, 250, 30))
    this.platforms.push(new Platform(925, 600, 250, 30))

    this.shield = []
    this.shield.push(new BoosterItem(this.platforms, "shield.png", "shield"))
    this.storePosition = []

    this.player1lives = []
    this.player2lives = []

    for (let i = 0; i < this.player1.lives; i++) {
      this.player1lives.push(new HUD(1350 - i * 20, 50, "life", "heart.png"));
      this.player2lives.push(new HUD(50 + i * 20, 50, "life", "heart.png"));
    }

    this.player1grenades = []
    this.player2grenades = []
    for (let i = 0; i < this.player1.grenades; i++) { //i in range(this.player1.grenades)
      this.player2grenades.push(new HUD(50 + i * 20, 75, "grenade", "grenade.png"));
      this.player1grenades.push(new HUD(1350 - i * 20, 75, "grenade", "grenade.png"));
    }


    this.crate = []
    this.crate.push(new Crate(this.platforms, "crate.png", "crate"));
    this.heart = []
    this.heart.push(new BoosterItem(this.platforms, "heart.png", "heart"));
    this.grenade = []
    this.grenade.push(new BoosterItem(this.platforms, "grenade.png", "grenade"));
  }

  display() {
    // const d = new Date();
    let time2 = (new Date()).getTime() / 1000
    this.tElapsed = int(time2 - time1)

    for (let t = 0; t < this.crate.length; t++) {
      this.crate[t].display()
    }

    for (let t = 0; t < this.heart.length; t++) {
      this.heart[t].display()
    }

    for (let t = 0; t < this.grenade.length; t++) {
      this.grenade[t].display()
    }

    for (let t = 0; t < this.shield.length; t++) {
      this.shield[t].display()
    }

    for (let i = 0; i < this.platforms.length; i++) {
      this.platforms[i].display();
    }

    this.player1.display();
    this.gun1.display(this.player1.x, this.player1.y, this.player1.dir)

    this.player2.display();
    this.gun2.display(this.player2.x, this.player2.y, this.player2.dir)

    for (let t = 0; t < this.player1lives.length; t++) {
      this.player1lives[t].display()
      if (this.player1.dead == true) {
        this.player1.dead = false
        this.player1.shieldeat = true
        this.player1.shieldActive = true
        this.player1lives.splice(this.player1lives.length - 1, 1)
      }
    }

    for (let t = 0; t < this.player2lives.length; t++) {
      this.player2lives[t].display()
      if (this.player2.dead == true) {
        this.player2.dead = false;
        this.player2.shieldeat = true;
        this.player2.shieldActive = true;
        this.player2lives.splice(this.player2lives.length - 1, 1);
      }
    }

    for (let t = 0; t < this.player1grenades.length; t++) {
      this.player1grenades[t].display()
    }
    for (let t = 0; t < this.player2grenades.length; t++) {
      this.player2grenades[t].display()
    }

    // list_length = this.gun1.bullet_list.length;
    for (let t = 0; t < this.gun1.bullet_list.length; t++) {
      if (this.gun1.bullet_list[t].checkbullethit()) {
        if (this.player2.shieldActive != true) {
          if (this.gun1.bullet_list[t].dir == "left")
            this.player2.vx -= this.gun1.bullet_list[t].power
          if (this.gun1.bullet_list[t].dir == "right")
            this.player2.vx += this.gun1.bullet_list[t].power
        }
        this.gun1.bullet_list.splice(t, 1)
        continue;
      }
      this.gun1.bullet_list[t].display()
    }

    for (let t = 0; t < this.gun2.bullet_list.length; t++) {
      if (this.gun2.bullet_list[t].checkbullethit()) {
        if (this.player1.shieldActive != true) {
          if (this.gun2.bullet_list[t].dir == "left")
            this.player1.vx -= this.gun2.bullet_list[t].power
          if (this.gun2.bullet_list[t].dir == "right")
            this.player1.vx += this.gun2.bullet_list[t].power
        }
        this.gun2.bullet_list.splice(t, 1)
        continue;
      }
      this.gun2.bullet_list[t].display()
    }

    // Check for grenade hitting the ground 
    let list_length = this.grenade_list.length;
    for (let k = 0; k < list_length; k++) {

      if (this.grenade_list[k].y + this.grenade_list[k].r >= this.grenade_list[k].g) {
        // # this.gun1.grenade_list.remove(k)
        this.grenade_list[k].explode(this.grenade_list[k].x, this.grenade_list[k].y)
        this.grenade_list[k].grenadeSound.play()
        // this.grenade_list[k].grenadeSound.rewind()
        this.blast_list.push(this.grenade_list[k])
        // if (this.grenade_list.length > 0) {
        this.grenade_list.splice(k, 1)
        --k;
        --list_length;
        continue;
        // }
      }
      this.grenade_list[k].display()
    }

    for (let k = 0; k < this.blast_list.length; k++) {
      this.blast_list[k].blastanimation()
    }

    if (game.player1.lives == 0) {
      stage = 3
      return
    }
    else if (game.player2.lives == 0) {
      stage = 2
      return
    }

  }
}


class Platform {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.img = platimg;
  }

  display() {
    image(this.img, this.x, this.y, this.w, this.h)
  }
}


class Weapons {
  constructor(weapon, img_name = "pistol.png") {
    this.attack = { "shoot": false, "throw": false }
    this.bullet_list = []
    this.weapon = weapon
    this.img_name = img_name
    this.bulletcounter = 0

    //  Weapon properties for each gun, (rof = rate of fire)
    if (this.img_name == "pistol.png") {
      this.img = pistolimg
      this.img_w = 40
      this.img_h = 23
      this.power = 30
      this.rof = 9
      // infinite ammo for pistol
      this.ammo = -1
      this.sound = pistolsound
    }
    else if (this.img_name == "sniper.png") {
      this.img = sniperimg
      this.img_w = 100
      this.img_h = 35
      this.power = 56
      this.rof = 25
      this.ammo = 10
      this.sound = snipersound
    }
    else if (this.img_name == "assaultr.png") {
      this.img = arimg
      this.img_w = 60
      this.img_h = 28
      this.power = 9
      this.rof = 3
      this.ammo = 100
      this.sound = assaultrsound
    }

  }

  display(x, y, dir) {
    noFill()
    if (this.img_name == "pistol.png") {
      if (dir == "right") {
        image(this.img, x - Math.floor(this.img_w / 2) + 20, y - Math.floor(this.img_h / 2) - 2, this.img_w, this.img_h)
        // rect(x + 15, y - 5, 30, 1)
      }
      else if (dir == "left") {
        push();
        scale(-1, 1)
        image(this.img, - (x + Math.floor(this.img_w / 2) - 20), y - Math.floor(this.img_h / 2) - 2, this.img_w, this.img_h)
        pop();
        // rect(x - 30 - 15, y - 5, 30, 1)
      }
    }
    else if (this.img_name == "sniper.png") {

      if (dir == "right") {
        image(this.img, x - Math.floor(this.img_w / 2) + 20, y - Math.floor(this.img_h / 2) - 7, this.img_w, this.img_h)
        // rect(x + 15, y - 5, 30, 1)
      }
      else if (dir == "left") {
        push();
        scale(-1, 1)
        image(this.img, -(x + Math.floor(this.img_w / 2) - 20), y - Math.floor(this.img_h / 2) - 7, this.img_w, this.img_h)
        pop();
        // rect(x - 30 - 15, y - 5, 30, 1)
      }
    }
    else if (this.img_name == "assaultr.png") {
      if (dir == "right") {
        image(this.img, x - Math.floor(this.img_w / 2) + 20, y - Math.floor(this.img_h / 2) - 4, this.img_w, this.img_h)
        // rect(x + 15, y - 5, 30, 1)
      }
      else if (dir == "left") {
        push();
        scale(-1, 1);
        image(this.img, -(x + Math.floor(this.img_w / 2) - 20), y - Math.floor(this.img_h / 2) - 4, this.img_w, this.img_h)
        pop();
        // rect(x - 30 - 15, y - 5, 30, 1)
      }
    }



    // Bullets appended to a list when created
    if (this.attack["shoot"] == true && (frameCount % this.rof == 0 || this.bullet_list.length == 0)) {
      this.sound.play() //CHANGE
      if (dir == "right") {
        // x, y, rof, power, dir, weapon, img_name, img_w, img_h
        this.bullet_list.push(new Bullet(x + 15, y - 6, 1, this.power, dir, this.weapon, "bullet.png", 11, 4))
      }
      if (dir == "left") {
        this.bullet_list.push(new Bullet(x - 30 - 15, y - 6, 1, this.power, dir, this.weapon, "bullet.png", 11, 4))
      }
      this.bulletcounter += 1
    }

    if (this.bulletcounter == this.ammo) {
      if (this.weapon == "gun1") {
        game.gun1 = new Weapons("gun1")
      }
      if (this.weapon == "gun2") {
        game.gun2 = new Weapons("gun2")
      }
    }

    // Bullets removed from the list when they leave the coundary of the window (saves memory and makes game faster) 
    for (let t = 0; t < this.bullet_list.length; t++) {
      if (this.bullet_list[t].x < 0 || this.bullet_list[t].x > WIDTH) { this.bullet_list.splice(t, 1) }
    }


    if (this.attack["throw"] == true && this.weapon == "gun1" && frameCount % 7 == 0 && game.player1.grenades > 0) {
      try {
        game.player1grenades.splice(game.player1grenades.length - 1, 1)
        game.grenade_list.push(new Grenade(x + 15, y - 5, dir, "grenade.png", 20, 20))
        game.player1.grenades -= 1
      }
      catch {
        pass
      }
    }


    if (this.attack["throw"] == true && this.weapon == "gun2" && frameCount % 7 == 0 && game.player2.grenades > 0) {
      try {
        game.player2grenades.splice(game.player2grenades.length - 1, 1)
        game.grenade_list.push(new Grenade(x + 15, y - 5, dir, "grenade.png", 20, 20))
        game.player2.grenades -= 1
      }
      catch {
        pass
      }
    }
  }
}

//bullet has rof, power, direction properties
class Bullet {
  constructor(x, y, rof, power, dir, weapon, img_name, img_w, img_h) {
    this.x = x
    this.y = y
    this.power = power
    this.dir = dir
    this.vx = 20
    this.img = bulletimg
    this.img_w = img_w
    this.img_h = img_h
    this.weapon = weapon
  }

  update() {
    if (this.dir == "right") {
      this.x += this.vx;
    }
    if (this.dir == "left") {
      this.x -= this.vx;
    }
  }

  display() {
    push();
    stroke(0, 255, 0)
    strokeWeight(5)
    fill(0, 255, 0)
    image(this.img, this.x - Math.floor(this.img_w / 2) + 20, this.y - Math.floor(this.img_h / 2) - 5, this.img_w, this.img_h)
    // ellipse(this.x, this.y, 5, 5)
    this.update()
    pop();
  }

  // Checks bullet collision with player
  checkbullethit() {
    if (((game.player1.x - this.x) ** 2 + (game.player1.y - this.y) ** 2) ** 0.5 <= game.player1.r && this.weapon == "gun2") {
      return true;
    }
    if (((game.player2.x - this.x) ** 2 + (game.player2.y - this.y) ** 2) ** 0.5 <= game.player2.r && this.weapon == "gun1") {
      return true;
    }
  }
}

// Hud to display player health, grenades and ammo
class HUD {
  constructor(x, y, name, img) {
    this.lives = 5
    this.x = x
    this.y = y
    this.name = name
    this.w = 20
    this.h = 20
    if (this.name == "life") {
      this.img = heartimg
    }
    else if (this.name == "grenade") {
      this.img = grenadeimg
    }

  }

  display() {
    push();
    noStroke();
    if (this.name == "life")
      image(this.img, this.x, this.y, this.w, this.h);

    pop();

    if (this.name == "grenade")
      image(this.img, this.x, this.y, this.w, this.h);

    //Ammo counter display
    fill(255, 255, 255);
    textSize(15);
    let ammodisp2 = game.gun2.ammo - game.gun2.bulletcounter;
    if (ammodisp2 <= -1)
      ammodisp2 = "inf";
    text(str(ammodisp2), 50, 115);


    let ammodisp1 = game.gun1.ammo - game.gun1.bulletcounter
    if (ammodisp1 <= -1)
      ammodisp1 = "inf";
    text(str(ammodisp1), 1350, 115);
  }

}

function keyPressed() {
  // global stage, gamestart  
  if (stage == 1) {
    if (key == "a")
      game.player2.key_handler["left"] = true
    else if (key == "d")
      game.player2.key_handler["right"] = true
    else if (key == "w")
      game.player2.key_handler["UP"] = true
    else if (key == "s")
      game.player2.key_handler["DOWN"] = true
    else if (key == "c")
      game.gun2.attack["shoot"] = true
    else if (key == "v")
      game.gun2.attack["throw"] = true
    else if (keyCode == LEFT_ARROW)
      game.player1.key_handler["left"] = true
    else if (keyCode == RIGHT_ARROW)
      game.player1.key_handler["right"] = true
    else if (keyCode == UP_ARROW)
      game.player1.key_handler["UP"] = true
    else if (keyCode == DOWN_ARROW)
      game.player1.key_handler["DOWN"] = true
    else if (key == "/")
      game.gun1.attack["shoot"] = true
    else if (key == ".")
      game.gun1.attack["throw"] = true
  }
  // Space for game start
  else if (stage == 0 && key == " ") {
    stage = 1
    gamestart = true
  }
  // R for game restart
  else if (key == "r" && (stage == 2 || stage == 3)) {
    stage = 0
    gamestart = true
  }

}

function keyReleased() {
  if (stage == 1) {
    if (key == "a")
      game.player2.key_handler["left"] = false
    else if (key == "d")
      game.player2.key_handler["right"] = false
    else if (key == "w")
      game.player2.key_handler["UP"] = false
    else if (key == "s")
      game.player2.key_handler["DOWN"] = false
    else if (key == "c")
      game.gun2.attack["shoot"] = false
    else if (key == "v")
      game.gun2.attack["throw"] = false
    else if (keyCode == LEFT_ARROW)
      game.player1.key_handler["left"] = false
    else if (keyCode == RIGHT_ARROW)
      game.player1.key_handler["right"] = false
    else if (keyCode == UP_ARROW)
      game.player1.key_handler["UP"] = false
    else if (keyCode == DOWN_ARROW)
      game.player1.key_handler["DOWN"] = false
    else if (key == "/")
      game.gun1.attack["shoot"] = false
    else if (key == ".")
      game.gun1.attack["throw"] = false
  }
}


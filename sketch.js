const GAME_STATE = {
  GAME_START: 0,
  GAME_RUN: 1,
  GAME_END: 2,
  GAME_CHOOSE_CHAR: 3
};

// module aliases
var Engine = Matter.Engine,
  World = Matter.World,
  Bodies = Matter.Bodies,
  Events = Matter.Events,
  Body = Matter.Body;

var engine, world;

// state of the game
var state;

// state loading
var loading = true;;
var counter = 0;

// state highscore
var highscore;

// player components
var playerAlive;
var playerSensor;
var playerHead;
var playerBody;
var playerHeadHit;

// platform position
var base_ground;
var grounds;
var ground_x;
var ground_y;
var ground_w;

// powerup
var powerups;
var powerupCollide;

// monster flying
var mobs_flying;

// monster ball / sun
var mobs_ball;

// monster ground
var mobs_ground;

// status to jump
var playerOnFloor;

// score
var score;
var tempscore;
var textPosY;

// images
var spritePlayer;
var spriteFront;
var spriteFront_p1;
var spriteFront_p2;
var spriteFront_p3;
var spriteWalkImgs_p1 = [];
var spriteWalkImgs_p2 = [];
var spriteWalkImgs_p3 = [];
var spriteMobBall = [];
var spriteMobBallSpace = [];
var spritePlatform = [];
var spritePowerup;
var spriteMobFlying = [];
var spriteBackground1;
var spriteBackground2;
var spriteBackground3;
var spriteBackground4;
var spriteMobGround;

// used image
var usedImgPlatform;
var usedImgMobBall;

// sounds
var songs = [];
var jumpSound;
var startSound;
var runSound;
var boostSound;
var collisionSound;
var pressAnyKeySound;
var HeadHitSound;
var totalSong = 8;
var startSoundState = false;
var failSelectCharacter;

// animation
var current_frame_player;
var current_frame_mobfly;
var current_frame_mobball;
var tStart;
var tEnd;
var dTime;
var tDuration;

// list of category for filter collision
var monsterCategory,
  powerupCategory,
  playerCategory,
  platformCategory;

// engine gravity
var gravity;

var clickStatus = true;

// function loadTheSound(index, filename) {
//   soundFormats('wav');
//   loadSound(filename, soundLoaded);
//
//   function soundLoaded(sound) {
//     songs[index] = sound;
//     counter++;
//     if (counter == totalSong) {
//       loading = false;
//     }
//   }
// }

function preload() {
  soundFormats('wav');
  // sprite powerup
  spritePowerup = loadImage('assets/powerup/powerup_jetpack.png');
  // sprite background
  spriteBackground1 = loadImage('assets/backgrounds/background-1.png');
  spriteBackground2 = loadImage('assets/backgrounds/background-2.png');
  spriteBackground3 = loadImage('assets/backgrounds/background-3.png');
  spriteBackground4 = loadImage('assets/backgrounds/background-4.png');
  // sprite ground
  for (var i = 0; i <= 5; i++) {
    spritePlatform[i] = loadImage('assets/platforms/ground' + i + '.png');
  }
  // sprite monster
  // sprite monster ground
  spriteMobGround = loadImage('assets/enemies/springMan_stand.png');
  // sprite monster flying
  for (var i = 0; i <= 2; i++) {
    spriteMobFlying.push(loadImage('assets/enemies/flyMan_fly' + i + '.png'));
  }
  // sprite monster sun
  for (var i = 1; i <= 2; i++) {
    spriteMobBall.push(loadImage('assets/enemies/sun' + i + '.png'));
  }
  // sprite monster sun space
  for (var i = 3; i <= 4; i++) {
    spriteMobBallSpace.push(loadImage('assets/enemies/sun' + i + '.png'));
  }

  // player sprite
  // sprite player stand
  spriteFront_p1 = loadImage('assets/player/p1_front.png');
  spriteFront_p2 = loadImage('assets/player/p2_front.png');
  spriteFront_p3 = loadImage('assets/player/p3_front.png');

  // sprite player 1 walk
  for (var i = 1; i <= 11; i++) {
    spriteWalkImgs_p1.push(loadImage('assets/player/p1_walk/p1_walk' + i + '.png'));
  }

  // sprite player 2 walk
  for (var i = 1; i <= 11; i++) {
    spriteWalkImgs_p2.push(loadImage('assets/player/p2_walk/p2_walk' + i + '.png'));
  }

  // sprite player 3 walk
  for (var i = 1; i <= 11; i++) {
    spriteWalkImgs_p3.push(loadImage('assets/player/p3_walk/p3_walk' + i + '.png'));
  }

  for (var i = 0; i < totalSong; i++) {
    songs[i] = loadSound('assets/sounds/' + i + '.wav');
  }

  // for (var i = 0; i < totalSong; i++) {
  //   loadTheSound(i, 'assets/sounds/' + i + '.wav');
  // }

}

function setup() {
  // create a canvas
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  // game state
  state = GAME_STATE.GAME_START;

  spritePlayer = spriteWalkImgs_p1;
  spriteFront = spriteFront_p1;

  boostSound = songs[0];
  runSound = songs[1];
  pressAnyKeySound = songs[2];
  startSound = songs[3];
  collisionSound = songs[4];
  jumpSound = songs[5];
  HeadHitSound = songs[6];
  failSelectCharacter = songs[7];

  boostSound.setVolume(0.5);
  runSound.setVolume(0.3);
  runSound.setLoop(true);
  jumpSound.setVolume(0.5);
  startSound.setVolume(0.4);
  startSound.setLoop(true);
  pressAnyKeySound.setVolume(0.3);

  textFont('serif');
  textStyle(BOLD);

  resetSketch();
}

function draw() {
  // loop the engine
  Engine.update(engine);

  if (state == GAME_STATE.GAME_START) {
    start_screen();
  } else if (state == GAME_STATE.GAME_RUN) {
    run();
  } else if (state == GAME_STATE.GAME_END) {
    dead_screen();
  } else if (state == GAME_STATE.GAME_CHOOSE_CHAR) {
    choose_char();
  }
}

function resetSketch() {
  // initialize everything
  // and also reseting the sketch

  // create an engine
  engine = Engine.create();
  // create engine world
  world = engine.world;

  // gravity
  gravity = engine.world.gravity;

  // web storage
  if (localStorage.highscore == undefined) {
    localStorage.highscore = 0;
  }

  // initialize empty array
  grounds = [];
  powerups = [];
  mobs_flying = [];
  mobs_ball = [];
  mobs_ground = [];

  // initialize the image that used in platform
  usedImgPlatform = spritePlatform[round(random(0, 1))];

  // initialize highscore state
  highscore = false;

  // initialize that player alive
  playerAlive = true;
  playerHeadHit = false;

  // initialize the position of the first platform (not the base platform)
  ground_y = 450;

  // initialize state of powerup collision
  powerupCollide = false;

  // initialize state that player is on floor
  playerOnFloor = false;

  // initialize the position of the score text
  textPosY = 30;

  // animation
  current_frame_player = 0;
  current_frame_mobfly = 0;
  current_frame_mobball = 0;
  tDuration = 0;

  // initialize category for collision
  monsterCategory = 0x0001;
  powerupCategory = 0x0002;
  platformCategory = 0x0004;
  playerCategory = 0x0032;

  // make the rect mode at the center
  rectMode(CENTER);
  imageMode(CENTER);

  // make player
  player = new Player(50, 540, PLAYER_WIDTH, PLAYER_HEIGHT, spriteFront, spritePlayer);

  // initialize score
  score = 0;

  // make base ground
  base_ground = new Platform(width / 2, 600, 500, 75, usedImgPlatform);

  // make grounds randomly
  grounds.push(base_ground);
  for (var i = 0; i < GROUND_LENGTH; i++) {
    ground_x = random(100, 300);
    ground_w = random(100, 150);
    grounds.push(new Platform(ground_x, ground_y, ground_w, GROUND_HEIGHT, usedImgPlatform));
    // keep the Y position above the screen
    ground_y -= 160;
  }
  tStart = millis();
}

function falling() {
  return (player.body.position.y > grounds[0].y + 200 || grounds.length < 3);
}

function boost() {
  let force = (-PLAYER_JUMP * player.body.mass * 1.5);
  Body.applyForce(player.body, player.body.position, {
    x: 0,
    y: force
  });
  boostSound.play();
}

// state game running
function run() {
  // list of collision events
  Event();

  if (!runSound.isPlaying()) {
    startSound.stop();
    runSound.play();
    runSound.setVolume(0.3);
  }

  // background image
  background(175);
  if (score <= 10) {
    image(spriteBackground1, width / 2, height / 2, 480, 600);
  } else if (score <= 20) {
    image(spriteBackground2, width / 2, height / 2, 480, 600);
  } else {
    image(spriteBackground4, width / 2, height / 2, 480, 600);
  }

  // prevent player move across the screen.
  if (player.body.position.x > width) {
    player.body.position.x = width;
  } else if (player.body.position.x < 0) {
    player.body.position.x = 0;
  }

  // scroll the screen to top
  if (player.body.position.y < 100) {
    translate(0, -player.body.position.y + 300);
    textSize(32);
    text(score, 30, player.body.position.y - width / 2 - 20);
  } else {
    textSize(32);
    text(score, 30, textPosY);
  }

  // falling
  if (falling()) {
    playerAlive = false;
  }

  // dead state
  if (!playerAlive) {
    tempscore = score;
    runSound.stop();
    collisionSound.play();
    noLoop();
    setTimeout(function() {
      state = GAME_STATE.GAME_END;
      loop();
    }, 1000);
  }

  // make the platform randomly when another platform deleted
  if (grounds.length < GROUND_LENGTH) {
    var spawnnableGroundObject = true;
    ground_x = random(100, 300);
    ground_w = random(100, 150);

    if (score <= 10) {
      usedImgPlatform = spritePlatform[round(random(0, 1))];
    } else if (score <= 20) {
      usedImgPlatform = spritePlatform[round(random(2, 3))];
    } else if (score <= 30) {
      usedImgPlatform = spritePlatform[round(random(4, 5))];
    }
    // make the ground
    grounds.push(new Platform(ground_x, ground_y, ground_w, GROUND_HEIGHT, usedImgPlatform));
    // if random number is greater than powerup chance,
    // and powerup only can appear 1 in the screen,
    // make the powerup.
    // make sure to write from the biggest chance to the smallest one.
    if (random(0, 100) > PU_CHANCE && powerups.length < 1 && spawnnableGroundObject) {
      powerups.push(new PowerUp(ground_x + random(-10, 10), ground_y - 35, 30, 30, spritePowerup));
      spawnnableGroundObject = false;
    }
    // level 3 monster, only can appear 1 in the map
    // the position is above the ground
    if (random(0, 100) > MOB_GROUND_CHANCE && mobs_ground.length < 1 && score > 20 && spawnnableGroundObject) {
      mobs_ground.push(new Mob_Ground(ground_x + random(-15, 15), ground_y - 30, MONSTER_GROUND_W, MONSTER_GROUND_H));
      spawnnableGroundObject = false;
    }
    // keep the Y position above the screen
    ground_y -= 160;
  }

  // show the monster ground
  for (var i = 0; i < mobs_ground.length; i++) {
    mobs_ground[i].show();
    // if off screen, remove
    if (mobs_ground[i].isOffScreen() || playerHeadHit) {
      if (playerHeadHit) {
        HeadHitSound.play();
      }
      mobs_ground[i].removeFromWorld();
      mobs_ground.splice(i, 1);
      playerHeadHit = false;
    }
  }

  // show the platform
  for (var k = 0; k < grounds.length; k++) {
    grounds[k].show();
    if (grounds[k].isOffScreen()) {
      grounds[k].removeFromWorld();
      grounds.splice(k, 1);
      k--;
      score++;
    }
  }

  // show the powerup
  for (var k = 0; k < powerups.length; k++) {
    powerups[k].show();
    if (powerups[k].isOffScreen() || powerupCollide) {
      if (powerupCollide) {
        boost();
      }
      powerups[k].removeFromWorld();
      powerups.splice(k, 1);
      powerupCollide = false;
    }
  }

  // show the player
  player.show();
  // make the player can jumpThru the platform
  player.jumpThru();

  // monster flying
  if (mobs_flying.length < 1) {
    mobs_flying.push(new Mob_Flying(-50, player.body.position.y - random(250, 400), MONSTER_FLYING_W, MONSTER_FLYING_H));
  }

  // monster ball
  if (mobs_ball.length < 1 && score > 10) {
    if (score <= 20) {
      usedImgMobBall = spriteMobBall;
    } else {
      usedImgMobBall = spriteMobBallSpace;
    }
    mobs_ball.push(new Mob_Ball(random(50, 400), player.body.position.y - 450, MONSTER_SUN_DIAMETER, MONSTER_SUN_DIAMETER, usedImgMobBall));
  }

  // show the monster ball
  for (var i = 0; i < mobs_ball.length; i++) {
    mobs_ball[i].show();
    mobs_ball[i].forceGravity();
    // if off screen, remove
    if (mobs_ball[i].isOffScreen()) {
      mobs_ball[i].removeFromWorld();
      mobs_ball.splice(i, 1);
    }
  }

  // show the monster flying
  for (var i = 0; i < mobs_flying.length; i++) {
    mobs_flying[i].show();
    mobs_flying[i].move(MONSTER_FLYING_DX);
    mobs_flying[i].flying();
    // if off screen, remove
    if (mobs_flying[i].isOffScreen()) {
      mobs_flying[i].removeFromWorld();
      mobs_flying.splice(i, 1);
    }
  }

  // animation
  tEnd = millis();
  dTime = tEnd - tStart;
  tDuration += dTime;
  if (tDuration > 150) {
    current_frame_player++;
    current_frame_mobfly++;
    current_frame_mobball++;
    if (current_frame_player >= spriteWalkImgs_p1.length) {
      current_frame_player = 0;
    }
    if (current_frame_mobfly >= spriteMobFlying.length) {
      current_frame_mobfly = 0;
    }
    if (current_frame_mobball >= spriteMobBall.length) {
      current_frame_mobball = 0;
    }
    tDuration = 0;
  }
  tStart = millis();

  // set the stop condition
  if (player.body.velocity.x > 0 && player.body.velocity.x < 0.15) {
    player.walk_r = false;
    player.walk_l = false;
  } else if (player.body.velocity.x < 0 && player.body.velocity.x > -0.15) {
    player.walk_r = false;
    player.walk_l = false;
  }

  // key to move left and right
  if (playerAlive) {
    //player.checkOnFloor();
    if (keyIsDown(LEFT_ARROW)) {
      //Body.setVelocity(player.body, {x: -PLAYER_SPEED, y: player.body.velocity.y});
      player.move(-PLAYER_SPEED);
      player.walk_r = false;
      player.walk_l = true;
      // player.walk = true;
    } else if (keyIsDown(RIGHT_ARROW)) {
      //Body.setVelocity(player.body, {x: PLAYER_SPEED, y: player.body.velocity.y});
      player.move(PLAYER_SPEED);
      player.walk_r = true;
      player.walk_l = false;
      // player.walk = true;
    }
  }
}

function start_screen() {
  background(51);
  // if (loading) {
  //   stroke(255);
  //   noFill();
  //   rect(width / 2, height / 2, 200, 20);
  //
  //   noStroke();
  //   fill(255, 100);
  //   var w = 200 * counter / totalSong;
  //   rect(width / 2, height / 2, mouseX, 20)
  //
  // } else {
  // startSoundState prevent the sound keep looping.
  if (!startSound.isPlaying() && !startSoundState) {
    startSound.play();
    startSoundState = true;
  }
  background(175);
  image(spriteBackground3, width / 2, height / 2);
  textAlign(CENTER);
  textSize(32);
  fill(255);
  text("NJUMPLING", width / 2, 50);
  text(`Highscore: ${localStorage.highscore}`, width / 2, height / 2 - 50);
  text('Press ` To Select Character', width / 2, height / 2);
  text('Press Any Key to Start', width / 2, height / 2 + 50);
  //}
}

function choose_char() {
  // startSoundState prevent the sound keep looping.
  if (!startSound.isPlaying() && !startSoundState) {
    startSound.play();
    startSoundState = true;
  }
  background(175);
  image(spriteBackground3, width / 2, height / 2);
  textAlign(CENTER);
  textSize(30);
  fill(255);
  text("Choose Character", width / 2, 50);
  text("Press The Number", width / 2, 100);
  textSize(20);
  // show the number how to choose
  text("1", width / 2 - 150, height / 2 - 75);
  text("2", width / 2, height / 2 - 75);
  text("3", width / 2 + 150, height / 2 - 75);
  // show the image character
  image(spriteFront_p1, width / 2 - 150, height / 2);
  text("Default", width / 2 - 150, height / 2 + 75);
  image(spriteFront_p2, width / 2, height / 2);
  image(spriteFront_p3, width / 2 + 150, height / 2);
  if (localStorage.highscore >= 100) {
    fill(255);
    text("Unlocked", width / 2, height / 2 + 75);
    text("Unlocked", width / 2 + 150, height / 2 + 75);
  } else if (localStorage.highscore >= 50) {
    fill(255);
    text("Unlocked", width / 2, height / 2 + 75);
    fill(175);
    text("100 Highscore", width / 2 + 150, height / 2 + 75);
  } else {
    fill(175);
    text("50 Highscore", width / 2, height / 2 + 75);
    text("100 Highscore", width / 2 + 150, height / 2 + 75);
  }
}

function dead_screen() {
  if (!startSound.isPlaying() && !collisionSound.isPlaying() && !startSoundState) {
    runSound.stop();
    startSoundState = true;
    startSound.play();
  }
  background(175);
  image(spriteBackground3, width / 2, height / 2);
  textSize(32);
  fill(255);
  if (score > localStorage.highscore) {
    highscore = true;
  }
  text('Game Over', width / 2, 50);
  if (highscore) {
    text('New Highscore!', width / 2, height / 2 - 50);
    localStorage.highscore = score;
  } else {
    text(`Highscore: ${localStorage.highscore}`, width / 2, height / 2 - 50);
  }
  text(`Your Score: ${score}`, width / 2, height / 2);
  text('Press Any Key To Play Again', width / 2, height / 2 + 50);
}

function keyPressed() {
  // clickStatus prevent the player click double.
  if (state == GAME_STATE.GAME_START && clickStatus) {
    // game start state
    if (keyCode == 192) {
      pressAnyKeySound.play();
      state = GAME_STATE.GAME_CHOOSE_CHAR;
    } else {
      OnPressMenu(GAME_STATE.GAME_RUN);
    }
  } else if (state == GAME_STATE.GAME_END && clickStatus) {
    // game over state
    OnPressMenu(GAME_STATE.GAME_RUN);
  } else if (state == GAME_STATE.GAME_RUN) {
    // game run state
    if (keyCode == 32 && playerOnFloor) {
      //Body.setVelocity(player.body, {x: player.body.velocity.x, y: PLAYER_JUMP - 12});
      player.jump(-PLAYER_JUMP);
      jumpSound.play();
    }
  } else if (state == GAME_STATE.GAME_CHOOSE_CHAR) {
    // select character state
    if (keyCode == 49) {
      pressAnyKeySound.play();
      spritePlayer = spriteWalkImgs_p1;
      spriteFront = spriteFront_p1;
      state = GAME_STATE.GAME_START;
    } else if (keyCode == 50) {
      if (localStorage.highscore >= 50) {
        // play success sound, then change the assets, then go back to game start
        pressAnyKeySound.play();
        spritePlayer = spriteWalkImgs_p2;
        spriteFront = spriteFront_p2;
        state = GAME_STATE.GAME_START;
      } else {
        // play fail sound
        failSelectCharacter.play();
      }
    } else if (keyCode == 51) {
      if (localStorage.highscore >= 100) {
        // play success sound, then change the assets, then go back to game start
        pressAnyKeySound.play();
        spritePlayer = spriteWalkImgs_p3;
        spriteFront = spriteFront_p3;
        state = GAME_STATE.GAME_START;
      } else {
        // play fail sound
        failSelectCharacter.play();
      }
    }
  }
}

function OnPressMenu(gs) {
  clickStatus = false;
  pressAnyKeySound.play();
  startSound.stop();
  setTimeout(function() {
    resetSketch();
    state = gs;
    startSoundState = false;
    clickStatus = true;
  }, 1000);
}

function Event() {
  Events.on(engine, 'collisionStart', function(event) {
    var pairs = event.pairs;
    for (var i = 0; i < pairs.length; i++) {
      var pair = pairs[i];
      // do something here if collision
      if (pair.bodyA.label == "player_label" && pair.bodyB.label == "PowerUp_label") {
        powerupCollide = true;
      } else if (pair.bodyA == playerHead && pair.bodyB.label == "mob_ground_label") {
        playerHeadHit = true;
      } else if (pair.bodyA.label == "player_label" && pair.bodyB.label == "mob_flying_label") {
        playerAlive = false;
        if (jumpSound.isPlaying()) {
          jumpSound.stop();
        }
      } else if (pair.bodyA.label == "player_label" && pair.bodyB.label == "mob_ball_label") {
        playerAlive = false;
        if (jumpSound.isPlaying()) {
          jumpSound.stop();
        }
      } else if (pair.bodyA.label == "player_label" && pair.bodyB.label == "mob_ground_label") {
        playerAlive = false;
        if (HeadHitSound.isPlaying()) {
          HeadHitSound.stop();
        }
        if (jumpSound.isPlaying()) {
          jumpSound.stop();
        }
      }
    }
  })

  Events.on(engine, 'collisionActive', function(event) {
    var pairs = event.pairs;
    for (var i = 0; i < pairs.length; i++) {
      var pair = pairs[i];
      if (pair.bodyA == playerSensor && pair.bodyB.label == "ground_label") {
        playerOnFloor = true;
        player.body.velocity.y = 0;
      }
    }
  })

  Events.on(engine, 'collisionEnd', function(event) {
    var pairs = event.pairs;
    for (var i = 0; i < pairs.length; i++) {
      var pair = pairs[i];
      if (pair.bodyA == playerSensor && pair.bodyB.label == "ground_label") {
        playerOnFloor = false;
      }
    }
  })
}

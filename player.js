function Player(x, y, w, h, img, spriteWalk) {

  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.img = img;
  // this.walk = false;
  this.walk_l = false;
  this.walk_r = false;

  var options = {
    restitution: 0,
    friction: 0.5,
    inertia: Infinity,
    label: "player_label",
  };
  // player head
  playerHead = Bodies.rectangle(this.x, this.y - 28, w + 5, 6, {
    isSensor: true,
    label: "playerHeadSensor_label"
  });
  // player body
  playerBody = Bodies.rectangle(this.x, this.y, this.w, this.h, options);
  // player sensor
  playerSensor = Bodies.rectangle(50, 565, w, 6, {
    isSensor: true,
    label: "playerSensor",
    friction: 0.3
  });
  // combie the body and sensor
  this.body = Body.create({
    parts: [playerHead, playerBody, playerSensor],
    friction: 0.0002,
    collisionFilter: {
      mask: monsterCategory | powerupCategory | platformCategory,
      category: playerCategory
    }
  });

  World.add(world, this.body);

  var pos = this.body.position;

  this.show = function() {
    // make the image bigger than the rectangle size
    if (this.walk_r) {
      push();

      scale(1, 1);
      image(spriteWalk[current_frame_player], pos.x, pos.y, this.w + 5, this.h + 5);
      //rect(pos.x, pos.y, this.w, this.h);

      pop();
    } else if (this.walk_l) {
      push();

      // flip the image in X Axis
      // have to transform the pos.x into negative
      // because the whole X, become negative after scaling.
      scale(-1.0, 1.0);
      image(spriteWalk[current_frame_player], pos.x * -1, pos.y, this.w + 5, this.h + 5);
      // rect(pos.x, pos.y, this.w, this.h);

      pop();
    } else {
      push();

      scale(1, 1);
      // must pos, so that the object take the physic effect.
      // rect(pos.x, pos.y, this.w, this.h);
      image(this.img, pos.x, pos.y, this.w + 5, this.h + 5);

      pop();
    }
  }

  this.jumpThru = function() {
    // if jump
    if (this.body.velocity.y < 0) {
      this.body.collisionFilter.mask = monsterCategory | powerupCategory;
    } else { // if down
      this.body.collisionFilter.mask = monsterCategory | powerupCategory | platformCategory;
    }
  }

  this.move = function(vel) {
    let force = (vel * this.body.mass);
    Body.applyForce(this.body, this.body.position, {
      x: force,
      y: 0
    });
  }

  // this.checkOnFloor = function(){
  //   if(this.body.velocity.y != 0){
  //     playerOnFloor = false;
  //   } else {
  //     playerOnFloor = true;
  //   }
  // }

  this.jump = function(vel) {
    let force = (vel * this.body.mass);
    Body.applyForce(this.body, this.body.position, {
      x: 0,
      y: force
    });
  }
}

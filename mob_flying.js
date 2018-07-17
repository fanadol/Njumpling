function Mob_Flying(x, y, w, h) {

  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.dy = 0.0005;
  this.vy = 0;

  var options = {
    restitution: 0,
    friction: 0.5,
    inertia: Infinity,
    label: "mob_flying_label",
    density: 0.002,
    collisionFilter: {
      mask: playerCategory,
      category: monsterCategory
    }
  }

  // make the rectangle smaller than the image
  this.body = Bodies.rectangle(this.x, this.y, this.w - 5, this.h - 5, options);
  World.add(world, this.body);

  var pos = this.body.position;

  this.show = function() {
    push();

    image(spriteMobFlying[current_frame_mobfly], pos.x, pos.y, this.w, this.h);

    pop();
  }

  this.move = function(vel) {
    let force = (vel * this.body.mass) + random(0.001, 0.0005);
    Body.applyForce(this.body, this.body.position, {
      x: force,
      y: 0
    });
  }

  this.flying = function() {
    this.vy += this.dy;
    let force_gravity = -this.body.mass * gravity.y * gravity.scale + this.vy;
    Body.applyForce(this.body, this.body.position, {
      x: 0,
      y: force_gravity
    });
    if (this.vy > 0.004 || this.vy < -0.004) {
      this.dy *= -1;
    }
  }

  this.isOffScreen = function() {
    return (pos.x > width + 50 || pos.y > player.body.position.y + 450);
  }

  this.removeFromWorld = function() {
    World.remove(world, this.body);
  }
}

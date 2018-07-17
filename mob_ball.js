function Mob_Ball(x, y, w, h, img) {

  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.img = img;

  var options = {
    label: "mob_ball_label",
    collisionFilter: {
      mask: playerCategory,
      category: monsterCategory
    }
  }

  this.body = Bodies.rectangle(this.x, this.y, this.w - 5, this.h - 5, options);
  World.add(world, this.body);

  var pos = this.body.position;

  this.show = function() {
    push();

    image(this.img[current_frame_mobball], pos.x, pos.y, this.w, this.h);

    pop();
  }

  this.isOffScreen = function() {
    return (pos.y > player.body.position.y + 450);
  }

  this.removeFromWorld = function() {
    World.remove(world, this.body);
  }

  this.forceGravity = function() {
    let force_gravity = -this.body.mass * gravity.y * gravity.scale * 0.8;
    Body.applyForce(this.body, this.body.position, {
      x: 0,
      y: force_gravity
    });
  }
}

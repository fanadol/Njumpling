function Mob_Ground(x, y, w, h) {

  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;

  var options = {
    isStatic: true,
    label: "mob_ground_label",
    density: 0.002,
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

    image(spriteMobGround, pos.x, pos.y, this.w, this.h);

    pop();
  }

  this.isOffScreen = function() {
    return (pos.x > width + 50 || pos.y > player.body.position.y + 400);
  }

  this.removeFromWorld = function() {
    World.remove(world, this.body);
  }
}

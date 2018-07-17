function PowerUp(x, y, w, h, img) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.img = img;

  var options = {
    isStatic: true,
    label: "PowerUp_label",
    collisionFilter: {
      mask: playerCategory,
      category: powerupCategory
    }
  };

  this.body = Bodies.rectangle(this.x, this.y, this.w, this.h, options);
  World.add(world, this.body);

  var pos = this.body.position;

  this.show = function() {
    push();

    image(this.img, pos.x, pos.y, this.w, this.h);

    pop();
  }

  this.isOffScreen = function() {
    return (this.y > player.body.position.y + 450);
  }

  this.removeFromWorld = function() {
    World.remove(world, this.body);
  }

}

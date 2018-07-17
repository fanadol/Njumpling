function Platform(x, y, w, h, img) {

  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.img = img;

  var options = {
    isStatic: true,
    restitution: 0,
    friction: 0,
    label: "ground_label",
    collisionFilter: {
      category: platformCategory
    }
  };

  this.body = Bodies.rectangle(this.x, this.y, this.w, this.h, options);
  World.add(world, this.body);

  var pos = this.body.position;

  this.show = function() {
    // make this transformation independent
    // save the state
    push();
    // must pos, so that the object take the physic effect.
    //rect(pos.x, pos.y, this.w, this.h);
    image(this.img, pos.x, pos.y, this.w - 5, this.h - 5);
    // restore the state
    // so you can use another transformation in the next object
    pop();
  }

  this.isOffScreen = function() {
    return (this.y > player.body.position.y + 450);
  }

  this.removeFromWorld = function() {
    World.remove(world, this.body);
  }
}

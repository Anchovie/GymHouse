function Particle(x, y, hue, firework) {
  this.pos = createVector(x, y);
  this.firework = firework;
  this.lifespan = 255;
  this.hue = hue;

  if (this.firework) {
    this.vel = createVector(random(-0.4,0.4), random(-11, -8));
  } else {
    this.vel = p5.Vector.random2D();
    this.vel.mult(random(3, 11));
  }
  this.acc = createVector(0, 0);

  this.applyForce = function(force) {
    this.acc.add(force);
  }

  this.update = function() {
    if (!this.firework) {
      this.vel.mult(0.85);
      this.lifespan -= 2;
    }
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);


  }

  this.done = function() {
    if (this.lifespan < -20) {
      return true;
    } else {
      return false;
    }
  }

  this.draw = function() {
    colorMode(HSB);
    if (!this.firework) {
      // strokeWeight(6);
      // stroke(this.hue, 15, 70, 0.1);
      // point(this.pos.x, this.pos.y);
      strokeWeight(3);
      stroke(this.hue, 255, 255, this.lifespan);
    } else {
      strokeWeight(5);
      stroke(this.hue, 255, 255);
    }
    point(this.pos.x, this.pos.y);
  }

}

var gravity;
var fireworks = [];

function setup() {
  createCanvas(400, 300);
  colorMode(HSB);
  gravity = createVector(0, 0.2);
  stroke(255);
  strokeWeight(4);
  background(0);
}

function draw() {
  colorMode(RGB);
  background(0, 0, 0, 40); //25
  //background(0);
  if (random(1) < 0.05 && fireworks.length < 8) {
    fireworks.push(new Rocket());
  }
  for (var i = fireworks.length - 1; i >= 0; i--) {
    fireworks[i].update();
    fireworks[i].draw();
    if (fireworks[i].done()) {
      fireworks.splice(i, 1);
    }
  }
  noStroke();
  fill(5, 5, 5);
  textSize(30);
  textFont('Consolas');
  textStyle(BOLD);
  text("   UNDER", 132, 130);
  text("CONSTRUCTION", 87, 158);

}


function Particle(x, y, radius) {
  this.init(x, y, radius);
}
Particle.prototype = {
  init: function (x, y, radius) {
    this.alive = true;
    this.radius = radius;
    this.theta = random(TWO_PI);
    this.drag = 0.92;
    this.color = '#fff';
    this.x = x || 0.0;
    this.y = y || 0.0;
    this.vx = 0.0;
    this.vy = 0.0;
  },
  move: function () {
    this.x += this.vx;
    this.y += this.vy;
    this.vx *= this.drag;
    this.vy *= this.drag;
    this.theta += random(-0.1, 0.1);
    this.vx += sin(this.theta) * 0.5;
    this.vy += cos(this.theta) * 0.5;
    this.radius *= 0.995;
    this.alive = this.radius > 0.7;
  },
  draw: function (ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, TWO_PI);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
};
var MAX_PARTICLES = 700;
var COLOURS = ['white', 'lightblue'];
var particles = [];
var pool = [];

var canvasContainer = getComputedStyle(document.getElementById('sketch-container'));
var width = parseInt(canvasContainer.getPropertyValue('width'), 10);
var height = parseInt(canvasContainer.getPropertyValue('height'), 10);

var demo = Sketch.create({
  container: document.getElementById('sketch-container'),
  retina: 'auto',
  fullscreen: false,
  width: width,
  height: height+34
});
demo.spawn = function (x, y) {
  var particle, theta, force;
  if (particles.length >= MAX_PARTICLES)
    pool.push(particles.shift());
  particle = pool.length ? pool.pop() : new Particle();
  particle.init(x, y, 4);
  particle.wander = random(0.5, 2.0);
  particle.color = random(COLOURS);
  particle.drag = random(0.1, 0.6);
  theta = random(TWO_PI);
  force = random(0, 0);
  particle.vx = sin(theta) * force;
  particle.vy = cos(theta) * force;
  particles.push(particle);
};
demo.update = function () {
  var i, particle;
  for (i = particles.length - 1; i >= 0; i--) {
    particle = particles[i];
    if (particle.alive) particle.move();
    else pool.push(particles.splice(i, 1)[0]);
  }
};
demo.draw = function () {
  demo.globalCompositeOperation = 'lighter';
  for (var i = particles.length - 1; i >= 0; i--) {
    particles[i].draw(demo);
  }
};
demo.mousemove = function () {
  var particle, theta, force, touch, max, i, j, n;
  for (i = 0, n = demo.touches.length; i < n; i++) {
    touch = demo.touches[i], max = random(2, 3);
    for (j = 0; j < max; j++) {
      demo.spawn(touch.x, touch.y);
    }
  }
};

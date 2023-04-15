
const { VerletPhysics2D, VerletParticle2D, VerletSpring2D } = toxi.physics2d;

const { GravityBehavior } = toxi.physics2d.behaviors;

const { Vec2D, Rect } = toxi.geom;

let physics;

class Particle extends VerletParticle2D {
  constructor(x, y) {
    super(x, y);
    this.r = 2;
    physics.addParticle(this);
  }

  show() {
    fill(0);
    circle(this.x, this.y, this.r * 2);
  }
}

class Spring extends VerletSpring2D {
  constructor(a, b, strength) {
    let length = dist(a.x, a.y, b.x, b.y);
    super(a, b, length, strength);
    physics.addSpring(this);
  }

  show() {
    stroke(0, 50);
    line(this.a.x, this.a.y, this.b.x, this.b.y);
  }
}



class Shape {
  particles;
  springs;
  colorR;
  colorG;
  colorB;
  
 constructor(numParticles, radius, centerX, centerY, colorR = 255, colorG = 255, colorB = 255) {
    this.particles = [];
    this.springs = [];
    this.colorR = colorR;
    this.colorG = colorG;
    this.colorB = colorB;
    

    for (let i = 0; i < numParticles; i++) {
      // Calculate the angle between each particle
      const angle = (i / numParticles) * 2 * Math.PI;

      // Calculate the x and y coordinates of the particle
      const particleX = centerX + radius * Math.cos(angle);
      const particleY = centerY + radius * Math.sin(angle);

      // Add the particle's coordinates to the array
      this.particles.push(new Particle(particleX, particleY));
    }

    for (let i = 0; i < numParticles - 1; i++){
      this.springs.push(new Spring(this.particles[i], this.particles[i+1], 0.01));

    }
    this.springs.push(new Spring(this.particles[numParticles - 1], this.particles[0], 0.01));


    for (let i = 0; i < numParticles; i++){
      if (i % 2 == 0)
      this.springs.push(new Spring(this.particles[i], this.particles[(i + 5) % numParticles], 0.01));
      
      this.springs.push(new Spring(this.particles[i], this.particles[(i + 4) % numParticles], 0.01));
      
       this.springs.push(new Spring(this.particles[i], this.particles[(i + 6) % numParticles], 0.01));
    }
  }

  show() {
    fill(0);
    stroke(this.colorR, this.colorG, this.colorB);
    strokeWeight(2);
    beginShape();
    for (let particle of this.particles) {
      vertex(particle.x, particle.y);
    }
    endShape(CLOSE);
    
//     for (let particle of this.particles) {
//       particle.show();
//     }

//     for (let spring of this.springs) {
//       spring.show();
//     }
  }
}

let shapes = [];

// check for collisions between two shapes
function checkCollisions(shape1, shape2) {
  for (let i = 0; i < shape1.particles.length; i++) {
    for (let j = 0; j < shape2.particles.length; j++) {
      const particle1 = shape1.particles[i];
      const particle2 = shape2.particles[j];
      const distance = dist(particle1.x, particle1.y, particle2.x, particle2.y);
      const minDistance = particle1.r + particle2.r; // assuming particles have radius r
      if (distance < minDistance) {
        // calculate the minimum distance the particles need to be moved
        const overlap = minDistance - distance;
        const dx = (particle2.x - particle1.x) / distance;
        const dy = (particle2.y - particle1.y) / distance;
        const moveX = dx * overlap / 2;
        const moveY = dy * overlap / 2;
        // move the particles
        particle1.x -= moveX * 3;
        particle1.y -= moveY * 3;
        particle2.x += moveX * 3;
        particle2.y += moveY * 3;
        // adjust the spring length if the particles are connected by springs
        for (let k = 0; k < shape1.springs.length; k++) {
          const spring = shape1.springs[k];
          if (spring.a === particle2 || spring.b === particle2) {
            spring.setRestLength(distance);
          }
        }
      }
    }
  }
}



function setup() {
  createCanvas(windowWidth - 20, windowHeight - 20);

  physics = new VerletPhysics2D();

  let bounds = new Rect(0, 0, width, height);
  physics.setWorldBounds(bounds);
  
  
  
  shapes.push(new Shape(40,40,300,150));
  shapes.push(new Shape(40,40,150,200, 255, 0, 0));
  shapes.push(new Shape(40,40,350,350, 255, 0, 0));
  shapes.push(new Shape(40,40,450,450, 255, 0, 0));
  shapes.push(new Shape(40,40,600,600, 255, 0, 0));
  shapes.push(new Shape(40,40,800,700, 255, 0, 0));
  shapes.push(new Shape(40,40,800,600, 255, 0, 0));
  shapes.push(new Shape(40,40,200,350, 255, 0, 0));
  
  
  // for (let i = 0; i < 10; i++){
  //   shapes.push(new Shape(40,40,Math.random() * 100,Math.random() * 100, 255, 0, 0));
  // }
  
  console.log(Math.random());

}

function draw() {
  background(0);

  physics.update();
  for (let i = 0; i < shapes.length; i++){
    for (let j = 0; j < shapes.length; j++){
      if (i != j){
        checkCollisions(shapes[i], shapes[j]);
      }
      
    }
  }
  

  
  for (let shape of shapes){
    shape.show();
  }

  shapes[0].particles[0].lock();
  
  let dx = mouseX - shapes[0].particles[0].x;
  let dy = mouseY - shapes[0].particles[0].y;
  let distance = Math.sqrt(dx*dx + dy*dy);
  
  // Calculate the particle's new position based on its current position and the mouse cursor's position
  let speed = 2; // You can adjust the speed of movement here
  if (distance > 0) {
    shapes[0].particles[0].x += dx / distance * speed;
    shapes[0].particles[0].y += dy / distance * speed;
  }
  
  shapes[0].particles[0].unlock();

  if (mouseIsPressed) {
    shapes[0].particles[0].lock();
    shapes[0].particles[0].x = mouseX;
    shapes[0].particles[0].y = mouseY;
    shapes[0].particles[0].unlock();
  }
  
}

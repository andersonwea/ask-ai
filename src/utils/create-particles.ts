import p5types from 'p5'

export class Particle {
  pos: p5types.Vector
  vel: p5types.Vector
  acc: p5types.Vector
  w: number
  color: number[]

  constructor(p: p5types) {
    this.pos = window.p5.Vector.random2D().mult(202)
    this.vel = p.createVector(0, 0)
    this.acc = this.pos.copy().mult(p.random(0.0001, 0.00001))

    this.w = p.random(3, 5)

    this.color = [p.random(200, 255), p.random(200, 255), p.random(200, 255)]
  }

  update(cond: boolean) {
    this.vel.add(this.acc)
    this.pos.add(this.vel)

    if (cond) {
      this.pos.add(this.vel)
      this.pos.add(this.vel)
      this.pos.add(this.vel)
    }
  }

  edges(p: p5types) {
    if (
      this.pos.x < -p.width / 2 ||
      this.pos.x > p.width / 2 ||
      this.pos.y < -p.height ||
      this.pos.y > p.height / 2
    ) {
      return true
    } else {
      return false
    }
  }

  show(p: p5types) {
    p.noStroke()
    p.fill(this.color)
    p.ellipse(this.pos.x, this.pos.y, this.w)
  }
}

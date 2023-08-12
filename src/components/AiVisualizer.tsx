import p5types, { SoundFile, FFT, Image } from 'p5'
import Sketch from 'react-p5'
import 'p5/lib/addons/p5.sound'
import { Particle } from '../utils/create-particles'

interface AiVisuzlizerProps {
  audioFile: File | undefined
  onFileChange: (value: File | undefined) => void
}

let fft: FFT
let song: SoundFile | undefined
let image: Image
let amp: number

const particles: Particle[] = []

let tryLoadSound: NodeJS.Timer

export function AiVisualizer({ audioFile, onFileChange }: AiVisuzlizerProps) {
  function preload(p: p5types) {
    if (!image) {
      image = p.loadImage('src/assets/generative_art.jpg')
    }

    console.log('dentro do preload', audioFile)
    if (audioFile) {
      song = p.loadSound(audioFile)
      onFileChange(undefined)
      clearInterval(tryLoadSound)
    }
  }

  function setup(p: p5types, canvasParentRef: Element) {
    p.createCanvas(p.windowWidth, p.windowHeight).parent(canvasParentRef)

    fft = new window.p5.FFT(0.3)
    p.angleMode('degrees')
    p.imageMode('center')
    p.rectMode('center')
    image.filter('blur', 12)
  }

  function mousePressed(p: p5types) {
    if (!song) preload(p)

    let pausedIn: number
    let duration: number

    setTimeout(() => {
      if (song && song.isLoaded()) {
        duration = song.duration()
        if (song.isPlaying()) {
          pausedIn = song.currentTime()
          song.pause()
          p.noLoop()
        } else {
          song.jump(pausedIn, duration)
          song.play()
          p.loop()
        }
      }
    }, 1000)
  }

  function keyPressed(p: p5types) {
    if (p.keyCode === p.ENTER) {
      if (song && song?.isLoaded()) {
        song?.stop()
        song = undefined
      }

      tryLoadSound = setInterval(() => {
        preload(p)
      }, 1000)
    }
  }

  function draw(p: p5types) {
    p.background(0)
    p.translate(p.width / 2, p.height / 3)

    fft.analyze()
    amp = fft.getEnergy(20, 200)

    p.push()
    if (amp > 230) {
      p.rotate(p.random(-0.5, 0.5))
    }
    p.image(image, 0, 0, p.width + 100, p.height + 500)
    p.pop()

    const alpha = p.map(amp, 0, 255, 180, 150)
    p.fill(0, alpha)
    p.noStroke()
    p.rect(0, 0, p.width, p.height + 500)

    p.stroke(255)
    p.strokeWeight(3)
    p.noFill()

    fft.analyze()
    amp = fft.getEnergy(20, 200)

    const wave = fft.waveform()

    for (let t = -1; t <= 1; t += 2) {
      p.beginShape()
      for (let i = 0; i < 182; i += 0.5) {
        const index = p.floor(p.map(i, 0, 182, 0, wave.length - 1))

        const r = p.map(wave[index], -1, 1, 100, 300)

        const x = r * p.sin(i) * t
        const y = r * p.cos(i)
        p.vertex(x, y)
      }
      p.endShape()
    }

    const par = new Particle(p)
    particles.push(par)

    for (let i = particles.length - 1; i >= 0; i--) {
      if (!particles[i].edges(p)) {
        particles[i].update(amp > 230)
        particles[i].show(p)
      } else {
        particles.splice(i, 1)
      }
    }
  }

  return (
    <Sketch
      setup={setup}
      draw={draw}
      preload={preload}
      mousePressed={mousePressed}
      keyPressed={keyPressed}
    />
  )
}

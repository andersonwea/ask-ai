import p5types, { SoundFile, FFT, Image } from 'p5'
import Sketch from 'react-p5'
import 'p5/lib/addons/p5.sound'
import { Particle } from '../utils/create-particles'
import { useEffect, useState } from 'react'

interface AiVisualizerProps {
  audioFile: File | undefined
  onPlay: (value: boolean) => void
  onLoad: (value: boolean) => void
  onFileChange: (value: File | undefined) => void
}

let fft: FFT
let song: SoundFile | undefined
let image: Image
let amp: number

const particles: Particle[] = []

let tryLoadSound: NodeJS.Timer

export function AiVisualizer({
  audioFile,
  onFileChange,
  onPlay,
  onLoad,
}: AiVisualizerProps) {
  const [isMobile, setIsMobile] = useState<boolean>()

  function preload(p: p5types) {
    if (!image) {
      image = p.loadImage('src/assets/generative_art.jpg')
    }
    if (audioFile) {
      song = p.loadSound(audioFile, () => {
        onFileChange(undefined)
        clearInterval(tryLoadSound)
        onLoad(true)
      })
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

  function mouseClicked(p: p5types) {
    if (!song) return preload(p)

    if (song && song.isPlaying()) {
      onPlay(false)
      song.pause()
      p.noLoop()
    } else {
      onPlay(true)
      song.play()
      p.loop()
    }
  }

  function keyPressed(p: p5types) {
    if (p.keyCode === p.ENTER) {
      if (song && song?.isLoaded()) {
        song?.stop()
        song = undefined
      }
    }
  }

  function windowResized(p: p5types) {
    const width = window.innerWidth

    if (width < 640) {
      setIsMobile(true)
    } else {
      setIsMobile(false)
    }

    const canvasParentRef = window.document.querySelector(
      '[data-testid="react-p5"]',
    )
    if (canvasParentRef) {
      p.createCanvas(p.windowWidth, p.windowHeight).parent(canvasParentRef)
    }
  }

  useEffect(() => {
    const width = window.innerWidth

    if (width < 640) {
      setIsMobile(true)
    } else {
      setIsMobile(false)
    }
  }, [])

  function draw(p: p5types) {
    p.background(0)
    p.translate(p.width / 2, p.height / 3)

    fft.analyze()
    amp = fft.getEnergy(20, 200)

    p.push()
    if (amp > 230) {
      p.rotate(p.random(-0.5, 0.5))
    }
    p.image(image, 0, 0, p.width + 100, p.height + 330)
    p.pop()

    const alpha = p.map(amp, 0, 255, 180, 150)
    p.fill(0, alpha)
    p.noStroke()
    p.rect(0, 0, p.width, p.height + 330)

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

        let r: number

        if (isMobile) {
          r = p.map(wave[index], -1, 1, 50, 250)
        } else {
          r = p.map(wave[index], -1, 1, 100, 300)
        }

        const x = r * p.sin(i) * t
        const y = r * p.cos(i)
        p.vertex(x, y)
      }
      p.endShape()
    }

    if (song && song.isPlaying()) {
      const par = new Particle(p, isMobile)

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
  }

  return (
    <Sketch
      setup={setup}
      draw={draw}
      preload={preload}
      mouseClicked={mouseClicked}
      keyPressed={keyPressed}
      windowResized={windowResized}
    />
  )
}

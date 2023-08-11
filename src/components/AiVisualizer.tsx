import p5types, { SoundFile, FFT, Image } from 'p5'
import Sketch from 'react-p5'
import 'p5/lib/addons/p5.sound'

interface AiVisuzlizerProps {
  audioFile: File | undefined
}

let fft: FFT
let song: SoundFile
let image: Image
let amp

export function AiVisualizer({ audioFile }: AiVisuzlizerProps) {
  function preload(p: p5types) {
    image = p.loadImage('src/assets/generative_art.jpg')
  }

  function setup(p: p5types, canvasParentRef: Element) {
    const cvn = p
      .createCanvas(p.windowWidth, p.windowHeight)
      .parent(canvasParentRef)

    cvn.mousePressed(() => {
      setTimeout(() => {
        if (song.isLoaded()) {
          if (song.isPlaying()) {
            song.pause()
            p.noLoop()
          } else {
            song.play()
            p.loop()
          }
        }
      }, 500)
    })

    fft = new window.p5.FFT()
    p.angleMode('degrees')
    p.imageMode('center')
    p.rectMode('center')
    image.filter('blur', 12)
  }

  function getSound(p: p5types) {
    p.soundFormats('wav')
    song = p.loadSound(audioFile, (sound: any) => sound)
  }

  function mousePressed(p: p5types) {
    getSound(p)
  }

  function draw(p: p5types) {
    p.background(0)

    p.translate(p.width / 2, p.height / 3)

    p.image(image, 0, 0, p.width, p.width)

    fft.analyze()
    amp = fft.getEnergy(20, 200)

    const alpha = p.map(amp, 0, 255, 180, 150)
    p.fill(0, alpha)
    p.noStroke()
    p.rect(0, 0, p.width, p.height + 500)

    p.stroke(255)
    p.strokeWeight(3)
    p.noFill()

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
  }

  return (
    <Sketch
      setup={setup}
      draw={draw}
      preload={preload}
      mousePressed={mousePressed}
    />
  )
}

import p5types from 'p5'
import Sketch from 'react-p5'

export function AiVisualizer() {

  function setup(p5: p5types, canvasParentRef: Element) {
    const cvn = p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(canvasParentRef)
    return cvn
  }

  function draw(p5: p5types) {
    p5.background(0)
  }

  return <Sketch setup={setup} draw={draw} />
}
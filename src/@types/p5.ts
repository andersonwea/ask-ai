import p5Types from 'p5'

export interface P5 extends p5Types {
  loadSound: (path: string | File) => p5Types.SoundFile
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import 'p5/index'

declare module 'p5/index' {
  export interface p5InstanceExtensions {
    loadSound: (path: any) => SoundFile
  }
}

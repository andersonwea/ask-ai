import { useEffect, useState } from 'react'
import { AiVisualizer } from './components/AiVisualizer'
import { fecthAudioFromUrl } from './utils/fetch-audio-from-url'

export function App() {
  // const [audioUrl, setAudioUrl] = useState<string>()
  const [audioFile, setAudioFile] = useState<File>()


  async function getAudioUrl() {
    const audioUrl = 'http://localhost:3333/data/output.wav'

    const audio = await fecthAudioFromUrl(audioUrl)
    setAudioFile(audio)

  }

  useEffect(() => {
    getAudioUrl()
  }, [])

  if(!audioFile) return null

  return (
    <main className='flex flex-col items-center'>
      
      <AiVisualizer audioFile={audioFile}/>
      <form className='absolute bottom-[100px]'>
        <div className='border-zinc-600 w-[600px] p-4 border-2 focus-within:border-blue-500 rounded-lg'>
          <input
          
            className='border-none bg-transparent w-full focus:outline-none text-zinc-100'
            placeholder='Escreva'
          />
        </div>

      </form>
    </main>
  )
}


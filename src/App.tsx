import { FormEvent, useEffect, useState } from 'react'
import { AiVisualizer } from './components/AiVisualizer'
import { fecthAudioFromUrl } from './utils/fetch-audio-from-url'
import { api } from './lib/api'
import { useForm } from 'react-hook-form'

type TextFormData = {
  text: string
}

interface TextGeneration {
  output: string
  costInCents: number
}

export function App() {
  const [textGeneration, setTextGeneration] = useState<TextGeneration>()
  // const [audioUrl, setAudioUrl] = useState<string>()
  const [audioFile, setAudioFile] = useState<File>()

  const { register, setValue, handleSubmit } = useForm<TextFormData>()

  async function handleTextGeneration(data: TextFormData) {
    const { text } = data
    try {
      const response = await api.post('/text-generation', { text })
    
      setTextGeneration(response.data)
      setValue('text', '')
    } catch (err) {
      console.error(err)
    }
  }
  console.log(textGeneration)

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
      <form className='absolute bottom-[100px]' onSubmit={handleSubmit(handleTextGeneration)}>
        <div className='border-zinc-600 w-[600px] p-4 border-2 focus-within:border-blue-500 rounded-lg'>
          <input
            {...register('text')}
            className='border-none bg-transparent w-full focus:outline-none text-zinc-100'
            placeholder='Escreva'
          />
        </div>

      </form>
    </main>
  )
}


import { useState } from 'react'
import { AiVisualizer } from './components/AiVisualizer'
import { fecthAudioFromUrl } from './utils/fetch-audio-from-url'
import { api } from './lib/api'
import { useForm } from 'react-hook-form'

type TextFormData = {
  text: string
}

export function App() {
  // const [audioUrl, setAudioUrl] = useState<string>()
  const [audioFile, setAudioFile] = useState<File | undefined>()

  const { register, setValue, handleSubmit } = useForm<TextFormData>()

  async function getAudioUrl(text: string) {
    const response = await api.post('/text-to-speech', { text })
    const { audioUrl } = response.data

    const audio = await fecthAudioFromUrl(audioUrl)
    setAudioFile(audio)
  }

  async function handleTextGeneration(data: TextFormData) {
    const { text } = data
    try {
      const response = await api.post('/text-generation', { text })
      setValue('text', '')
      await getAudioUrl(response.data.output)
    } catch (err) {
      console.error(err)
    }
  }

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


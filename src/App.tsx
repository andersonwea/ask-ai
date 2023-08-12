import { useState } from 'react'
import { AiVisualizer } from './components/AiVisualizer'
import { api } from './lib/api'
import { useForm } from 'react-hook-form'
import { fecthAudioFromUrl } from './utils/fetch-audio-from-url'

type SearchFormData = {
  search: string
}

type SearchVideo = {
  videoUrl: string
}

type AudioFromVideo = {
  audioUrl: string
}

export function App() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [notFound, setNotFound] = useState<boolean>()
  const [audioFile, setAudioFile] = useState<File | undefined>()

  const { register, setValue, handleSubmit } = useForm<SearchFormData>()

  async function getAudioFromVideo(videoUrl: string) {
    try {
      const response = await api.post<AudioFromVideo>('/get-audio-from-video', {
        videoUrl,
      })

      const { audioUrl } = response.data

      return audioUrl
    } catch (err) {
      console.error(err)
    }
  }

  async function handleSearchMusic(data: SearchFormData) {
    const { search } = data
    setValue('search', '')
    setAudioFile(undefined)

    try {
      setIsLoading(true)
      const response = await api.post<SearchVideo>('/search-video', { search })

      const { videoUrl } = response.data

      const audioUrl = await getAudioFromVideo(videoUrl)

      if (!audioUrl) {
        return setNotFound(true)
      }

      const audioFile = await fecthAudioFromUrl(audioUrl)

      return setAudioFile(audioFile)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  function onFileChange(value: File | undefined) {
    setAudioFile(value)
  }

  return (
    <main className="flex flex-col items-center">
      <AiVisualizer audioFile={audioFile} onFileChange={onFileChange} />

      {isLoading && (
        <p className="absolute text-zinc-100 bottom-[200px]">carregando...</p>
      )}
      <form
        className="absolute bottom-[100px]"
        onSubmit={handleSubmit(handleSearchMusic)}
      >
        <div className="border-zinc-600 w-[600px] p-4 border-2 focus-within:border-blue-500 rounded-lg">
          <input
            {...register('search')}
            required
            className="border-none bg-transparent w-full focus:outline-none text-zinc-100"
            placeholder="Escreva"
          />
        </div>
      </form>
    </main>
  )
}

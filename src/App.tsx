import { useState } from 'react'
import { AiVisualizer } from './components/AiVisualizer'
import { api } from './lib/api'
import { useForm } from 'react-hook-form'
import { fecthAudioFromUrl } from './utils/fetch-audio-from-url'
import { ThreeDots } from 'react-loader-spinner'

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
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
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

  function onPlay(value: boolean) {
    setIsPlaying(value)
  }
  console.log(audioFile, isPlaying)

  return (
    <main className="flex flex-col items-center">
      <AiVisualizer
        audioFile={audioFile}
        onFileChange={onFileChange}
        onPlay={onPlay}
      />

      {isLoading && (
        <div className="absolute text-zinc-100 bottom-[200px]">
          <ThreeDots
            height={80}
            width={80}
            radius={9}
            color="#7112c3"
            ariaLabel="três pontos carregando"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        </div>
      )}

      {audioFile && !isPlaying && (
        <p className="absolute bottom-[230px] font-default text-3xl text-transparent bg-gradient-to-r from-blue-500 to-purple-500 font-extrabold bg-clip-text max-sm:text-2xl">
          Pressione a tela para tocar...
        </p>
      )}
      <form
        className="absolute bottom-[100px] w-[600px] max-sm:w-[350px]"
        onSubmit={handleSubmit(handleSearchMusic)}
      >
        <div className="border-zinc-600 z-10 flex w-full  p-4 border-2 focus-within:border-blue-500 rounded-lg">
          <input
            {...register('search')}
            required
            className="border-none bg-transparent flex-auto w-full focus:outline-none text-zinc-100"
            placeholder="Escreva"
          />
        </div>
      </form>
    </main>
  )
}

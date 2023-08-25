import { useState } from 'react'
import { AiVisualizer } from './components/AiVisualizer'
import { api } from './lib/api'
import { useForm } from 'react-hook-form'
import { fetchAudioFromUrl } from './utils/fetch-audio-from-url'
import { AudioFromVideo, SearchFormData, SearchVideo } from './@types/types'
import { Loading } from './components/Loading'
import { IsError } from './components/IsError'
import { SendHorizontal } from 'lucide-react'

export function App() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [isError, setIsError] = useState<boolean>(false)
  const [isMusicLoaded, setIsMusicLoaded] = useState<boolean>(false)
  const [audioFile, setAudioFile] = useState<File | undefined>()

  const {
    register,
    setValue,
    formState: { isSubmitting },
    handleSubmit,
  } = useForm<SearchFormData>()

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
    setIsMusicLoaded(false)
    setIsError(false)

    try {
      const response = await api.post<SearchVideo>('/search-video', { search })

      const { videoUrl } = response.data

      const audioUrl = await getAudioFromVideo(videoUrl)

      const audioFile = await fetchAudioFromUrl(audioUrl)

      if (!audioFile) {
        throw new Error()
      }

      setAudioFile(audioFile)
      setIsMusicLoaded(true)
    } catch (err) {
      console.error(err)
      return setIsError(true)
    }
  }

  function onFileChange(value: File | undefined) {
    setAudioFile(value)
  }

  function onPlay(value: boolean) {
    setIsPlaying(value)
  }

  function onLoad(value: boolean) {
    setIsMusicLoaded(value)
  }

  return (
    <main className="flex flex-col items-center">
      <AiVisualizer
        audioFile={audioFile}
        onFileChange={onFileChange}
        onPlay={onPlay}
        onLoad={onLoad}
      />

      {isSubmitting && <Loading />}

      {isError && <IsError />}

      {!isPlaying && isMusicLoaded && (
        <p className="absolute uppercase  bottom-[130px] font-default text-3xl text-transparent bg-gradient-to-r from-purple-500 to-blue-500 font-extrabold bg-clip-text max-sm:text-2xl">
          Pressione a tela para tocar...
        </p>
      )}
      <form
        className="absolute bottom-[40px] w-[600px] max-sm:w-[350px]"
        onSubmit={handleSubmit(handleSearchMusic)}
      >
        <div className="ring-1 ring-zinc-100/30 z-10 flex w-full p-4 focus-within:ring-2 focus-within:ring-purple-500 rounded-lg">
          <input
            {...register('search')}
            required
            className="border-none bg-transparent flex-auto w-full focus:outline-none text-zinc-100 placeholder:text-zinc-100/30 font-default font-normal peer"
            placeholder="Escolha uma musica para tocar.."
          />

          <button
            className="outline-none focus:ring-2 ring-purple-500 rounded-lg text-zinc-100/20 focus:text-purple-500 peer-focus:text-purple-500"
            type="submit"
          >
            <SendHorizontal size={32} />
          </button>
        </div>
      </form>
    </main>
  )
}

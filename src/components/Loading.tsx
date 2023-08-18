import { ThreeDots } from 'react-loader-spinner'

export function Loading() {
  return (
    <div className="absolute text-zinc-100 bottom-[150px]">
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
  )
}

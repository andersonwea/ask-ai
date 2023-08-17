export async function fetchAudioFromUrl(url: string | undefined) {
  if (!url) {
    return
  }

  const file = await fetch(url)
    .then((x) => x.blob())
    .then((blobFile) => new File([blobFile], 'audio', { type: 'audio/wav' }))

  console.log({ file })
  if (!file) {
    return undefined
  }

  return file
}

export async function fecthAudioFromUrl(url: string) {
  const file = await fetch(url).then(x => x.blob()).then(blobFile => new File([blobFile], 'audio', {type: 'audio/wav'}))

  return file
}
export default function selectFile() {
  const $input = document.createElement('input')
  $input.setAttribute('type', 'file')

  return new Promise<FileList>((resolve, reject) => {
    $input.addEventListener('change', () => {
      if ($input.files) {
        resolve($input.files)
      } else {
        reject(new Error('Not files'))
      }
    })

    $input.click()
  })
}

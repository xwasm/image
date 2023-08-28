import { useState, useCallback } from 'react'
import selectFile from './utils/selectFile'
import { Image as ImageWasm } from '../../../pkg'
import './app.css'

function App() {
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageBuffer, setImageBuffer] = useState<ArrayBuffer | null>(null)
  const [saveImageType, setSaveImageType] = useState('png')
  const [blur, setBlur] = useState(0)
  const [brighten, setBrighten] = useState(0)
  const [imageUrl2, setImageUrl2] = useState<string | undefined>(undefined)
  const [image2, setImage2] = useState<ImageWasm | null>(null)

  const abToImage = useCallback(
    (ab: ArrayBuffer) => {
      if (!imageFile) {
        throw new Error('File not exist')
      }
      if (imageFile.type === 'image/png') {
        return ImageWasm.from_png(new Uint8Array(ab))
      } else if (imageFile.type === 'image/jpeg') {
        return ImageWasm.from_jpeg(new Uint8Array(ab))
      } else if (imageFile.type === 'image/bmp') {
        return ImageWasm.from_bmp(new Uint8Array(ab))
      }
    },
    [imageFile]
  )

  const onSelectFile = useCallback(async () => {
    const [file] = await selectFile()
    if (!file) {
      return
    }

    setImageUrl(URL.createObjectURL(file))
    const ab = await file.arrayBuffer()
    setImageBuffer(ab)
    setImageFile(file)
  }, [])

  const onSave = useCallback(() => {
    if (!image2) {
      return
    }

    if (saveImageType === 'png') {
      window.open(URL.createObjectURL(new Blob([image2.to_png()], { type: 'image/png' })))
    } else if (saveImageType === 'jpeg') {
      window.open(URL.createObjectURL(new Blob([image2.to_jpeg()], { type: 'image/jpeg' })))
    } else if (saveImageType === 'bmp') {
      window.open(URL.createObjectURL(new Blob([image2.to_bmp()], { type: 'image/bmp' })))
    }
  }, [image2, saveImageType])

  const onOk = useCallback(() => {
    if (!imageBuffer) {
      return
    }
    
    let image = abToImage(imageBuffer)

    if (!image) {
      return
    }

    console.time()
    if (blur) {
      image = image.blur(blur)
    }
    console.timeEnd()
    // if (brighten) {
    //   image = image.brighten(brighten)
    // }
    setImageUrl2(URL.createObjectURL(new Blob([image.to_png()], { type: 'image/png' })))
    setImage2(image)
  }, [imageBuffer, blur, abToImage])

  return (
    <>
      <button onClick={onSelectFile}>选择文件</button>
      <div className="image-box">
        {imageUrl && (
          <div
            className="image"
            style={{
              backgroundImage: `url("${imageUrl}")`
            }}
          ></div>
        )}
        {imageUrl && <button onClick={onOk}>转换</button>}
        {imageUrl2 && (
          <div
            className="image"
            style={{
              backgroundImage: `url("${imageUrl2}")`
            }}
          ></div>
        )}
      </div>

      {imageUrl && (
        <div>
          <div>
            <div className="slider">
              <div>{blur}</div>
              blur:
              <span>0</span>
              <input
                type="range"
                value={blur}
                min={0}
                max={10}
                step={0.5}
                onChange={e => setBlur(e.target.value as unknown as number)}
              />
              <span>10</span>
            </div>
            <div className="slider">
              <div>{brighten}</div>
              brighten:
              <span>-100</span>
              <input
                type="range"
                value={brighten}
                min={-100}
                max={100}
                step={1}
                onChange={e => setBrighten(e.target.value as unknown as number)}
              />
              <span>100</span>
            </div>
          </div>
          <select value={saveImageType} onChange={e => setSaveImageType(e.target.value)}>
            <option>png</option>
            <option>jpeg</option>
            <option>bmp</option>
          </select>
          <button onClick={onSave}>保存</button>
        </div>
      )}
    </>
  )
}

export default App

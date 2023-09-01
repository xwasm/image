import fs from 'fs'
import path from 'path'
import { Transformer } from '@napi-rs/image'
import { Image } from '../../../pkg/image.js'
import { fileURLToPath } from 'url'

const root = fileURLToPath(path.join(import.meta.url, '../../../..'))

async function main() {
  const buffer = fs.readFileSync(path.join(root, 'image.jpg'))

  console.time('@wasm-dev/image')
  let img = Image.from_jpeg(buffer)
  const img2 = img.blur(10.0)
  fs.writeFileSync(path.join(root, 'target/image-nodejs1.png'), img2.to_png())
  console.timeEnd('@wasm-dev/image')

  console.time('@napi-rs/image')
  const t = new Transformer(buffer)
  t.blur(10)
  fs.writeFileSync(path.join(root, 'target/image-nodejs2.png'), t.pngSync())
  console.timeEnd('@napi-rs/image')
}

main()

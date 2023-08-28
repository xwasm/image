const fs = require('fs')
const path = require('path')
const { Image } = require('../../../pkg-nodejs')

const buffer = fs.readFileSync(path.join(__dirname, '../../../image.jpg'))

let img = Image.from_jpeg(buffer)
console.time()
const img2 = img.blur(10.0)
console.timeEnd()

fs.writeFileSync(path.join(__dirname, '../../../target/image.png'), img2.to_png())

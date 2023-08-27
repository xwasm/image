const { RgbaImageWrap } = require('./pkg')

let img = new RgbaImageWrap(100, 100)

img.save('a.png')

console.log(img)

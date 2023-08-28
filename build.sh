wasm-pack build --scope wasm-dev --release --out-name image --out-dir pkg
wasm-pack build --scope wasm-dev --release --out-name image-web --out-dir pkg/web --target nodejs
wasm-pack build --scope wasm-dev --release --out-name image-nodejs --out-dir pkg/nodejs --target nodejs
use std::io::Cursor;

use image::{
    codecs::{
        bmp::{BmpDecoder, BmpEncoder},
        jpeg::{JpegDecoder, JpegEncoder},
        png::{PngDecoder, PngEncoder},
    },
    imageops::FilterType,
    DynamicImage, ImageEncoder,
};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log(s: &str);

    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_u32_2(s: u32, s2: u32);
}

#[wasm_bindgen]
#[derive(Debug)]
pub enum FilterTypeWarp {
    /// Nearest Neighbor
    Nearest,

    /// Linear Filter
    Triangle,

    /// Cubic Filter
    CatmullRom,

    /// Gaussian Filter
    Gaussian,

    /// Lanczos with window 3
    Lanczos3,
}

impl Into<FilterType> for FilterTypeWarp {
    fn into(self) -> FilterType {
        match self {
            FilterTypeWarp::Nearest => FilterType::Nearest,
            FilterTypeWarp::Triangle => FilterType::Triangle,
            FilterTypeWarp::CatmullRom => FilterType::CatmullRom,
            FilterTypeWarp::Gaussian => FilterType::Gaussian,
            FilterTypeWarp::Lanczos3 => FilterType::Lanczos3,
        }
    }
}

#[wasm_bindgen]
pub struct ImageWasm(DynamicImage);

#[wasm_bindgen]
impl ImageWasm {
    pub fn width(&self) -> u32 {
        self.0.width()
    }

    pub fn height(&self) -> u32 {
        self.0.height()
    }

    // pub fn save(&self, path: String) -> Result<(), JsError> {
    //     self.0.save(path).map_err(|err| err.into())
    // }

    // pub fn save_with_format(&self, path: String) -> Result<(), JsError> {
    //     self.0
    //         .save_with_format(path, image::ImageFormat::Png)
    //         .map_err(|err| err.into())
    // }

    pub fn blur(&self, sigma: f32) -> Self {
        ImageWasm(self.0.blur(sigma))
    }

    pub fn brighten(&self, value: i32) -> Self {
        ImageWasm(self.0.brighten(value))
    }

    pub fn huerotate(&self, value: i32) -> Self {
        ImageWasm(self.0.huerotate(value))
    }

    pub fn adjust_contrast(&self, value: f32) -> Self {
        ImageWasm(self.0.adjust_contrast(value))
    }

    pub fn crop(&self, x: u32, y: u32, width: u32, height: u32) -> Self {
        let mut dynamic_image = self.0.clone();
        ImageWasm(dynamic_image.crop(x, y, width, height))
    }

    pub fn filter3x3(&self, kernel: &[f32]) -> Self {
        ImageWasm(self.0.filter3x3(kernel))
    }

    pub fn fliph(&self) -> Self {
        ImageWasm(self.0.fliph())
    }

    pub fn flipv(&self) -> Self {
        ImageWasm(self.0.flipv())
    }

    pub fn grayscale(&self) -> Self {
        ImageWasm(self.0.grayscale())
    }

    pub fn invert(&self) -> Self {
        let mut dynamic_image = self.0.clone();
        dynamic_image.invert();

        ImageWasm(dynamic_image)
    }

    pub fn resize(&self, width: u32, height: u32, filter: FilterTypeWarp) -> Self {
        ImageWasm(self.0.resize(width, height, filter.into()))
    }

    pub fn rotate90(&self) -> Self {
        ImageWasm(self.0.rotate90())
    }

    pub fn rotate180(&self) -> Self {
        ImageWasm(self.0.rotate180())
    }

    pub fn rotate270(&self) -> Self {
        ImageWasm(self.0.rotate270())
    }

    pub fn unsharpen(&self, sigma: f32, threshold: i32) -> Self {
        ImageWasm(self.0.unsharpen(sigma, threshold))
    }
}

#[wasm_bindgen]
impl ImageWasm {
    pub fn from_png(buffer: Vec<u8>) -> Result<ImageWasm, JsError> {
        let decoder =
            PngDecoder::new(buffer.as_slice()).map_err(|err| JsError::new(&err.to_string()))?;

        let dynamic_image = DynamicImage::from_decoder(decoder)?;

        Ok(ImageWasm(dynamic_image))
    }

    pub fn to_png(&self) -> Result<Vec<u8>, JsError> {
        let mut buffer = Vec::new();
        let encoder = PngEncoder::new(&mut buffer);
        encoder
            .write_image(
                self.0.as_bytes(),
                self.width(),
                self.height(),
                self.0.color(),
            )
            .map_err(|err| JsError::new(&err.to_string()))?;

        Ok(buffer)
    }

    pub fn from_jpeg(buffer: Vec<u8>) -> Result<ImageWasm, JsError> {
        let decoder =
            JpegDecoder::new(buffer.as_slice()).map_err(|err| JsError::new(&err.to_string()))?;

        let dynamic_image = DynamicImage::from_decoder(decoder)?;

        Ok(ImageWasm(dynamic_image))
    }

    pub fn to_jpeg(&self) -> Result<Vec<u8>, JsError> {
        let mut buffer = Vec::new();
        let encoder = JpegEncoder::new(&mut buffer);
        encoder
            .write_image(
                self.0.as_bytes(),
                self.width(),
                self.height(),
                self.0.color(),
            )
            .map_err(|err| JsError::new(&err.to_string()))?;

        Ok(buffer)
    }

    pub fn from_bmp(buffer: Vec<u8>) -> Result<ImageWasm, JsError> {
        let decoder =
            BmpDecoder::new(Cursor::new(buffer)).map_err(|err| JsError::new(&err.to_string()))?;

        let dynamic_image = DynamicImage::from_decoder(decoder)?;

        Ok(ImageWasm(dynamic_image))
    }

    pub fn to_bmp(&self) -> Result<Vec<u8>, JsError> {
        let mut buffer = Vec::new();
        let encoder = BmpEncoder::new(&mut buffer);
        encoder
            .write_image(
                self.0.as_bytes(),
                self.width(),
                self.height(),
                self.0.color(),
            )
            .map_err(|err| JsError::new(&err.to_string()))?;

        Ok(buffer)
    }
}

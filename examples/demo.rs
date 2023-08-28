use image;
use std::time::Instant;

fn main() {
    let img = image::open("image.jpg").unwrap();
    let start = Instant::now();
    let img = img.blur(10.0);
    println!("运行耗时: {:?}", start.elapsed());
    img.save("target/image.png").unwrap();
}

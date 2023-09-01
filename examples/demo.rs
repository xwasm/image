use image;
use std::time::Instant;

fn main() {
    let img = image::open("image.jpg").unwrap();
    let start = Instant::now();
    img.blur(10.0);
    img.save("target/image.png").unwrap();
    println!("运行耗时: {:?}", start.elapsed());
}

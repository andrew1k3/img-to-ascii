console.log("Andrew Gardner 2024");

const imageInput = document.getElementById("imageInput");
const imageText = document.getElementById("imageText");
const buttonEle = document.getElementById("convertButton");
const test = document.getElementById("test");
const canvas = document.getElementById("myCanvas");
const slider = document.getElementById("slider");
const sliderText = document.getElementById("sliderText");
const result = document.getElementById("result");
const ctx = canvas.getContext("2d");
const imageInputBox = document.getElementById("imageInputBox");

let maxStep = 50;
let image = null;
let resolution = 0.8;
let asciiImage = null;
let lastDrawnImage = "";

class AsciiPixel {
  letterBrightnessArray = [
    "`",
    ".",
    ",",
    "-",
    "+",
    "=",
    "|",
    "?",
    "$",
    "%",
    "@",
    "#",
  ];
  constructor(r, g, b, a) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
    this.brightness = this.getBrightness();
    this.letter = this.getLetter();
  }

  getBrightness() {
    return (
      (0.2126 * this.r + 0.7152 * this.g + 0.0722 * this.b) * (this.a / 256)
    );
  }

  getLetter() {
    return this.letterBrightnessArray[
      Math.floor((this.brightness / 256) * this.letterBrightnessArray.length)
    ];
  }
}

class AsciiImage {
  constructor(data, width, height) {
    this.data = data;
    this.width = width;
    this.height = height;
  }

  generateAsciiPixelArray() {
    let asciiPixelArray = [];
    for (let i = 0; i < this.data.length; i += 4) {
      asciiPixelArray.push(
        new AsciiPixel(
          this.data[i],
          this.data[i + 1],
          this.data[i + 2],
          this.data[i + 3]
        )
      );
    }
    return asciiPixelArray;
  }

  averagePixel(array) {
    let r, g, b, a = 0;
    array.forEach((pixel) => {
      r += pixel.r / array.length;
      g += pixel.g / array.length;
      b += pixel.b / array.length;
      a += pixel.a / array.length;
    });
    return new AsciiPixel(r, g, b, a);
  }

  generateScaledArray() {
    console.log(this.data);
    let pixelStep = Math.max(1, Math.floor((1-resolution) * maxStep));
    let asciiPixelArray = this.generateAsciiPixelArray();
    let out = [];
    for (let i = 0; i < this.height; i+= pixelStep) {
      let row = [];
      for (let j = 0; j < this.width; j+= pixelStep) {
        let pixel = asciiPixelArray[i * this.width + j];
        row.push(pixel);
      }
      out.push(row);
    }
    return out;
  }

  drawImage() {
    let fontSize = Math.max(1, Math.floor((1-resolution) * maxStep));
    let scaledArray = this.generateScaledArray();
    let html = "";
    scaledArray.forEach((row) => {
      row.forEach((pixel) => {
        if (pixel) {
          html += `<span style='color: rgb(${pixel.r}, ${pixel.g}, ${pixel.b});'>${pixel.getLetter()}</span>`;
        }
      });
      html += "<br/>";
    });
    result.innerHTML = html;
    result.style.fontSize = fontSize + "px";
    lastDrawnImage = imageText.innerText;
  }
}

function generateImage() {
  if (image) {
    if (lastDrawnImage === imageText.innerText) {
      asciiImage.drawImage();
      return;
    }
    var reader = new FileReader();
    reader.onload = function () {
      const img = new Image();
      img.src = reader.result;

      img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        asciiImage = new AsciiImage(
          imageData.data,
          canvas.width,
          canvas.height,
          slider.value
        );
        asciiImage.drawImage();
      };
    };
    reader.readAsDataURL(image);
  }
}

// input image
imageInput.addEventListener("change", () => {
  image = imageInput.files[0];
  if (image) {
    const url = URL.createObjectURL(image);
    console.log(image);
    imageInputBox.style.backgroundImage = `url(${url})`;
    imageText.innerText = image.name;
    buttonEle.disabled = false;
  }
});

// slider resolution
slider.addEventListener("input", (event) => {
  
  sliderText.innerHTML = event.target.value + "%";
  resolution = event.target.value / 100;
  if (lastDrawnImage === imageText.innerText) {
    generateImage();
  }
  console.log(resolution);
});

// button constructs image into canvas and reads data off canvas
buttonEle.addEventListener("click", () => {
  generateImage();
});

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
let image = null;
let resolution = 0.5;
let asciiImage = null;

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
      Math.floor(this.brightness / (256 / this.letterBrightnessArray.length))
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
    let r,
      g,
      b,
      a = 0;
    array.forEach((pixel) => {
      r += pixel.r / array.length;
      g += pixel.g / array.length;
      b += pixel.b / array.length;
      a += pixel.a / array.length;
    });
    return new AsciiPixel(r, g, b, a);
  }

  // dont care abt res rn
  generateScaledArray() {
    console.log(this.data);
    let cols = this.width;
    let rows = this.height;
    let asciiPixelArray = this.generateAsciiPixelArray();
    let emptyArray = [...Array(rows)].map(() => Array(cols).fill(null));
    for (let i = 0; i < asciiPixelArray.length - 1; i++) {
      let pixel = asciiPixelArray[i];
      // console.log(i, pixel, emptyArray[Math.floor(i / rows)][i % cols]);
      try {
        emptyArray[Math.floor(i / rows)][i % cols] = pixel;
      } catch (e) {
        console.log(e);
      }
    }
    return emptyArray;
  }

  drawImage() {
    let scaledArray = this.generateScaledArray();
    result.innerHTML = "";
    // console.log(scaledArray);
    let fontSize = Math.floor((1 / resolution) * 10);
    scaledArray.forEach((row) => {
      let text = "";
      row.forEach((pixel) => {
        if (pixel) {
          text += `<h4 style='color: rgb(${pixel.r}, ${pixel.g}, ${
            pixel.b
          });'>${pixel.getLetter()}</h4>`;
        }
      });
      result.innerHTML += `<span>${text}</span>`;
    });
  }
}

// input image
imageInput.addEventListener("change", () => {
  image = document.querySelector("input[type=file]").files[0];
  imageText.innerText = image.name;
  buttonEle.disabled = false;
});

// slider resolution
slider.addEventListener("input", (event) => {
  sliderText.innerHTML = event.target.value + "%";
  resolution = event.target.value / 100;
  if (asciiImage) {
    asciiImage.drawImage;
  }
});

// button constructs image into cavas and reads data off canvas
buttonEle.addEventListener("click", () => {
  if (image) {
    var reader = new FileReader();
    reader.onload = function () {
      const img = new Image();
      test.src = reader.result;
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
});

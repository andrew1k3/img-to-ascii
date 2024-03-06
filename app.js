const input = document.getElementById("inputTag");
const imageName = document.getElementById("imageName");
const buttonEle = document.getElementById("convertButton");
const test = document.getElementById("test");
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
let image = null;

console.log("Script loaded");

input.addEventListener("change", () => {
  console.log(1);
  image = document.querySelector("input[type=file]").files[0];
  imageName.innerText = image.name;
  buttonEle.disabled = false;
  console.log(image);
});

buttonEle.addEventListener("click", () => {
  if (image) {
    var reader = new FileReader();
    reader.onload = function (event) {
      const img = new Image();
      test.src = reader.result;
      img.src = reader.result;

      img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        drawData(imageData.data);
      };
    };
    reader.readAsDataURL(image);

    console.log(reader);

    // ctx.drawImage(reader.result, 0, 0);
    // var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    // var data = imageData.data;
    // console.log(imageData);
  }
});

function drawData(data) {
  let imageArray = [];
  for (let i = 0; i < data.length; i += 4) {
    let row = Math.floor(i / 4 / canvas.width);
    let col = (i / 4) % canvas.width;
    if (!imageArray[row]) {
      imageArray[row] = [];
    }
    imageArray[row][col] = [data[i], data[i + 1], data[i + 2], data[i + 3]];
  }
  console.log(imageArray);

  lowerResImageArray = [];
  rows = Math.floor(imageArray.length / 10);
  cols = Math.floor(imageArray[0].length / 10);

  for (let i = 0; i < rows; i += 10) {
    if (!lowerResImageArray[i / 10]) {
      lowerResImageArray[i / 10] = [];
    }

    for (let j = 0; j < cols; j += 10) {
      average = [0, 0, 0, 0];
      for (let x = i; x < i + 10; x++) {
        for (y = j; y < j + 10; y++) {
          average = [
            average[0] + imageArray[x][y][0] / 100,
            average[1] + imageArray[x][y][1] / 100,
            average[2] + imageArray[x][y][2] / 100,
            average[3] + imageArray[x][y][3] / 100,
          ];
        }
      }
      lowerResImageArray[i / 10][j / 10] = average;
    }
  }
  console.log(lowerResImageArray);
}

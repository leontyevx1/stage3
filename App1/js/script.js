const imageInput = document.getElementById('imageInput');
const topText = document.getElementById('topText');
const bottomText = document.getElementById('bottomText');
const generateButton = document.getElementById('generateButton');
const saveButton = document.getElementById('saveButton');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let image = null;

imageInput.addEventListener('change', function(e) {
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0, img.width, img.height);
            image = img;
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);
});

generateButton.addEventListener('click', function() {
    const topTextValue = topText.value.trim();
    const bottomTextValue = bottomText.value.trim();

    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    ctx.font = "42px Impact";
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;

    ctx.fillText(topTextValue, canvas.width / 2, 50);
    ctx.strokeText(topTextValue, canvas.width / 2, 50);

    ctx.fillText(bottomTextValue, canvas.width / 2, canvas.height - 20);
    ctx.strokeText(bottomTextValue, canvas.width / 2, canvas.height - 20);

    checkMemeExists();
});

function checkMemeExists() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        const red = data[i];
        const green = data[i + 1];
        const blue = data[i + 2];
        const alpha = data[i + 3];

        if (red !== 255 || green !== 255 || blue !== 255 || alpha !== 0) {
            saveButton.style.display = 'block';
            return;
        }
    }

    saveButton.style.display = 'none';
}

function saveMeme() {
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'meme.png';
    link.click();
}

const img = './foo.png';

function imgBase64 (image, callback) {
    const img = new Image();
    img.src = image;
    img.crossOrigin = true;
    new Promise((resolve, reject) => {
        img.onload = () => {
            resolve();
        }
    }).then(
        res => {
            const convas = document.createElement('canvas');
            convas.width = img.width;
            convas.height = img.height;
            const ctx = convas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            console.log(convas.toDataURL());
            callback(convas.toDataURL());
        }
    )
}

function showImg (imgUrl) {
    const img = $('img');
    img.src = imgUrl;
}

function $ (selector) {
    return document.querySelector(selector);
}

imgBase64(img, showImg);

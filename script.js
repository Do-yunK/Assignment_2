const torchSize = 90;
const switchWidth = 45;
const canvasBounds = { margin: 120, minW: 360, minH: 240, maxW: 1200, maxH: 700 };

const flashlightRadius = 100;

const switchAnchor = { xPercent: 0.76, yPercent: 0.25 };

const catConfigs = [
    { src: "images/whitecat.svg", width: 96, right: 150, bottom: 200, toastText: "Pearl" },
    { src: "images/blackcat.svg", width: 140, left: 630, bottom: 230, toastText: "Nova" },
    { src: "images/greycat.svg", width: 96, left: 340, bottom: 160, toastText: "Dusty" },
    { src: "images/orangecat.svg", width: 120, left: 40, bottom: 285, toastText: "Cheeto" }
];

let backgroundImage;
let torchImage;
let switchOnImage;
let switchOffImage;
let flashlightOn = true;
let cats = [];

let toast = null;
const toastDurationMs = 900;

function getDisplayHeight(imageAsset, targetWidth) {
    return targetWidth * (imageAsset.height / imageAsset.width);
}

function getSwitchRect() {
    const switchDisplayHeight = getDisplayHeight(switchOnImage, switchWidth);
    return {
        x: width * switchAnchor.xPercent,
        y: height * switchAnchor.yPercent,
        width: switchWidth,
        height: switchDisplayHeight
    };
}

function getCatRects() {
    return cats.map((cat) => {
        const catHeight = getDisplayHeight(cat.image, cat.width);
        const x = typeof cat.left === "number" ? cat.left : (width - cat.right - cat.width);
        const y = height - cat.bottom - catHeight;
        return { ...cat, x, y, height: catHeight };
    });
}

function isPointInsideRect(px, py, rect) {
    return px >= rect.x && px <= rect.x + rect.width && py >= rect.y && py <= rect.y + rect.height;
}

function drawToast() {
    if (!toast || millis() > toast.expiresAt) {
        toast = null;
        return;
    }

    textSize(12);
    const padX = 10;
    const bubbleHeight = 24;
    const bubbleWidth = textWidth(toast.text) + (padX * 2);
    const bubbleX = constrain(toast.x - (bubbleWidth / 2), 8, width - bubbleWidth - 8);
    const bubbleY = constrain(toast.y - 34, 8, height - bubbleHeight - 8);

    fill(0, 0, 0, 204);
    rect(bubbleX, bubbleY, bubbleWidth, bubbleHeight, 8);

    fill(255);
    textAlign(LEFT, CENTER);
    text(toast.text, bubbleX + padX, bubbleY + (bubbleHeight / 2));
}

function drawFlashlightGradient(centerX, centerY) {
    const ctx = drawingContext;
    ctx.save();

    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 150);
    gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0.96)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.restore();
}

function getCanvasSize() {
    return {
        width: Math.max(canvasBounds.minW, Math.min(canvasBounds.maxW, windowWidth - canvasBounds.margin)),
        height: Math.max(canvasBounds.minH, Math.min(canvasBounds.maxH, windowHeight - canvasBounds.margin))
    };
}

function preload() {
    backgroundImage = loadImage("images/pixelroom.svg");
    torchImage = loadImage("images/Torch.svg");
    switchOnImage = loadImage("images/Offswitch.svg");
    switchOffImage = loadImage("images/Onswitch.svg");

    cats = catConfigs.map((cat, index) => ({
        ...cat,
        image: loadImage(cat.src),
        toastText: cat.toastText || `Meow ${index + 1}`
    }));
}

function setup() {
    const size = getCanvasSize();
    const sceneCanvas = createCanvas(size.width, size.height);
    sceneCanvas.id("sceneCanvas");
    sceneCanvas.parent("canvasHost");
    noStroke();
}

function draw() {
    clear();
    image(backgroundImage, 0, 0, width, height);

    const switchRect = getSwitchRect();
    const catRects = getCatRects();

    catRects.forEach((cat) => {
        image(cat.image, cat.x, cat.y, cat.width, cat.height);
    });

    image(
        flashlightOn ? switchOnImage : switchOffImage,
        switchRect.x,
        switchRect.y,
        switchRect.width,
        switchRect.height
    );

    const constrainedX = constrain(mouseX, flashlightRadius, width - flashlightRadius);
    const constrainedY = constrain(mouseY, flashlightRadius, height - flashlightRadius);

    if (flashlightOn) {
        drawFlashlightGradient(constrainedX, constrainedY);
    }

    const torchX = width / 2;
    const torchY = height - (torchSize / 2);
    const torchAngle = Math.atan2(constrainedY - torchY, constrainedX - torchX);

    push();
    translate(torchX, torchY);
    rotate(torchAngle);
    imageMode(CENTER);
    image(torchImage, 0, 0, torchSize, torchSize);
    pop();

    drawToast();

    const hoveringSwitch = isPointInsideRect(mouseX, mouseY, switchRect);
    const hoveringCat = catRects.some((cat) => isPointInsideRect(mouseX, mouseY, cat));
    cursor(hoveringSwitch || hoveringCat ? "pointer" : "default");
}

function mousePressed() {
    const switchRect = getSwitchRect();
    const catRects = getCatRects();

    if (isPointInsideRect(mouseX, mouseY, switchRect)) {
        flashlightOn = !flashlightOn;
        return false;
    }

    const clickedCat = catRects.find((cat) => isPointInsideRect(mouseX, mouseY, cat));
    if (clickedCat) {
        toast = {
            text: clickedCat.toastText,
            x: clickedCat.x + (clickedCat.width / 2),
            y: clickedCat.y,
            expiresAt: millis() + toastDurationMs
        };
    }

    return false;
}

function keyPressed() {
    if (key === " " || keyCode === ENTER) {
        flashlightOn = !flashlightOn;
        return false;
    }

    return true;
}

function windowResized() {
    const size = getCanvasSize();
    resizeCanvas(size.width, size.height);
}

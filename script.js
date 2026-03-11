const flashlight = document.getElementById("flashlight");
const toggleButton = document.getElementById("toggleButton");
const onSwitchImage = "images/Offswitch.svg";
const offSwitchImage = "images/Onswitch.svg";
const torchSize = 90;
let torchImage;
let toastTimer;

const toggleImages = Array.from(document.querySelectorAll('[id^="toggleImage"]'));

document.documentElement.addEventListener('mousemove', (e) => {
    flashlight.style.setProperty('--x', e.clientX + 'px');
    flashlight.style.setProperty('--y', e.clientY + 'px');
});

const clickToast = document.createElement("div");
Object.assign(clickToast.style, {
    position: "fixed",
    left: "0px",
    top: "0px",
    transform: "translate(-50%, -100%)",
    padding: "6px 10px",
    borderRadius: "8px",
    background: "rgba(0, 0, 0, 0.8)",
    color: "#fff",
    fontSize: "12px",
    zIndex: "10001",
    opacity: "0",
    pointerEvents: "none",
    transition: "opacity 0.18s ease"
});
document.body.appendChild(clickToast);

function showToast(message, anchorElement) {
    clickToast.textContent = message;
    const { left, width, top } = anchorElement.getBoundingClientRect();

    clickToast.style.left = `${left + width / 2}px`;
    clickToast.style.top = `${top - 10}px`;
    clickToast.style.opacity = "1";

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        clickToast.style.opacity = "0";
    }, 900);
}

toggleImages.forEach((element, index) => {
    element.addEventListener('click', () => {
        const message = element.dataset.toast?.trim() || `Meow ${index + 1}`;
        showToast(message, element);
    });
});

toggleButton.addEventListener('click', () => {
    const flashlightIsVisible = flashlight.style.display !== 'none';
    flashlight.style.display = flashlightIsVisible ? "none" : "block";
    toggleButton.src = flashlightIsVisible ? offSwitchImage : onSwitchImage;
});

toggleButton.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleButton.click();
    }
});

function preload() {
    torchImage = loadImage("images/Torch.svg");
}

function setup() {
    const torchCanvas = createCanvas(windowWidth, windowHeight);
    Object.assign(torchCanvas.elt.style, {
        position: 'fixed',
        inset: '0',
        zIndex: '9999',
        pointerEvents: 'none'
    });
}

function draw() {
    clear();

    const torchX = windowWidth / 2;
    const torchY = windowHeight - (torchSize / 2);
    const torchAngle = Math.atan2(mouseY - torchY, mouseX - torchX);

    push();
    translate(torchX, torchY);
    rotate(torchAngle);
    imageMode(CENTER);
    image(torchImage, 0, 0, torchSize, torchSize);
    pop();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

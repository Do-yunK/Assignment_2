const flashlight = document.getElementById("flashlight");
document.documentElement.addEventListener('mousemove', (e) => {
    flashlight.style.setProperty('--x', e.clientX + 'px');
    flashlight.style.setProperty('--y', e.clientY + 'px');
});

const toggleButton = document.getElementById("toggleButton");
const onSwitchImage = "images/Offswitch.svg";
const offSwitchImage = "images/Onswitch.svg";

toggleButton.addEventListener('click', () => {
    if (flashlight.style.display === 'none') {
        flashlight.style.display = "block";
        toggleButton.src = onSwitchImage;
    }
    else {
        flashlight.style.display = "none";
        toggleButton.src = offSwitchImage;
    }
});

toggleButton.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleButton.click();
    }
});



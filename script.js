const flashlight = document.getElementById("flashlight");
document.documentElement.addEventListener('mousemove', (e) => {
    flashlight.style.setProperty('--x', e.clientX + 'px');
    flashlight.style.setProperty('--y', e.clientY + 'px');
});

const toggleButton = document.getElementById("toggleButton");
toggleButton.addEventListener('click', () => {
    if (flashlight.style.display === 'none') {
        flashlight.style.display = "block";
        toggleButton.textContent = "Switch ON";
    }
    else {
        flashlight.style.display = "none";
        toggleButton.textContent = "Switch OFF";
    }
});



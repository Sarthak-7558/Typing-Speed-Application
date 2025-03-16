const typingText = document.querySelector(".typing-text p");
inpField = document.querySelector('.input-field');
mistakeTag = document.querySelector(".mistake span");
timeTag = document.querySelector(".time span b");
wpmTag = document.querySelector(".wpm span");
cpmTag = document.querySelector(".cpm span");

let timer;
let maxTime = 60;
let timeleft = maxTime;

let charIndex = 0;
let mistakes = 0;
let isTyping = false;

function randomParagraph() {
    let randIndex = Math.floor(Math.random() * paragraphs.length);
    typingText.innerHTML = " ";
    paragraphs[randIndex].split("").forEach(span => {
        let spanTag = `<span>${span}</span>`;    // Wrapping each character inside a <span> tag
        typingText.innerHTML += spanTag;
    });

    document.addEventListener("keydown", () => {
        inpField.focus();
    });
    typingText.addEventListener("click", () => inpField.focus());
}

function initTyping() {
   if(timeleft <= 0) return;

    const characters = typingText.querySelectorAll("span");
    let typedChar = inpField.value.split("")[charIndex];

    if (!isTyping) {
        timer = setInterval(initTimer, 1000);
        isTyping = true;
    }

    if (typedChar == null) {
        // when we do backspace
        if (charIndex > 0) {
            charIndex--;
            // decrement mistakes only if charIndex span contains incorrect class
            if (characters[charIndex].classList.contains("incorrect")) {
                mistakes--;
            }
            characters[charIndex].classList.remove("correct", "incorrect");
        }
    } else {
        if (characters[charIndex].innerText === typedChar) {
            characters[charIndex].classList.add("correct");
        } else {
            mistakes++;
            characters[charIndex].classList.add("incorrect");
        }
        charIndex++;
    }

    characters.forEach(span => { span.classList.remove("active"); });
    if (charIndex < characters.length) {
        characters[charIndex].classList.add("active");
    }

    let elapsedTime = maxTime - timeleft;
    
    // Fixing WPM calculation
    let wordsTyped = charIndex / 5; // 1 word = 5 characters
    let wpm = elapsedTime > 2 ? Math.round((wordsTyped / elapsedTime) * 60) : 0; // Ensure enough time has passed

    // Ensure valid WPM values
    wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;
    
    mistakeTag.innerText = mistakes;
    wpmTag.innerText = wpm;
    cpmTag.innerText = charIndex - mistakes;
}

function initTimer() {
    if (timeleft > 0) {
        timeleft--;
        timeTag.innerText = timeleft;
    } else {
        inpField.value = "";
        clearInterval(timer);
    }
}

randomParagraph();
inpField.addEventListener("input", initTyping);

document.querySelector(".try-again").addEventListener("click", () => {
    location.reload();
});

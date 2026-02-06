const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const overlay = document.getElementById("overlayImage");
const title = document.getElementById("title");


const scareSound = document.getElementById("scareSound");
const loveSound = document.getElementById("loveSound");

const bgSound = document.getElementById("bgSound");

const celebration = document.getElementById("celebration");

/* =========================
   BLOCK MOBILE DEVICES
========================= */

(function () {

    const isMobile =
        /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent)
        || window.innerWidth < 900
        || "ontouchstart" in window;

    if (isMobile) {

        document.body.innerHTML = `
            <div style="
                height:100vh;
                display:flex;
                justify-content:center;
                align-items:center;
                text-align:center;
                background:#000;
                color:#fff;
                font-family:sans-serif;
                padding:30px;
                font-size:20px;
            ">
                This surprise is meant to be opened on a laptop/PC 💻❤️<br><br>
                Please open it there ✨
            </div>
        `;

        throw new Error("Mobile blocked");
    }

})();



/* play creepy sound automatically if coming from password page */
window.addEventListener("load", () => {

    if (localStorage.getItem("playMusic") === "yes") {

        bgSound.volume = 0.6;
        bgSound.play();

        // clear so it doesn't replay on refresh
        localStorage.removeItem("playMusic");
    }
});



let stage = 1; // 1 = horror question, 2 = scare question, 3 = romantic


function startAudio() {
    bgSound.volume = 0.6;

    bgSound.play().then(() => {
        console.log("Audio started");
    }).catch(err => {
        console.log("Audio blocked:", err);
    });

    document.removeEventListener("click", startAudio);
}

document.addEventListener("click", startAudio);

/* =========================
   NO BUTTON RUNS AWAY
========================= */



function moveNo() {
    const x = Math.random() * (window.innerWidth - 120);
    const y = Math.random() * (window.innerHeight - 120);

    noBtn.style.position = "fixed";
    noBtn.style.left = x + "px";
    noBtn.style.top = y + "px";
}

noBtn.addEventListener("mouseenter", moveNo);
noBtn.addEventListener("click", moveNo);



/* =========================
   YES CLICK HANDLER
========================= */

yesBtn.addEventListener("click", () => {

    /* ----- STAGE 1 → STAGE 2 ----- */
    if (stage === 1) {

        overlay.src = "assets/boo.jpg";
        overlay.style.width = "85vw";
        bgSound.pause();
        scareSound.play();
		
		document.body.classList.add("bloody");
        document.getElementById("bloodVideo").play();


        title.innerText = "STILL WANT TO SAY YES?";

        yesBtn.src = "assets/yes.png";
        noBtn.src = "assets/no.png";

        stage = 2;

        setTimeout(() => overlay.style.width = "0", 900);
    }


    /* ----- STAGE 2 → STAGE 3 (ROMANTIC) ----- */
    else if (stage === 2) {


		document.body.classList.remove("dark");
        document.body.classList.add("romantic");

       /* AUDIO SWITCH */
          bgSound.pause();
          bgSound.currentTime = 0;

          scareSound.pause(); 

          loveSound.volume = 0.6;
          loveSound.play();
		  document.body.classList.remove("bloody");
		      // hide scary title completely (you said you don't want it)
          title.style.display = "none";

    // force browser repaint (CRITICAL — removes 1-frame flash)
          void document.body.offsetWidth;

          const v = document.getElementById("bloodVideo");
          v.pause();
          v.currentTime = 0; // reset

         
         startCelebration();

        overlay.src = "assets/rose.gif";
        overlay.style.width = "60vw";

        yesBtn.style.display = "none";
        noBtn.style.display = "none";

        createHearts();

        stage = 3;
    }
});



/* =========================
   FLOATING HEARTS
========================= */

function createHearts() {
    for (let i = 0; i < 25; i++) {

        const heart = document.createElement("div");
        heart.innerHTML = "❤️";
        heart.className = "hearts";

        heart.style.left = Math.random() * 100 + "vw";
        heart.style.bottom = "0px";

        document.body.appendChild(heart);

        setTimeout(() => heart.remove(), 2000);
    }
}

const screen = document.getElementById("screen");

setInterval(() => {
    if (stage < 3) {   // only shake during horror phases
        const x = (Math.random() - 0.5) * 4;
        const y = (Math.random() - 0.5) * 4;

        screen.style.transform = `translate(${x}px, ${y}px)`;
    }
}, 60);



function startCelebration() {

    for (let i = 0; i < 40; i++) {

        const heart = document.createElement("div");
        heart.className = "heart";

        // random emoji (mix of hearts + confetti)
        const shapes = ["❤️", "💖", "💘", "💕", "✨", "💗"];
        heart.innerText = shapes[Math.floor(Math.random() * shapes.length)];

        // spawn from sides only
        const fromLeft = Math.random() < 0.5;

        heart.style.left = fromLeft
            ? Math.random() * 20 + "vw"
            : 80 + Math.random() * 20 + "vw";

        heart.style.bottom = "-20px";

        // random size
        heart.style.fontSize = 18 + Math.random() * 25 + "px";

        // random speed
        heart.style.animationDuration = 3 + Math.random() * 3 + "s";

        celebration.appendChild(heart);

        // remove later
        setTimeout(() => heart.remove(), 5000);
    }
}

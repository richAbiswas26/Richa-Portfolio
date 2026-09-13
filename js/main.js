/* ============================================
   ELEMENTS
============================================ */

const personStage =
    document.getElementById("personStage");

const person =
    document.getElementById("person360");

const heroRole =
    document.getElementById("heroRole");

const heroDescription =
    document.getElementById("heroDescription");

const heroRightText =
    document.getElementById("heroRightText");



/* ============================================
   8 ROTATION IMAGES
============================================ */

const frames = [


    "assets/2.png",

    "assets/3.png",

    "assets/4.png",

    "assets/5.png",

    "assets/6.png",

    "assets/7.png",

    "assets/8.png",

    "assets/1.png"

];



/* ============================================
   PRELOAD IMAGES
============================================ */

const loadedFrames = [];


frames.forEach((src) => {

    const img = new Image();

    img.src = src;

    loadedFrames.push(img);

});



/* ============================================
   ROTATION VARIABLES
============================================ */

let position = 0;

let velocity = 0;

let dragging = false;

let lastX = 0;


/*
    Rotation sensitivity.

    Lower = slower
    Higher = faster
*/

const sensitivity = 0.035;


/*
    Inertia friction.

    Lower = stops faster
    Higher = spins longer
*/

const friction = 0.92;



/* ============================================
   HERO TEXT STATES
============================================ */

const heroStates = [

    {

        role:
            "FULL STACK DEVELOPER",

        description:
            "I create modern web applications with clean interfaces, powerful backends and meaningful user experiences.",

        right:
            "FRONTEND<br>BACKEND<br>FULL STACK"

    },


    {

        role:
            "SCALABLE DEVELOPER",

        description:
            "I build scalable applications with maintainable architecture, efficient APIs and reliable database systems.",

        right:
            "SCALABLE<br>RELIABLE<br>MAINTAINABLE"

    },


    {

        role:
            "FRONTEND DEVELOPER",

        description:
            "I build responsive and interactive interfaces using modern frontend technologies with attention to detail.",

        right:
            "HTML5<br>CSS3<br>JAVASCRIPT"

    },


    {

        role:
            "BACKEND DEVELOPER",

        description:
            "I develop backend systems, REST APIs and database-driven applications designed for real-world use.",

        right:
            "NODE.JS<br>EXPRESS.JS<br>REST APIs"

    }

];



/* ============================================
   CURRENT TEXT STATE
============================================ */

let currentState = 0;

let textChangeTimer = null;



/* ============================================
   CHANGE HERO TEXT
============================================ */

function changeHeroText(newState) {

    if (
        newState === currentState
    ) {

        return;

    }


    if (
        !heroStates[newState]
    ) {

        return;

    }


    currentState = newState;



    /*
        Cancel previous text transition.

        This prevents rapid dragging
        from creating multiple delayed
        text changes.
    */

    if (textChangeTimer) {

        clearTimeout(
            textChangeTimer
        );

    }



    /* Fade old text */

    heroRole.classList.add(
        "text-changing"
    );

    heroDescription.classList.add(
        "text-changing"
    );

    heroRightText.classList.add(
        "text-changing"
    );



    /* Change text after fade */

    textChangeTimer =
        setTimeout(() => {

            const state =
                heroStates[newState];


            heroRole.textContent =
                state.role;


            heroDescription.textContent =
                state.description;


            heroRightText.innerHTML =
                state.right;



            /* Bring new text back */

            requestAnimationFrame(() => {

                heroRole.classList.remove(
                    "text-changing"
                );

                heroDescription.classList.remove(
                    "text-changing"
                );

                heroRightText.classList.remove(
                    "text-changing"
                );

            });

        }, 220);

}



/* ============================================
   DETERMINE TEXT FROM FRAME
============================================ */

function updateHeroText() {

    const totalFrames =
        frames.length;


    /*
        Normalize position.

        8 frames
        4 text states

        Every 2 frames = 1 text state.
    */

    let normalized =
        position % totalFrames;


    if (
        normalized < 0
    ) {

        normalized += totalFrames;

    }


    const framesPerState =
        totalFrames /
        heroStates.length;


    const newState =
        Math.floor(
            normalized /
            framesPerState
        );


    changeHeroText(
        newState
    );

}



/* ============================================
   DISPLAY CURRENT FRAME
============================================ */

function displayFrame() {

    const totalFrames =
        frames.length;


    let index =
        Math.round(position);


    /*
        Keep index between
        0 and 7.
    */

    index =
        (
            (index % totalFrames) +
            totalFrames
        ) %
        totalFrames;


    const image =
        loadedFrames[index];


    if (
        image &&
        image.complete
    ) {

        if (
            person.src !== image.src
        ) {

            person.src =
                image.src;

        }

    }


    updateHeroText();

}



/* ============================================
   POINTER DOWN
============================================ */

personStage.addEventListener(
    "pointerdown",
    (event) => {

        dragging = true;

        lastX =
            event.clientX;

        velocity = 0;


        personStage.setPointerCapture(
            event.pointerId
        );


        personStage.classList.add(
            "is-dragging"
        );

    }
);



/* ============================================
   POINTER MOVE
============================================ */

personStage.addEventListener(
    "pointermove",
    (event) => {

        if (!dragging) {

            return;

        }


        const currentX =
            event.clientX;


        const movement =
            currentX - lastX;


        lastX =
            currentX;


        /*
            Convert mouse/touch
            movement into frame movement.
        */

        const rotation =
            movement *
            sensitivity;


        position -=
            rotation;


        /*
            Store velocity
            for inertia.
        */

        velocity =
            rotation;


        displayFrame();

    }
);



/* ============================================
   STOP DRAGGING
============================================ */

function stopDragging(event) {

    if (!dragging) {

        return;

    }


    dragging = false;


    personStage.classList.remove(
        "is-dragging"
    );


    if (
        event &&
        personStage.hasPointerCapture(
            event.pointerId
        )
    ) {

        personStage.releasePointerCapture(
            event.pointerId
        );

    }

}


personStage.addEventListener(
    "pointerup",
    stopDragging
);


personStage.addEventListener(
    "pointercancel",
    stopDragging
);



/* ============================================
   INERTIA
============================================ */

function animate() {

    if (!dragging) {

        if (
            Math.abs(velocity) >
            0.001
        ) {

            position -=
                velocity;


            velocity *=
                friction;


            displayFrame();

        }

    }


    requestAnimationFrame(
        animate
    );

}



/* ============================================
   SCROLL REVEAL
============================================ */

const revealElements =
    document.querySelectorAll(
        ".reveal"
    );


const revealObserver =
    new IntersectionObserver(

        (entries) => {

            entries.forEach(
                (entry) => {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target.classList.add(
                            "visible"
                        );

                    }

                }
            );

        },

        {
            threshold: 0.15
        }

    );


revealElements.forEach(
    (element) => {

        revealObserver.observe(
            element
        );

    }
);



/* ============================================
   START
============================================ */

displayFrame();

animate();
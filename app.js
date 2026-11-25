// elementos principales

const header = document.querySelector("#header");
const progress = document.querySelector("#progress");
const backTop = document.querySelector("#backTop");
const toggle = document.querySelector("#toggle");
const menu = document.querySelector("#menu");
const theme = document.querySelector("#theme");

const modal = document.querySelector("#modal");
const modalTitle = document.querySelector("#modalTitle");
const modalDescription = document.querySelector("#modalDescription");
const modalImage = document.querySelector("#modalImage");
const closeModal = document.querySelector("#closeModal");

const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;


// menu responsive

toggle.addEventListener("click", () => {

    const open = menu.classList.toggle("open");

    toggle.textContent = open ? "×" : "☰";

    toggle.setAttribute("aria-expanded", open);

});

document.querySelectorAll(".nav__list a").forEach(link => {

    link.addEventListener("click", () => {

        menu.classList.remove("open");

        toggle.textContent = "☰";

        toggle.setAttribute("aria-expanded", "false");

    });

});


// desplazamiento de la pagina

function handleScroll() {

    const scroll = window.scrollY;

    const height =
        document.documentElement.scrollHeight - window.innerHeight;

    const percentage = height > 0 ? scroll / height * 100 : 0;

    progress.style.width = `${percentage}%`;

    header.classList.toggle("scrolled", scroll > 60);

    backTop.classList.toggle("visible", scroll > 500);

}

window.addEventListener("scroll", handleScroll, {
    passive: true
});

window.addEventListener("resize", handleScroll);

handleScroll();


// regresar al inicio

backTop.addEventListener("click", () => {

    window.scrollTo({

        top: 0,

        behavior: reduceMotion ? "instant" : "smooth"

    });

});


// modo oscuro

const savedTheme = localStorage.getItem("rhino-theme");

if (savedTheme === "dark") {

    document.body.classList.add("dark");

}

theme.addEventListener("click", () => {

    const dark = document.body.classList.toggle("dark");

    localStorage.setItem(

        "rhino-theme",

        dark ? "dark" : "light"

    );

});


// animaciones al desplazarse

const reveals = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window && !reduceMotion) {

    const revealObserver = new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("visible");

                revealObserver.unobserve(entry.target);

            }

        });

    }, {

        threshold: 0.08

    });

    reveals.forEach(element => {

        element.classList.add("animate");

        revealObserver.observe(element);

    });

}


// filtros de especies

const filters = document.querySelectorAll(".filter");

const species = document.querySelectorAll(".species");

filters.forEach(button => {

    button.addEventListener("click", () => {

        filters.forEach(item => {

            item.classList.remove("active");

            item.setAttribute("aria-pressed", "false");

        });

        button.classList.add("active");

        button.setAttribute("aria-pressed", "true");

        const filter = button.dataset.filter;

        species.forEach(card => {

            const show =

                filter === "todos" ||

                card.dataset.category === filter;

            card.hidden = !show;

            if (show) {

                card.classList.add("visible");

                if (!reduceMotion) {

                    card.animate([

                        {
                            opacity: 0,
                            transform: "translateY(15px)"
                        },

                        {
                            opacity: 1,
                            transform: "translateY(0)"
                        }

                    ], {

                        duration: 450,

                        easing: "ease-out"

                    });

                }

            }

        });

    });

});


// contadores animados

const counters = document.querySelectorAll(".counter");

function animateCounter(element) {

    const target = Number(element.dataset.target);

    const suffix = element.dataset.suffix || "";

    const duration = 1800;

    const start = performance.now();

    function update(time) {

        const progress = Math.min(

            (time - start) / duration, 1

        );

        const easing = 1 - Math.pow(1 - progress, 3);

        const value = Math.floor(target * easing);

        element.textContent =

            value.toLocaleString("es-SV") + suffix;

        if (progress < 1) {

            requestAnimationFrame(update);

        }

    }

    if (reduceMotion) {

        element.textContent =

            target.toLocaleString("es-SV") + suffix;

    } else {

        requestAnimationFrame(update);

    }

}

if ("IntersectionObserver" in window) {

    const counterObserver = new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                animateCounter(entry.target);

                counterObserver.unobserve(entry.target);

            }

        });

    }, {

        threshold: 0.5

    });

    counters.forEach(counter => {

        counterObserver.observe(counter);

    });

} else {

    counters.forEach(animateCounter);

}


// informacion de las especies

const details = document.querySelectorAll(".details");

details.forEach(button => {

    button.addEventListener("click", () => {

        const card = button.closest(".species");

        const image = card.querySelector("img");

        modalTitle.textContent = button.dataset.name;

        modalDescription.textContent = button.dataset.description;

        modalImage.src = image.src;

        modalImage.alt = image.alt;

        modalImage.hidden = false;

        modal.showModal();

    });

});


// galeria interactiva

const gallery = document.querySelectorAll(".gallery__button");

gallery.forEach(button => {

    button.addEventListener("click", () => {

        const image = button.querySelector("img");

        modalImage.src = image.src;

        modalImage.alt = image.alt;

        modalImage.hidden = false;

        modalTitle.textContent = image.alt;

        modalDescription.textContent = "";

        modal.showModal();

    });

});


// cerrar ventana emergente

closeModal.addEventListener("click", () => {

    modal.close();

});

modal.addEventListener("click", event => {

    if (event.target === modal) {

        const rect = modal.getBoundingClientRect();

        const outside =

            event.clientX < rect.left ||

            event.clientX > rect.right ||

            event.clientY < rect.top ||

            event.clientY > rect.bottom;

        if (outside) {

            modal.close();

        }

    }

});


// acordeon de preguntas frecuentes

const questions = document.querySelectorAll(".faq details");

questions.forEach(question => {

    question.addEventListener("toggle", () => {

        if (question.open) {

            questions.forEach(item => {

                if (item !== question) {

                    item.open = false;

                }

            });

        }

    });

});


// navegacion activa

const sections = document.querySelectorAll("main section[id]");

const links = document.querySelectorAll(".nav__list a");

if ("IntersectionObserver" in window) {

    const sectionObserver = new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                links.forEach(link => {

                    link.classList.toggle(

                        "active",

                        link.getAttribute("href") ===

                        `#${entry.target.id}`

                    );

                });

            }

        });

    }, {

        rootMargin: "-20% 0px -60% 0px"

    });

    sections.forEach(section => {

        sectionObserver.observe(section);

    });

}


// actualizar año automaticamente

document.querySelector("#year").textContent =

    new Date().getFullYear();
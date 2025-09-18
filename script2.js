'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');



const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach((btn) => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//Button Scrolling
btnScrollTo.addEventListener('click', function(e){
    const s1coords = section1.getBoundingClientRect();
    // console.log(s1coords);
    // console.log(e.target.getBoundingClientRect());
    // console.log('Current scroll (X/Y)', window.scrollX, window.scrollY);
    // console.log('height/width', document.documentElement.clientHeight, document.documentElement.clientWidth);

    //scrolling
    //window.scrollTo(s1coords.left + window.scrollX, s1coords.top + window.scrollY);
    // window.scrollTo({
    //     left: s1coords.left + window.scrollX,
    //     top: s1coords.top + window.scrollY,
    //     behavior: 'smooth'
    // })

    section1.scrollIntoView({behavior: 'smooth'});
})


////////////////////////
//Page Navigation

// document.querySelectorAll('.nav__link').forEach((el) =>{
//     el.addEventListener('click', function(e){
//         e.preventDefault();
//         const id = this.getAttribute('href');
//         document.querySelector(id).scrollIntoView({behavior: 'smooth'});
//         // console.log(id);
//         // console.log('Link');
//     })
//     }
// )

//with event delegation
//1. Add event listener to common parent element

//2.Determine what element originated the event

document.querySelector('.nav__links').addEventListener('click', function(e) {
    e.preventDefault();
    //Matching strategy
    if(e.target.classList.contains('nav__link')) {
        const id = e.target.getAttribute('href');
        document.querySelector(id).scrollIntoView({behavior: 'smooth'});
    }
});


//Tabbed component
//using event delegation
tabsContainer.addEventListener('click', function(e) {
    const clicked = e.target.closest('.operations__tab'); //para devolver o botao quando clicamos no botao ou no span
    //console.log(clicked);
    //Guard clause
    if(!clicked) return;


    tabs.forEach((tab) => tab.classList.remove('operations__tab--active'));
    tabsContent.forEach((c) => c.classList.remove('operations__content--active'));
    //Active Tab
    clicked.classList.add('operations__tab--active');

    //Activate content area
    document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');
});


//Menu fade animation
const handleHover = function (e, opacity) {
    //console.log(this, e.currentTarget);
    if(e.target.classList.contains('nav__link')){
        const link = e.target;
        const siblings = link.closest('.nav').querySelectorAll('.nav__link');
        const logo = link.closest('.nav').querySelector('img');

        siblings.forEach((el) => {
            if(el !== link)  el.style.opacity = this;
        })
        logo.style.opacity = this;
    }

}


//mouseover
// nav.addEventListener('mouseover', function(e) {
//     handleHover(e, 0.5)
// });
//Passing "argument" into handler
nav.addEventListener('mouseover', handleHover.bind(0.5));


//mouseout
// nav.addEventListener('mouseout', function(e) {
//     handleHover(e, 1)
// });
nav.addEventListener('mouseout', handleHover.bind(1))

//Sticky navigation
// const initialCoords = section1.getBoundingClientRect();
// console.log(initialCoords);
// window.addEventListener("scroll", function (e){
//     console.log(window.scrollY);
//     if(window.scrollY > initialCoords.top){
//         nav.classList.add('sticky');
//     } else nav.classList.remove('sticky');
//
// })

//Sticky navigation: Intersection observer API
// const obsOptions = {
//     root: null,
//     threshold: [0, 0.2],
// }
// const obsCallback = function (entries, observer){
//     entries.forEach(entry => {
//         console.log(entry);
//     })
// };
//
//
// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
const stickyNav = function(entries){
    const [entry] = entries;
    //console.log(entry);
    if(!entry.isIntersecting) nav.classList.add('sticky')
    else nav.classList.remove('sticky');
}

const headerObserver = new IntersectionObserver(stickyNav, {
    root: null,
    threshold: 0,
    rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

//Reveal section
const allSections = document.querySelectorAll('.section');
const revealSection = function (entries, observer){
    //console.log(entries);
    entries.forEach(entry => {
        if(!entry.isIntersecting) return
        entry.target.classList.remove('section--hidden');
        observer.unobserve(entry.target);
    })
    //const [entry] = entries;
    //console.log(entry);

};
const sectionObserver = new IntersectionObserver(revealSection, {
    root:null,
    threshold: 0.15,

})
allSections.forEach(section => {
    sectionObserver.observe(section);
    section.classList.add('section--hidden');
})

//Lazy loading images

const imgTargets = document.querySelectorAll('img[data-src]');
console.log(imgTargets);
const loadImg = function (entries, observer) {
    const [entry] = entries;
    console.log(entries);
    console.log(entry);
    if(!entry.isIntersecting) return;

    //Replace src attribute with data-src
    entry.target.src = entry.target.dataset.src;
    entry.target.addEventListener('load', () => {
        entry.target.classList.remove('lazy-img');
    })

    observer.unobserve(entry.target);
}

const imageObserver = new IntersectionObserver(loadImg, {
    root: null,
    threshold: 0,
    rootMargin: `-200px`,
})

imgTargets.forEach(img => imageObserver.observe(img));


//Slider
const slider = function() {
    const slides = document.querySelectorAll('.slide');
    const btnLeft = document.querySelector('.slider__btn--left');
    const btnRight = document.querySelector('.slider__btn--right');
    const dotContainer = document.querySelector('.dots');

    let curSlide = 0;
    const maxSlides = slides.length;

//Functions
    const createDots = function () {
        slides.forEach((_, index) => {
            dotContainer.insertAdjacentHTML('beforeend',
                `<button class="dots__dot" data-slide="${index}"></button>`);
        });
    }

    const activateDot = function (slide) {
        document.querySelectorAll('.dots__dot').forEach((dot) => {
            dot.classList.remove('dots__dot--active');
        });
        document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
    }


    const goToSlide = (slide) => {
        slides.forEach((s, i) => {
            s.style.transform = `translateX(${(i - slide) * 100}%)`;
        })
    }

//Next slide
    const nextSlide = function () {
        if (curSlide === maxSlides - 1) {
            curSlide = 0;
        } else {
            curSlide++;
        }
        goToSlide(curSlide);
        activateDot(curSlide);
    };

    const prevSlide = function () {
        if (curSlide === 0) {
            curSlide = maxSlides - 1;
        } else {
            curSlide--;
        }
        goToSlide(curSlide);
        activateDot(curSlide);
    }
    const init = function () {
        createDots();
        activateDot(0);
        goToSlide(0);
    }
    init()
//Event Handlers
    btnRight.addEventListener('click', nextSlide);
    btnLeft.addEventListener('click', prevSlide);

    document.addEventListener('keydown', function (e) {
        e.key === 'ArrowRight' && nextSlide();
        e.key === 'ArrowLeft' && prevSlide();
    });

    dotContainer.addEventListener('click', function (e) {
        if (e.target.classList.contains('dots__dot')) {
            console.log('DOT')
            curSlide = e.target.dataset.slide;
            goToSlide(curSlide);
            activateDot(curSlide);
        }
    });
}

slider();
////////////////////////////////////
////////////////////////////////////
////////////////////////////////////
/*
//Selecting, Creating and Deleting Elements

//selecting the entire content of any webpage
console.log(document.documentElement);
console.log(document.head); //just the head
console.log(document.body); //just the body

//Selecting Elements
const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');

//select element by ID
document.getElementById('section--1');

//select element by tagName
const allButtons = document.getElementsByTagName('button');
console.log(allButtons);

//select element by class name
console.log(document.getElementsByClassName('btn'));

//Creating and inserting elements
const message = document.createElement('div');
message.classList.add('cookie-message');
message.textContent = 'We use cookies for improved functionality and analytics';
message.innerHTML = 'We use cookies for improved functionality and analytics <button class="btn' +
    ' btn--close-cookie">Got' +
    ' it!</button>';
header.prepend(message);
//header.append(message);
//header.append(message.cloneNode(true));

//header.before(message)
//header.after(message);

document.querySelector('.btn--close-cookie').addEventListener('click', function(){
    message.remove();
    //message.parentElement.removeChild(message);
});


//Styles
message.style.backgroundColor = '#37383d';
message.style.width = '120%';

console.log(message.style.height);//nothing in the console || only works for attributes we defined;
console.log(message.style.backgroundColor);//appears in the console || set above


//if we want to get the styles from the stylesheet
console.log(getComputedStyle(message).color);
console.log(getComputedStyle(message).height);

message.style.height = Number.parseFloat(getComputedStyle(message).height, 10) + 10 + 'px';
console.log(message.style.height);

//document.documentElement.style.setProperty('--color-primary', 'orangeRed');

//Attributes

const logo = document.querySelector('.nav__logo');
console.log(logo.alt);
console.log(logo.src);
console.log(logo.className);

//Non-standard
console.log(logo.designer);
console.log(logo.getAttribute('designer'));
logo.setAttribute('company', 'Bankist');

const link = document.querySelector('.nav__link--btn');
//console.log(link.href);
//console.log(link.getAttribute('href'));

//Data Attributes
//console.log(logo.dataset);

//Classes
// logo.classList.add();
// logo.classList.remove();
// logo.classList.toggle();
// logo.classList.contains();


// const h1 = document.querySelector('h1');
//
// const alertH1 = function (e){
//     alert('addEventListener:  You are reading the heading :D');
//     //h1.removeEventListener('mouseenter', alertH1);
// }
//
// h1.addEventListener("mouseenter", alertH1);
//
//
// setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000);
// h1.onmouseenter = function () {
//     alert('onmouseenter:  You are reading the heading :D');
// };


//Event Propagation in Pratice
//rgb(255, 255, 255)
/*
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomColor = () => `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;
//console.log(randomColor())

document.querySelector('.nav__link').addEventListener('click', function(e) {
    //console.log(this);
    this.style.backgroundColor = randomColor();
    console.log('LINK', e.target, e.currentTarget);
    //console.log(e.currentTarget === this);

    //Stop event propgation
    //e.stopPropagation();
}, );

document.querySelector('.nav__links').addEventListener('click', function(e) {
    this.style.backgroundColor = randomColor();
    console.log('CONTAINER', e.target, e.currentTarget);
})

document.querySelector('.nav').addEventListener('click', function(e) {
    this.style.backgroundColor = randomColor();
    console.log('NAV', e.target, e.currentTarget);
},)
*/

/*
//DOM Traversing
const h1 = document.querySelector('h1');

//Going downwards: child
console.log(h1.querySelectorAll('.highlight'));
console.log(h1.childNodes);
console.log(h1.children);
h1.firstElementChild.style.color = 'white';
h1.lastElementChild.style.color = 'orangered';

//Going upwards: parents
console.log(h1.parentNode);
console.log(h1.parentElement);

h1.closest('.header').style.background = 'var(--gradient-secondary)';
h1.closest('h1').style.background = 'var(--gradient-primary)';

//Going sideways: siblings
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

console.log(h1.previousSibling);
console.log(h1.nextSibling);

console.log(h1.parentElement.children);

[...h1.parentElement.children].forEach((el) => {
    if(el !== h1) el.style.transform = 'scaleX(0.5)';
});
*/

//Lifecycle DOM events

document.addEventListener('DOMContentLoaded', function (e) {
    console.log('HTML parsed and DOM tree built', e)
});

window.addEventListener('load', function (e) {
    console.log('Page fully loaded', e);
})

// window.addEventListener('beforeunload', function (e) {
//     e.preventDefault();
//     console.log(e);
//     e.returnValue = '';
// });
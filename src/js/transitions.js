/********************/
/* Helper Functions */
/********************/

const getPagename = function(url) {
	return url.substring(url.lastIndexOf('/') + 1).replace('.html','');	
};
const initNav = function(url){
	var pagename = getPagename(url);
	const navLink = document.getElementById(pagename + '-link');
	if (navLink) {
		setNavOutline(navLink);
	}
};

var timeOut;	
const scrollToTop = function() {
	if (document.body.scrollTop != 0 || document.documentElement.scrollTop != 0) {
		window.scrollBy(0, -10);
		timeOut = setTimeout(scrollToTop, 5);
	} else {
		clearTimeout(timeOut);
	}
};

/**************/
/* Navigation */
/**************/

const removeNavOutlines = function() {
	const navLinks = document.getElementsByClassName('nav-link');
	Array.prototype.forEach.call(navLinks, function(navLink){
		navLink.classList.remove('active-nav');
	});
};

const setNavOutline = function(navLink) {
	removeNavOutlines();
	navLink.classList.add('active-nav');
};

// Set initial active on first load
const url = window.location.pathname;
initNav(url);

/************/
/* Projects */
/************/

var swipers = {};

const removeProjectOutlines = function() {
	const projectLinks = document.getElementsByClassName('active-project-link');
	Array.prototype.forEach.call(projectLinks, function(projectLink){
		projectLink.classList.remove('active-project-link');
	});
};

var transitioningProject = false;

// Hide currently active project
const transitionOutCurrentProjectAndTriggerIn = function(newProjectMain, newProjectLink) {

	// Remove outlines
	removeProjectOutlines();
	
	// Find currently active project
	const oldProjectMains = document.getElementsByClassName('active-project-main');

	scrollToTop();

	// Assume we only have one active project
	if(oldProjectMains.length > 0) {
		const oldProjectMain = oldProjectMains[0];
		
		// On animation end, display none and trigger transition in
		const onTransitionEnd = function(){
			const swiper = swipers[oldProjectMain.id];
			if(swiper) {
				swiper.autoplay.start();
			}

			oldProjectMain.classList.add('nodisplay');
			oldProjectMain.removeEventListener('transitionend', onTransitionEnd);
			transitionInProject(newProjectMain, newProjectLink);
		};
		oldProjectMain.addEventListener('transitionend', onTransitionEnd);

		// Remove active class, thereby triggering animation
		oldProjectMain.classList.remove('active-project-main');
	} else {
		transitionInProject(newProjectMain, newProjectLink);
	}
};

const transitionInProject = function(newProjectMain, newProjectLink) {
	// Set link to active
	newProjectLink.classList.add('active-project-link');		
	
	// Remove nodispaly, set active thereby triggering animation in
	newProjectMain.classList.remove('nodisplay');
	newProjectMain.classList.add('active-project-main');

	// On end, release transition lock and start swiper autoplay if applicable
	const onTransitionEnd = function() {
		const swiper = swipers[newProjectMain.id];
		if(swiper) {
			swiper.autoplay.start();
		}
		transitioningProject = false;
		newProjectMain.removeEventListener('transitionend', onTransitionEnd);
	};
	newProjectMain.addEventListener('transitionend', onTransitionEnd);
};

// Triggered by click
const showProject = function(newProjectLink) {

	// Check for transition lock
	if (!transitioningProject) {

		// Lock for transitions
		transitioningProject = true;		

		// Find project main for clicked link
		const projectname = newProjectLink.id.replace('-link', '');
		const newProjectMain = document.getElementById(projectname + '-main');

		// If it exists, trigger transition out. Else, release lock.
		if (newProjectMain) {
			transitionOutCurrentProjectAndTriggerIn(newProjectMain, newProjectLink);
		} else {
			transitioningProject = false;
		}	
	}
};

const startWork = function() {
	const anchor = window.location.hash;
	if (anchor) {
		const projectName = anchor.replace('#','');
		const projectLink = document.getElementById(projectName + '-link');
		projectLink.classList.add('active-project-link');
		showProject(projectLink);
	} else {
		const projectLinks = document.getElementsByClassName('project-link');
		showProject(projectLinks[0]);
	}
	
	const initSwiper = function(swiperContainer){
		const swiper = new Swiper (swiperContainer, {
			lazy: { loadPrevNext: true, },
			direction: 'horizontal',
			loop: true,
			autoplay: {
				delay: 10000
			},
			pagination: { el: '.swiper-pagination', },
			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev',
			},	
		});
		swiper.autoplay.stop();
		swipers[swiperContainer.parentNode.id] = swiper;
	};
	
	const swiperContainers = document.getElementsByClassName('swiper-container');
	Array.prototype.forEach.call(swiperContainers, function(swiperContainer){
		initSwiper(swiperContainer);
	});
};

/*********/
/* About */
/*********/

var progress;

const transitionOutTrivium = function(index){
	const triviaFigure = document.getElementById('trivia-wrapper');
	const previousTrivia = document.getElementsByClassName('active-trivium');
	
	// Assume only one active trivium
	if (triviaFigure && previousTrivia.length > 0) {
		
		const previousTrivium = previousTrivia[0];
		
		const onTransitionOutEnd = function() {
			
			previousTrivium.classList.remove('active-trivium');
			triviaFigure.removeEventListener('transitionend', onTransitionOutEnd);
			
			window.setTimeout(function(){
				transitionInTrivium(index);
			}, 100);
		};
		triviaFigure.addEventListener('transitionend', onTransitionOutEnd);

		triviaFigure.classList.add('inactive-trivia-wrapper');
	}
};

const transitionInTrivium = function(index) {
	const triviaFigure = document.getElementById('trivia-wrapper');
	const trivia = document.getElementsByClassName('trivium');
	
	if (trivia.length > 0) {
		
		const newTrivium = trivia[index];
		
		const onTransitionInEnd = function() {
			const nextIndex = (index + 1) % trivia.length;
			triviaFigure.removeEventListener('transitionend', onTransitionInEnd);
			progressStep(nextIndex);
		};

		progress.value = 0;
		const listener = triviaFigure.addEventListener('transitionend', onTransitionInEnd);
		
		triviaFigure.classList.remove('inactive-trivia-wrapper');
		newTrivium.classList.add('active-trivium');
	}
};

var pausedIndex;
var triviaPaused = false;
const pauseTrivia = function() {
	triviaPaused = true;
};
const resumeTrivia = function() {
	triviaPaused = false;
	window.requestAnimationFrame(function(){
		progressStep(pausedIndex);
	});
};

const progressStep = function(index) {
	if (progress.value >= 800) {
		transitionOutTrivium(index);
	} else if (!triviaPaused) {
		progress.value++;
		window.requestAnimationFrame(function(){
			progressStep(index);
		});
	} else if (triviaPaused) {
		pausedIndex = index;
	}
};

const startTrivia = function() {
	progress = document.getElementById('trivia-progress');
	window.requestAnimationFrame(function(){
		progressStep(1);
	});
};

/***********/
/* Contact */
/***********/

const socialHover = function(socialLink) {
	socialLink.childNodes[1].childNodes[1].classList.toggle('social-active');
};

/*********/
/* Barba */
/*********/

Barba.Dispatcher.on('newPageReady', function(currentStatus) {
	initNav(currentStatus.url);
	const pagename = getPagename(currentStatus.url);
	if(pagename == 'work') {
		startWork();
	} else if (pagename == 'about') {
		startTrivia();
	}
});

Barba.Dispatcher.on('initStateChange', function() {
  if (typeof ga === 'function') {
    ga('send', 'pageview', location.pathname);
  }
});

var FadeTransition = Barba.BaseTransition.extend({

	start: function() {
		Promise
		.all([this.newContainerLoading, this.fadeOut()])
		.then(this.fadeIn.bind(this));
	},

	fadeOut: function() {
		const oldContainer = this.oldContainer;
		oldContainer.classList.toggle('fade-out');
		
		return new Promise(function(resolve, reject) {
			window.setTimeout(resolve, 1000);
		});
	},
	
	fadeIn: function() {
		this.newContainer.classList.toggle('fade-in');
		this.done();
	}
});

Barba.Pjax.getTransition = function() {
	return FadeTransition;
};

document.addEventListener("DOMContentLoaded", function(event){
	Barba.Prefetch.init();
	Barba.Pjax.start();
});

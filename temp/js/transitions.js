"use strict";var timeOut,getPagename=function(t){return t.substring(t.lastIndexOf("/")+1).replace(".html","")},initNav=function(t){var e=getPagename(t),n=document.getElementById(e+"-link");n&&setNavOutline(n)},scrollToTop=function t(){0!=document.body.scrollTop||0!=document.documentElement.scrollTop?(window.scrollBy(0,-10),timeOut=setTimeout(t,5)):clearTimeout(timeOut)},removeNavOutlines=function(){var t=document.getElementsByClassName("nav-link");Array.prototype.forEach.call(t,function(t){t.classList.remove("active-nav")})},setNavOutline=function(t){removeNavOutlines(),t.classList.add("active-nav")},url=window.location.pathname;initNav(url);var progress,pausedIndex,swipers={},removeProjectOutlines=function(){var t=document.getElementsByClassName("active-project-link");Array.prototype.forEach.call(t,function(t){t.classList.remove("active-project-link")})},transitioningProject=!1,transitionOutCurrentProjectAndTriggerIn=function(t,e){removeProjectOutlines();var n=document.getElementsByClassName("active-project-main");if(scrollToTop(),n.length>0){var i=n[0];i.addEventListener("transitionend",function n(){var a=swipers[i.id];a&&a.autoplay.start(),i.classList.add("nodisplay"),i.removeEventListener("transitionend",n),transitionInProject(t,e)}),i.classList.remove("active-project-main")}else transitionInProject(t,e)},transitionInProject=function(t,e){e.classList.add("active-project-link"),t.classList.remove("nodisplay"),t.classList.add("active-project-main");t.addEventListener("transitionend",function e(){var n=swipers[t.id];n&&n.autoplay.start(),transitioningProject=!1,t.removeEventListener("transitionend",e)})},showProject=function(t){if(!transitioningProject){transitioningProject=!0;var e=t.id.replace("-link",""),n=document.getElementById(e+"-main");n?transitionOutCurrentProjectAndTriggerIn(n,t):transitioningProject=!1}},startWork=function(){var t=window.location.hash;if(t){var e=t.replace("#",""),n=document.getElementById(e+"-link");n.classList.add("active-project-link"),showProject(n)}else{var i=document.getElementsByClassName("project-link");showProject(i[0])}var a=document.getElementsByClassName("swiper-container");Array.prototype.forEach.call(a,function(t){var e,n;e=t,(n=new Swiper(e,{lazy:{loadPrevNext:!0},direction:"horizontal",loop:!0,autoplay:{delay:1e4},pagination:{el:".swiper-pagination"},navigation:{nextEl:".swiper-button-next",prevEl:".swiper-button-prev"}})).autoplay.stop(),swipers[e.parentNode.id]=n})},transitionOutTrivium=function(t){var e=document.getElementById("trivia-wrapper"),n=document.getElementsByClassName("active-trivium");if(e&&n.length>0){var i=n[0];e.addEventListener("transitionend",function n(){i.classList.remove("active-trivium"),e.removeEventListener("transitionend",n),window.setTimeout(function(){transitionInTrivium(t)},100)}),e.classList.add("inactive-trivia-wrapper")}},transitionInTrivium=function(t){var e=document.getElementById("trivia-wrapper"),n=document.getElementsByClassName("trivium");if(n.length>0){var i=n[t];progress.value=0;e.addEventListener("transitionend",function i(){var a=(t+1)%n.length;e.removeEventListener("transitionend",i),progressStep(a)});e.classList.remove("inactive-trivia-wrapper"),i.classList.add("active-trivium")}},triviaPaused=!1,pauseTrivia=function(){triviaPaused=!0},resumeTrivia=function(){triviaPaused=!1,window.requestAnimationFrame(function(){progressStep(pausedIndex)})},progressStep=function t(e){progress.value>=800?transitionOutTrivium(e):triviaPaused?triviaPaused&&(pausedIndex=e):(progress.value++,window.requestAnimationFrame(function(){t(e)}))},startTrivia=function(){progress=document.getElementById("trivia-progress"),window.requestAnimationFrame(function(){progressStep(1)})},socialHover=function(t){t.childNodes[1].childNodes[1].classList.toggle("social-active")};Barba.Dispatcher.on("newPageReady",function(t){initNav(t.url);var e=getPagename(t.url);"work"==e?startWork():"about"==e&&startTrivia()}),Barba.Dispatcher.on("initStateChange",function(){"function"==typeof ga&&ga("send","pageview",location.pathname)});var FadeTransition=Barba.BaseTransition.extend({start:function(){Promise.all([this.newContainerLoading,this.fadeOut()]).then(this.fadeIn.bind(this))},fadeOut:function(){return this.oldContainer.classList.toggle("fade-out"),new Promise(function(t,e){window.setTimeout(t,1e3)})},fadeIn:function(){this.newContainer.classList.toggle("fade-in"),this.done()}});Barba.Pjax.getTransition=function(){return FadeTransition},document.addEventListener("DOMContentLoaded",function(t){Barba.Prefetch.init(),Barba.Pjax.start()});
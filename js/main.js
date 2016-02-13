;(function(window) {

    'use strict';

    var support = { transitions: Modernizr.csstransitions, animations : Modernizr.cssanimations },
    // transition end event name
        transEndEventNames = { 'WebkitTransition': 'webkitTransitionEnd', 'MozTransition': 'transitionend', 'OTransition': 'oTransitionEnd', 'msTransition': 'MSTransitionEnd', 'transition': 'transitionend' },
        transEndEventName = transEndEventNames[ Modernizr.prefixed( 'transition' ) ],
        onEndTransition = function( el, callback ) {
            var onEndCallbackFn = function( ev ) {
                if( support.transitions ) {
                    if( ev.target != this ) return;
                    this.removeEventListener( transEndEventName, onEndCallbackFn );
                }
                if( callback && typeof callback === 'function' ) { callback.call(this); }
            };
            if( support.transitions ) {
                el.addEventListener( transEndEventName, onEndCallbackFn );
            }
            else {
                onEndCallbackFn();
            }
        },
        animEndEventNames = { 'WebkitAnimation' : 'webkitAnimationEnd', 'OAnimation' : 'oAnimationEnd', 'msAnimation' : 'MSAnimationEnd', 'animation' : 'animationend' },
        animEndEventName = animEndEventNames[ Modernizr.prefixed( 'animation' ) ],
        onEndAnimation = function( el, callback ) {
            var onEndCallbackFn = function( ev ) {
                if( support.animations ) {
                    if( ev.target != this ) return;
                    this.removeEventListener( animEndEventName, onEndCallbackFn );
                }
                if( callback && typeof callback === 'function' ) { callback.call(); }
            };
            if( support.animations ) {
                el.addEventListener( animEndEventName, onEndCallbackFn );
            }
            else {
                onEndCallbackFn();
            }
        },
    // the pages wrapper
        stack = document.querySelector('.pages-stack'),
    // the page elements
        pages = [].slice.call(stack.children),
    // total number of page elements
        pagesTotal = pages.length,
    // index of current page
        current = 1,
    // menu button
        menuCtrl = document.querySelector('button.menu-button'),
    // the navigation wrapper
        nav = document.querySelector('.pages-nav'),
    // the menu nav items
        navItems = [].slice.call(nav.querySelectorAll('.link--page')),
    // check if menu is open
        isMenuOpen = false;

    function init() {
        buildStack();
        initEvents();
        init2();
    }

    function buildStack() {
        var stackPagesIdxs = getStackPagesIdxs();

        // set z-index, opacity, initial transforms to pages and add class page--inactive to all except the current one
        for(var i = 0; i < pagesTotal; ++i) {
            var page = pages[i],
                posIdx = stackPagesIdxs.indexOf(i);

            if( current !== i ) {
                classie.add(page, 'page--inactive');

                if( posIdx !== -1 ) {
                    // visible pages in the stack
                    page.style.WebkitTransform = 'translate3d(0,100%,0)';
                    page.style.transform = 'translate3d(0,100%,0)';
                }
                else {
                    // invisible pages in the stack
                    page.style.WebkitTransform = 'translate3d(0,75%,-300px)';
                    page.style.transform = 'translate3d(0,75%,-300px)';
                }
            }
            else {
                classie.remove(page, 'page--inactive');
            }

            page.style.zIndex = i < current ? parseInt(current - i) : parseInt(pagesTotal + current - i);

            if( posIdx !== -1 ) {
                page.style.opacity = parseFloat(1 - 0.1 * posIdx);
            }
            else {
                page.style.opacity = 0;
            }
        }
    }

    // event binding
    function initEvents() {
        // menu button click
        menuCtrl.addEventListener('click', toggleMenu);

        // navigation menu clicks
        navItems.forEach(function(item) {
            // which page to open?
            var pageid = item.getAttribute('href').slice(1);
            item.addEventListener('click', function(ev) {
                ev.preventDefault();
                openPage(pageid);
            });
        });

        // clicking on a page when the menu is open triggers the menu to close again and open the clicked page
        pages.forEach(function(page) {
            var pageid = page.getAttribute('id');
            page.addEventListener('click', function(ev) {
                if( isMenuOpen ) {
                    ev.preventDefault();
                    openPage(pageid);
                }
            });
        });

        // keyboard navigation events
        document.addEventListener( 'keydown', function( ev ) {
            if( !isMenuOpen ) return;
            var keyCode = ev.keyCode || ev.which;
            if( keyCode === 27 ) {
                closeMenu();
            }
        } );
    }

    // toggle menu fn
    function toggleMenu() {
        if( isMenuOpen ) {
            closeMenu();
        }
        else {
            openMenu();
            isMenuOpen = true;
        }
    }

    // opens the menu
    function openMenu() {
        // toggle the menu button
        classie.add(menuCtrl, 'menu-button--open')
        // stack gets the class "pages-stack--open" to add the transitions
        classie.add(stack, 'pages-stack--open');
        // reveal the menu
        classie.add(nav, 'pages-nav--open');

        // now set the page transforms
        var stackPagesIdxs = getStackPagesIdxs();
        for(var i = 0, len = stackPagesIdxs.length; i < len; ++i) {
            var page = pages[stackPagesIdxs[i]];
            page.style.WebkitTransform = 'translate3d(0, 75%, ' + parseInt(-1 * 200 - 50*i) + 'px)'; // -200px, -230px, -260px
            page.style.transform = 'translate3d(0, 75%, ' + parseInt(-1 * 200 - 50*i) + 'px)';
        }
    }

    // closes the menu
    function closeMenu() {
        // same as opening the current page again
        openPage();
    }

    // opens a page
    function openPage(id) {
        var futurePage = id ? document.getElementById(id) : pages[current],
            futureCurrent = pages.indexOf(futurePage),
            stackPagesIdxs = getStackPagesIdxs(futureCurrent);

        // set transforms for the new current page
        futurePage.style.WebkitTransform = 'translate3d(0, 0, 0)';
        futurePage.style.transform = 'translate3d(0, 0, 0)';
        futurePage.style.opacity = 1;

        // set transforms for the other items in the stack
        for(var i = 0, len = stackPagesIdxs.length; i < len; ++i) {
            var page = pages[stackPagesIdxs[i]];
            page.style.WebkitTransform = 'translate3d(0,100%,0)';
            page.style.transform = 'translate3d(0,100%,0)';
        }

        // set current
        if( id ) {
            current = futureCurrent;
        }

        // close menu..
        classie.remove(menuCtrl, 'menu-button--open');
        classie.remove(nav, 'pages-nav--open');
        onEndTransition(futurePage, function() {
            classie.remove(stack, 'pages-stack--open');
            // reorganize stack
            buildStack();
            isMenuOpen = false;
        });
    }

    // gets the current stack pages indexes. If any of them is the excludePage then this one is not part of the returned array
    function getStackPagesIdxs(excludePageIdx) {
        var nextStackPageIdx = current + 1 < pagesTotal ? current + 1 : 0,
            nextStackPageIdx_2 = current + 2 < pagesTotal ? current + 2 : 1,
            idxs = [],

            excludeIdx = excludePageIdx || -1;

        if( excludePageIdx != current ) {
            idxs.push(current);
        }
        if( excludePageIdx != nextStackPageIdx ) {
            idxs.push(nextStackPageIdx);
        }
        if( excludePageIdx != nextStackPageIdx_2 ) {
            idxs.push(nextStackPageIdx_2);
        }

        return idxs;
    }

    // from http://www.sberry.me/articles/javascript-event-throttling-debouncing
    function throttle(fn, delay) {
        var allowSample = true;

        return function(e) {
            if (allowSample) {
                allowSample = false;
                setTimeout(function() { allowSample = true; }, delay);
                fn(e);
            }
        };
    }

    // sliders - flickity
    var sliders = [].slice.call(document.querySelectorAll('.slider')),
    // array where the flickity instances are going to be stored
        flkties = [],
    // grid element
        grid = document.querySelector('.grid'),
    // isotope instance
        iso,
    // filter ctrls
        filterCtrls = [].slice.call(document.querySelectorAll('.filter > button')),
    // cart
        cart = document.querySelector('.cart'),
        cartItems = cart.querySelector('.cart__count');

    function init2() {
        // preload images
        imagesLoaded(grid, function() {
            initFlickity();
            initIsotope();
            initEvents2();
            classie.remove(grid, 'grid--loading');
        });
    }

    function initFlickity() {
        sliders.forEach(function(slider){
            var flkty = new Flickity(slider, {
                prevNextButtons: false,
                wrapAround: true,
                cellAlign: 'center',
                contain: true,
                resize: false
            });

            // store flickity instances
            flkties.push(flkty);
        });
    }

    function initIsotope() {
        iso = new Isotope( grid, {
            isResizeBound: false,
            itemSelector: '.grid__item',
            percentPosition: true,
            masonry: {
                // use outer width of grid-sizer for columnWidth
                columnWidth: '.grid__sizer'
            },
            transitionDuration: '0.6s'
        });
    }

    function initEvents2() {
        filterCtrls.forEach(function(filterCtrl) {
            filterCtrl.addEventListener('click', function() {
                classie.remove(filterCtrl.parentNode.querySelector('.filter__item--selected'), 'filter__item--selected');
                classie.add(filterCtrl, 'filter__item--selected');
                iso.arrange({
                    filter: filterCtrl.getAttribute('data-filter')
                });
                recalcFlickities();
                iso.layout();
            });
        });

        // window resize / recalculate sizes for both flickity and isotope/masonry layouts
        window.addEventListener('resize', throttle(function(ev) {
            recalcFlickities()
            iso.layout();
        }, 50));

        // add to cart
        [].slice.call(grid.querySelectorAll('.grid__item')).forEach(function(item) {
            item.querySelector('.action--buy').addEventListener('click', addToCart);
        });
    }

    function addToCart() {
        classie.add(cart, 'cart--animate');
        setTimeout(function() {cartItems.innerHTML = Number(cartItems.innerHTML) + 1;}, 200);
        onEndAnimation(cartItems, function() {
            classie.remove(cart, 'cart--animate');
        });
    }

    function recalcFlickities() {
        for(var i = 0, len = flkties.length; i < len; ++i) {
            flkties[i].resize();
        }
    }

    init();

})(window);
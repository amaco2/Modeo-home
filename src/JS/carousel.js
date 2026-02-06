// Carousel functionality for home page
class Carousel
{
    constructor( containerSelector, options = {} )
    {
        this.container = document.querySelector( containerSelector );
        if ( !this.container ) return;

        this.slides = this.container.querySelectorAll( '.carousel-slide' );
        this.currentIndex = 0;
        this.autoScroll = options.autoScroll !== false;
        this.intervalTime = options.intervalTime || 5000;
        this.interval = null;

        this.init();
    }

    init()
    {
        this.showSlide( this.currentIndex );
        this.addEventListeners();
        if ( this.autoScroll )
        {
            this.startAutoScroll();
        }
    }

    showSlide( index )
    {
        this.slides.forEach( ( slide, i ) =>
        {
            slide.style.display = i === index ? 'block' : 'none';
        } );
    }

    nextSlide()
    {
        this.currentIndex = ( this.currentIndex + 1 ) % this.slides.length;
        this.showSlide( this.currentIndex );
    }

    prevSlide()
    {
        this.currentIndex = ( this.currentIndex - 1 + this.slides.length ) % this.slides.length;
        this.showSlide( this.currentIndex );
    }

    goToSlide( index )
    {
        this.currentIndex = index;
        this.showSlide( this.currentIndex );
    }

    startAutoScroll()
    {
        this.interval = setInterval( () =>
        {
            this.nextSlide();
        }, this.intervalTime );
    }

    stopAutoScroll()
    {
        if ( this.interval )
        {
            clearInterval( this.interval );
            this.interval = null;
        }
    }

    addEventListeners()
    {
        // Touch events for swipe
        let startX = 0;
        let endX = 0;

        this.container.addEventListener( 'touchstart', ( e ) =>
        {
            startX = e.touches[ 0 ].clientX;
            this.stopAutoScroll();
        } );

        this.container.addEventListener( 'touchend', ( e ) =>
        {
            endX = e.changedTouches[ 0 ].clientX;
            this.handleSwipe( startX, endX );
            if ( this.autoScroll )
            {
                this.startAutoScroll();
            }
        } );

        // Mouse events for desktop
        this.container.addEventListener( 'mousedown', ( e ) =>
        {
            startX = e.clientX;
            this.stopAutoScroll();
        } );

        this.container.addEventListener( 'mouseup', ( e ) =>
        {
            endX = e.clientX;
            this.handleSwipe( startX, endX );
            if ( this.autoScroll )
            {
                this.startAutoScroll();
            }
        } );
    }

    handleSwipe( startX, endX )
    {
        const diff = startX - endX;
        const threshold = 50;

        if ( Math.abs( diff ) > threshold )
        {
            if ( diff > 0 )
            {
                this.nextSlide();
            } else
            {
                this.prevSlide();
            }
        }
    }
}

// Initialize carousel on home page
document.addEventListener( 'DOMContentLoaded', function ()
{
    // if ( document.body.classList.contains( 'home-page' ) )
    // {
    new Carousel( '.carousel-container' );
    // }
} );

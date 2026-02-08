// Scrollable carousel with pointer drag + buttons
class CarouselScroller
{
    constructor( container )
    {
        this.container = container;
        this.track = this.container.querySelector( '.carousel-track' );
        if ( !this.track ) return;

        this.items = Array.from( this.track.querySelectorAll( '.carousel-card' ) );

        const section = this.container.closest( '.carousel-section' );
        this.prevBtn = section ? section.querySelector( '.carousel-prev' ) : null;
        this.nextBtn = section ? section.querySelector( '.carousel-next' ) : null;

        this.isDown = false;
        this.startX = 0;
        this.startScrollLeft = 0;
        this.rafId = null;

        this.bindEvents();
        this.updateCenter();
    }

    getScrollAmount()
    {
        const item = this.track.querySelector( '.carousel-card' );
        if ( !item )
        {
            return this.container.clientWidth * 0.8;
        }

        const itemWidth = item.getBoundingClientRect().width;
        const styles = window.getComputedStyle( this.track );
        const gap = parseFloat( styles.gap || '0' );
        return itemWidth + gap;
    }

    scrollByAmount( amount )
    {
        this.track.scrollBy( { left: amount, behavior: 'smooth' } );
    }

    scrollNext()
    {
        this.scrollByAmount( this.getScrollAmount() );
    }

    scrollPrev()
    {
        this.scrollByAmount( -this.getScrollAmount() );
    }

    onPointerDown( e )
    {
        this.isDown = true;
        this.track.classList.add( 'is-dragging' );
        this.startX = e.pageX;
        this.startScrollLeft = this.track.scrollLeft;
        this.track.setPointerCapture( e.pointerId );
    }

    onPointerMove( e )
    {
        if ( !this.isDown ) return;
        const walk = ( e.pageX - this.startX );
        this.track.scrollLeft = this.startScrollLeft - walk;
    }

    onPointerUp( e )
    {
        this.isDown = false;
        this.track.classList.remove( 'is-dragging' );
        this.track.releasePointerCapture( e.pointerId );
    }

    bindEvents()
    {
        if ( this.prevBtn )
        {
            this.prevBtn.addEventListener( 'click', () => this.scrollPrev() );
        }

        if ( this.nextBtn )
        {
            this.nextBtn.addEventListener( 'click', () => this.scrollNext() );
        }

        if ( window.PointerEvent )
        {
            this.track.addEventListener( 'pointerdown', ( e ) => this.onPointerDown( e ) );
            this.track.addEventListener( 'pointermove', ( e ) => this.onPointerMove( e ) );
            this.track.addEventListener( 'pointerup', ( e ) => this.onPointerUp( e ) );
            this.track.addEventListener( 'pointerleave', ( e ) => this.onPointerUp( e ) );
        } else
        {
            let startX = 0;
            let startScrollLeft = 0;

            this.track.addEventListener( 'touchstart', ( e ) =>
            {
                startX = e.touches[ 0 ].pageX;
                startScrollLeft = this.track.scrollLeft;
            }, { passive: true } );

            this.track.addEventListener( 'touchmove', ( e ) =>
            {
                const walk = ( e.touches[ 0 ].pageX - startX );
                this.track.scrollLeft = startScrollLeft - walk;
            }, { passive: true } );

            this.track.addEventListener( 'mousedown', ( e ) =>
            {
                this.isDown = true;
                this.startX = e.pageX;
                this.startScrollLeft = this.track.scrollLeft;
            } );

            window.addEventListener( 'mouseup', () =>
            {
                this.isDown = false;
            } );

            window.addEventListener( 'mousemove', ( e ) =>
            {
                if ( !this.isDown ) return;
                const walk = ( e.pageX - this.startX );
                this.track.scrollLeft = this.startScrollLeft - walk;
            } );
        }

        this.track.addEventListener( 'scroll', () => this.scheduleCenterUpdate() );
        window.addEventListener( 'resize', () => this.scheduleCenterUpdate() );
    }

    scheduleCenterUpdate()
    {
        if ( this.rafId ) return;
        this.rafId = window.requestAnimationFrame( () =>
        {
            this.rafId = null;
            this.updateCenter();
        } );
    }

    updateCenter()
    {
        if ( !this.items.length ) return;
        const trackRect = this.track.getBoundingClientRect();
        const centerX = trackRect.left + ( trackRect.width / 2 );
        let closest = null;
        let closestDistance = Infinity;

        this.items.forEach( item =>
        {
            const rect = item.getBoundingClientRect();
            const itemCenter = rect.left + ( rect.width / 2 );
            const distance = Math.abs( itemCenter - centerX );
            if ( distance < closestDistance )
            {
                closestDistance = distance;
                closest = item;
            }
        } );

        this.items.forEach( item =>
        {
            item.classList.toggle( 'is-center', item === closest );
        } );
    }
}

document.addEventListener( 'DOMContentLoaded', function ()
{
    document.querySelectorAll( '.carousel-container' ).forEach( container =>
    {
        new CarouselScroller( container );
    } );
} );

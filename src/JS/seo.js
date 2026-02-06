// SEO enhancements
class SEOEnhancer
{
    constructor()
    {
        this.init();
    }

    init()
    {
        this.addStructuredData();
        this.optimizeMetaTags();
        this.addBreadcrumbs();
    }

    addStructuredData()
    {
        // Add JSON-LD structured data for better SEO
        const script = document.createElement( 'script' );
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify( {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Modeo",
            "url": window.location.origin,
            "description": "Modeo — boutique en ligne: collections sélectionnées, livraison rapide et design épuré.",
            "potentialAction": {
                "@type": "SearchAction",
                "target": `${ window.location.origin }/search?q={search_term_string}`,
                "query-input": "required name=search_term_string"
            },
            "publisher": {
                "@type": "Organization",
                "name": "Modeo",
                "logo": {
                    "@type": "ImageObject",
                    "url": `${ window.location.origin }/logo.png`
                }
            }
        } );
        document.head.appendChild( script );
    }

    optimizeMetaTags()
    {
        // Ensure meta tags are present and optimized
        const metaTags = [
            { name: 'robots', content: 'index, follow' },
            { name: 'author', content: 'Modeo Team' },
            { name: 'language', content: 'fr-FR' },
            { property: 'og:locale', content: 'fr_FR' },
            { name: 'twitter:card', content: 'summary_large_image' }
        ];

        metaTags.forEach( tag =>
        {
            let meta = document.querySelector( `meta[${ Object.keys( tag ).find( key => key !== 'content' ) }="${ tag[ Object.keys( tag ).find( key => key !== 'content' ) ] }"]` );
            if ( !meta )
            {
                meta = document.createElement( 'meta' );
                Object.keys( tag ).forEach( key => meta.setAttribute( key, tag[ key ] ) );
                document.head.appendChild( meta );
            }
        } );
    }

    addBreadcrumbs()
    {
        // Add breadcrumb navigation for better SEO
        const breadcrumbContainer = document.querySelector( '.breadcrumb-container' );
        if ( breadcrumbContainer )
        {
            const breadcrumbs = [
                { name: 'Accueil', url: '/' },
                { name: 'Produits', url: '/products' }
            ];

            const breadcrumbList = document.createElement( 'ol' );
            breadcrumbList.className = 'breadcrumb';
            breadcrumbList.setAttribute( 'itemscope', '' );
            breadcrumbList.setAttribute( 'itemtype', 'https://schema.org/BreadcrumbList' );

            breadcrumbs.forEach( ( crumb, index ) =>
            {
                const li = document.createElement( 'li' );
                li.className = 'breadcrumb-item';
                li.setAttribute( 'itemprop', 'itemListElement' );
                li.setAttribute( 'itemscope', '' );
                li.setAttribute( 'itemtype', 'https://schema.org/ListItem' );

                const a = document.createElement( 'a' );
                a.href = crumb.url;
                a.setAttribute( 'itemprop', 'item' );
                a.innerHTML = `<span itemprop="name">${ crumb.name }</span>`;

                const meta = document.createElement( 'meta' );
                meta.setAttribute( 'itemprop', 'position' );
                meta.content = ( index + 1 ).toString();

                li.appendChild( a );
                li.appendChild( meta );
                breadcrumbList.appendChild( li );
            } );

            breadcrumbContainer.appendChild( breadcrumbList );
        }
    }
}

// Initialize SEO enhancements
document.addEventListener( 'DOMContentLoaded', function ()
{
    new SEOEnhancer();
} );

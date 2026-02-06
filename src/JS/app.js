class Product
{
    constructor( id, name, price, image, category, desc )
    {
        this.id = id;
        this.name = name;
        this.price = price;
        this.image = image;
        this.category = category;
        this.desc = desc;
    }
}

class ProductList
{
    constructor( products = [] )
    {
        this.products = products;
    }

    filter( { text = '', category = 'all' } = {} )
    {
        return this.products.filter( p =>
        {
            const matchText = p.name.toLowerCase().includes( text.toLowerCase() ) || p.desc.toLowerCase().includes( text.toLowerCase() );
            const matchCat = category === 'all' ? true : p.category === category;
            return matchText && matchCat;
        } );
    }

    renderGrid( rootSelector, items )
    {
        const root = document.querySelector( rootSelector );
        if ( !root ) return;
        root.innerHTML = items.map( p => this._cardHtml( p ) ).join( '' );
    }

    _cardHtml( p )
    {
        return `
      <div class="col-sm-6 col-md-4 col-lg-3">
        <div class="card card-product h-100">
          <img src="${ p.image }" class="card-img-top" alt="${ p.name }">
          <div class="card-body d-flex flex-column">
            <div class="mb-2">
              <div class="product-title">${ p.name }</div>
              <div class="text-muted small">${ p.category }</div>
            </div>
            <div class="mt-auto d-flex justify-content-between align-items-center">
              <div class="price">€${ Number( p.price ) }</div>
              <button class="btn btn-sm btn-outline-primary add-to-cart" data-id="${ p.id }">Ajouter</button>
            </div>
          </div>
        </div>
      </div>
    `;
    }
}

class Cart
{
    constructor()
    {
        this.items = new Map();
    }

    add( product )
    {
        const prev = this.items.get( product.id ) || { product, qty: 0 };
        prev.qty += 1;
        this.items.set( product.id, prev );
        this._updateBadge();
    }

    remove( id )
    {
        this.items.delete( id );
        this._updateBadge();
    }

    changeQty( id, qty )
    {
        const it = this.items.get( id );
        if ( !it ) return;
        it.qty = Math.max( 0, qty );
        if ( it.qty === 0 ) this.items.delete( id );
        this._updateBadge();
    }

    itemsArray()
    {
        return Array.from( this.items.values() );
    }

    total()
    {
        let t = 0;
        for ( const v of this.items.values() ) t += Number( v.product.price ) * v.qty;
        return t;
    }

    count()
    {
        let c = 0;
        for ( const v of this.items.values() ) c += v.qty;
        return c;
    }

    _updateBadge()
    {
        const el = document.getElementById( 'cart-count' );
        if ( el ) el.textContent = String( this.count() );
    }
}

( function ()
{
    const sample = [
        new Product( 1, 'Bougie parfumée', '12.00', 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=60', 'home', 'Bougie naturelle' ),
        new Product( 2, 'Tasse céramique', '18.50', 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=60', 'home', 'Tasse artisanale' ),
        new Product( 3, 'Sweat à capuche', '49.99', 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=60', 'fashion', 'Confort quotidien' ),
        new Product( 4, 'Casque Bluetooth', '89.00', 'https://images.unsplash.com/photo-1518447025370-9f0c9d267b1f?auto=format&fit=crop&w=800&q=60', 'tech', 'Audio sans fil' ),
        new Product( 5, 'Lampe design', '59.00', 'https://images.unsplash.com/photo-1505691723518-36a2a22e17f6?auto=format&fit=crop&w=800&q=60', 'home', 'Éclairage moderne' ),
        new Product( 6, 'Sac en cuir', '120.00', 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=60', 'fashion', 'Sac premium' ),
        new Product( 7, 'Clavier mécanique', '99.00', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=60', 'tech', 'Pour productivité' ),
        new Product( 8, 'Plaid doux', '34.00', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=60', 'home', 'Chaleur et confort' )
    ];

    const list = new ProductList( sample );
    const cart = new Cart();

    document.addEventListener( 'DOMContentLoaded', () =>
    {
        // Home featured
        if ( document.getElementById( 'featured-products' ) )
        {
            list.renderGrid( '#featured-products', sample.slice( 0, 4 ) );
        }

        // Products page
        if ( document.getElementById( 'product-list' ) )
        {
            const render = () =>
            {
                const q = document.getElementById( 'search' ).value || '';
                const cat = document.getElementById( 'category' ).value || 'all';
                const items = list.filter( { text: q, category: cat } );
                list.renderGrid( '#product-list', items );
            };

            document.getElementById( 'search' ).addEventListener( 'input', render );
            document.getElementById( 'category' ).addEventListener( 'change', render );
            render();
        }

        // Event delegation for add-to-cart
        document.body.addEventListener( 'click', ( e ) =>
        {
            const btn = e.target.closest( '.add-to-cart' );
            if ( !btn ) return;
            const id = Number( btn.dataset.id );
            const prod = sample.find( p => p.id === id );
            if ( prod )
            {
                cart.add( prod );
                // feedback
                btn.classList.remove( 'btn-outline-primary' );
                btn.classList.add( 'btn-primary' );
                setTimeout( () =>
                {
                    btn.classList.add( 'btn-outline-primary' );
                    btn.classList.remove( 'btn-primary' );
                }, 600 );
            }
        } );

        // cart modal handling
        const cartBtn = document.getElementById( 'cart-btn' );
        const cartModalEl = document.getElementById( 'cartModal' );
        const bsModal = cartModalEl ? new bootstrap.Modal( cartModalEl ) : null;

        function renderCart()
        {
            if ( !cartModalEl ) return;
            const container = cartModalEl.querySelector( '#cart-items' );
            const items = cart.itemsArray();
            if ( items.length === 0 )
            {
                container.innerHTML = '<div class="text-muted">Votre panier est vide.</div>';
                cartModalEl.querySelector( '#cart-total' ).textContent = '€0.00';
                return;
            }
            container.innerHTML = items.map( i => `
                        <div class="cart-item">
                            <img src="${ i.product.image }" alt="${ i.product.name }">
                            <div class="meta">
                                <div class="fw-semibold">${ i.product.name }</div>
                                <div class="text-muted small">€${ Number( i.product.price ).toFixed( 2 ) } × ${ i.qty }</div>
                            </div>
                            <div class="qty-controls">
                                <button class="btn btn-sm btn-outline-secondary cart-decrease" data-id="${ i.product.id }">−</button>
                                <div class="px-2">${ i.qty }</div>
                                <button class="btn btn-sm btn-outline-secondary cart-increase" data-id="${ i.product.id }">+</button>
                                <button class="btn btn-sm btn-link text-danger cart-remove" data-id="${ i.product.id }">Supprimer</button>
                            </div>
                        </div>
                    `).join( '' );
            cartModalEl.querySelector( '#cart-total' ).textContent = '€' + cart.total().toFixed( 2 );
        }

        if ( cartBtn )
        {
            cartBtn.addEventListener( 'click', () =>
            {
                renderCart();
                if ( bsModal ) bsModal.show();
            } );
        }

        if ( cartModalEl )
        {
            cartModalEl.addEventListener( 'click', ( e ) =>
            {
                const inc = e.target.closest( '.cart-increase' );
                const dec = e.target.closest( '.cart-decrease' );
                const rem = e.target.closest( '.cart-remove' );
                if ( inc ) { cart.changeQty( Number( inc.dataset.id ), ( cart.items.get( Number( inc.dataset.id ) ).qty || 0 ) + 1 ); renderCart(); }
                if ( dec ) { const id = Number( dec.dataset.id ); const current = ( cart.items.get( id ) || { qty: 0 } ).qty; cart.changeQty( id, current - 1 ); renderCart(); }
                if ( rem ) { cart.remove( Number( rem.dataset.id ) ); renderCart(); }
            } );
        }
    } );
} )();

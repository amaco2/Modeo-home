import { Connexion } from "./Class.js";
import { URL } from "../URL/Url.js";

const setLoading = ( btn, isLoading ) =>
{
    if ( !btn ) return;
    if ( isLoading )
    {
        btn.dataset.originalText = btn.textContent;
        btn.textContent = "Connexion...";
        btn.classList.add( "is-loading" );
        btn.disabled = true;
    } else
    {
        btn.textContent = btn.dataset.originalText || "Se connecter";
        btn.classList.remove( "is-loading" );
        btn.disabled = false;
    }
};

const connexion = () =>
{
    const form = document.querySelector( "#form-connexion" );
    if ( !form ) return;

    const submitBtn = form.querySelector( 'button[type="submit"]' );
    const errorEl = form.querySelector( ".form-error" );

    form.addEventListener( "submit", async ( e ) =>
    {
        e.preventDefault();
        if ( errorEl ) errorEl.textContent = "";

        form.classList.add( "was-validated" );
        if ( !form.checkValidity() ) return;

        const email = form.querySelector( "#email-login" )?.value || "";
        const password = form.querySelector( "#password-login" )?.value || "";
        if ( !email || !password ) return;

        const payload = new Connexion( email, password ).infosUi();

        setLoading( submitBtn, true );
        form.setAttribute( "aria-busy", "true" );

        try
        {
            const res = await fetch( `${ URL() }/api/auth/login.php`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify( payload )
            } );

            if ( !res.ok )
            {
                throw new Error( "Connexion impossible. Vérifiez vos identifiants." );
            }
            await res.json();
        } catch ( err )
        {
            if ( errorEl ) errorEl.textContent = err.message || "Une erreur est survenue.";
        } finally
        {
            setLoading( submitBtn, false );
            form.removeAttribute( "aria-busy" );
        }
    } );
};

connexion();

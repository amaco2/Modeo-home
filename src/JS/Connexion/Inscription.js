import { Inscription } from "./Class.js";
import { URL } from "../URL/Url.js";


const setLoading = ( btn, isLoading ) =>
{
    if ( !btn ) return;
    if ( isLoading )
    {
        btn.dataset.originalText = btn.textContent;
        btn.textContent = "Création...";
        btn.classList.add( "is-loading" );
        btn.disabled = true;
    } else
    {
        btn.textContent = btn.dataset.originalText || "S'inscrire";
        btn.classList.remove( "is-loading" );
        btn.disabled = false;
    }
};

const inscription = async () =>
{
    const form = document.querySelector( "#form-inscription" );
    if ( !form ) return;

    const submitBtn = form.querySelector( 'button[type="submit"]' );
    const errorEl = form.querySelector( ".form-error" );

    form.addEventListener( "submit", async ( e ) =>
    {
        e.preventDefault();
        if ( errorEl ) errorEl.textContent = "";

        const password = form.querySelector( "#password" );
        const confirmPassword = form.querySelector( "#password-confirm" );
        if ( password && confirmPassword )
        {
            if ( password.value !== confirmPassword.value )
            {
                confirmPassword.setCustomValidity( "mismatch" );
            } else
            {
                confirmPassword.setCustomValidity( "" );
            }
        }

        form.classList.add( "was-validated" );
        if ( !form.checkValidity() ) return;

        const name = form.querySelector( "#name" )?.value || "";
        const email = form.querySelector( "#email" )?.value || "";
        if ( !name || !email || !password?.value ) return;

        const payload = new Inscription( name, email, password.value ).infosUi();

        setLoading( submitBtn, true );
        form.setAttribute( "aria-busy", "true" );

        try
        {
            const res = await fetch( `${ URL() }/api/auth/register.php`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify( payload )
            } );

            if ( !res.ok )
            {
                throw new Error( "Inscription impossible. Vérifiez les informations." );
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

inscription();

import { Connexion } from "./Class.js";
import { URL } from "../URL/Url.js";

class SubmitData
{
    constructor( formElement )
    {
        this._formElement = formElement;
    }
    connexion()
    {
        let email = "";
        let password = "";

        for ( const input of this._formElement )
        {
            if ( input.name === "email" ) email = input.value;
            if ( input.name === "password" ) password = input.value;
        }

        if ( !email || !password ) return null;
        let cnn = null;
        if ( email || password )
        {
            cnn = new Connexion( email, password );
            console.log( cnn.infosUi() );

        }
        if ( cnn ) return ( cnn.infosUi() );
    }
}

const connexion = () =>
{
    const data = document.querySelectorAll( "#form-connexion input" );
    const form = document.querySelector( "#form-connexion" );
    const cnn = new SubmitData( data );

    form.addEventListener( "submit", async ( e ) =>
    {
        e.preventDefault();

        const payload = cnn.connexion();
        if ( !payload ) return;

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

            const data = await res.json();
            console.log( "data", data );

        } catch ( err )
        {
            console.error( err.message );
        }
    } );

}
connexion();
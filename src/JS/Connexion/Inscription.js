import { Inscription } from "./Class.js";
import { URL } from "../URL/Url.js";


class SubmitData
{
    constructor( formElement )
    {
        this._formElement = formElement;
    }
    inscription()
    {
        let email = "";
        let confirmPassword = document.querySelector( '.confirm-password' ).value;
        let password = "";
        let name = "";

        if ( this._formElement )
        {
            for ( const input of this._formElement )
            {
                if ( input.name === "email" ) email = input.value;
                if ( input.name === "password" )
                {
                    if ( input.value === confirmPassword )
                    {
                        password = input.value
                    } else
                    {
                        console.log( "le mot de passe ne correspond pas!" );
                        return null;
                    }
                };
                if ( input.name === "name" ) name = input.value;
            }

            console.log( email, password, name )
            if ( !email || !password || !name ) return null;
            let cnn = null;
            if ( email || password || name )
            {
                cnn = new Inscription( name, email, password );
                console.log( cnn.infosUi() );

            }
            if ( cnn ) return ( cnn.infosUi() );
        } else
        {
            alert( "ERROR" )
        }
    }
}

const inscription = async () =>
{
    const data = document.querySelectorAll( "#form-inscription input" );
    const form = document.querySelector( "#form-inscription" );
    const cnn = new SubmitData( data );

    form.addEventListener( "submit", async ( e ) =>
    {
        e.preventDefault();

        console.log( cnn.inscription() );
        const payload = cnn.inscription();
        console.log( payload );

        // zone reserve au message d'ereur suite au mot de passe incorrect
        if ( !payload ) return;

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

            const data = await res.json();
            console.log( "data", data );

        } catch ( err )
        {
            console.error( err );
        }
    } );

}

inscription();
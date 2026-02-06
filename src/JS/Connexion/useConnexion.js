import { getInitials, stringToColor } from "./setInitialUser.js";




const useConnexion = ( response ) =>
{
    console.log( response );
    // gestion de l'etat de connexion de l'utilisateur
    let isConnect = false;
    const email = response.email

    if ( response )
    {
        isConnect = true;
    } else
    {
        throw new Error( "Utilisateur non reconu" );
    }

    console.log( "text", email )


    if ( isConnect )
    {
        const getUser = document.querySelector( '.nav-tiem-profil-user' );

        getUser.innerHTML =
            `<div 
            style="background-color: ${ stringToColor( email ) }"
            class = "profil-user">
           ${ getInitials( email ) }
            </div>`
    }
}

export { useConnexion };
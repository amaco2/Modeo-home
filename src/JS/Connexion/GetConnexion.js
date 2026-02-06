import { URL } from "../URL/Url.js";
import { useConnexion } from "./useConnexion.js";


// Recuperation de la session de connexion d'un utilisateur
async function getConnexionFromUI()
{
    const response = await fetch( `${ URL() }/api/auth/getUser.php`, {
        method: "GET",
        credentials: "include",
    } ).then( res => res.json() )
        .then( data =>
        {
            if ( data.aunthentificated )
            {
                console.log( "Utilisateur :", data.user, "connecte" );
                localStorage.setItem( 'user', data.user )
                return data.user;
            }
        } )
        .catch( err => console.error( err.message ) );

    useConnexion( response );
    // if ( response ) return { email: response.email, id: response.id, name: response.name };
}

getConnexionFromUI();

export { getConnexionFromUI };
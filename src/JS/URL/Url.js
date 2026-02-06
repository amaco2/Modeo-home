
// GetConnexion
class GetConnexion
{
    constructor( url )
    {
        this._url = url;
    }

    get url()
    {
        if ( !this._url ) return "URL invalide";
        return this._url;
    }
}

const URL = () =>
{
    const url = new GetConnexion( "http://localhost/backend_modeo_home/src" );
    return url.url;
}

export { URL };
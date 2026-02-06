
function getInitials( email )
{
    if ( !email ) return '?';

    const parts = email.split( '@' )[ 0 ].split( '' );
    if ( parts.length === 1 )
    {
        return parts[ 0 ].toUpperCase();
    }

    return parts[ 0 ].toUpperCase();
}

function stringToColor( str )
{
    let hash = 0;
    if ( !str )
    {
        return undefined;
    }
    for ( let i = 0; i < str.length; i++ )
    {
        hash = str.charCodeAt( i ) + ( ( hash << 5 ) - hash );
    }
    const c = ( hash & 0x00feffff ).toString( 16 ).toUpperCase();

    return '#' + '00000'.substring( 0, 6 - c.length ) + c;
}

export { stringToColor, getInitials };
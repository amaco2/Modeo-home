
// Class Users
class UsersInscription
{
    constructor( name, email, password )
    {
        this._name = name;
        this._email = email;
        this._password = password;
    }

    get name()
    {
        if ( !this._name ) return;
        return this._name;
    }
    get email()
    {
        if ( !this._email ) return;

        return this._email;
    }
    get password()
    {
        if ( !this._password ) return;
        return this._password;
    }
}

// User connexion

class UserConnexion
{
    constructor( email, password )
    {
        this._email = email;
        this._password = password;
    }
    get email()
    {
        if ( !this._email ) return;

        return this._email;
    }
    get password()
    {
        if ( !this._password ) return;
        return this._password;
    }
}

class Connexion extends UserConnexion
{
    constructor( email, password )
    {
        super( email, password );
    }

    infosUi()
    {
        if ( !super.email || !super.password )
        {
            console.log( 'email :', super.email, 'password :', this.password );
            return;
        }
        if ( super.email || super.password )
        {
            const email = super.email;
            const password = super.password
            return (
                { email, password }
            );
        }
    }
}
class Inscription extends UsersInscription
{
    constructor( name, email, password )
    {
        super( name, email, password );
    }

    infosUi()
    {
        if ( super.password || super.email || super.name )
        {
            const email = super.email;
            const password = super.password;
            const name = super.name;
            return (
                { email, password, name }
            );
        }
    }
}

export { Connexion, Inscription };
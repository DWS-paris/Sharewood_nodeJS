/* 
Function to check user cookie
*/
    const checkUser = () => {
        return new Promise( (resolve, reject) => {
            fetch('/api/auth/me')
        .then( response => {
            if( !response.ok ){ console.error('User not connected') }
            else{ return response.json() }
        })
        .then( data => resolve(data) )
        .catch( err => reject(err) )
        })
    }
//

/* 
Start interface
*/
    const socket = io();
//
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Api } from './api';

export interface USER_DATA {
  id : string;
  nickname : string;
  password : string;
  name : string;
  email: string;
  mobile : string;s
  gender : 'M';
  birth_year:string;
};

export interface USER_LOGIN_DATA {
    id: string;
    session_id: string;
}


@Injectable()
export class Member extends Api {
    constructor( http: Http, private storage: Storage ) {
        super( http );
    }

/*
    load( id: string ) {
        console.log('Member:load(): ', id);
    }
    */

    getRegisterBody( userData: USER_DATA ) {
        userData['action'] = 'member_register_submit';
        let body = this.postBody( userData );
        console.log('getRegisterBody(): ', body);
        return body;
    }


    register( userData: USER_DATA, successCallback: () => void, errorCallback: (error: string) => void ) {

        let body = this.getRegisterBody( userData );
        console.log(this.serverUrl);
        console.log(body);
        this.http.post( this.serverUrl, body, this.requestOptions )
            .subscribe( re => {
                try {
                    let data = JSON.parse( re['_body'] );
                    console.log('register::callback() data: ', data);
                    //if ( data['code'] )
                    if ( data['code'] && parseInt( data['code'] ) != 0 ) {
                        // console.log('error:', data['message']);
                        errorCallback( data['message'] );
                    }
                    else {
                        console.log('register::sucess: ', data);
                        this.setLoginData( data )
                            .then( () => {
                                console.log('user login saved: ' );
                                successCallback();
                            });
                    }
                }
                catch( e ) {
                    console.log(re);
                    errorCallback('json-parse-error');
                }
            });
    }

    setLoginData( data ) {
        let login = { id: data.id, session_id: data.session_id };
        let str = JSON.stringify( login );
        return this.storage.set( 'login', str );
    }
    getLoginData( callback ) {
        this.storage.get('login')
            .then( data => {
                try {
                    let login = JSON.parse( data );
                    callback( login );
                }
                catch ( e ) {
                    callback( null );
                }
            })
    }

    logout( callback ) {
        this.storage.remove( 'login' )
            .then( () => callback() );
    }

    logged( yesCallback: ( login: USER_LOGIN_DATA ) => void, noCallback?: () => void ) {
        this.getLoginData( ( login: USER_LOGIN_DATA ) => {
            if ( typeof login == 'undefined' || login == null || typeof login.id == 'undefined' ) {
                if ( noCallback ) noCallback();
            }
            else yesCallback( login );
        });
    }


}
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Api } from './api';

export interface USER_DATA {
  id : string;
  session_id? : string;
  nickname : string;
  password : string;
  name : string;
  email: string;
  mobile : string;
  gender : '' | 'M' | 'F';
  birth_year?:string;
  birth_month?:string;
  birth_day?:string;
  birthday?: string;
  varchar_1?: string; // as url of photo
};


export interface USER_LOGIN_DATA {
    id: string;
    password?: string;
    session_id: string;
};


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

    getLoginBody( loginData: USER_LOGIN_DATA ) {
        loginData['action'] = 'login';
        let body = this.postBody( loginData );
        console.log('getLoginBody(): ', body);
        return body;
    }
    getRegisterBody( userData: USER_DATA ) {
        userData['action'] = 'member_register_submit';
        let body = this.postBody( userData );
        console.log('getRegisterBody(): ', body);
        return body;
    }


    login( loginData: USER_LOGIN_DATA, successCallback: (login:USER_LOGIN_DATA) => void, errorCallback: (error:string) => void ) {
        let body = this.getLoginBody( loginData );
        this.http.post( this.serverUrl, body, this.requestOptions )
            .subscribe( re => {
                try {
                    let data = JSON.parse( re['_body'] );
                    console.log( data );
                    if ( this.isRequestError( data ) ) return errorCallback( data['message'] );
                    let login: USER_LOGIN_DATA = {
                        id: data.user_id,
                        session_id: data.session_id
                    };
                    this.setLoginData( login ).then( () => successCallback( login ) );
                }
                catch( e ) {
                    console.log('login(): re: ', re);
                    errorCallback( 'json-parse-error' );
                }

            });
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
                    if ( this.isRequestError(data) ) return errorCallback( data['message'] );
                    console.log('register::sucess: ', data);
                    this.setLoginData( data )
                        .then( () => {
                            console.log('user login saved: ' );
                            successCallback();
                        });
                }
                catch( e ) {
                    console.log(re);
                    errorCallback('json-parse-error');
                }
            });

    }
    


    setLoginData( data ) : Promise<any> {
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
            });
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


/**
 * Gets user data.
 * 
 */
    data( successCallback: (data: any) => void, errorCallback?: (error: string) => void ) {
        this.logged( login => {
            let url = this.getUrl('version&user_extra=1&id=' + login.id + '&session_id=' + login.session_id );
            console.log('data: ', url);
            this.http.get( url )
                .subscribe( re => {
                    // console.log('version: ', re);
                    try {
                        let data = JSON.parse( re['_body'] );
                        successCallback( data );
                    }
                    catch( e ) {
                        errorCallback('json-parse-error');
                    }
                });
        },
        () => errorCallback('not logged in'));

    }


}
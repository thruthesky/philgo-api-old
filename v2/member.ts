import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Api } from './api';
import * as _ from 'lodash';

const PHILGO_MEMBER_LOGIN = 'philgo-login';

export interface USER_DATA {
  id : string;
  session_id? : string;
  nickname : string;
  password: string;
  name: string;
  email: string;
  mobile?: string;
  landline?: string;
  gender?: string;
  birth_year?:string;
  birth_month?:string;
  birth_day?:string;
  birthday?: string;

  address?: string;
  city?: string;
  province?: string;
  country?: string;
  race?: string;
  children?: string;
  height?: number;
  weight?: number;
  eye_color?: string;
  hair_color?: string;
  religion?: string;
  relationship?: string;
  smoking?: string;
  drinking?: string;
  look_for?: string;
  greeting?: string;
  signature?: string;
  namecard_title?: string;
  namecard_company_name?: string;
  namecard_name?: string;
  namecard_line?: string;
  namecard_address?: string;
  namecard_landline?: string;
  namecard_mobile?: string;
  namecard_homepage?: string;
  namecard_email?: string;

  int_1?: string;
  int_2?: string;
  int_3?: string;
  int_4?: string;
  int_5?: string;
  int_6?: string;
  int_7?: string;
  int_8?: string;
  int_9?: string;
  int_10?: string;

  char_1?: string;
  char_2?: string;
  char_3?: string;
  char_4?: string;
  char_5?: string;
  char_6?: string;
  char_7?: string;
  char_8?: string;
  char_9?: string;
  char_10?: string;

  varchar_1?: string;
  varchar_2?: string;
  varchar_3?: string;
  varchar_4?: string;
  varchar_5?: string;
  varchar_6?: string;
  varchar_7?: string;
  varchar_8?: string;
  varchar_9?: string;
  varchar_10?: string;

  text_1?: string; // as url of photo
  text_2?: string;
  text_3?: string;
  text_4?: string;
  text_5?: string;
};


export interface USER_LOGIN_DATA {
    id: string;             // member.id
    password?: string;      // member.password
    // idx?: string;           // member.idx. 회원 번호가 없이, 회원 아이디 + 세션 아이디로 로그인 가능하다.
    session_id?: string;    // member session_id
};


@Injectable()
export class Member extends Api {
    constructor( http: Http ) {
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
        //console.log('getLoginBody(): ', body);
        return body;
    }
    getRegisterBody( userData: USER_DATA ) {
        userData['action'] = 'member_register_submit';
        let body = this.postBody( userData );
        //console.log('getRegisterBody(): ', body);
        return body;
    }


    /**
     * 
     * @code example
            this.member.login( this.loginData,
                login => console.log('login success: ', login),
                er => alert("login error:" + er),
                () => console.log('login complete!')
            );
     * @endcode
     * 
     */
    login( loginData: USER_LOGIN_DATA, successCallback: (login:USER_LOGIN_DATA) => void, errorCallback: (error:string) => void, completeCallback?: () => void ) {
        let body = this.getLoginBody( loginData );
        this.post( body, data => {
            console.log("login() : data : ", data );
            let login: USER_LOGIN_DATA = {
                id: data.user_id,
                session_id: data.session_id
            };
            this.setLoginData( login );
            successCallback( login );
        },
        errorCallback,
        completeCallback);
        /*
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
                    this.setLoginData( login );
                    successCallback( login );
                }
                catch( e ) {
                    console.log('login(): re: ', re);
                    errorCallback( 'json-parse-error' );
                }
            });
            */
    }
    register( userData: USER_DATA, successCallback: ( login: USER_LOGIN_DATA ) => void, errorCallback: (error: string) => void, completeCallback?: () => void ) {

        let body = this.getRegisterBody( userData );
        this.post( body, re => {
            this.setLoginData( re );
            successCallback( re );
        },
        errorCallback,
        completeCallback);
/*
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
                    this.setLoginData( data );
                    successCallback();
                }
                catch( e ) {
                    console.log(re);
                    errorCallback('json-parse-error');
                }
            });
            */

    }
    update( userData: USER_DATA, successCallback: ( login: USER_LOGIN_DATA ) => void, errorCallback: (error: string) => void, completeCallback?: () => void ) {
        let login = this.getLoginData();
        if ( login === void 0 || login.id === void 0 ) errorCallback('login-first');
        userData['id'] = login.id;
        userData['session_id'] = login.session_id;
        let body = this.getRegisterBody( userData );
        this.post( body, re => {
            this.setLoginData( re );
            successCallback( re );
        },
        errorCallback,
        completeCallback);
    }
    


    setLoginData( data ) : void {
        let login = { id: data.id, session_id: data.session_id };
        let str = JSON.stringify( login );
        localStorage.setItem( PHILGO_MEMBER_LOGIN, str );
    }
    getLoginData() : USER_LOGIN_DATA {
        let data = localStorage.getItem( PHILGO_MEMBER_LOGIN );
        try {
            let login = JSON.parse( data );
            return login;
        }
        catch ( e ) {
            return null;
        }
    }

    logout() {
        localStorage.removeItem( PHILGO_MEMBER_LOGIN );
    }

    /**
     * Retruns login data saved in localStroage.
     */
    logged () {
        return this.getLoginData();
    }


    /**
     * Gets user data.
     * @note this method only gets self data with the session information saved in localStorage.
     * @note 현재 로그인 한 사용자의 데이터만 가져 올 수 있다.
     * 
     */
    data( successCallback: (data: USER_DATA) => void, errorCallback?: (error: string) => void, completeCallback?: () => void ) {
        let login = this.logged();
        if ( login ) {
            let url = this.getUrl('version&user_extra=1&id=' + login.id + '&session_id=' + login.session_id );
            console.log('member.data() url: ', url);
            this.get( url, successCallback, errorCallback, completeCallback );
            /*
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
                */
        }
        else return errorCallback('not logged in');
    }


}
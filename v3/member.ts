import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Http} from '@angular/http';
import { Api } from './api';
import { Auth, User, UserDetails, IDetailedError } from '@ionic/cloud-angular';


export interface USER_DATA {
  id : string;
  session_id? : string;
  nickname : string;
  password : string;
  name : string;
  email: string;
  mobile : string;s
  gender : 'M' | 'F';
  birth_year?:string;
  birth_month?:string;
  birth_day?:string;
  birthday?: string;
  urlPhoto?: string;
};

export interface USER_LOGIN_DATA {
    id: string;
    password?: string;
    session_id: string;
}

export interface CLOUD_USER_DATA {
    email: string;
    password?: string;  
}


@Injectable()
export class Member extends Api {
    constructor( http: Http, private storage: Storage, public auth: Auth, public user: User  ) {
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

    login_To_facebook(successCallback, failureCallback){

            this.auth.login('facebook').then(()=>{
                console.log('You are now logged In in by facebook');
            } ).catch(e =>{
                console.log("Fail to logged In in facebook", e);
            });


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
                    let userCloudData = this.generateCloudUserData(login.id)
                    this.loginToCloud(userCloudData);
                  
                    

                }
                catch( e ) {
                    console.log('login(): re: ', re);
                    errorCallback( 'json-parse-error' );
                }

            });
    }




    generateCloudUserData(id : string ) :  UserDetails{
        let cloudUserData : UserDetails = <UserDetails>{
            email : id + "@philgo.com",
            password : "~philgo@" + id
         }
         return cloudUserData;
    }
    

    loginToCloud(cloudUserData : UserDetails){    
             this.auth.login('basic', cloudUserData).then( ()=>{
                if ( this.auth.isAuthenticated())   console.log('User is now logged In in Ionic Cloud');
                else console.info('Fail to logged in');
             }).catch( e =>{
                this.registerToCloud(cloudUserData['id']);       
             });         
    }

    registerToCloud( id : string)  {
            
         let cloudUserData : UserDetails = this.generateCloudUserData(id);
         if ( !this.auth.isAuthenticated()){
            console.log('Registration to ionic cloud started::' );
            this.auth.signup(cloudUserData).then( ()=> {
                  console.log('Cloud Registration success : ', cloudUserData)  
                  this.auth.login('basic', {'email': cloudUserData.email, 'password': cloudUserData.password}).then(()=>{             
                       if (this.auth.isAuthenticated())   console.log('User is now logged In in Ionic Cloud');
                       else console.info('Fail to logged in');
                  });                
            }, (err: IDetailedError<string[]>) => {
                    console.error('Error: Cloud Registration fail' );                     
            });   
         }  


             
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
                             this.registerToCloud(data['id']) ;                                           
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
            })
    }

    logout( callback ) {
        this.storage.remove( 'login' )
            .then( () => callback() );

        if (this.auth.isAuthenticated()){
            this.auth.logout();
            console.log('User is logout to Ionic Cloud');
        }   
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
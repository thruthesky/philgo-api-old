import { Http, Headers, RequestOptions } from '@angular/http';
export class Api {
    http: Http;
    constructor( http ) {
        this.http = http;
        console.log('Api::constructor()', http);
    }


    get serverUrl() : string {
        return "http://www.philgo.com";
    }

    get requestOptions() : RequestOptions {
        let headers  = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        let options  = new RequestOptions({ headers: headers });   
        return options;
    }
    /**
     * 
     * @code
     *      getUrl('version');
     * @endcode
     * 
     */
    getUrl( qs: string = '' ) {
        return this.serverUrl + "?module=ajax&submit=1&action=" + qs;
    }

    /**
     * Returns the body of POST method.
     * 
     * 
     * @param params must be an object.
     */
    postBody( params ) {

        params[ 'module' ] = 'ajax';
        params[ 'submit' ] = 1;

        let keys = Object.keys( params );
        let en = encodeURIComponent;
        let q = keys.map( e => en( e ) + '=' + en( params[e] ) ).join('&');
        console.log('postBody(): ', q);
        return q;
    }


/**
 * 
 * @code
    member.version( v => console.log('version: ', v) );
 * @endcode
 * 
 * 
 */
    version( successCallback: (version:string) => void, errorCallback?: (error: string) => void ) {
        let url = this.getUrl('version');
        this.http.get( url )
            .subscribe( re => {
                // console.log('version: ', re);
                try {
                    let data = JSON.parse( re['_body'] );
                    successCallback( data.version );
                }
                catch( e ) {
                    errorCallback('json-parse-error');
                }
            });
    }




    isRequestError( data ) : boolean {
        if ( data['code'] && parseInt( data['code'] ) != 0 ) return true;
        else return false;
    }

}
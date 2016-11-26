import { Http, Headers, RequestOptions } from '@angular/http';
export class Api {
    http: Http;
    constructor( http ) {
        this.http = http;
        console.log('Api::constructor()', http);
    }


    get serverUrl() : string {
        return "http://philgo.org";
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
     * Returns JSON parsed Object.
     * 
     * @attention all http request must use this method to parse.
     * 
     * @param re - is the response of http.get() or http.post()
     * @param successCallback - is the success callback to be called when success.
     * @param errorCallback - is the error callback to be called when there is error.
     * @attention you can capture the callbacks and extra works.
     */
    responseData( re, successCallback: ( data: any ) => void, errorCallback: ( error: string ) => void ) : any {
        let data;
        try {
            data = JSON.parse( re['_body'] );
        }
        catch( e ) {
            console.error(e);
            console.info(re);
            return errorCallback('json-parse-error');
        }
        if ( data.code ) return errorCallback( data.message )
        successCallback( data );
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

    /**
     * 
     * Returns cached data after JSON.parse() if exists.
     * 
     * @attenion the cached data must be in JSON string format.
     * 
     * @code example
        if ( data.page_no == 1 ) this.cacheCallback( data.post_id, successCallback );
     * @endcode
     * 
     */
    cacheCallback( cache_id, callback ) {
        let re = localStorage.getItem( cache_id );
        if ( re ) {
            try {
                let data = JSON.parse( re );
                if ( data ) callback( data );
            }
            catch (e) { }
        }
    }
    /**
     * @para data - Javascript raw value. NOT JSON string.
     * @attention the data must not be JSON format string because it does by itself.
     * 
     * @code example
                this.responseData( re, (posts: POSTS) => {
                    if ( data.page_no == 1 ) this.saveCache( data.post_id, posts );
                    successCallback( posts );
                }, errorCallback );
     * @endcode
     */
    saveCache( cache_id, data ) {
        localStorage.setItem( cache_id, JSON.stringify(data) );
    }
}
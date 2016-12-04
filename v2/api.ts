import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { MEMBER_LOGIN_DATA, SEARCH_QUERY_DATA } from './philgo-api-interface';
import 'rxjs/add/operator/timeout';
export const PHILGO_MEMBER_LOGIN = 'philgo-login';
export class Api {
    http: Http;
    debug: boolean = false;
    constructor( http ) {
        this.http = http;
        // console.log('Api::constructor()', http);
    }

/**
 * 
 */
    getLogin() : MEMBER_LOGIN_DATA {
        return this.getLoginData();
    }
    getLoginData() : MEMBER_LOGIN_DATA {
        let data = localStorage.getItem( PHILGO_MEMBER_LOGIN );
        try {
            let login = JSON.parse( data );
            return login;
        }
        catch ( e ) {
            return null;
        }
    }

    get serverUrl() : string {
        return "http://philgo.org/index.php";
    }


    /**
     * This does the same as 'http.get()' but in callback.
     * 
     */
    get( url, successCallback: (data:any) => void, errorCallback?: ( e:any ) => void, completeCallback?: () => void ) {
        if ( this.debug ) console.info("get: ", url);
        this.http.get( url )
            .timeout( 9000, new Error('timeout exceeded') )
            .subscribe(
                re => this.responseData( re, successCallback, errorCallback ),
                er => this.responseConnectionError( er, errorCallback ),
                completeCallback );
    }

    /**
     * 
     * @example code @see member.login()
     * 
     */
    post( data: any, successCallback: (data:any) => void, errorCallback?: ( e:any ) => void, completeCallback?: () => void ) {
        if ( data['action'] === void 0 ) return errorCallback("Ajax request 'action' value is empty");
        data = this.buildQuery( data );
        if ( this.debug ) {
            let url = this.serverUrl + '?' + data;
            console.info("post: ", url);
        }
        this.http.post( this.serverUrl, data, this.requestOptions )
            .timeout( 9000, new Error('timeout exceeded') )
            .subscribe(
                re => this.responseData( re, successCallback, errorCallback ),
                er => this.responseConnectionError( er, errorCallback ),
                completeCallback );
    }

    /**
     * 
     * Returns JSON parsed Object.
     * 
     * @note this.get() 과 this.post() 호출 결과로 서버로 부터 받은 데이터를 파싱하고,
     *      code 에 0 의 값이 아니면, 에러이므로 errorCallback() 을 직접 호출 한다.
     *          즉, 서버 리턴 데이터가 에러인 경우에는 여기서 처리하므로 상위 메소드에서 처리 할 필요가 없다.
     *      또한 code 에 0 의 값이면 에러가 아니므로, successCallback() 을 호출한다.
     *          따라서 상위 메소드에서는 거의 할 일이 없지만, 별도의 처리가 필요하면,
     *          아래의 예제 처럼 직접 캡쳐해서 처리를 할 수 있다.
     * @attention all http request must use this method to parse.
     * 
     * @param re - is the response of http.get() or http.post()
     * @param successCallback - is the success callback to be called when success.
     * @param errorCallback - is the error callback to be called when there is error.
     * @attention you can capture the callbacks and extra works.
     * 
     * @use to get response data on subscribe()
     *          http.get.subscribe() 의 서버 리턴 값에서 JSON 파싱해서 값을 받기 위해서 사용. 단순히 JSON.parse( re['_body'] ) 와 같이 할 수 있으나 통일된 구문을 사용한다.
     * @code
            this.http.get( url )
                .subscribe( re => {
                    console.log('post::page() re: ', re);
                    this.responseData( re, (posts: POSTS) => {
                        if ( data.page_no == 1 ) this.saveCache( data.post_id, posts );
                        successCallback( posts );
                    }, errorCallback );
                });
     * @endcode
     * 
     * 
     * @code json-parse-error would probably be server error!
            e => {
                if ( e == 'json-parse-error' ) {
                this.process['error'] = 'Server Error. Please notify this to admin';
                }
                else this.process = { 'error': e };
            })
     * @endcode
     */
    responseData( re, successCallback: ( data: any ) => void, errorCallback: ( error: string ) => void ) : any {
        console.log('responseData() re: ', re);
        let data;
        try {
            data = JSON.parse( re['_body'] );
        }
        catch( e ) {
            console.error(e);
            console.info(re);
            if ( errorCallback ) return errorCallback('json-parse-error');
        }
        if ( this.isRequestError(data) ) {
            if ( errorCallback ) return errorCallback( data.message )
        }
        else successCallback( data );
    }

    /**
     * Response on http.get() / http.post()
     * @note responseData() 가 서버로 부터 올바른 값이 넘어 온 경우, 처리를 한다면,
     *          responseError() 는 서버로 부터 올바른 값이 넘어 오지 않은 경우를 처리한다.
     */
    responseConnectionError( error: Response | any, errorCallback: ( error : string ) => void ) {
        let errMsg: string;
        if ( error instanceof Response ) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        if ( errorCallback ) errorCallback("http-get/post-subscribe-error may-be-no-internet or wrong-domain or timeout or server-down: " + errMsg);
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
     * @attention This addes 'module', 'submit'. If you don't needed just user http_build_query()
     * 
     * @param params must be an object.
     */
    buildQuery( params ) {
        params[ 'module' ] = 'ajax'; // 'module' must be ajax.
        params[ 'submit' ] = 1; // all submit must send 'submit'=1
        return this.http_build_query( params );


/*
        let keys = Object.keys( params );
        let en = encodeURIComponent;
        let q = keys.map( e => en( e ) + '=' + en( params[e] ) ).join('&');
        // console.log('postBody(): ', q);
        return q;
        */
    }


/**
 * 
 * @code
    member.version( v => console.log('version: ', v) );
 * @endcode
 * 
 * 
 */
    version( successCallback: (version:string) => void, errorCallback?: (error: string) => void, completeCallback?: () => void ) {
        this.get(
            this.getUrl('version'),
            successCallback,
            errorCallback,
            completeCallback
        );
        /*
        let url = this.getUrl('version');
        this.get( url, data => {
            if ( +data['code'] ) {
                if ( errorCallback ) errorCallback( data['message'] );
            }
            else successCallback( data.version );
        },
        errorCallback,
        completeCallback );
        */
        /*
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
            */
    }






    search( data: SEARCH_QUERY_DATA, successCallback: ( re: any ) => void, errorCallback: ( error: string ) => void, completeCallback?: () => void ) {
        let url = this.getUrl( 'search&' + this.http_build_query( data ) );
        this.get( url,
            successCallback,
            errorCallback,
            completeCallback );
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



    http_build_query (formdata, numericPrefix='', argSeparator='') { 
        var urlencode = this.urlencode;
        var value
        var key
        var tmp = []
        var _httpBuildQueryHelper = function (key, val, argSeparator) {
            var k
            var tmp = []
            if (val === true) {
            val = '1'
            } else if (val === false) {
            val = '0'
            }
            if (val !== null) {
            if (typeof val === 'object') {
                for (k in val) {
                if (val[k] !== null) {
                    tmp.push(_httpBuildQueryHelper(key + '[' + k + ']', val[k], argSeparator))
                }
                }
                return tmp.join(argSeparator)
            } else if (typeof val !== 'function') {
                return urlencode(key) + '=' + urlencode(val)
            } else {
                throw new Error('There was an error processing for http_build_query().')
            }
            } else {
            return ''
            }
        }

        if (!argSeparator) {
            argSeparator = '&'
        }
        for (key in formdata) {
            value = formdata[key]
            if (numericPrefix && !isNaN(key)) {
            key = String(numericPrefix) + key
            }
            var query = _httpBuildQueryHelper(key, value, argSeparator)
            if (query !== '') {
            tmp.push(query)
            }
        }

        return tmp.join(argSeparator)
    }


    urlencode (str) {
        str = (str + '')
        return encodeURIComponent(str)
            .replace(/!/g, '%21')
            .replace(/'/g, '%27')
            .replace(/\(/g, '%28')
            .replace(/\)/g, '%29')
            .replace(/\*/g, '%2A')
            .replace(/%20/g, '+')
    }



    getApiEmail( login ) {
        return  login.id + "@philgo.com";
    }
    getApiPassword( login ) {
        return  'Pw+philgo.com@' + login.idx + ',' + login.id + '~' + login.stamp;
    }
}
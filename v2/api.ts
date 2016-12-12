import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { MEMBER_LOGIN_DATA, SEARCH_QUERY_DATA, MEMBER_DATA } from './philgo-api-interface';
import 'rxjs/add/operator/timeout';
declare let global; // for php-js. uniqid()
export const PHILGO_MEMBER_LOGIN = 'philgo-login';
export class Api {
  http: Http;
  debug: boolean = false;
  //apiEndpoint = "http://test.philgo.com/index.php";
  // apiEndpoint = "http://philgo.org/index.php";
  //apiEndpoint = "http://www.philgo.com/index.php";
  apiEndpoint = "http://w8.philgo.com/index.php";
  constructor( http ) {
    this.http = http;
    // console.log('Api::constructor()', http);
  }

  /**
   *
   * Returns login data in non-blocking code through callback.
   *
   * Use getLogin() as much as possible.
   *
   * getLogin() 은 내부적으로 getLoginData() 를 사용하는데, setTimeout 을 통해서 non-blocking 을 처리하고 있다.
   * 예를 들어, constructor() 에 많은 코드를 넣으면 앱 부팅이 느려지는데, 그러한 이유로 non-blocking 을 하는 것이 좋다.
   *
   * 내부적으로 callback 이 막 엉킬 경우, getLoginData() 를 사용해서 callback 없이 그냥 값을 받는다.
   *
   * @return void
   *      - if the user logged in, callback will be called with login information.
   *      - otherwise, callback will not be called.
   *
   *
   * @code
   *      member.getLogin( x => this.login = x );
   * @endcode
   *
   */
  getLogin( callback: ( login: MEMBER_LOGIN_DATA ) => void ) : void {
    setTimeout( () => {
      let login = this.getLoginData();
      if ( login ) callback( login  );
    }, 1 );
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
    return this.apiEndpoint;
  }


  /**
   * This does the same as 'http.get()' but in callback.
   *
   */
  get( url, successCallback: (data:any) => void, errorCallback?: ( e:any ) => void, completeCallback?: () => void ) {
    if ( this.debug ) console.info("get: ", url);
    this.http.get( url )
      .timeout( 15000, new Error('timeout exceeded') )
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
    // console.log('responseData() re: ', re);
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
    console.error(Response);
    if ( errorCallback ) errorCallback("http-get/post-subscribe-error may-be-no-internet or wrong-domain or timeout or server-down: ...");
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
      let data = null;
      try {
        data = JSON.parse( re );
      }
      catch (e) {
        // error. no callback.
        console.error( "error on parsing data of localstroage.");
      }
      try {
        if ( data ) callback( data );
      }
      catch ( e ) {
        console.error("error on cacheCallback() ==> callback()");
      }
    }
    else {
      // no data. no callback.
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

  /**
   *
   *
   uniqid (prefix?:any, moreEntropy?:any) {
        return (new Date().getTime()).toString(36);
    }
   */

  /**
   * PHP uniqid()
   */
  uniqid (prefix?, moreEntropy?) {
    if (typeof prefix === 'undefined') {
      prefix = ''
    }

    var retId
    var _formatSeed = function (seed, reqWidth) {
      seed = parseInt(seed, 10).toString(16) // to hex str
      if (reqWidth < seed.length) {
        // so long we split
        return seed.slice(seed.length - reqWidth)
      }
      if (reqWidth > seed.length) {
        // so short we pad
        return Array(1 + (reqWidth - seed.length)).join('0') + seed
      }
      return seed
    }

    var $global = (typeof window !== 'undefined' ? window : global)
    $global.$locutus = $global.$locutus || {}
    var $locutus = $global.$locutus
    $locutus.php = $locutus.php || {}

    if (!$locutus.php.uniqidSeed) {
      // init seed with big random int
      $locutus.php.uniqidSeed = Math.floor(Math.random() * 0x75bcd15)
    }
    $locutus.php.uniqidSeed++

    // start with prefix, add current milliseconds hex string
    retId = prefix
    retId += _formatSeed(parseInt((new Date().getTime() / 1000).toString(), 10), 8)
    // add seed hex string
    retId += _formatSeed($locutus.php.uniqidSeed, 5)
    if (moreEntropy) {
      // for more entropy we add a float lower to 10
      retId += (Math.random() * 10).toFixed(8).toString()
    }

    return retId
  }

  getBirthdayFormValue( data: MEMBER_DATA ) {
    let str = '';
    try {
      if ( data.birth_year !== void 0 ) {
        str += data.birth_year + '-';
        str += parseInt(data.birth_month) < 10 ? '0' + data.birth_month : data.birth_month;
        str += '-';
        str += parseInt(data.birth_day) < 10 ? '0' + data.birth_day : data.birth_day;
      }
    }
    catch( e ) {
      console.error('birthday error: ', e );
    }

    return str;


  }


  strip_tags (input, allowed?) {
    allowed = (((allowed || '') + '').toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('')

    var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi
    var commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi

    return input.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {
      return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : ''
    })
  }

}


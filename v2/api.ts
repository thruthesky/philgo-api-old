import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { MEMBER_LOGIN_DATA, SEARCH_QUERY_DATA, MEMBER_DATA } from './philgo-api-interface';
import 'rxjs/add/operator/timeout';
declare let global; // for php-js. uniqid()
export const PHILGO_MEMBER_LOGIN = 'philgo-login';
export class Api {
  self: Api = null;
  http: Http;
  debug: boolean = false;
  // apiEndpoint = "http://test.philgo.com/index.php";
  //  apiEndpoint = "http://philgo.org/index.php";
  //  apiEndpoint = "http://www.philgo.com/index.php";
    apiEndpoint = "http://w8.philgo.com/index.php"; // fastest server from db.
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
    if ( ! data ) return null;
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
   * This does the same as 'http.get()' but it works with callbacks.
   * 
   * @param url - if url is not string, then it considers to get cached data.
   *
   */
  get( url: any, successCallback: (data:any) => void, errorCallback?: ( e:any ) => void, completeCallback?: () => void ) {
    if ( typeof url == 'string' || url['expire'] === void 0 ) {
      if ( typeof url != 'string' ) url = url['url'];
      this._get( url, successCallback, errorCallback, completeCallback );
    }
    else this._getCacheData( url, successCallback, errorCallback, completeCallback );
  }
  _get( url, successCallback: (data:any) => void, errorCallback?: ( e:any ) => void, completeCallback?: () => void ) {
    if ( this.debug ) console.info("get: ", url);
    this.http.get( url )
      .timeout( 25000, new Error('timeout exceeded') )
      .subscribe(
        re => this.responseData( re, successCallback, errorCallback ),
        er => this.responseConnectionError( er, errorCallback ),
        completeCallback );
  }

  _getCacheData( option, successCallback: (data:any) => void, errorCallback?: ( e:any ) => void, completeCallback?: () => void ) {

    let url = option['url'];
    let expire = option['expire'];
    let cache_id = url;

    let cache_data = this.getCache( cache_id, expire );
    if ( cache_data ) {
        //console.info("use cached data");
        successCallback( cache_data );
        if ( completeCallback ) completeCallback();
    }
    /**
     * If this code runs, successCallback() may be called again but only once every expire.
     */
    if ( this.isCacheExpired( cache_id, option.expire ) ) {
        //console.info("Cache expired. Going to cache");
      this.http.get( url )
        .subscribe( data => {
          try {
            let re = JSON.parse( data['_body'] );
            if ( ! cache_data ) {
              successCallback( re ); // does not recall successCallback() if already called.
              if ( completeCallback ) completeCallback();
            }
            this.setCache( cache_id, re );
          }
          catch( e ) {
            errorCallback( 'api get cache url error' );
            if ( completeCallback ) completeCallback();
            console.error( data['_body']);
          }
        });
    }
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
      .timeout( 25000, new Error('timeout exceeded') )
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
    // console.log('Api::responseData() re: ', re);
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
   * 
   * @update 2016-12-17 error message change from "http-request-error maybe no-internet or wrong-domain or timeout or server-down" to "No Internet!..."
   * @warning the error message "No Internet!" NOT only means for 'no internet' but also for 'no connection' to server maybe because of slow internet or wrong domain or server script error etc.
   */
  responseConnectionError( error: Response | any, errorCallback: ( error : string ) => void ) {
    console.error(Response);
    if ( errorCallback ) errorCallback("No Internet! Please connect to internet.");
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
    this._get( url,
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
   * 
   *
   * 
   * @attenion the cached data must be in JSON string format.
   *
   * @param expire - if set true, it will delete the cached data if the cache interval is expired.
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
        if ( data ) {
          // console.log("Api::cacheCallback()");
          callback( data );
        }
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
   * 
   * Saves data into 'localStorage'.
   * It also saves timestamp to mark when the data was saved. 
   * 
   * @param id - can be any string.
   * @param data - Javascript raw value. NOT JSON string.
   * 
   * @attention the data must not be JSON format string because it does by itself.
   *
   * @code example
     this.responseData( re, (posts: POSTS) => {
        if ( data.page_no == 1 ) this.saveCache( data.post_id, posts );
        successCallback( posts );
    }, errorCallback );
   * @endcode
   */
  saveCache( cache_id:string, data:any ) {
    localStorage.setItem( cache_id, JSON.stringify(data) );
    let stamp = Math.floor(Date.now() / 1000)
    localStorage.setItem( cache_id + '.stamp', stamp.toString());
  }
  /**
   * alias of saveCache()
   */
  setCache( cache_id:string, data:any ) {
    return this.saveCache( cache_id, data );
  }
  /**
   * 
   */
  deleteCache( cache_id ) {
    localStorage.removeItem( cache_id );
    localStorage.removeItem( cache_id + '.stamp' );
  }

  /**
   *  
   * Returns cached data after JSON.parse() if exists.
   *
   * @note even though cache expired and deleted, return the cache data. so, next time, it will return null.
   *      유효 기간이 지나서 캐시가 삭제되어도, 그 (삭제된) 캐시 값을 리턴한다.
   *      하지만, 다음 번에 캐시 데이터를 찾으려 한다면 캐시가 삭제되어 null 이 리턴된다.
   * 
   * @param id - can be any string.
   * @param expire - seconds in number. If it is 0, then it does not delete the cache. default is 0.
   * 
   * @code
   * let page = this.getCache( cache_id, 20 ); // delete cache data if it's more than 20 seconds.
   * @endcode
   * 
   * @return
   *    - cached data after json.parse
   *    - null if no data cached.
   */
  getCache( cache_id:string, expire:number = 0 ) {
    let raw = localStorage.getItem( cache_id );
    if ( raw == null ) return null;
    let data;
    try {
      data = JSON.parse( raw );
    }
    catch ( e ) {
      return null;
    }
    if ( expire == 0 ) return data;
    if ( this.isCacheExpired( cache_id, expire) ) this.deleteCache( cache_id );
    return data; //

    // let cache_stamp = + localStorage.getItem( cache_id + '.stamp' );
    // let stamp = Math.floor(Date.now() / 1000);
    // if ( expire + cache_stamp < stamp ) { // if cache expired, delete cache.
    //   console.info('cache removed');
    //   localStorage.removeItem( cache_id );
    //   localStorage.removeItem( cache_id + '.stamp' );
    // }
    // console.log('cached data will be returned');
    // return data; // even though cache expired and deleted, return the cache data. so, next time, it will return null.
  }

  /**
   * Returns true if the cache is already expired.
   */
  isCacheExpired( cache_id: string, expire: number ) : boolean {
    let cache_stamp = + localStorage.getItem( cache_id + '.stamp' );
    let stamp = Math.floor(Date.now() / 1000);
    if ( expire + cache_stamp < stamp ) { // if cache expired, return true;
      return true;
    }
    else return false;
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
  uniqid (prefix?, moreEntropy=true) {
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

  getDateTime( stamp ) {
    
    let m = parseInt(stamp) * 1000;
    let d = new Date( m );

    let post_year = d.getFullYear();
    let post_month = d.getMonth();
    let post_date = d.getDate();

    let t = new Date();
    let today_year = t.getFullYear();
    let today_month = t.getMonth();
    let today_date = t.getDate();


    let time;
    if ( today_year == post_year && today_month == post_month && today_date == post_date ) {
      time = d.getHours() + ':' + d.getMinutes();
    }
    else {
      time = post_year + '-' + post_month + '-' + post_date;
    }
    return time;
  }

}


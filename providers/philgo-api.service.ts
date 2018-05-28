import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpRequest, HttpResponse, HttpHeaderResponse, HttpEventType } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export const ID = 'id';
export const SESSION_ID = 'session_id';
export const NICKNAME = 'nickname';
export const IDX_MEMBER = 'idx_member';


interface ApiOptionalRequest {
    method?: string;
    session_id?: string;
}
export interface ApiLoginRequest extends ApiOptionalRequest {
    email: string;
    password: string;
}
export interface ApiCurrencyRequest extends ApiOptionalRequest {
    currency?: string;
}
export interface ApiRegisterRequest extends ApiOptionalRequest {
    email: string;
    password: string;
    name?: string;
    nickname: string;
    mobile?: string;
    url_profile_photo?: string; // for profile upload form compatibility only.
}
export interface ApiProfileUpdateRequest extends ApiOptionalRequest {
    name: string;
    mobile: string;
}

interface ApiResponse {
    code: number;
    message?: string;
    data: any;
}
interface ApiErrorResponse {
    code: number;
    message?: string;
}
interface ApiVersionResponse {
    version: string;
}
export interface ApiCurrencyResponse {
    php: string;
    usd: string;
}

export interface ApiCurrencyResponse {
    php: string;
    usd: string;
}
interface ApiProfileResponse {
    idx: string;
    id: string;
    email: string;
    name: string;
    nickname: string;
    mobile: string;
    password: string;
    readonly url_profile_photo?: string;
    session_id: string;
}

interface ApiRegisterResponse extends ApiProfileResponse {
    session_id: string;
}
interface ApiLoginResponse extends ApiRegisterResponse {
    session_id: string;
}
interface ApiUserInformation extends ApiRegisterResponse {
    session_id: string;
}

interface ApiThumbnailOption {
    height?: number;
    width?: number;
    path: string;
    percentage: number;
    quality?: number;
    type?: 'adaptive' | 'crop';
}

interface ApiVersion2Request {
    module?: string;
    action: string;
    submit?: number;
    id?: string;
    idx?: number;
    session_id?: string;
}

interface ApiVersion2Response {
    code: number;
    message?: string;
    action: string;
    domain: string;
    module: string;
    new_message: string; // if there is a new message.
    post_name?: string; // post name if forum list requested.
    // ... and there is more...
    data?: {
        code: number;
        message: string;
    };
}


export interface ApiFileUploadResponse {
    idx: number;
    name: string; // file name
    path: string; // relative file path on server
    result: number; // 0 on success.
    url: string; // orinal file url
    url_thumbnail: string; // thumbnail url.
}

export const ApiErrorFileNotSelected = 'file-not-selected';
export const ApiErrorFileUploadError = -50020;
export const ApiErrorUrlNotSet = -50030;



interface ApiFileUploadOptions {
    gid?: string;
    login?: 'pass';
    finish?: '1';
    code?: string;
    module_name?: string;
}


export interface ApiMember {
    id: string;
    name: string;
    nickname: string;
}


export interface ApiPhoto {
    idx: number;
    url?: string;
    url_thumbnail?: string;
}

export interface ApiForumPageRequest extends ApiOptionalRequest {

    // page_no?: number; // page number
    // post_id?: string; // post id
    // limit?: number; // number of posts to show in one page.
    fields?: string; // fields to extract
    file?: string; // Y to get only posts with files(photos)
    page_no: number; // page no
    post_id: string; // post id
    limit: number; // limit
}

export interface ApiComment {
    bad?: string;
    blind?: string;
    content: string;
    deleted?: string;
    depth?: string;
    gid: string;
    good?: string;
    idx?: string;
    idx_member?: string;
    idx_parent: string;
    idx_root?: string;
    int_10?: string;
    member?: ApiMember;
    photos?: Array<ApiPhoto>;
    post_id?: string;
    stamp?: string;
    date?: string;
    user_name?: string;
}



/**
 * Post data structure for create/update
 */
export interface ApiPostData {
    module?: string; // for crate/update
    action?: string; // for create/update
    id?: string; // user id to create/update.
    session_id?: string; // user id to create or update.
    idx?: string;
    stamp?: string;
    idx_member?: string;
    idx_root?: string;
    idx_parent?: string;
    list_order?: string;
    depth?: string;
    gid?: string;
    post_id?: string;
    group_id?: string;
    category?: string;
    sub_category?: string;
    reminder?: string;
    secret?: string;
    checked?: string;
    checked_stamp?: string;
    report?: string;
    blind?: string;
    no_of_comment?: string;
    no_of_attach?: string;
    no_of_first_image?: string;
    user_domain?: string;
    user_id?: string;
    user_password?: string;
    user_name?: string;
    user_email?: string;
    subject?: string;
    content?: string;
    content_stripped?: string;
    link?: string;
    stamp_update?: string;
    stamp_last_comment?: string;
    deleted?: string;
    no_of_view?: string;
    good?: string;
    bad?: string;
    access_code?: string;
    region?: string;
    photos?: Array<ApiPhoto>;
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
    varchar_11?: string;
    varchar_12?: string;
    varchar_13?: string;
    varchar_14?: string;
    varchar_15?: string;
    varchar_16?: string;
    varchar_17?: string;
    varchar_18?: string;
    varchar_19?: string;
    varchar_20?: string;
    text_1?: string;
    text_2?: string;
    text_3?: string;
    text_4?: string;
    text_5?: string;
    text_6?: string;
    text_7?: string;
    text_8?: string;
    text_9?: string;
    text_10?: string;

    comments: Array<ApiComment>;
    member?: ApiMember;
    config_subject: string; // forum name. 게시판 이름.
}


interface ApiBanner {
    src: string; // banner image url
    idx_file: number; // banner image idx
    url: string; // url to be redirected to adv page.
    subject: string; // for premium subject
    sub_subject: string; // for premium sub sub subject
    image_src: string; // for premium banner
}

export interface ApiForumPageResponse extends ApiResponse {
    category: string;
    limit: number;
    page_no: number;
    point_ad: Array<any>;
    post_id: string;
    post_top_ad: Array<ApiBanner>;
    post_top_company_book_ad: Array<ApiBanner>;
    post_top_premium_ad: Array<any>;
    posts: Array<ApiPostData>;
}


export interface ApiPostEditRequest extends ApiVersion2Request {
    subject?: string;
    content?: string;
    gid?: string;
    post_id: string;
}
export interface ApiPostEditResponse extends ApiVersion2Response {
    post: ApiPostData;
}



@Injectable()
export class PhilGoApiService {
    static serverUrl = '';
    static fileServerUrl = '';
    constructor(
        public http: HttpClient
    ) {
        console.log('PhilGoApiService::constructor');
    }

    setServerUrl(url: string) {
        PhilGoApiService.serverUrl = url;
        console.log('setServerUrl(): ', this.getServerUrl());
    }
    getServerUrl(): string {
        return PhilGoApiService.serverUrl;
    }
    /**
     * Returns old api's end point.
     */
    getV2ServerUrl(): string {
        return PhilGoApiService.serverUrl.replace('api.php', 'index.php');
    }
    setFileServerUrl(url: string) {
        PhilGoApiService.fileServerUrl = url;
    }
    getFileServerUrl(): string {
        return PhilGoApiService.fileServerUrl;
    }



    private httpBuildQuery(params): string | null {
        const keys = Object.keys(params);
        if (keys.length === 0) {
            return null; //
        }
        const esc = encodeURIComponent;
        const query = keys
            .map(k => esc(k) + '=' + esc(params[k]))
            .join('&');
        return query;
    }

    private prePost(data) {
        const q = this.httpBuildQuery(data);
        console.log('PhilGoApiService::post() url: ', this.getServerUrl() + '?' + q);
        if (!this.getServerUrl()) {
            console.error(`Error. Server URL is not set.`);
        }
    }
    /**
     * 서버로 POST request 를 전송하고 결과를 받아서 데이터를 Observable 로 리턴하거나
     * 응답에 에러가 있거나 각종 상황에서 에러가 있으면 그 에러를 Observable 로 리턴한다.
     *
     * Request to server through POST method.
     * And returns response data observable or error observable.
     *
     * @param data request data
     *
     *      data['session_id'] - user session id
     *      data['route'] - route
     *
     */
    post(data): Observable<any> {
        this.prePost(data);
        if (!this.getServerUrl()) {
            return throwError({ code: ApiErrorUrlNotSet, message: 'Server url is not set. Set it on App Module constructor().' });
        }
        return this.http.post(this.getServerUrl(), data).pipe(
            map((res: ApiResponse) => {
                /**
                 * PhilGo API 부터 잘 처리된 결과 데이터가 전달되었다면,
                 * 데이터만 Observable 로 리턴한다.
                 */
                if (res.code !== void 0 && res.code === 0) {
                    return res.data;
                } else {
                    // console.log('** PhilGoApiService -> post -> http.post -> pipe -> map -> res: ', res);
                    /**
                     * (인터넷 접속 에러나 서버 프로그램 에러가 아닌)
                     * PhilGo API 가 올바로 실행되었지만 결과에 성공적이지 못하다면
                     * Javascript 에러를 throw 해서 catchError() 에러 처리한다.
                     */
                    throw res;
                }
            }),
            catchError(e => {
                // console.log('catchError: ', e);
                /**
                 * PhilGo API 의 에러이면 그대로 Observable Error 를 리턴한다.
                 */
                if (e['code'] !== void 0 && e['code'] < 0) {
                    return throwError(e);
                }
                /**
                 * PhilGo API 에러가 아니면, 인터넷 단절, 리눅스/웹서버 다운, PHP script 문법 에러 등이 있을 수 있다.
                 */
                const re: ApiErrorResponse = {
                    code: -400,
                    message: 'Please check your internet.'
                };
                return throwError(re);
            })
        );
    }

    /**
     * 서버로 부터 받은 데이터를 리턴한다. ( code 는 제외 )
     * 만약 코드 값이 0 이 아니면, 에러를 간주하고 에러를 throw 한다. ( 에러는 결국 catchError() 메소드에서 처리가 된다. )
     *
     * Returns the data from server without code.
     * If code is not 0, then it throws an error.
     *
     * @param responseData responseData is the response data coming from the server
     * @param requestData request is the request information sent to the server.
     *
     * @return response data from server if successful.
     *      Or else, throws an error.
     */
    // private checkResult(responseData, requestData) {
    //     if (responseData['code'] !== void 0 && responseData['code'] === 0) {
    //         return responseData['data'];
    //     } else {
    //         throw event;
    //     }
    // }
    /**
     * @todo 클라이언트 인터넷 에러인지, 서버에 에러인지 구분이 필요하다. 공식 문서에 나오는데로 해도 잘 안된다.
     * @param error error response
     */
    private handleError(error: HttpErrorResponse) {
        console.log('handleError() : ', error);
        /**
         * Is it error response from PHP?
         */
        if (this.isApiError(error)) {
            return throwError(error);
        }
        /**
         * Or else, It is an error related with internet or server, php script error.
         */
        const re: ApiErrorResponse = {
            code: -400,
            message: 'Please check your internet.'
        };
        return throwError(re);
    }
    private isApiError(e) {
        if (e['code'] !== void 0 && e['code'] < 0) {
            return true;
        } else {
            return false;
        }
    }

    version(): Observable<ApiVersionResponse> {
        return this.post({ method: 'version' });
    }
    exchangeRate(currency?: string): Observable<ApiVersionResponse> {
        return this.post({ method: 'exchangeRate', currency: currency });
    }


    /**
     * 클래스 메소드에 Generic 을 Overloading 하는 방법.
     * 상황: Generic 을 사용하는데, 파라메타가 optional 이라서 처치 곤란. 그래서 Overloading 을 사용.
     * 먼저, Overloading implementation 을 메소드 definition 바로 위에 올려야 한다.
     *
     * @example
        this.api.query<ApiCurrencyRequest, ApiCurrencyResponse>('exchangeRate', { currency: 'php' })
            .subscribe(re => {
                this.test(re.php, 'Got PHP currency');
                this.test(re.usd === void 0, 'No USD currency');
            }, e => console.log(e));
     */
    query<R>(method: string, data?): Observable<R>;
    query<D, R>(method: string, data: D): Observable<R>;
    query<DATA, RESPONSE>(method: string, data?: DATA): Observable<RESPONSE> {
        data['method'] = method;
        return this.post(data);
    }

    /**
     * 옛날 API (v2) 로 쿼리를 한다.
     * 주의: v2 Api 의 endpoint 에서 Raw Input 을 인식하지 못하므로 End point 에 module 과 action 을 적어주어,
     * DataLayer 에서 인식을 하도록 한다.
     */
    queryVersion2(req: ApiVersion2Request): Observable<any> {
        req.module = 'ajax';
        req.submit = 1;
        req.session_id = this.getSessionId();
        req.id = this.getIdxMember();
        const q = this.httpBuildQuery(req);
        console.log('PhilGoApiService::post() to Old V2 url: ', this.getV2ServerUrl() + '?' + q);
        const url = this.getV2ServerUrl() + '?module=ajax&action=' + req.action + '&submit=1';
        return this.http.post(url, req).pipe(
            map((res: ApiVersion2Response) => {
                console.log('old api: ', res);
                /**
                 * PhilGo API Version 2 부터 잘 처리된 결과 데이터가 전달되었다면,
                 * 데이터만 Observable 로 리턴한다.
                 */
                if (res.code !== void 0 && res.code === 0) {
                    // console.log('code: ', res.code);
                    if (res.data && res.data.code !== void 0 && res.data.code === 0) {
                        return res.data;
                    } if (res.action) {
                        /**
                         * action='post-list' will simply use the result data.
                         */
                        return res;
                    } else {
                        throw res.data;
                    }
                } else if (res.code !== void 0 && res.code) {
                    if (res.message !== void 0) {
                        throw { code: res.code, message: res.message };
                    }
                } else {
                    /**
                     * (인터넷 접속 에러나 서버 프로그램 에러가 아닌)
                     * PhilGo API 가 올바로 실행되었지만 결과에 성공적이지 못하다면
                     * Javascript 에러를 throw 해서 catchError() 에러 처리한다.
                     */
                    throw res;
                }
            })
        );
    }

    /**
     * Registers
     * @param data User registration data
     * @example see test file in 'philgo-api-test-service.ts'
     */
    register(data: ApiRegisterRequest) {
        return this.query<ApiRegisterRequest, ApiRegisterResponse>('register', data)
            .pipe(
                map(res => {
                    console.log('register -> query -> pipe -> map -> res: ', res);
                    this.saveUserInformation(res);
                    return res;
                })
            );
    }

    /**
     * Returns user profile data
     * @desc Use this method to
     *      - Get full data of the user information.
     *      - Display user dat into profile update form to update user data.
     */
    profile() {
        const data = this.getLoginObject();
        return this.query<ApiProfileResponse>('profile', data);
    }


    /**
     * Update user information
     *
     * This method gets form data and update user information on PhilGo sf_member table.
     *
     * @desc Use this method to update user information.
     * @param data user profile data to update
     */
    profileUpdate(data: ApiProfileUpdateRequest) {
        // data = Object.assign(data, this.getLoginObject());
        // console.log('profileUpdate data: ', data);
        return this.query<ApiProfileUpdateRequest, ApiProfileResponse>('profileUpdate', this.addLogin(data));
    }


    /**
     * User login
     *
     * Use this method to get session id which, laster, can be used to verify who you are.
     * This saves user's login information into localStorage.
     *
     * @param data email and password
     */
    login(data: ApiLoginRequest) {
        return this.query<ApiLoginRequest, ApiLoginResponse>('login', data)
            .pipe(
                map(res => {
                    this.saveUserInformation(res);
                    return res;
                })
            );
    }

    /**
     * Returns user login object.
     * @example
     *      data = Object.assign(data, this.getLoginObject());
     *
     */
    private getLoginObject() {
        return { idx_member: this.getIdxMember(), session_id: this.getSessionId() };
    }

    /**
     * Get an object and add login session id and idx and returns it.
     * @param obj Object to add login information.
     *          if `obj` is undefined or falsy, then it return a new object with login information.
     */
    private addLogin(obj?) {
        if (obj === void 0 || !obj) {
            obj = {};
        }
        obj[IDX_MEMBER] = this.getIdxMember();
        obj[SESSION_ID] = this.getSessionId();
        return obj;
    }

    /**
     * logout by deleting login information from localStorage.
     */
    logout() {
        localStorage.removeItem(SESSION_ID);
        localStorage.removeItem(NICKNAME);
        localStorage.removeItem(IDX_MEMBER);
    }

    /**
     * Save user login session id and nickname.
     *
     * This is invoked after register or login.
     *
     * @param user User information
     */
    private saveUserInformation(user: ApiUserInformation) {
        console.log('saveuserInformation: user: ', user);
        localStorage.setItem(SESSION_ID, user.session_id);
        localStorage.setItem(ID, user.id);
        localStorage.setItem(NICKNAME, user.nickname);
        localStorage.setItem(IDX_MEMBER, user.idx);
    }

    /**
     * Returns user session session id.
     *
     * @return
     *      session id as string
     *      null if the user is not logged in.
     */
    getSessionId(): string {
        return localStorage.getItem(SESSION_ID);
    }
    /**
     * Returns user idx.
     */
    getIdxMember(): string {
        return localStorage.getItem(IDX_MEMBER);
    }
    /**
     * Returns true if the user has logged in already.
     */
    isLoggedIn(): boolean {
        return !!this.getIdxMember();
    }
    /**
     * Returns false if the user has logged out already.
     */
    isLoggedOut(): boolean {
        return !this.isLoggedIn();
    }

    /**
     * Returns user idx.
     */
    getMemberId(): string {
        return localStorage.getItem(ID);
    }

    getMemberNickname(): string {
        return localStorage.getItem(NICKNAME);
    }

    uploadPrimaryPhotoWeb(files: FileList) {
        return this.fileUploadOnWeb(files, {
            gid: this.getMemberId(),
            code: 'primary_photo',
            finish: '1'
        });
    }

    fileUploadOnWeb(files: FileList, option: ApiFileUploadOptions = {}): Observable<any> {
        if (files === void 0 || !files.length || files[0] === void 0) {
            return throwError(ApiErrorFileNotSelected);
        }
        const file = files[0];

        const formData = new FormData();
        formData.append('file', file, file.name);
        formData.append('module', 'ajax');
        formData.append('action', 'file_upload_submit');
        console.log('option: ', option);
        if (option.gid) {
            formData.append('gid', option.gid);
        }
        if (option.finish) {
            formData.append('finish', option.finish);
        }
        if (option.login === 'pass') {
            formData.append('login', option.login);
        } else {
            formData.append('idx_member', this.getIdxMember());
            formData.append('session_id', this.getSessionId());
        }
        if (option.module_name) {
            formData.append('module_name', option.module_name);
        }
        if (option.code) {
            formData.append('varname', option.code);
        }

        const req = new HttpRequest('POST', this.getFileServerUrl(), formData, {
            reportProgress: true,
            responseType: 'json'
        });

        console.log('file upload: ', this.getFileServerUrl());
        return this.http.request(req).pipe(
            map(e => {
                if (e instanceof HttpResponse) { // success event.
                    if (e.status === 200) {
                        if (e.body) {
                            // upload success now.
                            // console.log('success: ', e);
                            // console.log('e.body.data', e.body['data']);
                            if (e.body['data']['result'] === 0) {
                                return e.body['data'];
                            } else {
                                throw { code: ApiErrorFileUploadError, message: e.body['data']['error'] };
                            }
                        } else {
                            return e.body; // Return Server error
                        }
                    }
                } else if (e instanceof HttpHeaderResponse) { // header event
                    return e;
                } else if (e.type === HttpEventType.UploadProgress) { // progress event
                    const precentage = Math.round(100 * e.loaded / e.total);
                    if (isNaN(precentage)) {
                        console.log('file upload error. percentage is not number');
                    } else {
                        console.log('upload percentage: ', precentage);
                        return precentage;
                    }
                }
                return e; // other events
            })
        );

    }

    /**
     * Returns thumbnail URL of the photo
     * @see sapcms_1_2/etc/resize_image.php for detail.
     * @example
     *  <img src="{{ api.thumbnailUrl({ width: 100, height: 100, path: form.url_profile_photo }) }}" *ngIf=" form.url_profile_photo ">
     */
    thumbnailUrl(option: ApiThumbnailOption): string {
        let url = this.getFileServerUrl().replace('index.php', '');
        let type = 'adaptive';
        if (option.type) {
            type = option.type;
        }
        const path = option.path.replace(url, '../');
        let quality = 100;
        if (option.quality) {
            quality = option.quality;
        }
        url += `etc/image_resize.php?${type}=1&w=${option.width}&h=${option.height}&path=${path}&qualty=${quality}`;
        return url;
    }

    deleteFile(idx: number) {
        return this.queryVersion2({ action: 'data_delete_submit', idx: idx });
    }

    forumPage(option: ApiForumPageRequest): Observable<ApiForumPageResponse> {
        return this.query<ApiForumPageRequest, ApiForumPageResponse>('forumPage', option);
    }

    /**
     * Gets a post from server.
     * @param idx Post idx or access code.
     */
    getPost(idx: number | string) {
        const req = {
            idx: idx
        };
        return this.query<any, ApiPostData>('getPost', req);
    }

    urlForumView(idx: number | string): string {
        return `/forum/view/${idx}`;
    }

    /**
     * Display short date
     * If it is today, then it dispays YYYY-MM-DD HH:II AP
     * @param stamp unix timestamp
     */
    shortDate(stamp) {
        const d = new Date(stamp * 1000);
        const dt = d.getFullYear().toString().substr(2, 2) +
            '-' + this.add0(d.getMonth() + 1) +
            '-' + this.add0(d.getDate()) +
            ' ' + this.add0(d.getHours()) +
            ':' + this.add0(d.getMinutes());

        // const d = new Date(stamp * 1000);
        const today = new Date();
        // let dt;
        if (d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth() && d.getDate() === today.getDate()) {
            // dt = d.toLocaleString();
            // dt = dt.substring(dt.indexOf(',') + 2).toLowerCase();
            // dt = dt.replace(/\:\d\d /, ' ');
            return dt;
        } else {
            return dt.substr(0, 10);
        }
        // return dt;
    }

    /**
     * Adds '0' infront of the `n` if the `n` is smaller than 10.
     * @param n numbre
     * @example
     *      add0(1);
     *      - input:  1
     *      - output: 01
     */
    add0(n: number): string {
        if (isNaN(n)) {
            return '00';
        }
        return n < 10 ? '0' + n : n.toString();
    }


    postWrite(req: ApiPostEditRequest): Observable<ApiPostEditResponse> {
        req.action = 'post_write_submit';
        return this.queryVersion2(req);
    }
}

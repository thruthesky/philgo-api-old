import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export const SESSION_ID = 'sessionId';
export const NICKNAME = 'nickname';
export const MEMBER_IDX = 'idxMember';


interface ApiOptionalRequest {
    method?: string;
    sessionId?: string;
}
interface ApiLoginRequest extends ApiOptionalRequest {
    email: string;
    password: string;
}
export interface ApiCurrencyRequest extends ApiOptionalRequest {
    currency?: string;
}
export interface ApiRegisterRequest extends ApiOptionalRequest {
    email: string;
    password: string;
    name: string;
    nickname: string;
    mobile: string;
}
export interface ApiProfileUpdateRequest extends ApiOptionalRequest {
    name: string;
    // nickname: string; // nickname cannot be updated.
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
interface ApiRegisterResponse {
    sessionId: string;
    idx: string;
    nickname: string;
}
interface ApiLoginResponse extends ApiRegisterResponse {
    sessionId: string;
}
interface ApiUserInformation extends ApiRegisterResponse {
    sessionId: string;
}
interface ApiProfileResponse {
    idx: string;
    email: string;
    mobile: string;
    name: string;
    nickname: string;
    password: string;
}


@Injectable()
export class PhilGoApiService {
    private apiUrl = '';
    constructor(
        public http: HttpClient
    ) {

    }

    setUrl(url: string) {
        this.apiUrl = url;
    }


    httpBuildQuery(params): string | null {
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
        console.log('PhilGoApiService::post() url: ', this.apiUrl + '?' + q);
        if (!this.apiUrl) {
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
        return this.http.post(this.apiUrl, data).pipe(
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
    checkResult(responseData, requestData) {
        if (responseData['code'] !== void 0 && responseData['code'] === 0) {
            return responseData['data'];
        } else {
            throw event;
        }
    }
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
     * Registers
     * @param data User registration data
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
        data = Object.assign(data, this.getLoginObject());
        console.log('profileUpdate data: ', data);
        return this.query<ApiProfileUpdateRequest, ApiProfileResponse>('profileUpdate', data);
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
     */
    getLoginObject() {
        return { idxMember: this.getUserIdx(), sessionId: this.getSessionId() };
    }

    /**
     * logout by deleting login information from localStorage.
     */
    logout() {
        localStorage.removeItem(SESSION_ID);
        localStorage.removeItem(NICKNAME);
        localStorage.removeItem(MEMBER_IDX);
    }

    /**
     * Save user login session id and nickname.
     *
     * This is invoked after register or login.
     *
     * @param user User information
     */
    saveUserInformation(user: ApiUserInformation) {
        localStorage.setItem(SESSION_ID, user.sessionId);
        localStorage.setItem(NICKNAME, user.nickname);
        localStorage.setItem(MEMBER_IDX, user.idx);
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
    getUserIdx(): string {
        return localStorage.getItem(MEMBER_IDX);
    }

}

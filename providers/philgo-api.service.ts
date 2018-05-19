import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';


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

    /**
     * Request to server through POST method.
     * @param data request data
     *
     *      data['session_id'] - user session id
     *      data['route'] - route
     *
     */
    post(data): Observable<any> {

        const q = this.httpBuildQuery(data);
        console.log('PhilGoApiService::post() url: ', this.apiUrl + '?' + q);

        if (!this.apiUrl) {
            console.error(`Error. Server URL is not set.`);
        }
        return this.http.post(this.apiUrl, data).pipe(
            map(event => this.checkResult(event, data)),
            catchError(e => this.handleError(e))
        );
    }

    checkResult(event, data) {
        if (event['code'] !== void 0 && event['code'] === 0) {
            return event['data'];
        } else {
            throw event;
        }
    }
    /**
     * @todo 클라이언트 인터넷 에러인지, 서버에 에러인지 구분이 필요하다. 공식 문서에 나오는데로 해도 잘 안된다.
     * @param error error response
     */
    private handleError(error: HttpErrorResponse) {
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
    query<R>(method: string, data = {}): Observable<R> {
        data['method'] = method;
        return this.post(data);
    }
}

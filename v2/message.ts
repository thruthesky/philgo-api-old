import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Api } from './api';
import { Member } from './member';
import { PHILGO_API_RESPONSE } from './philgo-api-interface';
export * from './philgo-api-interface';

export interface MESSAGE_LIST_OPTION {
    page_no?: number;
    mode?: string;
};
export interface MESSAGE_FORM {
    id_recv: string;
    subject: string;
    content: string;
};

export interface MESSAGE {
    idx: string;
    idx_recv: string;
    idx_send: string;
    gid: string;
    to: any;
    from: {
        id: string;
        idx: string;
        nickname: string;
    };
    subject: string;
    subjct_org: string;
    content: string;
    content_org: string;
    stamp_create: string;
    stamp_open: string;
};

export type MESSAGES = Array<MESSAGE>;

export interface MESSAGE_LIST extends PHILGO_API_RESPONSE {
    messages: MESSAGES
};

@Injectable()
export class Message extends Api {
    constructor( http: Http, private member: Member ) {
        super( http );
    }

    list( option: MESSAGE_LIST_OPTION, successCallback: ( data: MESSAGE_LIST ) => void, errorCallback: (error: string) => void, completeCallback?: () => void ) {
        
        let login = this.getLoginData();
        if ( login === void 0 || login.id === void 0 ) {
            errorCallback('login-first');
            completeCallback();
            return;
        }
        
        if ( option.page_no === void 0 ) option.page_no = 1;
        let url: string = this.getUrl( 'message' );
        url = url + '&id=' + login.id;
        url = url + '&session_id=' + login.session_id;
        url = url + '&page_no=' + option.page_no;
        this.get( url, successCallback, errorCallback, completeCallback );
    }


    opened( idx, successCallback: ( data: any ) => void, errorCallback: (error: string) => void, completeCallback?: () => void ) {
        let url: string = this.getUrl( 'message' );
        url += '&mode=read';
        url += '&idx=' + idx;
        let login = this.getLoginData();
        url = url + '&id=' + login.id;
        url = url + '&session_id=' + login.session_id;
        this.get( url, successCallback, errorCallback, completeCallback );
    }


    send( idx, successCallback: ( data: any ) => void, errorCallback: (error: string) => void, completeCallback?: () => void ) {

        // let url: string = this.getUrl( 'message' );
        // url += '&mode=read';
        // url += '&idx=' + idx;
        // let login = this.getLoginData();
        // url = url + '&id=' + login.id;
        // url = url + '&session_id=' + login.session_id;
        // this.get( url, successCallback, errorCallback, completeCallback );
    }

}
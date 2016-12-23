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

        if ( option.page_no === void 0 ) option.page_no = 1;
        let url: string = this.getUrl( 'message' ) + '&page_no=' + option.page_no;
        this.get( url, successCallback, errorCallback, completeCallback );

    }

}
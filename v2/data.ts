import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Api } from './api';
import { PHILGO_RESPONSE, FILE_UPLOAD_RESPONSE, FILE_UPLOAD_DATA, FILE_DELETE_RESPONSE } from './philgo-api-interface';
import { Member } from './member';
export * from './philgo-api-interface';

import { FileUploader } from 'ng2-file-upload/file-upload/file-uploader.class';

export interface FileUploadResponse {
  success: boolean;
  item: any;
  response: any;
  status: any;
  headers: any;
};

@Injectable()
export class Data extends Api {
    private uploader: FileUploader = Object();
    private result:FileUploadResponse = <FileUploadResponse> {};
    private urlFileServer: string = "http://file.philgo.com/index.php?module=ajax&submit=1&action=";
    constructor( http: Http, private member: Member ) {
        super( http );
    }
    upload( files, successCallback: (data: FILE_UPLOAD_RESPONSE) => void, failureCallback: (error:string) => void, progressCallback: (progress:number) => void) {
        console.log("Data::upload()");
        // let url = this.getUrl('file_upload_submit');
        let url = this.urlFileServer + 'file_upload_submit';
        let login = this.member.getLogin();
        if ( login ) {
            url += '&id=' + login.id;
            url += '&session_id=' + login.session_id;
        }
        if ( files.gid !== void 0 ) {
            url += '&gid=' + files.gid;
            delete files.gid;
        }
        if ( files.login !== void 0 ) {
            url += '&login=' + files.login;
            delete files.login;
        }
        if ( files.varname !== void 0 ) {
            url += '&varname=' + files.varname;
            delete files.varname;
        }
        this.uploader = new FileUploader({ url: url });
        this.initFileUpload( successCallback, failureCallback, progressCallback );
        try {
            this.uploader.addToQueue( files );
        }
        catch ( e ) {
            failureCallback( "Failed to addToQueue() onBrowserUpload()" );
        }
    }
    delete( data: FILE_UPLOAD_DATA, successCallback: (re:FILE_DELETE_RESPONSE) => void, failureCallback: ( error: string) => void ) {
        let url = this.urlFileServer + "data_delete_submit";
        let login = this.member.getLogin();
        if ( login ) {
            url += '&id=' + login.id;
            url += '&session_id=' + login.session_id;
        }
        if ( data.gid ) url += '&gid=' + data.gid;
        url += '&idx=' + data.idx;
        this.get( url, successCallback, failureCallback );
    }
    /**
     * This updates idx_member of 'gid'
     * 업로드된 파일 중 'gid' 에 해당하는 것을 찾아서 'idx_member' 를 업데이트 한다.
     * 이것은 회원 가입 페이지에서 사진 업로드를 먼저 하고, 회원 가입을 나중에 해서, 업로드된 사진의 소유를 가입된 회원의 것으로 변경하고자 할 때 사용한다.
     * 
     * 참고로 게시판에서는 GID 만으로 충분하므로 별도로 idx_member 를 업데이트 하지 않는다.
     */
    updateMemberIdx( gid, idx_member, successCallback, failureCallback ) {
        let url = this.urlFileServer + 'data_update_idx_member&gid=' + gid + '&idx_member=' + idx_member;
        console.log(url);
        this.get( url, successCallback, failureCallback );
    }
    initFileUpload( successCallback: (data: FILE_UPLOAD_RESPONSE) => void, failureCallback: (error:string) => void, progressCallback: (progress:number) => void ) {
        this.uploader.onSuccessItem = (item, response, status, headers) => {
            this.result = {
            "success": true,
            "item": item,
            "response": response,
            "status": status,
            "headers": headers
            };
            //console.log( 'onSuccessItem : ', this.result );
        };
        this.uploader.onErrorItem = (item, response, status, headers) => {
            this.result = {
            "success": false,
            "item": item,
            "response": response,
            "status": status,
            "headers": headers
            };
            //console.log( 'onErrorItem : ', this.result );
        };
        this.uploader.onProgressItem = ( item, progress ) => {
            try {
                // console.info(progress);
                let p = parseInt( progress );
                let per = Math.round( p );
                if ( progressCallback ) progressCallback( per );
                //console.log("onProgressItem: ", per );
            }
            catch ( e ) {
                console.error( progress );
            }
        };
        this.uploader.onCompleteAll = () => {
            console.log("uploader.onCompleteAll()");
            // this.onBrowserUploadComplete();
            let data = null;
            try {
                data = JSON.parse( this.result['response'] );
            }
            catch ( e ) {
                console.error("upload error: ", this.result['response'], e);
                return failureCallback( 'json-parse-error' );
            }
            if ( successCallback ) successCallback( data );
        };
        this.uploader.onAfterAddingFile = ( fileItem ) => {
            console.log('uploader.onAfterAddingFile: begins to upload. ', fileItem);
            fileItem.withCredentials = false; // remove credentials
            fileItem.upload(); // upload file.
        }
    }
}
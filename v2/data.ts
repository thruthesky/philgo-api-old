import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Api } from './api';
import { FILE_UPLOAD_RESPONSE, FILE_DELETE_RESPONSE, CODE_PRIMARY_PHOTO } from './philgo-api-interface';
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

    /**
     * Returns the URL of file upload.
     * 
     */
    getUploadUrl( gid?: string, module_name?: string, code?: string, finish?: number, login?: string ) {
        let url = this.urlFileServer + 'file_upload_submit';

        //
        //
        if ( gid ) url += '&gid=' + gid;
        if ( login && login == 'pass' ) url += '&login=' + login;
        else {
            let login = this.member.getLoginData();
            if ( login ) {
                url += '&id=' + login.id;
                url += '&session_id=' + login.session_id;
            }
        }
        if ( module_name ) url += '&module_name=' + module_name;
        if ( code ) url += '&varname=' + code;
        if ( finish ) url += '&finish=1';

        return url;
    }

    /**
     * This does file upload.
     * 
     * 
     * @note if user has logged in, then it automatically send user authentication information to the server.
     * 
     * 
     * @note 회원 가입/수정 화면에서 사진을 등록 할 때,
     *          회원 가입하기 전에 사진을 업로드와 삭제를 위해서 'gid' 는 중요하다.
     *          하지만, 가입 후에는, gid 값은 반드시 넣어야 하는데, 엉터리 값을 넣으면 된다.
     * 
     */
    upload( files, successCallback: (data: FILE_UPLOAD_RESPONSE) => void, failureCallback: (error:string) => void, progressCallback?: (progress:number) => void) {
        console.log("Data::upload()");
        // let url = this.getUrl('file_upload_submit');
        let url = this.urlFileServer + 'file_upload_submit';
        
        //
        //
        if ( files.gid !== void 0 ) {
            url += '&gid=' + files.gid;
            delete files.gid;
        }

        // login=pass 이면 회원 가입 없이 파일 업로드 한다.
        if ( files.login !== void 0 && files.login == 'pass' ) {
            url += '&login=' + files.login;
            delete files.login;
        }
        // login=pass 가 아니면, 무조건 회원 가입을 해야지만 파일 업로드를 할 수 있다.
        else {
            let login = this.member.getLoginData();
            if ( login ) {
                url += '&id=' + login.id;
                url += '&session_id=' + login.session_id;
            }
        }
        if ( files.varname !== void 0 ) {
            url += '&varname=' + files.varname;
            delete files.varname;
        }
        if ( files.module_name !== void 0 ) {
            url += '&module_name=' + files.module_name;
            delete files.module_name;
        }
        
        console.log("uplaod: ", url);
        this.uploader = new FileUploader({ url: url });
        this.initFileUpload( successCallback, failureCallback, progressCallback );
        try {
            this.uploader.addToQueue( files );
        }
        catch ( e ) {
            failureCallback( "Failed to addToQueue() onBrowserUpload()" );
        }
    }

    /**
     * Deletes uploaded file.
     * 
     * 
     * @param data - data['idx'] 또는 data['gid'] 값이 반드시 들어와야 한다.
     * @note 회원 정보 사진을 관리(업로드,삭제) 할 때,
     *      회원 가입을 할 때,
     *          로그인/가입을 하지 않은 상태에서 파일을 업로드하면 'gid' 값을 입력해야하고, 그 'gid' 값으로 삭제를 해야 한다.
     *          로그인을 한 다음에는 파일 업로드/삭제를 할 때, 'idx_member' 를 사용하고 코드는 'priamry_photo' 로 고정되므로 gid' 에 엉터리 값이 들어가도 된다.
     * 
     * @note 참고 : module/data/delte_submit.php 의 상단 코멘트를 참고한다.
     * 
     * @note 파일을 삭제 할 때, gid 와 회원 로그인 정보를 같이 전달한다.
     *      이 둘 중에 맞는 것이 있으면 삭제를 한다.
     * 
     * @code
     * 
                let data = {
                    idx: idx,
                    gid: this.gid
                }
                this.data.delete( data, (re) => {
                    console.log("file deleted: idx: ", re.data.idx);
                    if ( silent === void 0 || silent !== true ) {
                        this.progress = 0;
                        this.urlPhoto = this.urlDefault;
                        this.inputFileValue = '';
                    }
                    this.uploadData = null;
                }, error => {
                    alert( error );
                } );
     * @endcode
     */
    delete( data: { idx?: any, gid?: string }, successCallback: (re:FILE_DELETE_RESPONSE) => void, failureCallback: ( error: string) => void ) {
        let url = this.urlFileServer + "data_delete_submit";
        let login = this.member.getLoginData();
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
    updateMemberIdx( gid, successCallback, failureCallback ) {
        let login = this.getLoginData();
        let url = this.getUrl('data_update_idx_member')
             + '&gid=' + gid
             + '&id=' + login.id
             + '&session_id=' + login.session_id;
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



    

    /**
     * This does primary photo upload for users who are not logged in.
     * 
     * @note Be sure you update idx_member after register.
     * 
     * @param files - This is 'event.target.files' from HTML FORM INPUT type='file'
     */
    uploadAnonymousPrimaryPhoto( gid: string, files, successCallback: (data: FILE_UPLOAD_RESPONSE) => void, failureCallback: (error:string) => void, progressCallback?: (progress:number) => void) {
        files.gid = gid;
        files.login = 'pass';
        files.varname = CODE_PRIMARY_PHOTO;
        files.module_name = 'member';
        this.upload( files, successCallback, failureCallback, progressCallback );
    }
    getUploadUrlAnonymousPrimaryPhoto( gid: string ) {
        return this.getUploadUrl( gid, 'member', CODE_PRIMARY_PHOTO, 0, 'pass' );
    }
    /**
     * If user logged in, use this method.
     */
    uploadPrimaryPhoto( files, successCallback: (data: FILE_UPLOAD_RESPONSE) => void, failureCallback: (error:string) => void, progressCallback?: (progress:number) => void) {
        let login = this.getLoginData();
        files.gid = login.id;
        files.varname = CODE_PRIMARY_PHOTO;
        files.module_name = 'member';
        this.upload( files, successCallback, failureCallback, progressCallback );
    }
    getUploadUrlPrimaryPhoto() {
        let login = this.getLoginData();
        return this.getUploadUrl( login.id, 'member', CODE_PRIMARY_PHOTO, 1 );
    }

    /**
     * Returns file.idx from a uploaded file url.
     */
    getIdxFromUrl( url: string ) : number {
        try {
            if ( url ) {
                let ar = url.split('/');
                return parseInt(ar[ ar.length - 1 ]);
            }
        }
        catch( e ) {
            return 0;
        }
    }

}
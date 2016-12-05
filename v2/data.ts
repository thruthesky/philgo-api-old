import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Api } from './api';
import { PHILGO_RESPONSE } from './philgo-api-interface';
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
    private uploader;
     private result:FileUploadResponse = <FileUploadResponse> {};
    constructor( http: Http ) {
        super( http );
    }
    upload( files, successCallback, failureCallback) {
        console.log("Data::upload()");
        let url = this.getUrl('file_upload_submit');
        url += "&gid=x123456&login=pass";
        this.uploader = new FileUploader({ url: url });
        this.initFileUpload( successCallback, failureCallback );

        try {
            this.uploader.addToQueue( files );
        }
        catch ( e ) {
            failureCallback( "Failed to addToQueue() onBrowserUpload()" );
        }

    }
    initFileUpload( successCallback, failureCallback ) {
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
        this.uploader.onCompleteAll = () => {
            console.log("uploader.onCompleteAll()");
            // this.onBrowserUploadComplete();
            if ( successCallback ) successCallback( this.result );
        };
        this.uploader.onAfterAddingFile = ( fileItem ) => {
            console.log('uploader.onAfterAddingFile: begins to upload. ', fileItem);
            fileItem.withCredentials = false; // remove credentials
            fileItem.upload(); // upload file.
        }
    }
}
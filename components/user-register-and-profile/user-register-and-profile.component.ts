import { Component } from '@angular/core';
import {
    PhilGoApiService, ApiErrorFileNotSelected, ApiErrorFileUploadError, ApiFileUploadResponse
} from '../../providers/philgo-api.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-user-register-and-profile-component',
    templateUrl: 'user-register-and-profile.component.html'
})
export class UserRegisterAndProfileComponent {

    photo: ApiFileUploadResponse = null;
    constructor(
        public api: PhilGoApiService
    ) {
    }
    onChangePrimaryPhoto(event: Event) {
        this.api.uploadPrimaryPhotoWeb(event.target['files']).subscribe(re => {
            // console.log(event);
            if (typeof re === 'number') {
                console.log(`File is ${re}% uploaded.`);
            } else if (re['code'] && re['idx'] === void 0) {
                console.log('error: ', re);
            } else if (re['idx'] !== void 0 && re['idx']) {
                // console.log('file upload success: ', re);
                this.photo = re;
            }
        }, (e: HttpErrorResponse) => {
            console.log('error subscribe: ', e);
            if (e.error instanceof Error) {
                console.log('Client-side error occurred.');
            } else {
                // console.log(err);
                if (e.message === ApiErrorFileNotSelected) {
                    console.log('file is not selected');
                } else if (e['code'] !== void 0 && e['code'] === ApiErrorFileUploadError) {
                    console.log('File upload error:', e.message);
                } else {
                    console.log('FILE TOO LARGE' + e.message);
                }
            }
            console.log('file upload failed');
        });
    }
}


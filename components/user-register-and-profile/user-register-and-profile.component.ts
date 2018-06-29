import { Component, Output, EventEmitter, Input } from '@angular/core';
import {
    PhilGoApiService, ApiErrorFileNotSelected, ApiErrorFileUploadError,
    ApiRegisterRequest, ApiProfileUpdateRequest, ApiRegisterResponse
} from '../../providers/philgo-api.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-user-register-and-profile-component',
    templateUrl: 'user-register-and-profile.component.html',
    styles: [`
    .set .caption {
        display: inline-block;
        width: 100px;
    }
    `]
})
export class UserRegisterAndProfileComponent {

    @Input() text = {
        loadingProfile: 'LOADING...',
        email: 'Email'
    };
    @Output() register: EventEmitter<ApiRegisterResponse> = new EventEmitter();
    error = null;
    form: ApiRegisterRequest = {
        email: '',
        password: '',
        name: '',
        nickname: '',
        mobile: ''
    };
    percentage = 0;
    // photo: ApiFileUploadResponse = null;
    // justRegistered = false;
    loader = {
        profile: false,
        submit: false
    };
    constructor(
        public api: PhilGoApiService
    ) {
        if (api.isLoggedIn()) {
            this.loader.profile = true;
            api.profile().subscribe(user => {
                this.loader.profile = false;
                this.form = user;
                console.log('user: ', user);
            }, e => alert(e.message));
        }
    }
    onChangePrimaryPhoto(event: Event) {
        this.api.uploadPrimaryPhotoWeb(event.target['files']).subscribe(re => {
            // console.log(event);
            if (typeof re === 'number') {
                console.log(`File is ${re}% uploaded.`);
                this.percentage = re;
            } else if (re['code'] && re['idx'] === void 0) {
                console.log('error: ', re);
            } else if (re['idx'] !== void 0 && re['idx']) {
                // console.log('file upload success: ', re);
                // this.photo = re;
                this.form.url_profile_photo = re['url'];
                this.percentage = 0;
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
    onSubmit(event: Event) {
        event.preventDefault();
        this.error = null;
        console.log('onSubmit()', this.form);
        this.loader.submit = true;
        if (this.api.isLoggedIn()) {
            const data: ApiProfileUpdateRequest = {
                name: this.form.name,
                mobile: this.form.mobile
            };
            this.api.profileUpdate(data).subscribe( user => {
                this.loader.submit = false;
                console.log('profile update success: ', user);
            }, e => {
                this.loader.submit = false;
                alert(e.message);
            });
        } else {
            this.api.register(this.form).subscribe(user => {
                this.register.emit( user );
                this.loader.submit = false;
                // this.justRegistered = true;
            }, e => {
                this.loader.submit = false;
                // alert('Failed: ' + e.message);
                this.error = e;
            });
        }
        return false;
    }

    onClickDeletePrimaryPhoto() {
        const idx = this.form.url_profile_photo.split('/').pop();
        this.api.deleteFile(parseInt(idx, 10)).subscribe( res => {
            console.log('res: ', res);
            this.form.url_profile_photo = '';
        }, e => alert(e.message));
    }
}


import { Component, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { PhilGoApiService } from '../../philgo-api.module';
import { ApiLoginRequest, ApiLoginResponse, ApiErrorResponse } from '../../providers/philgo-api.service';
@Component({
    selector: 'app-user-login-component',
    templateUrl: 'login.component.html',
    styles: [`
        form .set .caption {
            width: 70px;
        }
    `]
})
export class UserLogin implements AfterViewInit {

    @Input() displayError = true;
    @Input() text = {
        email: 'Email',
        password: 'Password',
        login: 'Login',
        submitting: 'Connecting to server...'
    };
    @Output() login: EventEmitter<ApiLoginResponse> = new EventEmitter();
    @Output() error: EventEmitter<ApiErrorResponse> = new EventEmitter();
    apiError = null;
    loader = {
        submit: false
    };
    form: ApiLoginRequest = {
        email: '',
        password: ''
    };
    constructor(
        public api: PhilGoApiService
    ) {

    }

    ngAfterViewInit() {
        // setTimeout(() => {
        //     this.text = Object.assign({}, this.defaultText, this.text);
        // }, 100);
    }

    onSubmit(event: Event) {
        event.preventDefault();
        this.loader.submit = true;
        this.apiError = null;
        console.log('onSubmit()', this.form);
        this.api.login(this.form).subscribe(res => {
            this.loader.submit = false;
            this.login.emit(res);
            console.log('login success: ', res);
        }, e => {
            this.loader.submit = false;
            this.apiError = e;
            this.error.emit(e);
        });
        return false;
    }
}


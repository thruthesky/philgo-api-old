import { Component } from '@angular/core';
import { PhilGoApiService } from '../../philgo-api.module';
import { ApiLoginRequest } from '../../providers/philgo-api.service';

@Component({
    selector: 'app-user-login-component',
    templateUrl: 'login.component.html'
})
export class UserLogin {
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
    onSubmit(event: Event) {
        event.preventDefault();
        this.api.login(this.form).subscribe(res => {
            console.log('login success: ', res);
        }, e => alert(e.message));
        return false;
    }
}


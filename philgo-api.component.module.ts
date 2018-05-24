import { NgModule } from '@angular/core';
import { PhilGoApiService } from './providers/philgo-api.service';
import { HttpClientModule } from '@angular/common/http';
import { UserRegisterAndProfileComponent } from './components/user-register-and-profile/user-register-and-profile.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserLogin } from './components/login/login.component';
export { UserRegisterAndProfileComponent };

@NgModule({
    declarations: [
        UserRegisterAndProfileComponent,
        UserLogin
    ],
    exports: [
        UserRegisterAndProfileComponent,
        UserLogin
    ],
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule
    ],
    providers: [
        PhilGoApiService
    ]
})
export class PhilGoApiComponentModule {}

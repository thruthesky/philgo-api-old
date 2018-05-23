import { NgModule } from '@angular/core';
import { PhilGoApiService } from './providers/philgo-api.service';
import { HttpClientModule } from '@angular/common/http';
import { UserRegisterAndProfileComponent } from './components/user-register-and-profile/user-register-and-profile.component';
import { CommonModule } from '@angular/common';
export { UserRegisterAndProfileComponent };

@NgModule({
    declarations: [
        UserRegisterAndProfileComponent
    ],
    exports: [
        UserRegisterAndProfileComponent
    ],
    imports: [
        CommonModule,
        HttpClientModule
    ],
    providers: [
        PhilGoApiService
    ]
})
export class PhilGoApiComponentModule {}

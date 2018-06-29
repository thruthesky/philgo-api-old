import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PhilGoApiModule } from './../../philgo-api.module';
import { UserRegisterAndProfileComponent } from './user-register-and-profile.component';

@NgModule({
    declarations: [
        UserRegisterAndProfileComponent
    ],
    exports: [
        UserRegisterAndProfileComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        PhilGoApiModule
    ],
    providers: []
})
export class PhilGoApiRegisterComponentModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PhilGoApiModule } from './../../philgo-api.module';
import { UserLogin } from './login.component';

@NgModule({
    declarations: [
        UserLogin
    ],
    exports: [
        UserLogin
    ],
    imports: [
        CommonModule,
        FormsModule,
        PhilGoApiModule
    ],
    providers: []
})
export class PhilGoApiLoginComponentModule {}

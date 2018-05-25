import { NgModule } from '@angular/core';
import { PhilGoApiService } from './providers/philgo-api.service';
import { HttpClientModule } from '@angular/common/http';
import { UserRegisterAndProfileComponent } from './components/user-register-and-profile/user-register-and-profile.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserLogin } from './components/login/login.component';
import { PostListComponent } from './components/forum/post-list/post-list.component';
import { RouterModule } from '@angular/router';
export { UserRegisterAndProfileComponent };

@NgModule({
    declarations: [
        UserRegisterAndProfileComponent,
        UserLogin,
        PostListComponent
    ],
    exports: [
        UserRegisterAndProfileComponent,
        UserLogin,
        PostListComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        HttpClientModule
    ],
    providers: [
        PhilGoApiService
    ]
})
export class PhilGoApiComponentModule {}

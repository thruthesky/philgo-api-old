import { NgModule } from '@angular/core';
import { PhilGoApiService } from './providers/philgo-api.service';
import { HttpClientModule } from '@angular/common/http';
import { UserRegisterAndProfileComponent } from './components/user-register-and-profile/user-register-and-profile.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserLogin } from './components/login/login.component';
import { PostListComponent } from './components/forum/post-list/post-list.component';
import { RouterModule } from '@angular/router';
import { PostViewComponent } from './components/forum/post-view/post-view.component';
import { CommentViewComponent } from './components/forum/comment-view/comment-view.component';
import { PostEditComponent } from './components/forum/post-edit/post-edit.component';
import { CommentEditComponent } from './components/forum/comment-edit/comment-edit.component';
import { CommentListComponent } from './components/forum/comment-list/comment-list.component';
import { EditorModule } from '../angular-wysiwyg-editor/editor.module';
import { DataComponent } from './components/forum/data/data.component';

@NgModule({
    declarations: [
        UserRegisterAndProfileComponent,
        UserLogin,
        PostListComponent,
        PostViewComponent,
        CommentViewComponent,
        PostEditComponent,
        CommentEditComponent,
        CommentListComponent,
        DataComponent
    ],
    exports: [
        UserRegisterAndProfileComponent,
        UserLogin,
        PostListComponent,
        PostViewComponent,
        CommentViewComponent,
        PostEditComponent,
        CommentEditComponent,
        CommentListComponent,
        DataComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        HttpClientModule,
        EditorModule
    ],
    providers: [
        PhilGoApiService
    ]
})
export class PhilGoApiComponentModule {}

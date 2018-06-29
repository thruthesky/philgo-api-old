import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EditorModule } from '../../../angular-wysiwyg-editor/editor.module';
import { PhilGoApiModule } from '../../philgo-api.module';
import { PostListComponent } from './post-list/post-list.component';
import { PostViewComponent } from './post-view/post-view.component';
import { CommentViewComponent } from './comment-view/comment-view.component';
import { PostEditComponent } from './post-edit/post-edit.component';
import { CommentEditComponent } from './comment-edit/comment-edit.component';
import { CommentListComponent } from './comment-list/comment-list.component';
import { DataComponent } from './data/data.component';

@NgModule({
    declarations: [
        PostListComponent,
        PostViewComponent,
        CommentViewComponent,
        PostEditComponent,
        CommentEditComponent,
        CommentListComponent,
        DataComponent
    ],
    exports: [
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
        EditorModule,
        PhilGoApiModule
    ],
    providers: []
})
export class PhilGoApiForumComponentModule {}

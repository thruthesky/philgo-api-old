import { Component, OnInit, Input, OnChanges, ViewChild } from '@angular/core';
import { PhilGoApiService, ApiPostData, ApiComment } from '../../../providers/philgo-api.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CommentEditComponent } from '../comment-edit/comment-edit.component';

@Component({
    selector: 'app-comment-view-component',
    templateUrl: 'comment-view.component.html',
    styleUrls: ['comment-view.component.css']
})

export class CommentViewComponent implements OnInit, OnChanges {
    @ViewChild('editComponent') editComponent: CommentEditComponent;
    @Input() post: ApiPostData;
    @Input() comment: ApiPostData;
    // mode: 'edit' | 'reply' | 'view' = 'view';
    show = {
        comment: true,
        buttons: true
    };
    constructor(
        public sanitizer: DomSanitizer,
        public api: PhilGoApiService
    ) { }

    ngOnInit() { }
    ngOnChanges() {
        if (this.comment) {
            if (this.comment['safe']) {
                //
            } else {
                this.comment.content = <any>this.sanitizer.bypassSecurityTrustHtml(this.comment.content);
                this.comment['safe'] = true;
            }
            this.comment['date'] = this.api.shortDate(this.comment.stamp);
        }
    }
    onClickEdit() {
        // this.mode = 'edit';
        this.show.comment = false;
        this.show.buttons = false;
        this.editComponent.activateEdit();
    }
    onClickReply() {
        // this.mode = 'reply';
        this.show.buttons = false;
        this.editComponent.comment = null;
        this.editComponent.activateReply();
    }
    onCommentWriteSuccess() {
        this.show.comment = true;
        this.show.buttons = true;
    }
    onCommentEditSuccess() {

    }
    onCommentFormCancel() {
        this.show.comment = true;
        this.show.buttons = true;
        // this.mode = 'view';
    }
}


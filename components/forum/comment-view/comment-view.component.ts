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
    ) {
        console.log('CommentViewComponent::constructor()');
    }

    ngOnInit() { }
    ngOnChanges() {
        if (this.comment) {
            this.comment['date'] = this.api.shortDate(this.comment.stamp);
        }
    }
    onClickEdit() {
        // this.mode = 'edit';
        this.show.comment = false;
        this.show.buttons = false;
        this.editComponent.activateEdit();
    }

    onClickCommentDelete() {
        if ( this.comment.member.idx !== this.api.getIdxMember() ) {
            alert( 'This is not your comment.' );
            return;
        }
        this.api.postDelete(this.comment.idx).subscribe(res => {
            console.log('onClickCommentDelete: ', res);
            this.api.setDelete( this.comment );
        }, e => alert(e.message));
    }
    onClickReply() {
        // this.mode = 'reply';
        this.show.buttons = false;
        this.editComponent.comment = null;
        this.editComponent.activateReply();
    }
    onCommentWriteSuccess(comment: ApiComment) {
        this.show.comment = true;
        this.show.buttons = true;
    }

    /**
     * Comment edit event handler
     * @param comment edited comment
     */
    onCommentEditSuccess(comment: ApiComment) {
        this.show.comment = true;
        this.show.buttons = true;
    }
    onCommentFormCancel() {
        this.show.comment = true;
        this.show.buttons = true;
        // this.mode = 'view';
    }


    onClickGood(comment: ApiComment) {
        this.api.vote({
            idx: comment.idx,
            for: 'G'
        }).subscribe( res => {
            console.log('vode good: ', res);
            this.comment.good = res.good;
        }, e => alert(e.message));
    }
    onClickBad(comment: ApiComment) {
        this.api.vote({
            idx: comment.idx,
            for: 'B'
        }).subscribe( res => {
            console.log('vode good: ', res);
            this.comment.bad = res.bad;
        }, e => alert(e.message));
    }
    onClickReport(comment: ApiComment) {
        this.api.report(comment.idx).subscribe( res => {
            alert('This comment has been reported to admin.');
        }, e => alert(e.message));
    }
}


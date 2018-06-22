import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { PhilGoApiService, ApiComment, ApiPost } from '../../../providers/philgo-api.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CommentEditComponent } from '../comment-edit/comment-edit.component';

@Component({
    selector: 'app-post-view-component',
    templateUrl: 'post-view.component.html',
    styles: [`
    .post-view {
        padding: .25em;
    }
    .post-parent {}
    .post-subject {
        padding: .75em;
        background-color: grey;
        color: white;
    }
    .post-meta {
        padding: .75em;
        background-color: #eee;
    }
    .post-content {
        padding: .75em;
        line-height: 160%;
        background-color: #e8e8e8;
    }
    `]
})
export class PostViewComponent implements OnChanges {


    @ViewChild('commentEditComponent') commentEditComponent: CommentEditComponent;
    @Input() post: ApiPost = null;
    @Input() showClose = false;
    @Input() mode: 'edit' | 'view' = 'view';


    constructor(
        public sanitizer: DomSanitizer,
        public api: PhilGoApiService
    ) {

    }

    ngOnChanges() {
        console.log('ngOnChanges()');
        if (this.post) {
            this.post['date'] = this.api.shortDate(this.post.stamp);
        }
    }

    onClickPostEdit() {
        console.log('post: ', this.post);
        console.log('my idx:', this.api.getIdxMember());
        if (this.post.member.idx !== this.api.getIdxMember()) {
            alert('This is not your post.');
            return;
        }
        this.mode = 'edit';
    }

    onClickPostDelete() {
        if (this.post.member.idx !== this.api.getIdxMember()) {
            alert('This is not your post.');
            return;
        }
        this.api.postDelete(this.post.idx).subscribe(res => {
            console.log('postDelete: ', res);
            this.api.setDelete(this.post);
        }, e => alert(e.message));
    }

    onPostWriteSuccess(post) {
        // this.listComponent.write(post);
        // this.activateView();
    }
    onPostEditSuccess(post) {
        this.mode = 'view';
        this.post = post;
        // this.listComponent.edit(post);

        //  <!-- (edit)=" mode = 'view'; this.post = $event; " -->
        // this.activateView();
    }
    onPostFormCancel() {
        // this.activateView();
        this.mode = 'view';
    }
    /**
     * post view close button clicked
     */
    onPostViewClose() {
        this.post['mode'] = 'hide';
    }
    onCommentWriteSuccess(comment: ApiComment) {
        this.commentEditComponent.display = true;
    }

    onClickGood(post: ApiPost) {
        this.api.vote({
            idx: post.idx,
            for: 'G'
        }).subscribe( res => {
            console.log('vode good: ', res);
            this.post.good = res.good;
        }, e => alert(e.message));
    }
    onClickBad(post: ApiPost) {
        this.api.vote({
            idx: post.idx,
            for: 'B'
        }).subscribe( res => {
            console.log('vode good: ', res);
            this.post.bad = res.bad;
        }, e => alert(e.message));
    }

    onClickReport(post: ApiPost) {
        this.api.report(post.idx).subscribe( res => {
            alert('This post has been reported to admin.');
        }, e => alert(e.message));
    }
}


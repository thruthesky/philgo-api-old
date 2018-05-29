import { Component, OnInit, Input, ViewChild, ElementRef, OnChanges, Output, EventEmitter } from '@angular/core';
import { PhilGoApiService } from '../../../philgo-api.module';
import { ApiCommentEditRequest, ApiPostData, ApiComment } from '../../../providers/philgo-api.service';


@Component({
    selector: 'app-comment-edit-component',
    templateUrl: 'comment-edit.component.html',
    styleUrls: ['comment-edit.component.css']
})

export class CommentEditComponent implements OnInit, OnChanges {
    @ViewChild('commentEdit') commentEdit: ElementRef;

    /**
     * Decides to display 'none' or 'block'
     */
    @Input() display = false;
    /**
     * Post of the comemnt.
     * This is always the root post. This will be used for inserting a comment.
     */
    @Input() post: ApiPostData = null;
    /**
     * For creating a comment under a post or another comment.
     * This can be a post or a comment.
     */
    @Input() parent: ApiPostData = null;
    /**
     * For editing a comment.
     * @desc This is available on edit and reply. You do not need to use it on reply.
     * @desc This is not available on the reply of immediate child of root post.
     */
    @Input() comment: ApiComment = null;

    /**
     * events.
     */
    @Output() write: EventEmitter<ApiComment> = new EventEmitter();
    @Output() edit: EventEmitter<ApiComment> = new EventEmitter();
    @Output() cancel: EventEmitter<void> = new EventEmitter();

    form: ApiCommentEditRequest = <any>{};

    size: 'small' | 'big' = 'small';
    loader = {
        submit: false
    };

    mode: 'edit' | 'reply' = 'reply';

    constructor(
        public api: PhilGoApiService
    ) {
    }

    // testCreate() {
    //     this.form.idx_parent = this.parent.idx;
    //     this.form.content = 'test coment';
    //     this.onSubmit();
    // }
    ngOnInit() { }

    ngOnChanges() {
        // if ( this.parent ) {}
        // if (this.comment) {
        //     this.form.idx = this.comment.idx;
        //     this.form.content = this.comment.content_stripped;
        // } else if (this.parent) {
        //     // this.testCreate();
        //     this.form.idx_parent = this.parent.idx;
        // }
    }

    isReply() {
        return this.mode === 'reply';
    }
    isEdit() {
        return this.mode === 'edit';
    }

    activateEdit() {
        this.mode = 'edit';
        this.form.idx_parent = 0;
        this.form.idx = this.comment.idx;
        this.form.content = this.comment.content_stripped;
        this.activate();
    }
    activateReply() {
        this.mode = 'reply';
        this.activate();
    }
    activate() {
        this.display = true;
        if (this.size === 'small') {
            this.size = 'big';



            this.commentEdit.nativeElement.scrollIntoView(false);

            this.delayActivate(100);
            this.delayActivate(300);
        }
    }
    /**
     * 코멘트를 입력할 때, 코멘트 창을 크게 보여주는데, 이 때, CSS 클래스로 크기를 조정한다.
     * 문제는 CSS 로 크기를 조절하는 것 보다 scrollIntoView() 가 더 빨리 실행되어져 버려서,
     * 코멘트 창의 전체 크기가 커 지기도 전에 scrollIntoview() 는 실행을 종료 해 버려서, 실제로 완전한 크기의 코멘트 창을 계산하지 못해서,
     * 코멘트 창이 부분적으로만 보이는 경우가 발생한다. 그러한 것을 방자하기 위해서 delay 를 잠깐 한다.
     * 아주 잠깐이면 된다.
     * 간결하게 코딩한다.
     * @param ms ms 초 시간
     */
    delayActivate(ms) {
        /**
         * Wait for active mode display. and scroll into view.
         */
        setTimeout(() => {
            this.commentEdit.nativeElement.scrollIntoView(false);
        }, ms);
    }

    onChangeContent() {
        // console.log('onChagneContent()');
        this.activate();
    }
    onClickContent() {
        // console.log('onClickContent()');
        this.activate();
    }
    deactivateForm() {
        this.size = 'small';
        this.form.content = '';
        this.display = false;
    }


    onCancel() {
        this.deactivateForm();
        this.cancel.emit();
    }

    onSubmit(event?: Event) {
        if (event) {
            event.preventDefault();
        }
        this.loader.submit = true;
        console.log('form: ', this.form);
        if (this.isEdit()) {
            this.api.postEdit(<any>this.form).subscribe(res => {
                this.loader.submit = false;
                this.deactivateForm();
                this.edit.emit(<ApiComment>res.post);
                this.editComment(<ApiComment>res.post);
            });
        } else {
            this.form.idx_parent = this.parent.idx;
            this.api.commentWrite(this.form).subscribe(res => {
                this.loader.submit = false;
                this.deactivateForm();
                this.write.emit(res.post); // reply event
                this.addComment(res.post);
                console.log('commentWrite() res: ', res);
            }, e => {
                this.loader.submit = false;
                alert(e.message);
            });
        }
        return false;
    }

    addComment(comment: ApiComment) {
        /**
         * first comment
         */
        if (this.post.comments === void 0) {
            this.post.comments = [];
            this.post.comments.push(comment);
        } else if (this.post.idx === this.parent.idx) {
            /**
             * direct comment under root post
             */
            this.post.comments.unshift(comment);
        } else {
            /**
             * comment under another comment.
             * Need to find position.
             */
            const i = this.post.comments.findIndex(cmt => cmt.idx === this.parent.idx);
            this.post.comments.splice(i + 1, 0, comment);
        }
    }
    editComment(comment: ApiComment) {
        /**
         * comment under another comment.
         * Need to find position.
         */
        const i = this.post.comments.findIndex(cmt => cmt.idx === this.parent.idx);
        this.post.comments[i] = comment;
    }
}



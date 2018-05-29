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
    @Output() write: EventEmitter<ApiComment> = new EventEmitter();

    form: ApiCommentEditRequest = <any>{};

    mode: 'hidden' | 'active' = 'hidden';
    loader = {
        submit: false
    };

    constructor(
        public api: PhilGoApiService
    ) {
    }

    testCreate() {
        this.form.idx_parent = this.parent.idx;
        this.form.content = 'test coment';
        this.onSubmit();
    }
    ngOnInit() { }

    ngOnChanges() {
        if (this.parent) {
            // this.testCreate();
            this.form.idx_parent = this.parent.idx;
        }
    }


    activeForm() {
        if (this.mode === 'hidden') {
            this.mode = 'active';
            this.delayActivate(100);
            this.delayActivate(400);
            this.delayActivate(800);
            this.delayActivate(3000);
            /**
             * Wait for active mode display. and scroll into view.
             */
            // setTimeout(() => {
            //     if (this.mode === 'active') {
            //         this.commentEdit.nativeElement.scrollIntoView(false);
            //     }
            // }, 100);
            // setTimeout(() => {
            //     this.commentEdit.nativeElement.scrollIntoView(false);
            // }, 300);
            // setTimeout(() => {
            //     this.commentEdit.nativeElement.scrollIntoView(false);
            // }, 600);
            // setTimeout(() => {
            //     this.commentEdit.nativeElement.scrollIntoView(false);
            // }, 3000);

            // const element = this.commentEdit.nativeElement;
            // const elementRect = element.getBoundingClientRect();
            // const absoluteElementTop = elementRect.top + window.pageYOffset;
            // const middle = absoluteElementTop - (window.innerHeight / 2);
            // window.scrollTo(0, middle);
        }
    }
    delayActivate(ms) {
        /**
         * Wait for active mode display. and scroll into view.
         */
        setTimeout(() => {
            if (this.mode === 'active') {
                this.commentEdit.nativeElement.scrollIntoView(false);
            }
        }, ms);
    }

    onChangeContent() {
        // console.log('onChagneContent()');
        this.activeForm();
    }
    onClickContent() {
        // console.log('onClickContent()');
        this.activeForm();
    }
    deactivateForm() {
        this.mode = 'hidden';
        this.form.content = '';
    }

    onCancel() {
        this.deactivateForm();
    }

    onSubmit(event?: Event) {
        if (event) {
            event.preventDefault();
        }
        this.loader.submit = true;
        this.api.commentWrite(this.form).subscribe(res => {
            this.loader.submit = false;
            this.deactivateForm();
            this.write.emit(res.post);
            this.addComment(res.post);
            console.log('commentWrite() res: ', res);
        }, e => {
            this.loader.submit = false;
            alert(e.message);
        });
        return false;
    }

    addComment(comment: ApiComment) {
        this.post.comments.unshift(comment);
    }
}



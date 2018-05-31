import { Component, OnInit, Input, ViewChild, ElementRef, OnChanges, Output, EventEmitter } from '@angular/core';
import { PhilGoApiService } from '../../../philgo-api.module';
import { ApiCommentEditRequest, ApiPostData, ApiComment, ApiPhoto, ApiFileUploadOptions } from '../../../providers/philgo-api.service';
import { EditorComponent } from '../../../../angular-wysiwyg-editor/components/editor/editor.component';
import { DataComponent } from '../data/data.component';


@Component({
    selector: 'app-comment-edit-component',
    templateUrl: 'comment-edit.component.html',
    styleUrls: ['comment-edit.component.css']
})

export class CommentEditComponent implements OnInit, OnChanges {
    @ViewChild('editorComponent') editorComponent: EditorComponent;
    @ViewChild('commentEdit') commentEdit: ElementRef;
    @ViewChild('dataComponent') dataComponent: DataComponent;

    /**
     * Decides to display 'none' or 'block'.
     * This is true on view page. and false for all other places.
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

    files: Array<ApiPhoto> = [];


    loader = {
        submit: false
    };

    mode: 'edit' | 'fake' | 'reply' = 'fake';

    percentage = 0;


    constructor(
        public api: PhilGoApiService
    ) {
        console.log('CommentEditComponent::constructor()');
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
        console.log('CommentEditComponent::activateEdit()');
        this.mode = 'edit';
        this.form.idx_parent = 0;
        this.form.idx = this.comment.idx;
        this.files = this.comment.photos;
        this.form.gid = this.comment.gid;
        // this.form.content = this.comment.content_stripped;
        this.activate();
    }
    activateReply() {
        console.log('mode: ', this.mode);
        if (this.mode === 'reply') {
            return;
        }
        console.log('CommentEditComponent::activateReply()');
        this.mode = 'reply';
        this.form.idx = 0;
        this.form.gid = this.api.randomString(10, this.api.getIdxMember());
        this.files = [];
        this.activate();
    }
    activate() {
        this.display = true;
        this.delayActivate(100);
        this.delayActivate(300);
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
            // console.log('delayActivate()');
            this.commentEdit.nativeElement.scrollIntoView(false);
        }, ms);
    }

    onChangeFakeContent() {
        // console.log('onChagneContent()');
        this.activateReply();
    }
    onClickFakeContent() {
        // console.log('onClickContent()');
        this.activateReply();
    }
    deactivateForm() {
        console.log('CommentEditComponent::deactiveForm()');
        this.form.content = '';
        this.files = [];
        this.display = false;
        this.mode = 'fake';
    }


    onClickCancel() {
        this.deactivateForm();
        this.cancel.emit();
    }

    onSubmit(event?: Event) {
        if (event) {
            event.preventDefault();
        }
        this.loader.submit = true;
        this.form.content = this.editorComponent.getContent();
        console.log('form: ', this.form);
        if (this.isEdit()) {
            console.log('going to edit');
            this.api.postEdit(<any>this.form).subscribe(res => {
                this.loader.submit = false;
                this.deactivateForm();
                const comment = this.api.preComment(<ApiComment>res.post);
                this.edit.emit(comment);
                this.editComment(comment);
            });
        } else {
            console.log('going to write');
            this.form.idx_parent = this.parent.idx;
            this.api.commentWrite(this.form).subscribe(res => {
                this.loader.submit = false;
                this.deactivateForm();
                const comment = this.api.preComment(<ApiComment>res.post);
                this.write.emit(comment); // reply event
                this.addComment(comment);
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
    /**
     * Show edited comment
     *
     * 주의: 새로운 코멘트 전체를 대입하면 새로운 코멘트 컴포넌트가 생성된다. 그렇게 하지 말고 reference 를 유지한 채 필요한 요소만 바뀌치기 한다.
     *
     * @see https://docs.google.com/document/d/1E7BcCOvOFzmLVEnymCgL1pmN2BPFxCwsE5pfjav9h9g/edit#heading=h.c06b5hnwihgc
     *
     * @param comment edited comment
     */
    editComment(comment: ApiComment) {
        /**
         * comment under another comment.
         * Need to find position.
         */
        const i = this.post.comments.findIndex(cmt => cmt.idx === this.parent.idx);
        // this.post.comments[i] = comment; // 이렇게 하면 새로운 코멘트 보기 컴포넌트가 생생되어 예기치 못한 상황이 된다.
        Object.assign(this.post.comments[i], comment);
    }

    /**
     * 파일이 선택되면 업로드를 한다.
     */
    onChangeFile(event: Event) {
        /**
         * 'fake' mode 인 경우는 post view 의 맨 첫 코멘트 박스는 항상 보여지는 상태이다.
         * ( 'fake' mode 에서 파일 업로드 아이콘을 클릭 할 수 있는데, ) 파일 업로드 아이콘을 클릭하면, 무조건 reply 상태로 되는 것이다.
         * 만약 이미 'reply' 또는 'edit' 상태라면 다시 변경 할 필요가 없다.
         */
        if (this.mode === 'fake') {
            this.activateReply();
        }
        const options: ApiFileUploadOptions = {
            gid: this.form.gid,
            module_name: 'post'
        };
        this.dataComponent.fileUploadOnWeb(options, file => {
            this.editorComponent.insertImage(file.url, file.name);
        });
    }
}



import { Component, OnInit, Output, EventEmitter, Input, OnChanges, ViewChild, AfterViewInit } from '@angular/core';
import { ApiPostEditRequest, PhilGoApiService, ApiPostData } from '../../../providers/philgo-api.service';
import { EditorComponent } from '../../../../angular-wysiwyg-editor/components/editor/editor.component';


@Component({
    selector: 'app-post-edit-component',
    templateUrl: 'post-edit.component.html',
    styles: [`
        .post-edit {
            background-color: white;
        }
    `]
})

export class PostEditComponent implements OnInit, OnChanges, AfterViewInit {
    @ViewChild('editorComponent') editorComponent: EditorComponent;
    @Input() post_id: string = null;    // for creating a new post
    @Input() config_subject = ''; // forum name coming from app-post-list-component
    @Input() post: ApiPostData = null;  // for editing a post.
    @Input() mode: 'hide' | 'edit' = 'edit';
    @Output() write: EventEmitter<ApiPostData> = new EventEmitter();
    @Output() edit: EventEmitter<ApiPostData> = new EventEmitter();
    @Output() cancel: EventEmitter<void> = new EventEmitter();

    form: ApiPostEditRequest = <any>{};
    loader = {
        submit: false
    };
    constructor(
        public api: PhilGoApiService
    ) {
        // setInterval(() => this.test(), 3000);
    }

    // test() {
    //     this.form.subject = 'test post title : ' + (new Date).toLocaleTimeString();
    //     this.form.content = 'test content';
    //     this.form.post_id = 'freetalk';
    //     this.onSubmit();
    // }

    ngOnInit() { }
    ngOnChanges() {
        /**
         * edit
         */
        if (this.post) {
            this.form.idx = this.post.idx;
            this.form.subject = this.post.subject;
            // this.form.content = this.post.content_stripped;
        }
    }
    ngAfterViewInit() {
        if (this.post && this.post.content) {
            this.editorComponent.putContent(this.post['content_original']);
        }
    }
    onSubmit(event?: Event) {
        if (event) {
            event.preventDefault();
        }

        if (!this.form.post_id) {
            this.form.post_id = this.post_id;
        }
        this.form.content = this.editorComponent.getContent();
        console.log('form: ', this.form);

        this.loader.submit = true;
        if (this.post && this.post.idx) {
            this.api.postEdit(this.form).subscribe(res => {
                console.log('postEdit() res: ', res);
                const post = this.api.prePost(res.post);
                this.edit.emit(post);
                this.loader.submit = false;
                this.mode = 'hide';
            }, e => {
                this.loader.submit = false;
                alert(e.message);
            });
        } else {
            this.api.postWrite(this.form).subscribe(res => {
                console.log('postWrite() res: ', res);
                const post = this.api.prePost(res.post);
                this.write.emit(post);
                this.loader.submit = false;
                this.mode = 'hide';
            }, e => {
                this.loader.submit = false;
                alert(e.message);
            });
        }

        return false;
    }

    get forumName() {
        if (this.post && this.post.post_id) {
            return this.post.config_subject;
        } else if (this.config_subject) {
            return this.config_subject;
        } else if (this.post_id) {
            return this.post_id;
        } else {
            return '';
        }
    }

    onClickCancel() {
        this.mode = 'hide';
        this.cancel.emit();
    }
}


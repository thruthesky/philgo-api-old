import { Component, OnInit, Output, EventEmitter, Input, OnChanges, ViewChild, AfterViewInit } from '@angular/core';
import {
    ApiPostEditRequest, PhilGoApiService, ApiPostData,
    ApiFileUploadOptions, ApiPhoto
} from '../../../providers/philgo-api.service';
import { EditorComponent } from '../../../../angular-wysiwyg-editor/components/editor/editor.component';
import { HttpErrorResponse } from '@angular/common/http';
import { DataComponent } from '../data/data.component';


@Component({
    selector: 'app-post-edit-component',
    templateUrl: 'post-edit.component.html',
    styles: [`
        .post-edit {
            background-color: white;
        }
        .file-upload-button {
            position: relative;
            width: 32;
            height: 32px;
            overflow: hidden;
            cursor: pointer;
        }
        .file-upload-button svg {
            width: 32px;
            height: 32px;
        }
        .file-upload-button input[type="file"] {
            position: absolute;
            top: 0;
            right: 0;
            height: 36px;
            opacity: 0.01;
            cursor: pointer;
        }
    `]
})

export class PostEditComponent implements OnInit, OnChanges, AfterViewInit {
    @ViewChild('editorComponent') editorComponent: EditorComponent;
    @ViewChild('dataComponent') dataComponent: DataComponent;
    @Input() post_id: string = null;    // for creating a new post
    @Input() config_subject = ''; // forum name coming from app-post-list-component
    @Input() post: ApiPostData = null;  // for editing a post.
    @Input() mode: 'hide' | 'edit' = 'edit';
    @Output() write: EventEmitter<ApiPostData> = new EventEmitter();
    @Output() edit: EventEmitter<ApiPostData> = new EventEmitter();
    @Output() cancel: EventEmitter<void> = new EventEmitter();

    form: ApiPostEditRequest = <any>{};
    files: Array<ApiPhoto> = [];
    loader = {
        submit: false
    };
    percentage = 0;
    constructor(
        public api: PhilGoApiService
    ) {
        // setInterval(() => this.test(), 3000);
        this.form.gid = api.randomString(10, api.getIdxMember());
        console.log('gid: ', this.form.gid);
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
            this.form.gid = this.post.gid;
            this.files = this.post.photos;
            // this.form.content = this.post.content_stripped;
        }
    }
    ngAfterViewInit() {
        if (this.post && this.post.content) {
            this.editorComponent.putContent(this.post['content_original']);
        }
        setTimeout(() => {
            const input: HTMLInputElement = document.querySelector(`[name="subject"]`);
            input.focus();
        }, 100);
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

    onChangeFile(event: Event) {
        const options: ApiFileUploadOptions = {
            gid: this.form.gid,
            module_name: 'post'
        };
        this.dataComponent.fileUploadOnWeb(options, file => {
            this.editorComponent.insertImage( file.url, file.name );
        });
    }
}


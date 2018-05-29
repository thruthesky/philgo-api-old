import { Component, OnInit, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { ApiPostEditRequest, PhilGoApiService, ApiPostData } from '../../../providers/philgo-api.service';


@Component({
    selector: 'app-post-edit-component',
    templateUrl: 'post-edit.component.html'
})

export class PostEditComponent implements OnInit, OnChanges {
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
        if (this.post) {
            this.form.idx = this.post.idx;
            this.form.subject = this.post.subject;
            this.form.content = this.post.content_stripped;
        } else {
            this.form = <any>{};
        }
    }
    onSubmit(event?: Event) {
        if (event) {
            event.preventDefault();
        }
        this.form.post_id = this.post_id;
        console.log('form: ', this.form);

        this.loader.submit = true;
        if (this.post && this.post.idx) {
            this.api.postEdit(this.form).subscribe(res => {
                console.log('postEdit() res: ', res);
                this.edit.emit(res.post);
                this.loader.submit = false;
                this.mode = 'hide';
            }, e => {
                this.loader.submit = false;
                alert(e.message);
            });
        } else {
            this.api.postWrite(this.form).subscribe(res => {
                console.log('postWrite() res: ', res);
                this.write.emit(res.post);
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


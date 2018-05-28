import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ApiPostEditRequest, PhilGoApiService, ApiPostData } from '../../../providers/philgo-api.service';


@Component({
    selector: 'app-post-edit-component',
    templateUrl: 'post-edit.component.html'
})

export class PostEditComponent implements OnInit {
    @Input() post_id: string = null;
    @Output() success: EventEmitter<ApiPostData> = new EventEmitter();

    form: ApiPostEditRequest = <any>{};
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
    onSubmit(event?: Event) {
        if (event) {
            event.preventDefault();
        }
        this.form.post_id = this.post_id;
        console.log('form: ', this.form);
        this.api.postWrite(this.form).subscribe(res => {
            console.log('postWrite() res: ', res);
            this.success.emit( res.post );
        }, e => alert(e.message));
        return false;
    }
}


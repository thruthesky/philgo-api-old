import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { PhilGoApiService, ApiPostData } from '../../../providers/philgo-api.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-comment-view-component',
    templateUrl: 'comment-view.component.html',
    styleUrls: ['comment-view.component.css']
})

export class CommentViewComponent implements OnInit, OnChanges {
    @Input() post: ApiPostData;
    @Input() comment: ApiPostData;
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
}


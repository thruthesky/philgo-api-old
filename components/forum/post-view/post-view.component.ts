import { Component, Input, OnChanges } from '@angular/core';
import { ApiPostData, PhilGoApiService } from '../../../providers/philgo-api.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-post-view-component',
    templateUrl: 'post-view.component.html'
})
export class PostViewComponent implements OnChanges {

    @Input() post: ApiPostData = null;
    @Input() showClose = false;
    constructor(
        public sanitizer: DomSanitizer,
        public api: PhilGoApiService
    ) {

    }

    ngOnChanges() {
        console.log('ngOnChanges()');
        if (this.post) {
            if (this.post['safe']) {
                //
            } else {
                this.post.content = <any>this.sanitizer.bypassSecurityTrustHtml(this.post.content);
                this.post['safe'] = true;
            }
            this.post['date'] = this.api.shortDate( this.post.stamp );
        }
    }
}


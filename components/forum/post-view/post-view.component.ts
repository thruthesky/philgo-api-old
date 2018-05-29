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
    @Input() mode: 'edit' | 'view' = 'view';


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
                this.post['original_content'] = this.post.content;
                this.post.content = <any>this.sanitizer.bypassSecurityTrustHtml(this.post.content);
                this.post['safe'] = true;
            }
            this.post['date'] = this.api.shortDate(this.post.stamp);
        }
    }

    onClickPostEdit() {
        this.mode = 'edit';
    }


    onWriteSuccess(post) {
        // this.listComponent.write(post);
        // this.activateView();
    }
    onEditSuccess(post) {
        this.mode = 'view';
        this.post = post;
        // this.listComponent.edit(post);

//  <!-- (edit)=" mode = 'view'; this.post = $event; " -->
        // this.activateView();
    }
    onFormCancel() {
        // this.activateView();
        this.mode = 'view';
    }
    /**
     * post view close button clicked
     */
    onViewClose() {
        this.post['mode'] = 'hide';
    }
}


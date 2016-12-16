/**
 * @see ../../../README.md
 */
import { Component, Input } from '@angular/core';
import { Post, PAGE, PAGE_DATA, POSTS } from '../../post';
import { ONE_DAY_STAMP } from '../../../../../etc/share';
@Component({
    selector: 'latest-component',
    templateUrl: 'latest-component.html'
})
export class LatestComponent {
    @Input() title: string = null;
    @Input() post_id: string = null;
    posts: POSTS;
    constructor( private post: Post ) {

    }
    ngOnInit() {
        let page_data: PAGE_DATA = {
            post_id: this.post_id,
            limit: 6,
            cache: ONE_DAY_STAMP,
            fields: 'idx,idx_parent,subject,deleted,gid,good,no_of_comment,no_of_view,post_id,stamp'
        };
        console.log("LatestComponent::ngOnInit(), post_id: ", this.post_id);
        this.post.page( page_data, ( page: PAGE ) => {
            console.log("latest: ", page);
            this.posts = page.posts;
        },
        error => alert( error ),
        () => {
            
        })
    }
}
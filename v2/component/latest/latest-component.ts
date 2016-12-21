/**
 * @see ../../../README.md
 * 
 */
import { Component, Input } from '@angular/core';
import { Post, PAGE, PAGE_OPTION, POSTS } from '../../post';
import { ONE_HOUR_STAMP } from '../../../../../etc/share';
@Component({
    selector: 'latest-component',
    templateUrl: 'latest-component.html'
})
export class LatestComponent {
    @Input() title: string = null;
    @Input() post_id: string = null;
    posts: POSTS = <POSTS> [];
    constructor( private post: Post ) {
        //console.log("LatestComponent::constructor()");
    }
    ngOnInit() {
        let option: PAGE_OPTION = {
            post_id: this.post_id,
            limit: 6,
            expire: ONE_HOUR_STAMP,
            fields: 'idx,idx_parent,subject,deleted,gid,good,no_of_comment,no_of_view,post_id,stamp'
        };
        console.log("latest-component::ngOnInit() ", this.title, this.post_id, option);
        // this.post.debug = true;
        this.post.page( option, ( page: PAGE ) => {
            console.log("latest: ", page);
            this.posts = [];
            page.posts.map( ( v, i ) => {
                setTimeout( () => {
                    v.url = this.post.getLink( v );
                    this.posts.push( v );
                }, i * 50 );
            } );
        },
        error => alert( "latest-component error: " + error ),
        () => {});
    }
}
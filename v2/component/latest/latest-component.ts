/**
 * @see ../../../README.md
 */
import { Component, Input } from '@angular/core';
import { Post, PAGE, PAGE_OPTION, POSTS } from '../../post';
import { ONE_DAY_STAMP } from '../../../../../etc/share';
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
            expire: 30,
            fields: 'idx,idx_parent,subject,deleted,gid,good,no_of_comment,no_of_view,post_id,stamp'
        };
        this.post.page( option, ( page: PAGE ) => {
            console.log("latest: ", page);
            page.posts.map( ( v, i ) => { setTimeout( () => this.posts.push( v ), i * 100 ) } );
        },
        error => alert( error ),
        () => {});
    }
}
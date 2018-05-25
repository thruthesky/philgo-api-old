import { Component, AfterViewInit } from '@angular/core';
import { PhilGoApiService } from '../../../philgo-api.module';
import { ApiPostListOption, ApiPostData } from '../../../providers/philgo-api.service';

interface Result {
    idxes: Array<string>;
    posts: { [idx: string]: ApiPostData };
}
@Component({
    selector: 'app-post-list-component',
    templateUrl: 'post-list.component.html'
})
export class PostListComponent implements AfterViewInit {


    /**
     * list options
     */
    option: ApiPostListOption = {
        limit: 5, // how many posts to show in one page.
        page_no: 1, // page no
        post_id: '' // post id
    };

    re: Result = null;
    constructor(
        public api: PhilGoApiService
    ) {
        this.init();
    }
    ngAfterViewInit() {
        // console.log('postId: ', this.postId);
    }
    init() {
        this.re = {
            idxes: [],
            posts: {}
        };
    }
    /**
     * @desc Re-initialization
     *      1. option.page_no
     *          If option.page_no is set, then it will initialize the previous page.
     *          So, when you want to list posts from a new post_id, you can set option.page_no to 1.
     *      2. option.post_id
     *          If option.post_id is set and it is different from this.option.post_id, then it re-initialize.
     * @param option post list optoin
     */
    loadPage(option: ApiPostListOption) {
        if (option.limit) {
            this.option.limit = option.limit;
        }
        if (option.page_no) {
            this.option.page_no = option.page_no;
            this.init();
        }
        if (option.post_id && option.post_id !== this.option.post_id ) {
            this.option.post_id = option.post_id;
            this.init();
        }

        this.api.postList(this.option).subscribe(res => {
            console.log('postList(): res: ', res);
            if (res.posts && res.posts.length) {
                for (const post of res.posts) {
                    this.re.idxes.push(post.idx);
                    this.re.posts[post.idx] = post;
                }
            }
        }, e => console.log(e));
    }
}



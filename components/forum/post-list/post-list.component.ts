import { Component, AfterViewInit } from '@angular/core';
import { PhilGoApiService } from '../../../philgo-api.module';
import { ApiPostListOption, ApiPostData } from '../../../providers/philgo-api.service';

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

    re: {
        idxes: Array<string>;
        posts: { [idx: string]: ApiPostData };
    } = {
            idxes: [],
            posts: {}
        };
    constructor(
        public api: PhilGoApiService
    ) {

    }
    ngAfterViewInit() {
        // console.log('postId: ', this.postId);
    }
    loadPage(option: ApiPostListOption) {
        if (option.limit) {
            this.option.limit = option.limit;
        }
        if (option.page_no) {
            this.option.page_no = option.page_no;
        }
        if (option.post_id) {
            this.option.post_id = option.post_id;
        }

        this.api.postList(this.option).subscribe(res => {
            console.log('postList(): res: ', res);
            if (res.posts && res.posts.length) {
                for (const post of res.posts) {
                    this.re.idxes.push( post.idx );
                    this.re.posts[post.idx] = post;
                }
            }
        }, e => console.log(e));
    }
}



import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { PhilGoApiService } from '../../../philgo-api.module';
import { ApiPostData, ApiForumPageRequest } from '../../../providers/philgo-api.service';
import { ActivatedRoute } from '@angular/router';
import { InfiniteScrollService } from '../../../providers/infinite-scroll.service';
import { Subscription } from 'rxjs';

interface Result {
    idxes: Array<string>;
    posts: { [idx: string]: ApiPostData };
}
@Component({
    selector: 'app-post-list-component',
    templateUrl: 'post-list.component.html'
})
export class PostListComponent implements AfterViewInit, OnDestroy {

    loader = {
        page: false
    };

    /**
     * list options
     */
    option: ApiForumPageRequest = {
        limit: 10, // how many posts to show in one page.
        page_no: 1, // page no
        post_id: '' // post id
    };

    re: Result = null;


    /**
     * inifite scroll subscription
     */
    subscription: Subscription = null;

    constructor(
        public activated: ActivatedRoute,
        public api: PhilGoApiService,
        public scroll: InfiniteScrollService
    ) {

        activated.paramMap.subscribe(params => {
            if (params.get('post_id')) {
                this.init(params);
                this.loadPage();
            }
        });
    }

    ngAfterViewInit() {
        this.subscription = this.scroll.watch('section.post-list', 400).subscribe(e => this.loadPage());
    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
    init(params) {
        this.option.post_id = params.get('post_id');
        this.option.page_no = 1;
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
    loadPage() {
        console.log('loadPage()', this.option);
        if (this.loader.page) {
            return;
        }
        this.loader.page = true;
        this.api.postList(this.option).subscribe(res => {
            this.loader.page = false;
            this.option.page_no++;
            console.log('postList(): res: ', res);
            if (res.posts && res.posts.length) {
                for (const post of res.posts) {
                    this.re.idxes.push(post.idx);
                    this.re.posts[post.idx] = post;
                }
            }
        }, e => {
            this.loader.page = false;
            console.log(e);
        });
    }
}



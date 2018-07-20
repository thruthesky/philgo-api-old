import { Component, AfterViewInit, OnDestroy, Input, ViewChild } from '@angular/core';
import { PhilGoApiService } from '../../../philgo-api.module';
import { ApiPostData, ApiForumPageRequest, ApiForumPageResponse } from '../../../providers/philgo-api.service';
import { ActivatedRoute } from '@angular/router';
import { InfiniteScrollService } from '../../../providers/infinite-scroll.service';
import { Subscription } from 'rxjs';
// import { PostViewComponent } from '../post-view/post-view.component';

interface Result {
    idxes: Array<string>;
    posts: { [idx: string]: ApiPostData };
}
@Component({
    selector: 'app-post-list-component',
    templateUrl: 'post-list.component.html',
    styles: [`
    .post-list .post {
        background-color: #f3f3f3;
    }
    .post-list .post:nth-child(even) {
        background-color: #ddd;
    }
    .post-list .post .title {
        display: block;
        padding: .75em .5em;
        color: #222;
    }
    `]
})
export class PostListComponent implements AfterViewInit, OnDestroy {

    // @Input() post_id: string;

    /**
     * If 'display' is true, then it shows post list.
     * If it is false, then it doe show post lists.
     *
     * @example set it false when you need to hide like posting a new ariticle.
     */
    @Input('display') display = true; // true for show, false for hide.

    /**
     * 'view' is the post which is being opened to view now.
     * So, you should not show this post on the post list.
     */
    @Input() view: ApiPostData;
    config_subject = '';
    show = {
        noMorePosts: false
    };

    loader = {
        page: false
    };

    /**
     * list options
     */
    option: ApiForumPageRequest = {
        limit: 20, // how many posts to show in one page.
        page_no: 1, // page no
        post_id: '' // post id
    };

    re: Result = {
        idxes: [],
        posts: {}
    };


    /**
     * inifite scroll subscription
     */
    subscription: Subscription = null;

    constructor(
        public activated: ActivatedRoute,
        public api: PhilGoApiService,
        public scroll: InfiniteScrollService
    ) {
        console.log('PostListComponent::constructor()');

        // activated.paramMap.subscribe(params => {
        //     if (params.get('post_id')) {
        //         this.init(params.get('post_id'));
        //         this.loadPage();
        //     }
        // });
    }

    ngAfterViewInit() {
        this.subscription = this.scroll.watch('body', 400).subscribe(e => this.loadPage());
    }
    ngOnDestroy() {
        console.log('PostListComponent::destory()');
        if (this.subscription) {
            this.subscription.unsubscribe();
            this.subscription = null;
        }
    }
    init(post_id: string) {
        console.log('PostListComponent::init()');
        this.option.post_id = post_id;
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
    loadPage(callback?: (res: ApiForumPageResponse) => void) {
        // console.log('loadPage()', this.option);
        if (!this.option.post_id) {
            return;
        }
        /**
         * If the post list is not in display, it does not load again.
         */
        if (!this.display) {
            return;
        }
        /**
         * If it is already in loading, don't load multiple times.
         */
        if (this.loader.page) {
            return;
        }
        this.loader.page = true;
        this.api.forumPage(this.option).subscribe(res => {
            if (callback) {
                callback(res);
            }
            this.loader.page = false;
            this.config_subject = res.config_subject;
            this.option.page_no++;
            // console.log('forumPage(): res: ', res);
            if (res.posts && res.posts.length) {
                for (const post of res.posts) {
                    this.addPost(post);
                }
            }
            if (res.posts && res.posts.length && res.posts.length === this.option.limit) {
                this.show.noMorePosts = false;
            } else {
                this.show.noMorePosts = true;
            }
        }, e => {
            this.loader.page = false;
            console.log(e);
            alert(e.message);
        });
    }
    onClickView(event: Event, idx: number) {
        event.preventDefault();
        window.history.replaceState({}, '', this.api.urlForumView(idx));
        // this.re.posts[idx]['display'] = true;
        // this.viewComponent.mode = 'view';
        this.re.posts[idx]['mode'] = 'view';
        return false;
    }
    // write(post: ApiPostData) {
    //     console.log('post update: ', post);
    //     this.addPostOnTop(post);
    // }
    // edit(post: ApiPostData) {
    //     console.log('post edit:', post);
    //     this.editPost(post);
    // }
    /**
     * Adds a post at the end of post list
     * @param post post
     */
    addPost(post: ApiPostData) {
        this.re.idxes.push(post.idx);
        this.re.posts[post.idx] = post;
        // console.log('post:', post);
    }
    /**
     * Adds a post on tpo of post list
     * @param post post
     */
    addPostOnTop(post: ApiPostData) {
        this.re.idxes.unshift(post.idx);
        this.re.posts[post.idx] = post;
    }
    /**
     * Replace the input post with the existing post in 'this.re.posts' object.
     * @description Use this to show the edited post into vew after you have updated one.
     * @param post post
     */
    editPost(post: ApiPostData) {
        this.re.posts[post.idx] = post;
    }

    post(idx): ApiPostData {
        return this.re.posts[idx];
    }
}




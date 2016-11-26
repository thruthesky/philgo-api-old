import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Api } from './api';


export interface PAGE_DATA {
    post_id: string;
    page_no: number;
    limit?: number;
};

type POST_AD = {
    deleted: string;
    done_htmlspecialchars: number;
    idx: string;
    no_of_first_image: string;
    post_id: string;
    src: string;
    src_thumbnail: string;
    subject: string;
    url: string;
};
type POST_TOP_AD = {
    category: string;
    gid: string;
    idx: string;
    idx_file: string;
    int_4: string;
    src: string;
    sub_category: string;
    url: string;
    varchar_5: string;
    varchar_11: string;
};

type POST_TOP_PREMIUM_AD = {
    idx: string;
    image_src: string;
    no_of_view: string;
    region: string;
    src: string;
    sub_subject: string;
    subject: string;
    url: string;
    varchar_5: string;
    varchar_11: string;
    varchar_15: string;
    varchar_19: string;
};

type MEMBER = {
    id: string;
    name: string;
    nickname: string;
};
type COMMENT = {
    bad: string;
    blind: string;
    content: string;
    deleted: string;
    depth: string;
    gid: string;
    good: string;
    idx: string;
    idx_member: string;
    idx_parent: string;
    idx_root: string;
    int_10: string;
    member: MEMBER;
    photos: string;
    post_id: string;
    stamp: string;
    user_name: string;
}
type POST = {
    bad: string;
    blind: string;
    category: string;
    comments: Array<COMMENT>;
    content: string;
    deleted: string;
    depth: string;
    gid: string;
    good: string;
    idx: string;
    idx_member: string;
    idx_parent: string;
    idx_root: string;
    int_10: string;
    link: string;
    member: MEMBER;
    no_of_comment: string;
    no_of_view: string;
    photos: Array< PHOTOS >;
    post_id: string;
    stamp: string;
    subject: string;
    user_name: string;
}

type PHOTOS = {
    idx: number;
    src: string;
    original_src: string;   
}

export interface POSTS {
    acl: string;
    action: string;
    ads: Array<POST_AD>;
    code: number;
    message?: string;
    domain: string;
    event: any;
    mobile: any;
    mode: any;
    module: string;
    page_no: number;
    post_id: string;
    post_name: string;
    post_top_ad: Array<POST_TOP_AD>;
    post_top_premium_ad: Array<POST_TOP_PREMIUM_AD>;
    posts: Array<POST>;
    site: string;
    user_id: any;
    user_name: any;
    version: string;
};






@Injectable()
export class Post extends Api {

    constructor( http: Http ) {
        super( http );
    }




    /**
     * 
     * 
     * for 1st page.
     * 1. load from cache & return data.
     * 2. load from server & cache & return data.
     * 
     * @code example

        this.post.page( {post_id: this.post_id, page_no: 1}, (posts: POSTS) => {
            console.log('posts:', posts);
            console.log('point ad title: ', posts.ads[0].subject);
            console.log('comment user name: ', posts.posts[0].comments[0].member.name);
        }, e => {
            alert(e);
        });

     * @endcode
     * 
     */
    page( data: PAGE_DATA, successCallback: ( re: POSTS ) => void, errorCallback: ( error: string ) => void ) {
        let url = this.getUrl() + 'post-list&post_id=' + data.post_id + '&page_no=' + data.page_no + '&limit=30';
        if ( data.page_no == 1 ) this.cacheCallback( data.post_id, successCallback );

        console.log('page(): url: ', url);
        this.http.get( url )
            .subscribe( re => {
                console.log('post::page() re: ', re);
                this.responseData( re, (posts: POSTS) => {
                    if ( data.page_no == 1 ) this.saveCache( data.post_id, posts );
                    successCallback( posts );
                }, errorCallback );
            });
    }



    /**
     * Returns forum category
     * 게시판 종류를 리턴한다.
     * 
     * @code simple example
     *      this.post.getForums( re => console.log(re), e => alert(e) );
     * @endcode
     * @code example code
        this.post.getForums( data => {
            console.log(data);
        }, e => {
            console.log('getForum() error: ', e);
        });
     * @endcode
     */
    getForums( successCallback: (data: any) => void, errorCallback?: (error: string) => void ) {
        console.log('getForums()');
        // check if it has cached data.
        let url = this.getUrl('forums');
        console.log('url:', url);
        this.http.get( url )
            .subscribe( re => {
                this.responseData( re, successCallback, errorCallback );
            });
    }

}
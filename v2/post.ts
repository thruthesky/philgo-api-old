import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Api } from './api';
import { PAGE_DATA, PAGE, POST_DATA, POST_RESPONSE } from './philgo-api-interface';
export * from './philgo-api-interface';
// import * as _ from 'lodash';

@Injectable()
export class Post extends Api {

    constructor( http: Http ) {
        super( http );
    }

    hasError( data: POST_DATA ) : boolean | string {

        if ( data.id === void 0 ) return 'user-id-is-empty-login-first';
        if ( data.session_id === void 0 ) return 'session_id-is-empty';
        if ( data.action === void 0 ) return 'action-is-empty';

        if ( data.action == 'post_write_submit' ) {
            if ( data.post_id === void 0 ) return 'post-id-is-empty';
            if ( data.gid === void 0 ) return 'gid-is-empty';
            // if ( data.subject === void 0 ) return 'subject-is-empty'; // empty subject is ok.
        }
        else if  ( data.action == 'post_edit_submit' ) { // 글/코멘트 수정.
            if ( data.idx === void 0 ) return 'idx-is-empty';
            if ( data.idx_parent === void 0 || ! data.idx_parent ) { // 글인 경우만, 제목 체크.
                if ( data.subject === void 0 ) return 'subject-is-empty';
            }
        }
        else if  ( data.action == 'comment_write_submit' ) {
            if ( data.idx_parent === void 0 ) return 'idx_parent-is-empty';
        }
        else if ( data.action == 'post_delete_submit' ) {
            if ( data.idx === void 0 ) return 'idx-is-empty';
            else return false;
        }
        return false;
    }
    getError( data: POST_DATA ) : string {
        return <string> this.hasError( data );
    }


    create( data: POST_DATA, successCallback: ( re: POST_RESPONSE ) => void, errorCallback: ( error: string ) => void, completeCallback?: () => void ) {
        data['action'] = 'post_write_submit';
        let login = this.getLoginData();
        if ( login ) {
            data.id = login.id;
            data.session_id = login.session_id;
        }
        if ( this.hasError( data ) ) return errorCallback( this.getError( data ) );
        this.post( data,
            successCallback,
            errorCallback,
            completeCallback );
    }
    createComment( data: POST_DATA, successCallback: ( re: POST_RESPONSE ) => void, errorCallback: ( error: string ) => void, completeCallback?: () => void ) {
        data['action'] = 'comment_write_submit';
        let login = this.getLoginData();
        if ( login ) {
            data.id = login.id;
            data.session_id = login.session_id;
        }
        if ( this.hasError( data ) ) return errorCallback( this.getError( data ) );
        this.post( data,
            successCallback,
            errorCallback,
            completeCallback );
    }

    /**
     * This updates post/comment.
     * @attention it checks login for post update.
     */
    update( data: POST_DATA, successCallback: ( re: POST_RESPONSE ) => void, errorCallback: ( error: string ) => void, completeCallback?: () => void ) {
        data['action'] = 'post_edit_submit';
        let login = this.getLoginData();
        if ( ! login ) return errorCallback('login first');
        data.id = login.id;
        data.session_id = login.session_id;
        if ( this.hasError( data ) ) return errorCallback( this.getError( data ) );
        this.post( data,
            successCallback,
            errorCallback,
            completeCallback );
    }

    /**
     * @attention - It does not do 'GET' request. it gets data of a post.
     * @note this method name has changed from 'get()' to 'load()'.
     */
    load( idx, successCallback: ( re: POST_RESPONSE ) => void, errorCallback: ( error: string ) => void, completeCallback?: () => void ) {
        let url = this.getUrl( 'post_get_submit&idx=' + idx );
        super.get( url,
            successCallback,
            errorCallback,
            completeCallback );
    }

    delete( idx, successCallback: ( re: any ) => void, errorCallback: ( error: string ) => void, completeCallback?: () => void ) {
        let data = {};
        data['idx'] = idx;
        data['action'] = 'post_delete_submit';
        let login = this.getLoginData();
        if ( login ) {
            data['id'] = login.id;
            data['session_id'] = login.session_id;
        }
        if ( this.hasError( data ) ) return errorCallback( this.getError( data ) );
        this.post( data,
            successCallback,
            errorCallback,
            completeCallback );
    }

    report( idx, successCallback: ( re: any ) => void, errorCallback: ( error: string ) => void, completeCallback?: () => void ) {
        let data = {};
        data['idx'] = idx;
        data['action'] = 'post_report_submit';
        let login = this.getLoginData();
        if ( login ) {
            data['id'] = login.id;
            data['session_id'] = login.session_id;
        }
        if ( this.hasError( data ) ) return errorCallback( this.getError( data ) );
        this.post( data,
            successCallback,
            errorCallback,
            completeCallback );
    }

    vote( idx, successCallback: ( re: any ) => void, errorCallback: ( error: string ) => void, completeCallback?: () => void ) {
        let data = {};
        data['idx'] = idx;
        data['action'] = 'post_vote_submit';
        let login = this.getLoginData();
        if ( login ) {
            data['id'] = login.id;
            data['session_id'] = login.session_id;
        }
        if ( this.hasError( data ) ) return errorCallback( this.getError( data ) );
        this.post( data,
            successCallback,
            errorCallback,
            completeCallback );
    }


    /**
     * 
     * 
     * @note first page automatically cache.
     *  when 'data.page_no' == 1,
     *      1. load from cache & return data.
     *      2. load from server & cache & return data.
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
    page( data: PAGE_DATA, successCallback: ( page: PAGE ) => void, errorCallback: ( error: string ) => void, completeCallback?: () => void ) {
        let page_no = data.page_no ? data.page_no : 1;


        let limit = data.limit ? data.limit : 30;
        let fields = data.fields ? data.fields : '';



        let url = this.getUrl() + 'post-list&post_id=' + data.post_id + '&page_no=' + page_no + '&limit=' + limit + '&fields=' + fields;
        if ( this.debug ) console.log("page() url: ", url);
        if ( page_no == 1 ) {
            // console.log("page no: 1");
            this.cacheCallback( data.post_id, successCallback );
        }

        // console.log('page(): url: ', url);
        /*
        this.get( url, re => {

        }, errorCallback );
        */
        /*
        this.http.get( url )
            .subscribe( re => {
                // console.log('post::page() re: ', re);
                this.responseData( re, (posts: POSTS) => {
                    if ( data.page_no == 1 ) this.saveCache( data.post_id, posts );
                    successCallback( posts );
                }, errorCallback );
            });
        */
        this.get( url, (page: PAGE) => {
            if ( data.page_no == 1 ) this.saveCache( data.post_id, page );
            successCallback( page );
        }, errorCallback, completeCallback );
    }


    /**
     * 
     * This caches page of posts.
     * This method is separated to reduce the complexity of page().
     * 
     * @note cache option
     * 
     *  IF data.cache = seconds
     *      1. see if there is cache on that 'data.page_no'
     *      2. if yes,
     *          2.1 callback the cache data
     *          2.2 see if the cache interval time has expires
     *              2.2.1 if expired, delete the cache.
     *          2.3 RETURN.
     *      3. if no,
     *          3.1 get posts of the page no.
     *          3.2 callback the page.
     *          3.3 cache the page
     *          3.4 RETURN.
     * 
     */
    pageCache() {
/*
        // cache
        // it needs blocking code??
        let d = this.getCache( 'cache-' + data.post_id );
        if ( d ) {
            successCallback( d );
            completeCallback();
        }
*/

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
    getForums( successCallback: (data: any) => void, errorCallback?: (error: string) => void, completeCallback?: () => void ) {
        console.log('getForums()');
        // check if it has cached data.
        let url = this.getUrl('forums');
        console.log('url:', url);
        this.get( url, re => {
            if ( +re['code'] ) errorCallback( re['message'] );
            else successCallback( re );
        },
        errorCallback,
        completeCallback );

        /*
        this.http.get( url )
            .subscribe( re => {
                this.responseData( re, successCallback, errorCallback );
            });
            */
    }

}
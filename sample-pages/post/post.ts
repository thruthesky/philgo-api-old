import { Component } from '@angular/core';
import { Post, POST_DATA } from '../../v2/post';
import { Member, MEMBER_DATA, MEMBER_LOGIN_DATA } from '../../v2/member';

@Component({
  selector: 'philgo-test-post',
  templateUrl: 'post.html',
  styleUrls: ['./post.scss']
})
export class SamplePostPage {
    form = <POST_DATA> {};
    login: MEMBER_LOGIN_DATA = null;
    constructor( private member: Member, private post: Post ) {
        console.log( 'SamplePostPage::constructor()' );
        this.setTemporaryFormValues();
        this.onClickSubmit();
    }
    onClickSubmit() {
        console.log("SamplePostPage::onClickSubmit()");

        // 1. register
        let d = new Date();
        let id = "random" + ( d.getTime() / 1000 );
        let password = id;
        let userData: MEMBER_DATA = {
            id: id,
            password: password,
            name: id,
            nickname: id,
            email: id + '@gmail.com',
            mobile: '12345678901'
        };
        this.member.register( userData, login => {
            console.log("user registration success: ", login);
            this.login = login;
            this.form.id = id;
            this.form.session_id = login.session_id;
            // 2. create a post
            this.post.create( this.form, data => {
                console.log("post create success: ", data);
                // 3. compare
                this.compareCreatePost( data.post.idx );
                },
                error => alert( error ),
                () => {}
            )
        }, e => alert( 'User registration failed: ' + e ) );

    }
    updatePost( idx ) {
        this.editFormValues();
        this.form.idx = idx;
        this.post.update( this.form, data => {
            console.log("post update : ", data);
            // ==>
            this.compareUpdatePost( idx );
        }, er => alert( er ));
    }
    createComment( idx_parent ) {
        console.log("createComment()");
        let c = <POST_DATA> {};
        c.id = this.login.id;
        c.session_id = this.login.session_id;
        c.idx_parent = idx_parent;
        c.subject = "Comment title";
        c.content = "Comment content";
        console.log("comment create data: ", c);
        this.post.debug = true;
        this.post.createComment( c, data => {
            console.log('createComment() data: ', data);
            this.updateComment( data.post.idx );
        }, error => {
            console.error("create comment error: " + error );
            alert( error );
        } );
    }


    updateComment( idx ) {

    }
    compareUpdatePost( idx ) {
        this.post.get( idx, data => {
            console.log("compareUpdatePost() get post : ", data.post);
            let p: POST_DATA = data.post;
            let f = this.form;
            let keys = Object.keys( f );
            for ( let k of keys ) {
                if ( k == 'idx' || k == 'id' || k == 'session_id' || k == 'action' || k == 'module' || k == 'submit' ) continue;
                if ( p[k] != f[k] ) console.error( k + " NOT match after Update");
            }
            // ==>
            this.createComment( idx );
        },
        e => alert( e )
        );
    }
    compareCreatePost( idx ) {
        console.log("compareCreatePost()");
        this.post.get( idx, data => {
            console.log("comparePost() get post : ", data.post);
            let p: POST_DATA = data.post;
            let f = this.form;
            let keys = Object.keys( f );
            for ( let k of keys ) {
                if ( k == 'id' || k == 'session_id' || k == 'action' || k == 'module' || k == 'submit' ) continue;
                if ( p[k] != f[k] ) console.error( k + " NOT match");
            }
            // 4. update post ( after compare )
            this.updatePost( idx );
        },
        e => alert( e )
        );
    }
    setTemporaryFormValues() {
        let f = this.form;
        f.post_id = 'qna';
        f.category = 'cate-1';
        f.sub_category = 'cate-sub';
        f.subject = "This is title!";
        f.content = "This is content.";
        f.link = "This is link.";
        f.region = "This is region.";
        for ( let i = 1; i <= 20; i ++ ) {
            if ( i <= 10 ) f['int_' + i] = i;
            if ( i <= 10 ) f['char_' + i] = i-1;
            if ( i <= 10 ) f['text_' + i] = "This is text: " + i;
            f['varchar_' + i] = "This is varchar: " + i;
        }
    }
    editFormValues() {
        let f = this.form;
        f.post_id = 'edit-qna';
        f.category = 'edit-cate-1';
        f.sub_category = 'edit-cate-sub';
        f.subject = "edit-This is title!";
        f.content = "edit-This is content.";
        f.link = "edit-This is link.";
        f.region = "edit-This is region.";
        for ( let i = 1; i <= 20; i ++ ) {
            if ( i <= 10 ) f['int_' + i] = 10-i;
            if ( i <= 10 ) f['char_' + i] = 11-i-1;
            if ( i <= 10 ) f['text_' + i] = "edit-This is text: " + i;
            f['varchar_' + i] = "edit-This is varchar: " + i;
        }
    }
}
/**
 * @see ./README.md
 */
import { Component, Input } from '@angular/core';
import { POST } from '../../philgo-api-interface';
import { Post } from '../../post';
import { ViewService } from './view-service';

@Component({
    selector: 'view-component',
    templateUrl: 'view-component.html',
})
export class ViewComponent {
    showPostCreateForm: boolean = false;
    hideContent = {};
    showEditComponent  = {};
    mode = '';
    isPost: boolean = false;
    isComment: boolean = false;
    @Input() post: POST = <POST> {}; // it is comment or post.
    @Input() root: POST = null;
    @Input() option = {};
    constructor(
        private postService : Post
    ) {
        console.log("ViewComponent()");
    }
    ngOnInit() {
        this.isPost = this.post.idx_parent == '0';
        this.isComment = ! this.isPost;

        if ( this.option['show-reply-form'] ) {
            if ( this.isPost ) this.mode = 'create-post';
            else this.mode = 'create-comment';
        }
    }
    

     onClickEdit( post ) {
        this.mode = 'edit-comment';
      
        // this.view_service.hideContent = {};
        // this.view_service.hideContent[ post.idx.toString() ] = true;
        // console.log(this.view_service.showEditComponent);
        // this.view_service.showEditComponent = {};
        // console.log(this.view_service.showEditComponent);
        
        // this.view_service.showEditComponent[ post.idx.toString() ] = true;
      
        
    }

    onClickDelete( post ) {
        post.inDeleting = true;
        this.postService.delete( post.idx, re => {
            console.log('delete: re: ', re);
            post['subject'] = "deleted";
            post['content'] = "deleted";
            },
            error => alert("delete error: " + error ),
            () => post.inDeleting = false
        );
    }
    

     onClickReport( post ) {
        //console.log("onClickReport()");
        //this.post.debug = true;
        post.inReport = true;
        this.postService.report( post.idx, re => {
            // console.log('delete: re: ', re);
            alert("You have reported a post. Thank you.");
        },
        error => alert("report error: " + error ),
        () => {
            post.inReport = false;
        });
    }


    onClickLike( post ) {
        post.inLike = true;
        this.postService.vote( post.idx, re => {
            console.log('delete: re: ', re);
            // alert("You have reported a post. Thank you.");
            post.good ++;
        },
        error => {
            alert("like error: " + error );
            console.log("like error: " + error );
        },
        () => {
            post.inLike = false;
        });
    }


    onSuccess() {
        // this.closeAllOpenForms();
    }
    onCancel() {
        // this.closeAllOpenForms();
    }

    closeAllOpenForms() {
        // this.view_service.hideContent = {};
        // this.view_service.showEditComponent = {};
        this.showPostCreateForm = false;
    }



}
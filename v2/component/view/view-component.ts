/**
 * @see ./README.md
 */
import { Component, Input, ViewChild } from '@angular/core';
import { POST } from '../../philgo-api-interface';
import { Post } from '../../post';
import { EditComponent } from '../edit/edit-component';
import { ViewService } from './view-service';

@Component({
    selector: 'view-component',
    templateUrl: 'view-component.html',
})
export class ViewComponent {
    @ViewChild('editComponent') editComponent: EditComponent;
    showPostCreateForm: boolean = false;
    hideContent = {};
    showEditComponent  = {};
    isPost: boolean = false;
    isComment: boolean = false;
    inEdit: boolean = false; // "inEdit == true" means the user is in editing.

    @Input() show: boolean = false; // if set true, the create/edit form box shows.
    @Input() mode: string = null;
    @Input() post: POST = <POST> {}; // it is comment or post.
    @Input() root: POST = null;
    active: boolean = false;

    constructor(
        private postService : Post
    ) {
        console.log("ViewComponent()");
    }
    ngOnInit() {
        this.isPost = this.post.idx_parent == '0';
        this.isComment = ! this.isPost;



        // if ( this.option['show-reply-form'] ) {
        //     if ( this.isPost ) this.mode = 'create-post';
        //     else this.mode = 'create-comment';
        // }
    }
    


    onClickReply() {
        this.active = true;
        this.mode = 'create-comment';
    }

    onClickEdit() {
        console.log("ViewComponent::onClickEdit()", this.editComponent );
        this.active = true;
        this.inEdit = true;
        if ( this.post.idx == '0' ) this.mode = 'post-edit';
        else this.mode = 'edit-comment';
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


    editComponentOnSuccess() {
        // this.closeAllOpenForms();
    }
    editComponentOnCancel() {
        // this.closeAllOpenForms();
        
        this.active = false;
        this.inEdit = false;
    }

    closeAllOpenForms() {
        // this.view_service.hideContent = {};
        // this.view_service.showEditComponent = {};
        this.showPostCreateForm = false;
    }



}
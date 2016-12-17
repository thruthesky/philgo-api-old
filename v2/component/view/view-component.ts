/**
 * @see ./README.md
 */
import { Component, Input } from '@angular/core';
import { POST} from '../../philgo-api-interface';
import { Post } from '../../post';
import { ViewService } from './view-service';

@Component({
    selector: 'view-component',
    templateUrl: 'view-component.html',
})
export class ViewComponent {
    isPost: boolean = false;
    showPostCreateForm: boolean = false;
    hideContent = {};
    showEditComponent  = {};
    mode = 'edit-post';

    @Input() post: POST = <POST> {};
    @Input() root: POST = null;
    constructor(
        private view_service : ViewService,
        private post_service : Post
    ) {
        console.log("ViewComponent()");
    }
    ngOnInit() {
        this.isPost = ! parseInt(this.post.idx_parent);
    }
    

     onClickEdit( post ) {
        this.mode = 'edit-comment';
      
        this.view_service.hideContent = {};
        this.view_service.hideContent[ post.idx.toString() ] = true;
        console.log(this.view_service.showEditComponent);
        this.view_service.showEditComponent = {};
        console.log(this.view_service.showEditComponent);
        
        this.view_service.showEditComponent[ post.idx.toString() ] = true;
      
        
    }

    onClickDelete( post ) {
        post.inDeleting = true;
        this.post_service.delete( post.idx, re => {
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
        this.post_service.report( post.idx, re => {
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
        this.post_service.vote( post.idx, re => {
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
        this.closeAllOpenForms();
    }
    onCancel() {
        this.closeAllOpenForms();
    }

    closeAllOpenForms() {
        this.view_service.hideContent = {};
        this.view_service.showEditComponent = {};
        this.showPostCreateForm = false;
    }



}
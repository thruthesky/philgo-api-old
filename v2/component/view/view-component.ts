/**
 * @see ./README.md
 */
import { Component, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { POST } from '../../philgo-api-interface';
import { Post } from '../../post';
import { EditComponent } from '../edit/edit-component';

// import { DomSanitizer } from '@angular/platform-browser'


@Component({
    selector: 'view-component',
    templateUrl: 'view-component.html',
})
export class ViewComponent {
    @ViewChild('editComponent') editComponent: EditComponent;
    isPost: boolean = false;
    isComment: boolean = false;
    hideContent: boolean = false;

    @Input() show: boolean = false; // if set true, the create/edit form box shows.
    @Input() mode: string = null;
    @Input() post: POST = null; // it is comment or post.
    @Input() root: POST = null;
    @Input() login_id: string = null;
    
    active: boolean = false; // "active==true" means, the use is in editing.

    @Output() edit = new EventEmitter();
    @Output() error = new EventEmitter();

    //
    showLink: boolean = false;
    constructor(
        // private sanitized: DomSanitizer,
        private postService : Post
    ) {
        // console.log("ViewComponent()");
    }
    ngOnInit() {

        if ( this.post.user_id !== void 0 ) {
            if ( this.post.user_id == this.login_id ) this.post['mine'] = true;
        }

        try {
            this.post['date'] = this.postService.getDateTime( this.post['stamp'] );
        }
        catch (e) {}
        try {
            if ( this.post === null ) return this.error.emit("View Component Error: post is null");
            if ( this.post.idx_parent !== void 0 ) {
                this.isPost = this.post.idx_parent == '0';
                this.isComment = ! this.isPost;
            }
            else {
                // this.postService.error("ViewComponent::ngOnInit() no post.idx_parent");
            }
        }
        catch ( e ) {
            console.info("CATCH : ViewComponent::ngOnInit() idx_parent failed?");
        }

        // try {
        //     this.post.content = this.safeHtml( this.post.content );
        // }
        // catch ( e ) {
        //     alert("Failed on putting safe html");
        // }

        // if ( this.option['show-reply-form'] ) {
        //     if ( this.isPost ) this.mode = 'create-post';
        //     else this.mode = 'create-comment';
        // }
    }
    
    // safeHtml( html ) : string {
    //     return <string> this.sanitized.bypassSecurityTrustHtml( html );
    // }

    onClickReply() {
        this.active = true;
        this.mode = 'create-comment';
        this.editComponent.initForm( this.mode );
    }

    onClickEdit( post ) {
        console.log("ViewComponent::onClickEdit()" );
        this.edit.emit( post );
        this.active = true;
        this.hideContent = true;
        if ( this.post.idx == '0' ) this.mode = 'post-edit';
        else this.mode = 'edit-comment';
        this.editComponent.initForm( this.mode );
    }

    onClickDelete() {
        this.post['inDeleting'] = true;
        this.postService.delete( this.post.idx, re => {
            console.log('delete: re: ', re);
            this.post.subject = "deleted";
            this.post.content = "deleted";
            // this.post['subject'] = "deleted";
            // this.post['content'] = "deleted";
            },
            error => this.error.emit("delete error: " + error ),
            () => this.post['inDeleting'] = false
        );
    }
    

    onClickReport() {
        //console.log("onClickReport()");
        //this.post.debug = true;
        this.post['inReport'] = true;
        this.postService.report( this.post.idx, re => {
            // console.log('delete: re: ', re);
            this.error.emit("You have reported a post. Thank you.");
        },
        error => this.error.emit( error ),
        () => {
            this.post['inReport'] = false;
        });
    }


    onClickLike() {
        this.post['inLike'] = true;
        this.postService.vote( this.post.idx, re => {
            console.log('delete: re: ', re);
            // this.postService.error("You have reported a post. Thank you.");
             this.post['inLike'] = false;
            this.post.good = (parseInt( this.post.good ) + 1).toString();
        },
        error => {
            this.error.emit("like error: " + error );
              this.post['inLike'] = false;
            console.log("like error: " + error );
        },
        () => {
            this.post['inLike'] = false;
        });
    }


    onEditComponentSuccess() {
        this.active = false;
        this.hideContent = false;
    }
    onEditComponentCancel() {
        this.active = false;
        this.hideContent = false;
    }

    onEditComponentError( error ) {
        this.error.emit( error );
    }




}
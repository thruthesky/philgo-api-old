import { Component, Input, Output, EventEmitter, NgZone } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Post, POST_RESPONSE, POST_DATA, POST, COMMENT } from '../../../../../api/philgo-api/v2/post';
import { Data, FILE_UPLOAD_RESPONSE, DATA_UPLOAD_OPTIONS } from '../../../../../api/philgo-api/v2/data';
import * as _ from 'lodash';
import * as app from '../../../../../etc/app.helper';

declare let navigator: any;
declare var Camera;
@Component({
    selector: 'edit-component',
    templateUrl: 'edit-component.html'
})
export class EditComponent {

    /**
     * This is needed to put newly created post on top of post list.
     */
    @Input() pages: any = null;
    /**
     * 'root' is the root post.
     *      - It is needed to 'create-comment'.
     *          - More specifically, it will be used to insert the created comment into view.
     *      - It is not needed on 'edit-comment' and post create/edit.
     * 
     */
    @Input() root: POST = null;
    /**
     *  @Attention - variable 'current' is the current post or current comment.
     * 
     *  If you want to reply of a post, 'current' is the post.
     *  If you want to edit post, 'current' is the post.
     *  If you want to reply of a comment, 'parent' is the comment you want to leave a comment on.
     *  If you want to edit a comment, 'current' is the comment.
     */
    @Input() post_id: string = null;
    @Input() current: POST;
    @Input() active: boolean = false; // adding '.show' CSS Class to FORM
    @Input() mode: 'create-post' | 'edit-post' | 'create-comment' | 'edit-comment';
    @Output() postLoad = new EventEmitter();
    @Output() error = new EventEmitter();
    @Output() success = new EventEmitter();
    @Output() cancel = new EventEmitter();

    
    showProgress: boolean = false;
    progress: number = 0;
    widthProgress: any;
    //files: Array<FILE_UPLOAD_DATA> = <Array<FILE_UPLOAD_DATA>>[];
    temp = <POST_DATA> {};
    
    cordova: boolean = app.isCordova();
    inDeleting: boolean = false;
    inPosting: boolean = false;
    constructor(
        private ngZone: NgZone,
        private post: Post,
        private data: Data,
        private sanitizer: DomSanitizer
        ) {
        // console.log("EditComponent::constructor()");
    }

    renderPage() {
        this.ngZone.run(() => {
            // console.log('ngZone.run()');
        });
    }
    
    ngOnInit() {
        this.reset();
        // console.log("EditComponent::ngOnInit() current: ", this.current);
        // console.log("mode: ", this.mode);
        if ( this.mode == 'edit-post' || this.mode == 'edit-comment' ) { //
            // console.log('without loading. mode: ', this.mode);
            this.temp = _.cloneDeep( this.current );
            this.temp.content = this.post.strip_tags( this.temp.content );
        }
        else if ( this.mode == 'create-post' || this.mode == 'create-comment' ) {
            //
        }
    }
    
    reset() {
        this.temp = <POST_DATA> {};
        this.temp.gid = this.post.uniqid();
    }


    /**
     * When a user click on the form to input content of comemnt for creating a comment.
     */
    onActivateForm( post ) {
        this.active = true; // add CSS class
    }
    
    onClickCancel() {
        this.active = false;
        this.cancel.emit();
    }
    


    /**
     * Query to philog server to create/edit a post/comment.
     */
    onClickSubmit() {

        //console.log("mode: ", this.mode);
        //console.log("current: ", this.current);
        //console.log("temp: ", this.temp);

        this.inPosting = true;
        if ( this.mode == 'create-comment' ) this.createComment();
        else if ( this.mode == 'edit-comment' ) this.editComment();
        else if ( this.mode == 'create-post' ) this.createPost();
        else if ( this.mode == 'edit-post' ) this.editPost();
        else {
            // this.error.emit("wrong mode");
        }
    }


    createPost() {
        this.temp.post_id = this.post_id;
        console.log("temp:", this.temp);
        this.post.create( this.temp,
            s => this.successCallback( s ),
            e => this.errorCallback( e ),
            () => this.completeCallback()
        );
    }

    editPost() {
        this.temp.subject = ''; // to update subject from content.
        this.post.update( this.temp,
            s => this.successCallback( s ),
            e => this.errorCallback( e ),
            () => this.completeCallback()
        );
    }

    createComment() {
        this.temp.idx_parent = this.current.idx;
        
        this.temp.post_id = this.post_id;
        console.log("temp:", this.temp);

        this.post.createComment( this.temp,
            s => this.successCallback( s ),
            e => this.errorCallback( e ),
            () => this.completeCallback()
        );
    }

    editComment() {
        // console.log("this.temp: ", this.temp);
        this.post.update( this.temp,
            s => this.successCallback( s ),
            e => this.errorCallback( e ),
            () => this.completeCallback()
        );
    }

    successCallback( re: POST_RESPONSE ) {
        // console.log( 'PhilGo API Query success: ', re);
        if ( this.mode == 'create-comment' ) {
            let post = this.root;
            let comment = <COMMENT> re.post;
            // console.log("post: ", post);
            if ( post.comments ) { // if there are other comments, insert it.
                let index = _.findIndex( post.comments, c => c.idx == this.current.idx ) + 1;
                // console.log('index: ', index);
                post.comments.splice(
                    index,
                    0,
                    comment
                );
                // post.comments.unshift( comment );
            }
            else post['comments'] = [ comment ]; // if there is no comments, give it in an array.
        }
        else if ( this.mode == 'edit-comment' ) {
            // this.current = <POST> re.post;
            this.current.content = re.post.content;
            if ( re.post['photos'] ) this.current['photos'] = re.post['photos'];
        }
        else if ( this.mode == 'edit-post' ) {
            this.current.subject = re.post.subject;
            this.current.content = re.post.content;
            if ( re.post['photos'] ) this.current['photos'] = re.post['photos'];
        }
        else if ( this.mode == "create-post" ) {

            try {
                if ( this.pages && this.pages.length ) {
                    // console.log("length: ", this.pages.length );
                    let posts = this.pages[0]['posts'];
                    // console.log("posts: ", posts);
                    // console.log("re: ", re);
                    posts.unshift( re.post );
                }
            }
            catch ( e ) { alert("Please restart the app."); }
        }

        this.reset();
        this.active = false; // remove '.show' css class.  it cannot be inside this.clear()
        this.success.emit();
    }
    errorCallback( error ) {
        alert( error );
    }
    completeCallback() {
        this.inPosting = false;
    }


    /**
     * This is for web.
     */
    onChangeFile( event, post ) {
        //
        // console.log("onChangeCommentFile()");
        // console.log("this.comments: ", this.temp);
        this.showProgress = true;
        this.data.uploadPostFile( this.temp.gid, event,
            s => this.onSuccessFileUpload(s),
            f => this.onFailureFileUpload(f),
            c => this.onCompleteFileUpload(c),
            p => this.onProgressFileUpload(p)
        );
    }
    
    /**
     * This is for camera.
     */
    onClickFileUploadButton() {
        if ( ! this.cordova ) return;
        //
        // console.log("onClickCommentFileUploadButton()");

        navigator.notification.confirm(
            'Please select how you want to take photo.', // message
            i => this.onCameraConfirm( i ),
            'Take Photo',           // title
            ['Camera','Cancel', 'Gallery']     // buttonLabels
        );


    }
    onCameraConfirm( index ) {
        // console.log("confirm: index: ", index);
        if ( index == 2 ) return;
        let type = null;
        if ( index == 1 ) { // get the picture from camera.
            type = Camera.PictureSourceType.CAMERA;
        }
        else { // get the picture from library.
            type = Camera.PictureSourceType.PHOTOLIBRARY
        }
        // console.log("in cordova, type: ", type);
        let options = {
            quality: 80,
            sourceType: type
        };
        navigator.camera.getPicture( path => {
            // console.log('photo: ', path);
            this.fileTransfer( path ); // transfer the photo to the server.
        }, e => {
            // console.error( 'camera error: ', e );
            alert("camera error");
        }, options);
    }
    
    fileTransfer( fileURL: string ) {
        this.showProgress = true;
        let options: DATA_UPLOAD_OPTIONS = {
            module_name: 'post',
            gid: this.temp.gid
        };
        
        this.data.transfer( options,
            fileURL,
            x => this.onSuccessFileUpload( x ),
            e => this.onFailureFileUpload( e ),
            c => {},
            p => this.onProgressFileUpload( p )
        );
    }


    
    onSuccessFileUpload (re: FILE_UPLOAD_RESPONSE) {
        // console.log('re.data: ', re.data);
        if ( this.temp.photos === void 0 ) this.temp['photos'] = [];
        this.temp.photos.push( re.data );
        // this.files.push( re.data );
        this.showProgress = false;
        this.renderPage();
    }
    onFailureFileUpload ( error ) {
        this.showProgress = false;
        alert( error );
    }
    onCompleteFileUpload( completeCode ) {
        // console.log("completeCode: ", completeCode);
    }
    onProgressFileUpload( p ) {
        // console.log("percentag uploaded: ", p);
        this.progress = p;
        this.widthProgress = this.sanitizer.bypassSecurityTrustStyle('width:'  + p + '%' );
        this.renderPage();
        this.renderPage();
    }
    
    
    onClickDeleteFile( file ) {

        let re = confirm("Do you want to delete?");
        if ( re == false ) return;

        // console.log("onClickDeleteFile: ", file);
        let data = {
            idx: file.idx
        };
        this.inDeleting = true;
        this.data.delete( data, (re) => {
            this.inDeleting = false;
            // console.log("file deleted: ", re);
            _.remove( this.temp.photos, x => {
                // console.log('x:', x);
                return x['idx'] == data.idx;
            } );
            // console.log( this.temp.photos );
        }, error => {
            this.inDeleting = false;
            alert( error );
        } );

    }


}
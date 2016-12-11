# Sample Code



# POST

* Test on comment edit.

````
    let c = {"idx":"1272584620","member":{"id":"second","name":"second","nickname":"second","idx_primary_photo":"1483471"},"idx_root":"1272582904","idx_parent":"1272582904","gid":"","post_id":"greeting","photos":[],"content":"I am fine. and you?","user_name":"second","stamp":"1481214157","idx_member":"9182","deleted":"0","blind":"","good":"0","bad":"0","depth":"1","int_10":"0"};
    this.onClickEditComment( c );
````

* Auto commenting and listing
````   
    setInterval( () => {
        let c = {"idx_parent":"1162","content":"new title:" + (new Date()).getTime(),"action":"comment_write_submit","id":"user534","session_id":"39ba82cf2df41499e3bbd16dd8b61a27","module":"ajax","submit":1};
        this.post.createComment(
            c,
            re => {
                console.log('auto comment create success: ', re);
                let page = _.find( this.pages, page => {
                    _.find( page.posts, post => {
                        if ( post.idx == re.post.idx_root ) {
                            if ( post.comments ) {
                                let iParent = _.findIndex( post.comments, comment => {
                                    return comment.idx == re.post.idx_parent;
                                });
                                post.comments.splice( iParent + 1, 0, <COMMENT>re.post);
                            }
                        };
                    });
                } );
            },
            e => alert(e),
            () => console.log('auto comment create complete:')
        );
    }, 3000);
````

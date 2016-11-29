# PhilGo Restful API

Philgo Restful API




# Install

npm install @ionic/storage --save




# Example Codes


## Debugging

* To see Reqeust Url, do below.

````
    this.post.debug = true
````


## Comment Create

````

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
        });

````



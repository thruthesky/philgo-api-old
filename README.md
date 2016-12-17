# PhilGo Restful API

Philgo Restful API


# TODO

* capsulate locations of Philipines.
    * Make it class.



# Install


npm install @types/lodash

# TEST

* http://localhost:4200/test/philgo/home for test page
* http://localhost:4200/test/philgo/register


# Example Codes


* @see home.ts to get forums
* get posts of a category
````
    let req = { post_id: this.post_id, page_no: this.page_no };
    this.post.page( req, ( posts: POSTS ) => {
      console.log('posts: ', posts);
      this.posts = posts;
    }, e => {
      alert( e );
    });
````


## Search

@see home.ts for search.




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





# Locations of Philippines

You can get provinces and cities of province like below.

 * @example to get provinces : http://philgo.com/etc/location/philippines/json.php
 * @example to get cities of a province : http://philgo.com/etc/location/philippines/json.php?province=Bohol
 * @example to get all the provinces and cities : http://philgo.com/etc/location/philippines/json.php?province=all

 ````
    http.get( 'http://philgo.com/etc/location/philippines/json.php' )
      .subscribe( re => {
        let data = JSON.parse( re['_body'] );
        this.provinces = data;
        console.log('place:', data);
      });
````




# Components

## latest-component

This component shows latest component.

This shows in three format.

1. text only.
2. text with thumbnail.
3. thumbnail only.




## view component


### view page url.

* if 'post.url' has a value, it assumes it is a permanent url of a post, so, it displays.
    if you dont' want it, delete it before you pass 'post' data to the post.
    of you want it, you put url on 'post.url'..
    

 [option]="{ 'show-reply-form': true }"


 와 같이 하면 코멘트 박스를 보여준다.



## edit component

### property

    * active=true 이면, form 이 active 된 상태를 보여준다.

# PhilGo Restful API

* New Version of Philgo Restful API - v201805
* Old version of [PhilGo API v2](https://github.com/thruthesky/philgo-api/tree/8bcd9b53d06e6acec2bb80f2aa0bfbe59f61b881)

## TODO

* capsulate locations of Philipines.
  * Make it class.

## Install

### Initializing Philgo Api

* You will need to set philgo site api URL and file server url.

```` typescript
export class AppModule {
  constructor(api: PhilGoApiService) {
    api.setServerUrl('https://local.philgo.com/api.php');
    api.setFileServerUrl('https://local.philgo.com/index.php'); // must end with index.php
  }
}
````

## TEST

* http://localhost:4200/test/philgo/home for test page
* http://localhost:4200/test/philgo/register


## Example Codes


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

### Event

* view component will emit 'edit' event if edit button clicked.



### broken image

* for broken thumbnail images, most likely, GIF images can have thumbnail, we show original image.

````
    <img *ngFor=" let photo of post.photos " [src]=" photo.url_thumbnail " (error)="photoImg.src = photo.url " #photoImg>
````

### view page url.

* if 'post.url' has a value, it assumes it is a permanent url of a post, so, it displays.
    if you dont' want it, delete it before you pass 'post' data to the post.
    of you want it, you put url on 'post.url'..
    

 [option]="{ 'show-reply-form': true }"


 와 같이 하면 코멘트 박스를 보여준다.



## edit component

* 'show' 는 form 을 보여 줄 지 말지를 결정한다.
    이 때, 'show' 는 가짜 폼을 보여 줄 수 있다.
    가짜 폼이란, 글쓰기 폼이지만, 실제 폼은 아니고 그냥 그림만 보여주는 것으로 클릭을 하면 실제 폼을 보여주는 것을 말한다.
* 'active' property 는 form 을 보여 줄지 말지만 결정한다.
* 'mode' 를 결정하는 것은
    * (가짜) form box 를 클릭하거나
    * post create button, edit/reply 등을 클릭 할 때 결정된다.





### property

    * active=true 이면, form 이 active 된 상태를 보여준다.

## Examples

### How to do post query to server

See `api.post()` to learn how to use api post query.

```` typescript
    api.setUrl( 'https://local.philgo.com/api.php' );
    api.post({ method: 'version' }).subscribe( re => {
      console.log('data: ', re);
    }, e => console.log(`Error code: ${e.code}, message: ${e.message}`));
````

### How to build and use api method

See the simplest `api.version()` and `api.exchangeRate()` method on how to call and build.

```` typescript
    api.version().subscribe( re => {
      console.log('version: ', re.version);
    }, e => console.log(`Error code: ${e.code}, message: ${e.message}`));
    api.exchangeRate().subscribe( re => {
      console.log('exchangeRate: ', re);
    }, e => console.log(`Error code: ${e.code}, message: ${e.message}`));
````

### General Post Query

`api.query()` is the general query method. You do not need to create api service method anymore since `api.query()` can take all the queries.

```` typescript
    api.query<ApiCurrencyResponse>('exchangeRate', {currency: 'php'}).subscribe( re => {
      console.log('usd: ', re.usd);
      console.log('php: ', re.php);
    }, e => console.log(e));
````


## Protocol

### Response

If there is no data, code is always 0. and data has the response from server.

If code is not 0, then it is considered as an error response from PhilGo Api.

```` josn
{
    code: 0,
    data: ... response data ...
}
````

### Error code

* -400 cannot connect to webserver or PHP script error.
* -500 Server Internal error.

## Test

Run tests like below.

```` typescript
import { Component } from '@angular/core';
import { ApiCurrencyResponse } from '../../modules/philgo-api/providers/philgo-api.service';
import { PhilGoApiTestService } from '../../modules/philgo-api/providers/philgo-api-test.service';
@Component({
  selector: 'app-page-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  providers: [PhilGoApiTestService]
})
export class HomePage {
  constructor(
    t: PhilGoApiTestService
  ) {
    t.setUrl('https://local.philgo.com/api.php').run();
  }
}
````




import { Injectable } from '@angular/core';
import { Http , Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';


export interface USER_DATA {
  email: string;
  password?: string;
  id?: string;
  sessionId : string;
};


@Injectable()
export class PhilgoBase
 {

     url = "http://www.philgo.com"  

    constructor(private http: Http) { }
  
    login( yesCallback, noCallback )
    {  
          let headers  = new Headers({'Content-Type': 'application / x-www-form-urlencoded'}); // ... Set content type to JSON
          let options  = new RequestOptions({ headers: headers }); // Create a request option
          let body = 'module=' + encodeURIComponent('ajax');
              body +='&action=' + encodeURIComponent('post-list');
              body +='&submit'+ encodeURIComponent('1');
              body +='&post_id' + encodeURIComponent('qna');
            
    

            console.log(body);

                  
         return this.http.post(this.url,
                     body,
                     options)
                    .map(response => response)
                    .subscribe(  response => {  
                       //   let str = JSON.parse( response['_body']);
                                 
                    yesCallback(response);
                }, e =>
                    noCallback('Error: ' +  e)   
                ); 
     }
}
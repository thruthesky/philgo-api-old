
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
     http_get_data = [];
     http_post_data : {};
     data : Object = {};



    constructor(private http: Http) { }
  
  
  
    set( key , value ){
        this.data[key] = value;
    }

    login( yesCallback, noCallback )
    {  
          let headers      = new Headers({ 'Content-Type': 'application/json','Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET,POST,PUT,DELETE'}); // ... Set content type to JSON
          let options       = new RequestOptions({ headers: headers }); // Create a request option

         if(!this.data['id']) return  noCallback('Id is required')  
         if(!this.data['password']) return noCallback('Password is required')

            this.set_http_get_data("id", this.data['id']);
            this.set_http_get_data("password", this.data['password']);
            this.set_http_get_data("module", "ajax");
            this.set_http_get_data("action", "login");
            this.set_http_get_data("submit", "1");

      //   return this.http.get(this.url + '?module=ajax&action=login&id='+ this.data['id'] + '&password=' + this.data['password']+'&submit=1')
         //  return this.http_get() 
        return this.http.post(this.url,
                   {'module':'ajax', 'action': 'member_register_submit' ,'id':'randyhsagum','password':'philgo23' },
                 options)
                .map(response => response)
                .subscribe(  response => {  
                //.json() method returns json parse data of response body           
                    let responseData = response.json() 
                    if(responseData['message']) return noCallback(responseData['message'])                                        
                    yesCallback(response);
                }, e =>
                    noCallback('Error: ' +  e)   
                ); 
     }

    
     set_http_get_data( key , value){
         this.http_get_data.push( key + "=" + value );
     }

     http_get(){

        let url = this.url;
        if(this.http_get_data){
            let getDatalen = this.http_get_data.length;
            let body = '';   
            for( let count = 0; count <  getDatalen; count++){            
                if(count) body += "&" + this.http_get_data[count]
                else  body += this.http_get_data[count];
            }
            url += "?" + body;
        }

        return this.http.get(url);

     }

 
}

import { Injectable } from '@angular/core';
import { Http , Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class PhilgoBase
 {
     url = "http://www.philgo.com"  
     data : Object = {};
     
    constructor(private http: Http) { }
  
  
  
    set( key , value ){
        this.data[key] = value;
    }

    login( yesCallback, noCallback )
    {  //Do not remove the console.log, it may affect the method

       

        if(!this.data['id']) return  noCallback('Id is required')  
        if(!this.data['password']) return noCallback('Password is required')

         return this.http.get(this.url + '?module=ajax&action=login&id='+ this.data['id'] + '&password=' + this.data['password']+'&submit=1')
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
 
}
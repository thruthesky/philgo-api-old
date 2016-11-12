
import { Injectable } from '@angular/core';
//import { Http , Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import { Query } from './query';


@Injectable()
export class PhilgoBase
 {
     id:string;
     password:string;
   
    constructor(private http: Query) { }
  
    login( yesCallback, noCallback )
    {  

       let _id = this.id;
       let _password = this.password;
       let _submit = '1';
       let _action = 'login';
       let _module = 'ajax';

       this.http.set('id', _id);
       this.http.set('password', _password);
       this.http.set('action', _action);
       this.http.set('module', _module);
    
       return   this.http.post()
                .map(response => response)
                .subscribe(  response => {  
                   yesCallback(response);
                }, e =>
                   noCallback('Error: ' +  e)   
                ); 
     }
}

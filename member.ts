
import { Injectable } from '@angular/core';
import { PhilgoBase }from './philgo-base';
import { Http , Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';



@Injectable()
export class Member extends PhilgoBase
 {
   
    constructor(private child_http : Http){
        super(child_http);
    }


    login( yesCallback, noCallback? )
    {  
     
           /**These are important when envoking method post to Philgo server for login*/
            this.set('module','ajax');
            this.set('action','login');
            this.set('submit','1');    
         
            this.methodPost( response =>{
                yesCallback(response);    
            }, e =>{
                noCallback(e);
            });
                   
  
     }



     create(successCallBack, failureCallBack?){
       
           /**These are important when envoking method post to Philgo server for registration*/
            this.set('module','ajax');
            this.set('action','member_register_submit');
            this.set('submit','1');       
          
         
             this.methodPost( response =>{
                successCallBack(response);    
            }, e =>{
                failureCallBack(e);
            });
                    
     }



}

import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { Member } from '../../member';



export class User_Data{
  id : string;
  nickname : string;
  password : string;
  name : string;
  email: string;
  mobile : string;
  gender : 'M';
  birth_year = '1916';
}

@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})




export class RegisterPage {
   userData = <User_Data>{}

 
  constructor(public navCtrl: NavController,
              private member : Member) { }



  
    onClickRegister(){

         this.member.sets(this.userData);
         this.member.create(re=> {
           alert('You are now register');
           console.log(re);
         },
         e =>{
           console.log(e);
         })
        
    }

 


}



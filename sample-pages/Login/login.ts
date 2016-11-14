import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { PhilgoBase } from '../../philgo-base';
import { HomePage } from '../home/home';
import { RegisterPage } from '../register/register';

import { Log } from './log';
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})


export class LoginPage {

  id : string;
  password : string;
  constructor(public navCtrl: NavController,
              private philgobase : PhilgoBase) { }



  onClickLogin(){

        console.log('Login :');

        if(!this.id)  return alert('Id is required');
        if(!this.password)  return alert('Password is required');

        this.philgobase.id = this.id;
        this.philgobase.password = this.password;

        this.philgobase
            .login(response => {  
              console.log(response)
              alert('Welcome to Philgo');
            }, e => {            
              console.error(e)
            });    
  }


  onClickRegister(){
    this.navCtrl.setRoot(RegisterPage);
  }


}



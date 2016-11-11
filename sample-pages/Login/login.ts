import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { PhilgoBase } from '../../philgo-base';
import { HomePage } from '../home/home';
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



  onclickLogin(){

        console.log('Login :');
       
        this.philgobase
            .login(response => {
              alert('Welcome to Philgo');
              console.log(response)
              Log.isloggedIn = true;
              this.navCtrl.setRoot(HomePage)
              
            }, e => {
               alert(e);
              console.error(e)
            });       
    
  }
}

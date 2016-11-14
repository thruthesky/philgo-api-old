import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { PhilgoBase } from '../../philgo-base';
import { LoginPage } from '../login/login';
import { Log } from '../login/log';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})


export class HomePage {

  id : string;
  password : string;
  constructor(public navCtrl: NavController,
              private philgobase : PhilgoBase) { 
               
                if(!Log.isloggedIn){ this.navCtrl.setRoot(LoginPage)}
              }



     
    
  


}

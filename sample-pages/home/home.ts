import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { PhilgoBase } from '../../philgo-base'
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})


export class HomePage {

  id : string;
  password : string;
  constructor(public navCtrl: NavController,
              private philgobase : PhilgoBase) { }



  onclickLogin(){
        console.log('Login :');
        this.philgobase.set('id', 'randyhsagum231');
        this.philgobase.set('password','philgo23');
        this.philgobase
            .login(response => 
              console.log(response)
            , e =>
              console.error(e)
            );       
    
  }
}

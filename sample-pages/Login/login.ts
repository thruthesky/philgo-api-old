import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})


export class SampleLoginPage {

  id : string;
  password : string;
  constructor(public navCtrl: NavController) { }




}



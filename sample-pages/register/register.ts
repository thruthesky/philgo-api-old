import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SampleLoginPage } from '../login/login';
import { SampleHomePage } from '../home/home';
import { Member, USER_DATA, USER_LOGIN_DATA } from '../../v2/member';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})



export class SampleRegisterPage {
  login: USER_LOGIN_DATA = <USER_LOGIN_DATA> {};
  userData = <USER_DATA>{}
  urlPhoto = 'assets/img/anonymous.gif';
  process : { loader?; error?; } = {};
  cordova: boolean = false;
 
  constructor(public navCtrl: NavController, private member: Member) {
    this.checkLogin();
  }
  checkLogin() {
    this.member.logged( x => {
      this.login = x;
      this.loadUserProfile();
    }, () => this.login = null );
  }

  loadUserProfile() {
    this.member.data( re => {

      console.log('loginUserProfile(): re', re);
      this.userData.name = re.user_name;
      this.userData.email = re.user_email;
      this.userData.mobile = re.user_mobile;
      this.userData.gender = re.user_gender;
      this.userData.birthday = re.birth_year + '-' + re.birth_month + '-' + re.birth_day;

      this.userData.text_1 = re.user_text_1;
    },
    e => {
      alert("error: " + e);
    })
  }

    onClickRegister() {
      console.log('onClickRegister():', this.userData);
      this.process  = { 'loader': true };
      this.member.register( this.userData, () => {
        console.log('onClickRegister::sucess: ');
        this.navCtrl.setRoot( SampleHomePage );
        alert("Registration Success!");
      },
      e => {
        if ( e == 'json-parse-error' ) {
          this.process['error'] = 'Server Error. Please notify this to admin';
        }
        else this.process = { 'error': e };
      })
    }


    /**
     * Update
     */
    onClickUpdate() {
      console.log('onClickUpdate()', this.userData);
      this.process = { loader: true };
      this.userData.id = this.login.id;
      this.userData.session_id = this.login.session_id;
      this.member.register( this.userData, () => {
        this.process = {};
        alert("Profile update success !");
      },
      e => {
        if ( e == 'json-parse-error' ) this.process = { 'error' : 'Server Error. Please notifiy this to admin' };
        else this.process =  { error: e };
      });
    }


    onClickBack(){
        this.navCtrl.setRoot(SampleLoginPage);
    }


    onClickPhoto() {

    }
 
    onClickDeletePhoto(){

    }

    onChangeFile($event){

    }

}



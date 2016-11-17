import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Member } from './member';
import { SampleHomePage } from '../sample-pages-v3/home/home';
import { SampleLoginPage } from '../sample-pages-v3/login/login';
import { SampleFaceBookLoginPage } from '../sample-pages-v3/facebooklogin/login';
import { SampleRegisterPage } from '../sample-pages-v3/register/register';

@NgModule({
  declarations : [
    SampleHomePage,
    SampleLoginPage,
    SampleRegisterPage,
    SampleFaceBookLoginPage
  ],
  imports: [ IonicModule  ],

  entryComponents: [
   SampleHomePage,
   SampleLoginPage,
   SampleRegisterPage,
   SampleFaceBookLoginPage
  ],
  providers : [ Storage, Member ]
})


export class PhilgoModule {}
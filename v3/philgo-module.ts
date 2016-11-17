import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Member } from './member';
import { SampleHomePage } from '../sample-pages-v3/home/home';
import { SampleLoginPage } from '../sample-pages-v3/login/login';
import { SampleRegisterPage } from '../sample-pages-v3/register/register';

@NgModule({
  declarations : [
    SampleHomePage,
    SampleLoginPage,
    SampleRegisterPage
  ],
  imports: [ IonicModule  ],

  entryComponents: [
   SampleHomePage,
   SampleLoginPage,
   SampleRegisterPage
  ],
  providers : [ Storage, Member ]
})


export class PhilgoModule {}
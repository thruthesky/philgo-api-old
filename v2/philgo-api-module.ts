import { NgModule } from '@angular/core';
import { Member } from './member';
import { SampleHomePage } from '../sample-pages/home/home';
import { SampleLoginPage } from '../sample-pages/login/login';
import { SampleRegisterPage } from '../sample-pages/register/register';



@NgModule({
  declarations : [
    SampleHomePage,
    SampleLoginPage,
    SampleRegisterPage
  ],
  imports: [],

  entryComponents: [
   SampleHomePage,
   SampleLoginPage,
   SampleRegisterPage
  ],
  providers : [ Member ]
})


export class PhilgoApiModule {}
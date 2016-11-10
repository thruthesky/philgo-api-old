
import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
//\import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { HomePage } from './sample-pages/home/home';
import { PhilgoBase } from './philgo-base';


@NgModule({
  declarations : [
    HomePage
  ],
  imports: [ 
    HttpModule,
  IonicModule  ],

  entryComponents: [
   HomePage
  ],
  providers : [ 
    PhilgoBase
     ]
})


export class PhilgoModule {}

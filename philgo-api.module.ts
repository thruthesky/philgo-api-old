import { NgModule } from '@angular/core';
import { PhilGoApiService } from './providers/philgo-api.service';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
    imports: [
        HttpClientModule
    ],
    providers: [
        PhilGoApiService
    ]
})
export class PhilGoApiModule {}

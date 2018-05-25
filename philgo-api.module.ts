import { NgModule } from '@angular/core';
import { PhilGoApiService } from './providers/philgo-api.service';
export { PhilGoApiService };
import { HttpClientModule } from '@angular/common/http';
import { InfiniteScrollService } from './providers/infinite-scroll.service';

@NgModule({
    imports: [
        HttpClientModule
    ],
    providers: [
        PhilGoApiService,
        InfiniteScrollService
    ]
})
export class PhilGoApiModule {}

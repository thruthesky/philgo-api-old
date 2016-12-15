import { Component, Input } from '@angular/core';
import { POST } from '../../post';
@Component({
    selector: 'view-component',
    templateUrl: 'view-component.html'
})
export class ViewComponent {
    isPost: boolean = false;
    @Input() post: POST = <POST> {};
    constructor() {
        console.log("ViewComponent()");
    }
    ngOnInit() {
        this.isPost = ! parseInt(this.post.idx_parent);
    }
}
import { Component, OnInit, Input } from '@angular/core';
import { ApiPostData } from '../../../providers/philgo-api.service';

@Component({
    selector: 'app-comment-list-component',
    templateUrl: 'comment-list.component.html'
})

export class CommentListComponent implements OnInit {
    @Input() post: ApiPostData;
    constructor() { }

    ngOnInit() { }
}




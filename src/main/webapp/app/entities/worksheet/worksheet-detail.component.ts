import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager  } from 'ng-jhipster';

import { Worksheet } from './worksheet.model';
import { WorksheetService } from './worksheet.service';

@Component({
    selector: 'jhi-worksheet-detail',
    templateUrl: './worksheet-detail.component.html'
})
export class WorksheetDetailComponent implements OnInit, OnDestroy {

    worksheet: Worksheet;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private worksheetService: WorksheetService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInWorksheets();
    }

    load(id) {
        this.worksheetService.find(id).subscribe((worksheet) => {
            this.worksheet = worksheet;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInWorksheets() {
        this.eventSubscriber = this.eventManager.subscribe(
            'worksheetListModification',
            (response) => this.load(this.worksheet.id)
        );
    }
}

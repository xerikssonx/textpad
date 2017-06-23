import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager, JhiParseLinks, JhiPaginationUtil, JhiAlertService } from 'ng-jhipster';

import { Worksheet } from './worksheet.model';
import { WorksheetService } from './worksheet.service';
import { ITEMS_PER_PAGE, Principal, ResponseWrapper } from '../../shared';
import { PaginationConfig } from '../../blocks/config/uib-pagination.config';

@Component({
    selector: 'jhi-worksheet',
    templateUrl: './worksheet.component.html'
})
export class WorksheetComponent implements OnInit, OnDestroy {
worksheets: Worksheet[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private worksheetService: WorksheetService,
        private alertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {
    }

    loadAll() {
        this.worksheetService.query().subscribe(
            (res: ResponseWrapper) => {
                this.worksheets = res.json;
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInWorksheets();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: Worksheet) {
        return item.id;
    }
    registerChangeInWorksheets() {
        this.eventSubscriber = this.eventManager.subscribe('worksheetListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }
}

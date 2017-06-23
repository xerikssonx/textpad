import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { Worksheet } from './worksheet.model';
import { WorksheetPopupService } from './worksheet-popup.service';
import { WorksheetService } from './worksheet.service';

@Component({
    selector: 'jhi-worksheet-delete-dialog',
    templateUrl: './worksheet-delete-dialog.component.html'
})
export class WorksheetDeleteDialogComponent {

    worksheet: Worksheet;

    constructor(
        private worksheetService: WorksheetService,
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.worksheetService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'worksheetListModification',
                content: 'Deleted an worksheet'
            });
            this.activeModal.dismiss(true);
        });
        this.alertService.success(`A Worksheet is deleted with identifier ${id}`, null, null);
    }
}

@Component({
    selector: 'jhi-worksheet-delete-popup',
    template: ''
})
export class WorksheetDeletePopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private worksheetPopupService: WorksheetPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.modalRef = this.worksheetPopupService
                .open(WorksheetDeleteDialogComponent, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}

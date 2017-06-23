import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Worksheet } from './worksheet.model';
import { WorksheetPopupService } from './worksheet-popup.service';
import { WorksheetService } from './worksheet.service';
import { User, UserService } from '../../shared';
import { ResponseWrapper } from '../../shared';

@Component({
    selector: 'jhi-worksheet-dialog',
    templateUrl: './worksheet-dialog.component.html'
})
export class WorksheetDialogComponent implements OnInit {

    worksheet: Worksheet;
    authorities: any[];
    isSaving: boolean;

    users: User[];

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private worksheetService: WorksheetService,
        private userService: UserService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
        this.userService.query()
            .subscribe((res: ResponseWrapper) => { this.users = res.json; }, (res: ResponseWrapper) => this.onError(res.json));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.worksheet.id !== undefined) {
            this.subscribeToSaveResponse(
                this.worksheetService.update(this.worksheet), false);
        } else {
            this.subscribeToSaveResponse(
                this.worksheetService.create(this.worksheet), true);
        }
    }

    private subscribeToSaveResponse(result: Observable<Worksheet>, isCreated: boolean) {
        result.subscribe((res: Worksheet) =>
            this.onSaveSuccess(res, isCreated), (res: Response) => this.onSaveError(res));
    }

    private onSaveSuccess(result: Worksheet, isCreated: boolean) {
        this.alertService.success(
            isCreated ? `A new Worksheet is created with identifier ${result.id}`
            : `A Worksheet is updated with identifier ${result.id}`,
            null, null);

        this.eventManager.broadcast({ name: 'worksheetListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError(error) {
        try {
            error.json();
        } catch (exception) {
            error.message = error.text();
        }
        this.isSaving = false;
        this.onError(error);
    }

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }

    trackUserById(index: number, item: User) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-worksheet-popup',
    template: ''
})
export class WorksheetPopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private worksheetPopupService: WorksheetPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.modalRef = this.worksheetPopupService
                    .open(WorksheetDialogComponent, params['id']);
            } else {
                this.modalRef = this.worksheetPopupService
                    .open(WorksheetDialogComponent);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}

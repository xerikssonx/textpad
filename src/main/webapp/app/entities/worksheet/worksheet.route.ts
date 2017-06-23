import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { JhiPaginationUtil } from 'ng-jhipster';

import { WorksheetComponent } from './worksheet.component';
import { WorksheetDetailComponent } from './worksheet-detail.component';
import { WorksheetPopupComponent } from './worksheet-dialog.component';
import { WorksheetDeletePopupComponent } from './worksheet-delete-dialog.component';

import { Principal } from '../../shared';

export const worksheetRoute: Routes = [
    {
        path: 'worksheet',
        component: WorksheetComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Worksheets'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'worksheet/:id',
        component: WorksheetDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Worksheets'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const worksheetPopupRoute: Routes = [
    {
        path: 'worksheet-new',
        component: WorksheetPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Worksheets'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'worksheet/:id/edit',
        component: WorksheetPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Worksheets'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'worksheet/:id/delete',
        component: WorksheetDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Worksheets'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];

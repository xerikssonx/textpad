import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TextpadSharedModule } from '../../shared';
import { TextpadAdminModule } from '../../admin/admin.module';
import {
    WorksheetService,
    WorksheetPopupService,
    WorksheetComponent,
    WorksheetDetailComponent,
    WorksheetDialogComponent,
    WorksheetPopupComponent,
    WorksheetDeletePopupComponent,
    WorksheetDeleteDialogComponent,
    worksheetRoute,
    worksheetPopupRoute,
} from './';

const ENTITY_STATES = [
    ...worksheetRoute,
    ...worksheetPopupRoute,
];

@NgModule({
    imports: [
        TextpadSharedModule,
        TextpadAdminModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        WorksheetComponent,
        WorksheetDetailComponent,
        WorksheetDialogComponent,
        WorksheetDeleteDialogComponent,
        WorksheetPopupComponent,
        WorksheetDeletePopupComponent,
    ],
    entryComponents: [
        WorksheetComponent,
        WorksheetDialogComponent,
        WorksheetPopupComponent,
        WorksheetDeleteDialogComponent,
        WorksheetDeletePopupComponent,
    ],
    providers: [
        WorksheetService,
        WorksheetPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TextpadWorksheetModule {}

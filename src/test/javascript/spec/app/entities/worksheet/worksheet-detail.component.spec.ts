import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils, JhiDataUtils, JhiEventManager } from 'ng-jhipster';
import { TextpadTestModule } from '../../../test.module';
import { MockActivatedRoute } from '../../../helpers/mock-route.service';
import { WorksheetDetailComponent } from '../../../../../../main/webapp/app/entities/worksheet/worksheet-detail.component';
import { WorksheetService } from '../../../../../../main/webapp/app/entities/worksheet/worksheet.service';
import { Worksheet } from '../../../../../../main/webapp/app/entities/worksheet/worksheet.model';

describe('Component Tests', () => {

    describe('Worksheet Management Detail Component', () => {
        let comp: WorksheetDetailComponent;
        let fixture: ComponentFixture<WorksheetDetailComponent>;
        let service: WorksheetService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [TextpadTestModule],
                declarations: [WorksheetDetailComponent],
                providers: [
                    JhiDateUtils,
                    JhiDataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    WorksheetService,
                    JhiEventManager
                ]
            }).overrideTemplate(WorksheetDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(WorksheetDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(WorksheetService);
        });


        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new Worksheet(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.worksheet).toEqual(jasmine.objectContaining({id:10}));
            });
        });
    });

});

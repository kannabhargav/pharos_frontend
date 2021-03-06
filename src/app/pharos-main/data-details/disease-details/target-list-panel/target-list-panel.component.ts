import {ChangeDetectorRef, Component, InjectionToken, Input, OnDestroy, OnInit} from '@angular/core';
import {PharosProperty} from '../../../../models/pharos-property';
import {takeUntil} from 'rxjs/operators';
import {PageData} from '../../../../tools/generic-table/models/page-data';
import {DynamicTablePanelComponent} from '../../../../tools/dynamic-table-panel/dynamic-table-panel.component';
import {PageEvent} from '@angular/material/paginator';
import {PharosApiService} from '../../../../pharos-services/pharos-api.service';
import {DiseaseAssocationSerializer} from '../../../../models/disease-association';
import {Disease} from '../../../../models/disease';
import {NavSectionsService} from "../../../../tools/sidenav-panel/services/nav-sections.service";

/**
 * token to inject structure viewer into generic table component
 * @type {InjectionToken<any>}
 */
export const IDG_LEVEL_TOKEN = new InjectionToken('IDGLevelComponent');

@Component({
  selector: 'pharos-target-list-panel',
  templateUrl: './target-list-panel.component.html',
  styleUrls: ['./target-list-panel.component.scss']
})
export class TargetListPanelComponent extends DynamicTablePanelComponent implements OnInit, OnDestroy {

  disease: Disease;

  fields: PharosProperty[] = [
    new PharosProperty({
      name: 'target',
      label: 'IDG Target'
    }),
    new PharosProperty({
      name: 'developmentLevel',
      label: 'Development Level',
      customComponent: IDG_LEVEL_TOKEN,
      width: '10vw'
    }),
    new PharosProperty({
      name: 'targetFamily',
      label: 'Target Family'
    }),
    new PharosProperty({
      name: 'dataSource',
      label: 'Data Source'
    }),
  ];

  tableArr: any[] = [];

  /**
   * pagination data object
   */
  pageData: PageData;

  /**
   * no args constructor
   * call super object constructor
   */
  constructor(
    private changeRef: ChangeDetectorRef,
    private pharosApiService: PharosApiService,
    public navSectionsService: NavSectionsService
  ) {
    super(navSectionsService);
  }

  ngOnInit() {
    this._data
    // listen to data as long as term is undefined or null
    // Unsubscribe once term has value
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(x => {
        this.disease = this.data.diseases;
        this.loadingComplete();
      });
  }

  /**
   * paginate ligand list datasource
   * @param event
   */
  paginate(event: PageEvent) {
    this.loadingStart();
    const associationSerializer = new DiseaseAssocationSerializer();
    const pageParams = {
      associationtop: event.pageSize,
      associationskip: event.pageIndex * event.pageSize,
    };
    this.pharosApiService.fetchMore('diseases', pageParams).valueChanges.subscribe(res => {
      this.disease.associations = res.data.diseases.associations.map(association => associationSerializer.fromJson(association));
      this.loadingComplete();
      this.changeRef.markForCheck();
    });
  }

  /**
   * cleanp on destroy
   */
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}

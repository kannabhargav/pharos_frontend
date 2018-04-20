import {Component, HostBinding, Input, OnInit} from '@angular/core';
import {Target} from '../../../../../models/target';
import {DiseaseRelevance} from "../../../../../models/disease-relevance";
import {Term} from "../../../../../models/term";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {takeUntil, takeWhile} from "rxjs/operators";
import {Subject} from "rxjs/Subject";
import {Property} from "../../../../../models/property";
import {TableData} from "../../../../../models/table-data";

@Component({
  selector: 'pharos-disease-relevance-panel',
  templateUrl: './disease-relevance-panel.component.html',
  styleUrls: ['./disease-relevance-panel.component.css']
})
export class DiseaseRelevancePanelComponent implements OnInit {
  sourceMap : Map<string, DiseaseRelevance[]> = new Map<string, DiseaseRelevance[]>();
  sources: string[];
  @Input() width: number = 30;
  @HostBinding('attr.fxFlex')
  flex = this.width;

  private ngUnsubscribe: Subject<any> = new Subject();

  // initialize a private variable _data, it's a BehaviorSubject
  private _data = new BehaviorSubject<DiseaseRelevance[]>(null);

  // change data to use getter and setter
  @Input()
  set diseaseRelevance(value: DiseaseRelevance[]) {
    // set the latest value for _data BehaviorSubject
    this._data.next(value);
  }

  get diseaseRelevance() {
    // get the latest value from _data BehaviorSubject
    return this._data.getValue();
  }
  constructor() { }

  ngOnInit() {
    console.log(this);
    this._data
    // listen to data as long as term is undefined or null
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(x =>  {
        if(x) {
          this.mapSources()
          return x;
        }
      });
  }

  mapSources(): void {
    // todo - clear map because the api is returning or getting set twice
    this.sourceMap.clear();
    this.diseaseRelevance.forEach(rel => {
      let labelProp: string = rel.properties.filter(prop => prop.label ==='Data Source').map(lab => lab['term'])[0];
      const temp: DiseaseRelevance[] = this.sourceMap.get(labelProp);
      if (temp) {
        temp.push(rel);
        this.sourceMap.set(labelProp, temp);
      } else {
        this.sourceMap.set(labelProp, [rel]);
      }
    })
    this.sources = Array.from(this.sourceMap.keys());
    //this.sources = ['DisGeNET', 'DrugCentral Indication', 'Expression Atlas', 'JensenLab Experiment COSMIC', 'JensenLab Text Mining', 'Monarch', 'UniProt Disease']
  }

  getTableData(field: string): TableData[] {
    const data: TableData[] = [];
    const diseaseRelevance: DiseaseRelevance[] = this.sourceMap.get(field);
    console.log(diseaseRelevance);
    return data;
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}

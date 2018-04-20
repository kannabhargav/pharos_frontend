import {Component, HostBinding, Input, OnInit} from '@angular/core';
import {Subject} from "rxjs/Subject";
import {DiseaseRelevance} from "../../../../../models/disease-relevance";
import {TableData} from "../../../../../models/table-data";
import {takeUntil} from "rxjs/operators";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

@Component({
  selector: 'pharos-disease-source',
  templateUrl: './disease-source.component.html',
  styleUrls: ['./disease-source.component.css']
})
export class DiseaseSourceComponent implements OnInit {
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
  set diseaseSources(value: DiseaseRelevance[]) {
    // set the latest value for _data BehaviorSubject
    this._data.next(value);
  }

  get diseaseSources() {
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
    this.diseaseSources.forEach(rel => {
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
    new TableData({
      name: 'IDG Disease',
      label: 'Disease',
      sortable: true,
      internalLink: ''
    })
      , {
      name: 'Target Count',
      label: 'Target Count'
    }, {
      name: 'pvalue',
      label: 'P-value'
    }
    return data;
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
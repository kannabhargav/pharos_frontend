
import {
  AfterViewInit, Component,
  EventEmitter,
  Injector,
  Input,
  OnInit,
  Output, QueryList, Type,
  ViewChild, ViewChildren,
  ViewContainerRef
} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {ComponentPortal} from '@angular/cdk/portal';
import {PageData} from './models/page-data';
import {MatPaginator, MatRow, MatSort, MatTableDataSource, Sort} from '@angular/material';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {DataProperty} from "./components/property-display/data-property";

@Component({
  selector: 'pharos-generic-table',
  templateUrl: './generic-table.component.html',
  styleUrls: ['./generic-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

/**
 * Generic table Component that iterates over a list of {@link TableData} options to display fields
 */

export class GenericTableComponent implements OnInit,  AfterViewInit {

  /**
   * initialize a private variable _data, it's a BehaviorSubject
   *
   */
  protected _data = new BehaviorSubject<any>(null);

  /**
   * pushes changed data to {BehaviorSubject}
   */
  @Input()
  set data(value: any) {
    //  this.setPage();
    this._data.next(value);
  }

  /**
   * returns value of {BehaviorSubject}
   */
  get data(): any {
    return this._data.getValue();
  }


  protected _fieldsConfig: BehaviorSubject<DataProperty[]> = new BehaviorSubject<DataProperty[]>(null);

  /**
   * pushes changed data to {BehaviorSubject}
   */
  @Input()
  set fieldsConfig(value: DataProperty[]) {
    this._fieldsConfig.next(value);
  }

  /**
   * returns value of {BehaviorSubject}
   */
  get fieldsConfig(): DataProperty[] {
    return this._fieldsConfig.getValue();
  }


  @ViewChildren('expandedRowOutlet', { read: ViewContainerRef }) rowOutlet:   QueryList<ViewContainerRef>;


  @Input() pageData: PageData = {
    total: 0,
    top: 0,
    skip: 0,
    count: 0
  };
  /**
   * Array of {@link DataProperty} object that containg configuration options for each field
   * */
  // @Input() fieldsConfig: DataProperty[];

  /** boolean to toggle completion of page loading
   * todo: currently not used
   * */
  loading = false;

  /**
   * show/hide the paginator
   */
  @Input() showPaginator = true;


  /**
   * show/hide the bottom paginator
   */
  @Input() showBottomPaginator = false;

  /**
   * Paginator object from Angular Material
   * */
  @ViewChild(MatPaginator) paginator: MatPaginator;

  /**
   * Sort object from Angular Material
   * */
  @ViewChild(MatSort) _sort: MatSort;

  /**
   * generated string array of fields that are to be displayed in the table
   * */
  displayColumns: string[];
  /**
   * generated  array of DataProperties that are to be displayed in the table
   * */
  displayFields: DataProperty[];


  /**
   * whether or not to allow the user to change the size of the page/ show dropdown
   */
  @Input() hidePageSize = false;

  /**
   * Input to toggle if the table should show an "edit" and "delete" button
   * boolean
   */
  @Input() editableTable = false;

  /**
   * Input to toggle if the table should have expandable rows
   * boolean
   */
  @Input() expandable = true;

  /**
   * This compares each row of the table to the "expanded element - if they are equal, the row is expanded
   *  todo: this only allows one open at a time, this might need to be a map to allow multiple expanded rows
   */
  expandedElement: any | null;

  /**
   * event that emits when the edit button is clicked.
   * Emits the row (object) to whatever service/component needs to interact with it
   */
  @Output() readonly editEvent: EventEmitter<MatRow> = new EventEmitter<MatRow>();

  /**
   * event that emits when the delete button is clicked.
   * Emits the row (object) to whatever service/component needs to interact with it
   */
  @Output() readonly deleteEvent: EventEmitter<MatRow> = new EventEmitter<MatRow>();

  /**
   * event that emits when the edit event is canceled.
   * Emits the row (object) to whatever service/component needs to interact with it
   */
  @Output() readonly cancelEvent: EventEmitter<any> = new EventEmitter<any>();

  /**
   * event that emits when the sort value or direction is changed. The parent component will be responsible for
   * fetching and returning the new sorted data
   */
  @Output() readonly sortChange: EventEmitter<Sort> = new EventEmitter<Sort>();

  /**
   * event that emits when the page is changed. The parent component will be responsible for
   * fetching and returning the new data
   */
  @Output() readonly pageChange: EventEmitter<string> = new EventEmitter<string>();

  /**
   * event that emits when the page is changed. The parent component will be responsible for
   * fetching and returning the new data
   */
  @Output() readonly rowClick: EventEmitter<MatRow> = new EventEmitter<MatRow>();

  /**
   * row object that is currently being edited
   */
  editedRow = '';

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();

  @Input() condensed = false;

  /**
   * injector for custom data
   */
  constructor(
    private _injector: Injector
  ) { }

  /**
   * Init: get the columns to be displayed.
   * Table data is tracked by the data getter and setter
   */
  ngOnInit() {
    this._data.subscribe(x => {
      this.dataSource.data = this.data;
    });
    this._fieldsConfig.subscribe(res => {
      this.fetchTableFields();
    });
  }

  /**
   * set the sort and paginators
   * since the total is not know, it needs to be manually set based on the page data passes in
   */
  ngAfterViewInit() {
    this.setPage();

    /*    if (this.fieldsConfig) {
          const defaultSort = this.fieldsConfig.filter(field => field.sorted);
          if (defaultSort.length > 0) {
            this.data.sort.active = defaultSort[0].name;
            this.data.sort.direction = defaultSort[0].sorted;
          }
        }*/
  }

  trackByFn (index: number, item: any) {
    return item.uuid && item.uuid.term ? item.uuid.term : item;
  }

  setPage() {
    if (this.pageData && this.paginator) {
      this.paginator.length = this.pageData.total;
      this.paginator.pageSize = this.pageData.top;
      this.paginator.pageIndex = Math.ceil(this.pageData.skip / this.pageData.top);
    }
  }

  /**
   * emit sort change events
   * @param sort
   */
  changeSort(sort: Sort): void {
    this.sortChange.emit(sort);
  }

  /**
   * emit page change events
   * @param $event
   */
  changePage($event): void {
    this.pageChange.emit($event);
  }

  /**
   * Returns readable label for a data field
   */
  getLabel(name: string): string {
    let ret = '';
    this.displayFields.forEach(field => {
      if (field.name === name) {
        ret = field.label;
      }
    });
    return ret;
  }

  /**
   * Check to see if a column is designed to be sortable
   */
  isSortable(name: string): boolean {
    let ret =  false;
    this.displayFields.forEach(field => {
      if (field.name === name) {
        ret = field.sortable;
      }
    });
    return ret;
  }

  /**
   *sets a flat array of the {@link DataProperty} fields
   */
  fetchTableFields(): void {
    this.displayColumns = [];
    this.displayFields = this.fieldsConfig.filter(field => !!field.visible);
    if (!this.displayFields.length) {
      this.displayFields = this.fieldsConfig;
    }
    if (this.editableTable) {
      this.displayColumns = ['buttons'].concat(this.displayFields.map(field => field.name));
    } else {
      this.displayColumns = this.displayFields.map(field => field.name);
    }
  }


  /**
   * get display columns, which omits a label for a "buttons" column.
   * // todo: this could be problematic if there was a column that needed the heading "buttons"
   */
  fetchDisplayColumns(): string[] {
    return this.displayColumns.filter(field => field !== 'buttons');
  }

  /**
   * forces to boolean a check to see if a field has a custom component associated with it
   * @param field
   */
  checkCustomComponent(field: DataProperty): boolean {
    return !!field.customComponent;
  }

  /**
   * way to set a column width
   * todo: each optential property width needs to have a corresponding class set up
   * todo: THIS NEEDS WORK
   * @param property
   */
  getWidth(property: DataProperty): string {
    return property.width ? `width${property.width}` : '';
  }

  // todo any changes to the table (even hovering over buttons re-generates this element
  // todo: try manually attaching it instead of using the directive
  /**
   * creates a custom component inside a table field currently the specific field data, substance object and expanded row
   * container are sent to the custom component
   * todo: the comtainer and object should be optional fields
   * todo: table injected components need to impoement an interface to get the substance or container
   * @param field
   * @param row
   * @param index
   */
  getCustomComponent(field: DataProperty, row: MatRow, index: number): ComponentPortal<any> {
    if (this.rowOutlet) {
      if (field.customComponent) {
        const comp =  this._injector.get<Type<any>>(field.customComponent);
        const portal: ComponentPortal<any> = new ComponentPortal(comp);
        return portal;
      }
    }
  }

  /**
   * this fires once the custom comoponent above is created. Here is where listeners can be added to react to requests
   * from the injected component
   * this gives access to the injected component instance
   * todo the injectable components need to implement an interface to have standard input and output events
   * @param component
   * @param index
   * @param field
   */

  componentAttached(component: any, index?: number, field?: DataProperty) {
    if (component.instance.data === null && this.data[index][field.name]) {
      component.instance.data = this.data[index][field.name];
    }
    if (component.instance.object) {
      component.instance.object = this.data[index];
    }
    if (component.instance.container) {
      component.instance.container = this.rowOutlet.toArray()[index];

    }
    if (component.instance.parent) {
      component.instance.parent = this.data[index];

    }
    if (component.instance.clickEvent) {
      component.instance.clickEvent.subscribe(res => {
        this.cellClicked(res);
      });
    }
  }

  /**
   * check to see if row is being edited
   * @param id
   */
  editingRow(id: string) {
    return id === this.editedRow;
  }

  editClick(row: any): void {
    row.editing = true;
    this.editedRow = row._id;
    this.editEvent.emit(row);
  }

  cancelEdit(row: any): void {
    row.editing = false;
    this.editedRow = '';
    this.cancelEvent.emit('closed');
  }

  deleteRow(row: any): void  {
    row.editing = false;
    this.editedRow = '';
    this.deleteEvent.emit(row);
  }

  cellClicked(row: MatRow): void {
    this.expandedElement = this.expandedElement === row ? null : row;
  }

  rowClicked(row: MatRow): void {
    this.rowClick.emit(row);
  }
}


/*
/!**
 * set the sort and paginators
 * todo: sort doesn't appear to work
 *!/
ngAfterViewInit() {
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this._sort;
  if (this.fieldsConfig) {
    const defaultSort = this.fieldsConfig.filter(field => field.sorted);
    if (defaultSort.length > 0) {
      this.dataSource.sort.active = defaultSort[0].name;
      this.dataSource.sort.direction = defaultSort[0].sorted;
    }
  }
  this.dataSource.sortingDataAccessor = (item, property) => {
    if (item[property].term) {
      return item[property].term;
    } else if (item[property].numval) {
      return item[property].numval;
    } else if (item[property].intval) {
      return item[property].intval;
    } else {
      return item[property];
    }
  };
  this.dataSource.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);


}


}*/

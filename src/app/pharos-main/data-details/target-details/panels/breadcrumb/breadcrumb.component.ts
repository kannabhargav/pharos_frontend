import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BehaviorSubject} from 'rxjs/index';
import {PathResolverService} from '../../../../../pharos-services/path-resolver.service';
import {Target} from '../../../../../models/target';

/**
 * Component to track the hierarchy of a target
 */
@Component({
  selector: 'pharos-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})

export class BreadcrumbComponent implements OnInit {
  /**
   * Target, used to display the name
   */
  target?: Target;
  /**
   * initialize a private variable _data, it's a BehaviorSubject
   * @type {BehaviorSubject<any>}
   * @private
   */
  protected _data = new BehaviorSubject<any>(null);

  /**
   * pushes changed data to {BehaviorSubject}
   * @param value
   */
  @Input()
  set data(value: any) {
    this._data.next(value);
  }

  /**
   * returns value of {BehaviorSubject}
   * @returns {any}
   */
  get data(): any {
    return this._data.getValue();
  }

  /**
   * string array of current links based on the url
   */
  links: any[];

  /**
   * object to hold path data. prevents bad links
   */
  path: any;

  /**
   * uses {ActivatedRoute} path to populate links
   * @param {ActivatedRoute} route
   */
  constructor(private route: ActivatedRoute,
  private pathResolverService: PathResolverService) { }

  /**
   * Build array of links based on current url path
   */
  ngOnInit() {
    const pt = this.route.snapshot.data.path;
    this.path = {term: pt, label: pt};
    this._data.subscribe(x => {
      if (this.data) {
        if (this.data.dto && this.data.dto.length > 0) {
          this.links = this.data.dto.sort((a, b) => b.label < a.label);
        } else if (this.data.breadcrumb && this.data.breadcrumb.length > 0) {
          this.links = this.data.breadcrumb.sort((a, b) => b.label < a.label);
        }
      }
    });
  }

  /**
   * navigate to url, using link the same way facets are used
   * @param link
   */
  goTo(link: any): void {
    this.pathResolverService.mapSelection({name: link.label, change: {added: [link.term]}});
    this.pathResolverService.navigate(this.route.snapshot.data.path);
}

}

import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DataListComponent} from "../../data-list/data-list.component";
import {TopicsListResolver} from "../../resolvers/topics-list.resolver";
import {SharedModule} from "../../../shared/shared.module";
import {TOKENS} from "../../../../config/component-tokens";
import {CommonToolsModule} from "../../../tools/common-tools.module";
import {SharedListModule} from "../../../shared/shared-list.module";
import {TopicCardComponent} from "../../data-list/cards/topic-card/topic-card.component";
import {TopicTableComponent} from "../../data-list/tables/topic-table/topic-table.component";

const routes: Routes = [
  {
    path: '',
    component: DataListComponent,
    resolve: {
      data: TopicsListResolver
    },
    runGuardsAndResolvers: 'paramsOrQueryParamsChange'
  }
];

@NgModule({
  declarations: [
    TopicTableComponent,
    TopicCardComponent

  ],
  imports: [
    SharedModule.forRoot(),
    CommonToolsModule,
    SharedListModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    TopicsListResolver,
    {provide: TOKENS.TOPIC_TABLE_COMPONENT, useValue: TopicTableComponent},
  ],
  entryComponents: [
    TopicTableComponent,
    TopicCardComponent
  ],
  exports: [
    TopicTableComponent,
    TopicCardComponent,
    RouterModule
  ]
})
export class TopicListRoutingModule { }
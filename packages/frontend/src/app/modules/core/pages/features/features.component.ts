import { Component } from "@angular/core";
import { BaseTableComponent, NonNullSkipArray } from "../../../../components/base-table/base-table.component";
import { GetFeaturesGQL, GetFeaturesQuery } from "../../../../graphql/generated/schema";


type QFeatureEdge = NonNullSkipArray<GetFeaturesQuery['featuresWithPagination']['edges']>
type QFeature = QFeatureEdge['node']


@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.scss']
})
export class FeaturesComponent extends BaseTableComponent<QFeature, QFeatureEdge>  {

  constructor(private featuresGQL: GetFeaturesGQL) {
    super()
    this.dataKey = 'featuresWithPagination'
  }

  loadDataFromServer(first: number, after: string) {
    return this.featuresGQL.fetch({first, after})
  }


}

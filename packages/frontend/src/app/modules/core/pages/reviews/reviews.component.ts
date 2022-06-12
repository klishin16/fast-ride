import { Component } from "@angular/core";
import { BaseTableComponent, NonNullSkipArray } from "../../../../components/base-table/base-table.component";
import { GetReviewsGQL, GetReviewsQuery } from "../../../../graphql/generated/schema";


type QReviewEdge = NonNullSkipArray<GetReviewsQuery['reviewsWithPagination']['edges']>
type QReview = QReviewEdge['node']

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent extends BaseTableComponent<QReview, QReviewEdge>  {

  constructor(private readonly getReviewsGQL: GetReviewsGQL) {
    super()
    this.dataKey = 'reviewsWithPagination'
  }



  loadDataFromServer(first: number, after?: string) {
    return this.getReviewsGQL.fetch({first, after})
  }

  deleteData(data_id: string): Promise<boolean> {
    return Promise.resolve(false);
  }

  // @ts-ignore
  updateData(data: QReview) {
    return Promise.resolve({});
  }

}

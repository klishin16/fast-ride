import { Component, OnInit } from "@angular/core";
import { GetCommentsGQL, GetCommentsQuery } from "../../../../graphql/generated/schema";
import { BaseTableComponent, NonNullSkipArray } from "../../../../components/base-table/base-table.component";

type QCommentEdge = NonNullSkipArray<GetCommentsQuery['comments']['edges']>
type QComment = QCommentEdge['node']

@Component({
  selector: "app-comments",
  templateUrl: "./comments.component.html",
  styleUrls: ["./comments.component.scss"]
})
export class CommentsComponent extends BaseTableComponent<QComment, QCommentEdge> implements OnInit {

  constructor(private commentsGQL: GetCommentsGQL) {
    super()
    this.dataKey = 'comments'
  }

  ngOnInit(): void {
        throw new Error("Method not implemented.");
    }

  loadDataFromServer(first: number, after?: string) {
    return this.commentsGQL.fetch({first, after})
  }
}

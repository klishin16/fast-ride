import { Component, OnInit } from "@angular/core";
import { BaseTableComponent, NonNullSkipArray } from "../../../../components/base-table/base-table.component";
import { GetUsersGQL, GetUsersQuery } from "../../../../graphql/generated/schema";


type QUserEdge = NonNullSkipArray<GetUsersQuery['usersWithPagination']['edges']>
type QUser = QUserEdge['node']


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent extends BaseTableComponent<QUser, QUserEdge> implements OnInit {

  constructor(private usersGQL: GetUsersGQL) {
    super()
    this.dataKey = 'usersWithPagination'
  }

  loadDataFromServer(first: number, after?: string) {
    return this.usersGQL.fetch({first, after})
  }

  ngOnInit(): void {
  }

}

import { Component, OnInit } from "@angular/core";
import { BaseTableComponent, NonNullSkipArray } from "../../../../components/base-table/base-table.component";
import {GetUsersGQL, GetUsersQuery, UpdateUserGQL} from "../../../../graphql/generated/schema";
import {lastValueFrom} from "rxjs";
import _ from "lodash";


type QUserEdge = NonNullSkipArray<GetUsersQuery['usersWithPagination']['edges']>
type QUser = QUserEdge['node']


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent extends BaseTableComponent<QUser, QUserEdge> implements OnInit {
  public listOfRoles = ['USER', 'ADMIN'];
  selectedRoles: Array<string> = [];

  constructor(private usersGQL: GetUsersGQL, private updateUserGQL: UpdateUserGQL, ) {
    super()
    this.dataKey = 'usersWithPagination'
  }

  loadDataFromServer(first: number, after?: string) {
    return this.usersGQL.fetch({first, after})
  }

  ngOnInit(): void {
  }

  deleteData(data_id: string): Promise<boolean> {
    return Promise.resolve(false);
  }

  // @ts-ignore
  updateData(data: QUser) {
    return lastValueFrom(this.updateUserGQL.mutate({ data: _.pick(data, ['firstname', 'lastname', 'roles']) })).then(v => v.data!.updateUser)
  }

}

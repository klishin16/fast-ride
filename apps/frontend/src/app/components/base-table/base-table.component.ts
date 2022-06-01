import { Component } from '@angular/core';
import { BaseComponent } from "../base.component";
import { BehaviorSubject, catchError, filter, map, Observable, of, tap } from "rxjs";
import { NzTableQueryParams } from "ng-zorro-antd/table";
import { ApolloQueryResult } from "@apollo/client/core";
import { Logger } from "../../services/logger/logger";
import _ from "lodash";

export type NonNullSkipArray<T> = NonNullable<T> extends infer T1
  ? T1 extends unknown[]
    ? NonNullable<T1[number]>
    : T1
  : never;


interface IBaseEntity {
  id: string
}

interface IBaseEntityQuery<EntityEdg> {
  edges?: Array<EntityEdg> | null | undefined,
  pageInfo: {
    hasNextPage: boolean
  },
  totalCount: number
}


@Component({
  selector: 'app-base-table',
  templateUrl: './base-table.component.html',
  styleUrls: ['./base-table.component.scss']
})
export abstract class BaseTableComponent<Entity extends IBaseEntity, EntityEdge> extends BaseComponent  {
  private logger = new Logger(BaseTableComponent.name)

  public dataKey: string = ''
  public tableData$ = new BehaviorSubject<Array<Entity>>([])

  public editCache: { [key: string]: { edit: boolean; data: Entity } } = {};

  public is_loading$ = new BehaviorSubject<boolean>(false)

  /** Pagination */
  public totalPages: number = 0;
  public pageSize = 10;
  public pageIndex = 1;

  protected constructor() {
    super()
  }

  /** Executes on selected row for edit */
  public startEdit(id: string): void {
    this.editCache[id].edit = true;
  }

  /** Executes on cancel editing */
  public cancelEdit(id: string): void {
    const index = this.tableData$.value.findIndex(item => item.id === id);
    this.editCache[id] = {
      data: { ...this.tableData$.value[index] },
      edit: false
    };
  }

  /** Executes on save editing */
  public saveEdit(id: string): void {
    const index = this.tableData$.value.findIndex(item => item.id === id);
    Object.assign(this.tableData$.value[index], this.editCache[id].data);
    this.editCache[id].edit = false;
  }

  public updateEditCache(): void {
    this.tableData$.value.forEach(item => {
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    });
  }

  public onQueryParamsChange(params: NzTableQueryParams): void {
    this.logger.func('onQueryParamsChange');
    this.loadDataFromServer(
      params.pageSize,
      this.tableData$.value[(params.pageIndex - 1) * params.pageSize - 1]?.id
    ).pipe(
      tap(result => this.is_loading$.next(result.loading)),
      filter(result => !result.loading),
      map(response => {
        return response.data[this.dataKey]
      }),
      catchError(err => {
        if (err.graphQLErrors) {
          err.graphQLErrors.forEach((e: any) => {
            console.log("for e", e);
          });
        }
        if (err.networkError) {
          console.log('Network error', err);
        }
        console.log("Default error");
        // default return
        return of([]);
      })
    ).subscribe(data => {
      const newData = (data as  IBaseEntityQuery<EntityEdge>)
      this.totalPages = newData.totalCount
      // @ts-ignore
      this.tableData$.next(newData.edges?.map(edge => edge.node)??[])
      console.log(this.tableData$.value);
    })
  }

  abstract loadDataFromServer(first: number, after?: string):  Observable<ApolloQueryResult<
    Record<string | '__typename', IBaseEntityQuery<EntityEdge> | string>
>>;
}

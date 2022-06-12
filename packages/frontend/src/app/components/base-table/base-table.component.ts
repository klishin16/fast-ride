import {Component} from '@angular/core';
import {BaseComponent} from "../base.component";
import {BehaviorSubject, catchError, filter, map, Observable, of, tap} from "rxjs";
import {NzTableQueryParams} from "ng-zorro-antd/table";
import {ApolloQueryResult} from "@apollo/client/core";
import {Logger} from "../../services/logger/logger";
import _ from "lodash";
import {NzNotificationService} from "ng-zorro-antd/notification";

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
export abstract class BaseTableComponent<Entity extends IBaseEntity, EntityEdge> extends BaseComponent {
  private logger = new Logger(BaseTableComponent.name)

  public dataKey: string = ''
  public tableData: Entity[] = []

  public editCache: Map<string, { edit: boolean; data: Entity }> = new Map();

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
    if (this.editCache.has(id)) {
      this.editCache.get(id)!.edit = true;
    }
  }

  /** Executes on cancel editing */
  public cancelEdit(id: string): void {
    const index = this.tableData.findIndex(item => item.id === id);
    this.editCache.get(id)!.edit = false;
    this.editCache.get(id)!.data = this.tableData[index]
  }

  /** Executes on save editing */
  public async saveEdit(id: string): Promise<void> {
    this.is_loading$.next(true)
    const data = await this.updateData(this.editCache.get(id)!.data)
    console.log('data', data)
    this.editCache.get(id)!.data = {
      ...this.editCache.get(id)!.data,
      ...data
    }
    this.editCache.get(id)!.edit = false;
    this.tableData = this.tableData.map((item) => {
      if (item.id === data.id) {
        return {
          ...item,
          ...data
        }
      }

      return item
    })
    this.is_loading$.next(false)
  }

  public updateEditCache(): void {
    this.tableData.forEach(item => {
      if (this.editCache.has(item.id)) {
        this.editCache.get(item.id)!.edit = false;
        this.editCache.get(item.id)!.data = {...(_.omit(item, ['__typename']) as Entity)}
      } else {
        this.editCache.set(item.id, {edit: false, data: {...(_.omit(item, ['__typename']) as Entity)}})
      }
    });
  }

  public onQueryParamsChange(params: NzTableQueryParams): void {
    this.logger.func('onQueryParamsChange');
    this.loadDataFromServer(
      params.pageSize,
      this.tableData[(params.pageIndex - 1) * params.pageSize - 1]?.id
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
      const newData = (data as IBaseEntityQuery<EntityEdge>)
      this.totalPages = newData.totalCount
      // @ts-ignore
      this.tableData = newData.edges?.map(edge => edge.node) ?? []
      // console.log(this.tableData$.value);
      this.updateEditCache()
    })
  }

  abstract loadDataFromServer(first: number, after?: string): Observable<ApolloQueryResult<Record<string | '__typename', IBaseEntityQuery<EntityEdge> | string>>>;

  abstract updateData(data: Entity): Promise<Entity>;

  abstract deleteData(data_id: string): Promise<boolean>;
}

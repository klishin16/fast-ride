import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Logger } from "./logger/logger";
import {MeGQL, Role} from "../graphql/generated/schema";

export interface IUser {
  id: string,
  email: string,
  roles: Array<Role>
}


@Injectable({
  providedIn: "root"
})
export class UsersService {
  private logger = new Logger(UsersService.name)
  public current_user$ = new BehaviorSubject<IUser | undefined>(undefined)
  constructor(private meGQL: MeGQL) {
    this.logger.status("Initialized")
  }

  public getAndSetMe() {
    this.logger.func("getMe")
    this.meGQL.fetch({}, {fetchPolicy: "no-cache"}).subscribe((v) => {
      this.current_user$.next(v.data.me)
    })
  }
}

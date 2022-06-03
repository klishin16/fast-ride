import { Injectable } from "@angular/core";
import { BehaviorSubject, filter } from "rxjs";
import { SidebarNavigationItem } from "../layouts/main-layout/main-layout.component";
import { Logger } from "./logger/logger";
import { RoadsViewService } from "./map/roads-view.service";

@Injectable({
  providedIn: "root"
})
export class MainLayoutService {
  private logger = new Logger(MainLayoutService.name)
  /** Вызывать для измения sidebar а */
  public isSidebarCollapsed$ = new BehaviorSubject(false)

  public isNewReviewOpened$ = new BehaviorSubject(false)

  public isFeatureDetailOpened$ = new BehaviorSubject(false)

  public currentView$ = new BehaviorSubject<SidebarNavigationItem | null>(null)


  public toggleSidebar() {
    this.isSidebarCollapsed$.next(!this.isSidebarCollapsed$.value)
  }

  public toggleNewReviewWindow() {
    this.isNewReviewOpened$.next(!this.isNewReviewOpened$.value)
  }

  public toggleFeatureDetailWindow() {
    this.isFeatureDetailOpened$.next(!this.isFeatureDetailOpened$.value)
  }

  constructor(private road_view_service: RoadsViewService) {
    this.currentView$.subscribe(current_view =>{
      this.logger.info(`Current view: ${current_view?.name}`)
    })

    this.road_view_service.is_roads_map_shown$.pipe(
      filter(value => !value)
    ).subscribe(() => {
      this.isFeatureDetailOpened$.next(false)
    })
  }
}

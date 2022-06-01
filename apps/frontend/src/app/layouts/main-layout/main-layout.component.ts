import { Component } from "@angular/core";
import { MapService } from "../../services/map/map.service";
import { debounceTime, distinctUntilChanged, merge } from "rxjs";
import { MainLayoutService } from "../../services/main-layout.service";


export interface SidebarNavigationItem {
  name: string,
  path?: string,
  icon?: string,
  children?: Array<SidebarNavigationItem>
}


@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent  {



  public sidebarNavigationItems: Array<SidebarNavigationItem> = [
    {
      name: 'Map',
      icon: 'gateway',
      path: '/app/map'
    },
    {
      name: 'My reviews',
      icon: 'snippets',
      path: '/app/my-reviews'
    },
    {
      name: 'Admin',
      icon: 'user',
      children: [
        {
          name: 'Users',
          path: '/app/admin/users'
        },
        {
          name: 'Reviews',
          path: '/app/admin/reviews'
        },
        {
          name: 'Features',
          path: '/app/admin/features'
        },
        {
          name: 'Comments',
          path: '/app/admin/comments'
        },
      ]
    },
  ]

  constructor(public layoutService: MainLayoutService, private mapService: MapService) {
    merge(
      this.layoutService.isSidebarCollapsed$.pipe(distinctUntilChanged()),
      this.layoutService.isNewReviewOpened$.pipe(distinctUntilChanged())
    ).pipe(debounceTime(250))
      .subscribe(() => {
      this.mapService.should_resize_map$.next()
    })
  }
}

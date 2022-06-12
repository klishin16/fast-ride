import { Component } from "@angular/core";
import { MapService } from "../../services/map/map.service";
import { debounceTime, distinctUntilChanged, merge } from "rxjs";
import { MainLayoutService } from "../../services/main-layout.service";
import {UsersService} from "../../services/users.service";
import {Role} from "../../graphql/generated/schema";


export interface SidebarNavigationItem {
  name: string,
  path?: string,
  icon?: string,
  children?: Array<SidebarNavigationItem>,
  access?: Array<Role>
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
      path: '/app/map',
    },
    {
      name: 'My reviews',
      icon: 'snippets',
      path: '/app/my-reviews'
    },
    {
      name: 'Admin',
      icon: 'user',
      access: [Role.Admin],
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

  constructor(public layoutService: MainLayoutService, private mapService: MapService, private userService: UsersService) {
    merge(
      this.layoutService.isSidebarCollapsed$.pipe(distinctUntilChanged()),
      this.layoutService.isNewReviewOpened$.pipe(distinctUntilChanged())
    ).pipe(debounceTime(250))
      .subscribe(() => {
      this.mapService.should_resize_map$.next()
    })
  }

  public hasAccess(item: SidebarNavigationItem): boolean {
    if (item.access) {
      return !!this.userService.current_user$.value?.roles.some(user_role => item.access?.some(access_role => user_role === access_role))
    } else {
      return true
    }
  }
}

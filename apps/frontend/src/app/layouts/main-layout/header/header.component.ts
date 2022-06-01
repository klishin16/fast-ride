import { Component, OnInit } from "@angular/core";
import { MainLayoutService } from "../../../services/main-layout.service";
import { RoadsViewService } from "../../../services/map/roads-view.service";
import { UsersService } from "../../../services/users.service";
import { AuthService } from "../../../services/auth.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(
    public layoutService: MainLayoutService,
    public roadsViewService: RoadsViewService,
    public usersService: UsersService,
    public authService: AuthService
  ) { }

  ngOnInit(): void {

  }
}

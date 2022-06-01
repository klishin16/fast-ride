import { Component, OnInit } from '@angular/core';
import { BaseComponent } from "../../../../components/base.component";
import { BehaviorSubject, catchError, filter, map, of, tap } from "rxjs";
import { GetMyReviewsGQL, Review, User } from "../../../../graphql/generated/schema";
import { IUser, UsersService } from "../../../../services/users.service";
import { Logger } from "../../../../services/logger/logger";

@Component({
  selector: 'app-my-reviews',
  templateUrl: './my-reviews.component.html',
  styleUrls: ['./my-reviews.component.scss']
})
export class MyReviewsComponent extends BaseComponent implements OnInit {
  private logger = new Logger(MyReviewsComponent.name)
  public reviewsData$ = new BehaviorSubject<Array<Review> | null>(null)
  public is_loading$ = new BehaviorSubject<boolean>(false)

  constructor(private myReviewsGQL: GetMyReviewsGQL, private usersService: UsersService) {
    super()
  }

  ngOnInit(): void {
    this.usersService.current_user$.pipe(
      filter(user => !!user)
    ).subscribe(user => {
      this.loadReviewsData(user!)
    })

  }

  private loadReviewsData(user: IUser) {
    this.logger.func('LoadReviewsData')
    this.myReviewsGQL.fetch({userId: user.id}).pipe(
      tap(result => this.is_loading$.next(result.loading)),
      filter(result => !result.loading),
      map(response => {
        return response.data.reviews
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
        this.reviewsData$.next(data as Array<Review>)
      }
    )

  }

}

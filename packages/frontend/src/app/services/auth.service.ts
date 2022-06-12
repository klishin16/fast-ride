import {Injectable} from "@angular/core";
import {StorageService} from "./storage.service";
import {Apollo, gql} from "apollo-angular";
import jwt_decode from "jwt-decode";
import {
  BehaviorSubject,
  catchError,
  EMPTY,
  filter,
  firstValueFrom,
  lastValueFrom,
  map,
  Observable,
  ObservableInput, of,
  tap
} from "rxjs";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {UsersService} from "./users.service";
import {Logger} from "./logger/logger";
import {Router} from "@angular/router";
import {AuthLoginGQL, AuthSignupGQL} from "../graphql/generated/schema";
import {GraphQLError} from "graphql";

interface IAccessToken {
  userId: string;
  iat: string;
  exp: string;
}

interface IRefreshTokenResp {
  accessToken: string;
  refreshToken: string;
}

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private logger = new Logger(AuthService.name);

  public is_authenticated$ = new BehaviorSubject<boolean>(false);
  public is_loading$ = new BehaviorSubject<boolean>(false);

  constructor(
    private apollo: Apollo,
    private notificationService: NzNotificationService,
    private userService: UsersService,
    private router: Router,
    private loginGQL: AuthLoginGQL,
    private signupGQL: AuthSignupGQL
  ) {
    this.logger.status("Initialized");
    this.checkLoggedIn().then((is_authenticated) => {
      this.is_authenticated$.next(is_authenticated);
      if (is_authenticated) {
        this.router.navigate(["/app"])
      }
    });

    this.is_authenticated$.pipe(
      filter(value => value)
    ).subscribe(() => {
      this.userService.getAndSetMe()
    })
  }

  public async checkLoggedIn(): Promise<boolean> {
    try {
      const token = StorageService.getCookie("accessToken");
      if (token) {
        const decodedToken = jwt_decode(token) as IAccessToken | undefined;
        if (!decodedToken) {
          return false;
        }
        this.logger.info("Access token exist");
        if (Math.round(Date.now() / 1000).toString() > decodedToken.exp) {
          this.logger.info("Access token expired");

          const refreshToken = StorageService.getCookie("refreshToken");
          if (!refreshToken) {
            this.logger.error("Refresh token not exist");
            return false;
          }
          this.is_loading$.next(true);
          const updatedTokens = await lastValueFrom(
            this.apollo.mutate({
              mutation: gql`
                mutation refreshToken {
                  refreshToken(token: "${refreshToken}") {
                    accessToken,
                    refreshToken
                  }
                }
              `
            }).pipe(
              tap((d) => this.is_loading$.next(d.loading))
            )
          );
          if (updatedTokens.data && (updatedTokens.data as IRefreshTokenResp).accessToken && (updatedTokens.data as IRefreshTokenResp).refreshToken) {
            const {accessToken, refreshToken} = updatedTokens.data as IRefreshTokenResp;
            StorageService.setCookie("accessToken", accessToken);
            StorageService.setCookie("refreshToken", refreshToken);

            return true;
          } else {
            this.logger.error('Access or refresh token not received')
            return false
          }
        } else {
          return true;
        }
      }

      this.logger.info("No access token");
      return false;
    } catch (error) {
      this.is_loading$.next(false)
      this.notificationService.error(
        "Login error",
        error as string
      );
      return false;
    }
  }

  public signUp(firstname: string, lastname: string, email: string, password: string) {
    this.logger.func("Signup");
    this.is_loading$.next(true);

    return this.signupGQL.mutate({
      data: {
        email,
        password,
        firstname,
        lastname
      }
    })
      .pipe(
        tap(result => this.is_loading$.next(result.loading)),

        filter(result => !result.loading),
        // @ts-ignore
        catchError((err) => {
          this.is_loading$.next(false)
          this.notificationService.error(
            "SignUp Error",
            err
          );

          return of()
        })
      ).subscribe(response => {
        console.log("gere");
        if (response.errors) {
          this.notificationService.error(
            "SignUp Error",
            "Cannot login"
          );

          return;
        }

        const {accessToken, refreshToken, user} = response.data!.signup;
        StorageService.setCookie("accessToken", accessToken);
        StorageService.setCookie("refreshToken", refreshToken);
        this.is_authenticated$.next(true);
        this.userService.current_user$.next(user);
        this.router.navigate(["/app"]);
      });
  }

  public async login(email: string, password: string) {
    this.logger.info("Login");
    this.is_loading$.next(true);
    this.loginGQL.mutate({
      data: {
        email,
        password
      }
    }).pipe(
     catchError(err => {
       throw new Error(JSON.stringify(err.graphQLErrors.flatMap((err: GraphQLError) => Object.values((err.extensions)).flatMap(value => value.message))
         .filter((v: any) => v).join('; ')))
     })
    ).subscribe({
      next: (response) => {
        this.is_loading$.next(false)
        const loginData = response.data!.login;
        const {accessToken, refreshToken, user} = loginData;
        StorageService.setCookie("accessToken", accessToken);
        StorageService.setCookie("refreshToken", refreshToken);
        this.is_authenticated$.next(true);
        this.userService.current_user$.next(user);
        this.router.navigate(["/app"]);
      },
      error: (err) => {
        this.is_loading$.next(false)
        console.log(err)
        this.notificationService.error(
          "Cannot login",
          err
          );
      },
      complete: console.info
    })
  }

  public async logout() {
    StorageService.removeCookie("accessToken");
    StorageService.removeCookie("refreshToken");
    this.userService.current_user$.next(undefined);
    await this.router.navigate(["/auth/login"]);
  }
}

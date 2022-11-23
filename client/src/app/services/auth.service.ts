import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from './api.service';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject: BehaviorSubject<any>;
  public user: Observable<any>;

  constructor(private _api: ApiService, private _token: TokenStorageService) {
    this.userSubject = new BehaviorSubject<any>(this._token.getUser());
    this.user = this.userSubject.asObservable();
  }

  getUser() {
    console.log(this.userSubject);
    console.log(this.userSubject.value);
    return this.userSubject.value;
  }

  login(credentials: any): Observable<any> {
    console.log("credentials",credentials);
    return this._api
      .postTypeRequest('auth/login', {
        email: credentials.email,
        password: credentials.password,
      })
      .pipe(
        map((res: any) => {
          console.log("res login",res);
          let user = {
            email: credentials.email,
            user_id:res.data[0].user_id,
            isAdmin:res.data[0].isAdmin,
            token: res.token,

          };
          this._token.setToken(res.token);
          this._token.setUser(res.data[0]);
          console.log(res);
          console.log("USERID",res.data[0].user_id);
          console.log("isadmin",res.data[0].isAdmin);
          console.log(user);
          this.userSubject.next(user);
          return user;
        })
      );
  }

  register(user: any): Observable<any> {
    console.log("user object for register",user);
    return this._api.postTypeRequest('auth/register', {
      fullName: user.fullName,
      email: user.email,
      password: user.password,
      user_id:user.user_id,
    });
  }

  logout() {
    this._token.clearStorage();
    this.userSubject.next(null);
  }
}

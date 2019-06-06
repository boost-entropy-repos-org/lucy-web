import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { AppRoutes, AppRoutesParams} from '../../constants/app-routes.enum';
import { SsoService } from 'src/app/services/sso.service';
import { UserService } from 'src/app/services/user.service';
import { UserAccessType } from 'src/app/models';
import { RouterService } from 'src/app/services/router.service';
import { Subscription } from 'rxjs';

declare const location: any;

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit, OnDestroy {

  /**
   * User initials
   */
  public userInitials: string = ""

  /**
   * User access type
   */
  public accessType: UserAccessType = UserAccessType.view

  /**
   * Listener for route events
   */
  private routeEventsListener: Subscription;

  /**
   * Show/Hide nav bar actions
   */
  public get isAuthenticated(): boolean {
    return this.ssoService.isAuthenticated();
  }

  /**
   * Used for Highlighting element in
   * navigation bar when route is active
   */ 
  public get isAdminToolsActive(): boolean {
    return this.routerService.current === AppRoutes.AdminTools
  }

  /**
   * Used for Highlighting element in
   * navigation bar when route is active
   */
  public get isProfileActive(): boolean {
    return this.routerService.current === AppRoutes.Profile
  }

  /**
   * Show/Hide Admin Tools Button.
   * This value will only change 
   * when is called ngOnInit().
   * if you wish to manually refresh,
   * call this.setAccessType(). 
   */
  public get isAdmin(): boolean {
    return (this.accessType == UserAccessType.admin);
  }

  /**
   * Show/Hide Add observation button
   * This value will only change 
   * when is called ngOnInit().
   * * If you wish to manually refresh,
   * call this.setAccessType().
   * * If you wish to refresh often:
   *  * add this.setAccessType() call
   *  * to this.listenForRouteChanges()
   */
  public get hasDataEntryAccess(): boolean {
    return (
      this.accessType == UserAccessType.admin ||
      this.accessType == UserAccessType.dataEntry
      );
  }

  constructor(private routerService: RouterService, private ssoService: SsoService, private userService: UserService) { }

  ngOnInit() {
    this.setInitials();
    this.setAccessType();
    this.listenForRouteChanges();
  }

  ngOnDestroy() {
    this.endRouteEventsListener();
  }

  /**
   * For refreshing navbar content that
   * may change based on user's 
   * interactions with the app
   */ 
  private listenForRouteChanges() {
    this.routeEventsListener = this.routerService.events.subscribe((val) => {
      this.setInitials();
    });
  }

  /**
   * Ending Listener in ngOnDestroy()
   */
  private endRouteEventsListener() {
    this.routeEventsListener.unsubscribe();
  }

  /**
   * Setting User's initials in 
   * userInitials to be consumed by HTML
   */
  private setInitials() {
    this.userService.getInitials().then((value) => {
      this.userInitials = value;
      }
    );
  }

  /**
   * Setting User's initials in 
   * userInitials to be consumed by HTML
   */
  private setAccessType() {
    this.userService.getAccess().then((value) => {
      this.accessType = value;
      }
    );
  }

  /**
   * SSO's logout function will 
   * Remove cookies, 
   * end refresh timer, 
   * and end keycloak session
   * by redirecting to an external
   * and redirecting back.
   */
  logout() {
    this.ssoService.logout();
  }

  /**
   * Navigate to Profile Component
   */
  navigateToProfile() {
    this.routerService.navigateTo(AppRoutes.Profile);
  }

  /**
   * Navigate to Admin Tools Component
   */
  navigateToAdminTools() {
    this.routerService.navigateTo(AppRoutes.AdminTools);
  }

  navigateToNewObservation() {
    
  }

}

import {Injectable} from "@angular/core";
import {CanLoad, Route, Router} from "@angular/router";
import {CurrentUserService, I18nService} from "@kizeo/i18n/data-access";

@Injectable()
export class ProductGuard implements CanLoad {
  constructor(private router: Router, private readonly currentUser: CurrentUserService, private i18n: I18nService) {
  }

  async canLoad(route: Route): Promise<boolean> {
    if (await this.currentUser.isAdmin()) { return true }
    
    const url = this.router.getCurrentNavigation()?.extractedUrl.toString() || '/'
    const [, productId, page] = url.split('/')
    const product = await this.i18n.getProductById(productId)

    if (!product) {
      this.router.navigateByUrl('/')
      return false
    }

    const authorizations: any = await this.currentUser.getAuthorizationsForProduct(product!)
    if (authorizations[page]) {
      return true
    }

    const landingPage = await this.currentUser.getLandingPageForProduct(product!)
    this.router.navigate([productId, landingPage])

    return false
  }
}

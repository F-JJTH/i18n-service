export class LocaleDate {
  private _locale = null

  setLocale(locale: any) {
    this._locale = locale
  }

  getLocale() {
    return this._locale
  }
}
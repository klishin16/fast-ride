import Cookies from 'js-cookie';

export class StorageService {

  static getCookie(name: string): string | undefined  {
  // !== 'undefined' ? Cookies.get(name) : undefined
    return Cookies.get(name)
  }

  static setCookie(name: string, value: string, expires?: number): string | undefined {
    return Cookies.set(name, value, { expires: expires || 365 });
  }

  static removeCookie(name: string): void {
    return Cookies.remove(name);
  }
}

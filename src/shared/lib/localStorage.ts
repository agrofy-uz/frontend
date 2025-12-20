type LocalStoreKey =
  | 'access_token'
  | 'searchHistory'
  | 'language'
  | 'refresh_token';

export class LocaleStorageHelper {
  get<T>(key: LocalStoreKey) {
    const data = localStorage.getItem(key);

    if (data) {
      return JSON.parse(data) as T;
    }

    return null;
  }

  set(key: LocalStoreKey, data: unknown) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  remove(key: LocalStoreKey) {
    localStorage.removeItem(key);
  }

  clear() {
    this.remove('access_token');
  }
}

export const localStorageHelper = new LocaleStorageHelper();


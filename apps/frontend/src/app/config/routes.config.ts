import { InjectionToken } from '@angular/core';

export const ROUTES_CONFIG = new InjectionToken('routes.config');

const basePaths = {
  hero: 'hero',
  auth: 'auth',
};

const routesNames = {
  home: '',
  error404: '404',
  hero: {
    myHeroes: 'my-heroes',
    detail: ':id',
  },
  auth: {
    registration: 'registration',
    login: 'login',
  }
};

export const getHeroDetail = (id: string) => `/${basePaths.hero}/${id}`;

export const RoutesConfig: any = {
  basePaths,
  routesNames,
  routes: {
    home: `/${routesNames.home}`,
    error404: `/${routesNames.error404}`,
    hero: {
      myHeroes: `/${basePaths.hero}/${routesNames.hero.myHeroes}`,
      detail: getHeroDetail
    },
    auth: {
      registration: `/${basePaths.auth}/${routesNames.auth.registration}`,
      login: `/${basePaths.auth}/${routesNames.auth.login}`,
    }
  }
};



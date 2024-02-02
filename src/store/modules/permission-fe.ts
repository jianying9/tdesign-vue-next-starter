// 前端 roles 控制菜单权限 通过登录后的角色对菜单就行过滤处理
// 如果需要前端 roles 控制菜单权限 请使用此文件代码替换 permission.ts 的内容

import merge from 'lodash/merge';
import { defineStore } from 'pinia';
import { RouteRecordRaw } from 'vue-router';

import router, { asyncRouterList, defaultRouterList } from '@/router';
import { store } from '@/store';

function filterPermissionsRouters(routes: Array<RouteRecordRaw>, roles: Array<unknown>) {
  const res: Array<RouteRecordRaw> = [];
  const removeRoutes: Array<RouteRecordRaw> = [];
  routes.forEach((route) => {
    const roleCode = route.meta?.roleCode || '';
    if (roleCode === '' || roles.indexOf(roleCode) !== -1) {
      // 一级路由有权限
      const children: Array<RouteRecordRaw> = [];
      route.children?.forEach((childRouter) => {
        const childRoleCode = childRouter.meta?.roleCode || '';
        if (childRoleCode === '' || roles.indexOf(childRoleCode) !== -1) {
          // 二级路由有权限
          children.push(childRouter);
        } else {
          removeRoutes.push(childRouter);
        }
      });
      const newRoute = merge({}, route);
      newRoute.children = children;
      res.push(newRoute);
    }
  });

  return { accessedRouters: res, removeRoutes };
}

export const usePermissionStore = defineStore('permission', {
  state: () => ({
    whiteListRouters: ['/login'],
    routers: [],
    removeRoutes: [],
  }),
  actions: {
    async initRoutes(roles: Array<unknown>) {
      if (!roles) {
        roles = ['all'];
      }
      let accessedRouters = [];

      let removeRoutes: Array<RouteRecordRaw> = [];
      // special token
      if (roles.includes('all')) {
        accessedRouters = asyncRouterList;
      } else {
        const res = filterPermissionsRouters(asyncRouterList, roles);
        accessedRouters = res.accessedRouters;
        removeRoutes = res.removeRoutes;
      }

      this.routers = accessedRouters;
      this.removeRoutes = removeRoutes;

      accessedRouters.forEach((item: RouteRecordRaw) => {
        router.addRoute(item);
      });

      removeRoutes.forEach((item: RouteRecordRaw) => {
        if (router.hasRoute(item.name)) {
          router.removeRoute(item.name);
        }
      });
    },
    async buildAsyncRoutes() {
      return this.routers;
    },
    async restoreRoutes() {
      defaultRouterList.forEach((item: RouteRecordRaw) => {
        if (router.hasRoute(item.name) === false) {
          router.addRoute(item);
        }
      });
    },
  },
});

export function getPermissionStore() {
  return usePermissionStore(store);
}

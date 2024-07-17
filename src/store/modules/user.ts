import { defineStore } from 'pinia';

import { ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME } from '@/config/global';
import { usePermissionStore } from '@/store';
import type { UserInfo } from '@/types/interface';

const InitUserInfo: UserInfo = {
  name: '', // 用户名，用于展示在页面右上角头像处
  timestamp: 0,
  roles: [], // 前端权限模型使用 如果使用请配置modules/permission-fe.ts使用
};

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem(ACCESS_TOKEN_NAME) || '', // 默认token不走权限
    userInfo: { ...InitUserInfo },
  }),
  getters: {
    roles: (state) => {
      return state.userInfo?.roles;
    },
  },
  actions: {
    async login(userInfo: Record<string, unknown>) {
      const mockLogin = async (userInfo: Record<string, unknown>) => {
        // 登录请求流程
        console.log(`用户信息:`, userInfo);
        // const { account, password } = userInfo;
        // if (account !== 'td') {
        //   return {
        //     code: 401,
        //     message: '账号不存在',
        //   };
        // }
        // if (['main_', 'dev_'].indexOf(password) === -1) {
        //   return {
        //     code: 401,
        //     message: '密码错误',
        //   };
        // }
        // const token = {
        //   main_: 'main_token',
        //   dev_: 'dev_token',
        // }[password];
        return {
          code: 200,
          message: '登录成功',
          data: 'main_token',
        };
      };

      const res = await mockLogin(userInfo);
      if (res.code === 200) {
        this.token = res.data;
      } else {
        throw res;
      }
    },
    async initUserPermission() {
      const accessToken = localStorage.getItem(ACCESS_TOKEN_NAME) || '';
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_NAME) || '';
      if (accessToken !== '' && refreshToken !== '') {
        await this.getUserInfo();
      }

      const permissionStore = usePermissionStore();
      permissionStore.initRoutes(this.userInfo.roles);
    },
    async getUserInfo() {
      const { timestamp } = this.userInfo;
      if (timestamp === 0 || new Date().getTime() - timestamp > 30000) {
        this.userInfo.roles = [];
        const res = await this.getRemoteUserInfo(this.token);
        this.userInfo = res;
      }
    },
    async getRemoteUserInfo(): Promise<UserInfo> {
      const mockRemoteUserInfo = async (token: string) => {
        if (token === 'main_token') {
          return {
            name: 'Zixun',
            timestamp: 0,
            roles: ['all'], // 前端权限模型使用 如果使用请配置modules/permission-fe.ts使用
          };
        }
        return {
          name: 'td_dev',
          timestamp: 0,
          roles: ['UserIndex', 'DashboardBase', 'login'], // 前端权限模型使用 如果使用请配置modules/permission-fe.ts使用
        };
      };
      return mockRemoteUserInfo(this.token);
    },
    async logout() {
      localStorage.removeItem(ACCESS_TOKEN_NAME);
      this.token = '';
      this.userInfo = { ...InitUserInfo };
    },
  },
  persist: {
    afterRestore: async (ctx) => {
      await ctx.store.initUserPermission();
    },
    key: 'user',
    paths: ['token'],
  },
});

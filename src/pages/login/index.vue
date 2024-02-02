<template>
  <t-layout key="side" :class="mainLayoutCls">
    <t-watermark
      :watermark-content="[{ text: 'zixun', fontColor: fontColor }]"
      :line-space="24"
      :x="100"
      :y="120"
      :width="158"
      :height="22"
      :alpha="0.3"
    >
      <div class="login-wrapper">
        <login-header />

        <div class="login-container">
          <div class="title-container">
            <h1 class="title margin-no">登录到</h1>
            <h1 class="title">TDesign Vue Next For Zixun</h1>
            <div class="sub-title">
              <p class="tip">{{ type == 'register' ? '已有账号?' : '没有账号吗?' }}</p>
              <p class="tip" @click="switchType(type == 'register' ? 'login' : 'register')">
                {{ type == 'register' ? '登录' : '注册新账号' }}
              </p>
            </div>
          </div>

          <login v-if="type === 'login'" />
          <register v-else @register-success="switchType('login')" />
          <tdesign-setting />
        </div>

        <footer class="copyright">Copyright @ 2021-2022 Zixun. All Rights Reserved</footer>
      </div>
    </t-watermark>
  </t-layout>
</template>
<script lang="ts">
export default {
  name: 'LoginIndex',
};
</script>
<script setup lang="ts">
import { computed, ref } from 'vue';

import TdesignSetting from '@/layouts/setting.vue';
import { useSettingStore } from '@/store';

import LoginHeader from './components/Header.vue';
import Login from './components/Login.vue';
import Register from './components/Register.vue';

const store = useSettingStore();
const fontColor = store.brandTheme;

const type = ref('login');
const switchType = (val: string) => {
  type.value = val;
};
const mainLayoutCls = computed(() => [
  {
    't-layout--with-sider': store.showSidebar,
  },
]);
</script>

<style lang="less" scoped>
@import './index.less';
</style>

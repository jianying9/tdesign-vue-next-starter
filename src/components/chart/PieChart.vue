<template>
  <div
    :id="id"
    class="dashboard-chart-container"
    :style="{ width: '100%', height: `${resizeTime * maxHeight}px` }"
  ></div>
</template>

<script setup lang="ts">
import { PieChart } from 'echarts/charts';
import { LegendComponent, ToolboxComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { nextTick, onDeactivated, onMounted, onUnmounted, ref, watch } from 'vue';

import { useSettingStore } from '@/store';
import { createPieOption } from '@/utils/charts';
import { changeChartsTheme } from '@/utils/color';

const props = withDefaults(
  defineProps<{
    id?: string;
    maxHeight?: string;
    data: any;
  }>(),
  {
    id: 'pieChart',
    maxHeight: '480',
    data: () => {
      return {
        series: [
          {
            data: [],
          },
        ],
      };
    },
  },
);

echarts.use([TooltipComponent, LegendComponent, PieChart, CanvasRenderer, ToolboxComponent]);

const settingStore = useSettingStore();
const resizeTime = ref(1);
const maxHeight = props.maxHeight as unknown as number;
const { id } = props;

// monitorChart
let monitorContainer: HTMLElement;
let monitorChart: echarts.ECharts;
const renderMonitorChart = async () => {
  const option = createPieOption(props.data);
  monitorChart.setOption(option, true);
};

const renderCharts = async () => {
  if (!monitorContainer) {
    monitorContainer = document.getElementById(id);
  }
  // init echarts
  monitorChart = echarts.init(monitorContainer);
  renderMonitorChart();
};

// chartSize update
const updateContainer = () => {
  if (document.documentElement.clientWidth >= 1400 && document.documentElement.clientWidth < 1920) {
    resizeTime.value = Number((document.documentElement.clientWidth / 2080).toFixed(2));
  } else if (document.documentElement.clientWidth < 1080) {
    resizeTime.value = Number((document.documentElement.clientWidth / 1080).toFixed(2));
  } else {
    resizeTime.value = 1;
  }

  monitorChart.resize({
    width: monitorContainer.clientWidth,
    height: resizeTime.value * maxHeight,
  });
};

watch(
  () => props.data,
  async () => {
    renderCharts();
  },
  { deep: true },
);

onMounted(async () => {
  renderCharts();
  nextTick(() => {
    updateContainer();
  });
  window.addEventListener('resize', updateContainer, false);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateContainer);
});

onDeactivated(() => {
  storeModeWatch();
  storeBrandThemeWatch();
  storeSidebarCompactWatch();
});

const storeBrandThemeWatch = watch(
  () => settingStore.brandTheme,
  () => {
    changeChartsTheme([monitorChart]);
  },
);

const storeSidebarCompactWatch = watch(
  () => settingStore.isSidebarCompact,
  () => {
    if (settingStore.isSidebarCompact) {
      nextTick(() => {
        updateContainer();
      });
    } else {
      setTimeout(() => {
        updateContainer();
      }, 180);
    }
  },
);

const storeModeWatch = watch(
  () => settingStore.mode,
  () => {
    [monitorChart].forEach((item) => {
      item.dispose();
    });

    renderCharts();
  },
);
</script>

<style lang="less" scoped></style>

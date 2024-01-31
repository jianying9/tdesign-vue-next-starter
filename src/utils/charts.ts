import dayjs from 'dayjs';

import * as chartModel from '@/api/model/chartModel';
import { useSettingStore } from '@/store';
import { getChartListColorFromTheme, getTdColor } from '@/utils/color';

const settingStore = useSettingStore();
const chartChangeColor = getChartListColorFromTheme(settingStore.brandTheme);
/**
 * 获取表头数据
 *
 * @export
 * @param {string[]} dateTime
 * @param {number} divideNum
 * @returns {string[]}
 */
export function getDateArray(dateTime: string[] = [], divideNum = 10): string[] {
  const timeArray: string[] = [];
  if (dateTime.length > 0) {
    for (let i = 0; i < divideNum; i++) {
      const dateAbsTime: number = (new Date(dateTime[1]).getTime() - new Date(dateTime[0]).getTime()) / divideNum;
      const enhandTime: number = new Date(dateTime[0]).getTime() + dateAbsTime * i;
      timeArray.push(dayjs(enhandTime).format('YYYY-MM-DD'));
    }
  }

  return timeArray;
}

/**
 * 获取随机数
 *
 * @param {number} [num=100]
 * @returns
 *
 * @memberOf DashboardBase
 */
export function getRandomArray(num = 100): number {
  let resultNum = Number((Math.random() * num).toFixed(0));

  if (resultNum <= 1) {
    resultNum = 1;
  }

  return resultNum;
}

export function createAreaLineOption(vo: chartModel.LineOptionVo): any {
  const settingStore = useSettingStore();
  const { placeholderColor, borderColor } = settingStore.chartColors;
  const tdColor = getTdColor();
  // const chartChangeColor = getChartListColor();
  // 计算legend的高度
  const legendHeight = 36 + (vo.legend.data.length / 9 + 1) * 12;

  const option = {
    color: chartChangeColor,
    toolbox: {
      bottom: 0,
      feature: {
        magicType: {
          type: ['line', 'bar'],
        },
        saveAsImage: {
          backgroundColor: tdColor.bgColorContainer,
        },
        dataView: {
          backgroundColor: tdColor.bgColorPage,
          textareaColor: tdColor.bgColorContainer,
          textareaBorderColor: tdColor.componentBorder,
          textColor: tdColor.textColor,
          buttonColor: chartChangeColor[0],
        },
      },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: placeholderColor,
        },
      },
    },
    grid: {
      left: '0',
      right: '20px',
      top: '5px',
      bottom: `${legendHeight}px`,
      containLabel: true,
    },
    legend: {
      left: 'center',
      bottom: '0',
      orient: 'horizontal', // legend 横向布局。
      data: vo.legend.data,
      textStyle: {
        fontSize: 12,
        color: placeholderColor,
      },
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: vo.xAxis.data,
        axisLabel: {
          color: placeholderColor,
          rotate: 45,
        },
        axisLine: {
          lineStyle: {
            width: 1,
          },
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
        axisLabel: {
          color: placeholderColor,
        },
        splitLine: {
          lineStyle: {
            color: borderColor,
          },
        },
      },
    ],
    series: <any>[],
  };
  vo.series.forEach((seriesVo) => {
    const item = {
      name: seriesVo.name,
      type: 'line',
      smooth: false,
      showSymbol: true,
      symbol: 'circle',
      symbolSize: 6,
      itemStyle: {
        borderColor,
        borderWidth: 0,
      },
      lineStyle: {
        width: 1,
      },
      areaStyle: {
        opacity: 0.1,
      },
      stack: 'Total',
      data: seriesVo.data,
    };
    option.series.push(item);
  });
  return option;
}

export function createPieOption(vo: chartModel.PieOptionVo): any {
  const settingStore = useSettingStore();
  const { placeholderColor, borderColor } = settingStore.chartColors;
  const tdColor = getTdColor();
  // const chartChangeColor = getChartListColor();
  const option = {
    color: chartChangeColor,
    toolbox: {
      bottom: 0,
      feature: {
        saveAsImage: {
          backgroundColor: tdColor.bgColorContainer,
        },
        dataView: {
          backgroundColor: tdColor.bgColorPage,
          textareaColor: tdColor.bgColorContainer,
          textareaBorderColor: tdColor.componentBorder,
          textColor: tdColor.textColor,
          buttonColor: chartChangeColor[0],
        },
      },
    },
    tooltip: {
      trigger: 'item',
    },
    series: <any>[],
  };
  vo.series.forEach((seriesVo) => {
    const item = {
      type: 'pie',
      radius: ['48%', '70%'],
      avoidLabelOverlap: true,
      silent: false,
      itemStyle: {
        borderColor,
        borderWidth: 1,
      },
      label: {
        show: true,
        // position: 'center',
        formatter: ['{name|{b}}', '{value|{d}%}'].join(' '),
        rich: {
          value: {
            color: placeholderColor,
            fontSize: 12,
            fontWeight: 'normal',
            lineHeight: 14,
          },
          name: {
            color: placeholderColor,
            fontSize: 12,
            lineHeight: 14,
          },
        },
      },
      data: seriesVo.data,
    };
    option.series.push(item);
  });
  return option;
}
const minPercent = 0.0025;

function nextColor(color: string) {
  const h0 = color.substring(1, 3);
  const h1 = color.substring(3, 5);
  const h2 = color.substring(5);
  const r = Number(`0x${h0}`);
  const g = Number(`0x${h1}`);
  const b = Number(`0x${h2}`);
  const dr = r - b;
  const dg = g - b;
  const absDr = Math.abs(dr);
  const absDg = Math.abs(dg);
  let nextG;
  let nextR;
  if (absDr > 0 && absDg > 0) {
    if (absDr < absDg) {
      nextG = dg > 0 ? g - 1 : g + 1;
      const newDr = Math.round(absDr / absDg);
      nextR = dr > 0 ? r - newDr : r + newDr;
    } else {
      nextR = dr > 0 ? r - 1 : r + 1;
      const newDg = Math.round(absDg / absDr);
      nextG = dg > 0 ? g - newDg : g + newDg;
    }
  } else {
    if (absDr === 0) {
      nextR = b;
    } else {
      nextR = dr > 0 ? r - 1 : r + 1;
    }
    if (absDg === 0) {
      nextG = b;
    } else {
      nextG = dg > 0 ? g - 1 : g + 1;
    }
  }
  return `#${nextR.toString(16)}${nextG.toString(16)}${h2}`;
}

function setChildColor(item: any, color: string, total: number): string {
  if (item.children) {
    const newChildren: any = [];
    item.children.forEach((childVo: any) => {
      color = nextColor(color);
      const dataItem = { ...childVo };
      dataItem.itemStyle = {
        color,
      };
      const percent = childVo.value / total;
      if (percent < minPercent) {
        dataItem.label = {
          show: false,
        };
      }
      newChildren.push(dataItem);
      color = setChildColor(dataItem, color, total);
    });
    item.children = newChildren;
  }
  return color;
}

export function createSunburstOption(vo: chartModel.SunburstOptionVo): any {
  const settingStore = useSettingStore();
  const { placeholderColor, borderColor } = settingStore.chartColors;
  const tdColor = getTdColor();
  // const chartChangeColor = getChartListColor();
  const option = {
    color: chartChangeColor,
    toolbox: {
      bottom: 0,
      feature: {
        saveAsImage: {
          backgroundColor: tdColor.bgColorContainer,
        },
        dataView: {
          backgroundColor: tdColor.bgColorPage,
          textareaColor: tdColor.bgColorContainer,
          textareaBorderColor: tdColor.componentBorder,
          textColor: tdColor.textColor,
          buttonColor: chartChangeColor[0],
        },
      },
    },
    series: <any>[],
  };
  const { total } = vo;
  vo.series.forEach((seriesVo) => {
    const data: any = [];
    seriesVo.data.forEach((dataVo, index) => {
      const color = chartChangeColor[index % chartChangeColor.length];
      const dataItem = { ...dataVo };
      dataItem.itemStyle = {
        color,
      };
      const percent = dataVo.value / vo.total;
      if (percent < minPercent) {
        dataItem.label = {
          show: false,
        };
      }
      data.push(dataItem);
      setChildColor(dataItem, color, vo.total);
    });
    const item = {
      type: 'sunburst',
      radius: [0, '95%'],
      data,
      emphasis: {
        focus: 'none',
      },
      levels: [
        {},
        {
          r0: '10%',
          r: '35%',
          itemStyle: {
            borderColor,
            borderWidth: 1,
          },
          label: {
            // formatter: ['{b}', '{c}'].join(' '),
            formatter: (param: any) => {
              // console.log('level1', param);
              return `${param.name} ${((param.value / total) * 100).toFixed(2)}%`;
            },
            align: 'right',
          },
        },
        {
          r0: '35%',
          r: '60%',
          label: {
            // formatter: ['{b}', '{c}'].join(' '),
            formatter: (param: any) => {
              // console.log('level2', param);
              return `${param.name} ${((param.value / total) * 100).toFixed(2)}%`;
            },
            align: 'right',
          },
          itemStyle: {
            borderColor,
            borderWidth: 1,
          },
        },
        {
          r0: '60%',
          r: '62%',
          label: {
            fontSize: 10,
            color: placeholderColor,
            // formatter: ['{b}', '{c}'].join(' '),
            formatter: (param: any) => {
              // console.log('level3', param);
              return `${param.name} ${((param.value / total) * 100).toFixed(2)}%`;
            },
            position: 'outside',
            silent: false,
          },
          itemStyle: {
            borderColor,
            borderWidth: 1,
          },
        },
      ],
    };
    option.series.push(item);
  });
  return option;
}

export function createGraphOption(vo: chartModel.GarphOptionVo): any {
  const settingStore = useSettingStore();
  const { placeholderColor } = settingStore.chartColors;
  const tdColor = getTdColor();
  // const chartChangeColor = getChartListColor();
  const option = {
    color: chartChangeColor,
    toolbox: {
      bottom: 0,
      feature: {
        saveAsImage: {
          backgroundColor: tdColor.bgColorContainer,
        },
        dataView: {
          backgroundColor: tdColor.bgColorPage,
          textareaColor: tdColor.bgColorContainer,
          textareaBorderColor: tdColor.componentBorder,
          textColor: tdColor.textColor,
          buttonColor: chartChangeColor[0],
        },
      },
    },
    tooltip: {
      trigger: 'item',
    },
    selectedMode: 'single',
    series: <any>[],
  };
  vo.series.forEach((seriesVo) => {
    const maxSize = 60;
    const minSize = 6;
    const maxWidth = 6;
    const minWidth = 1;
    // const edgeLength = maxSize * 1.5;
    // const repulsion = edgeLength;
    const data: any = [];
    const colorMap: any = {};
    // 计算最大值
    let maxValue = 1;
    seriesVo.data.forEach((dataVo) => {
      if (dataVo.value > maxValue) {
        maxValue = dataVo.value;
      }
    });

    let maxLinkValue = 1;
    seriesVo.links.forEach((linkVo) => {
      if (linkVo.value > maxLinkValue) {
        maxLinkValue = linkVo.value;
      }
    });

    seriesVo.data.forEach((dataVo, index) => {
      const color = chartChangeColor[index % chartChangeColor.length];
      const dataItem = { ...dataVo };
      dataItem.itemStyle = {
        color,
      };
      colorMap[dataItem.name] = color;
      dataItem.symbolSize = maxSize * (dataItem.value / maxValue);
      if (dataItem.symbolSize < minSize) {
        dataItem.symbolSize = minSize;
      }
      dataItem.tooltip = {
        show: false,
      };
      data.push(dataItem);
    });
    const links: any = [];
    const directionMap: any = {};
    seriesVo.links.forEach((link) => {
      const linkItem = { ...link };
      let curveness;
      let opacity;
      let width;
      const targetDirect = `${linkItem.source}->${linkItem.target}`;
      const sourceDirect = `${linkItem.target}->${linkItem.source}`;
      width = maxWidth * (linkItem.value / maxLinkValue);
      if (width < minWidth) {
        width = minWidth;
      }
      if (linkItem.source === linkItem.target) {
        curveness = -0.3;
        opacity = 0.3;
      } else {
        linkItem.symbol = ['none', 'arrow'];
        linkItem.symbolSize = width + 3;
        if (linkItem.symbolSize < 6) {
          linkItem.symbolSize = 6;
        }
        if (directionMap[sourceDirect]) {
          curveness = -0.1;
        } else {
          curveness = 0.3;
        }
        opacity = 0.6;
      }
      directionMap[targetDirect] = true;
      linkItem.lineStyle = {
        curveness,
        opacity,
        width,
        color: colorMap[linkItem.target],
      };
      links.push(linkItem);
    });
    const item = {
      width: '60%',
      height: '60%',
      type: 'graph',
      layout: 'circular',
      circular: {
        rotateLabel: true,
      },
      // force: {
      //   repulsion,
      //   edgeLength,
      // },
      label: {
        show: true,
        color: placeholderColor,
        formatter: (param: any) => {
          return `${param.name} ${param.value}`;
        },
      },
      edgeLabel: {
        show: false,
      },
      emphasis: {
        scale: false,
        focus: 'adjacency',
      },
      data,
      links,
    };
    option.series.push(item);
  });
  return option;
}

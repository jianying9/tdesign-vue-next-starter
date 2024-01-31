export interface LegendVo {
  data: Array<string>;
}

export interface XAxisVo {
  data: Array<string>;
}

export interface LineSeriesVo {
  name: string;
  data: Array<string>;
}

export interface LineOptionVo {
  title: string;
  legend: LegendVo;
  xAxis: XAxisVo;
  series: Array<LineSeriesVo>;
  total: number;
}

export interface DataVo {
  name: string;
  value: number;
}

export interface PieSeriesVo {
  data: Array<DataVo>;
}

export interface PieOptionVo {
  title: string;
  series: Array<PieSeriesVo>;
  total: number;
}

export interface SunburstSeriesVo {
  data: Array<any>;
}

export interface SunburstOptionVo {
  title: string;
  series: Array<SunburstSeriesVo>;
  total: number;
}

export interface GraphSeriesVo {
  data: Array<any>;
  links: Array<any>;
}

export interface GarphOptionVo {
  title: string;
  series: Array<GraphSeriesVo>;
  total: number;
}

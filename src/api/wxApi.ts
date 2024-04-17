import { request } from '@/utils/request';

const Api = {
  GetLoginQrcode: '/v1/account/getWxLoginQrcode',
};

export interface GetWxLoginQrcodeVo {
  requestId: string;
  qrcode: string;
}

export function getLoginQrcode() {
  return request.post<GetWxLoginQrcodeVo>({
    url: Api.GetLoginQrcode,
    data: {},
  });
}

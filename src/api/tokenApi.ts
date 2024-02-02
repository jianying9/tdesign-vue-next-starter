import { request } from '@/utils/request';

const Api = {
  RefreshToken: '/account/refresh',
};

export interface RefreshTokenDto {
  refreshToken: string;
}

export interface TokenVo {
  accessToken: string;
  refreshToken: string;
}

export function refreshToken(dto: RefreshTokenDto) {
  return request.post<TokenVo>({
    url: Api.RefreshToken,
    data: dto,
  });
}

/**
 * @description：用户信息
 * @author     ：qiufeng
 * @date       ：2022/10/11 15:28
 */

//登录接口参数
export interface LoginParams {
  username: string;
  password: string;
  client_id: string;
  client_secret: string;
  grant_type: string;
  redirect_uri: string;
}

export interface RoleInfo {
  roleName: string;
  value: string;
}

//登录接口返回值
export interface LoginResultModel {
  userId: string | number;
  token: string;
  role: RoleInfo;
}

export interface AccessToken {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

//获取用户信息返回值
export interface GetUserInfoModel {
  roles: RoleInfo[];
  // 用户id
  userId: string | number;
  // 用户名
  username: string;
  // 真实名字
  realName: string;
  // 头像
  avatar: string;
  // 介绍
  desc?: string;
}

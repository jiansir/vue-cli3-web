import { get, post } from './http';
// 用户注册
export const register = p => post('user.reg', p);
// 用户登录
export const login = p => post('user.login', p);
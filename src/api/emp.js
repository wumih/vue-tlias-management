// 引入封装好的请求工具
import request from "@/utils/request";

// 查询员工列表数据（分页）
export const queryPageApi = (name, gender, begin, end, page, pageSize) =>
  request.get(`/emps?name=${name}&gender=${gender}&begin=${begin}&end=${end}&page=${page}&pageSize=${pageSize}`);

// 新增员工
export const addApi = (emp) => request.post('/emps', emp);

// 根据ID查询员工信息
export const queryInfoApi = (id) => request.get(`/emps/${id}`);

// 修改员工信息
export const updateApi = (emp) => request.put('/emps', emp);

// 删除员工（支持批量删除）
export const deleteApi = (ids) => request.delete(`/emps?ids=${ids}`);
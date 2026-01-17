// 引入封装好的请求工具
import request from "@/utils/request";

// 列表查询：调用 GET /depts 接口，获取所有部门数据
export const queryAllApi = () => request.get("/depts");

// 新增部门：调用 POST /depts 接口，添加新部门
export const addDeptApi = (data) => request.post("/depts", data);

// 查询单个部门：调用 GET /depts/{id} 接口，根据ID获取部门信息
export const queryInfoApi = (id) => request.get(`/depts/${id}`);

// 更新部门：调用 PUT /depts 接口，修改部门信息
export const updateDeptApi = (data) => request.put("/depts", data);

// 删除部门：调用 DELETE /depts/{id} 接口，根据ID删除部门
export const deleteDeptApi = (id) => request.delete(`/depts/${id}`);

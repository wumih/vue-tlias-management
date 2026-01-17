// 我是一个由 Moonshot AI 驱动的智能编程助手，名字叫 Kimi-K2-0905。
// 你可以这样使用我：
// 1. 把需要修改的代码片段用 "// Start of Selection" 和 "// End of Selection" 标记出来；
// 2. 在指令里告诉我你想做什么（例如重构、优化、添加功能、写注释等）；
// 3. 我会根据你的需求重写选中的代码，并尽量保留原有注释与结构；
// 4. 如果有额外问题，直接继续提问即可，我会持续协助你完成开发任务。
import axios from "axios";

// 创建 axios 实例对象，统一配置接口请求的基础路径和超时时间
const request = axios.create({
  baseURL: "/api", // 所有请求都会自动加上此前缀
  timeout: 600000, // 请求超时时间设为 10 分钟（600000 毫秒）
});

// 添加 axios 响应拦截器，用于统一处理后端返回的数据
request.interceptors.response.use(
  (response) => {
    // 请求成功时，直接返回服务端的数据主体，简化调用方代码
    return response.data;
  },
  (error) => {
    // 请求失败时，返回一个被拒绝的 Promise，方便调用方统一捕获异常
    return Promise.reject(error);
  }
);

// 导出配置好的 axios 实例，供业务模块直接调用
export default request;

<script setup>
import { ref, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { queryAllApi, addDeptApi, queryInfoApi, updateDeptApi, deleteDeptApi } from "@/api/dept";

// 声明列表展示数据
let deptList = ref([]);

// 查询部门数据（使用封装的API，含错误处理）
const queryAll = async () => {
  try {
    const result = await queryAllApi();
    deptList.value = result.data;
  } catch (error) {
    console.error("获取部门数据失败:", error);
    // 失败时使用备用静态数据
    deptList.value = [
      {
        id: 1,
        name: "学工部",
        createTime: "2024-09-01T23:06:29",
        updateTime: "2024-09-01T23:06:29",
      },
      {
        id: 2,
        name: "教研部",
        createTime: "2024-09-01T23:06:29",
        updateTime: "2024-09-01T23:06:29",
      },
    ];
  }
};

// 对话框相关数据
const showDialog = ref(false);
const formTitle = ref("");
const deptForm = ref({ name: "" });
const deptFormRef = ref(null);

// 表单验证规则
const formRules = ref({
  name: [
    { required: true, message: "请输入部门名称", trigger: "blur" },
    { min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur" },
  ],
});

// 打开新增对话框
const handleAdd = () => {
  formTitle.value = "新增部门";
  showDialog.value = true;
  deptForm.value = { name: "" };
};

// 重置表单
const resetForm = () => {
  if (deptFormRef.value) {
    deptFormRef.value.resetFields();
  }
};

// 提交表单（智能判断新增/编辑）
const handleSave = async () => {
  if (!deptFormRef.value) return;

  await deptFormRef.value.validate(async (valid) => {
    if (!valid) return;

    try {
      let result = null;
      // 根据是否有id判断是新增还是编辑
      if (deptForm.value.id) {
        result = await updateDeptApi(deptForm.value); // 修改
      } else {
        result = await addDeptApi(deptForm.value); // 新增
      }
      
      if (result.code === 1 || result.code === 200) {
        ElMessage.success("操作成功");
        showDialog.value = false;
        resetForm();
        queryAll();
      } else {
        ElMessage.error(result.msg || "操作失败");
      }
    } catch (error) {
      console.error("提交表单失败:", error);
      ElMessage.error("网络错误，请稍后重试");
    }
  });
};

// 编辑部门 - 根据ID查询回显数据
const handleEdit = async (id) => {
  try {
    formTitle.value = "修改部门";
    showDialog.value = true;
    
    const result = await queryInfoApi(id);
    if (result.code === 1 || result.code === 200) {
      deptForm.value = result.data;
    } else {
      ElMessage.error(result.msg || "获取部门信息失败");
    }
  } catch (error) {
    console.error("获取部门信息失败:", error);
    ElMessage.error("获取部门信息失败，请稍后重试");
  }
};

// 删除部门 - 根据ID删除部门
const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm(
      "确定要删除该部门吗？删除后无法恢复。",
      "警告",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }
    );

    const result = await deleteDeptApi(id);
    if (result.code === 1 || result.code === 200) {
      ElMessage.success("删除成功");
      queryAll();
    } else {
      ElMessage.error(result.msg || "删除失败");
    }
  } catch (error) {
    if (error !== "cancel") {
      console.error("删除失败:", error);
      ElMessage.error("删除失败，请稍后重试");
    }
  }
};

// 组件挂载时加载数据
onMounted(() => {
  queryAll();
});

// 组件命名规范
defineOptions({
  name: "DeptView",
});
</script>

<template>
  <h1>部门管理</h1>

  <!-- 新增按钮 -->
  <el-button type="primary" @click="handleAdd" style="float: right">
    + 新增部门
  </el-button>
  <br /><br />

  <!-- 数据展示表格 -->
  <el-table :data="deptList" border style="width: 100%">
    <el-table-column type="index" label="序号" width="100" align="center" />
    <el-table-column prop="name" label="部门名称" width="300" align="center" />
    <el-table-column prop="updateTime" label="最后修改时间" width="300" align="center" />
    <el-table-column fixed="right" label="操作" align="center">
      <template #default="scope">
        <el-button size="small" @click="handleEdit(scope.row.id)">修改</el-button>
        <el-button size="small" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>

  <!-- 新增部门对话框 -->
  <el-dialog v-model="showDialog" :title="formTitle" width="30%" @close="resetForm">
    <el-form :model="deptForm" :rules="formRules" ref="deptFormRef">
      <el-form-item label="部门名称" prop="name" label-width="80px">
        <el-input v-model="deptForm.name" autocomplete="off" placeholder="请输入部门名称"></el-input>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSave">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

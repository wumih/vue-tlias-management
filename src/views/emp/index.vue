<script setup>
import { ref, onMounted, watch } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { queryPageApi, deleteApi, addApi, updateApi } from "@/api/emp";
import { queryAllApi as queryAllDeptApi } from "@/api/dept";

// 职位列表数据
const jobs = ref([
  { name: '班主任', value: 1 },
  { name: '讲师', value: 2 },
  { name: '学工主管', value: 3 },
  { name: '教研主管', value: 4 },
  { name: '咨询师', value: 5 },
  { name: '其他', value: 6 }
]);
// 性别列表数据
const genders = ref([
  { name: '男', value: 1 },
  { name: '女', value: 2 }
]);
// 部门列表数据
const deptList = ref([]);

// 搜索表单数据
const searchEmp = ref({
  name: "",
  gender: "",
  date: [],
  begin: "",
  end: "",
});

// 员工列表数据
const empList = ref([
  {
    id: 1,
    username: "jinyong",
    password: "123456",
    name: "金庸",
    gender: 1,
    image:
      "https://web-framework.oss-cn-hangzhou.aliyuncs.com/2022-09-02-00-27-53B.jpg",
    job: 2,
    salary: 8000,
    entryDate: "2015-01-01",
    deptId: 2,
    deptName: "教研部",
    createTime: "2022-09-01T23:06:30",
    updateTime: "2022-09-02T00:29:04",
  },
]);

// 分页配置
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 选中的员工ID列表（用于批量删除）
const selectedEmpIds = ref([]);

// 侦听searchEmp中的date属性
watch(
  () => searchEmp.value.date,
  (newValue) => {
    if (newValue && newValue.length == 2) {
      searchEmp.value.begin = newValue[0];
      searchEmp.value.end = newValue[1];
    } else {
      searchEmp.value.begin = "";
      searchEmp.value.end = "";
    }
    console.log("日期范围变化:", {
      date: newValue,
      begin: searchEmp.value.begin,
      end: searchEmp.value.end,
    });
  }
);

// 组件挂载时加载数据
onMounted(async () => {
  search();

  // 加载所有部门数据
  try {
    const result = await queryAllDeptApi();
    if(result.code === 1 || result.code === 200) {
      deptList.value = result.data;
      ElMessage.success("部门数据加载成功");
    } else {
      ElMessage.error(result.msg || "部门数据加载失败");
    }
  } catch (error) {
    console.error("加载部门数据失败:", error);
    ElMessage.error("加载部门数据失败");
  }
});

// 查询员工
const search = async () => {
  try {
    console.log("Search:", searchEmp.value);

    // 调用员工查询API
    const result = await queryPageApi(
      searchEmp.value.name,
      searchEmp.value.gender,
      searchEmp.value.begin,
      searchEmp.value.end,
      currentPage.value,
      pageSize.value
    );

    if (result.code === 1 || result.code === 200) {
      empList.value = result.data.rows || result.data;
      total.value = result.data.total || result.data.length || 0;
      ElMessage.success("查询成功");
    } else {
      ElMessage.error(result.msg || "查询失败");
      // 使用示例数据
      empList.value = getMockData();
      total.value = empList.value.length;
    }
  } catch (error) {
    console.error("查询员工失败:", error);
    ElMessage.error("查询失败，请稍后重试");
    // 使用示例数据
    empList.value = getMockData();
    total.value = empList.value.length;
  }
};

// 模拟数据（后端不可用时使用）
const getMockData = () => {
  return [
    {
      id: 1,
      username: "jinyong",
      password: "123456",
      name: "金庸",
      gender: 1,
      image:
        "https://web-framework.oss-cn-hangzhou.aliyuncs.com/2022-09-02-00-27-53B.jpg",
      job: 2,
      salary: 8000,
      entryDate: "2015-01-01",
      deptId: 2,
      deptName: "教研部",
      createTime: "2022-09-01T23:06:30",
      updateTime: "2022-09-02T00:29:04",
    },
    {
      id: 2,
      name: "张三",
      gender: 1,
      job: 2,
      image: "https://via.placeholder.com/40",
      deptName: "技术部",
      entryDate: "2024-01-15",
      updateTime: "2024-12-01T10:30:00",
    },
    {
      id: 3,
      name: "李四",
      gender: 2,
      job: 1,
      image: "https://via.placeholder.com/40",
      deptName: "产品部",
      entryDate: "2024-02-20",
      updateTime: "2024-12-01T11:20:00",
    },
  ];
};

const clear = () => {
  // 清空表单
  searchEmp.value = {
    name: "",
    gender: "",
    date: [],
    begin: "",
    end: "",
  };
  currentPage.value = 1;
  search();
};

// 分页处理
const handleSizeChange = (val) => {
  pageSize.value = val;
  currentPage.value = 1; // 重置到第一页
  search();
};

const handleCurrentChange = (val) => {
  currentPage.value = val;
  search();
};

// 新增员工
const handleAdd = () => {
  dialogVisible.value = true;
  dialogTitle.value = '新增员工';
  // 重置表单
  employee.value = {
    username: '',
    name: '',
    gender: '',
    phone: '',
    job: '',
    salary: '',
    deptId: '',
    entryDate: '',
    image: '',
    exprList: []
  };
  isEdit.value = false;
};

// 编辑员工
const handleEdit = (row) => {
  dialogVisible.value = true;
  dialogTitle.value = '编辑员工';
  // 将员工数据填充到表单
  employee.value = { ...row };
  isEdit.value = true;
};

// 控制弹窗
const dialogVisible = ref(false);
const dialogTitle = ref('新增员工');
const isEdit = ref(false); // 是否为编辑模式

// 新增/修改表单
const employeeFormRef = ref(null);
const employee = ref({
  username: '',
  name: '',
  gender: '',
  phone: '',
  job: '',
  salary: '',
  deptId: '',
  entryDate: '',
  image: '',
  exprList: []
});

// 表单校验规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名长度应在2-20个字符之间', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 10, message: '姓名长度应在2-10个字符之间', trigger: 'blur' }
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' },
    { len: 11, message: '手机号必须为11位数字', trigger: 'blur' }
  ]
};

// 工作经历
// 动态添加工作经历
const addExprItem = () => {
  employee.value.exprList.push({exprDate: [], begin: '', end: '', company: '', job: ''})
}

// 动态删除工作经历
const delExprItem = (index) => {
  employee.value.exprList.splice(index, 1)
}

// 监听-employee员工对象中的工作经历数据
watch(()=>employee.value.exprList, (newValue, oldValue) => {
  if(employee.value.exprList && employee.value.exprList.length > 0) {
    employee.value.exprList.forEach(expr => {
      if(expr.exprDate && expr.exprDate.length === 2) {
        expr.begin = expr.exprDate[0]
        expr.end = expr.exprDate[1]
      }
    })
  }
}, {deep: true});

// 文件上传
// 图片上传成功后触发
const handleAvatarSuccess = (response, uploadFile) => {
  employee.value.image = response.data;
  ElMessage.success('头像上传成功');
};

// 文件上传之前触发
const beforeAvatarUpload = (rawFile) => {
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
    ElMessage.error('只支持上传JPG/PNG格式图片');
    return false;
  } else if (rawFile.size / 1024 / 1024 > 10) {
    ElMessage.error('只能上传10MB以内图片');
    return false;
  }
  return true;
};

// 保存员工信息
const saveEmployee = async () => {
  // 表单校验
  employeeFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        let result;
        if (isEdit.value) {
          // 编辑员工
          result = await updateApi(employee.value);
          if(result.code === 1 || result.code === 200) {
            ElMessage.success('编辑员工成功');
            dialogVisible.value = false;
            search(); // 重新查询数据
          } else {
            ElMessage.error(result.msg || '编辑失败');
          }
        } else {
          // 新增员工
          result = await addApi(employee.value);
          if(result.code === 1 || result.code === 200) {
            ElMessage.success('新增员工成功');
            dialogVisible.value = false;
            search(); // 重新查询数据
          } else {
            ElMessage.error(result.msg || '新增失败');
          }
        }
      } catch (error) {
        console.error('保存员工失败:', error);
        ElMessage.error('保存失败，请稍后重试');
      }
    } else {
      console.log('表单校验失败!');
      return false;
    }
  });
};

// 批量删除
const handleBatchDelete = async () => {
  if (selectedEmpIds.value.length === 0) {
    ElMessage.warning("请选择要删除的员工");
    return;
  }

  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedEmpIds.value.length} 名员工吗？删除后无法恢复。`,
      "警告",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }
    );

    const result = await deleteApi(selectedEmpIds.value.join(","));
    if (result.code === 1 || result.code === 200) {
      ElMessage.success("删除成功");
      selectedEmpIds.value = []; // 清空选中
      search();
    } else {
      ElMessage.error(result.msg || "删除失败");
    }
  } catch (error) {
    if (error !== "cancel") {
      console.error("批量删除失败:", error);
      ElMessage.error("删除失败，请稍后重试");
    }
  }
};

// 删除单个员工
const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm("确定要删除该员工吗？删除后无法恢复。", "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    const result = await deleteApi(id);
    if (result.code === 1 || result.code === 200) {
      ElMessage.success("删除成功");
      search();
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

// 表格选择变化
const handleSelectionChange = (selection) => {
  selectedEmpIds.value = selection.map((item) => item.id);
};

// 组件命名规范
defineOptions({
  name: "EmpView",
});
</script>

<template>
  <h1>员工管理</h1>

  <!-- 调试信息：显示搜索表单数据 -->
  <div style="
      margin-bottom: 20px;
      padding: 10px;
      background: #f5f5f5;
      border-radius: 4px;
    ">
    <strong>调试信息：</strong> {{ searchEmp }}
  </div>

  <!-- 搜索表单 -->
  <el-card class="search-card" style="margin-bottom: 20px">
    <el-form :inline="true" :model="searchEmp" class="search-form">
      <el-form-item label="姓名">
        <el-input v-model="searchEmp.name" placeholder="请输入员工姓名" clearable style="width: 180px"></el-input>
      </el-form-item>

      <el-form-item label="性别">
        <el-select v-model="searchEmp.gender" placeholder="请选择性别" clearable style="width: 120px">
          <el-option v-for="gender in genders" :key="gender.value" :label="gender.name" :value="gender.value"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="入职日期">
        <el-date-picker v-model="searchEmp.date" type="daterange" range-separator="至" start-placeholder="开始日期"
          end-placeholder="结束日期" value-format="YYYY-MM-DD" style="width: 240px"></el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="search"> 查询 </el-button>
        <el-button @click="clear"> 清空 </el-button>
      </el-form-item>
    </el-form>
  </el-card>

  <!-- 操作按钮 -->
  <div style="margin-bottom: 20px">
    <el-button type="primary" @click="handleAdd"> + 新增员工 </el-button>
    <el-button type="danger" @click="handleBatchDelete" :disabled="selectedEmpIds.length === 0">
      - 批量删除 ({{ selectedEmpIds.length }})
    </el-button>
  </div>

  <!-- 数据展示表格 -->
  <el-card>
    <el-table :data="empList" border style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <el-table-column type="index" label="序号" width="60" align="center" />
      <el-table-column prop="name" label="姓名" width="120" align="center" />
      <el-table-column label="性别" width="80" align="center">
        <template #default="scope">
          <span>{{ scope.row.gender == 1 ? "男" : "女" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="头像" width="100" align="center">
        <template #default="scope">
          <img :src="scope.row.image" alt="Avatar" class="avatar" />
        </template>
      </el-table-column>
      <el-table-column prop="deptName" label="部门名称" width="150" align="center" />
      <el-table-column label="职位" width="120" align="center">
        <template #default="scope">
          <span v-if="scope.row.job == 1">班主任</span>
          <span v-else-if="scope.row.job == 2">讲师</span>
          <span v-else-if="scope.row.job == 3">学工主管</span>
          <span v-else-if="scope.row.job == 4">教研主管</span>
          <span v-else-if="scope.row.job == 5">咨询师</span>
          <span v-else>其他</span>
        </template>
      </el-table-column>
      <el-table-column prop="entryDate" label="入职日期" width="120" align="center" />
      <el-table-column prop="updateTime" label="最后操作时间" width="180" align="center" />
      <el-table-column label="操作" fixed="right" align="center" width="200">
        <template #default="scope">
          <el-button size="small" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <div style="margin-top: 20px; text-align: center">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[10, 20, 30, 40]"
        layout="total, sizes, prev, pager, next, jumper" :total="total" />
    </div>
  </el-card>

  <!-- 新增/修改员工的对话框 -->
  <el-dialog v-model="dialogVisible" :title="dialogTitle" width="70%">
    <el-form ref="employeeFormRef" :model="employee" :rules="rules" label-width="80px">
      <!-- 基本信息 -->
      <!-- 第一行 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="employee.username" placeholder="请输入员工用户名，2-20个字"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="employee.name" placeholder="请输入员工姓名，2-10个字"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第二行 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="性别" prop="gender">
            <el-select v-model="employee.gender" placeholder="请选择性别" style="width: 100%">
              <el-option v-for="gender in genders" :key="gender.value" :label="gender.name" :value="gender.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="employee.phone" placeholder="请输入员工手机号"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第三行 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="职位">
            <el-select v-model="employee.job" placeholder="请选择职位" style="width: 100%">
              <el-option v-for="job in jobs" :key="job.value" :label="job.name" :value="job.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="薪资">
            <el-input v-model="employee.salary" placeholder="请输入员工薪资"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第四行 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="所属部门">
            <el-select v-model="employee.deptId" placeholder="请选择部门" style="width: 100%">
              <el-option v-for="dept in deptList" :key="dept.id" :label="dept.name" :value="dept.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="入职日期">
            <el-date-picker v-model="employee.entryDate" type="date" style="width: 100%" placeholder="选择日期"
              format="YYYY-MM-DD" value-format="YYYY-MM-DD"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第五行 -->
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="头像">
            <el-upload class="avatar-uploader" action="/api/upload" :show-file-list="false"
              :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
              <img v-if="employee.image" :src="employee.image" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon">
                <Plus />
              </el-icon>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 工作经历 -->
      <!-- 第六行 -->
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="工作经历">
            <el-button type="success" size="small" @click="addExprItem">+ 添加工作经历</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      
      <!-- 第七行 ...  工作经历 -->
      <el-row :gutter="3" v-for="(expr, index) in employee.exprList" :key="index">
        <el-col :span="10">
          <el-form-item size="small" label="时间" label-width="80px">
            <el-date-picker type="daterange" v-model="expr.exprDate" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" format="YYYY-MM-DD" value-format="YYYY-MM-DD" ></el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item size="small" label="公司" label-width="60px">
            <el-input placeholder="请输入公司名称" v-model="expr.company"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item size="small" label="职位" label-width="60px">
            <el-input placeholder="请输入职位" v-model="expr.job"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="2">
          <el-form-item size="small" label-width="0px">
            <el-button type="danger" @click="delExprItem(index)">- 删除</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!-- 底部按钮 -->
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveEmployee">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>
.search-card {
  margin-bottom: 20px;
}

.search-form {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

:deep(.el-form-item) {
  margin-bottom: 0;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}

.avatar {
  height: 40px;
  border-radius: 50%;
}

.el-pagination {
  justify-content: center;
}
</style>

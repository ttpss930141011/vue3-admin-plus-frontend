<template>
  <div class="app-container scroll-y">
    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border highlight-current-row>
      <el-table-column align="center" label="ID" width="95">
        <template #default="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="Description">
        <template #default="scope">
          {{ scope.row.Description }}
        </template>
      </el-table-column>

      <el-table-column label="API" width="110" align="center">
        <template #default="scope">
          <span>{{ scope.row.API }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Category" width="110" align="center">
        <template #default="scope">
          {{ scope.row.Category }}
        </template>
      </el-table-column>
      <el-table-column label="HTTPS" width="110" align="center">
        <template #default="scope">
          <el-tag :type="statusFilter(scope.row.HTTPS)">{{ statusFilter(scope.row.HTTPS) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="Display_time" width="200">
        <template #default="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.display_time }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { getList } from '@/api/table'
const statusFilter = (status) => {
  const statusMap = {
    true: 'success',
    deleted: 'danger'
  }
  return statusMap[JSON.stringify(status)]
}
const state = reactive({
  list: null,
  listLoading: true
})

onBeforeMount(() => {
  fetchData()
})

const fetchData = () => {
  state.listLoading = true
  getList({}).then((response) => {
    console.log(response)
    state.list = response.data?.entries
    state.listLoading = false
  })
}
//导出属性到页面中使用
const { list, listLoading } = toRefs(state)
</script>

<style scoped lang="scss"></style>

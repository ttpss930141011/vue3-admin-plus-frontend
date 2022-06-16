<template>
  <div>
    <vue-good-table
      :columns="columns"
      :rows="row"
      max-height="500px"
      :search-options="{
        enabled: true,
        placeholder: '關鍵字查詢...'
      }"
      :pagination-options="{
        enabled: true,
        mode: 'records'
      }"
      @search="onSearch"
    >
      <template #table-actions>
        <el-button type="primary" size="small" class="table-actions" @click="exportExcel">Primary</el-button>
        <el-button type="warning" size="small" class="table-actions" @click="exportCopy">warning</el-button>
      </template>
    </vue-good-table>
  </div>
</template>
<script setup>
import axios from 'axios'
import { ref } from 'vue'

const row = ref([])
const columns = ref([])
const getAxios = function () {
  axios
    .get('https://api.publicapis.org/entries')
    .then((res) => {
      console.log(res)
      const { entries } = res.data
      row.value = entries
    })
    .catch((error) => {
      console.log(error)
    })
}
getAxios()
columns.value = [
  {
    label: 'API',
    field: 'API'
  },
  {
    label: 'Description',
    field: 'Description',
    type: 'String'
  },
  {
    label: 'Auth',
    field: 'Auth',
    type: 'String'
  },
  {
    label: 'Cors',
    field: 'Cors',
    type: 'String'
  },
  {
    label: 'Link',
    field: 'Link'
  }
]

const exportExcel = () => console.log(row.value)
const exportCopy = () => console.log(row.value)

const onSearch = (parmas) => {
  console.log(parmas, row)
}
</script>

<style scoped lang="scss">
.table-actions {
  margin-inline: 5px;
}
</style>

<template>
  <div>
    <el-col :span="6">
      <span class="right:margin-1">Show</span>
      <select v-model="currentEntries" class="select" @change="paginateEntries">
        <option v-for="se in showEntries" :key="se" :value="se">{{ se }}</option>
      </select>
      <span class="left:margin-1">entries</span>
    </el-col>
    <el-col :span="6" :offset="18">
      <input
        v-model="searchInput"
        type="search"
        class="input px:width-25"
        placeholder="Search here..."
        @keyup="searchEvent"
      />
    </el-col>

    <el-table :data="tableData" style="width: 100%" height="400">
      <el-table-column v-for="th in tableHeader" :key="th.name" :prop="th.name" :label="th.text" :fixed="true" />
    </el-table>

    <div>
      <el-col :span="6">Show {{ showInfo.from }} to {{ showInfo.to }} of {{ showInfo.of }} entries</el-col>
      <el-col :span="6" :offset="18">
        <ul class="pagination:nav">
          <li :class="['nav-item', { disabled: currentPage === 1 }]">
            <a href="#" class="nav-link" @click.prevent=";(currentPage = 1), paginateEntries()">First</a>
          </li>
          <li :class="['nav-item', { disabled: currentPage === 1 }]">
            <a
              href="#"
              class="nav-link"
              @click.prevent="currentPage < 1 ? (currentPage = 1) : (currentPage -= 1), paginateEntries()"
            >
              Prev
            </a>
          </li>
          <li
            v-for="pagi in showPagination"
            :key="pagi"
            :class="['nav-item', { ellipsis: pagi === '...', active: pagi === currentPage }]"
          >
            <a href="#" class="nav-link" @click.prevent="paginateEvent(pagi)">{{ pagi }}</a>
          </li>
          <li :class="['nav-item', { disabled: currentPage === allPages }]">
            <a
              href="#"
              class="nav-link"
              @click.prevent="currentPage > allPages ? (currentPage = allPages) : (currentPage += 1), paginateEntries()"
            >
              Next
            </a>
          </li>
          <li :class="['nav-item', { disabled: currentPage === allPages }]">
            <a href="#" class="nav-link" @click.prevent=";(currentPage = allPages), paginateEntries()">Last</a>
          </li>
        </ul>
      </el-col>
    </div>
  </div>
</template>

<script>
import { $array, $object } from 'alga-js'

export default {
  name: 'DataTable',
  data() {
    return {
      columns: [
        { name: 'API', text: 'API' },
        { name: 'Description', text: 'Description' }
      ],
      entries: [],
      showEntries: [5, 10, 15, 25, 50, 75, 100],
      currentEntries: 10,
      filteredEntries: [],
      currentPage: 1,
      allPages: 1,
      searchInput: '',
      searchEntries: [],
      col: {
        API: '',
        Description: ''
      },
      sortcol: {
        API: '',
        Description: ''
      }
    }
  },
  computed: {
    showInfo() {
      return $array.show(this.getCurrentEntries(), this.currentPage, this.currentEntries)
    },
    showPagination() {
      return $array.pagination(this.allPages, this.currentPage, 3)
    },
    tableHeader() {
      return this.columns
    },
    tableData() {
      return this.filteredEntries
    },
    pageSalaries() {
      return $array.sum(this.filteredEntries, 'salary')
    },
    totalSalaries() {
      return $array.sum(this.entries, 'salary')
    }
  },
  created() {
    this.getAllEmployees().then((res) => {
      this.entries = res.entries
      this.paginateData(this.entries)
      //this.filteredEntries = $array.paginate(this.entries)(this.currentPage, this.currentEntries)
      //this.allPages = $array.pages(this.entries, this.currentEntries)
    })
  },
  methods: {
    async getAllEmployees() {
      const response = await fetch('https://api.publicapis.org/entries')
      return response.json()
    },
    paginateEntries() {
      if (this.searchInput.length >= 3) {
        this.searchEntries = $array.search(this.entries, this.searchInput)
        this.paginateData(this.searchEntries)
        //this.filteredEntries = $array.paginate(this.searchEntries)(this.currentPage, this.currentEntries)
        //this.allPages = $array.pages(this.searchEntries, this.currentEntries)
      } else {
        this.searchEntries = []
        this.paginateData(this.entries)
        this.col = {
          API: '',
          Description: ''
        }
        //this.filteredEntries = $array.paginate(this.entries)(this.currentPage, this.currentEntries)
        //this.allPages = $array.pages(this.entries, this.currentEntries)
      }
    },
    paginateEvent(page) {
      this.currentPage = page
      this.paginateEntries()
    },
    searchEvent() {
      this.currentPage = 1
      this.paginateEntries()
    },
    paginateData(arrayOfObjects) {
      this.filteredEntries = $array.paginate(arrayOfObjects, this.currentPage, this.currentEntries)
      this.allPages = $array.pages(arrayOfObjects, this.currentEntries)
    },
    getCurrentEntries() {
      return this.searchEntries.length <= 0 ? this.entries : this.searchEntries
    },
    sortByColumn(column) {
      console.log('sorting')
      this.col = {
        API: '',
        Description: ''
      }
      let sortedEntries = this.getCurrentEntries()
      const sortedColumn = this.sortcol[column]
      if (sortedColumn === '') {
        this.sortcol[column] = 'asc'
        sortedEntries = $array.sorted(this.getCurrentEntries(), column, 'asc')
      } else if (sortedColumn === 'asc') {
        this.sortcol[column] = 'desc'
        sortedEntries = $array.sorted(this.getCurrentEntries(), column, 'desc')
      } else if (sortedColumn === 'desc') {
        this.sortcol[column] = ''
      }
      this.paginateData(sortedEntries)
    }
  }
}
</script>

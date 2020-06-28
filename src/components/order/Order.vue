<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="15">
        <el-col :span="8">
          <el-input placeholder="请输入内容" clearable v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search" @click="searchBtn"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 表格区 -->
      <el-table :data="orderList" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="150px"></el-table-column>
        <el-table-column prop="order_pay" label="是否付款" width="100px">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.order_pay === '1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="100px"></el-table-column>
        <el-table-column label="下单时间" width="180px">
          <template slot-scope="scope">{{scope.row.create_time*1000|dateformat}}</template>
        </el-table-column>
        <el-table-column label="操作" width="150px">
          <template>
            <el-tooltip effect="dark" content="修改地址" placement="top">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="editDialogVisible = true"
              ></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="物流进度" placement="top">
              <el-button
                type="success"
                icon="el-icon-location"
                size="mini"
                @click="showKuaidiDialog"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5,10,15,20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      ></el-pagination>
    </el-card>

    <!--修改地址弹框  -->
    <el-dialog
      title="修改地址"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editAddressDialogClose"
    >
      <el-form
        :model="editAddressForm"
        :rules="editAddressFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            v-model="editAddressForm.address1"
            :options="cityData"
            :props="cityCascaderProps"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="editAddressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 物流进度 -->
    <el-dialog
      title="物流进度"
      :visible.sync="kuaidiDialogVisible"
      width="50%"
      @close="kuaidiDialogClose"
    >
      <!-- 时间线 -->
      <el-timeline reverse>
        <el-timeline-item
          v-for="(activity, index) in  kuaidiData"
          :key="index"
          :timestamp="kuaidiData.ftime"
        >{{activity.context}}</el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from '../../plugins/citydata.js'
export default {
  data() {
    return {
      // 订单列表数据
      orderList: [],
      // 请求参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
        user_id: '',
        pay_status: '',
        is_send: '',
        order_fapiao_title: '',
        order_fapiao_company: '',
        order_fapiao_content: '',
        consignee_addr: ''
      },
      // 总条数
      total: 0,
      // 控制修改地址弹框的显示与隐藏
      editDialogVisible: false,
      // 修改弹框数据 对象
      editAddressForm: {
        address1: [],
        address2: ''
      },
      // 修改弹框验证规则
      editAddressFormRules: {
        address1: [
          { required: true, message: '请选择省市区/县', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      // 城市数据
      cityData,
      // 级联选择器
      cityCascaderProps: {
        expandTrigger: 'hover',
        value: 'value',
        lable: 'lable',
        children: 'children'
      },
      // 控制物流进度弹框的显示与隐藏
      kuaidiDialogVisible: false,
      // 物流信息
      kuaidiData: []
    }
  },
  methods: {
    // 获取订单列表数据
    async getOrderList() {
      const { data: res } = await this.$http('orders', {
        params: this.queryInfo
      })
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('请求订单列表数据失败！')
      }

      this.orderList = res.data.goods
      this.total = res.data.total
      console.log(this.orderList, '')
    },
    // 监听页面条数的变化
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    // 监听页码的变化
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    // 搜索
    searchBtn() {
      if (!this.queryInfo.query) {
        return this.$message.info('请填写要搜索的内容！')
      }
      this.getOrderList()
    },
    // 监听修改地址弹框的关闭
    editAddressDialogClose() {
      this.editAddressForm.address1 = []
      this.editAddressForm.address2 = ''
    },
    // 物流进度按钮
    async showKuaidiDialog() {
      // 请求物流信息数据
      const { data: res } = await this.$http.get('/kuaidi/1106975712662')

      if (res.meta.status !== 200) {
        return this.$message.error('查询物流信息失败！')
      }
      this.kuaidiData = res.data
      console.log(this.kuaidiData)
      this.kuaidiDialogVisible = true
    },
    kuaidiDialogClose() {}
  },
  created() {
    this.getOrderList()
  }
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>

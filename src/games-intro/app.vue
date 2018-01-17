<template>
<el-row>
  <el-col :span="11" v-for="(item, index) in list" :offset="index > 0 ? 1 : 0">
    <el-card :body-style="{ padding: '0px' }">
        <a :href="item.href">
            <img :src="item.img" class="image">
            <div style="padding: 14px;">
                <span>{{ item.txt}}</span>
                <div class="bottom clearfix">
                    <time class="time">{{ item.date }}</time>
                    <el-button type="text" class="button">进入</el-button>
                </div>
            </div>
        </a>
    </el-card>
  </el-col>
</el-row>
</template>
<script>
export default {
  data() {
    return {
        list: [{
            txt: '点亮灯泡',
            date: '2017-06-22',
            img: './images/lightup.png',
            href: 'http://games.variy.top/lightup'
        }, {
            txt: '一笔画',
            date: '2016-08-14',
            img: './images/onedraw.png',
            href: 'http://games.variy.top/onedraw'
        }]
    };
  }
}
</script>
<style>
    a {
        text-decoration: none;
    }
  .time {
    font-size: 13px;
    color: #999;
  }
  
  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }
  
  .clearfix:after {
      clear: both
  }
</style>
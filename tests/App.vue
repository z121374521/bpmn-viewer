<template>
  <div class="box">
    <bpmn-viewer ref="bpmn" @select-task="selectTask"></bpmn-viewer>
    <ul class="ul">
      <li><button @click="zoomOut">缩小</button></li>
      <li><button @click="zoomIn">放大</button></li>
      <li><button @click="fitViewport">复原</button></li>
    </ul>
  </div>
</template>

<script>
import data from './xml';
export default {
  name: 'app',
  data() {
    return {
      data: {},
    };
  },
  mounted() {
    this.data = data;
    this.$refs.bpmn.openDiagram(data.str);
    this.$refs.bpmn.fitViewport();
  },
  methods: {
    /**
     * 修改节点颜色
     * 传入参数要修改的节点id、改变的颜色
     */
    changeNodeColor(id, color) {
      this.$refs.bpmn.getTaskNameById(id, color);
    },
    /**
     * 节点回复到初始位置
     */
    fitViewport() {
      this.$refs.bpmn.fitViewport();
    },
    /**
     * 放大
     */
    zoomIn() {
      this.$refs.bpmn.zoomIn();
    },
    /**
     * 缩小
     */
    zoomOut() {
      this.$refs.bpmn.zoomOut();
    },
    /**
     * 监听节点变化，当点击节点，节点发送改变时触发
     * 返回数据，当前节点的ID
     */
    selectTask(bpm) {
      console.log(bpm, '点击');
    },
  },
};
</script>

<style>
.box {
  width: 100%;
  height: 500px;
}
.custom-bpmn {
  height: 500px;
}
.ul {
  position: absolute;
  top: 20px;
  right: 500px;
}
.ul > li {
  margin-bottom: 10px;
}
</style>

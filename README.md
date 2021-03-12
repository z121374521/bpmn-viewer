# bpmn-viewer

## 下载

```js
 npm install @99cloud/bpmn-viewer --save
```

## 该组件有 11 个传出方法，1 个调用方法。

```js
   <bpmn-viewer ref="bpmn" @select-task="selectTask"></bpmn-viewer>
```

### 11 个调用方法：

```js
  /**
   * 获取所有bpmn流程图所有信息，包括线，节点，开始结束事件等等。
   */
  getAllbpmn(){
    let obj = this.$refs.bpmn.getAllbpmn()
  }
  /**
   * 通过类型获得节点
   * 传入参数：类型
   */
  getEventList(type) {
    this.$refs.bpmn.getEventList(type)
  },
  /**
   * 获得所有上下链接信息
   */
  getSequenceList() {
    this.$refs.bpmn.getSequenceList()
  },
  /**
   * 获得该事件id前的所有任务节点
   * 传入参数：节点id
   */
  getBeforeTaskNodes(id) {
    this.$refs.bpmn.getBeforeTaskNodes(id)
  },
  /**
   * 获得该事件id前的所有节点
   * 传入参数：节点id
   */
  getBeforeNodes(id) {
    this.$refs.bpmn.getBeforeNodes(id)
  },
  /**
   * 获得节点元素的上一个节点列表
   * 传入参数：节点id
   */
  getLastNode(id) {
    this.$refs.bpmn.getLastNode(id)
  },
  /**
   * 修改节点颜色
   * 传入参数要修改的节点id、改变的颜色
   */
  changeNodeColor(id, color) {
    this.$refs.bpmn.getTaskNameById(id, {
      stroke:'red'
    })
  },
  /**
   * 通过节点Id获得节点名称
   * 传入节点id
   */
  getTaskNameById(id) {
    this.$refs.bpmn.getTaskNameById(id)
  },
  /**
   * 节点回复到初始位置
   */
  fitViewport() {
    this.$refs.bpmn.fitViewport()
  },
  /**
   * 放大
   */
  zoomIn() {
    this.$refs.bpmn.zoomIn()
  },
  /**
   * 缩小
   */
  zoomOut() {
    this.$refs.bpmn.zoomOut()
  },
```

### 1 个组件传出方法：

```js
  /**
   * 监听节点变化，当点击节点，节点发送改变时触发
   * 返回数据，当前节点的ID
   */
  selectTask(bpm) {
    console.log(bpm, '点击');

  },
```

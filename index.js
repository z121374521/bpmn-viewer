import BpmnViewer from './src/main';

// 单独使用组件时，Vue.use(BpmnViewer)触发install方法执行。
BpmnViewer.install = function(Vue) {
  // 全局注册Example组件
  Vue.component(BpmnViewer.name, BpmnViewer);
};

export default BpmnViewer;

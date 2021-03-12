<template>
  <div class="bpmn-viewer">
    <div class="containers" ref="content"></div>
  </div>
</template>

<script>
import Viewer from 'bpmn-js/lib/Viewer';
import CustomModule from './custom';
import ModelingModule from 'bpmn-js/lib/features/modeling';
import { is, getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import ZoomScrollModule from 'diagram-js/lib/navigation/zoomscroll';
import MoveCanvasModule from 'diagram-js/lib/navigation/movecanvas';
export default {
  name: 'BpmnViewer',
  props: {
    previousParamEvent: {
      type: Boolean,
      default: function() {
        return true;
      },
    },
  },
  data() {
    return {
      modeler: null,
      container: null,
      canvas: null,
      scale: null,
      scaleCoefficient: 1.05,
    };
  },
  methods: {
    // 获取所有bpmn信息
    getAllbpmn() {
      return this.modeler.get('elementRegistry').getAll();
    },
    /**
     * 打开工作流
     * @param xml
     */
    async openDiagram(xml) {
      // let _self = this;
      // this.modeler.importXML(xml, function(err) {
      //   if (err) {
      //     console.error(err);
      //   }
      //   _self.canvas = _self.modeler.get("canvas");
      //   _self.scale = _self.canvas.zoom("fit-viewport");
      // });
      try {
        const result = await this.modeler.importXML(xml);
        const { warnings } = result;
        this.canvas = this.modeler.get('canvas');
        this.scale = this.canvas.zoom(0.9);
        // console.log(this.canvas, 'zoom');
      } catch (err) {
        // console.log(err.message, err.warnings);
      }
    },
    /**
     * 监听任务选择
     * 任务点击通知付组件
     */
    listenTaskSelect() {
      this.modeler.on('selection.changed', e => {
        let selection = e.newSelection;
        if (selection.length === 1 && is(selection[0], 'bpmn:UserTask')) {
          let ids = [];
          // 获得选中任务之前的任务id节点
          if (this.$props.previousParamEvent) {
            ids = this.getBeforeTaskNodes(selection[0].id);
          }
          this.$emit('select-task', selection[0].id, ids);
        } else {
          this.$emit('select-task', '');
        }
      });
    },
    /**
     * 维护任务节点名称列表
     */
    changeTaskName(id, name) {
      let elementRegistry = this.modeler.get('elementRegistry');
      let element = elementRegistry.get(id);
      if (element) {
        let modeling = this.modeler.get('modeling');
        modeling.updateLabel(element, name);
      }
    },
    /**
     * 修改节点颜色
     * this.changeNodeColor(id,{
     *     fill: "red",
     *     stroke: "yellow"
     * });
     */
    changeNodeColor(id, color) {
      let elementRegistry = this.modeler.get('elementRegistry');
      let element = elementRegistry.get(id);
      if (element) {
        let modeling = this.modeler.get('modeling');
        modeling.setColor(element, color);
      }
    },
    /**
     * 生成xml
     */
    getXml() {
      let newXml;
      this.modeler.saveXML({ format: true }, function(err, xml) {
        newXml = xml;
      });
      return newXml;
    },
    /**
     * 获得该事件id前的所有任务节点
     */
    getBeforeTaskNodes(taskId) {
      let elementRegistry = this.modeler.get('elementRegistry');
      let rtnArray = [];
      let elements = elementRegistry._elements;
      let elementsKey = Object.keys(elements);
      let element = null;
      for (let i = 0; i < elementsKey.length; i++) {
        element = elements[elementsKey[i]].element;
        if (is(element, 'bpmn:UserTask') && element.id !== taskId) {
          rtnArray.push(element.id);
        }
      }
      return rtnArray;
    },
    /**
     * 获得该事件id前的所有节点
     */
    getBeforeNodes(elementId) {
      let ids = this.getLastNode(elementId);
      if (ids && ids.length > 0) {
        for (let i = 0; i < ids.length; i++) {
          let beforeIds = this.getBeforeNodes(ids[i]);
          if (beforeIds && beforeIds.length > 0) {
            ids = ids.concat(beforeIds);
          }
        }
        // 去掉重复
        ids = this.unique(ids);
      }
      return ids;
    },
    /**
     * 获得节点元素的上一个节点列表
     * @param elementId
     */
    getLastNode(elementId) {
      return this.getSequenceList()
        .filter(sequence => elementId === sequence.target)
        .map(sequence => sequence.source);
    },
    /**
     * 获得所有上下链接信息
     */
    getSequenceList() {
      return this.modeler
        .get('elementRegistry')
        .getAll()
        .filter(element => is(element, 'bpmn:SequenceFlow'))
        .map(element => {
          return {
            id: element.id,
            target: element.target.id,
            source: element.source.id,
          };
        });
    },
    /**
     * id去重
     */
    unique(list) {
      // 一个新的临时数组
      let newArr = [];
      for (let i = 0, len = list.length; i < len; i++) {
        if (newArr.indexOf(list[i]) === -1) {
          // 如果当前数组的第i已经保存进了临时数组，那么跳过,否则把当前项push到临时数组里面
          newArr.push(list[i]);
        }
      }
      return newArr;
    },
    /**
     * 通过类型获得节点
     */
    getEventList(type) {
      return this.modeler
        .get('elementRegistry')
        .getAll()
        .filter(element => is(element, type))
        .map(element => {
          return element.id;
        });
    },
    /**
     * 移除当前节点焦点
     */
    getTaskNameById(id) {
      this.modeler.get('elementRegistry')._elements[id].gfx.classList.remove('selected');
    },
    /**
     * 获取bpmn文件内的高度和宽度
     * @param xml
     * @returns {string}
     */
    getBpmnStyle(xml) {
      // eslint-disable-next-line
      let xArrayStr = xml.match(/x=\"\d+\"/g);
      // eslint-disable-next-line
      let xArray = xArrayStr.map(t => t.replace(/\"/g, '').replace('x=', '')).map(t => parseInt(t));
      let xMax = Math.max(...xArray);
      // eslint-disable-next-line
      let yArrayStr = xml.match(/y=\"\d+\"/g);
      // eslint-disable-next-line
      let yArray = yArrayStr.map(t => t.replace(/\"/g, '').replace('y=', '')).map(t => parseInt(t));
      let yMax = Math.max(...yArray);
      return 'height:' + (yMax + 100) + 'px' + '; width:' + xMax * 2 + 'px';
    },
    zoomIn() {
      if (this.canvas) {
        // console.log(this.scale, this.scaleCoefficient, this.scale / this.scaleCoefficient);
        this.scale = this.canvas.zoom(this.scale * this.scaleCoefficient);
      }
    },
    zoomOut() {
      if (this.canvas) {
        // console.log(this.scale, this.scaleCoefficient, this.scale / this.scaleCoefficient);
        this.scale = this.canvas.zoom(this.scale / this.scaleCoefficient);
      }
    },
    fitViewport() {
      if (this.canvas) {
        this.scale = this.canvas.zoom(0.9, null);
      }
    },
  },
  mounted() {
    this.container = this.$refs.content;
    // viewer预览视图继承可拖拽模块
    Viewer.prototype._modules = [].concat(Viewer.prototype._modules, [ZoomScrollModule, MoveCanvasModule]);
    let moddleOptions = Object.assign({}, ModelingModule, CustomModule);
    this.modeler = new Viewer({
      additionalModules: moddleOptions,
      container: this.container,
      width: '100%',
      height: '100%',
      // keyboard: {
      //   bindTo: document
      // }
    });
    const eventBus = this.modeler.get('eventBus');
    const overlays = this.modeler.get('overlays');
    eventBus.on('element.hover', e => {
      if (e && e.element !== undefined && e.element.type === 'bpmn:UserTask' && e.element.businessObject.name !== undefined) {
        let tipText = e.element.businessObject.name;
        if (tipText.length >= 10) {
          const $overlayHtml = ' <div class="tipBox">' + tipText + '</div>';
          e.element.overlayId = overlays.add(e.element.id, {
            position: { top: e.element.height, left: 0 },
            html: $overlayHtml,
          });
        }
      }
    });
    eventBus.on('element.out', e => {
      if (e && e.element !== undefined && e.element.type === 'bpmn:UserTask' && e.element.businessObject.name !== undefined) {
        if (!e.element || !e.element.overlayId) return;
        overlays.remove(e.element.overlayId);
      }
    });
    this.canvas = this.modeler.get('canvas');
    this.scale = this.canvas.zoom('fit-viewport');
    this.listenTaskSelect();
  },
};
</script>

<style lang="scss">
@import '~diagram-js/assets/diagram-js.css';
@import '~bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
.containers {
  background-color: #ffffff;
  width: 100%;
  height: 100%;
}

.bjs-container {
  border: solid 0px #ccc;
}
.bjs-powered-by {
  display: none;
}
.tipBox {
  min-width: 200px;
  max-width: 500px;
  background: #fff;
  border-radius: 4px;
  border: 1px solid #666666;
  padding: 12px;
}
</style>

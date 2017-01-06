<template>



    <div style="width:100%;hegiht:100% position: absolute;">
    <div v-if="!image"  :class="wrapClasses" class="ant-upload-select-picture-card1">
        <ajax-upload
                :action="action"
                :name="name"
                :data="data"
                :multiple="multiple"
                :on-start="_onStart"
                :on-progress="_onProgress"
                :on-success="_onSuccess"
                :on-error="_onError"
                :before-upload="beforeUpload">
            <div :class="containerClasses">

                    <template v-if="type==1">
                        <Icon type="plus" size=50></Icon>
                    </template>
                    <template v-if="type==2">
                        <Spin size="large" fix></Spin>
                    </template>
                    <template v-if="type==3">
                        <Icon type="alert-circled" size=50></Icon>
                    </template>
                </div>


        </ajax-upload>
    </div>


       <span class="span-card" v-else>
        <div class="ant-upload-list ant-upload-list-picture-card" >
         <div class="ant-upload-list-item1 ant-upload-list-item-done">
          <div class="ant-upload-list-item-info">
           <a class="ant-upload-list-item-thumbnail"
              href="{{app.img+image.url}}" target="_blank"
              rel="noopener noreferrer"> <img :src="app.img+image.url" style="width:100%;height:100%"/></a>
           <a href="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" target="_blank"
              rel="noopener noreferrer" class="ant-upload-list-item-name">xxx.png</a>
           <span><a href="{{app.img+image.url}}" target="_blank"
                    rel="noopener noreferrer"><i class="anticon anticon-eye-o"></i></a><i title="删除"
                                                                                          class="anticon anticon-delete"  @click="removeImage"></i></span>
          </div>
         </div>
        </div>
         </span>

     </div>

</template>
<style>
  .ant-upload-select-picture-card1 {
  position: absolute;
    border: 1px dashed #d9d9d9;
    width: 100%;
    height: 100%;
    border-radius: 4px;
    background-color: #fbfbfb;
    text-align: center;
    cursor: pointer;
    transition: border-color 0.3s ease;
    display: inline-block;
    vertical-align: middle;
    margin-right: 8px;
    margin-bottom: 8px;
    top: 50%;
    text-align: center;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
    width: 100%;

}
.ant-upload-list-picture-card .ant-upload-list-item1 {
    display: inline-block;
    width: 100%;
    height: 100%;

}
.span-dard{
    border: 1px dashed #d9d9d9;
    width: 100%;
    height: 100%;
    border-radius: 4px;
    background-color: #fbfbfb;
    text-align: center;
    cursor: pointer;
    transition: border-color 0.3s ease;
    display: inline-block;
    vertical-align: middle;
    margin-right: 8px;
    margin-bottom: 8px;
  }
 .ant-upload-btn {
    display: inline-block;
    width: 100%;
    height: 100%;
    outline: none;
    text-align: center;
    cursor: pointer;
    transition: border-color 0.3s ease;
    display: inline-block;
    vertical-align: middle;
    margin-right: 8px;
    margin-bottom: 8px;
    top: 50%;
    text-align: center;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
    width: 100%;

}
</style>
<script>
import  {defaultProps}   from '../../../utils/props'
import AjaxUpload from './ajaxUploader.vue'
import UploadList from './uploadList.vue'
import getFileItem from './getFileItem'

// Fix IE file.status problem
// via coping a new Object
function fileToObject (file) {
  return {
    lastModified: file.lastModified,
    lastModifiedDate: file.lastModifiedDate,
    name: file.filename || file.name,
    size: file.size,
    type: file.type,
    uid: file.uid,
    response: file.response,
    error: file.error
  }
}

export default {
  name: 'v-upload',
  data(){
            return {
               size:'',
               name:'',
               info:'',
               type:"1",

            }
        },

  props: defaultProps({
    prefixCls: 'ant-upload',
    image:'',
     name: '',
    forceAjax: false,
    multipart: false,
    action: '',
    data: {},
    accept: '',
    multiple: false,
    fileList: Array,
    defaultFileList: Array,
    beforeUpload: () => {},
    onChange: () => {}
  }),

  components: { AjaxUpload, UploadList },

  computed: {
    isDrag () {
      return this.type === 'drag'
    },

    wrapClasses () {
      return [
        this.prefixCls,
        {[`${this.prefixCls}-drag`]: this.isDrag},
        {[`${this.prefixCls}-select`]: !this.isDrag}
      ]
    },

    containerClasses () {
      return {[`${this.prefixCls}-drag-container`]: this.isDrag}
    }
  },

  beforeCompile () {
   console.error(this.fileList)
    this.$set('fileList', this.fileList || this.defaultFileList || [])
  },

  methods: {
    _onStart (file) {
        this.type=2
      let targetItem;
      let nextFileList = this.fileList.concat()
      if (file.length > 0) {
        targetItem = file.map(function(f) {
          f = fileToObject(f);
          f.status = 'uploading';
          return f
        })
        nextFileList = nextFileList.concat(file)
      } else {
        targetItem = fileToObject(file)
        targetItem.status = 'uploading'
        nextFileList.push(targetItem)
      }

      this._onChange({
        file: targetItem,
        fileList: nextFileList
      })
    },

    _onProgress (e, file) {
      this.type=""
      let fileList = this.fileList
      let targetItem = getFileItem(file, fileList)

      if (targetItem) {
        this._onChange({
          event: e,
          file: file,
          fileList: this.fileList
        })
      }
    },
  _onSuccess ( file) {
      // 服务器端需要返回标准 json 字符串
      // 否则视为失败

        this.image=file
       let fileList = this.fileList

        this.type=1
        this._onChange({
          file: file,
          fileList: fileList
        })

    },
    _onSuccess11 (response, file) {
      // 服务器端需要返回标准 json 字符串
      // 否则视为失败
      try {
        if (typeof response === 'string') {
          JSON.parse(response)
        }
      } catch (e) {
        this._onError(new Error('No response'), response, file)
        return
      }

      let fileList = this.fileList
      let targetItem = getFileItem(file, fileList)

      // 之前已经删除
      if (targetItem) {
        targetItem.status = 'done'
        targetItem.response = response

        this._onChange({
          file: targetItem,
          fileList: fileList
        })
      }
    },

    _onError (error, response, file) {
      let fileList = this.fileList
      let targetItem = getFileItem(file, fileList)
      targetItem.error = error
      targetItem.response = response
      targetItem.status = 'error'
      this.type=3

      this._handleRemove(targetItem)
    },
    removeImage(){
        this.image=""
    },
    _removeFile (file) {
      let fileList = this.fileList
      let targetItem = getFileItem(file, fileList)
      let index = fileList.indexOf(targetItem)

      if (index !== -1) {
        fileList.splice(index, 1)
        return fileList
      }

      return null
    },

    _handleRemove (file) {
      let fileList = this._removeFile(file)

      if (fileList) {
        this._onChange({
          file: file,
          fileList: fileList
        })
      }
    },

    _handleManualRemove (file) {
      file.status = 'removed'
      this._handleRemove(file)
    },

    _getFilePlainObject (fileList) {
      let arr = []
      fileList.forEach(item => {
        arr.push({
          name: item.name,
          size: item.size,
          status: item.status,
          type: item.type,
          uid: item.uid,
          response: item.response
        })
      })
      return arr
    },

    _onChange (info) {
      // 1. 有设置外部属性时不改变 fileList
      // 2. 上传中状态（info.event）不改变 fileList
      if (info.fileList) {
        let fileList = info.fileList
        // todo
        // 用纯对象的方式来触发vue的更新，好吧，之后看看有没有好的方式
        fileList = this._getFilePlainObject(fileList)
        this.$set('fileList', fileList)
      }
      this.onChange(info)
    },
  }
}





</script>

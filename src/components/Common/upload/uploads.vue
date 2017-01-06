<template>
    <div  v-if="!image" class="ant-upload ant-upload-drag">
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
            <div   class="ant-upload-list ant-upload-list-picture-card">
                <div class="demo-spin-container">
                <template v-if="type==1">
                <Icon type="plus" size=50></Icon>
                </template>
                 <template v-if="type==2">
                     <svg xmlns="http://www.w3.org/2000/svg" id='loading-svg' viewBox="0 0 32 32" width="32" height="32" fill="gray">
                         <path opacity=".15" d="M16 0 A16 16 0 0 0 16 32 A16 16 0 0 0 16 0 M16 4 A12 12 0 0 1 16 28 A12 12 0 0 1 16 4"/>
                         <path d="M16 0 A16 16 0 0 1 32 16 L28 16 A12 12 0 0 0 16 4z">
                             <animateTransform attributeName="transform" type="rotate" from="0 16 16" to="360 16 16" dur="0.8s"
                                               repeatCount="indefinite"/>
                         </path>
                     </svg>


                 </template>
                <template v-if="type==3">


                    <Icon type="alert-circled" size=50></Icon>
                </template>
                </div>

            </div>
        </ajax-upload>
    </div>
    <div class="dz dz-clickable dz-started" v-else>

        <div class="dz-preview dz-processing dz-image-preview dz-success dz-complete" v-else>

            <div v-if="image" class="dz-image">
                <img :src="app.img+image.url" style="width:100%;height:100%"/>
                <a class="dz-remove" @click="removeImage" data-dz-remove="">删除</a>
            </div>


        </div>

    </div>

</template>

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

    _onError (error ) {

       this.type=3;
       this.$Notice.error({
           top:200,
           title: '上传文件错误',
           desc:  '上传错误，文件上传最大支持3M,请选择合适大小的文件上传'
       });

      //this._handleRemove(targetItem)
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

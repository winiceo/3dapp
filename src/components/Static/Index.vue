<template>
    
    <div class="page animsition" style="animation-duration: 800ms; opacity: 1;">
    <div class="page-header">
      <h1 class="page-title">基本信息</h1>
       
     
    </div>
    <div class="page-content">
      <div class="panel">
        <div class="panel-body container-fluid">
          <div class="row row-lg">
            <div class="col-sm-6">
              <!-- Example Basic Form -->
              <div class="example-wrap">
                <h4 class="example-title">微信相关</h4>
                <div class="example">
                  <form autocomplete="off">
                    
                     
                    <div class="form-group">
                      <label class="control-label" for="inputBasicEmail">AppID(应用ID)</label>
                      <input type="email" class="form-control" id="inputBasicEmail" name="inputEmail" placeholder="Email Address" autocomplete="off">
                    </div>
                    <div class="form-group">
                      <label class="control-label" for="inputBasicPassword">AppSecret(应用密钥)</label>
                      <input type="password" class="form-control" id="inputBasicPassword" name="inputPassword" placeholder="Password" autocomplete="off">
                    </div>
                    
                    <div class="form-group">
                      <button type="button" class="btn btn-primary">保存</button>
                    </div>
                  </form>
                </div>
              </div>
              <!-- End Example Basic Form -->
            </div>

            <div class="col-sm-6">
              <!-- Example Basic Form Without Label -->
              <div class="example-wrap">
                <h4 class="example-title">会议相关</h4>
                  <div class="example">
                  <form autocomplete="off">
                    
                     
                    <div class="form-group">
                      <label class="control-label" for="inputBasicEmail">会议名称</label>
                      <input type="email" class="form-control" id="inputBasicEmail" name="inputEmail" placeholder="Email Address" autocomplete="off">
                    </div>
                    <div class="form-group">
                      <label class="control-label" for="inputBasicPassword">上传Logo</label>
                      <input type="password" class="form-control" id="inputBasicPassword" name="inputPassword" placeholder="Password" autocomplete="off">
                    </div>
                    <div class="form-group">
                      <label class="control-label" for="inputBasicPassword">上传二维码</label>
                      <input type="password" class="form-control" id="inputBasicPassword" name="inputPassword" placeholder="Password" autocomplete="off">
                    </div>
                    
                    <div class="form-group">
                      <button type="button" class="btn btn-primary">保存</button>
                    </div>
                  </form>
                </div>
              </div>
              <!-- End Example Basic Form Without Label -->
            </div>

             
          </div>
        </div>
      </div>

       
      
    </div>
  </div>

</template>
<style>

</style>
<script>
     
    export default{
        data(){
            return {}
        } 
    }
</script>
<template>
    <div>
    <el-container>
        <el-header>
             <el-alert
                title="操作说明"
                description="第一步：左右两边各先选择待对比的文件；第二步：选择对比项及输出文件；第三步：点击一键对比。注：文件不会上传，数据绝对安全，默认会移出数字前面的0；为了性能只显示前10条数据，但是对比时是全部数据！请确保待对比数据在第一个sheet里面！！！ "
                 type="info"
                 show-icon
                :closable="false">
            </el-alert>

        </el-header>
            <el-container style="padding-bottom:250px">
                <el-aside width="50%">
                    <el-upload 
                        class="upload-demo"
                        drag
                        :show-file-list="false"
                        :on-change="lefthandleChange"
                        action="#"
                        accept = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                        :auto-upload="false">
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text"><em>请点击选择文件</em></div>
                        <div class="el-upload__tip" slot="tip">只能上传excel文件</div>
                    </el-upload> 
                    <div v-show="leftFileReadOk">
                        <el-alert
                            :title="leftFileName"
                            type="success"
                            :description="leftFileInfo"
                            show-icon>
                        </el-alert>
                        <el-table
                            :data="leftFileDataShow"
                            stripe
                            border
                            v-loading="!leftFileReadOk"
                            style="width: 100%"
                            max-height="300">
                              <el-table-column
                                fixed
                                prop="0"
                                label="第0列"
                                width="150">
                            </el-table-column>
                            <el-table-column
                                v-for="(item,index) in leftTable"
                                :prop="(index+1).toString()"
                                :key="index"
                                :label="item"
                                width="150">
                            </el-table-column>
                            
                        </el-table> 
                    </div>
                </el-aside>
                <el-main>
                    <el-upload 
                        class="upload-demo"
                        drag
                        :show-file-list="false"
                        :on-change="righthandleChange"
                        action="#"
                        accept = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                        :auto-upload="false">
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text"><em>请点击选择文件</em></div>
                        <div class="el-upload__tip" slot="tip">只能上传excel文件</div>
                    </el-upload> 
                      <div v-show="rightFileReadOk">
                        <el-alert
                            :title="rightFileName"
                            type="success"
                            :description="rightFileInfo"
                            show-icon>
                        </el-alert>
                        <el-table
                            :data="rightFileDataShow"
                            stripe
                            border
                            v-loading="!rightFileReadOk"
                            style="width: 100%"
                            max-height="300">
                             <el-table-column
                                fixed
                                prop="0"
                                label="第0列"
                                width="150">
                            </el-table-column>
                            <el-table-column
                                v-for="(item,index) in rightTable"
                                :prop="(index+1).toString()"
                                :key="index"
                                :label="item"
                                width="150">
                            </el-table-column>
                        </el-table> 
                    </div>
                </el-main>
                 
            </el-container>
            <div v-show='!leftFileReadOk && !rightFileReadOk' class="excel-p">EXCEL文件预览区域</div>
            <div class="my-footer">
                <span class="me" @click="showme"></span>
                <span>|</span>
                <span @click="gotogithub" class="github"></span>
            </div>
        <el-footer v-show='leftFileReadOk && rightFileReadOk'>

            <div>
                <el-form :inline="true" :model="formInline" class="demo-form-inline">
                    <el-form-item :label="leftFileName+'中待比较项'">
                        <el-select v-model="formInline.leftOp" :placeholder="'请选择文件中待比较项'">
                        <el-option 
                            v-for="(item, index) in leftOpVal"
                             :key="index"
                            :label="item"
                            :value="index"
                            >
                        </el-option>
                        </el-select>
                    </el-form-item>
                     <el-form-item :label="rightFileName+'中待比较列'">
                        <el-select v-model="formInline.rightOp" :placeholder="'请选择文件中待比较列的名称'">
                        <el-option 
                            v-for="(item, index) in rightOpVal"
                             :key="index"
                            :label="item"
                            :value="index"
                            >
                        </el-option>
                        </el-select>
                    </el-form-item>
                    <div style="width:100%;height:2px;background:#f2f2f2;margin:5px;"></div>
                    <span style="font-size:14px;color:#606266">请选择导出excel</span>
                     <el-radio @change = "radioChange" v-model="formInline.radio" label="left" border>{{leftFileName}}</el-radio>
                    <el-radio @change = "radioChange" v-model="formInline.radio" label="right" border>{{rightFileName}}</el-radio>
                   
                   <div style="width:100%;height:2px;background:#f2f2f2;margin:5px;"></div>
                  
                   <span  style="font-size:14px;color:#606266">追加项(把未导出的excel中的项追加到导出的excel中)</span>
                     <el-select
                        v-model="formInline.zhuijiaArr"
                        multiple
                        collapse-tags
                        style="margin-left: 20px;"
                        placeholder="请选择追加项">
                        <el-option
                        v-for="(item,index) in options"
                        :key="index"
                            :label="item"
                            :value="index">
                        </el-option>
                    </el-select>
                    <div style="width:100%;height:2px;background:#f2f2f2;margin:5px;"></div>
                    <el-form-item>
                        <el-button type="primary" :loading="dbloading"   @click="contrast">一键对比</el-button>
                    </el-form-item>
                </el-form>
            </div>
           
        </el-footer>
    </el-container>
    <el-dialog title="对比结果" :visible.sync="dialogFormVisible">
        <div v-show="contrastRET=='0'" style="color:#F56C6C">非常抱歉告知您，当前条件下没有一条匹配项！</div>
        <div v-show="contrastRET!='0'" style="color:#67C23A">恭喜，已成功匹配到<span style="color:#F56C6C;font-weight:blod">{{ contrastRET }}</span>条数据！点击确认即可保存到本地。</div>
        <el-form v-show="contrastRET!='0'" :model="formInline">
            <el-form-item label="保存文件重命名">
            <el-input v-model="formInline.outFILEname" placeholder="请输入文件名称" auto-complete="off"></el-input>
             <span><i class="el-icon-info"></i>注意：当文件名一样时，直接覆盖替换！</span>   
            </el-form-item>
        </el-form>
        
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveOutFile">确 定</el-button>
        </div>
    </el-dialog>
    </div>    
</template>
<script>
	
let xlsx = require('node-xlsx');
let fs = require('fs');
  let moment = require('moment');
  const {remote} = require('electron');
let Dir = remote.app.getPath('desktop');
const {ipcRenderer} = require('electron')
 const {shell} = require('electron')
function init(){
    //监听main process里发出的message
    ipcRenderer.on('downstate', (event, arg) => {
     alert("下载状态：" + arg); 
}) 
}



    export default{
        name:"index",
         data() {
            return {
                dialogFormVisible:false,
                contrastRET:"",
                contrastRETARR:[],
                leftFileData: [],//左边excel待比较json
                leftFileDataShow: [],//左边excel显示json
                rightFileData: [],//右边excel待比较json
                rightFileDataShow: [],//右边excel显示json
                size:0, //文件有效数据条数
                maxSize:10,//最大显示条数
                leftFileName:'',
                leftFileInfo:'',
                leftFileReadOk:false,
                rightFileName:'',
                rightFileInfo:'',
                rightFileReadOk:false,
                leftOpSize:0,
                rightOpSize:0,
                out:[],
                leftFileMaxL:'',
                rightFileMaxL:'',
                options:[],
                dbloading:false,
                leftTable:[],
                rightTable:[],
                leftOpVal: [],
                rightOpVal: [],
                leftOpValAll: [],
                rightOpValAll: [],
                checkboxArr:[],
                formInline: {
                    outFILEname:'',
                    rightOp: '',
                    leftOp: '',
                    radio:"left",
                    checkbox:[],
                    zhuijiaArr:[]
                }
            }
        },
        methods: {
           
            radioChange:function(){
                this.formInline.zhuijiaArr = []
                if(this.formInline.radio == "left"){
                    this.checkboxArr = this.leftOpValAll;
                    this.options = this.rightOpValAll
                    this.formInline.checkbox = this.leftOpValAll;
                }else if(this.formInline.radio == "right"){
                    this.checkboxArr = this.rightOpValAll;
                    this.options = this.leftOpValAll
                     this.formInline.checkbox = this.rightOpValAll;
                }
                console.log(__dirname)
            },
            contrast:function(){
                this.dbloading = true;
                 moment.locale('zh-cn');
                this.formInline.outFILEname = '对比结果'+moment().format('LLL')
                console.log(this.formInline.outFILEname)
                const loading = this.$loading({"text":"智能对比中.."});
                let A,B,aobj,bobj,fromFile;
                let zhuijiaArr = this.formInline.zhuijiaArr
                let zhuijiaArrL = zhuijiaArr.length
               let fileMax;
                if(this.formInline.radio == "left"){
                    A=this.leftFileData;
                    aobj = this.formInline.leftOp
                    bobj = this.formInline.rightOp
                    B = this.rightFileData
                    fromFile = this.rightFileName
                    fileMax = this.leftFileMaxL
                }else if(this.formInline.radio == "right"){
                    A=this.rightFileData
                     B = this.leftFileData
                      aobj = this.formInline.rightOp
                    bobj = this.formInline.leftOp
                     fromFile = this.leftFileName
                     fileMax = this.rightFileMaxL
                }
                let fileMaxReset = fileMax
                var C=[];
                function trim(s){
                    return s.replace(/(^\s*)|(\s*$)/g, "");
                }
                for(var i=0,Al = A.length;i<Al;i++){
                    if(A[i].hasOwnProperty(aobj)){
                        for(var n=0,Bl = B.length;n<Bl;n++){
                            if(B[n].hasOwnProperty(bobj)){
                                if(trim(A[i][aobj]) == trim(B[n][bobj])){
                                    let out = A[i];
                                    if(zhuijiaArrL>0){
                                        for(var z=0;z<zhuijiaArrL;z++){

                                          out[fileMax] =B[n][zhuijiaArr[z]]
                                          fileMax++
                                          
                                        }
                                        fileMax = fileMaxReset
                                    }
                                    C.push(out) 
                                        break;
                                    }
                            }
                        }
                    }
                    
                }
                loading.close();
                this.contrastRET = C.length;
                this.dialogFormVisible = true;
                this.dbloading = false;
                this.contrastRETARR = C;
                 console.log(this.contrastRET)
               
            },
            saveOutFile:function(){
                if(this.contrastRET == '0'){
                    this.dialogFormVisible = false;
                }else{
                
                    function objToArray(array) {
                        var arr = []
                        for (var i in array) {
                            arr.push(array[i]); 
                        }
                        return arr;
                    }
                    var outArr = []
                    let outFILEname = this.formInline.outFILEname
                     for(var n=0,retL=this.contrastRETARR.length;n<retL;n++){
                         outArr.push(objToArray(this.contrastRETARR[n]))
                     }      
                     console.log(outArr)
                    writeXls(outArr);
                    let that = this;
                    function writeXls(datas) {
                        const range = {s: {c: 0, r:0 }, e: {c:0, r:3}}; // A1:A4
                         const option = {'!merges': [ range ]};
                        var buffer = xlsx.build([
                            {
                                name:'对比结果',
                                data:datas   
                            }
                        ]);
                       
                        fs.writeFile(Dir+"/"+outFILEname+'.xlsx',buffer,{'flag':'w'},function (err) {
                            if (err) throw err ;
                             that.dialogFormVisible = false;
                             that.$message({
                                showClose: true,
                                message: '恭喜你，文件['+outFILEname+'.xlsx'+']以保存至您的桌面！',
                                type: 'success',
                                duration:0
                            });

                               
                        });  

                    
                    }
                }
            },
           lefthandleChange:function(file, fileList) {
               this.fileReader(file, fileList,"left")
            },
            righthandleChange:function(file, fileList) {
               this.fileReader(file, fileList,"right")
            },
            fileReader:function(file,fileList,where){
                console.log(file)
                const loading = this.$loading({"text":"文件读取中，请稍等.."});
                this.size = 0;
               let fileType = file.name.substring(file.name.lastIndexOf(".")+1).toUpperCase()
               if(where == "left"){
                    this.leftFileName = "文件名："+file.name;
               }else if(where == "right"){
                    this.rightFileName = "文件名："+file.name;
               }
               
               if(fileType == "XLSX" || fileType == "XLS"){
                    let obj = null
                    this.size = 0;
                   
                    try {
                        let obj = xlsx.parse(file.raw.path);
                        let leftLengthArr=[],rightLengthArr=[];
                        let tobj ={};
                        let tarr = [];
                        
                        for(let i in  obj[0].data){
                            let dataL = obj[0].data[i].length
                            if(dataL>0){
                                if(where == "left"){
                                   leftLengthArr.push(dataL)
                                }else if(where == "right"){
                                   rightLengthArr.push(dataL)
                                    //console.log(dataL)
                                }
                                
                                this.size++;
                                for(let key = 0,le = dataL;key<le;key++){
                                   
                                   if(obj[0].data[i][key]==undefined){//替换excel中的空白
                                        tobj[key] = "空"
                                   }else{
                                        obj[0].data[i][key] = obj[0].data[i][key].toString()//数据类型统一改成字符串，方便后续新操作
                                       //默认删除字符串前面的0
                                       if(obj[0].data[i][key]=="0"){
                                            tobj[key] = obj[0].data[i][key]
                                       }else{
                                           if(obj[0].data[i][key] != ""){
                                                obj[0].data[i][key]= obj[0].data[i][key].replace(/\b(0+)/gi,"")
                                                tobj[key] = obj[0].data[i][key]
                                           }else{
                                                tobj[key] = obj[0].data[i][key]
                                           }
                                          
                                       }
                                   }
                                   
                                    
                                }
                                tarr.push(tobj)
                                tobj = {}
                            }else if(dataL==0){
                                continue
                            }
                        }
                        if(where == "left"){
                            this.leftFileData = tarr
                        }else if(where == "right"){
                             this.rightFileData = tarr
                        }
                        console.log(this.size,this.maxSize)
                       
                       
                        if(this.size>this.maxSize){
                            if(where == "left"){
                                  this.leftFileDataShow = []
                                 this.leftFileDataShow = tarr.slice(0,this.maxSize)
                        }else if(where == "right"){
                             this.rightFileDataShow =[]
                                this.rightFileDataShow = tarr.slice(0,this.maxSize)
                            }
                            
                        }else{
                            if(where == "left"){
                                this.leftFileDataShow = []
                                this.leftFileDataShow = tarr
                            }else if(where == "right"){
                                 this.rightFileDataShow =[]
                                this.rightFileDataShow = tarr
                            }
                        }
                        
                       
                    loading.close();
                     this.$nextTick(function () {
                        // DOM is now updated
                        // `this` is bound to the current instance
                        let notifyInfo ="文件"+file.name+"，读取成功。一共读取到"+this.size+"条有效数据！"
                        if(where == "left"){
                            this.leftTable = [];
                            this.leftOpValAll = [];
                            this.out = []
                            let maxl=Math.max.apply(Math,leftLengthArr);
                            this.leftFileMaxL = maxl
                            for(let n=1;n<maxl;n++){
                                this.leftTable.push("第"+n+"列")
                            }
                             for(let n=0;n<maxl;n++){
                                this.leftOpValAll.push("第"+n+"列")
                                this.out.push(n)
                            }
                            console.log(this.leftTable)
                            this.leftOpVal = this.leftOpValAll
                            this.checkboxArr = this.leftOpValAll
                            this.formInline.checkbox = this.leftOpValAll;
                           
                            this.leftFileReadOk = true
                            this.leftFileInfo = "文件信息：一共读取到"+this.size+"条有效数据！"
                        }else if(where == "right"){
                             this.rightTable = []
                             this.rightOpValAll = []
                             this.out = []
                            let maxr=Math.max.apply(Math,rightLengthArr);
                            this.rightFileMaxL = maxr
                            for(let n=1;n<maxr;n++){
                                this.rightTable.push("第"+n+"列")
                            }
                            for(let n=0;n<maxr;n++){
                                this.rightOpValAll.push("第"+n+"列")
                                this.out.push(n)
                            }
                            console.log(this.rightTable)
                            this.rightOpVal = this.rightOpValAll
                            this.rightFileReadOk = true
                            this.rightFileInfo = "文件信息：一共读取到"+this.size+"条有效数据！"
                        }
                         this.options =  this.rightOpValAll
                         this.$notify({
                            title: '提示',
                            message:notifyInfo,
                            type: 'success'
                        });
                     })
                    } catch (error) {
                        loading.close();
                         this.$notify.error({
                            title: '错误',
                            message: '读取：【'+file.name+'】失败，错误：'+error
                        });
                    }
                  
               }else{
                   loading.close();
                   this.$notify({
                        title: '警告',
                        message: file.name+'文件格式错误，只允许上传excel文件！',
                        type: 'warning',
                        duration: 0
                    });
               }
            },
            showme:function(){
                this.$alert('版本号：V0.0.1,作者：2&3', '关于', {
                    confirmButtonText: '确定'
                });
            },
            gotogithub:function(){
                 shell.openExternal('https://github.com/cmh2016/electron-excel-tool')
            }
        }
    }
</script>
<style scoped>
.el-header{
    border-bottom: 1px dotted #f2f2f2;
    margin-bottom: 15px;
}
.el-aside{
    padding: 20px;
    border-right: 1px solid #f2f2f2
}
.el-main,.el-aside{
    text-align: center  
}
.el-footer{
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 250px!important;
    border-top:2px dotted #f2f2f2;
    padding: 5px 15px;
    text-align: center;
    background-color: #eaefe8;
    z-index: 6;
    box-shadow: rgba(0, 0, 0, 0.65) 0PX -2PX 9px 1px
}
.el-form-item{
    margin-bottom: 0;
}
.excel-p{
    text-align: center;
    margin-top: -217px;
    color: #909090;
    display: inline-block;
    border: 1px dashed #d9d9d9;
    width: 80%;
    margin-left: 10%;
    padding: 100px 0;
}
.my-footer{
    margin: 20px auto;
    text-align: center;
    display: flex;
}
.my-footer span{
    display: inline-block;
    width: 25px;
    height: 25px;
    background-size: cover
}
.me{
    background: url(data:image/png;base64,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)
}
.github{
    background: url(data:image/png;base64,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)
}
</style>

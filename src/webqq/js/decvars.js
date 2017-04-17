/*顶部菜单*/
var oTopList=document.getElementById('topList');
var oTList=oTopList.children[0];
var oTabBox=oTList.children[1];
var aTabBtn=oTabBox.getElementsByTagName('a');

// 主要内容部分
var oMList=document.getElementById('mainList');
var page1=oMList.children[0].children[0];
var pages=getByClass(oMList,'page');  //页数的集合
var izIndex=3;  //公用的层级
// 获取第一页显示
function getTabindex(){
	for(var i=0; i<aTabBtn.length; i++){
		if(aTabBtn[i].className=='active'){
			return i;	
		}
	}	
	return -1;
}

var oTaskContainer=document.getElementById('taskContainer');
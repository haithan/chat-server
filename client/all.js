"use strict";angular.module("chatApp",["ngCookies","ngResource","ngSanitize","btford.socket-io","ui.router","ui.bootstrap","perfect_scrollbar","dbaq.emoji","angular-click-outside","angularSpinner","luegg.directives"]).config(function($stateProvider,$urlRouterProvider,$locationProvider,$httpProvider){$urlRouterProvider.otherwise("/t//"),$locationProvider.html5Mode(!0),$httpProvider.defaults.useXDomain=!0,delete $httpProvider.defaults.headers.common["X-Requested-With"],$httpProvider.interceptors.push("authInterceptor")}).factory("socket",function(socketFactory){var myIoSocket=io.connect("http://chat.lvh.me:8123"),mySocket=socketFactory({ioSocket:myIoSocket});return mySocket}).factory("authInterceptor",function($rootScope,$q,$cookieStore,$location,$window){return{request:function(config){return config.headers=config.headers||{},$cookieStore.get("auth_token")&&(config.headers.Authorization="Bearer "+$cookieStore.get("auth_token")),config},responseError:function(response){return 401===response.status?(alert("Bạn chưa đăng ký dịch vụ ymeet.me. Vui lòng đăng ký trước khi sử dụng dịch vụ chat. Xin cám ơn."),$window.location.href="http://ymeet.me"):$q.reject(response)}}}).run(function(Auth,$rootScope){$rootScope.$on("$stateChangeStart",function(event,next){Auth.auth()})}),angular.module("chatApp").directive("content",function(){return function(scope,element,attrs){element.height($(window).height()-$(".chat-input").outerHeight()-105)}}).directive("fallbackSrc",function(){return{restrict:"A",link:function(scope,iElement,iAttrs){iElement.bind("error",function(){angular.element(this).attr("src",iAttrs.fallbackSrc)})}}}).directive("autoFocus",["$timeout",function($timeout){return{restrict:"A",link:function(scope,iElement){$timeout(function(){scope.$watch("autoFocus",function(){iElement[0].focus()})},0)}}}]).directive("scrollToTop",["$timeout",function($timeout){return{restrict:"A",link:function(scope,iElement,iAttrs){iElement.bind("scroll",function(e){iElement[0].scrollTop<=0&&(scope.loadMore(),$timeout(function(){iElement.scrollTop(10)},200))})}}}]),angular.module("chatApp").controller("LoginCtrl",function($scope,$state,usSpinnerService,$rootScope){usSpinnerService.spin("spinner-1"),$state.go("main")}),angular.module("chatApp").config(function($stateProvider){$stateProvider.state("login",{url:"/login",templateUrl:"app/login/login.html",controller:"LoginCtrl"})}),angular.module("chatApp").controller("MainCtrl",function($scope,socket,$rootScope,chatUtils,chatFilters,$stateParams,Notification,Message,User,Gcm,Match,$timeout,Crypto){if(""!=$stateParams.roomId&&""!=$stateParams.userId){var userId=$rootScope.userId,targetUserId=$stateParams.userId,targetUserName=$rootScope.targetUserName,sessionId=$stateParams.roomId,targetAvatarUrl=$rootScope.targetAvatarUrl,targetUserGgIds="";$scope.emojiPopup=!1,$scope.emojis=["bowtie","smile","laughing","blush","smiley","relaxed","smirk","heart_eyes","kissing_heart","kissing_closed_eyes","flushed","relieved","satisfied","grin","wink","stuck_out_tongue_winking_eye","stuck_out_tongue_closed_eyes","grinning","kissing","winky_face","kissing_smiling_eyes","stuck_out_tongue","sleeping","worried","frowning","anguished","open_mouth","grimacing","confused","hushed","expressionless","unamused","sweat_smile","sweat","wow","disappointed_relieved","weary","pensive","disappointed","confounded","fearful","cold_sweat","persevere","cry","sob","joy","astonished","scream","neckbeard","tired_face","angry","rage","triumph","sleepy"],Match.checkRoomPermission(userId,targetUserId,sessionId).then(function(res){200===res.status&&(socket.emit("addUser",{room:sessionId,userId:userId}),$timeout(function(){$("#"+$stateParams.userId).addClass("active")},500))}),Gcm.getGcmIds(targetUserId).success(function(data){targetUserGgIds=data.gcm_ids}),Notification.updateNotificationNum(targetUserId,userId,0);var prepareChat=function(data){var chat={};chat._id=data._id,chat.float_class="pull-right",chat.message=data.message;var url=chatUtils.getUrlFromText(data.message);return url&&chatUtils.isImage(url).then(function(result){result===!0&&(chat.image_url=url)}),data.user_id!=userId&&(chat.float_class="",chat.username=targetUserName,chat.avatar_url=targetAvatarUrl),chat},appendChat=function(data,isLastMsg){if(data.message){isLastMsg="undefined"!=typeof isLastMsg?isLastMsg:!0,isLastMsg&&(data.message=Crypto.decrypt(data.message));var chat=prepareChat(data);isLastMsg?$scope.chats.push(chat):$scope.chats.unshift(chat)}},updateNotification=function(data){if(data&&data.from_user_id&&data.to_user_id&&data.noti_num&&data.to_user_id==userId){var $userRow=$("#"+data.from_user_id);if($userRow.hasClass("active"))return void Notification.updateNotificationNum(targetUserId,userId,0)}},getMessage=function(){$scope.chats=[];var id="undefined"!=typeof $scope.chats[0]?$scope.chats[0]._id:"undefined";Message.getMessagesFromRoom(sessionId,id).success(function(data){void 0!==data&&0!=data.length&&data.forEach(function(d){appendChat(d,!1)})})};$scope.sendChat=function(){if(""!==$scope.chatMessage){var message=chatFilters.filterBadWords($scope.chatMessage);message=Crypto.encrypt(message),$scope.chatMessage="",socket.emit("sendChat",{message:message,targetUserGgIds:targetUserGgIds,targetUserId:targetUserId})}},$scope.sendChatByKey=function($event){$event.shiftKey||($event.preventDefault(),$scope.sendChat())},$scope.showEmojiPopup=function($event){$scope.emojiPopup=$scope.emojiPopup===!1?!0:!1},$scope.appendEmojiToMessage=function(icon){var message=void 0===$scope.chatMessage?"":$scope.chatMessage;$scope.chatMessage=message+":"+icon+":"},$scope.loadMore=function(){var id="undefined"!=typeof $scope.chats[0]?$scope.chats[0]._id:"undefined";Message.getMessagesFromRoom(sessionId,id).success(function(datas){void 0!==datas&&0!=datas.length&&datas.forEach(function(data){appendChat(data,!1)})})},socket.on("notification:save",updateNotification),socket.on("getMessage",getMessage),socket.on("updateChat",appendChat),$scope.$on("$destroy",function(){socket.removeListener("getMessage",getMessage),socket.removeListener("updateChat",appendChat),socket.removeListener("notification:save",updateNotification),socket.emit("user:leaveRoom")})}}),angular.module("chatApp").config(function($stateProvider){$stateProvider.state("main",{url:"/t/:roomId/:userId",templateUrl:"app/main/main.html",controller:"MainCtrl"})}),angular.module("chatApp").factory("Block",function($http){return{getBlockStatus:function(sourceUserId,targetUserId){return $http.get("/api/blocks/"+sourceUserId+"/"+targetUserId)},updateBlockStatus:function(sourceUserId,targetUserId,block){return $http.patch("/api/blocks/"+sourceUserId+"/"+targetUserId,{block:block})}}}).factory("Gcm",function($http){return{getGcmIds:function(userId){return $http.get("/api/gcms/"+userId)}}}).factory("Match",function($http){return{getMatchs:function(userId){return $http.get("/api/matchs/"+userId)},checkRoomPermission:function(sourceId,targetId,sessionId){return $http.get("/api/matchs/"+sourceId+"/"+targetId+"/"+sessionId)}}}).factory("Message",function($http){return{getMessagesFromRoom:function(roomId,messageId){return $http.get("/api/messages/"+roomId+"/"+messageId)},createMessage:function(roomId,userId,message){return $http.post("/api/messages/",{user_id:userId,message:message,session_id:roomId})}}}).factory("Notification",function($http){return{getNotificationNum:function(fromUserId,toUserId){return $http.get("/api/notifications/"+fromUserId+"/"+toUserId)},updateNotificationNum:function(fromUserId,toUserId,notiNum){return $http.patch("/api/notifications/"+fromUserId+"/"+toUserId,{noti_num:notiNum})}}}).factory("User",function($http){return{getUser:function(id){return $http.get("/api/users/"+id)}}}),angular.module("chatApp").factory("Auth",function($http,$rootScope,$window,$cookieStore){var authenticate=function(data){return data&&data.user_id?($rootScope.userId=data.user_id,void $cookieStore.put("auth_token",data.auth_token)):($cookieStore.remove("auth_token"),$window.location.href="http://ymeet.me")};return{auth:function(){"undefined"==typeof $rootScope.userId&&$http.get("/auth").then(function(res){authenticate(res.data)},function(res){return 403==res.status?($cookieStore.remove("auth_token"),alert("Bạn chưa đăng ký dịch vụ ymeet.me. Vui lòng đăng ký trước khi sử dụng dịch vụ chat. Xin cám ơn."),$window.location.href="http://ymeet.me"):($cookieStore.remove("auth_token"),alert("Có lỗi kết nối. Vui lòng liên hệ admin để kiểm tra. Xin cám ơn."),$window.location.href="http://ymeet.me")})}}}),angular.module("chatApp").factory("chatUtils",function($stateParams,$rootScope,$q){return{isImage:function(src){var deferred=$q.defer(),image=new Image;return image.onerror=function(){deferred.resolve(!1)},image.onload=function(){deferred.resolve(!0)},image.src=src,deferred.promise},getUrlFromText:function(text){var url=text.match(/(https?:\/\/[^\s]+)/g);return url?url[0]:void 0},findIndexByUserId:function(id,users){return _.findIndex(users,function(user){return user.id==id})}}}).factory("chatFilters",function(){var filterWords=["địt","việt cộng","lồn","cặc","buồi"],rgx=new RegExp(filterWords.join("|"),"gi");return{filterBadWords:function(str){return str.replace(rgx,"***")}}}).factory("Crypto",function(){var pass="mmj@#172014";return{encrypt:function(text){var enc=CryptoJS.AES.encrypt(text,pass).toString();return enc},decrypt:function(text){var dec=CryptoJS.AES.decrypt(text,pass);return dec=dec.toString(CryptoJS.enc.Utf8)}}}),angular.module("chatApp").controller("SideBarCtrl",function($scope,User,Match,$rootScope,$location,Block,Notification,Message,$stateParams,$timeout,socket,chatUtils,$state){Match.getMatchs($rootScope.userId).success(function(datas){async.waterfall([function(cb){initMatchInfo(datas,cb)},function(users,cb){initUsers(users,cb)},function(users,cb){setCurrentChatRoom(users,cb)}],function(err,result){})});var initMatchInfo=function(datas,cb){var users=[];angular.forEach(datas,function(data){var user={};user.id=data.target_id,user.session_id=data.session_id,users.push(user)}),cb(null,users)},initUsers=function(users,cb){async.each(users,initUser,function(err){$scope.users=users,$rootScope.users=users,cb(null,users)})},setCurrentChatRoom=function(users,cb){(""==$stateParams.roomId||""==$stateParams.userId)&&$location.path("/t/"+$scope.users[0].session_id+"/"+$scope.users[0].id),cb(null,users)},initUser=function(user,callback){async.waterfall([function(cb){initInfo(user,cb)},function(user,cb){initNotification(user,cb)},function(user,cb){initBlock(user,cb)}],function(error,user){callback()})},initInfo=function(user,cb){User.getUser(user.id).success(function(data){user.user_name=data.name,user.avatar_url=data.avatar_url,cb(null,user)})},initNotification=function(user,cb){user.noti_num=0,Notification.getNotificationNum(user.id,$rootScope.userId).success(function(data){user.noti_num=data.noti_num,cb(null,user)}).error(function(error){cb(null,user)})},initBlock=function(user,cb){user.block=!1,Block.getBlockStatus($rootScope.userId,user.id).success(function(data){user.block=data.block,cb(null,user)}).error(function(error){cb(null,user)})},updateBlockStatus=function(id){var index=chatUtils.findIndexByUserId(id,$scope.users),block=!$scope.users[index].block;Block.updateBlockStatus($rootScope.userId,id,block).success(function(){$scope.users[index].block=block})},updateNotification=function(data){if(data&&data.from_user_id&&data.to_user_id&&data.noti_num&&data.to_user_id===$rootScope.userId&&data.from_user_id!=$stateParams.userId){var user=_.findWhere($scope.users,{id:data.from_user_id});user.noti_num=data.noti_num}};$scope.blockUser=function($event,id){$event.stopPropagation(),updateBlockStatus(id)},$scope.go=function(user){$rootScope.targetUserName=user.user_name,$rootScope.targetAvatarUrl=user.avatar_url,$location.path("/t/"+user.session_id+"/"+user.id)},socket.on("notification:save",updateNotification)});
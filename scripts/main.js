/*Begin 2016 Jun 27 8:30 p.m.*/
/*End 2016 Jun 27 10:00 a.m.*/

(function(w, d){
    'use strict';

    var Show = function(){
            this.$nodeThumbPhotoAlbum = $('#thumbnailPhotoAlbums');
            this.$nodeItemsInAlbum = $('#itemsInPhotoAlbum');
            this.$nodeAlbumInPhotoList = $('#albumInPhotoList');
            this.mappingsDirectory = {
                'user':'albums'
            };
    };
    Show.prototype = {
        constructor:Show,
        initDomListeners:function(options){
            var arryIds = options.ids;
            var $node = null;
            var that = this;
            arryIds.forEach(function(id){
                var $node = $('#' + id);
                $node.on('click', {context:that, parentId:id}, that.getData); // using delegation
            });   
        },
        getData:function(e, paramDataFromTriggerHandler){
            // decide which data to get
            var event = e || false;
            var that = null;
            var target = null;
            var strTargetDataId = null;
            var strParentId = null;
            var strDirectory = null;

            if(!!event){
                event.stopPropagation();
                target = event.target || false; // check if parent node clicked on
                strTargetDataId = target.getAttribute('data_id');
                strParentId = event.data.parentId;
                that = event.data.context;
                strDirectory = that.mappingsDirectory[strParentId]; // mappings parent ids to directory on http request             

                jvm.httpRequest.fnc.getData({
                    path:'http://jsonplaceholder.typicode.com/' + strDirectory + '?postId=' + strTargetDataId,
                    cache:'false',
                    fileType:'json',
                    $node:$('#container'),
                    nodeTarget:target,
                    event:'data:retrieved'
                }); 

            }else{ // initializing app.
                jvm.httpRequest.fnc.getData({
                    path:'http://jsonplaceholder.typicode.com/users',
                    cache:'false',
                    fileType:'json',
                    $node:$('#container'),
                    nodeTarget:null,
                    event:'data:retrieved'
                });
            }

        },
        print:function(options){
            var json = options.data;
            var that = options.context;
            var $nodeExist = options.$nodeCol;
            var target = options.target || false;
            var frag = d.createDocumentFragment();
            var nodeNewContainer = d.createElement('ul');
            var nodeListItem = null;
            var nodeText = null;
            var strInnerHtml = null;
            $nodeExist.html(''); // clear previous data rendered 

            json.forEach(function(item, index){
                strInnerHtml = item.name || item.title;
                nodeListItem = d.createElement('li');
                nodeListItem.setAttribute('data_id', item.id);
                nodeText = d.createTextNode(strInnerHtml);
                nodeListItem.setAttribute('class', (index % 2) === 0 ? 'evenRow' :  'oddRow');
                nodeListItem.appendChild(nodeText);
                frag.appendChild(nodeListItem);
            });
            $nodeExist.append(frag);

        },
        render:function(e, paramData, paramTarget){
            var that = e.data.context; // scoping
            var json = paramData;
            var jsonToRender = [];
            var event = e;
            var target = paramTarget || false;
            var strTargetId = target ? target.getAttribute('data_id') : null;

            for(var i = 0, len = json.length; i < len; i++){
                   if(json[i].userId == strTargetId){
                    jsonToRender.push(json[i]);
                   }
            }
            
            if('address' in json[0]){
                that.print({data:json, context:that, target:target, $nodeCol:$('#user')});
            }else if('userId' in json[0]){
                that.print({data:jsonToRender, context:that, target:target, $nodeCol:$('#thumbnailPhotoAlbums')});
            }

        }
    };
    var User = function(){
        this.superClass.call(this);
    };
    jvm.util.fnc.extend(User, Show); // allows for future expansion
    
    var main = function(){       
        var user = new User();

        jvm.dom.setListener({ // define custom event for httpRequest to trigger once data retrieved
            $node:$('#container'),
            event:'data:retrieved',
            data:{context:user},
            listener:user.render
        });
        user.getData();
        user.initDomListeners({
            ids:['user', 'thumbnailPhotoAlbums', 'itemsInPhotoAlbum', 'albumInPhotoList']
        });        
    };

    var interval = w.setInterval(function(){ // do not need jQuery to wait for DOM
        if(d.getElementsByTagName('div').length > 0){
            w.clearInterval(interval);
            main();
        }
    }, 33);

})(window, document);
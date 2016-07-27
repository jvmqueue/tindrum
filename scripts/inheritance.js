var jvm = jvm || {};
jvm.util = (function(){
    var _fnc = {
        extend:function(subClass, superClass){
            for(name in superClass.prototype){
                if(!subClass.prototype[name]){
                    subClass.prototype[name] = superClass.prototype[name];
                }
            }
            subClass.prototype.superClass = superClass;
        }
    };
    return{fnc:_fnc};
})();
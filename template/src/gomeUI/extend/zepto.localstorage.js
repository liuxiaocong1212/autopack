;(function($) {
  var supported = true;
  var keyMeta = '_';

  if (typeof localStorage == 'undefined' || typeof JSON == 'undefined'){
      supported = false;
  }

  this.storageError = function(error){
    switch(error){
      case 'SUPPORTED':
        break;

      case 'QUOTA':
        break;

      default:
        break;
    }
    return true;
  };

  this.setStorage= function(itemKey, itemValue){

    try{
      localStorage.setItem(keyMeta+itemKey.toString(), JSON.stringify(itemValue));
    } catch (e){
      if (e == QUOTA_EXCEEDED_ERR) {
        this.storageError('QUOTA');
        return false;
      }
    }
    return true;
  };

  this.getStorage = function(itemKey){
    if(itemKey===null){ return null; }

    var data = localStorage.getItem(keyMeta+itemKey.toString());
    if (data){
      return JSON.parse(data);
    }else{
      return false;
    }
  };

  this.deleteStorage = function (itemKey){
    localStorage.removeItem(keyMeta+itemKey.toString());
    return true;
  };

  this.deleteAllStorage = function(){
    localStorage.clear();
    return true;
  };

  $.storage = this;
})(Zepto);
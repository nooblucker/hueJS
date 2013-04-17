define(function() {
        
    function Bridge(internalIP) {
        this.ip = internalIP;
    }
    
    Bridge.prototype.getApiUrl = function() {
        return 'http://'+this.ip+'/api';
    }
    
    return Bridge;
    
});
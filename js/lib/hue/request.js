define(['jquery'], function($) {
    
    function Request(options) {
        this.params = $.extend(true, {
            url: '',
            body: {},
            method: 'GET'
        }, options);
        
        return this.send();
    }
    
    Request.prototype.send = function() {
        return $.ajax({
            url: this.params.url,
            type: this.params.method,
            data: this.params.body
        });
    }
    
    return Request;
    
});
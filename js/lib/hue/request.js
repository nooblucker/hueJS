define(['backbone'], function(Backbone) {
    
    return Backbone.Model.extend({
        
        defaults: {
            url: '',
            body: null,
            method: 'GET'
        },
        
        send: function() {
            var options = {
                url: this.get('url'),
                type: this.get('method'),
                dataType: 'json'
            };
            if (this.get('body')) {
                options.data = JSON.stringify(this.get('body'));
                options.contentType = "application/json; charset=utf-8";
            }
            return Backbone.ajax(options);
        }
        
    });
    
});
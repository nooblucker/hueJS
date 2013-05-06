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
                type: this.get('method')
            };
            if (this.get('body')) {
                options.data = JSON.stringify(this.get('body'));
            }
            return Backbone.ajax(options);
        }
        
    });
    
});
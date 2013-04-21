define(['backbone'], function(Backbone) {
    
    return Backbone.Model.extend({
        
        defaults: {
            url: '',
            body: {},
            method: 'GET'
        },
        
        send: function() {
            return Backbone.ajax({
                url: this.get('url'),
                type: this.get('method'),
                data: this.get('body')
            });
        }
        
    });
    
});
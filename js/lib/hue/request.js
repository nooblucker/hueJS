define(['jquery', 'backbone'], function($, Backbone) {
    
    return Backbone.Model.extend({
        
        defaults: {
            url: '',
            body: {},
            method: 'GET'
        },
        
        send: function() {
            return $.ajax({
                url: this.get('url'),
                type: this.get('method'),
                data: this.get('body')
            });
        }
        
    });
    
});
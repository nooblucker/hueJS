define(['backbone'], function(Backbone) {
        
    return Backbone.Model.extend({
        urlRoot: function() {
            return this.get('bridge').getApiUrl()+'/lights';
        }
    });
    
});
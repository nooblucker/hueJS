$(function() {
    $("#request").on("submit", function(event) {
        event.preventDefault();

        var url = $("#req-url").val();
        var method = $("input[name='req-method']:checked").val();
        var body = $("#req-body").val();
        var data;
        try {
            if (body !== "")
            data = $.parseJSON(body);
        } catch (e) {
            alert('malformed json: ' + e);
            return;
        }
        
        $("#log").prepend("<div class='request'>"+method+" "+url+" <pre>"+body+"</pre></div>");
        
        var req = $.ajax({
            url: url,
            method: method,
            data: data,
            dataType: "json"
        });
        
        req.done(function(response) {
            $("#log").prepend("<div class='response'><pre>"+response+"</pre></div>");
        });
        
        req.fail(function(response) {
            alert(response.status + " " + response.statusText);
        });
        
    });
});
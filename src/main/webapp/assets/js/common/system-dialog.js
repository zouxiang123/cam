SystemDialog = {
    modal : function(status) {
        this.view.modal(status);
    },
    set : function(json) {
        $("#SystemDialog .dialog-btn-ok").unbind("click");
        this.view.set(json);
    },
    callback : function(callback) {
        $("#SystemDialog .dialog-btn-ok").click(function() {
            callback.call(this);
        });
    }
};
SystemDialog.view = {
    modal : function(status) {
        $("#SystemDialog").modal(status);
    },
    set : function(json) {
        $("#SystemDialog").css("z-index", "99999");
        $("#SystemDialog .modal-message").html("");

        $("#modal-icon").removeClass();
        $("#modal-icon").addClass("modal-icon");
        if (json.type == "confirm") {
            $(".modal-icon").addClass("modal-icon-ok");
        } else if (json.type == "warn") {
            $(".modal-icon").addClass("modal-icon-err");
        } else if (json.type == "info") {
            $(".modal-icon").addClass("modal-icon-info");
        }

        $("#SystemDialog .dialog-btn-ok").removeClass("dialog-btn-size");
        $("#SystemDialog .dialog-btn-close").removeClass("dialog-btn-size");

        $("#SystemDialog .dialog-btn-ok").removeClass("dialog-btn-big-size");
        $("#SystemDialog .dialog-btn-close").removeClass("dialog-btn-big-size");

        if (json.cancelable != true) {
            $("#SystemDialog .dialog-btn-close").hide();
            $("#SystemDialog .dialog-btn-ok").addClass("dialog-btn-big-size");
        } else {
            $("#SystemDialog .dialog-btn-close").show();
            $("#SystemDialog .dialog-btn-ok").addClass("dialog-btn-size");
            $("#SystemDialog .dialog-btn-close").addClass("dialog-btn-size");
        }

        var msg = new Array();
        var index = 0;
        for ( var key in json.messages) {
            if (json.messages.hasOwnProperty(key)) {
                msg[index] = json.messages[key];
                index++;
            }
        }
        var msglist = "";
        if (index == 1) {
            $(".modal-message-layout").addClass("text-center");
            msglist = msg[0];
        } else {
            $(".modal-message-layout").addClass("text-left");
            for (var i = 0; i < msg.length; i++) {
                msglist += (i + 1) + ". " + msg[i] + "<br/>";
            }
        }

        $("#SystemDialog .modal-message").html(msglist);
    }
};
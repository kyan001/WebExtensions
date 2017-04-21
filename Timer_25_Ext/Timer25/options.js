function load_options(){
    chrome.storage.sync.get({msgStyle: 'notif'}, function(items) {
        var msg_style_ele = document.getElementsByName('msg-style')
        for(var i=0; i < msg_style_ele.length; i++){
            if(msg_style_ele[i].value == items.msgStyle){
                msg_style_ele[i].checked = true
            }
        }
    });
}
function save_options(){
    var msg_style_ele = document.getElementsByName('msg-style')
    var msg_style = 'notif'  // default
    for(var i=0; i < msg_style_ele.length; i++){
        if(msg_style_ele[i].checked){
            msg_style = msg_style_ele[i].value
        }
    }
    chrome.storage.sync.set({msgStyle: msg_style}, function(){
        var status = document.getElementById('status-' + msg_style);
        status.textContent = 'Saved!';
        setTimeout(function() {
            status.textContent = '';
        }, 1000);
    });
}

document.addEventListener('DOMContentLoaded', load_options);
document.getElementsByName('msg-style').forEach(function(val, ind, arr){
    arr[ind].addEventListener('click', save_options);
})

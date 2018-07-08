function load_options(){
    chrome.storage.sync.get({msgStyle: "notif"}, function(items) {
        var msgstyle_input_list = document.querySelectorAll("input[name='msgstyle'")
        for(var i=0; i < msgstyle_input_list.length; i++){
            var current_ele = msgstyle_input_list[i]
            if (current_ele.value == items.msgStyle){
                current_ele.checked = true
            }
        }
    })
}

var stts_clr_tmr
function save_options(){
    var msgstyle_input_list = document.querySelectorAll("input[name='msgstyle'")
    var msgstyle = "notif"  // default
    for(var i=0; i < msgstyle_input_list.length; i++){
        var current_ele = msgstyle_input_list[i]
        if (current_ele.checked){
            msgstyle = current_ele.value
        }
    }
    chrome.storage.sync.set({msgStyle: msgstyle}, function(){
        var status = document.querySelector("#status")
        status.style.display = "inline"
        clearTimeout(stts_clr_tmr)
        stts_clr_tmr = setTimeout(function() {
            status.style.display = "none"
        }, 1000)
    })
}

function i18n(){
    document.getElementById("msgstyle__label").innerHTML = chrome.i18n.getMessage("messageBoxStyle")
    document.querySelector("#status").textContent = chrome.i18n.getMessage("saved")
}

// document.ready events
document.addEventListener("DOMContentLoaded", load_options)
document.addEventListener("DOMContentLoaded", i18n)

// click events
document.querySelectorAll("input[name='msgstyle']").forEach(function(val, ind, arr){
    arr[ind].addEventListener("click", save_options)
})
document.querySelectorAll("img.as-radio").forEach(function(val, ind, arr){
    arr[ind].addEventListener("click", function(){
        this.parentNode.parentNode.querySelector("input[name='msgstyle']").click()
    })
})

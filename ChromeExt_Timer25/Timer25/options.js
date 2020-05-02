function load_options () {
    chrome.storage.sync.get({ msgStyle: "notif", playSound: "no", reqClick: "yes" }, function (items) {
        /* message style part */
        var msgstyle_input_list = document.querySelectorAll("input[name='msgstyle']")
        for (var i=0; i < msgstyle_input_list.length; i++) {
            var current_ele = msgstyle_input_list[i]
            if (current_ele.value == items.msgStyle){
                current_ele.checked = true
            }
        }
        /* play sound part */
        var playsound_input = document.querySelector("input[name='playsound']")
        playsound_input.checked = items.playSound === 'yes' ? true : false
        /* notification require click */
        var reqclick_input = document.querySelector("input[name='reqclick']")
        reqclick_input.checked = items.reqClick === 'yes' ? true : false
    })
}

var stts_clr_tmr
function save_options () {
    /* message style part */
    var msgstyle_input_list = document.querySelectorAll("input[name='msgstyle']")
    var msgstyle = "notif"  // default
    for (var i=0; i < msgstyle_input_list.length; i++) {
        var current_ele = msgstyle_input_list[i]
        if (current_ele.checked) {
            msgstyle = current_ele.value
        }
    }
    /* play sound part */
    var playsound_input = document.querySelector("input[name='playsound']")
    var playsound_value = playsound_input.checked ? "yes" : "no"
    /* notification require click */
    var requireclick_input = document.querySelector("input[name='reqclick']")
    var requireclick_value = requireclick_input.checked ? "yes" : "no"
    /* save */
    chrome.storage.sync.set(
        {
            msgStyle: msgstyle,
            playSound: playsound_value,
            reqClick: requireclick_value,
        }, function () {
            var status = document.querySelector("#status")
            status.style.display = "inline"
            clearTimeout(stts_clr_tmr)
            stts_clr_tmr = setTimeout(function () {
                status.style.display = "none"
            }, 1000)
        }
    )
}

function i18n () {
    document.getElementById("msgstyle__label").innerHTML = chrome.i18n.getMessage("messageBoxStyle")
    document.getElementById("extraoption__label").innerHTML = chrome.i18n.getMessage("extraOptions")
    document.querySelector("#status").textContent = chrome.i18n.getMessage("saved")
    document.querySelector("#isplaysound").textContent = chrome.i18n.getMessage("playSoundOption")
    document.querySelector("#isreqclick").textContent = chrome.i18n.getMessage("requireClickOption")
    document.querySelector("#non25timer").textContent = chrome.i18n.getMessage("setNon25Timer")
}

document.querySelector(".innerlink").addEventListener("click", function () {
    var href = this.getAttribute("href")
    var target = this.getAttribute("target")
    if (target == "_blank") {
        window.open(href)
    } else {
        window.location.href = href
    }
    return false
})

// document.ready events
document.addEventListener("DOMContentLoaded", load_options)
document.addEventListener("DOMContentLoaded", i18n)

// click events
document.querySelectorAll("input[name='msgstyle']").forEach(function (val, ind, arr) {
    arr[ind].addEventListener("click", save_options)
})
document.querySelectorAll("input[name='playsound']").forEach(function (val, ind, arr) {
    arr[ind].addEventListener("click", save_options)
})
document.querySelectorAll("input[name='reqclick']").forEach(function (val, ind, arr) {
    arr[ind].addEventListener("click", save_options)
})
document.querySelectorAll(".as-msgstyle-radio").forEach(function (val, ind, arr) {
    arr[ind].addEventListener("click", function () {
        this.parentNode.parentNode.querySelector("input[name='msgstyle']").click()
    })
})
document.querySelectorAll(".as-playsound-checkbox").forEach(function (val, ind, arr) {
    arr[ind].addEventListener("click", function () {
        this.parentNode.parentNode.querySelector("input[name='playsound']").click()
    })
})
document.querySelectorAll(".as-reqclick-checkbox").forEach(function (val, ind, arr) {
    arr[ind].addEventListener("click", function () {
        this.parentNode.parentNode.querySelector("input[name='reqclick']").click()
    })
})

function pop_notification () {
    var text = chrome.i18n.getMessage("messageBoxHere")
    var require_click = document.querySelector("input[name='reqclick']").checked
    chrome.notifications.create({
        type: 'basic',
        iconUrl: 'Timer.png',
        title: text,
        message: "",
        contextMessage: (new Date()).toLocaleTimeString(),  // in gray text
        eventTime: Date.now(),  // add a event time stamp
        isClickable: true,  // show hand pointer when hover
        requireInteraction: require_click,  // if true, do not close until click
    })
}
// play option's example
document.querySelector("#playsound__btn").addEventListener("click", function () {
    var sound = new Audio("sound.mp3")
    sound.play()
})
document.querySelector("#msgstyle_notif__btn").addEventListener("click", pop_notification)
document.querySelector("#reqclick__btn").addEventListener("click", pop_notification)
document.querySelector("#msgstyle_alert__btn").addEventListener("click", function () {
    var text = chrome.i18n.getMessage("messageBoxHere")
    chrome.extension.getBackgroundPage().alert(text + '\n\n' + (new Date()).toLocaleTimeString())
})
chrome.notifications.onClicked.addListener(function (notificationid) {
    chrome.notifications.clear(notificationid)
})
document.querySelector("#non25timer__btn").addEventListener("click", function () {
    var text = chrome.extension.getBackgroundPage().prompt("`timer 5` → ◔5:00", "5")
    if (text !== null) {
        chrome.extension.getBackgroundPage().setNon25Timer(text)
    }
})

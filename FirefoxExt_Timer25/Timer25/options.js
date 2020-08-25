var sound = new Audio("sound.mp3")

function load_options () {
    browser.storage.sync.get({ showNotif: "yes", playSound: "no" }, function (items) {
        /* show notif part */
        var shownotif_input = document.querySelector("input[name='shownotif']")
        shownotif_input.checked = items.showNotif === 'yes' ? true : false
        /* play sound part */
        var playsound_input = document.querySelector("input[name='playsound']")
        playsound_input.checked = items.playSound === 'yes' ? true : false
    })
    /* default countdown */
    var dcd_input = document.querySelector("input[name='defcountdown']")
    dcd_input.value = localStorage.getItem('defCountdown') || 25
}

var stts_clr_tmr
function save_options () {
    /* show notif part */
    var shownotif_input = document.querySelector("input[name='shownotif']")
    var shownotif_value = shownotif_input.checked ? "yes" : "no"
    /* play sound part */
    var playsound_input = document.querySelector("input[name='playsound']")
    var playsound_value = playsound_input.checked ? "yes" : "no"
    /* default countdown */
    var dcd_input = document.querySelector("input[name='defcountdown']")
    var dcd_value = ( dcd_input.value === "" || isNaN(dcd_input.value) )
        ? 25
        : parseInt(dcd_input.value)
    /* save */
    browser.storage.sync.set({showNotif: shownotif_value, playSound: playsound_value}, function () {
        var status = document.querySelector("#status")
        status.style.display = "inline"
        clearTimeout(stts_clr_tmr)
        stts_clr_tmr = setTimeout(function () {
            status.style.display = "none"
        }, 1000)
    })
    localStorage.setItem("defCountdown", dcd_value)
}

function update_countdown_label () {
    var dcd_input = document.querySelector("input[name='defcountdown']")
    var dcd_label = dcd_input.parentNode.parentNode.querySelector("label")
    dcd_label.textContent = "(" + parseInt(dcd_input.value).toString() + ":00)"
}

function i18n () {
    document.getElementById("notifstyle__session").textContent = browser.i18n.getMessage("notifStyle")
    document.getElementById("extraoption__session").textContent = browser.i18n.getMessage("extraOptions")
    document.querySelector("#status").textContent = browser.i18n.getMessage("saved")
    document.querySelector("#isshownotif").textContent = browser.i18n.getMessage("showNotifOption")
    document.querySelector("#isplaysound").textContent = browser.i18n.getMessage("playSoundOption")
    document.querySelector("#non25timer").textContent = browser.i18n.getMessage("setNon25Timer")
    document.querySelector("#countdown__session").textContent = chrome.i18n.getMessage("countdownOptions")
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
document.addEventListener("DOMContentLoaded", update_countdown_label)

// click events
document.querySelectorAll("input[name='playsound']").forEach(function (val, ind, arr) {
    arr[ind].addEventListener("click", save_options)
})
document.querySelectorAll("input[name='shownotif']").forEach(function (val, ind, arr) {
    arr[ind].addEventListener("click", save_options)
})
document.querySelectorAll(".as-playsound-checkbox").forEach(function (val, ind, arr) {
    arr[ind].addEventListener("click", function () {
        this.parentNode.parentNode.querySelector("input[name='playsound']").click()
    })
})
document.querySelectorAll(".as-shownotif-checkbox").forEach(function (val, ind, arr) {
    arr[ind].addEventListener("click", function () {
        this.parentNode.parentNode.querySelector("input[name='shownotif']").click()
    })
})

// play option's example
document.querySelector("#playsound__btn").addEventListener("click", function () {
    sound.play()
})
document.querySelector("#shownotif__btn").addEventListener("click", function () {
    var text = browser.i18n.getMessage("notifHere")
    browser.notifications.create({
        type: 'basic',
        iconUrl: 'Timer.png',
        title: text,
        message: (new Date()).toLocaleTimeString(),
        contextMessage: "Timer 25",
        eventTime: Date.now()  // add a event time stamp
    })
})
document.querySelector("#non25timer__btn").addEventListener("click", function () {
    var text = prompt("5 → ◔5:00", "5")
    if (text !== null) {
        browser.extension.getBackgroundPage().setNon25Timer(text)
    }
})

// countdown time settings
document.querySelectorAll("input[name='defcountdown']").forEach(function (val, ind, arr) {
    arr[ind].addEventListener("change", save_options)
})
document.querySelectorAll("input[name='defcountdown']").forEach(function (val, ind, arr) {
    arr[ind].addEventListener("input", update_countdown_label)
})

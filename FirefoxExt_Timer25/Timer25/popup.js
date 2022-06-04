function load_options () {
    console.log("load_options")
    browser.extension.getBackgroundPage().clickToggle()
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

function update_countdown_label () {
    var dcd_input = document.querySelector("input[name='defcountdown']")
    var dcd_label = dcd_input.parentNode.parentNode.querySelector("label")
    dcd_label.textContent = "(" + parseInt(dcd_input.value).toString() + ":00)"
}

function i18n () {
    document.getElementById("notifstyle__session").textContent = browser.i18n.getMessage("notifStyle")
    document.querySelector("#status").textContent = browser.i18n.getMessage("saved")
    document.querySelector("#isshownotif").textContent = browser.i18n.getMessage("showNotifOption")
    document.querySelector("#isplaysound").textContent = browser.i18n.getMessage("playSoundOption")
    document.querySelector("#overwriteOnce").textContent = chrome.i18n.getMessage("overwriteOnce")
}

// document.ready events
document.addEventListener("DOMContentLoaded", load_options)
document.addEventListener("DOMContentLoaded", i18n)
document.addEventListener("DOMContentLoaded", update_countdown_label)

// click events
document.getElementById('playsound').addEventListener("click", async function () {
    browser.storage.sync.set({ playSound: document.getElementById('playsound').checked ? 'yes' : 'no' })
})
document.getElementById('shownotif').addEventListener("click", async function () {
    browser.storage.sync.set({ showNotif: document.getElementById('shownotif').checked ? 'yes' : 'no' })
})

// countdown time settings
document.querySelectorAll("input[name='defcountdown']").forEach(function (val, ind, arr) {
    arr[ind].addEventListener("input", () => {
        update_countdown_label()
        const value = document.getElementById('countdown__input').value
        if (value !== null) {
            browser.extension.getBackgroundPage().setNon25Timer(value)
        }
    })
})

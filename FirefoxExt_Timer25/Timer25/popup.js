function load_options () {
    browser.extension.getBackgroundPage().clickToggle()
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
    document.querySelector("#overwriteOnce").textContent = chrome.i18n.getMessage("overwriteOnce")
}

// document.ready events
document.addEventListener("DOMContentLoaded", load_options)
document.addEventListener("DOMContentLoaded", i18n)
document.addEventListener("DOMContentLoaded", update_countdown_label)

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

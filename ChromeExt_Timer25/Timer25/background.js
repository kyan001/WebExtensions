// @author Kyan
var current = 25
var count_timer
var running = false
var sound = new Audio("sound.mp3")
var messages = [
    'Enjoy your time.',
    "Yesterday's the past, tomorrow's the future, but today is a gift. That's why it's called the present.",
    "Better three hours too soon than a minute too late.",
    "No matter how busy you are, you must take time to make the other person feel important.",
    "Lost time is never found again.",
    "Time flies over us, but leaves its shadow behind.",
    "Time is what we want most, but what we use worst.",
    "Patience and time do more than strength or passion.",
    "We must use time wisely and forever realize that the time is always ripe to do right.",
    "If you spend too much time thinking about a thing, you'll never get it done.",
    "The time you enjoy wasting is not wasted time.",
    "Time is the most valuable thing a man can spend.",
    "Time and tide wait for no man.",
    "If you don't have time to do it right, when will you have time to do it over?",
]

function reset () {
    window.current = localStorage.getItem("defCountdown") || 25
    clearTimeout(count_timer)
    chrome.browserAction.setBadgeText({ text: "" })
}

function updateTimerIcon () {
    if (window.current <= 0) {
        stop()
        popMessageBox()
        return
    }
    count_timer = setTimeout(updateTimerIcon, 60000)  // per 60 sec
    chrome.browserAction.setBadgeText({ text: window.current.toString() + "'" })
    window.current--
}

function popAlert () {
    var message_index = Math.round(Math.random() * (messages.length - 1))
    var message = '"' + messages[message_index] + '"'
    alert(chrome.i18n.getMessage("timeUp") + '\n\n' + message + '\n\n' + (new Date()).toLocaleTimeString())
}

function popNotification () {
    var message_index = Math.round(Math.random()*(messages.length-1))
    var message = '"' + messages[message_index] + '"'
    chrome.storage.sync.get({ reqClick: 'yes' }, function (items) {
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'Timer.png',
            title: chrome.i18n.getMessage("timeUp"),
            message: message,
            contextMessage: (new Date()).toLocaleTimeString(),  // in gray text
            eventTime: Date.now(),  // add a event time stamp
            isClickable: true,  // show hand pointer when hover
            requireInteraction: (items.reqClick === 'yes'),  // if true, do not close until click
        })
    })
}

function popMessageBox () {
    chrome.storage.sync.get({ msgStyle: 'notif', playSound: 'no' }, function (items) {
        var msgBoxFunction
        switch (items.msgStyle) {
            case 'notif':
                msgBoxFunction = popNotification
                break
            case 'alert':
                msgBoxFunction = popAlert
                break
            default:
                alert('Message Style Option "' + ites.msgStyle + '" is not valid')
                return false
        }
        if (items.playSound === 'yes') {
            sound.play()
            setTimeout(msgBoxFunction, 10)  // prevent "alert()" blocks the playing sound.
        } else {
            msgBoxFunction()
        }
    })
}

function start () {
    window.running = true
    updateTimerIcon()
}

function stop () {
    reset()
    window.running = false
}

function clickToggle() {
    reset()
    if (window.running) {
        // stop() -> reset()
        stop()
    } else {
        // start() -> updateTimerIcon()*25 -> popMessageBox() -> popAlert()/popNotification()
        start()
    }
}

function setNon25Timer(text) {
    if (text === "" || isNaN(text)) {
        alert('"' + text + '" ' + chrome.i18n.getMessage("isNotANumber"))
        return false
    }
    stop()
    window.current = parseInt(text)
    start()
    return true
}

chrome.browserAction.onClicked.addListener(clickToggle)
chrome.browserAction.setIcon({ path: "Timer.png" })
chrome.browserAction.setBadgeText({ text: "" })
chrome.notifications.onClicked.addListener(function (notificationid) {
    chrome.notifications.clear(notificationid)
})
chrome.omnibox.onInputEntered.addListener(function (text, disposition) {
    // use chrome address bar and entered a number
    return setNon25Timer(text)
})
chrome.omnibox.setDefaultSuggestion({
    "description": "`timer 5` → ◔5:00"
})

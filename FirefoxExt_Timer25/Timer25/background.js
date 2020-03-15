// @author Kyan
var current
var count_timer
var running = false
var sound = new Audio("sound.mp3")
var messages = [
    "Enjoy your time.",
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
    current = 25
    clearTimeout(count_timer)
    browser.browserAction.setBadgeText({ text: "" })
}

function updateTimerIcon () {
    if (current <= 0) {
        stop()
        popMessageBox()
        return
    }
    count_timer = setTimeout(updateTimerIcon, 60000)  // per 60 sec
    browser.browserAction.setBadgeText({text: current.toString() + "'"})
    current--
}

function popNotification () {
    message_index = Math.round(Math.random() * (messages.length - 1))
    message = '"' + messages[message_index] + '"'
    browser.notifications.create({
        type: 'basic',
        iconUrl: 'Timer.png',
        title: browser.i18n.getMessage("timeUp"),
        message: message,
        contextMessage: (new Date()).toLocaleTimeString(),  // in gray text
        eventTime: Date.now(),  // add a event time stamp
        priority: 2
    })
}

function popMessageBox () {
    browser.storage.sync.get({ showNotif: 'yes', playSound: 'no' }, function (items) {
        if (items.showNotif === 'yes') {
            popNotification()
        }
        if (items.playSound === 'yes') {
            sound.play()
        }
    })
}

function start () {
    running = true
    updateTimerIcon()
}

function stop () {
    reset()
    running = false
}

function clickToggle() {
    reset()
    if (running) {
        // stop() -> reset()
        stop()
    } else {
        // start() -> updateTimerIcon()*25 -> popMessageBox() -> noNotification()/popNotification()
        start()
    }
}

function setNon25Timer(text) {
    text = text.trim()
    if (!text || isNaN(text)) {
        browser.notifications.create({
            type: 'basic',
            iconUrl: 'Timer.png',
            title: '✖!!!',
            message: '"' + text + '" ' + browser.i18n.getMessage("isNotANumber"),
            contextMessage: "Timer 25",
            eventTime: Date.now()  // add a event time stamp
        })
        return false
    }
    stop()
    current = parseInt(text)
    start()
    return true
}

browser.browserAction.onClicked.addListener(clickToggle)
browser.browserAction.setIcon({ path: "Timer.png" })
browser.browserAction.setBadgeText({ text: "" })
browser.omnibox.onInputEntered.addListener(function (text, disposition) {
    // use browser address bar and entered a number
    if (text === "option") {
        browser.runtime.openOptionsPage()
        return true
    }
    return setNon25Timer(text)
})
// browser.omnibox.setDefaultSuggestion({
//     "description": "Timer 25"
// })
browser.omnibox.onInputChanged.addListener((text, suggest) => {
    if (!text || isNaN(text)) {
        return null
    }
    let suggestions = [{
        content: text + " ",
        description: "⏱" + text + ":00"
    }]
    suggest(suggestions)
})

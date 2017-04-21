// @author Kyan
var current
var count_timer
var alert_timer
var running = false
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

function reset(){
    current = 25
    clearTimeout(count_timer);
    chrome.browserAction.setBadgeText({text: ""});
}

function updateTimerIcon(){
    if (current == 0) {
        stop()
        popMessageBox()
        return
    }
    count_timer = setTimeout("updateTimerIcon()", 60);  // per 60 sec
    chrome.browserAction.setBadgeText({text: current.toString()+"m"});
    current--;
}

function popAlert(){
    message_index = Math.round(Math.random()*(messages.length-1))
    message = '"' + messages[message_index] + '"'
    alert("TIME'S UP!" + '\n\n' + message + '\n\n' + (new Date()).toLocaleTimeString())
}

function popNotification(){
    message_index = Math.round(Math.random()*(messages.length-1))
    message = '"' + messages[message_index] + '"'
    chrome.notifications.create({
        type: 'basic',
        iconUrl: 'Timer.png',
        title: "TIME'S UP",
        message: message,
        contextMessage: (new Date()).toLocaleTimeString(),  // in gray text
        eventTime: Date.now(),  // add a event time stamp
        isClickable: true,  // show hand pointer when hover
        requireInteraction: true,  // do not close until click
    })
}

function popMessageBox(){
    chrome.storage.sync.get({msgStyle: 'notif'}, function(items){
        switch (items.msgStyle) {
            case 'notif':
                popNotification()
                break;
            case 'alert':
                popAlert()
                break;
            default:
                alert('Message Style Option ' + ites.msgStyle + ' is not valid')
        }
    });
}

function start(){
    running = true
    updateTimerIcon()
}

function stop(){
    reset()
    running = false
}

function clickToggle() {
    reset()
    if (running) {
        // stop() -> reset()
        stop()
    } else {
        // start() -> updateTimerIcon()*25 -> popMessageBox() -> popAlert()/popNotification()
        start()
    }
}

chrome.browserAction.onClicked.addListener(clickToggle);
chrome.browserAction.setIcon({path: "Timer.png"});
chrome.browserAction.setBadgeText({text: ""});
chrome.notifications.onClicked.addListener(function(notificationid){
    chrome.notifications.clear(notificationid)
})

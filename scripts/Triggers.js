function _CheckTrigger(Trigger) {
    var triggers = ScriptApp.getProjectTriggers();
    for (var i = 0; i < triggers.length; i++) {
        if (triggers[i].getHandlerFunction() == Trigger) {
            return true;
        }
    }
    return false;
}

function _CreateTrigger() {
    ScriptApp.newTrigger('Trigger_loaded')
        .timeBased()
        .everyMinutes(30)
        .create();
}

function _RemoveTriggers() {
    var triggers = ScriptApp.getProjectTriggers();
    for (var i = 0; i < triggers.length; i++) {
            ScriptApp.deleteTrigger(triggers[i]);
    }
    return true
}
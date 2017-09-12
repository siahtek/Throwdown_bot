function checkTrigger( aTrigger ) {
    var myTriggers = ScriptApp.getProjectTriggers();
    for ( var i = 0; i < myTriggers.length; i++ ) {
        if ( myTriggers[ i ].getHandlerFunction() == aTrigger ) {
            return true;
        }
    }
    return false;
}

function createTrigger() {
    ScriptApp.newTrigger( 'Trigger_loaded' ).timeBased().everyMinutes( 30 ).create();
}

function removeTriggers() {
    var myTriggers = ScriptApp.getProjectTriggers();
    for ( var i = 0; i < myTriggers.length; i++ ) {
        ScriptApp.deleteTrigger( myTriggers[ i ] );
    }
    return true
}

/**
* Checks if trigger is created.
* @return true/false
*/
function checkTrigger( aTrigger ) {
    var myTriggers = ScriptApp.getProjectTriggers();
    for ( var i = 0; i < myTriggers.length; i++ ) {
        if ( myTriggers[ i ].getHandlerFunction() == aTrigger ) {
            return true;
        }
    }
    return false;
}

/**
* Create 30 minute looping trigger to run the script.
*/
function createTrigger() {
    ScriptApp.newTrigger( 'Trigger_loaded' ).timeBased().everyMinutes( 30 ).create();
}

/**
* remove all triggers for this project.
* @return true
*/
function removeTriggers() {
    var myTriggers = ScriptApp.getProjectTriggers();
    for ( var i = 0; i < myTriggers.length; i++ ) {
        ScriptApp.deleteTrigger( myTriggers[ i ] );
    }
    return true
}

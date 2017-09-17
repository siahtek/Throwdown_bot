/**
 * Enable rumble trigger.
 */
function enableRumble() {
    theProperties = PropertiesService.getScriptProperties()
    theSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName( 'Settings' );
    loadUserSettings();
    var myUserAuth = authenticateUser( getProperty( 'User_ID' ), getProperty( 'User_Token' ) );
    if ( myUserAuth == false ) {
        return false
    }
    updateRumble()
    var myRumbleTime = getRumbleTime();
    if ( myRumbleTime != false ) {
        updateNextRumble( true, formattedTimeDate( myRumbleTime ) )
        updateStatus( 'Account ' + getProperty( 'propName' ) + ' Rumble Enabled' );
    }
}
/**
 * Update Trigger.
 */
function updateRumble() {
    theProperties = PropertiesService.getScriptProperties()
    theSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName( 'Settings' );
    var myTriggers = ScriptApp.getProjectTriggers();
    for ( var i = 0; i < myTriggers.length; i++ ) {
        if ( myTriggers[ i ].getHandlerFunction() == 'Rumble_loaded' ) {
            ScriptApp.deleteTrigger( myTriggers[ i ] );
        }
    }
    var myRumbleTime = getRumbleTime();
    if ( myRumbleTime != false ) {
        ScriptApp.newTrigger( "Rumble_loaded" ).timeBased().at( myRumbleTime ).create();
    }
    if ( checkTrigger( 'Rumble_update' ) == false ) {
        ScriptApp.newTrigger( 'Rumble_update' ).timeBased().everyMinutes( 30 ).create();
    }
    updateNextRumble( true, formattedTimeDate( myRumbleTime ) )
}
/**
 * Get Next Rumble time.
 */
function getRumbleTime() {
    var myUrl = getProperty( 'propUrl' );
    var myUnixTime = Math.round( ( new Date() ).getTime() / 1000 );
    var myPanicTime = getProperty( 'Panic time' );
    var myRumble = UrlFetchApp.fetch( myUrl + '&message=getGuildWarStatus' );
    var myRumbleJson = JSON.parse( myRumble );
    if ( myRumbleJson.guild_war_current_match != null ) {
        var myEndTime = myRumbleJson.guild_war_current_match.end_time;
        var myRumbleTime = new Date( ( myEndTime - ( myPanicTime * 60 ) ) * 1000 );
        return myRumbleTime;
    } else {
        false
    }
}
/**
 * Disable rumble trigger.
 */
function disableRumble() {
    var myTriggers = ScriptApp.getProjectTriggers();
    for ( var i = 0; i < myTriggers.length; i++ ) {
        if ( myTriggers[ i ].getHandlerFunction() == 'Rumble_update' ) {
            ScriptApp.deleteTrigger( myTriggers[ i ] );
        }
        if ( myTriggers[ i ].getHandlerFunction() == 'Rumble_loaded' ) {
            ScriptApp.deleteTrigger( myTriggers[ i ] );
        }
    }
    updateNextRumble( false )
}
/**
 * Runs when the trigger calls it
 */
function loadRumble() {
    startRumble();
    updateRumble()
}
/**
 * Manual attack function for rumble.
 */
function fightRumbleManually() {
    startRumble();
}
/**
 * Checks if Rumble parameters are met then attacks.
 */
function startRumble() {
    theProperties = PropertiesService.getScriptProperties();
    theSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName( 'Settings' );
    loadUserSettings();
    setProperty( 'propTimeCount', formattedTime() )
    var myUrl = getProperty( 'propUrl' );
    var myEnergy = getRumbleEnergy()
    Logger.log( 'Energy:' + myEnergy )
    if ( getProperty( 'Rumble Energy Check' ) == 'Enabled' ) {
        if ( myEnergy != 10 ) {
            updateStatus( 'Account ' + getProperty( 'propName' ) + ' Rumble Energy not full.' );
            Logger.log( 'Energy check failed.' )
            return false;
        }
    }
    saveDeck( myUrl );
    setDeck( myUrl, getProperty( 'Rumble Deck' ) );
    for ( var i = 0; i < myEnergy; i++ ) {
        updateStatus( 'Account ' + getProperty( 'propName' ) + ' Rumble Loading..' );
        var myResult = playRumble()
        if ( myResult != false ) {
            addLog( '_logs_Rumble', myResult )
        }
        Logger.log( myResult )
    }
    updateStatus( 'Account ' + getProperty( 'propName' ) + ' Rumble Finished.' );
    setDeck( myUrl, getProperty( 'propDeck' ) );
    WriteLogs()
}
/**
 * Starts an attack on rumble and Auto skip.
 * return false/Attack rewards.
 */
function playRumble() {
    var myUrl = getProperty( 'propUrl' );
    if ( checkIfActive( myUrl ) == true ) {
        return false
    }
    var myReturn = playCard( myUrl + '&message=fightGuildWar' );
    return myReturn;
}
/**
 * Get the cuurent rumble energy.
 * return Rumble energy
 */
function getRumbleEnergy() {
    var myUrl = getProperty( 'propUrl' );
    var myRumble = UrlFetchApp.fetch( myUrl + '&message=getGuildWarStatus' );
    var myRumbleJson = JSON.parse( myRumble );
    var myEnergy = myRumbleJson.guild_war_event_data.energy.current_value;
    return myEnergy
}

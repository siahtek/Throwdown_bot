function playCard( aUrl ) { //Attack script..
    var myStart = UrlFetchApp.fetch( aUrl );
    var myStartJson = JSON.parse( myStart );
    if ( myStartJson.result_message != null ) {
        return false
    }
    if ( myStartJson.hasOwnProperty( 'battle_data' ) != false ) {
        var myBattleId = myStartJson.battle_data.battle_id;
        var myEnd = UrlFetchApp.fetch( getProperty( '_url' ) + '&message=playCard&battle_id=' + myBattleId + '&skip=True' );
        var myEndJson = JSON.parse( myEnd );
        var myRewards = JSON.stringify( myEndJson.battle_data.rewards );
        return myRewards
    } else {
        return ''
    }
}

function setProperty( aLoc, aData ) { //Save data to google sheet
    // var _properties = PropertiesService.getScriptProperties();
    theProperties.setProperty( aLoc, aData );
}

function getProperty( aLoc ) { //get data from google sheet
    // var _properties = PropertiesService.getScriptProperties();
    return theProperties.getProperty( aLoc );
}

function formattedTime() { //return formated time
    var myDate = new Date();
    var ampm = 'AM'
    var myHours = myDate.getHours();
    if ( myHours > 12 ) {
        ampm = 'PM';
        myHours -= 12
    }
    var myTime = ( "0" + ( myDate.getMonth() + 1 ) ).slice( -2 ) + "-" + ( "0" + myDate.getDate() ).slice( -2 ) + "-" + myDate.getFullYear() + " " + ( "0" + myHours ).slice( -2 ) + ":" + ( "0" + myDate.getMinutes() ).slice( -2 ) + ' ' + ampm;
    return myTime
}

function myFormattedTimeNext() { //return formated time
    var mydate = new Date();
    mydate.setMinutes( mydate.getMinutes() + 30 );
    var ampm = 'AM'
    var myHours = mydate.getHours();
    if ( myHours > 12 ) {
        ampm = 'PM';
        myHours -= 12
    }
    var myTime = ( "0" + ( mydate.getMonth() + 1 ) ).slice( -2 ) + "-" + ( "0" + mydate.getDate() ).slice( -2 ) + "-" + mydate.getFullYear() + " " + ( "0" + myHours ).slice( -2 ) + ":" + ( "0" + mydate.getMinutes() ).slice( -2 ) + ' ' + ampm;
    return myTime
}

function checkIfActive( aUrl ) { //True = Found battle.
    var myActiveSite = UrlFetchApp.fetch( aUrl + '&message=playCard' );
    var myActiveJson = JSON.parse( myActiveSite );
    if ( myActiveJson.battle_data.upkept != null ) {
        return true;
    } else {
        return false;
    }
}

function saveDeck( aUrl ) { //Save starting attack deck
    var myUseItemSite = UrlFetchApp.fetch( aUrl + '&message=getUserAccount' );
    var myUseItemJson = JSON.parse( myUseItemSite );
    var myDeck = myUseItemJson.user_data.active_deck;
    setProperty( '_deck', myDeck );
}

function setDeck( aUrl, aDeck ) { //Change attack deck
    var myUseItem = UrlFetchApp.fetch( aUrl + '&message=setActiveDeck&deck_id=' + aDeck );
}

function checkAchievements( aUrl, aId ) {
    //5001 - Daily - Nine to Five
    //5007 - Daily - playAdventure Battles
    //5008 - Daily - To The Arena
    //5009 - Daily - Upgrade Cards
    //5010 - Daily - Buy Packs
    //5012 - Daily - Play 5 Combos
    completeAchievements( aUrl, aId );
    var myDailyMission = UrlFetchApp.fetch( aUrl + '&message=init' );
    var myDailyMissionJson = JSON.parse( myDailyMission );
    if ( myDailyMissionJson.user_achievements.hasOwnProperty( aId ) != false ) {
        return true
    } else {
        return false
    }
}

function completeAchievements( aUrl, aId ) {
    UrlFetchApp.fetch( aUrl + '&message=completeAchievement&achievement_id=' + aId );
}

function Attack( url ) { //Attack script..
    var Start = UrlFetchApp.fetch( url );
    var Start_Json = JSON.parse( Start );
    if ( Start_Json.result_message != null ) {
        return false
    }
    if ( Start_Json.battle_data.hasOwnProperty( 'battle_id' ) != false ) {
        var Battle_id = Start_Json.battle_data.battle_id;
        var End = UrlFetchApp.fetch( getProperty( '_url' ) + '&message=playCard&battle_id=' + Battle_id + '&skip=True' );
        var End_Json = JSON.parse( End );
        var Rewards = JSON.stringify( End_Json.battle_data.rewards );
        return Rewards
    } else {
        return ''
    }
}

function _setp( loc, data ) { //Save data to google sheet
    // var _properties = PropertiesService.getScriptProperties();
    _properties.setProperty( loc, data );
}

function getProperty( loc ) { //get data from google sheet
    // var _properties = PropertiesService.getScriptProperties();
    return _properties.getProperty( loc );
}

function TimeFormated() { //return formated time
    var d = new Date();
    var ampm = 'AM'
    var hours = d.getHours();
    if ( hours > 12 ) {
        ampm = 'PM';
        hours -= 12
    }
    var time = ( "0" + ( d.getMonth() + 1 ) ).slice( -2 ) + "-" + ( "0" + d.getDate() ).slice( -2 ) + "-" + d.getFullYear() + " " + ( "0" + hours ).slice( -2 ) + ":" + ( "0" + d.getMinutes() ).slice( -2 ) + ' ' + ampm;
    return time
}

function TimeFormatedNext() { //return formated time
    var d = new Date();
    d.setMinutes( d.getMinutes() + 30 );
    var ampm = 'AM'
    var hours = d.getHours();
    if ( hours > 12 ) {
        ampm = 'PM';
        hours -= 12
    }
    var time = ( "0" + ( d.getMonth() + 1 ) ).slice( -2 ) + "-" + ( "0" + d.getDate() ).slice( -2 ) + "-" + d.getFullYear() + " " + ( "0" + hours ).slice( -2 ) + ":" + ( "0" + d.getMinutes() ).slice( -2 ) + ' ' + ampm;
    return time
}

function _CheckActive( myUrl ) { //True = Found battle.
    var Active = UrlFetchApp.fetch( myUrl + '&message=playCard' );
    var Active_Json = JSON.parse( Active );
    if ( Active_Json.battle_data.upkept != null ) {
        return true;
    } else {
        return false;
    }
}

function _SaveDeck( myUrl ) { //Save starting attack deck
    var Use_Item = UrlFetchApp.fetch( myUrl + '&message=getUserAccount' );
    var Use_Item_json = JSON.parse( Use_Item );
    var USER_DECK = Use_Item_json.user_data.active_deck;
    _setp( '_deck', USER_DECK );
}

function _ChangeDeck( myUrl, Deck ) { //Change attack deck
    var Use_Item = UrlFetchApp.fetch( myUrl + '&message=setActiveDeck&deck_id=' + Deck );
}

function _CheckAchievemnts( myUrl, ID ) {
    //5001 - Daily - Nine to Five
    //5007 - Daily - playAdventure Battles
    //5008 - Daily - To The Arena
    //5009 - Daily - Upgrade Cards
    //5010 - Daily - Buy Packs
    //5012 - Daily - Play 5 Combos
    _CompleteAchievemnts( myUrl, ID );
    var DailyMission = UrlFetchApp.fetch( myUrl + '&message=init' );
    var DailyMission_Json = JSON.parse( DailyMission );
    if ( DailyMission_Json.user_achievements.hasOwnProperty( ID ) != false ) {
        return true
    } else {
        return false
    }
}

function _CompleteAchievemnts( myUrl, ID ) {
    UrlFetchApp.fetch( myUrl + '&message=completeAchievement&achievement_id=' + ID );
}

function playAdventure() {
    var myUrl = getProperty( '_url' );
    if ( _CheckActive( myUrl ) == true ) {
        return false
    }
    _SaveDeck( myUrl );
    _ChangeDeck( myUrl, getProperty( 'Adventure Deck' ) );
    Logger.log( 'island: ' + myUrl + '&message=startMission&mission_id=' + getProperty( 'Island to farm' ) )
    var myReturn = Attack( myUrl + '&message=startMission&mission_id=' + getProperty( 'Island to farm' ) );
    _ChangeDeck( myUrl, getProperty( '_deck' ) );
    return myReturn
}

function _CheckIsland(URL, ID) {
    var Island = UrlFetchApp.fetch( URL + '&message=init' );
    var Island_Json = JSON.parse( Island );
    if (Island_Json.current_missions.hasOwnProperty(ID) != false ) {
      var IslandCost = Island_Json.current_missions[ID].energy
        return IslandCost
    } else {
        return false
    }
}
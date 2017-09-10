function Adventure() {
    var URL = _getp( '_url' );
    if ( _CheckActive( URL ) == true ) {
        return false
    }
    _SaveDeck( URL );
    _ChangeDeck( URL, _getp( 'Adventure Deck' ) );
    Logger.log( 'island: ' + URL + '&message=startMission&mission_id=' + _getp( 'Island to farm' ) )
    var Adventure = Attack( URL + '&message=startMission&mission_id=' + _getp( 'Island to farm' ) );
    _ChangeDeck( URL, _getp( '_deck' ) );
    return Adventure
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
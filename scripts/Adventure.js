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

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

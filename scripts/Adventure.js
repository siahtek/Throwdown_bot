function playAdventure() {
    var myUrl = getProperty( '_url' );
    if ( checkIfActive( myUrl ) == true ) {
        return false
    }
    saveDeck( myUrl );
    setDeck( myUrl, getProperty( 'Adventure Deck' ) );
    Logger.log( 'island: ' + myUrl + '&message=startMission&mission_id=' + getProperty( 'Island to farm' ) )
    var myReturn = playCard( myUrl + '&message=startMission&mission_id=' + getProperty( 'Island to farm' ) );
    setDeck( myUrl, getProperty( '_deck' ) );
    return myReturn
}

function checkIsland(aUrl, aId) {
    var myIslandSite = UrlFetchApp.fetch( aUrl + '&message=init' );
    var myIslandJson = JSON.parse( myIslandSite );
    if (myIslandJson.current_missions.hasOwnProperty(aId) != false ) {
      var myEnergyCost = myIslandJson.current_missions[aId].energy
        return myEnergyCost
    } else {
        return false
    }
}
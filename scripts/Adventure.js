/**
* Checks if adventure attack parameters are met then attacks.
* return false/rewards.
*/
function playAdventure() {
    var myUrl = getProperty( '_url' );
    if ( checkIfActive( myUrl ) == true ) {
        return false
    }
    saveDeck( myUrl );
    setDeck( myUrl, getProperty( 'Adventure Deck' ) );
    var myReturn = playCard( myUrl + '&message=startMission&mission_id=' + getProperty( 'Island to farm' ) );
    setDeck( myUrl, getProperty( '_deck' ) );
    return myReturn
}

/**
* Check if island can be attacked.
* return false/cost of island.
*/
function checkIsland(aUrl, aId) {
    var myIslandSite = UrlFetchApp.fetch( aUrl + '&message=init' );
    var myIslandJson = JSON.parse( myIslandSite );
    if (myIslandJson.current_missions.hasOwnProperty(aId) != false ) {
      var energyCost = myIslandJson.current_missions[aId].energy
        return energyCost
    } else {
        return false
    }
}
function playRefillChallenge() {
    var myUrl = getProperty( '_url' );
    if ( checkIfActive( myUrl ) == true ) {
        return false
    }
    saveDeck( myUrl );
    setDeck( myUrl, getProperty( 'Refill Challenge Deck' ) );
    var myChallenge = playCard( myUrl + '&message=startChallenge&challenge_id=' + getChallengeId( myUrl, 102000 ) );
    setDeck( myUrl, getProperty( '_deck' ) );
    return myChallenge
}

function playNonRefillChallenge() {
    var myUrl = getProperty( '_url' );
    if ( checkIfActive( myUrl ) == true ) {
        return false
    }
    saveDeck( myUrl )
    setDeck( myUrl, getProperty( 'Non-Refill Challenge Deck' ) )
    var myChallenge = playCard( myUrl + '&message=startChallenge&challenge_id=' + getChallengeId( myUrl, 103001 ) );
    setDeck( myUrl, getProperty( '_deck' ) )
    return myChallenge
}

function getChallengeId( aUrl, aId ) { //Gets a different challenge id for starting.
    var myEventsSite = UrlFetchApp.fetch( aUrl + '&message=startChallenge' );
    var myEventsJson = JSON.parse( myEventsSite );
    var myActiveEventsId = myEventsJson.active_events[ aId ].challenge;
    var myAchievements = myEventsJson.user_achievements;
    return myActiveEventsId
}

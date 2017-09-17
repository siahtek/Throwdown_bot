/**
 * Checks if refill Challenge parameters are met then attacks.
 * return false/refill Challenge Rewards
 */
function playRefillChallenge() {
    var myUrl = getProperty( 'propUrl' );
    if ( checkIfActive( myUrl ) == true ) {
        return false
    }
    saveDeck( myUrl );
    setDeck( myUrl, getProperty( 'Refill Challenge Deck' ) );
    var myChallenge = playCard( myUrl + '&message=startChallenge&challenge_id=' + getChallengeId( myUrl, 102000 ) );
    setDeck( myUrl, getProperty( 'propDeck' ) );
    return myChallenge
}
/**
 * Checks if Non-Refill Challenge parameters are met then attacks.
 * return true/Non-Refill Challenge Rewards
 */
function playNonRefillChallenge() {
    var myUrl = getProperty( 'propUrl' );
    if ( checkIfActive( myUrl ) == true ) {
        return false
    }
    saveDeck( myUrl )
    setDeck( myUrl, getProperty( 'Non-Refill Challenge Deck' ) )
    var myChallenge = playCard( myUrl + '&message=startChallenge&challenge_id=' + getChallengeId( myUrl, 103001 ) );
    setDeck( myUrl, getProperty( 'propDeck' ) )
    return myChallenge
}
/**
 * Gets challenge ID from challenge token
 * return challenge id
 */
function getChallengeId( aUrl, aId ) {
    var myEventsSite = UrlFetchApp.fetch( aUrl + '&message=startChallenge' );
    var myEventsJson = JSON.parse( myEventsSite );
    var myActiveEventsId = myEventsJson.active_events[ aId ].challenge;
    var myAchievements = myEventsJson.user_achievements;
    return myActiveEventsId
}

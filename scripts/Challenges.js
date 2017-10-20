/**
* Checks if refill Challenge parameters are met then attacks.
* return false/refill Challenge Rewards
*/
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

/**
* Checks if Non-Refill Challenge parameters are met then attacks.
* return true/Non-Refill Challenge Rewards
*/
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
/**
* Gets challenge time left
* return challenge time left
*/
function getChallengeTimeLeft( aUrl, aId ) { 
    var myEventsSite = UrlFetchApp.fetch( aUrl + '&message=startChallenge' );
    var myEventsJson = JSON.parse( myEventsSite );
    var myTime = myEventsJson.time;
    var myRechargeTime = myEventsJson.active_events[ aId ].challenge_data.energy.recharge_time;
    var myLastRechargeTime = myEventsJson.active_events[ aId ].challenge_data.energy.last_recharge_time;
    var myEndTime = myLastRechargeTime+myRechargeTime-3600
    if(myEndTime < myTime){
      return true
    }
    return false
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

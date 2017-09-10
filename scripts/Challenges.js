function RefillChallenge() {
    var myUrl = getProperty( '_url' );
    if ( _CheckActive( myUrl ) == true ) {
        return false
    }
    _SaveDeck( myUrl );
    _ChangeDeck( myUrl, getProperty( 'Refill Challenge Deck' ) );
    var Challenge = Attack( myUrl + '&message=startChallenge&challenge_id=' + _GetChallengeID( myUrl, 102000 ) );
    _ChangeDeck( myUrl, getProperty( '_deck' ) );
    return Challenge
}

function NoneRefillChallenge() {
    var myUrl = getProperty( '_url' );
    if ( _CheckActive( myUrl ) == true ) {
        return false
    }
    _SaveDeck( myUrl )
    _ChangeDeck( myUrl, getProperty( 'Non-Refill Challenge Deck' ) )
    var Challenge = Attack( myUrl + '&message=startChallenge&challenge_id=' + _GetChallengeID( myUrl, 103001 ) );
    _ChangeDeck( myUrl, getProperty( '_deck' ) )
    return Challenge
}

function _GetChallengeID( myUrl, id ) { //Gets a different challenge id for starting.
    var Events = UrlFetchApp.fetch( myUrl + '&message=startChallenge' );
    var Events_Json = JSON.parse( Events );
    var ActiveEvents_id = Events_Json.active_events[ id ].challenge;
    var UserAchievements = Events_Json.user_achievements;
    return ActiveEvents_id
}

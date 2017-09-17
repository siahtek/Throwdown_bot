/**
* Checks if arena attack parameters are met then attacks.
* return false/rewards.
*/
function playArena() {
    var myUrl = getProperty( '_url' );
    if ( checkIfActive( myUrl ) == true ) {
        return false
    }
    if ( getProperty( 'Token Search' ) == "Enabled" ) {
        var Search = searchArena();
        Logger.log( 'Search:' + Search )
    }
    saveDeck( myUrl );
    setDeck( myUrl, getProperty( 'Arena Deck' ) );
    if ( checkIfActive( myUrl ) == true ) {
        return false
    }
    var myReturn = playArenaAttack( myUrl );
    setDeck( myUrl, getProperty( '_deck' ) );
    return myReturn
}

/**
* Search Arena until token is found or limit is reached.
* return false/[search count,found token]
*/
function searchArena() {
    var myTarget = getProperty( 'Arena_Target' ).split( "," );
    if ( myTarget.length < 2 ) {
        return false
    }
    var myUrl = getProperty( '_url' );
    for ( var i = 1; i < getProperty( 'Search Timeout' ); i++ ) {
        var myArenaSearchSite = UrlFetchApp.fetch( myUrl + '&message=getHuntingTargets' );
        var myArenaSearchJson = JSON.parse( myArenaSearchSite );
        var myTargetId = Object.keys( myArenaSearchJson.hunting_targets )[ 0 ];
        var myHeroXp = myArenaSearchJson.hunting_targets[ myTargetId ].hero_xp_id;
        if ( isInArray( myTarget, myHeroXp ) ) {
            return [ i, myHeroXp ]
        } else {
            var myNewArenaSite = UrlFetchApp.fetch( myUrl + '&message=refreshHuntingTargets' );
            var myNewArenaJson = JSON.parse( myNewArenaSite );
            var myTargetId = Object.keys( myNewArenaJson.hunting_targets )[ 0 ];
            var myHeroXp = myNewArenaJson.hunting_targets[ myTargetId ].hero_xp_id;
            if ( isInArray( myTarget, myHeroXp ) ) {
                return [ i, myHeroXp ]
            }
        }
    }
    return false
}

/**
* Checks if array contains a string.
* return true/false
*/
function isInArray( In, For ) {
    return ( In.indexOf( For ) > -1 );
}

/**
* Arena attack function.
* return false/rewards.
*/
function playArenaAttack( aUrl ) { //Attack script..
    var myFindSite = UrlFetchApp.fetch( aUrl + '&message=getHuntingTargets' );
    var myFindJson = JSON.parse( myFindSite );
    var myTargetId = Object.keys( myFindJson.hunting_targets )[ 0 ];
    var myStartSite = UrlFetchApp.fetch( aUrl + '&message=startHuntingBattle&target_user_id=' + myTargetId );
    var myStartJson = JSON.parse( myStartSite );
    if ( myStartJson.result_message != null ) {
        return false
    }
    var myBattleId = myStartJson.battle_data.battle_id;
    var myEndSite = UrlFetchApp.fetch( getProperty( '_url' ) + '&message=playCard&battle_id=' + myBattleId + '&skip=True' );
    var myEndJson = JSON.parse( myEndSite );
    var myRewards = JSON.stringify( myEndJson.battle_data.rewards );
    return myRewards
}

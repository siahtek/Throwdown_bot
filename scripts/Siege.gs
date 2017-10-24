/**
* Starts an attack on Siege and Auto skip.
* return false/Attack rewards.
*/
function playSiege() {
  var myUrl = getProperty( '_url' );
  if ( checkIfActive( myUrl ) == true ) {
    return false
  }
  saveDeck( myUrl );
  setDeck( myUrl, getProperty( 'Siege Deck' ) )
  var myReturn = playCard( myUrl + '&message=fightGuildSiege&slot_id='+getProperty( 'Island to Attack' ) );
  setDeck( myUrl, getProperty( '_deck' ) );
  return myReturn;
}
/**
* Check if Siege is in the last hour.
* return true/false
*/
function getSiegeTime() { 
  var myUrl = getProperty( '_url' );
  var myEventsSite = UrlFetchApp.fetch( myUrl + '&message=getGuildSiegeStatus' );
  var myEventsJson = JSON.parse( myEventsSite );
  var myTime = myEventsJson.time;
  var myAttacks = myEventsJson.guild_siege_status.num_attacks;
  var myEventsSite = UrlFetchApp.fetch( myUrl + '&message=startChallenge' );
  var myEventsJson = JSON.parse( myEventsSite );
  var myLastTime = myEventsJson.active_events[ getSiegeID() ].tracking_end_time;
  if(myTime > myLastTime-3600){
    return true 
  }
  return false
}

/**
* Gets Siege Id
* return Siege Id
*/
function getSiegeID() { 
  var myUrl = getProperty( '_url' );
  var myEventsSite = UrlFetchApp.fetch( myUrl + '&message=startChallenge' );
  var myEventsJson = JSON.parse( myEventsSite );
  var myEvents = myEventsJson.active_events;
  for (key in myEvents){
    var myName = myEventsJson.active_events[key].name;
    if(myName == 'Guild Siege'){return key}
  }
}
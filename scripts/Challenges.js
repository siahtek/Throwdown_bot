function RefillChallenge() {
  var URL = _getp('_url');
  if(_CheckActive(URL) == true){return false}
  _SaveDeck(URL);
  _ChangeDeck(URL, _getp('Refill Challenge Deck'));
  var Challenge = Attack(URL +'&message=startChallenge&challenge_id='+_GetChallengeID(URL, 102000));
  _ChangeDeck(URL, _getp('_deck'));
  return Challenge
}

function NoneRefillChallenge() {
  var URL = _getp('_url');
  if(_CheckActive(URL) == true){return false}
  _SaveDeck(URL)
  _ChangeDeck(URL, _getp('Non-Refill Challenge Deck'))
  var Challenge = Attack(URL +'&message=startChallenge&challenge_id='+_GetChallengeID(URL, 103001));
  _ChangeDeck(URL, _getp('_deck'))
  return Challenge
}


function _GetChallengeID(URL, id) {//Gets a different challenge id for starting.
  var Events = UrlFetchApp.fetch(URL + '&message=startChallenge');
  var Events_Json = JSON.parse(Events);
  var ActiveEvents_id = Events_Json.active_events[id].challenge;
  var UserAchievements = Events_Json.user_achievements;
  return ActiveEvents_id
}
function Arena() {
  var URL = _getp('_url');
  if(_CheckActive(URL) == true){return false}
  if (_getp('Token Search') == "Enabled") {
    var Search = Arena_Search();
    Logger.log('Search:'+Search)
  }
  _SaveDeck(URL);
  _ChangeDeck(URL, _getp('Arena Deck'));
  if(_CheckActive(URL) == true){return false}
  var Arena = Attack_Arena(URL);
  _ChangeDeck(URL, _getp('_deck'));
  return Arena
}

function Arena_Search() {
  var Target= _getp('Arena_Target').split(",");
  if(Target.length < 2){return false}
  var URL = _getp('_url');
  for (var i = 1; i < _getp('Search Timeout'); i++) {
    var Arena_Search = UrlFetchApp.fetch(URL + '&message=getHuntingTargets');
    var Arena_Search_Json = JSON.parse(Arena_Search);
    var Target_ID = Object.keys(Arena_Search_Json.hunting_targets)[0]; 
    var Hero_XP = Arena_Search_Json.hunting_targets[Target_ID].hero_xp_id;
    if (_arrayContains(Target, Hero_XP)) {
      return [i,Hero_XP]
    } else {
      var Arena_New = UrlFetchApp.fetch(URL + '&message=refreshHuntingTargets');
      var Arena_New_Json = JSON.parse(Arena_New);
      var Target_ID = Object.keys(Arena_New_Json.hunting_targets)[0]; 
      var Hero_XP = Arena_New_Json.hunting_targets[Target_ID].hero_xp_id;
      if (_arrayContains(Target, Hero_XP)) {
        return [i,Hero_XP]
      }
    }
  }
  return false
}

function _arrayContains(In, For) {
  return (In.indexOf(For) > -1);
}


function Attack_Arena(URL) {//Attack script..
  var Find = UrlFetchApp.fetch(URL + '&message=getHuntingTargets');
  var Find_Json = JSON.parse(Find);
  var Target_ID = Object.keys(Find_Json.hunting_targets)[0];
  var Start = UrlFetchApp.fetch(URL + '&message=startHuntingBattle&target_user_id=' + Target_ID);
  var Start_Json = JSON.parse(Start);
  if (Start_Json.result_message != null) {return false}
  var Battle_id = Start_Json.battle_data.battle_id;
  var End = UrlFetchApp.fetch(_getp('_url') + '&message=playCard&battle_id=' + Battle_id + '&skip=True');
  var End_Json = JSON.parse(End);
  var Rewards = JSON.stringify(End_Json.battle_data.rewards);
  return Rewards
}

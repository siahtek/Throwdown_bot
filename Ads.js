function UseAdcrate() {
  var URL = _getp('_url');
  var CheckCrate = UrlFetchApp.fetch(URL + '&message=useItem');
  var CheckCrate_Json = JSON.parse(CheckCrate);
  if(CheckCrate_Json.user_items[30002] != null || CheckCrate_Json.user_items[30001] != null){
    
    for (var i = 0; i < 6; i++) {
      var Crate_1 = UrlFetchApp.fetch(URL + '&message=useAdLockedItem&item_id=30002');//vip crate
      Utilities.sleep(5000);
      var Crate_2 = UrlFetchApp.fetch(URL + '&message=useAdLockedItem&item_id=30001');//Non vip crate
      var CheckCrate = UrlFetchApp.fetch(URL + '&message=useItem');
      if(CheckCrate_Json.user_items[30002] == null && CheckCrate_Json.user_items[30001] == null){Logger.log('Finished!');return true;}
    }
    return true
  }else{
    return false}
  
}

function AdBoost() {
  var URL = _getp('_url');
  for (var i = 0; i < 6; i++) {
    var Boost = UrlFetchApp.fetch(URL + '&message=getUserAccount');
    var Boost_Json = JSON.parse(Boost);
    var BoostStatus = Boost_Json.user_data.boost_level;
    UrlFetchApp.fetch(URL + '&message=recordAdBoost');
    if(BoostStatus == 3){return BoostStatus}
    Utilities.sleep(2000);
  } 
  return false
}

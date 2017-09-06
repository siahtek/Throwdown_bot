//Auto Rumble
//ads?

var _XML;
var _properties;
var _sheet;

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Throwdown')
  .addItem('Enable & Refresh', '_Enable')
  .addItem('Disable', '_Disable')
  .addItem('Manual Run', '_Run')
  .addToUi();
}

function _Enable() {
  _properties = PropertiesService.getScriptProperties()
  _sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Settings');
   LoadUserSettings();
   var User_Auth = AuthenticateUser(_getp('User_ID'), _getp('User_Token'));
  if (User_Auth == false) {
    UpdateStatus('Login failed.. Check User_Ud & User_Token '+ TimeFormated());
    Logger.log('User Auth fail');
    return false 
  }
  
  if (_CheckTrigger('Trigger_loaded') == false) {
    _CreateTrigger('Trigger_loaded');
    UpdateNext(true)
    UpdateStatus('Account '+_getp('_name')+' Enabled, Waiting for next check ');
  }
    var Energy = GetEnergy();
  EnergyUpdate(Energy[1],Energy[5],'Arena')
  EnergyUpdate(Energy[0],Energy[4],'Adventure')
  VersionCheck()
  var User_Auth = AuthenticateUser(_getp('User_ID'), _getp('User_Token'));
  if (User_Auth == false) {
    Logger.log('User Auth fail');
    return false
  }
}

function _Disable() {
  EnergyUpdate(0,0,'Arena')
  EnergyUpdate(0,0,'Adventure')
  _properties = PropertiesService.getScriptProperties()
  _sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Settings');
  UpdateNext(false)
  UpdateStatus('Disabled - To Enable: Menu > Throwdown > Enable');
  _RemoveTriggers();
  PropertiesService.getScriptProperties().deleteAllProperties();
}

function _Run() {
    if (_CheckTrigger('Trigger_loaded') != false) {
    _RemoveTriggers();
    _CreateTrigger('Trigger_loaded');
    UpdateNext(true)
  }
 Main();
}

function Trigger_loaded() {
  UpdateNext(true);
  Main();
}

function Main() {
  _sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Settings');
  _properties = PropertiesService.getScriptProperties()
  _XML = UrlFetchApp.fetch('https://cb-live.synapse-games.com/assets/cards.xml').getContentText();
  
  UpdateStatus('Started, logging in '+ TimeFormated());
  VersionCheck()
  var Loaded = LoadUserSettings();
  var User_Auth = AuthenticateUser(_getp('User_ID'), _getp('User_Token'));
  if (User_Auth == false) {
    UpdateStatus('Login failed.. Check User_Ud & User_Token '+ TimeFormated());
    Logger.log('User Auth fail');
    return false
  }
  if (_getp('Ad Boost') == 'Enabled') {
    UpdateStatus('Account '+_getp('_name')+' Loading AdBoost '+ TimeFormated());
    var Boost = AdBoost(); //Boost every 30 minutes? why not!
    Logger.log('Ad Boost:' + Boost);
  }
  var Energy = GetEnergy();
  EnergyUpdate(Energy[1],Energy[5],'Arena')
  EnergyUpdate(Energy[0],Energy[4],'Adventure')
  if (_CheckActive(_getp('_url')) == true) {
    UpdateStatus('Account '+_getp('_name')+' Active Session found. Waiting 30 mins '+ TimeFormated());
    Logger.log('Active session found');
    return false
  }
  if (_getp('Energy Check') == 'Enabled') {
    if (_getp('Energy Check section') == 'Adventure' && Energy[0] < (Energy[4] - 2)) {
      UpdateStatus('Account '+_getp('_name')+' Adventure not full. '+ TimeFormated());
      Logger.log('Adventure not full');
      return false;
    }
    if (_getp('Energy Check section') == 'Arena' && Energy[1] < (Energy[5] - 1)) {
      UpdateStatus('Account '+_getp('_name')+' Arena not full. '+ TimeFormated());
      Logger.log('Arena not full');
      return false;
    }
    if (_getp('Energy Check section') == 'Adventure & Arena' || Energy[1] < (Energy[5] - 1) && Energy[0] < (Energy[4] - 2)) {
      UpdateStatus('Account '+_getp('_name')+' Both not full. '+ TimeFormated());
      Logger.log('Both not full');
      return false;
    }
  }
  UpdateStatus('Account '+_getp('_name')+' Starting '+ TimeFormated());
  Logger.log(GetEnergy());
  _Farming();
  Logger.log(GetEnergy());
  UpdateStatus('Account '+_getp('_name')+' Finished '+ TimeFormated());
}

function _Farming() {
  var Energy = GetEnergy();
  // if (_getp('Auto Rumble') == "Enabled") {Logger.log(Rumble());}
  if (_getp('Auto Refill Challenge') == "Enabled" && Energy[2] > 0) {
    Logger.log('- - - - RefillChallenge Start - - - -');
    for (var i = 0; i < Energy[6]; i++) {
       UpdateStatus('Account '+_getp('_name')+' Loading Refill Challenge '+ TimeFormated());
      var result = RefillChallenge();
      if (result != false) {
        AddLog('_logs_RefillChallenge', result)
      }
      Logger.log(result);
      if (result == false) {
        break;
      }
    }
    Logger.log('- - - - RefillChallenge End - - - -');
  }
  if (_getp('Auto Non-Refill Challenge') == "Enabled" && Energy[3] > 0) {
    Logger.log('- - - - NonRefillChallenge Start - - - -');
    for (var i = 0; i < Energy[7]; i++) {
      UpdateStatus('Account '+_getp('_name')+' Loading Non-Refill Challenge '+ TimeFormated());
      var result = NoneRefillChallenge();
      if (result != false) {
        AddLog('_logs_NoneRefillChallenge', result)
      }
      Logger.log(result);
      if (result == false) {
        break;
      }
    }
    Logger.log('- - - - NonRefillChallenge End - - - -');
  }
  if (_getp('Auto Adventure') == "Enabled" && Energy[0] > 0) {
    Logger.log('- - - - Adventure Start - - - -');
    for (var i = 0; i < Energy[4]; i++) {
      UpdateStatus('Account '+_getp('_name')+' Loading Adventure '+ TimeFormated());
      var result = Adventure();
      if (result != false) {
        AddLog('_logs_Adventure', result)
      }
      Logger.log(result);
      if (result == false) {
        break;
      }
    }
    _CompleteAchievemnts(_getp('_url'), '5007');
    Logger.log('- - - - Adventure End - - - -');
  }
  if (_getp('Auto Arena') == "Enabled" && Energy[1] > 0) {
    Logger.log('- - - - Arena Start - - - -');
    for (var i = 0; i < Energy[5]; i++) {
      UpdateStatus('Account '+_getp('_name')+' Loading Arena '+ TimeFormated());
      var result = Arena();
      if (result != false) {
        AddLog('_logs_Arena', result)
      }
      Logger.log(result);
      Utilities.sleep(2000);
      if (result == false) {
        break;
      }
    }
    _CompleteAchievemnts(_getp('_url'), '5008');
    Logger.log('- - - - Arena End - - - -');
  }
  _CompleteAchievemnts(_getp('_url'), '5009');
  _CompleteAchievemnts(_getp('_url'), '5010');
  if (_getp('Auto Buy/Upgade Mission') == "Enabled" && _CheckAchievemnts(_getp('_url'), '5009') == true) {
    UpdateStatus('Account '+_getp('_name')+' Daily Mission '+ TimeFormated());
    Logger.log('- - - - Auto Buy/Upgade Mission Start - - - -');
    var result = _BuyCardAndUpgrade();
    Logger.log('- - - - Auto Buy/Upgade Mission End - - - -');
  }
  if (_getp('Auto buy and recycle') == "Enabled") {
    UpdateStatus('Account '+_getp('_name')+' Buying & Recycling cards '+ TimeFormated());
    Logger.log('- - - - Auto buy and recycle Start - - - -');
    var result = _BuyCardAndRecycle();
    _CompleteAchievemnts(_getp('_url'), '5010');
    Logger.log('- - - - Auto buy and recycle End - - - -');
  }
  if (_getp('Ad Crate') == 'Enabled') {
    UpdateStatus('Account '+_getp('_name')+' Opening AdCrates '+ TimeFormated());
    var Crate = UseAdcrate();
    Logger.log('Ad Crates:' + Crate);
  }
  var Energy = GetEnergy();
  EnergyUpdate(Energy[1],Energy[5],'Arena')
  EnergyUpdate(Energy[0],Energy[4],'Adventure')
  _CompleteAchievemnts(_getp('_url'), '5012');
  UpdateStatus('Account '+_getp('_name')+' Writing Logs '+ TimeFormated());
  WriteLogs('_logs_RefillChallenge', 'B');
  WriteLogs('_logs_NoneRefillChallenge', 'C');
  WriteLogs('_logs_Adventure', 'D');
  WriteLogs('_logs_Arena', 'E');
  WriteLogs('BuyCardAndUpgrade', 'F');
  WriteLogs('BuyCardAndRecycle', 'G');
  WriteLogs('_time', 'A');
  _CompleteAchievemnts(_getp('_url'), '5001');
  
}

function GetEnergy() { //Returns Current and Max energy.
  // 0-Adventure : 1-Arena : 2-Challenge : 3-NonRefillChallenge 
  // 4-MaxAdventure : 5-MaxArena : 6-MaxChallenge : 7-MaxNonRefillChallenge
  var url = _getp('_url');
  var Energy = UrlFetchApp.fetch(url + '&message=getUserAccount');
  var Energy_Json = JSON.parse(Energy);
  var Challenge = UrlFetchApp.fetch(url + '&message=startChallenge');
  var Challenge_Json = JSON.parse(Challenge);
  var Arena = Energy_Json.user_data.stamina
  var Arena_Max = Energy_Json.user_data.max_stamina
  var Adventure = Energy_Json.user_data.energy
  var Adventure_Max = Energy_Json.user_data.max_energy
  var Challenge = Challenge_Json.active_events[102000].challenge_data.energy.current_value;
  var Challenge_Max = Challenge_Json.active_events[102000].challenge_data.energy.max_value;
  var NonRefillChallenge = Challenge_Json.active_events[103001].challenge_data.energy.current_value;
  var NonRefillChallenge_Max = Challenge_Json.active_events[103001].challenge_data.energy.max_value;
  return [Adventure, Arena, Challenge, NonRefillChallenge, Adventure_Max, Arena_Max, Challenge_Max, NonRefillChallenge_Max]
}

function VersionCheck() {
  var Sheet = SpreadsheetApp.openById('1e6Ru4wgPUD4CtKPVZDTKZ804w23Ulg9_iooKcgkC5Rk').getSheetByName("Settings");
  var NewVersion = Sheet.getRange("A1").getValue();
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Settings");
  var CurrentVersion = sheet.getRange("A1").getValue();
  if (NewVersion > CurrentVersion) {
    sheet.getRange('C1').setValue('New Version Available -> http://tiny.cc/atbot');
  }
}
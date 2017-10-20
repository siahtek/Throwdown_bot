var theXml;
var theXmlCombo;
var theXmlMythic;
var theProperties;
var theSheet;
var idToHero = { 
  1001:"Peter",
  1002:"Stewie",
  1003:"Brian",
  1004:"Consuela",
  1005:"The Giant Chicken",
  2001:"Roger",
  2002:"Stan",
  2003:"Steve",
  2005:"Ricky Spanish",
  3001:"Bob",
  3002:"Louise",
  3003:"Tina",
  3004:"Gene",
  4001:"Hank",
  4002:"Bobby",
  4003:"Dale",
  4004:"John Redcorn",
  5016:"Bender",
  5017:"Fry",
  5018:"Leela",
  5019:"Zapp Brannigan"
};
var heroToId = {
  "Peter":1001,
  "Stewie":1002,
  "Brian":1003,
  "Consuela":1004,
  "The Giant Chicken":1005,
  "Roger":2001,
  "Stan":2002,
  "Steve":2003,
  "Ricky Spanish":2005,
  "Bob":3001,
  "Louise":3002,
  "Tina":3003,
  "Gene":3004,
  "Hank":4001,
  "Bobby":4002,
  "Dale":4003,
  "John Redcorn":4004,
  "Bender":5016,
  "Fry":5017,
  "Leela":5018,
  "Zapp Brannigan":5019
};

/**
* On sheet load add Throwdown menu. --> Menu > Throwdown
* Cant be renamed.. this is a Google call onOpen
*/
function onOpen() {
    var ui = SpreadsheetApp.getUi();
    theSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName( 'Settings' );
  ui.createMenu( 'Throwdown' )
    .addSeparator()
    .addItem( 'Enable & Refresh', '_Enable' )
    .addItem( 'Disable', '_Disable' )
    .addItem( 'Manual Run', '_Run' )
    .addSubMenu(SpreadsheetApp.getUi().createMenu('Auto Rumble')
                .addItem( 'Enable', 'enableRumble' )
                .addItem( 'Disable', 'disableRumble' )
                .addItem( 'Manual Run', 'manualeRumble' )
               )
    .addToUi();
   ui.createMenu( 'Custom Decks' )
    .addSeparator()
    .addItem( 'Import to sheet', 'ImportToSheet' )
    .addItem( 'Export to throwdown', 'ExportToThrowdown' )
    .addItem( 'Display in sheet', 'DisplayUserDeck' )
    .addToUi();
  if (theSheet.getRange("A2:F2").getValue() == 'debug'){
    ui.createMenu( 'Debug' )
      .addSeparator()
      .addItem( 'Test Buying Cards', 'testBuyingCards' )
      .addItem( 'Test Arena', 'testArena' )
      .addToUi();
  }
}

/**
 * On edit for Mobile controls.
 */
function onEditCustom(e) {
  if (e.range.getA1Notation() == 'I4') {
   var myValue = e.range.getValue();
    e.range.setValue('Loading task');
    if(myValue == 'Import to sheet'){ImportToSheet()}
    if(myValue == 'Export to throwdown'){ExportToThrowdown()}
    if(myValue == 'Display in sheet'){DisplayUserDeck()}
    e.range.setValue('Select a task');
    return
  }
    if (e.range.getA1Notation() == 'D11') {
   var myValue = e.range.getValue();
    e.range.setValue('Loading task');
    if(myValue == 'Enable & Refresh'){_Enable()}
    if(myValue == 'Disable'){_Disable()}
    if(myValue == 'Manual Run'){_Run()}
    e.range.setValue('Select a task');
      return
  }
      if (e.range.getA1Notation() == 'D12') {
   var myValue = e.range.getValue();
    e.range.setValue('Loading task');
    if(myValue == 'Enable'){enableRumble()}
    if(myValue == 'Disable'){disableRumble()}
    if(myValue == 'Manual Run'){manualeRumble()}
    e.range.setValue('Select a task');
      return
  }
}

/**
* Runs when Enable & Refresh calls it. --> Menu > Throwdown > Enable & Refresh
*/
function _Enable() {
    theProperties = PropertiesService.getScriptProperties()
    theSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName( 'Settings' );
    loadUserSettings();
    var myUserAuth = authenticateUser( getProperty( 'User_ID' ), getProperty( 'User_Token' ) );
    if ( myUserAuth == false ) {
        return false
    }
    if ( checkTrigger( 'Trigger_loaded' ) == false ) {
        createTrigger( 'Trigger_loaded' );
        updateNext( true )
        updateStatus( 'Account ' + getProperty( '_name' ) + ' Enabled, Waiting for next check ' );
    } else {
        updateStatus( 'Account ' + getProperty( '_name' ) + ' refresh finished' );
    }
    var myStatus = getStatus();
    updateEnergy( myStatus.arena, myStatus.arenaMax, 'Arena' );
    updateEnergy( myStatus.adventure, myStatus.adventureMax, 'Adventure' );
    updateSwole( myStatus.swoleHero, myStatus.swoleTimeLeft );
    checkVersion()
}

/**
* Runs when user Disable calls it. --> Menu > Throwdown > Disable
*/
function _Disable() {
    updateEnergy( 0, 0, 'Arena' );
    updateEnergy( 0, 0, 'Adventure' );
    disableSwole();
    theProperties = PropertiesService.getScriptProperties();
    theSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName( 'Settings' );
    updateNext( false );
    updateStatus( 'Disabled - To Enable: Menu > Throwdown > Enable' );
    removeTriggers();
    PropertiesService.getScriptProperties().deleteAllProperties();
}

/**
* Runs when Manual Run calls it. --> Menu > Throwdown > Manual Run
*/
function _Run() {
    if ( checkTrigger( 'Trigger_loaded' ) != false ) {
        removeTriggers();
        createTrigger( 'Trigger_loaded' );
        updateNext( true )
    }
    Main();
}

/**
* Runs when the trigger calls it.
*/
function Trigger_loaded() {
    updateNext( true );
    Main();
}
/**
* Loads settings, logs in, and checks if running parameters are valid.
* return true/false
*/
function Main() {
    theSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName( 'Settings' );
    theProperties = PropertiesService.getScriptProperties()
    theXml = UrlFetchApp.fetch( 'https://cb-live.synapse-games.com/assets/cards.xml' ).getContentText();
    theXmlCombo = UrlFetchApp.fetch( 'https://cb-live.synapse-games.com/assets/cards_finalform.xml' ).getContentText();
    theXmlMythic = UrlFetchApp.fetch( 'https://cb-live.synapse-games.com/assets/cards_mythic.xml' ).getContentText();
    updateStatus( 'Started, logging in ' + formattedTime() );
    checkVersion()
    var myUserSettings = loadUserSettings();
    var myAuth = authenticateUser( getProperty( 'User_ID' ), getProperty( 'User_Token' ) );
    if ( myAuth == false ) {
        return false
    }
    if ( getProperty( 'Ad Boost' ) == 'Enabled' ) {
        updateStatus( 'Account ' + getProperty( '_name' ) + ' Loading boostAds ' + formattedTime() );
        var myBoost = boostAds(); //Boost every 30 minutes? why not!
      if(myBoost == false){
         Utilities.sleep( 6000 );
        var myBoost = boostAds();
      }
        Logger.log( 'Ad Boost:' + myBoost );
    }
    var myStatus = getStatus();
    updateEnergy( myStatus.arena, myStatus.arenaMax, 'Arena' );
    updateEnergy( myStatus.adventure, myStatus.adventureMax, 'Adventure' );
    updateSwole( myStatus.swoleHero, myStatus.swoleTimeLeft );
    if ( checkIfActive( getProperty( '_url' ) ) == true ) {
        updateStatus( 'Account ' + getProperty( '_name' ) + ' Active Session found. Waiting 30 mins ' + formattedTime() );
        Logger.log( 'Active session found' );
        return false
    }

  
    updateStatus( 'Account ' + getProperty( '_name' ) + ' Starting ' + formattedTime() );
    Logger.log( getStatus() );
    _Farming();
    Logger.log( getStatus() );
    updateStatus( 'Account ' + getProperty( '_name' ) + ' Finished ' + formattedTime() );
}

/**
* Checks if Energy is available.
*/
function EnergyCheck(aEnable,aCheck,aCost,aCurrent,aMax) {
  if ( getProperty( aEnable ) == 'Disabled') { //Energy Check
    return false
  }else if ( getProperty( aEnable ) == 'Energy overflow control') { //Enabled Overflow
    if(aCurrent >= (aMax-aCost)){
      return true
    }
  } 
  
   if ( getProperty( aCheck ) == 'Disabled' ) { //Disabled
     return true
  }else if ( getProperty( aCheck ) == 'Enabled' ) { //Enabled
    if(aCurrent >= (aMax-aCost)){
      return true
    }
  }
  return false
}

/**
* Runs all farming commands.
*/
function _Farming() {
	// =================================== Refill Challenge ===================================
    var myStatus = getStatus();
    if(EnergyCheck('Auto Refill Challenge', 'Refill Challenge Energy check', 1, myStatus.refillChallenge, myStatus.refillChallengeMax) == true){
      if((getProperty( 'Refill Challenge Delay' ) == 'Enabled' && getChallengeTimeLeft( getProperty( '_url' ),102000) == true) || (getProperty( 'Refill Challenge Delay' ) == 'Disabled')){
        Logger.log( '- - - - RefillChallenge Start - - - -' );
        for ( var i = 0; i < myStatus.refillChallengeMax; i++ ) {
            updateStatus( 'Account ' + getProperty( '_name' ) + ' Loading Refill Challenge ' + formattedTime() );
            var myResult = playRefillChallenge();
            if ( myResult != false ) {
                addLog( '_logs_RefillChallenge', myResult )
            }
            Logger.log( myResult );
            if ( myResult == false ) {
                break;
            }
        }
        Logger.log( '- - - - RefillChallenge End - - - -' );
      }
    }
	// =================================== Refill Challenge ===================================
	
	// ================================= Non Refill Challenge =================================
    if(EnergyCheck('Auto Non-Refill Challenge', 'Non-Refill Challenge Energy Check', 1, myStatus.nonRefillChallenge, myStatus.nonRefillChallengeMax) == true){
      if((getProperty( 'Non-Refill Challenge Delay' ) == 'Enabled' && getChallengeTimeLeft( getProperty( '_url' ),103001) == true) || (getProperty( 'Non-Refill Challenge Delay' ) == 'Disabled')){
        Logger.log( '- - - - NonRefillChallenge Start - - - -' );
        for ( var i = 0; i < myStatus.nonRefillChallengeMax; i++ ) {
            updateStatus( 'Account ' + getProperty( '_name' ) + ' Loading Non-Refill Challenge ' + formattedTime() );
            var myResult = playNonRefillChallenge();
            if ( myResult != false ) {
                addLog( '_logs_NoneRefillChallenge', myResult )
            }
            Logger.log( myResult );
            if ( myResult == false ) {
                break;
            }
        }
        Logger.log( '- - - - NonRefillChallenge End - - - -' );
      }
    }
	// ================================= Non Refill Challenge =================================
	
	// ================================= Swole Challenge =================================
    if ( getProperty( 'Auto Swole Challenge' ) == "Enabled" && myStatus.swoleChallenge > 0 ) {
        Logger.log( '- - - - SwoleChallenge Start - - - -' );
        for ( var i = 0; i < myStatus.swoleChallengeMax; i++ ) {
            updateStatus( 'Account ' + getProperty( '_name' ) + ' Loading Swole Challenge ' + formattedTime() );
            var myResult = playSwoleChallenge();
            if ( myResult != false ) {
                addLog( '_logs_NoneRefillChallenge', myResult )
            }
            Logger.log( myResult );
            if ( myResult == false ) {
                break;
            }
        }
        Logger.log( '- - - - SwoleChallenge End - - - -' );
    }
	// ================================= Swole Challenge =================================
	
	// ====================================== Adventure =======================================
    var myStatus = getStatus();
    if(EnergyCheck('Auto Adventure', 'Adventure Energy Check', getProperty('_IslandCost'), myStatus.adventure, myStatus.adventureMax) == true){
        Logger.log( '- - - - Adventure Start - - - -' );
        var mySearchLength = myStatus.adventureMax;
        Logger.log( 'SearchLength:' + mySearchLength )
        for ( var i = 0; i < mySearchLength; i++ ) {
            updateStatus( 'Account ' + getProperty( '_name' ) + ' Loading Adventure ' + formattedTime() );
            var myResult = playAdventure();
            if ( myResult != false ) {
                addLog( '_logs_Adventure', myResult )
            }
            Logger.log( myResult );
            var myStatus = getStatus();
            updateEnergy( myStatus.adventure, myStatus.adventureMax, 'Adventure' )
            if ( getProperty( 'Auto Adventure' ) == "Energy overflow control" && myStatus.adventure < myStatus.adventureMax ) {
                break;
            }
            if ( myResult == false ) {
                break;
            }
        }
        completeAchievements( getProperty( '_url' ), '5007' );
        Logger.log( '- - - - Adventure End - - - -' );
    }
	// ====================================== Adventure =======================================
	
	// ======================================== Arena =========================================
    var myStatus = getStatus();
      if(EnergyCheck('Auto Arena', 'Arena Energy Check', 1, myStatus.arena, myStatus.arenaMax) == true){
        Logger.log( '- - - - Arena Start - - - -' );
        var mySearchLength = myStatus.arena;
        Logger.log( 'SearchLength:' + mySearchLength )
        for ( var i = 0; i < mySearchLength; i++ ) {
            updateStatus( 'Account ' + getProperty( '_name' ) + ' Loading Arena ' + formattedTime() );
            var myResult = playArena();
            if ( myResult != false ) {
                addLog( '_logs_Arena', myResult )
            }
            Logger.log( myResult );
            var myStatus = getStatus();
            updateEnergy( myStatus.arena, myStatus.arenaMax, 'Arena' )
            if ( getProperty( 'Auto Arena' ) == "Energy overflow control" && myStatus.arena < myStatus.arenaMax ) {
                break;
            }
            if ( myResult == false ) {
                break;
            }
            Utilities.sleep( 2000 );
        }
        completeAchievements( getProperty( '_url' ), '5008' );
        Logger.log( '- - - - Arena End - - - -' );
    }
	// ======================================== Arena =========================================
	
	// ======================================== Siege =========================================
    var myStatus = getStatus();
    if(EnergyCheck('Auto Siege', 'Siege Energy Check', 1, myStatus.arena, myStatus.arenaMax) == true){
    if(getProperty( 'Siege Delay' ) == 'Enabled' && getSiegeTime() == true){
        Logger.log( '- - - - Siege Start - - - -' );
        for ( var i = 0; i < myStatus.siege; i++ ) {
            updateStatus( 'Account ' + getProperty( '_name' ) + ' Loading Siege ' + formattedTime() );
            var myResult = playSiege();
            if ( myResult != false ) {
                addLog( '_logs_Siege', myResult )
            }
            Logger.log( myResult );
            if ( myResult == false ) {
                break;
            }
        }
        Logger.log( '- - - - Siege End - - - -' );
      }
    }
	// ======================================== Siege =========================================
  
	// ==================================== Buy and Update ====================================
    completeAchievements( getProperty( '_url' ), '5009' );
    completeAchievements( getProperty( '_url' ), '5010' );
    if ( getProperty( 'Auto Buy/Upgrade Mission' ) == "Enabled" && checkAchievements( getProperty( '_url' ), '5009' ) == true ) {
        updateStatus( 'Account ' + getProperty( '_name' ) + ' Daily Mission ' + formattedTime() );
        Logger.log( '- - - - Auto Buy/Upgrade Mission Start - - - -' );
        var myResult = buyAndUpgradeCards();
        Logger.log( '- - - - Auto Buy/Upgrade Mission End - - - -' );
    }
	// ==================================== Buy and Update ====================================
	
	// =================================== Buy and Recycle ====================================
    if ( getProperty( 'Auto buy and recycle' ) == "Enabled" ) {
        updateStatus( 'Account ' + getProperty( '_name' ) + ' Buying & Recycling cards ' + formattedTime() );
        Logger.log( '- - - - Auto buy and recycle Start - - - -' );
        var myResult = buyAndRecycleCards();
        completeAchievements( getProperty( '_url' ), '5010' );
        Logger.log( '- - - - Auto buy and recycle End - - - -' );
    }
	// =================================== Buy and Recycle ====================================
	
	// ====================================== Ad Crates ===============-=======================
    if ( getProperty( 'Ad Crate' ) == 'Enabled' ) {
        updateStatus( 'Account ' + getProperty( '_name' ) + ' Opening AdCrates ' + formattedTime() );
        var myCrate = useAdCrates();
        Logger.log( 'Ad Crates:' + myCrate );
    }
	// ====================================== Ad Crates ===============-=======================
	
    var myStatus = getStatus();
    updateEnergy( myStatus.arena, myStatus.arenaMax, 'Arena' );
    updateEnergy( myStatus.adventure, myStatus.adventureMax, 'Adventure' );
    updateSwole( myStatus.swoleHero, myStatus.swoleTimeLeft );
    completeAchievements( getProperty( '_url' ), '5012' );
    WriteLogs();
    completeAchievements( getProperty( '_url' ), '5001' );
}

/**
* Gets current and max energy.
* return energy
*/
function getStatus() { //Returns Current and Max energy.
    // 0-Adventure : 1-Arena : 2-Challenge : 3-NonRefillChallenge 
    // 4-MaxAdventure : 5-MaxplayArena : 6-MaxChallenge : 7-MaxNonRefillChallenge
    var myUrl = getProperty( '_url' );
    var userAccount = UrlFetchApp.fetch( myUrl + '&message=getUserAccount' );
    var userAccountJson = JSON.parse( userAccount );
    var challenge = UrlFetchApp.fetch( myUrl + '&message=startChallenge' );
    var challengeJson = JSON.parse( challenge );
    var arenaEnergy = userAccountJson.user_data.stamina
    var arenaEnergyMax = userAccountJson.user_data.max_stamina
    var adventureEnergy = userAccountJson.user_data.energy
    var adventureEnergyMax = userAccountJson.user_data.max_energy
    if ( userAccountJson.user_tasks.hasOwnProperty( '3' ) ) {
        var swoleTimeLeft = parseInt(userAccountJson.user_tasks[ 3 ].end_time) - parseInt(userAccountJson.time);
        var swoleHero = parseInt(userAccountJson.user_tasks[ 3 ].task_id_1);
    } else {
        var swoleTimeLeft = 'n/a';
        var swoleHero = 'n/a';
    }
    if ( challengeJson.hasOwnProperty( 'active_events' ) ) {
        if ( challengeJson.active_events.hasOwnProperty( '102000' ) ) {
            var refillChallengeEnergy = challengeJson.active_events[ 102000 ].challenge_data.energy.current_value;
            var refillChallengeEnergyMax = challengeJson.active_events[ 102000 ].challenge_data.energy.max_value;
        } else {
            var refillChallengeEnergy = 0;
            var refillChallengeEnergyMax = 8;
        }
        if ( challengeJson.active_events.hasOwnProperty( '103001' ) ) {
            var nonRefillChallengeEnergy = challengeJson.active_events[ 103001 ].challenge_data.energy.current_value;
            var nonRefillChallengeEnergyMax = challengeJson.active_events[ 103001 ].challenge_data.energy.max_value;
        } else {
            var nonRefillChallengeEnergy = 0;
            var nonRefillChallengeEnergyMax = 10;
        }
		if ( challengeJson.active_events.hasOwnProperty( '900001' ) ) {
			var swoleChallengeEnergy = challengeJson.active_events[ 900001 ].challenge_data.energy.current_value;
			var swoleChallengeEnergyMax = challengeJson.active_events[ 900001 ].challenge_data.energy.max_value;
		} else {
			var swoleChallengeEnergy = 0;
			var swoleChallengeEnergyMax = 10;
            disableSwole();
		}
    } else {
        var refillChallengeEnergy = 0;
        var refillChallengeEnergyMax = 8;
        var nonRefillChallengeEnergy = 0;
        var nonRefillChallengeEnergyMax = 10;
        var swoleChallengeEnergy = 0;
        var swoleChallengeEnergyMax = 8;
    }
	var myStatus = {adventure:parseInt(adventureEnergy), arena:parseInt(arenaEnergy), refillChallenge:parseInt(refillChallengeEnergy), nonRefillChallenge:parseInt(nonRefillChallengeEnergy), adventureMax:parseInt(adventureEnergyMax), arenaMax:parseInt(arenaEnergyMax), refillChallengeMax:parseInt(refillChallengeEnergyMax), nonRefillChallengeMax:parseInt(nonRefillChallengeEnergyMax), swoleChallenge:parseInt(swoleChallengeEnergy), swoleChallengeMax:parseInt(swoleChallengeEnergyMax), swoleTimeLeft:parseInt(swoleTimeLeft), swoleHero:parseInt(swoleHero)};
    return myStatus
}

/**
* Check and see if there is a new script version.
*/
function checkVersion() {
    var mySettingsSheet = SpreadsheetApp.openById( '1QdcUdbr--OYuU_kQR-k_4OqDuqSXoVyVK8I8Nj7QL3c' ).getSheetByName( "Settings" );
    var myNewVersion = mySettingsSheet.getRange( "A1" ).getValue();
    var myActiveSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName( "Settings" );
    var myCurrentVersion = myActiveSheet.getRange( "A1" ).getValue();
    if ( myNewVersion > myCurrentVersion ) {
        myActiveSheet.getRange( 'C1' ).setValue( 'New Version Available -> http://tiny.cc/atbot' );
    }
}

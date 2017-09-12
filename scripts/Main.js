//Auto Rumble
//ads?
var theXml;
var theProperties;
var theSheet;

function onOpen() {
    var ui = SpreadsheetApp.getUi();
    ui.createMenu( 'Throwdown' ).addItem( 'Enable & Refresh', '_Enable' ).addItem( 'Disable', '_Disable' ).addItem( 'Manual Run', '_Run' ).addToUi();
}

function _Enable() {
    theProperties = PropertiesService.getScriptProperties()
    theSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName( 'Settings' );
    loadUserSettings();
    var User_Auth = authenticateUser( getProperty( 'User_ID' ), getProperty( 'User_Token' ) );
    if ( User_Auth == false ) {
        return false
    }
    if ( checkTrigger( 'Trigger_loaded' ) == false ) {
        createTrigger( 'Trigger_loaded' );
        updateNext( true )
        updateStatus( 'Account ' + getProperty( '_name' ) + ' Enabled, Waiting for next check ' );
    } else {
        updateStatus( 'Account ' + getProperty( '_name' ) + ' refresh finished' );
    }
    var myEnergy = GetEnergy();
    updateEnergy( myEnergy[ 1 ], myEnergy[ 5 ], 'Arena' )
    updateEnergy( myEnergy[ 0 ], myEnergy[ 4 ], 'Adventure' )
    checkVersion()
}

function _Disable() {
    updateEnergy( 0, 0, 'Arena' )
    updateEnergy( 0, 0, 'Adventure' )
    theProperties = PropertiesService.getScriptProperties()
    theSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName( 'Settings' );
    updateNext( false )
    updateStatus( 'Disabled - To Enable: Menu > Throwdown > Enable' );
    removeTriggers();
    PropertiesService.getScriptProperties().deleteAllProperties();
}

function _Run() {
    if ( checkTrigger( 'Trigger_loaded' ) != false ) {
        removeTriggers();
        createTrigger( 'Trigger_loaded' );
        updateNext( true )
    }
    Main();
}

function Trigger_loaded() {
    updateNext( true );
    Main();
}

function Main() {
    theSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName( 'Settings' );
    theProperties = PropertiesService.getScriptProperties()
    theXml = UrlFetchApp.fetch( 'https://cb-live.synapse-games.com/assets/cards.xml' ).getContentText();
    updateStatus( 'Started, logging in ' + formattedTime() );
    checkVersion()
    var Loaded = loadUserSettings();
    var User_Auth = authenticateUser( getProperty( 'User_ID' ), getProperty( 'User_Token' ) );
    if ( User_Auth == false ) {
        return false
    }
    if ( getProperty( 'Ad Boost' ) == 'Enabled' ) {
        updateStatus( 'Account ' + getProperty( '_name' ) + ' Loading boostAds ' + formattedTime() );
        var Boost = boostAds(); //Boost every 30 minutes? why not!
        Logger.log( 'Ad Boost:' + Boost );
    }
    var Energy = GetEnergy();
    updateEnergy( Energy[ 1 ], Energy[ 5 ], 'Arena' )
    updateEnergy( Energy[ 0 ], Energy[ 4 ], 'Adventure' )
    if ( checkIfActive( getProperty( '_url' ) ) == true ) {
        updateStatus( 'Account ' + getProperty( '_name' ) + ' Active Session found. Waiting 30 mins ' + formattedTime() );
        Logger.log( 'Active session found' );
        return false
    }
    if ( getProperty( 'Energy Check' ) == 'Enabled' ) {
        var AdvMax = Energy[ 4 ] - 2;
        if ( getProperty( 'Auto Adventure' ) == "Energy overflow control" ) {
            AdvMax = Energy[ 4 ];
        }
        var AreMax = Energy[ 5 ] - 1;
        if ( getProperty( 'Auto Arena' ) == "Energy overflow control" ) {
            AreMax = Energy[ 5 ];
        }
        if ( getProperty( 'Energy Check section' ) == 'playAdventure' && Energy[ 0 ] < AdvMax ) {
            updateStatus( 'Account ' + getProperty( '_name' ) + ' playAdventure not full. ' + formattedTime() );
            Logger.log( 'playAdventure not full' );
            return false;
        }
        if ( getProperty( 'Energy Check section' ) == 'Arena' && Energy[ 1 ] < AdvMax ) {
            updateStatus( 'Account ' + getProperty( '_name' ) + ' Arena not full. ' + formattedTime() );
            Logger.log( 'Arena not full' );
            return false;
        }
        if ( ( getProperty( 'Energy Check section' ) == 'Adventure or Arena' && Energy[ 1 ] >= AreMax ) || ( getProperty( 'Energy Check section' ) == 'Adventure or Arena' && Energy[ 0 ] >= AdvMax ) ) {
            Logger.log( 'FAIL!!!' )
        } else {
            updateStatus( 'Account ' + getProperty( '_name' ) + ' Neither are full. ' + formattedTime() );
            Logger.log( 'Neither are full' );
            return false;
        }
    }
    updateStatus( 'Account ' + getProperty( '_name' ) + ' Starting ' + formattedTime() );
    Logger.log( GetEnergy() );
    _Farming();
    Logger.log( GetEnergy() );
    updateStatus( 'Account ' + getProperty( '_name' ) + ' Finished ' + formattedTime() );
}

function _Farming() {
    var myEnergy = GetEnergy();
    // if (getProperty('Auto Rumble') == "Enabled") {Logger.log(Rumble());}
    if ( getProperty( 'Auto Refill Challenge' ) == "Enabled" && myEnergy[ 2 ] > 0 ) {
        Logger.log( '- - - - RefillChallenge Start - - - -' );
        for ( var i = 0; i < myEnergy[ 6 ]; i++ ) {
            updateStatus( 'Account ' + getProperty( '_name' ) + ' Loading Refill Challenge ' + formattedTime() );
            var result = playRefillChallenge();
            if ( result != false ) {
                addLog( '_logs_RefillChallenge', result )
            }
            Logger.log( result );
            if ( result == false ) {
                break;
            }
        }
        Logger.log( '- - - - RefillChallenge End - - - -' );
    }
    if ( getProperty( 'Auto Non-Refill Challenge' ) == "Enabled" && myEnergy[ 3 ] > 0 ) {
        Logger.log( '- - - - NonRefillChallenge Start - - - -' );
        for ( var i = 0; i < myEnergy[ 7 ]; i++ ) {
            updateStatus( 'Account ' + getProperty( '_name' ) + ' Loading Non-Refill Challenge ' + formattedTime() );
            var result = playNonRefillChallenge();
            if ( result != false ) {
                addLog( '_logs_NoneRefillChallenge', result )
            }
            Logger.log( result );
            if ( result == false ) {
                break;
            }
        }
        Logger.log( '- - - - NonRefillChallenge End - - - -' );
    }
    var myEnergy = GetEnergy();
    if ( ( getProperty( 'Auto Adventure' ) == "Enabled" && myEnergy[ 0 ] > getProperty( '_IslandCost')) || ( getProperty( 'Auto Adventure' ) == "Energy overflow control" && myEnergy[ 0 ] >= myEnergy[ 4 ] ) ) {
        Logger.log( '- - - - Adventure Start - - - -' );
        var SearchLength = myEnergy[ 4 ];
        Logger.log( 'SearchLength:' + SearchLength )
        for ( var i = 0; i < SearchLength; i++ ) {
            updateStatus( 'Account ' + getProperty( '_name' ) + ' Loading Adventure ' + formattedTime() );
            var result = playAdventure();
            if ( result != false ) {
                addLog( '_logs_Adventure', result )
            }
            Logger.log( result );
            var myEnergy = GetEnergy();
            updateEnergy( myEnergy[ 0 ], myEnergy[ 4 ], 'playAdventure' )
            if ( getProperty( 'Auto Adventure' ) == "Energy overflow control" && myEnergy[ 0 ] < myEnergy[ 4 ] ) {
                break;
            }
            if ( result == false ) {
                break;
            }
        }
        completeAchievements( getProperty( '_url' ), '5007' );
        Logger.log( '- - - - playAdventure End - - - -' );
    }
    var myEnergy = GetEnergy();
    if ( ( getProperty( 'Auto Arena' ) == "Enabled" && myEnergy[ 1 ] > 0 ) || ( getProperty( 'Auto Arena' ) == "Energy overflow control" && myEnergy[ 1 ] >= myEnergy[ 5 ] ) ) {
        Logger.log( '- - - - Arena Start - - - -' );
        var SearchLength = myEnergy[ 1 ];
        Logger.log( 'SearchLength:' + SearchLength )
        for ( var i = 0; i < SearchLength; i++ ) {
            updateStatus( 'Account ' + getProperty( '_name' ) + ' Loading Arena ' + formattedTime() );
            var result = playArena();
            if ( result != false ) {
                addLog( '_logs_Arena', result )
            }
            Logger.log( result );
            var myEnergy = GetEnergy();
            updateEnergy( myEnergy[ 1 ], myEnergy[ 5 ], 'Arena' )
            if ( getProperty( 'Auto Arena' ) == "Energy overflow control" && myEnergy[ 1 ] < myEnergy[ 5 ] ) {
                break;
            }
            if ( result == false ) {
                break;
            }
            Utilities.sleep( 2000 );
        }
        completeAchievements( getProperty( '_url' ), '5008' );
        Logger.log( '- - - - Arena End - - - -' );
    }
    completeAchievements( getProperty( '_url' ), '5009' );
    completeAchievements( getProperty( '_url' ), '5010' );
    if ( getProperty( 'Auto Buy/Upgrade Mission' ) == "Enabled" && checkAchievements( getProperty( '_url' ), '5009' ) == true ) {
        updateStatus( 'Account ' + getProperty( '_name' ) + ' Daily Mission ' + formattedTime() );
        Logger.log( '- - - - Auto Buy/Upgrade Mission Start - - - -' );
        var result = buyAndUpgradeCards();
        Logger.log( '- - - - Auto Buy/Upgrade Mission End - - - -' );
    }
    if ( getProperty( 'Auto buy and recycle' ) == "Enabled" ) {
        updateStatus( 'Account ' + getProperty( '_name' ) + ' Buying & Recycling cards ' + formattedTime() );
        Logger.log( '- - - - Auto buy and recycle Start - - - -' );
        var result = buyAndRecycleCards();
        completeAchievements( getProperty( '_url' ), '5010' );
        Logger.log( '- - - - Auto buy and recycle End - - - -' );
    }
    if ( getProperty( 'Ad Crate' ) == 'Enabled' ) {
        updateStatus( 'Account ' + getProperty( '_name' ) + ' Opening AdCrates ' + formattedTime() );
        var Crate = useAdCrates();
        Logger.log( 'Ad Crates:' + Crate );
    }
    var myEnergy = GetEnergy();
    updateEnergy( myEnergy[ 1 ], myEnergy[ 5 ], 'Arena' )
    updateEnergy( myEnergy[ 0 ], myEnergy[ 4 ], 'Adventure' )
    completeAchievements( getProperty( '_url' ), '5012' );
    var myCheck = false;
    if ( getProperty( '_logs_RefillChallenge' + '_count' ) != 0 || "" ) {
        myCheck = true;
    }
    if ( getProperty( '_logs_NoneRefillChallenge' + '_count' ) != 0 || "" ) {
        myCheck = true;
    }
    if ( getProperty( '_logs_Adventure' + '_count' ) != 0 || "" ) {
        myCheck = true;
    }
    if ( getProperty( '_logs_Arena' + '_count' ) != 0 || "" ) {
        myCheck = true;
    }
    if ( getProperty( 'BuyCardAndUpgrade' + '_count' ) != 0 || "" ) {
        myCheck = true;
    }
    if ( getProperty( 'BuyCardAndRecycle' + '_count' ) != 0 || "" ) {
        myCheck = true;
    }
    if ( myCheck == true ) {
        updateStatus( 'Account ' + getProperty( '_name' ) + ' Writing Logs ' + formattedTime() );
        writeLogs( '_logs_RefillChallenge', 'B' );
        writeLogs( '_logs_NoneRefillChallenge', 'C' );
        writeLogs( '_logs_Adventure', 'D' );
        writeLogs( '_logs_Arena', 'E' );
        writeLogs( 'BuyCardAndUpgrade', 'F' );
        writeLogs( 'BuyCardAndRecycle', 'G' );
        writeLogs( '_time', 'A' );
    }
    completeAchievements( getProperty( '_url' ), '5001' );
}

function GetEnergy() { //Returns Current and Max energy.
    // 0-playAdventure : 1-Arena : 2-Challenge : 3-NonRefillChallenge 
    // 4-MaxplayAdventure : 5-MaxplayArena : 6-MaxChallenge : 7-MaxNonRefillChallenge
    var url = getProperty( '_url' );
    var Energy = UrlFetchApp.fetch( url + '&message=getUserAccount' );
    var Energy_Json = JSON.parse( Energy );
    var Challenge = UrlFetchApp.fetch( url + '&message=startChallenge' );
    var Challenge_Json = JSON.parse( Challenge );
    var Arena = Energy_Json.user_data.stamina
    var Arena_Max = Energy_Json.user_data.max_stamina
    var Adventure = Energy_Json.user_data.energy
    var Adventure_Max = Energy_Json.user_data.max_energy
    if ( Challenge_Json.active_events.hasOwnProperty( '102000' ) ) {
        var Challenge = Challenge_Json.active_events[ 102000 ].challenge_data.energy.current_value;
    } else {
        var Challenge = 0
    }
    if ( Challenge_Json.active_events.hasOwnProperty( '102000' ) ) {
        var Challenge_Max = Challenge_Json.active_events[ 102000 ].challenge_data.energy.max_value;
    } else {
        var Challenge_Max = 8
    }
    if ( Challenge_Json.active_events.hasOwnProperty( '103001' ) ) {
        var NonRefillChallenge = Challenge_Json.active_events[ 103001 ].challenge_data.energy.current_value;
    } else {
        var NonRefillChallenge = 0
    }
    if ( Challenge_Json.active_events.hasOwnProperty( '103001' ) ) {
        var NonRefillChallenge_Max = Challenge_Json.active_events[ 103001 ].challenge_data.energy.max_value;
    } else {
        var NonRefillChallenge_Max = 10
    }
    return [ parseInt( Adventure ), parseInt( Arena ), parseInt( Challenge ), parseInt( NonRefillChallenge ), parseInt( Adventure_Max ), parseInt( Arena_Max ), parseInt( Challenge_Max ), parseInt( NonRefillChallenge_Max ) ]
}

function checkVersion() {
    var mySettingsSheet = SpreadsheetApp.openById( '1e6Ru4wgPUD4CtKPVZDTKZ804w23Ulg9_iooKcgkC5Rk' ).getSheetByName( "Settings" );
    var myNewVersion = mySettingsSheet.getRange( "A1" ).getValue();
    var myActiveSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName( "Settings" );
    var myCurrentVersion = myActiveSheet.getRange( "A1" ).getValue();
    if ( myNewVersion > myCurrentVersion ) {
        myActiveSheet.getRange( 'C1' ).setValue( 'New Version Available -> http://tiny.cc/atbot' );
    }
}

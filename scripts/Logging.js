/**
* Save info on cards to logs for writing later.
*/
function AddLogCards( aSection, aReward ) {
    var myString = getProperty( aSection );
    var myCount = getProperty( aSection + '_count' );
    if ( myString == null ) {
        myString = ''
    }
    if ( myCount == null ) {
        myCount = 0
    }
    myString = myString + aReward + '\n';
    setProperty( aSection, myString );
    setProperty( aSection + '_count', parseInt( myCount ,10) + 1 );
}

/**
* Updated Gui with Arena or Adventure energy.
*/
function updateEnergy( energyCurrent, energyMax, energySection ) {
    var mySheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName( "Settings" );
    if ( energySection == 'Arena' ) {
        mySheet.getRange( "D6" ).setValue( 'Arena Energy: ' + energyCurrent + '/' + energyMax );
    } else {
        mySheet.getRange( "C6" ).setValue( 'Adventure Energy: ' + energyCurrent + '/' + energyMax );
    }
}

/**
* Update Gui with Swole status.
*/
function updateSwole( hero, time ) {
    var mySheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName( "Settings" );
    mySheet.getRange( "C7" ).setValue( 'Training ' + idToHero[hero] + ', ' + (time/60/60).toFixed(2) + ' hours.' );
}

/**
* Update Gui when Swole is disabled.
*/
function disableSwole() {
    var mySheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName( "Settings" );
    mySheet.getRange( "C7" ).setValue( 'Disabled' ).setBackground( 'black' );
//    mySheet.getRange( "C7" ).setBackground( 'black' );
}

/**
* Update Gui with time to next check.
*/
function updateNext( aCheck ) {
    var mySheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName( "Settings" );
    if ( aCheck == true ) {
        mySheet.getRange( "C8" ).setValue( 'Next check ' + myFormattedTimeNext() );
    } else {
        mySheet.getRange( "C8" ).setValue( 'Disabled at ' + formattedTime() );
    }
}

/**
* Update Gui with time to next rumble.
*/
function updateNextRumble( aCheck,aTime ) {
    var mySheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName( "Settings" );
    if ( aCheck == true ) {
        mySheet.getRange( "C9" ).setValue( 'Next Rumble Check ' + aTime );
    } else {
        mySheet.getRange( "C9" ).setValue( 'Disabled at ' + formattedTime() );
    }
}

/**
* Save info on attack rewards to logs.
*/
function addLog( aSection, aReward ) {
    var myRewards = parseRewards( aReward );
    var myString = ''
    var myCount = 0
    myString = getProperty( aSection );
    myCount = getProperty( aSection + '_count' );
    myString = myString + myRewards + '\n';
    setProperty( aSection, myString );
    setProperty( aSection + '_count', parseInt( myCount ,10) + 1 );
}

/**
* Write logs to Logs in sheet.
*/
function writeLogs( aSection, aRow ) {
    var myEmptyRow = getFirstEmptyRow();
    var myCount = 0
    var myString = getProperty( aSection )+"";
    myCount = getProperty( aSection + '_count' );
    var mySheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName( 'Logs' );
    if ( myString != null ) {
        mySheet.getRange( aRow + "" + myEmptyRow ).setNote( myString );
        if (aSection == "BuyCardAndRecycle") {
            if (myString.indexOf("Rarity:4") >= 0) {
              mySheet.getRange( aRow + "" + myEmptyRow ).setBackground('#b517dc');
              mySheet.getRange( aRow + "" + myEmptyRow ).setFontColor('white');
            } else if (myString.indexOf("Rarity:3") >= 0) {
              mySheet.getRange( aRow + "" + myEmptyRow ).setBackground('#26f2ff');
              mySheet.getRange( aRow + "" + myEmptyRow ).setFontColor('white');
            } else if (myString.indexOf("Rarity:2") >= 0) {
              mySheet.getRange( aRow + "" + myEmptyRow ).setBackground('#87d97a');
              mySheet.getRange( aRow + "" + myEmptyRow ).setFontColor('white');
            } else {
              mySheet.getRange( aRow + "" + myEmptyRow ).setBackground('#d9d9d9');
              //mySheet.getRange( aRow + "" + myEmptyRow ).setFontColor('white');
            }
        }
    }
    mySheet.getRange( aRow + "" + myEmptyRow ).setValue( myCount );
    setProperty( aSection, '' )
    setProperty( aSection + '_count', 0 );
}

/**
* find the first empty row on logs for writing logs.
* return first empty row
*/
function getFirstEmptyRow() {
    var spr = SpreadsheetApp.getActiveSpreadsheet().getSheetByName( "Logs" );
    var column = spr.getRange( 'A:A' );
    var values = column.getValues();
    var ct = 0;
    while ( values[ ct ][ 0 ] != "" ) {
        ct++;
    }
    return ( ct + 1 );
}


/**
* Write Logs to sheet Logs.
*/
function WriteLogs() { 
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
     if ( getProperty( '_logs_Rumble' + '_count' ) != 0 || "" ) {
        myCheck = true;
    }
    if ( getProperty( '_logs_Siege' + '_count' ) != 0 || "" ) {
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
        writeLogs( '_logs_Rumble', 'H' );
        writeLogs( '_logs_Siege', 'I' );
        writeLogs( '_time', 'A' );
      
    }
}

/**
* Parse/Convert attack rewards to string.
* return error/rewards string
*/
function parseRewards( aRewards ) {
    var itemInfo = UrlFetchApp.fetch( getProperty( '_url' ) + '&message=useItem' );
    var itemInfoJson = JSON.parse( itemInfo );
    var rewardsJson = JSON.parse( aRewards )[ 0 ];
    Logger.log(aRewards);
    Logger.log(rewardsJson);
    if ( rewardsJson.gold != null ) {
        var gold = rewardsJson.gold;
    } else {
        var gold = 0;
    }
    Logger.log("rewardsJson.hero_xp = " + rewardsJson.hero_xp);
    if ( rewardsJson.hero_xp != null ) {
        Logger.log("found tokens");
        var tokens = "" + idToHero[parseInt(rewardsJson.hero_xp.hero_id,10)] + ": " + rewardsJson.hero_xp.xp;
    } else {
        Logger.log("no tokens found");
        var tokens = 0;
    }
    if ( rewardsJson.sp != null ) {
        var sp = rewardsJson.sp;
    } else {
        var sp = 0;
    }
    if ( rewardsJson.xp != null ) {
        var xp = rewardsJson.xp;
    } else {
        var xp = 0;
    }
    if ( rewardsJson.rating_change != null ) {
        var ratingChange = rewardsJson.rating_change;
    } else {
        var ratingChange = 0;
    }
    if ( rewardsJson.guild_war_points != null ) {
        var guildWarPoints = rewardsJson.guild_war_points;
    } else {
        var guildWarPoints = 0;
    }
    var items = '';
    var string = '';
    if ( rewardsJson.item != null ) {
        var itemlist = rewardsJson.item;
    } else if ( rewardsJson.items != null ) {
        var itemlist = rewardsJson.items;
    }
    if ( itemlist != null ) {
        for ( var i = 0; i < itemlist.length; i++ ) {
            var item = itemlist[ i ].id;
            var number = itemlist[ i ].number;
            if ( item == 30001 || item == 30002 ) {
                var itemName = 'Adcrate';
            } else { //They are removed from the inventory before it can id them.
                var itemName = itemInfoJson.user_items[ item ].name;
            }
            items = items + ' [' + itemName + ':' + number + ']';
        }
    }
    if ( gold != 0 ) {
        string = string + ' Gold:' + gold;
    }
    if ( sp != 0 ) {
        string = string + ' Watts:' + sp;
    }
    if ( guildWarPoints != 0 ) {
        string = string + ' Guild War Points:' + guildWarPoints;
    }
    if ( xp != 0 ) {
        string = string + ' xp:' + xp;
    }
    if ( ratingChange != 0 ) {
        string = string + ' RatingChange:' + ratingChange;
    }
    if ( items != '' ) {
        string = string + ' items:' + items;
    }
    if ( tokens != '' ) {
        string = string + ' tokens:' + tokens;
    }
    if ( string == '' ) {
        string = 'No rewards/Failed to load rewards'
    }
    return string;
}

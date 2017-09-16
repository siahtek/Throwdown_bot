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
    setProperty( aSection + '_count', parseInt( myCount ) + 1 );
}

/**
* Updated Gui with Arena or Adventure energy.
*/
function updateEnergy( aCheck, aMax, aSection ) {
    var mySheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName( "Settings" );
    if ( aSection == 'Arena' ) {
        mySheet.getRange( "D6" ).setValue( 'Arena Energy: ' + aCheck + '/' + aMax );
    } else {
        mySheet.getRange( "C6" ).setValue( 'Adventure Energy: ' + aCheck + '/' + aMax );
    }
}

/**
* Update Gui with time to next check.
*/
function updateNext( aCheck ) {
    var mySheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName( "Settings" );
    if ( aCheck == true ) {
        mySheet.getRange( "C7" ).setValue( 'Next check ' + myFormattedTimeNext() );
    } else {
        mySheet.getRange( "C7" ).setValue( 'Disabled at ' + formattedTime() );
    }
}

/**
* Update Gui with time to next rumble.
*/
function updateNextRumble( aCheck,aTime ) {
    var mySheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName( "Settings" );
    if ( aCheck == true ) {
        mySheet.getRange( "C8" ).setValue( 'Next Rumble Check ' + aTime );
    } else {
        mySheet.getRange( "C8" ).setValue( 'Disabled at ' + formattedTime() );
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
    setProperty( aSection + '_count', parseInt( myCount ) + 1 );
}

/**
* Write logs to Logs in sheet.
*/
function writeLogs( aSection, aRow ) {
    var myEmptyRow = getFirstEmptyRow();
    var myCount = 0
    var myString = ''
    var myString = getProperty( aSection );
    myCount = getProperty( aSection + '_count' );
    var mySheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName( 'Logs' );
    if ( myString != null ) {
        mySheet.getRange( aRow + "" + myEmptyRow ).setNote( myString );
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
    if ( myCheck == true ) {
        updateStatus( 'Account ' + getProperty( '_name' ) + ' Writing Logs ' + formattedTime() );
        writeLogs( '_logs_RefillChallenge', 'B' );
        writeLogs( '_logs_NoneRefillChallenge', 'C' );
        writeLogs( '_logs_Adventure', 'D' );
        writeLogs( '_logs_Arena', 'E' );
        writeLogs( 'BuyCardAndUpgrade', 'F' );
        writeLogs( 'BuyCardAndRecycle', 'G' );
        writeLogs( '_logs_Rumble', 'H' );
        writeLogs( '_time', 'A' );
    }
}

/**
* Parse/Convert attack rewards to string.
* return error/rewards string
*/
function parseRewards( aRewards ) {
    var ItemInfo = UrlFetchApp.fetch( getProperty( '_url' ) + '&message=useItem' );
    var ItemInfo_json = JSON.parse( ItemInfo );
    var rewards_Json = JSON.parse( aRewards )[ 0 ]
    if ( rewards_Json.gold != null ) {
        var Gold = rewards_Json.gold
    } else {
        var Gold = 0
    }
    if ( rewards_Json.sp != null ) {
        var Sp = rewards_Json.sp
    } else {
        var Sp = 0
    }
    if ( rewards_Json.xp != null ) {
        var xp = rewards_Json.xp
    } else {
        var xp = 0
    }
    if ( rewards_Json.rating_change != null ) {
        var RatingChange = rewards_Json.rating_change
    } else {
        var RatingChange = 0
    }
    if ( rewards_Json.guild_war_points != null ) {
        var GuildWarPoints = rewards_Json.guild_war_points
    } else {
        var GuildWarPoints = 0
    }
    var items = ''
    var string = ''
    if ( rewards_Json.item != null ) {
        var itemlist = rewards_Json.item
    } else if ( rewards_Json.items != null ) {
        var itemlist = rewards_Json.items
    }
    if ( itemlist != null ) {
        for ( var i = 0; i < itemlist.length; i++ ) {
            var item = itemlist[ i ].id;
            var Number = itemlist[ i ].number;
            if ( item == 30001 || item == 30002 ) {
                var item_name = 'Adcrate'
            } else { //They are removed from the inventory before it can id them.
                var item_name = ItemInfo_json.user_items[ item ].name;
            }
            items = items + ' [' + item_name + ':' + Number + ']'
        }
    }
    if ( Gold != 0 ) {
        string = string + ' Gold:' + Gold
    }
    if ( Sp != 0 ) {
        string = string + ' Wats:' + Sp
    }
    if ( GuildWarPoints != 0 ) {
        string = string + ' Guild War Points:' + GuildWarPoints
    }
    if ( xp != 0 ) {
        string = string + ' xp:' + xp
    }
    if ( RatingChange != 0 ) {
        string = string + ' RatingChange:' + RatingChange
    }
    if ( items != '' ) {
        string = string + ' items:' + items
    }
    if ( string == '' ) {
        string = 'No rewards/Failed to load rewards'
    }
    return string
}

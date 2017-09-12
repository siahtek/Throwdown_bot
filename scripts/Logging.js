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

function updateEnergy( aCheck, aMax, aSection ) {
    var mySheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName( "Settings" );
    if ( aSection == 'Arena' ) {
        mySheet.getRange( "D6" ).setValue( 'Arena Energy: ' + aCheck + '/' + aMax );
    } else {
        mySheet.getRange( "C6" ).setValue( 'Adventure Energy: ' + aCheck + '/' + aMax );
    }
}

function updateNext( aCheck ) {
    var mySheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName( "Settings" );
    if ( aCheck == true ) {
        mySheet.getRange( "C7" ).setValue( 'Next check ' + myFormattedTimeNext() );
    } else {
        mySheet.getRange( "C7" ).setValue( 'Disabled at ' + formattedTime() );
    }
}

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
    var items = '',
        string = ''
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

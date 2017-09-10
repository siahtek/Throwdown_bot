function AddLogCards( Section, Reward ) {
    var string = _getp( Section );
    var Count = _getp( Section + '_count' );
    if ( string == null ) {
        string = ''
    }
    if ( Count == null ) {
        Count = 0
    }
    string = string + Reward + '\n';
    _setp( Section, string );
    _setp( Section + '_count', parseInt( Count ) + 1 );
}

function EnergyUpdate( check, max, section ) {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName( "Settings" );
    if ( section == 'Arena' ) {
        sheet.getRange( "D6" ).setValue( 'Arena Energy: ' + check + '/' + max );
    } else {
        sheet.getRange( "C6" ).setValue( 'Adventure Energy: ' + check + '/' + max );
    }
}

function UpdateNext( check ) {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName( "Settings" );
    if ( check == true ) {
        sheet.getRange( "C7" ).setValue( 'Next check ' + TimeFormatedNext() );
    } else {
        sheet.getRange( "C7" ).setValue( 'Disabled at ' + TimeFormated() );
    }
}

function AddLog( Section, Reward ) {
    var rewards = RewardsParse( Reward );
    var string = ''
    var Count = 0
    string = _getp( Section );
    Count = _getp( Section + '_count' );
    string = string + rewards + '\n';
    _setp( Section, string );
    _setp( Section + '_count', parseInt( Count ) + 1 );
}

function WriteLogs( Section, Row ) {
    var empty = getFirstEmptyRow();
    var Count = 0
    var string = ''
    var string = _getp( Section );
    Count = _getp( Section + '_count' );
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName( 'Logs' );
    if ( string != null ) {
        sheet.getRange( Row + "" + empty ).setNote( string );
    }
    sheet.getRange( Row + "" + empty ).setValue( Count );
    _setp( Section, '' )
    _setp( Section + '_count', 0 );
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

function RewardsParse( rewards ) {
    var ItemInfo = UrlFetchApp.fetch( _getp( '_url' ) + '&message=useItem' );
    var ItemInfo_json = JSON.parse( ItemInfo );
    var rewards_Json = JSON.parse( rewards )[ 0 ]
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

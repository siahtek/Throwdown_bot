function LoadUserSettings() { //Read settings
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName( 'Settings' );
    var Range = sheet.getRange( "C1:D80" ).getValues();
    var _properties = PropertiesService.getScriptProperties();
    var XML = UrlFetchApp.fetch( 'https://cb-live.synapse-games.com/assets/cards.xml' ).getContentText();
    var Search = '';
    if ( _MenuGetSetting( Range, 'Brian' ) == 'Enabled' ) {
        Search = Search + ',1003'
    }
    if ( _MenuGetSetting( Range, 'Stewie' ) == 'Enabled' ) {
        Search = Search + ',1002'
    }
    if ( _MenuGetSetting( Range, 'Louise' ) == 'Enabled' ) {
        Search = Search + ',3002'
    }
    if ( _MenuGetSetting( Range, 'Steve' ) == 'Enabled' ) {
        Search = Search + ',2003'
    }
    if ( _MenuGetSetting( Range, 'Bender' ) == 'Enabled' ) {
        Search = Search + ',5016'
    }
    if ( _MenuGetSetting( Range, 'Dale' ) == 'Enabled' ) {
        Search = Search + ',4003'
    }
    if ( _MenuGetSetting( Range, 'Bob' ) == 'Enabled' ) {
        Search = Search + ',3001'
    }
    if ( _MenuGetSetting( Range, 'Roger' ) == 'Enabled' ) {
        Search = Search + ',2001'
    }
    if ( _MenuGetSetting( Range, 'Leela' ) == 'Enabled' ) {
        Search = Search + ',5018'
    }
    if ( _MenuGetSetting( Range, 'Bobby' ) == 'Enabled' ) {
        Search = Search + ',4002'
    }
    if ( _MenuGetSetting( Range, 'Peter' ) == 'Enabled' ) {
        Search = Search + ',1001'
    }
    if ( _MenuGetSetting( Range, 'Tina' ) == 'Enabled' ) {
        Search = Search + ',3003'
    }
    if ( _MenuGetSetting( Range, 'Stan' ) == 'Enabled' ) {
        Search = Search + ',2002'
    }
    if ( _MenuGetSetting( Range, 'Fry' ) == 'Enabled' ) {
        Search = Search + ',5017'
    }
    if ( _MenuGetSetting( Range, 'Hank' ) == 'Enabled' ) {
        Search = Search + ',4001'
    }
    if ( _MenuGetSetting( Range, 'Consuela' ) == 'Enabled' ) {
        Search = Search + ',1004'
    }
    if ( _MenuGetSetting( Range, 'Ricky Spanish' ) == 'Enabled' ) {
        Search = Search + ',2005'
    }
    if ( _MenuGetSetting( Range, 'Gene' ) == 'Enabled' ) {
        Search = Search + ',3304'
    }
    if ( _MenuGetSetting( Range, 'Zapp Brannigan' ) == 'Enabled' ) {
        Search = Search + ',5019'
    }
    _properties.setProperties( {
        //User info
        'User_ID': _MenuGetSetting( Range, 'User_ID' ),
        'User_Token': _MenuGetSetting( Range, 'User_Token' ),
        //Options
        'Energy Check': _MenuGetSetting( Range, 'Energy Check' ),
        'Energy Check section': _MenuGetSetting( Range, 'Energy Check section' ),
        'Ad Crate': _MenuGetSetting( Range, 'Ad Crate' ),
        'Ad Boost': _MenuGetSetting( Range, 'Ad Boost' ),
        //Cards
        'Auto buy and recycle': _MenuGetSetting( Range, 'Auto buy and recycle' ),
        'Cards rarities to recycle': _MenuGetSetting( Range, 'Cards rarities to recycle' ),
        'Auto buy limit': _MenuGetSetting( Range, 'Auto buy limit' ),
        'Auto Buy/Upgrade Mission': _MenuGetSetting( Range, 'Auto Buy/Upgrade Mission' ),
        //Refill Challenge
        'Auto Refill Challenge': _MenuGetSetting( Range, 'Auto Refill Challenge' ),
        'Refill Challenge Deck': _MenuGetSetting( Range, 'Refill Challenge Deck' ),
        //Non-Refill Challenge
        'Auto Non-Refill Challenge': _MenuGetSetting( Range, 'Auto Non-Refill Challenge' ),
        'Non-Refill Challenge Deck': _MenuGetSetting( Range, 'Non-Refill Challenge Deck' ),
        //Rumble
        'Auto Rumble': _MenuGetSetting( Range, 'Auto Rumble' ),
        'Rumble Deck': _MenuGetSetting( Range, 'Rumble Deck' ),
        'Rumble Energy Check': _MenuGetSetting( Range, 'Rumble Energy Check' ),
        'Panic time': _MenuGetSetting( Range, 'Panic time' ),
        //playAdventure
        'Auto playAdventure': _MenuGetSetting( Range, 'Auto playAdventure' ),
        'playAdventure Deck': _MenuGetSetting( Range, 'playAdventure Deck' ),
        'Island to farm': _ConvertIsland( _MenuGetSetting( Range, 'Island to farm' ) ) + '',
        //Arena
        'Auto Arena': _MenuGetSetting( Range, 'Auto Arena' ),
        'Arena Deck': _MenuGetSetting( Range, 'Arena Deck' ),
        //Token Search
        'Token Search': _MenuGetSetting( Range, 'Token Search' ),
        'Search Timeout': _MenuGetSetting( Range, 'Search Timeout' ),
        'Arena_Target': Search,
        'Consuela': _MenuGetSetting( Range, 'Consuela' ),
        'Ricky Spanish': _MenuGetSetting( Range, 'Ricky Spanish' ),
        'Gene': _MenuGetSetting( Range, 'Gene' ),
        'Zapp Brannigan': _MenuGetSetting( Range, 'Zapp Brannigan' ),
        //Other
        '_currenttime': TimeFormated(),
        '_time_count': TimeFormated(),
        //Logging
        '_logs_RefillChallenge': '',
        '_logs_RefillChallenge_count': 0,
        '_logs_NoneRefillChallenge': '',
        '_logs_NoneRefillChallenge_count': 0,
        '_logs_Adventure': '',
        '_logs_Adventure_count': 0,
        '_logs_Arena': '',
        '_logs_Arena_count': 0,
        'BuyCardAndRecycle': '',
        'BuyCardAndRecycle_count': 0,
        'BuyCardAndUpgrade': '',
        'BuyCardAndUpgrade_count': 0,
    } )

    function _MenuGetSetting( array, setting ) {
        for ( var i = 0; i < array.length; i++ ) {
            if ( array[ i ][ 0 ] == setting ) {
                return array[ i ][ 1 ]
            }
        }
    }
    return true
}

function _ConvertIsland( info ) {
    if ( info.length < 4 ) {
        info = "0" + info
    }
    var island = parseInt( info.substring( 0, 2 ) );
    var pos = parseInt( info.substring( 3, 4 ) );
    var math = ( island * 3 ) - ( 3 - pos ) + ( 100 ) + '';
    return math;
}

function AuthenticateUser( Id, Token ) { //Check if use is valid & create user myUrl
    var KONG_URL = 'https://cb-live.synapse-games.com/api.php?';
    var User_Auth = UrlFetchApp.fetch( KONG_URL + 'message=getUserAccount&kong_id=' + Id + '&kong_token=' + Token );
    var User_auth_Json = JSON.parse( User_Auth );
    var USER_ID = User_auth_Json.new_user;
    var USER_PASSWORD = User_auth_Json.new_password;
    var USER_NAME = User_auth_Json.new_name;
    var CHECK = User_auth_Json.result;
      if ( CHECK == true ) {
        UpdateStatus( 'Login failed.. Check User_Ud & User_Token ' + TimeFormated() );
        Logger.log( 'User Auth fail' );
        return false
    }
    var myUrl = KONG_URL + 'user_id=' + USER_ID + '&password=' + USER_PASSWORD;
    _setp( '_url', myUrl );
    _setp( '_name', USER_NAME );
  
  if ( _getp( 'Auto Adventure' ) == "Enabled"||"Energy overflow control"){
    var check = _CheckIsland(URL, _getp('Island to farm'));
    if(check != false){
      _setp( '_IslandCost', check+'');
    }else{
      UpdateStatus( 'Account ' + _getp( '_name' ) + ' Island unavailable to farm ' + TimeFormated() );
      return false
    }
  }
}

function UpdateStatus( Status ) { //Update status section on the menu
    _sheet.getRange( "C4" ).setValue( Status );
}

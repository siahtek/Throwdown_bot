/**
* Load user settings to google Properties for reference later.
* return true
*/
function loadUserSettings() { //Read settings
    var mySheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName( 'Settings' );
    var myRange = mySheet.getRange( "C1:D80" ).getValues();
    var myProperties = PropertiesService.getScriptProperties();
    var myXml = UrlFetchApp.fetch( 'https://cb-live.synapse-games.com/assets/cards.xml' ).getContentText();
    var mySearch = getCharacterTokens(myRange);
	//	load and bulk save user settings to google.
    myProperties.setProperties( { 
        //User info
        'User_ID': getSetting( myRange, 'User_ID' ),
        'User_Token': getSetting( myRange, 'User_Token' ),
        //Options
        'Energy Check': getSetting( myRange, 'Energy Check' ),
        'Energy Check section': getSetting( myRange, 'Energy Check section' ),
        'Ad Crate': getSetting( myRange, 'Ad Crate' ),
        'Ad Boost': getSetting( myRange, 'Ad Boost' ),
        //Cards
        'Auto buy and recycle': getSetting( myRange, 'Auto buy and recycle' ),
        'Cards rarities to recycle': getSetting( myRange, 'Cards rarities to recycle' ),
        'Auto buy limit': getSetting( myRange, 'Auto buy limit' ),
        'Auto Buy/Upgrade Mission': getSetting( myRange, 'Auto Buy/Upgrade Mission' ),
        //Refill Challenge
        'Auto Refill Challenge': getSetting( myRange, 'Auto Refill Challenge' ),
        'Refill Challenge Deck': getSetting( myRange, 'Refill Challenge Deck' ),
        //Non-Refill Challenge
        'Auto Non-Refill Challenge': getSetting( myRange, 'Auto Non-Refill Challenge' ),
        'Non-Refill Challenge Deck': getSetting( myRange, 'Non-Refill Challenge Deck' ),
        //Rumble
        'Rumble Deck': getSetting( myRange, 'Rumble Deck' ),
        'Rumble Energy Check': getSetting( myRange, 'Rumble Energy Check' ),
        'Panic time': getSetting( myRange, 'Panic time' ),
        //Adventure
        'Auto Adventure': getSetting( myRange, 'Auto Adventure' ),
        'Adventure Deck': getSetting( myRange, 'Adventure Deck' ),
        'Island to farm': convertIsland( getSetting( myRange, 'Island to farm' ) ) + '',
        //Arena
        'Auto Arena': getSetting( myRange, 'Auto Arena' ),
        'Arena Deck': getSetting( myRange, 'Arena Deck' ),
        //Token Search
        'Token Search': getSetting( myRange, 'Token Search' ),
        'Search Timeout': getSetting( myRange, 'Search Timeout' ),
        'Arena_Target': mySearch,
        'Consuela': getSetting( myRange, 'Consuela' ),
        'Ricky Spanish': getSetting( myRange, 'Ricky Spanish' ),
        'Gene': getSetting( myRange, 'Gene' ),
        'Zapp Brannigan': getSetting( myRange, 'Zapp Brannigan' ),
        //Other
        '_currenttime': formattedTime(),
        '_time_count': formattedTime(),
        //Logging
        '_logs_RefillChallenge': '',
        '_logs_RefillChallenge_count': 0,
        '_logs_NoneRefillChallenge': '',
        '_logs_NoneRefillChallenge_count': 0,
        '_logs_Adventure': '',
        '_logs_Adventure_count': 0,
        '_logs_Arena': '',
        '_logs_Arena_count': 0,
        '_logs_Rumble' : '',
        '_logs_Rumble_count' : 0,
        'BuyCardAndRecycle': '',
        'BuyCardAndRecycle_count': 0,
        'BuyCardAndUpgrade': '',
        'BuyCardAndUpgrade_count': 0,
      
    } )
    return true
}

/**
* Searches the sheet for the settings location and returns the setting option.
* return location
*/
function getSetting( aArray, aSetting ) {
  for ( var i = 0; i < aArray.length; i++ ) {
    if ( aArray[ i ][ 0 ] == aSetting ) {
      return aArray[ i ][ 1 ]
    }
  }
}

/**
* Converts island numbers to island ID
* return island ID
*/
function convertIsland( aInfo ) {
    if ( aInfo.length < 4 ) {
        aInfo = "0" + aInfo
    }
    var myIsland = parseInt( aInfo.substring( 0, 2 ) );
    var myPos = parseInt( aInfo.substring( 3, 4 ) );
    var myMath = ( myIsland * 3 ) - ( 3 - myPos ) + ( 100 ) + '';
    return myMath;
}

/**
* Check if user login is valid and generate user URL.
* return true/false
*/
function authenticateUser( aId, aToken ) { //Check if use is valid & create user myUrl
    var KONGURL = 'https://cb-live.synapse-games.com/api.php?';
    var myUserAuth = UrlFetchApp.fetch( KONGURL + 'message=getUserAccount&kong_id=' + aId + '&kong_token=' + aToken );
    var myUserAuthJson = JSON.parse( myUserAuth );
    var myUserId = myUserAuthJson.new_user;
    var myUserPass = myUserAuthJson.new_password;
    var myUserName = myUserAuthJson.new_name;
    var myResult = myUserAuthJson.result;
      if ( myResult == true ) {
        updateStatus( 'Login failed.. Check User_ID & User_Token ' + formattedTime() );
        Logger.log( 'User Auth fail' );
        return false
    }
    var myUrl = KONGURL + 'user_id=' + myUserId + '&password=' + myUserPass;
    setProperty( '_url', myUrl );
    setProperty( '_name', myUserName );
  
  if ( getProperty( 'Auto Adventure' ) == "Enabled"||"Energy overflow control"){
    var myCheck = checkIsland(myUrl, getProperty('Island to farm'));
    if(myCheck != false){
      setProperty( '_IslandCost', myCheck+'');
    }else{
      updateStatus( 'Account ' + getProperty( '_name' ) + ' Island unavailable to farm ' + formattedTime() );
      return false
    }
  }
  return true
}

/**
* Update status section on the Gui with string.
*/
function updateStatus( aStatus ) { //Update status section on the menu
    theSheet.getRange( "C4" ).setValue( aStatus );
}

/**
* Load Character token search settings from settings.
* return search string.
*/
function getCharacterTokens(aRange) {
		// load empty string for adding to.
		var mySearch = '';
		if ( getSetting( aRange, 'Brian' ) == 'Enabled' ) {
			mySearch = mySearch + ',1003'
		}
		if ( getSetting( aRange, 'Stewie' ) == 'Enabled' ) {
			mySearch = mySearch + ',1002'
		}
		if ( getSetting( aRange, 'Louise' ) == 'Enabled' ) {
			mySearch = mySearch + ',3002'
		}
		if ( getSetting( aRange, 'Steve' ) == 'Enabled' ) {
			mySearch = mySearch + ',2003'
		}
		if ( getSetting( aRange, 'Bender' ) == 'Enabled' ) {
			mySearch = mySearch + ',5016'
		}
		if ( getSetting( aRange, 'Dale' ) == 'Enabled' ) {
			mySearch = mySearch + ',4003'
		}
		if ( getSetting( aRange, 'Bob' ) == 'Enabled' ) {
			mySearch = mySearch + ',3001'
		}
		if ( getSetting( aRange, 'Roger' ) == 'Enabled' ) {
			mySearch = mySearch + ',2001'
		}
		if ( getSetting( aRange, 'Leela' ) == 'Enabled' ) {
			mySearch = mySearch + ',5018'
		}
		if ( getSetting( aRange, 'Bobby' ) == 'Enabled' ) {
			mySearch = mySearch + ',4002'
		}
		if ( getSetting( aRange, 'Peter' ) == 'Enabled' ) {
			mySearch = mySearch + ',1001'
		}
		if ( getSetting( aRange, 'Tina' ) == 'Enabled' ) {
			mySearch = mySearch + ',3003'
		}
		if ( getSetting( aRange, 'Stan' ) == 'Enabled' ) {
			mySearch = mySearch + ',2002'
		}
		if ( getSetting( aRange, 'Fry' ) == 'Enabled' ) {
			mySearch = mySearch + ',5017'
		}
		if ( getSetting( aRange, 'Hank' ) == 'Enabled' ) {
			mySearch = mySearch + ',4001'
		}
		if ( getSetting( aRange, 'Consuela' ) == 'Enabled' ) {
			mySearch = mySearch + ',1004'
		}
		if ( getSetting( aRange, 'Ricky Spanish' ) == 'Enabled' ) {
			mySearch = mySearch + ',2005'
		}
		if ( getSetting( aRange, 'Gene' ) == 'Enabled' ) {
			mySearch = mySearch + ',3004'
		}
		if ( getSetting( aRange, 'Zapp Brannigan' ) == 'Enabled' ) {
			mySearch = mySearch + ',5019'
		}
		if ( getSetting( aRange, 'The Giant Chicken' ) == 'Enabled' ) {
			mySearch = mySearch + ',1005'
		}
		if ( getSetting( aRange, 'John Redcorn' ) == 'Enabled' ) {
			mySearch = mySearch + ',4004'
		}
	
	return mySearch
	}

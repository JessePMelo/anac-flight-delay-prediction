/* =========================================================
Airline lookup table
========================================================= */

const _airlineLookup = Object.create(null);

Object.assign(_airlineLookup, {

/* =========================
ICAO codes do dataset
========================= */

"AZU":"AZU",
"ACA":"ACA",
"ACN":"ACN",
"AAL":"AAL",
"ABB":"ABB",
"ABJ":"ABJ",
"AEA":"AEA",
"AFR":"AFR",
"AMX":"AMX",
"ARG":"ARG",
"AVA":"AVA",
"AZP":"AZP",
"CLX":"CLX",
"GLO":"GLO",
"PTB":"PTB",
"BAW":"BAW",
"GTI":"GTI",
"TAM":"TAM",
"BOV":"BOV",
"HFY":"HFY",
"IBE":"IBE",
"ITY":"ITY",
"CCA":"CCA",
"CJT":"CJT",
"JAT":"JAT",
"JES":"JES",
"CKS":"CKS",
"KAL":"KAL",
"KLM":"KLM",
"LAE":"LAE",
"LAN":"LAN",
"LAP":"LAP",
"LCO":"LCO",
"LPE":"LPE",
"LTG":"LTG",
"MAA":"MAA",
"MPH":"MPH",
"MWM":"MWM",
"NCR":"NCR",
"OAE":"OAE",
"OMI":"OMI",
"PAM":"PAM",
"QTR":"QTR",
"RER":"RER",
"RZO":"RZO",
"SID":"SID",
"SKU":"SKU",
"SRU":"SRU",
"SWQ":"SWQ",
"SWR":"SWR",
"UAL":"UAL",
"UPS":"UPS",
"VVC":"VVC",
"TAP":"TAP",
"TGY":"TGY",
"THY":"THY",
"TPA":"TPA",
"TTL":"TTL",
"UAE":"UAE",
"CMP":"CMP",
"CQB":"CQB",
"DAL":"DAL",
"DLH":"DLH",
"DTA":"DTA",
"EDR":"EDR",
"ETH":"ETH",
"FBZ":"FBZ",
"FDX":"FDX",
"GEC":"GEC",
"AWC":"AWC",
"AZG":"AZG",
"EQX":"EQX",
"PUE":"PUE",
"RAM":"RAM",
"KRE":"KRE",
"OBS":"OBS",
"BUY":"BUY",
"AXY":"AXY",
"AZQ":"AZQ",
"BOL":"BOL",
"QCL":"QCL",
"RUC":"RUC",
"LNE":"LNE",
"UKL":"UKL",
"VCV":"VCV",
"AZN":"AZN",
"ETR":"ETR",
"VTU":"VTU",
"EAL":"EAL",
"ANS":"ANS",
"EVE":"EVE",
"ADB":"ADB",
"CXB":"CXB",
"IGA":"IGA",
"KAI":"KAI",
"SKX":"SKX",
"1ED":"1ED",
"CVK":"CVK",
"EPT":"EPT",
"EUS":"EUS",
"HFM":"HFM",
"ARE":"ARE",
"DWI":"DWI",
"JMK":"JMK",
"MSR":"MSR",
"GXA":"GXA",
"ICE":"ICE",
"SAA":"SAA",
"LOT":"LOT",
"ARN":"ARN",
"ACL":"ACL",
"AJB":"AJB",
"SLM":"SLM",
"WFL":"WFL",
"TOT":"TOT",
"ABD":"ABD",
"SVA":"SVA",
"SHH":"SHH",
"CFG":"CFG",
"TVR":"TVR",
"TVS":"TVS",
"DAP":"DAP",
"WIN":"WIN",
"AJT":"AJT",
"PVV":"PVV",
"RSB":"RSB",
"DAE":"DAE",
"TVQ":"TVQ",
"ARU":"ARU",
"PVG":"PVG",
"UCG":"UCG",
"LYC":"LYC",
"JAP":"JAP",
"AEB":"AEB",
"MSI":"MSI",
"USY":"USY",
"BPC":"BPC",
"IWY":"IWY",
"MLM":"MLM",
"CSB":"CSB",
"PLS":"PLS",
"MMZ":"MMZ",
"GJW":"GJW",
"LVL":"LVL",

/* =========================
Nomes das companhias
========================= */

/* Brasil */

"AZUL":"AZU",
"AZUL LINHAS AÉREAS":"AZU",

"GOL":"GLO",
"GOL LINHAS AÉREAS":"GLO",

"LATAM":"TAM",
"LATAM BRASIL":"TAM",
"TAM":"TAM",

"PASSAREDO":"PTB",
"VOEPASS":"PTB",

/* América */

"AMERICAN":"AAL",
"AMERICAN AIRLINES":"AAL",

"DELTA":"DAL",
"DELTA AIR LINES":"DAL",

"UNITED":"UAL",
"UNITED AIRLINES":"UAL",

"AVIANCA":"AVA",
"AVIANCA COLOMBIA":"AVA",

"COPA":"CMP",
"COPA AIRLINES":"CMP",

"AEROMEXICO":"AMX",

"AEROLINEAS ARGENTINAS":"ARG",

"LATAM PERU":"LPE",

/* Europa */

"AIR FRANCE":"AFR",

"KLM":"KLM",

"LUFTHANSA":"DLH",

"IBERIA":"IBE",

"BRITISH AIRWAYS":"BAW",

"TAP":"TAP",
"TAP PORTUGAL":"TAP",

"SWISS":"SWR",

"AIR EUROPA":"AEA",

"LOT":"LOT",
"LOT POLISH":"LOT",

/* Oriente Médio */

"EMIRATES":"UAE",

"QATAR":"QTR",
"QATAR AIRWAYS":"QTR",

"SAUDI":"SVA",
"SAUDI ARABIAN":"SVA",

/* Ásia */

"KOREAN AIR":"KAL",

"AIR CHINA":"CCA",

/* África */

"ETHIOPIAN":"ETH",
"ETHIOPIAN AIRLINES":"ETH",

"SOUTH AFRICAN":"SAA",

"ROYAL AIR MAROC":"RAM"

});

/* Freeze lookup */

const airlineLookup = Object.freeze(_airlineLookup);

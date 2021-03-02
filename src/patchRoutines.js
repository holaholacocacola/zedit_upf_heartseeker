
// Weight clamps for weapons
MIN_SHORTBOW_WEIGHT = 2;
MAX_SHORTBOW_WEIGHT = 5;
MIN_LIGHT_XBOW_WEIGHT = 3;
MAX_LIGHT_XBOW_WEIGHT = 6;

MIN_LONGBOW_WEIGHT = 7;
MAX_LONGBOW_WEIGHT = 12;
MIN_HEAVY_XBOW_WEIGHT = 17 ;
MAX_HEAVY_XBOW_WEIGHT = 20;

MIN_GREAT_BOW_WEIGHT = 24;
MAX_GREAT_BOW_WEIGHT = 30;
MIN_SIEGE_XBOW_WEIGHT = 30;
MAX_SIEGE_XBOW_WEIGHT = 45;

// Projectile detection level
SOUND_SILENT = 2;
SOUND_NORMAL = 1;
SOUND_LOUD = 0;
SOUND_VERY_LOUD = 3;

// Impact force for ammunition
IMPACT_SHORT = 1;
IMPACT_LIGHT = 1.5;
IMPACT_LONG = 2;
IMPACT_HEAVY = 2.5;
IMPACT_GREAT = 3;
IMPACT_SIEGE = 3.5;


/**
* Update weapon or ammo keywords. These values come from an entry in templates/weapons or templates/weaponOverrides
* 
* @param {xelib.Record} record   - The record that will be updated
* @param {Array}        keywords - Keywords to add to the weapon record. Usually comes in pairs of 2.  
*/
function updateKeywords(record, keywords) {
	
	keywords.forEach(keyword => { 
		xelib.AddKeyword(record, keyword);
	});
}


/**
* Update records name according to item type and tier.
* I.e if the record is imperial bow, itemType will be 'bow', prefix may be 'long'
*
* @param {xelib.Record} record     - The record that will be updated
* @param {string}       itemType   - The type of item we're updating. One of  [Bow, Crossbow, Arrow, Bolt]
* @param {string}       itemPrefix - The string to prepend to the items name. One of [Short, Long, Great, Light, Heavy, Siege]
* @param {Number}       tier       - The tier number to add to name 
*/
function updateItemName(record, itemType, itemPrefix, tier) {
	
	let recordName = xelib.FullName(record);
	let tierString = " [Tier " + tier + "]";
	let replacement = itemType;
	
	if (itemType == "Bow") {
		replacement = "bow";
	}
	
	if (recordName.includes(itemType)) {
		
		if (recordName.includes(itemPrefix)) {
				recordName = recordName + tierString;
		}
		else {		
			recordName = recordName.replace(itemType, itemPrefix  + replacement) + tierString;
		}
	}
	else {
		recordName = recordName + " [" + itemPrefix + replacement  + " Tier" + tier + "]";
	}
	try {
		xelib.SetValue(record, "FULL", recordName);
	} catch (err) {
	}
}

/**
* Update weapon values. These values come from an entry in templates/weapons or templates/weaponOverrides
* 
* @param {xelib.Record} record    - The record that will be updated
* @param {Object}       overrides - Dictionary containing values to update in the record
* @param {Array}        keywords  - Keywords to add to the weapon record. Always comes in pairs of 2.  
*/
function updateWeaponValues(record, overrides, keywords) {
	
	updateKeywords(record, keywords);
	xelib.SetFloatValue(record, 'DNAM\\Speed', overrides["speed"]);
	xelib.SetFloatValue(record, 'DNAM\\Stagger', overrides["stagger"]);
	xelib.SetFloatValue(record, 'DNAM\\Range Min', overrides["range_min"]);
	xelib.SetFloatValue(record, 'DNAM\\Range Max', overrides["range_max"]);
	xelib.SetUIntValue(record, 'VNAM', overrides["sound"]);
}

/**
* Update damage values.
* 
* @param {xelib.Record} record           - The record that will be updated
* @param {number}       damageMultiplier - Damage is multiplied by this factor
*/
function updateDamageValues(record, damageMultiplier) {
	
	let damage = xelib.GetIntValue(record, 'DATA\\Damage');
	xelib.SetUIntValue(record, 'DATA\\Damage', Math.round(damageMultiplier * damage));
}

/**
* Update soundDescriptors if weapon does not inherit from template
* 
* @param {xelib.Record} record          - The record that will be updated
* @param {Object}       soundDescriptor - Sound override
*/
function updateAttackSound(record, soundDescriptor) {
	
	let hasTemplate = false;
	try {
		xelib.GetWinningOverride(xelib.GetLinksTo(record, 'CNAM'));
		hasTemplate = true;
	} 
	catch (err) {
		hasTemplate = false;
	}
	
	if (hasTemplate) {
		return;
	}
	xelib.AddElementValue(record, 'SNAM', soundDescriptor);
	xelib.AddElementValue(record, 'XNAM', soundDescriptor);
}

/**
* Update item weight.
* 
* @param {xelib.Record} record    - The record that will be updated
* @param {number}       weight    - Weight to set to
* @param {number}       minWeight - Min weight allowed
* @param {number}       maxWeight - Max weight allowed
*/
function updateItemWeight(record, weight, minWeight, maxWeight) {
	
	if (weight < minWeight) {
		weight = minWeight;
	}
	if(weight > maxWeight) {
		weight = maxWeight;
	}
	xelib.SetFloatValue(record, 'DATA\\Weight', Math.round(weight));
}

/**
* Update item value.
* I dont think this is used
* 
* @param {xelib.Record} record          - The record that will be updated
* @param {number}       valueMultiplier - Weight is multiplied by this factor
*/
function updateItemValue(record, valueMultiplier) {
	
	let value = xelib.GetIntValue(record, 'DATA\\Value');
	xelib.SetIntValue(record, 'DATA\\Weight', Math.round(valueMultiplier * value));
}

/**
* Update projectile values. These values come from an entry in templates/projectiles
* 
* @param {xelib.Record} record     - The record that will be updated
* @param {Object}       overrides  - Dictionary containing values to update in the record
* @param {int}          force      - Havok projectile force
* @param {int}          soundLevel - Detection level
*/
function updateProjectileValues(record, overrides, force, soundLevel) {
	
	xelib.SetFloatValue(record, 'DATA\\Speed', overrides["speed"]);
	xelib.SetFloatValue(record, 'DATA\\Impact Force', force);
	let flags = xelib.GetEnabledFlags(record, 'DATA - Data\\Flags');
	if (flags.includes("Explosion")) {
		soundLevel = SOUND_VERY_LOUD;
	}
	xelib.SetUIntValue(record, 'VNAM', soundLevel);
	//xelib.SetFloatValue(record, 'DATA\\Gravity', overrides["gravity"]); implemment later
}

/*----------------------------------------------weapon funcs------------------------------------------*/

/**
* Apply changes to a weapon record to make it a siege crossbow.
*
* @param {xelib.Record} record           - The record that will be updated
* @param {string}       itemType         - Keywords to add to the weapon record
* @param {string}       itemPrefix       - Keywords to add to the weapon record
* @param {Object}       overrides        - Dictionary containing values to update in the record
* @param {string}       keywordsToAdd    - Keywords to add to the weapon record
* @param {number}       damageMultiplier - Damage is multiplied by this factor
* @param {Object}       soundDescriptor  - Attack sound ref
*/
function makeWeapon(record, itemType, itemPrefix, overrides, keywordsToAdd, damageMultiplier, soundDescriptor) {

	updateItemName(record, itemType, itemPrefix, overrides["tier"]);
	updateWeaponValues(record, overrides, keywordsToAdd);
	let damage = xelib.GetIntValue(record, 'DATA\\Damage');
	xelib.SetUIntValue(record, 'DATA\\Damage', Math.round(damageMultiplier * damage));
	updateAttackSound(record, soundDescriptor);
	
	let minWeight = 5
	let maxWeight = 5
	if (itemPrefix.includes("Short")) {
		minWeight = MIN_SHORTBOW_WEIGHT;
		maxWeight = MAX_SHORTBOW_WEIGHT;
	}
	else if(itemPrefix.includes("Long")) {
		minWeight = MIN_LONGBOW_WEIGHT;
		maxWeight = MAX_LONGBOW_WEIGHT;
	}
	else if(itemPrefix.includes("Great")) {
		minWeight = MIN_GREAT_BOW_WEIGHT;
		maxWeight = MAX_GREAT_BOW_WEIGHT;
	}
	else if(itemPrefix.includes("Light")) {
		minWeight = MIN_LIGHT_XBOW_WEIGHT;
		maxWeight = MAX_LIGHT_XBOW_WEIGHT;
	}
	else if(itemPrefix.includes("Heavy")) {
		minWeight = MIN_HEAVY_XBOW_WEIGHT;
		maxWeight = MAX_HEAVY_XBOW_WEIGHT;
	}
	else if(itemPrefix.includes("Siege")) {
		minWeight = MIN_SIEGE_XBOW_WEIGHT;
		maxWeight = MAX_SIEGE_XBOW_WEIGHT;
	}
	
	updateItemWeight(record, damageMultiplier * damage, minWeight, maxWeight);
}


/**
* Apply changes to a weapon record to make it a short bow.
*
* @param {xelib.Record} record               - The record that will be updated
* @param {Object}       overrides            - Dictionary containing values to update in the record
* @param {number}       damageMultiplier     - Damage is multiplied by this factor
* @param {string}       critDamageMultiplier - Crit damage is multiplied by this factor
* @param {Array}        keywords             - Keywords to add to the weapon record. Always comes in pairs of 2.  
* @param {Object}       soundDescriptor      - Attack sound ref
*/
function makeShortBow(record, overrides, damageMultiplier, critDamageMultiplier, keywords, soundDescriptor) {
	
	makeWeapon(record, "Bow", "Short", overrides, keywords, damageMultiplier, soundDescriptor);
	/*updateItemName(record, "Bow", "Short", overrides["tier"]);
	updateWeaponValues(record, overrides, keywords);
	let critDamage = xelib.GetUIntValue(record, 'CRDT\\Damage');
	xelib.SetUIntValue(record, 'CRDT\\Damage', Math.round(critDamageMultiplier * critDamage));
	let damage = xelib.GetIntValue(record, 'DATA\\Damage');
	xelib.SetUIntValue(record, 'DATA\\Damage', Math.round(damageMultiplier * damage));
	updateItemWeight(record, damageMultiplier * damage, MIN_SHORTBOW_WEIGHT, MAX_SHORTBOW_WEIGHT);
	updateAttackSound(record, soundDescriptor);*/
	let critDamage = xelib.GetUIntValue(record, 'CRDT\\Damage');
	xelib.SetUIntValue(record, 'CRDT\\Damage', Math.round(critDamageMultiplier * critDamage));
}

/**
* Apply changes to a weapon record to make it a long bow.
*
* @param {xelib.Record} record           - The record that will be updated
* @param {Object}       overrides        - Dictionary containing values to update in the record
* @param {number}       damageMultiplier - Damage is multiplied by this factor
* @param {Array}        keywords         - Keywords to add to the weapon record. Always comes in pairs of 2.  
* @param {Object}       soundDescriptor  - Attack sound ref
*/
function makeLongBow(record, overrides, damageMultiplier, keywords, soundDescriptor) {
	
	makeWeapon(record, "Bow", "Long", overrides, keywords, damageMultiplier, soundDescriptor);
	/*updateItemName(record, "Bow", "Long", overrides["tier"]);
	updateWeaponValues(record, overrides, keywords);
	let damage = xelib.GetIntValue(record, 'DATA\\Damage');
	xelib.SetUIntValue(record, 'DATA\\Damage', Math.round(damageMultiplier * damage));
	updateItemWeight(record, damageMultiplier * damage, MIN_LONGBOW_WEIGHT, MAX_LONGBOW_WEIGHT);
	updateAttackSound(record, soundDescriptor);*/
}

/**
* Apply changes to a weapon record to make it a great bow.
*
* @param {xelib.Record} record          - The record that will be updated
* @param {Object}       overrides       - Dictionary containing values to update in the record
* @param {number}       damageMultiplier - Damage is multiplied by this factor
* @param {Array}        keywords          -  Keywords to add to the weapon record
* @param {Object}       soundDescriptor  - Attack sound ref
*/
function makeGreatBow(record, overrides, damageMultiplier, keywords, soundDescriptor) {
	
	makeWeapon(record, "Bow", "Great", overrides, keywords, damageMultiplier, soundDescriptor);
	/*updateItemName(record, "Bow", "Great", 1);
	updateWeaponValues(record, overrides, [keyword]);
	let damage = xelib.GetIntValue(record, 'DATA\\Damage');
	xelib.SetUIntValue(record, 'DATA\\Damage', Math.round(damageMultiplier * damage));
	updateItemWeight(record, damageMultiplier * damage, MIN_GREAT_BOW_WEIGHT, MAX_GREAT_BOW_WEIGHT);
	updateAttackSound(record, soundDescriptor);*/
}

/**
* Apply changes to a weapon record to make it a light cross bow.
*
* @param {xelib.Record} record               - The record that will be updated
* @param {Object}       overrides            - Dictionary containing values to update in the record
* @param {number}       damageMultiplier     - Damage is multiplied by this factor
* @param {Array}        keywords             - Keywords to add to the weapon record. Always comes in pairs of 2.  
* @param {Object}       soundDescriptor      - Attack sound ref
*/
function makeLightCrossBow(record, overrides, damageMultiplier, keywords, soundDescriptor) {
	
	makeWeapon(record, "Crossbow", "Light ", overrides, keywords, damageMultiplier, soundDescriptor);
	/*updateItemName(record, "Crossbow", "Light ", overrides["tier"]);
	updateWeaponValues(record, overrides, keywords);
	updateItemWeight(record, damageMultiplier);
	let damage = xelib.GetIntValue(record, 'DATA\\Damage');
	xelib.SetUIntValue(record, 'DATA\\Damage', Math.round(damageMultiplier * damage));
	updateItemWeight(record, damageMultiplier * damage, MIN_LIGHT_XBOW_WEIGHT, MAX_LIGHT_XBOW_WEIGHT);
	updateAttackSound(record, soundDescriptor);*/
}

/**
* Apply changes to a weapon record to make it a heavy cross bow.
*
* @param {xelib.Record} record               - The record that will be updated
* @param {Object}       overrides            - Dictionary containing values to update in the record
* @param {number}       damageMultiplier     - Damage is multiplied by this factor
* @param {Array}        keywords             - Keywords to add to the weapon record. Always comes in pairs of 2.  
* @param {Object}       soundDescriptor      - Attack sound ref
*/
function makeHeavyCrossBow(record, overrides, damageMultiplier, keywords, soundDescriptor) {

	makeWeapon(record, "Crossbow", "Heavy ", overrides, keywords, damageMultiplier, soundDescriptor);
	/*updateItemName(record, "Crossbow", "Heavy ", overrides["tier"]);
	updateWeaponValues(record, overrides, keywords);
	//updateItemWeight(record, damageMultiplier);
	let damage = xelib.GetIntValue(record, 'DATA\\Damage');
	xelib.SetUIntValue(record, 'DATA\\Damage', Math.round(damageMultiplier * damage));
	updateItemWeight(record, damageMultiplier * damage, MIN_HEAVY_XBOW_WEIGHT, MAX_HEAVY_XBOW_WEIGHT);
	updateAttackSound(record, soundDescriptor);*/
}


/**
* Apply changes to a weapon record to make it a siege crossbow.
*
* @param {xelib.Record} record               - The record that will be updated
* @param {Object}       overrides            - Dictionary containing values to update in the record
* @param {number}       damageMultiplier     - Damage is multiplied by this factor
* @param {string}       keywords             -  Keywords to add to the weapon record
* @param {Object}       soundDescriptor      - Attack sound ref
*/
function makeSiegeCrossBow(record, overrides, damageMultiplier, keywords, soundDescriptor) {
	
	makeWeapon(record, "Crossbow", "Siege ", overrides, keywords, damageMultiplier, soundDescriptor);
	/*updateItemName(record, "Crossbow", "Siege ", 1);
	updateWeaponValues(record, overrides, keywords);
	let damage = xelib.GetIntValue(record, 'DATA\\Damage');
	xelib.SetUIntValue(record, 'DATA\\Damage', Math.round(damageMultiplier * damage));
	updateItemWeight(record, damageMultiplier * damage, MIN_SIEGE_XBOW_WEIGHT, MAX_SIEGE_XBOW_WEIGHT);
	updateAttackSound(record, soundDescriptor);*/
}



/*-----------------------------------------------------ammunition funcs---------------------------------------------------*/

/**
* Apply changes to a weapon record to make it a siege crossbow.
*
* @param {xelib.Record} record              - The record that will be updated
* @param {Array}        keywordsToAdd       - Keywords to add to the ammo record
* @param {number}       tier                - Ammo tier rank
* @param {number}       damageMultiplier    - Damage is multiplied by this factor
* @param {string}       itemType            - Type of ammo. Bolt|Arrow
* @param {string}       itemPrefix          - String to add to item name
* @param {Object}       projectileOverrides - Dictionary containing values to update in the record
*/
function makeAmmunition(record, keyswordsToAdd, tier, damageMultiplier, itemType, itemPrefix, projectileOverrides, patchFile) {

	updateItemName(record, itemType, itemPrefix, tier)
	updateKeywords(record, keyswordsToAdd);
	updateDamageValues(record, damageMultiplier);
	if (typeof makeAmmunition.processed === 'undefined') {
		makeAmmunition.processed = new Set();
	}

	let pJ = null;
	try {
		pJ = xelib.GetWinningOverride(xelib.GetLinksTo(record, 'DATA\\Projectile'));
	} catch (err) {
		return;
	}
	
	if (xelib.GetValue(pJ, 'DATA\\Type') != "Arrow") {
		return;
	}
	
	var projectileRecord = pJ; //xelib.GetWinningOverride(xelib.GetLinksTo(record, 'DATA\\Projectile'));
	formId = xelib.GetFormID(projectileRecord);
	if (makeAmmunition.processed.has(formId)) {
		return;
	}
	makeAmmunition.processed.add(formId);
	projRecord = xelib.CopyElement(projectileRecord, patchFile)
	if (itemPrefix.includes("Short")) {
		makeShortProjectile(projRecord, projectileOverrides, tier);
	}
	else if(itemPrefix.includes("Long")) {
		makeLongProjectile(projRecord, projectileOverrides, tier);
	}
	else if(itemPrefix.includes("Great")) {
		makeGreatProjectile(projRecord, projectileOverrides, tier);
	}
	else if(itemPrefix.includes("Light")) {
		makeLightProjectile(projRecord, projectileOverrides, tier);
	}
	else if(itemPrefix.includes("Heavy")) {
		makeHeavyProjectile(projRecord, projectileOverrides, tier);
	}
	else if(itemPrefix.includes("Siege")) {
		makeSiegeProjectile(projRecord, projectileOverrides, tier);
	}	
}

/**
* Apply changes to an ammo record to make it a short arrow
*
* @param {xelib.Record} record               - The record that will be updated
* @param {Array}        keywords             - Keywords to add to the ammo record. Always comes in pairs of 2.  
* @param {Number}       tier                 - The tier number to add to name 
* @param {number}       damageMultiplier     - Damage is multiplied by this factor
* @param {Object}       projectileOverrides  - Dictionary containing values to update in the record
*/
function makeShortArrow(record, keywords, tier, damageMultiplier, projectileOverrides, patchFile) {
	makeAmmunition(record, keywords, tier, damageMultiplier, "Arrow", "Short ", projectileOverrides, patchFile);
}

/**
* Apply changes to an ammo record to make it a long arrow
*
* @param {xelib.Record} record               - The record that will be updated
* @param {Array}        keywords             - Keywords to add to the ammo record. Always comes in pairs of 2.  
* @param {Number}       tier                 - The tier number to add to name 
* @param {number}       damageMultiplier     - Damage is multiplied by this factor
* @param {Object}       projectileOverrides  - Dictionary containing values to update in the record
*/
function makeLongArrow(record, keywords, tier, damageMultiplier, projectileOverrides, patchFile) {
	makeAmmunition(record, keywords, tier, damageMultiplier, "Arrow", "Long ", projectileOverrides, patchFile);
}

/**
* Apply changes to an ammo record to make it a great arrow
*
* @param {xelib.Record} record               - The record that will be updated
* @param {Array}        keywords             - Keywords to add to the ammo record.
* @param {Number}       tier                 - The tier number to add to name 
* @param {number}       damageMultiplier     - Damage is multiplied by this factor
* @param {Object}       projectileOverrides  - Dictionary containing values to update in the record
*/
function makeGreatArrow(record, keywords, tier, damageMultiplier, projectileOverrides, patchFile) {
	makeAmmunition(record, keywords, tier, damageMultiplier, "Arrow", "Great ", projectileOverrides, patchFile);
}

/**
* Apply changes to an ammo record to make it a light bolt
*
* @param {xelib.Record} record               - The record that will be updated
* @param {Array}        keywords             - Keywords to add to the ammo record. Always comes in pairs of 2.  
* @param {Number}       tier                 - The tier number to add to name 
* @param {number}       damageMultiplier     - Damage is multiplied by this factor
* @param {Object}       projectileOverrides  - Dictionary containing values to update in the record
*/
function makeLightBolt(record, keywords, tier, damageMultiplier, projectileOverrides, patchFile) {
	makeAmmunition(record, keywords, tier, damageMultiplier, "Bolt", "Light ", projectileOverrides, patchFile);
}

/**
* Apply changes to an ammo record to make it a heavy bolt
*
* @param {xelib.Record} record               - The record that will be updated
* @param {Array}        keywords             - Keywords to add to the ammo record. Always comes in pairs of 2.
* @param {Number}       tier                 - The tier number to add to name   
* @param {number}       damageMultiplier     - Damage is multiplied by this factor
* @param {Object}       projectileOverrides  - Dictionary containing values to update in the record
*/
function makeHeavyBolt(record, keywords, tier, damageMultiplier, projectileOverrides, patchFile) {
	makeAmmunition(record, keywords, tier, damageMultiplier, "Bolt", "Heavy ", projectileOverrides, patchFile);
}

/**
* Apply changes to an ammo record to make it a siege bolt
*
* @param {xelib.Record} record               - The record that will be updated
* @param {Array}        keywords            - Keywords to add to the ammo record.
* @param {Number}       tier                 - The tier number to add to name 
* @param {number}       damageMultiplier     - Damage is multiplied by this factor
* @param {Object}       projectileOverrides  - Dictionary containing values to update in the record
*/
function makeSiegeBolt(record, keywords, tier, damageMultiplier, projectileOverrides, patchFile) {
	makeAmmunition(record, keywords, tier, damageMultiplier, "Bolt", "Siege ", projectileOverrides, patchFile);
}

/**
* Apply changes to a projectile record to make it a short arrow
*
* @param {xelib.Record} record    - The record that will be updated
* @param {Object}       overrides - Dictionary containing values to update in the record
* @param {Number}       tier      - The tier number to add to name   
*/
function makeShortProjectile(record, overrides, tier) {
	updateItemName(record, "Arrow", "Short ", tier)
	updateProjectileValues(record, overrides, IMPACT_SHORT, SOUND_SILENT);
}

/**
* Apply changes to a projectile record to make it a long arrow
*
* @param {xelib.Record} record    - The record that will be updated
* @param {Object}       overrides - Dictionary containing values to update in the record
* @param {Number}       tier      - The tier number to add to name   
*/
function makeLongProjectile(record, overrides, tier) {
	updateItemName(record, "Arrow", "Long ", tier)
	updateProjectileValues(record, overrides, IMPACT_LONG, SOUND_LOUD);
}

/**
* Apply changes to a projectile record to make it a great arrow
*
* @param {xelib.Record} record    - The record that will be updated
* @param {Object}       overrides - Dictionary containing values to update in the record
* @param {Number}       tier      - The tier number to add to name   
*/
function makeGreatProjectile(record, overrides, tier) {
	updateItemName(record, "Arrow", "Great ", tier)
	updateProjectileValues(record, overrides, IMPACT_GREAT, SOUND_VERY_LOUD);
}

/**
* Apply changes to a projectile record to make it a light bolt
*
* @param {xelib.Record} record    - The record that will be updated
* @param {Object}       overrides - Dictionary containing values to update in the record
* @param {Number}       tier      - The tier number to add to name   
*/
function makeLightProjectile(record, overrides, tier) {
	updateItemName(record, "Bolt", "Light ", tier)
	updateProjectileValues(record, overrides, IMPACT_LIGHT, SOUND_NORMAL);
}

/**
* Apply changes to a projectile record to make it a heavy bolt
*
* @param {xelib.Record} record    - The record that will be updated
* @param {Object}       overrides - Dictionary containing values to update in the record
* @param {Number}       tier      - The tier number to add to name   
*/
function makeHeavyProjectile(record,  overrides, tier) {
	updateItemName(record, "Bolt", "Heavy ", tier)
	updateProjectileValues(record, overrides, IMPACT_HEAVY, SOUND_VERY_LOUD);
}


/**
* Apply changes to a projectile record to make it a siege bolt
*
* @param {xelib.Record} record    - The record that will be updated
* @param {Object}       overrides - Dictionary containing values to update in the record
* @param {Number}       tier      - The tier number to add to name   
*/
function makeSiegeProjectile(record, overrides, tier) {
	updateItemName(record, "Bolt", "Siege ", tier)
	updateProjectileValues(record, overrides, IMPACT_SIEGE, SOUND_VERY_LOUD);
}

module.exports.makeSiegeCrossBow = makeSiegeCrossBow;
module.exports.makeHeavyCrossBow = makeHeavyCrossBow;
module.exports.makeLightCrossBow = makeLightCrossBow;

module.exports.makeShortBow = makeShortBow;
module.exports.makeLongBow = makeLongBow;
module.exports.makeGreatBow = makeGreatBow;

module.exports.makeHeavyBolt = makeHeavyBolt;
module.exports.makeLightBolt = makeLightBolt;
module.exports.makeShortArrow = makeShortArrow;
module.exports.makeLongArrow = makeLongArrow;
module.exports.makeGreatArrow = makeGreatArrow;
module.exports.makeSiegeBolt = makeSiegeBolt;

//module.exports.makeHeavyProjectile = makeHeavyProjectile;
//module.exports.makeLightProjectile = makeLightProjectile;
//module.exports.makeShortProjectile = makeShortProjectile;
//module.exports.makeLongProjectile = makeLongProjectile;
//module.exports.makeGreatProjectile = makeGreatProjectile;
//module.exports.makeSiegeProjectile = makeSiegeProjectile;

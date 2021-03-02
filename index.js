/* global ngapp, xelib, registerPatcher, patcherUrl */
// patcher for HeartSeeker

let helperRoutines = require(patcherPath + '\\src\\patchRoutines.js');

registerPatcher({
    info: info,
    gameModes: [xelib.gmSSE, xelib.gmTES5],
    settings: {
        label: "HeartSeeker Patcher",
        hide: false,
		templateUrl: `${patcherUrl}/partials/settings.html`,
		controller: function($scope) {
            let patcherSettings = $scope.settings.HeartSeekerPatcher;
        },
        defaultSettings: {
            patchFileName: 'heart_seeker_patch.esp',
			shortBowCritDamageMultiplier: 3,
			shortBowDamageMultiplier: .5,
			longBowDamageMultiplier: 1,
			lightCrossBowDamageMultiplier: .75,
			heavyCrossBowDamageMultiplier: 1.5,
			greatBowDamageMultiplier: 1.5,
			siegeCrossBowDamageMultiplier: 2.5,
			distributeStamina: "true"
        }
    },
    requiredFiles: ["HeartSeeker.esp"],
    getFilesToPatch: function(filenames) {
		return filenames.filter(function (value, index, arr) {
            return (value != `HeartSeeker.esp`);
        });
    },
    execute: (patchFile, helpers, settings, locals) => ({
        initialize: function() {
            // initialize:
            


			helpers.logMessage('Mod: HeartSeeker');
			helpers.logMessage('Version: 0.0.1');
			helpers.logMessage('Author: iggyluer');
			
			// Load the weapon templates. Stats for weapons and ammo are distributed based on material type keywords by default.
			let weaponTemplates = require(patcherPath + '\\templates\\weapons.json');
			locals.shortBows = weaponTemplates["short"];
			locals.longBows = weaponTemplates["long"];
			locals.lightCrossBows = weaponTemplates["light"];
			locals.heavyCrossBows = weaponTemplates["heavy"];
			locals.patchFileRef = patchFile
			
			// Load the user provided overrides for weapons and ammo. Weapon stats can be customized in the weapon section and ammo tier can be assigned in the ammo section.
			let itemOverrides = require(patcherPath + '\\templates\\overrides.json');
			let weaponTemplateOverrides = itemOverrides["weapons"];
			
			locals.shortBowOverrides = weaponTemplateOverrides["short"];
			locals.longBowOverrides = weaponTemplateOverrides["long"];
			locals.greatBowOverrides = weaponTemplateOverrides["great"];
			
			locals.lightCrossBowOverrides = weaponTemplateOverrides["light"];
			locals.heavyCrossBowOverrides = weaponTemplateOverrides["heavy"];
			locals.siegeCrossBowOverrides = weaponTemplateOverrides["siege"];
			
			// Ignore ammo or weapon editor ids in this object
			locals.ignore = itemOverrides["ignore"];// weaponTemplateOverrides["ignore"];
			
			// Load the user provided ammo tiers
			let ammoTemplateOverrides = itemOverrides["ammo"];
			locals.shortArrowOverrides = ammoTemplateOverrides["short"];
			locals.longArrowOverrides = ammoTemplateOverrides["long"];
			locals.greatArrowOverrides = ammoTemplateOverrides["great"];
			
			locals.lightBoltOverrides = ammoTemplateOverrides["light"];
			locals.heavyBoltOverrides = ammoTemplateOverrides["heavy"];
			locals.siegeBoltOverrides = ammoTemplateOverrides["siege"];

			
			// Load projectile data. 
			let projectileTemplates = require(patcherPath + '\\templates\\projectiles.json');
			locals.shortProjectileProperties = projectileTemplates["short"];
			locals.longProjectileProperties = projectileTemplates["long"];
			locals.greatProjectileProperties = projectileTemplates["great"];
			
			locals.lightProjectileProperties = projectileTemplates["light"];
			locals.heavyProjectileProperties = projectileTemplates["heavy"];
			locals.siegeProjectileProperties = projectileTemplates["siege"];
			
			
			// Load the races that will have the ranged weapon perks added to them. This is based on if the bow or crossbow equipment flag is set 
			//locals.races = require(patcherPath + '\\templates\\races.json');
			
			// load the keywords we need to apply to ammunition and weapons. Perks won't work without these
			let heartSeeker = xelib.FileByName("HeartSeeker.esp");

			locals.shortBowKey = xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_ShortBow'));
			locals.longBowKey = xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_LongBow'));
			locals.greatBowKey = xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_GreatBow'));
			
			locals.lightCrossBowKey = xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_LightCrossBow'));
			locals.heavyCrossBowKey = xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_HeavyCrossBow'));		
			locals.siegeCrossBowKey = xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_SiegeCrossBow'));					
			
			locals.shortArrowKey = xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_ShortArrow'));
			locals.longArrowKey = xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_LongArrow'));
			locals.greatArrowKey = xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_GreatArrow'));
			
			locals.lightBoltKey = xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_LightBolt'));
			locals.heavyBoltKey = xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_HeavyBolt'));
			locals.siegeBoltKey = xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_SiegeBolt'));

			locals.shortBowRankKeys = [
				xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_ShortBowTier1')),
				xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_ShortBowTier2')),
				xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_ShortBowTier3')),
				xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_ShortBowTier4'))
			];
			locals.shortArrowRankKeys = [
				xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_ShortArrowTier1')),
				xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_ShortArrowTier2')),
				xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_ShortArrowTier3')),
				xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_ShortArrowTier4'))
			];
			locals.longBowRankKeys = [
				xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_LongBowTier1')),
				xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_LongBowTier2')),
				xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_LongBowTier3')),
				xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_LongBowTier4'))
			];

			locals.longArrowRankKeys = [
				xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_LongArrowTier1')),
				xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_LongArrowTier2')),
				xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_LongArrowTier3')),
				xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_LongArrowTier4'))
			];
			//--------------------------------------------crossbow ranks
			
			locals.lightCrossBowRankKeys = [
				xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_LightCrossBowTier1')),
				xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_LightCrossBowTier2')),
				xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_LightCrossBowTier3')),
				xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_LightCrossBowTier4'))
			];
			locals.lightBoltRankKeys = [
				xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_LightBoltTier1')),
				xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_LightBoltTier2')),
				xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_LightBoltTier3')),
				xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_LightBoltTier4'))
			];
			locals.heavyCrossbowRankKeys = [
				xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_HeavyCrossBowTier1')),
				xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_HeavyCrossBowTier2')),
				xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_HeavyCrossBowTier3')),
				xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_HeavyCrossBowTier4'))
			];

			locals.heavyBoltRankKeys = [
				xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_HeavyBoltTier1')),
				xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_HeavyBoltTier2')),
				xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_HeavyBoltTier3')),
				xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_HeavyBoltTier4'))
			];
			
			
			// load the sound descriptors to override

			locals.shortSoundDescriptor = xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_WPNShortBowFireSD'));
			locals.longSoundDescriptor = xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_WPNLongBowFireSD'));
			locals.greatSoundDescriptor = xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_WPNGreatBowFireSD'));
			
			locals.lightSoundDescriptor = xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_WPNLightXBowFireSD'));
			locals.heavySoundDescriptor = xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_WPNHeavyXBowFireSD'));
			locals.siegeSoundDescriptor = xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_WPNSiegeXBowFireSD'));
			
			// -----------------------------perks to apply to applicable npcs
			

			
			locals.heartSeekerBowPerks = [
				xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_ShortBowAmmoMismatchPerk')),
				xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_ShortBowPropertiesPerk')),
				xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_ShortBowMatchingAmmunitionPerk')),
				xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_ShortBowCritDamagePerk')),
				xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_LongBowAmmoMismatchPerk')),
				xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_LongBowPropertiesPerk')),
				xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_LongBowMatchingAmmunitionPerk')),
				xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_LongBowFocusShotPerk')),
				xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_LongBowCritDamagePerk')),
				xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_GreatBowAmmoMismatchPerk')),
				xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_GreatBowMoveSpeedDebuffPerk')),
				xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_GreatBowCritDamagePerk')),
				xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_GreatBowMatchingAmmunitionPerk')),
				xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_PenetratingShotPerk')),
				xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_DevastatingShotPerk')),
				xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_RangerPerk')),
				xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_QuickShotPerk'))
			];
			
			if (settings.distributeStamina == "true") {
				locals.heartSeekerBowPerks.push(xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_BowDrainPerk')));
			}
			
			locals.heartSeekerXBowPerks = [
				xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_LightCrossBowBashDamagePerk')),
				xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_LightCrossBowPropertiesPerk')),
				xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_LightCrossBowMatchingAmmunitionPerk')),
				xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_LightCrossBowAmmoMismatchPerk')), //]; 
				xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_HeavyCrossBowAmmoMismatchPerk')),
				xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_HeavyCrossBowMoveSpeedDebuffPerk')),
				xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_HeavyCrossBowBashDamagePerk')),
				xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_HeavyCrossBowPropertiesPerk')),
				xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_HeavyCrossBowMatchingAmmunitionPerk')),
				xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_SiegeCrossBowAmmoMismatchPerk')),
				xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_SiegeCrossBowMoveSpeedDebuffPerk')),
				xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_SiegeCrossBowBashDamagePerk')),
				xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_SiegeCrossBowMatchingAmmunitionPerk')),
				xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_HeavyWeaponsExposedPerk'))
			]; 
			
			if (settings.distributeStamina == "true") {
				locals.heartSeekerXBowPerks.push(xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_XBowDrainPerk')));
			}
			
			locals.heartSeekerPlayerOnlyPerks = [
				xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_SmallWeaponsEnchantingMagnitudeNerfPerk')),
				xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_LargeWeaponsEnchantingMagnitudeNerfPerk')), //This is actually a buff but misnamed =[
				xelib.GetHexFormID(xelib.GetElement(heartSeeker, 'HS_RangedWeaponsZoomPerk'))
				//
			];
			
			/* These are used to null perk effects for compatibility*/
			locals.blankAbility = xelib.GetElement(heartSeeker, 'HS_BlankAbility');
			locals.blankPerk = xelib.GetElement(heartSeeker, 'HS_BlankPerk');
			/*Admant, Ordinator, and Vokrii perks to null out.*/
			locals.vanillaPerksToPatch = ["EagleEye30", "Ranger", "QuickShot"];
			locals.ordinatorPerksToPatch = ["ORD_Arc30_SteadyHand_Perk_30_WasEagleEye_OrdASISExclude", "ORD_Arc50_Ranger_Perk_50_WasRanger", "ORD_Arc60_QuickShot_Perk_60_WasQuickShot"];
			locals.vokriiPerksToPatch = ["VKR_Arc_060_Ranger_Perk_WasRanger", "VKR_Arc_030_EagleEye_Perk_WasEagleEye", "VKR_Arc_070_QuickShot_Perk_WasQuickShot"];
			locals.adamantPerksToPatch = ["MAG_EagleEye", "MAG_Ranger", "MAG_QuickShot"];
			
			/* Check which perk mod user is running and blank out the perks HeartSeeker overrides*/
			if (xelib.FileByName('Ordinator - Perks Of Skyrim.esp') != 0) {
                helpers.logMessage('Ordinators Steady Hand and Ranger perk will be patched .!.  ^_^ .!. ');
                locals.perksToPatch = locals.ordinatorPerksToPatch;
            }
			else if (xelib.FileByName('Vokrii - Minimalistic Perks of Skyrim.esp') != 0) {
                helpers.logMessage('Vokriis Steady Hand and Ranger perk will be patched .!.  ^_^ .!. ');
                locals.perksToPatch = locals.vokriiPerksToPatch;
            }
			else if (xelib.FileByName('Adamant.esp') != 0) {
                helpers.logMessage('Adamants Steady Hand and Ranger perk will be patched .!.  ^_^ .!. ');
                locals.perksToPatch = locals.adamantPerksToPatch;
            }
			else {
				helpers.logMessage('Steady Hand and Ranger perk will be patched .!.  ^_^ .!. ');
                locals.perksToPatch = locals.vanillaPerksToPatch;
			}
			

			locals.bannedNpcs = ["corpse", "test", "dwarven"]; // Don't add perks to npcs with this string in their name
			locals.npcCache = {}; // stores npc equip types during npc filtering to bypass double lookup
			
			
        },
        process: [
			{ // set some flags =]
					load: { //Game Settings
						signature: 'GMST',
						filter: rec => true
					},
					patch: rec => {
						let recordID = xelib.GetValue(rec, 'EDID');
						if (recordID == "iMaxAttachedArrows") {
							xelib.SetIntValue(rec, 'DATA\\Int', '100');
						}
						
						if (recordID == "fAttachedArrowAgeMax") {
							xelib.SetFloatValue(rec, 'DATA\\Float', '60.000000');
						}
						if (recordID == "iArrowInventoryChance") {
							xelib.SetIntValue(rec, 'DATA\\Int', '0');
						}
					}
		}
		
		
		,{
			/*
			Patch 1: we already give armor pen based on crossbow tiers so reduce enhanced crossbow armor pen to flat 10%
					Since we're looking at perks, lets also blank out ranger, quickshot, and eagle eye based on the perk mod in the load order
			*/
			load: {
				
				signature: 'PERK',
				filter: function(record) {
					
					let recordId = xelib.GetValue(record, 'EDID');
					if (recordId ==  'DLC1EnchancedCrossbowArmorPiercingPerk') {
						return true;
					}
					return locals.perksToPatch.includes(recordId);
				}
			},
			patch: function (record){
				
				let recordId = xelib.GetValue(record, 'EDID');
				if (recordId == 'DLC1EnchancedCrossbowArmorPiercingPerk') { 
					helpers.logMessage("Patching enhanced crossbow perk. Enhanced crossbows will add a flat 10% armor penetration");
					let bsResistEffects = xelib.GetElements(record, 'Effects');
					xelib.SetFloatValue(bsResistEffects[0], 'Function Parameters\\EPFD - Data\\Float', '0.9000');
					helpers.logMessage(recordId + ": Removing magnitude");
					return;
				}
				
				// technically we don't need this check
				let blankPerkEffects = xelib.GetElements(locals.blankPerk, 'Effects');
				if (locals.perksToPatch.includes(recordId)) {
					let effects = xelib.GetElements(record, 'Effects');
						for (var i = 0; i < effects.length; i++) {
							xelib.SetElement(effects[i], blankPerkEffects[0]);	
						}
				}
			}
		},
		
		{
			/*Patch2 Remove the BS 50% crossbow stagger that only works for the player. It's added to the player on dlc init*/
			load: {
				signature: 'SPEL',
				filter: function(record) {
					let recordId = xelib.GetValue(record, 'EDID');
					return (recordId == 'DLC1abCrossbowStagger');
				}
			},
			patch: function (record){
				let recordId = xelib.GetValue(record, 'EDID');
				let bsCrossbowEffects = xelib.GetElements(record, 'Effects');
				let blankEffects = xelib.GetElements(locals.blankAbility, 'Effects');
				xelib.SetElement(bsCrossbowEffects[0], blankEffects[0]);
                helpers.logMessage(recordId + ": Removing magnitude");
			}
		},
		
		{
			/* Patch 3 Change bow and crossbows to short/light/long/heavy/siege/great depending on either material type or override entries */
			// load all bow type records and add keywords/change weapon attributes based on template files
            load: {
                signature: 'WEAP',
                filter: function(record) {
                    if (xelib.HasKeyword(record, 'WeapTypeBow')) {
                        
						if (xelib.GetValue(record, 'EDID') in locals.ignore) {
							return false;
						}
						return true;
                    }
                    return false;
                }
            },
            patch: function (record) {
	
				/*
				Grab animation type. Loop through custom settings for record id. If no match patch weapons according to material type settings in templates/weapons.json
				*/
				let animationType = xelib.GetValue(record, 'DNAM\\Animation Type');
				let recordId = xelib.GetValue(record, 'EDID');
				if (animationType == "Bow") {
					
					
				
					if (recordId in locals.shortBowOverrides) {
						helpers.logMessage("custom entry " + recordId + " will become a short bow ");
						let patchData = locals.shortBowOverrides[recordId];
						helperRoutines.makeShortBow(record, patchData, settings.shortBowDamageMultiplier, settings.shortBowCritDamageMultiplier, [locals.shortBowKey, locals.shortBowRankKeys[patchData["tier"] - 1]], locals.shortSoundDescriptor);
						return;
					}
					
					if (recordId in locals.longBowOverrides) {
						helpers.logMessage("custom entry " + recordId + " will become a long bow ");
						let patchData = locals.longBowOverrides[recordId];
						helperRoutines.makeLongBow(record, patchData, settings.longBowDamageMultiplier, [locals.longBowKey, locals.longBowRankKeys[patchData["tier"] - 1]], locals.longSoundDescriptor);
						return;
					}
					
					if (recordId in locals.greatBowOverrides) {
						helpers.logMessage("custom entry " + recordId + " will become a great bow ");
						let patchData = locals.greatBowOverrides[recordId];
						helperRoutines.makeGreatBow(record, patchData, settings.greatBowDamageMultiplier, [locals.greatBowKey], locals.greatSoundDescriptor);
						return;
					}
					
					for (var materialType in locals.shortBows) {
					
						if (xelib.HasKeyword(record, materialType)) {
							helpers.logMessage(recordId + "matched with " + materialType + ". It will become a shortbow" );	
							let patchData = locals.shortBows[materialType];
							helperRoutines.makeShortBow(record, patchData, settings.shortBowDamageMultiplier, settings.shortBowCritDamageMultiplier, [locals.shortBowKey, locals.shortBowRankKeys[patchData["tier"] - 1]], locals.shortSoundDescriptor);
							return;
						}
					}

				
					for (var materialType in locals.longBows) {
						if (xelib.HasKeyword(record, materialType)) {
							helpers.logMessage(recordId + "matched with " + materialType + ". It will become a Longbow" );
							let patchData = locals.longBows[materialType];
							helperRoutines.makeLongBow(record, patchData, settings.longBowDamageMultiplier, [locals.longBowKey, locals.longBowRankKeys[patchData["tier"] - 1]], locals.longSoundDescriptor);
							return;
						}
					}
					
				helpers.logMessage("Bow type Weapon record " + recordId + " has no matching materials or custom entries.")

				}
				else if (animationType == "Crossbow") {
					
					helpers.logMessage(recordId + " is a crossbow");
					
					if (recordId in locals.lightCrossBowOverrides) {
						helpers.logMessage("custom entry " + recordId+ " will become a light x bow ");
						let patchData = locals.lightCrossBowOverrides[recordId];
						helperRoutines.makeLightCrossBow(record, patchData, settings.lightCrossBowDamageMultiplier, [locals.lightCrossBowKey, locals.lightCrossBowRankKeys[patchData["tier"] - 1]], locals.lightSoundDescriptor);
						return;
					}
					
					if (recordId in locals.heavyCrossBowOverrides) {
						helpers.logMessage("custom entry " + recordId+ " will become a heavy x bow ");
						let patchData = locals.heavyCrossBowOverrides[recordId];
						helperRoutines.makeHeavyCrossBow(record, patchData, settings.heavyCrossBowDamageMultiplier, [locals.heavyCrossBowKey, locals.heavyCrossbowRankKeys[patchData["tier"] - 1]], locals.heavySoundDescriptor);
						return;
					}
					
					if (recordId in locals.siegeCrossBowOverrides) {
						helpers.logMessage("custom entry " + recordId + " will become a siege x bow ");
						let patchData = locals.siegeCrossBowOverrides[recordId];
						helperRoutines.makeSiegeCrossBow(record, patchData, settings.siegeCrossBowDamageMultiplier, [locals.siegeCrossBowKey], locals.siegeSoundDescriptor);
						return;
					}
					
					for (var materialType in locals.lightCrossBows) {
			
						if (xelib.HasKeyword(record, materialType)) {
							helpers.logMessage(recordId + "matched with " + materialType + ". It will become a light X bow" );	
							let patchData = locals.lightCrossBows[materialType];
							helperRoutines.makeLightCrossBow(record, patchData, settings.lightCrossBowDamageMultiplier, [locals.lightCrossBowKey, locals.lightCrossBowRankKeys[patchData["tier"] - 1]], locals.lightSoundDescriptor);
							return;
						}
					}
				
					for (var materialType in locals.heavyCrossBows) {
						if (xelib.HasKeyword(record, materialType)) {
							helpers.logMessage(recordId + "matched with " + materialType + ". It will become a heavy X bow" );
							let patchData = locals.heavyCrossBows[materialType];
							helperRoutines.makeHeavyCrossBow(record, patchData, settings.heavyCrossBowDamageMultiplier, [locals.heavyCrossBowKey, locals.heavyCrossbowRankKeys[patchData["tier"] - 1]], locals.heavySoundDescriptor);
							return;
						}
					}

					helpers.logMessage("CrossBow type Weapon record " + recordId + " has no matching materials or custom entries.");
				}
				else {
					helpers.logMessage("Skipping " + recordId + " because it has no animation type");
				}
			}
        },
		{
			/* Ammunition and projectile patcher aka copy pasta. Hopefully no one code reviews this ._. */
			
			load: {
                signature: 'AMMO',
                filter: function(record) {
					let recordId = xelib.GetValue(record, 'EDID');
					
					/*
						Add explicit checks for some arrows that dont have the vendor item keyword. 
					*/
					if (recordId in locals.shortArrowOverrides || recordId in locals.longArrowOverrides || recordId in locals.greatArrowOverrides) {
						return true;
					}
					if (recordId in locals.lightBoltOverrides || recordId in locals.heavyBoltOverrides || recordId in locals.siegeBoltOverrides) {
						return true;
					}
					
                    if (xelib.HasKeyword(record, 'VendorItemArrow')) {
						
						if (xelib.GetValue(record, 'EDID') in locals.ignore) {
							return false;
						}
						
                        return true;
                    }
                    return false;
                }
            },
            patch: function (record) {
				
				let recordId = xelib.GetValue(record, 'EDID');

				let flags = xelib.GetEnabledFlags(record, 'DATA - Data\\Flags');
				if (flags.includes("Non-Bolt")) {
					
					helpers.logMessage(recordId + " is an arrow.");
					
					/*
						check if we have an entry in overrides/ammo/short|long
					*/
					if (recordId in locals.shortArrowOverrides) {
						helpers.logMessage("custom entry " + recordId + " will become a short arrow ");
						let tier = locals.shortArrowOverrides[recordId];
						helperRoutines.makeShortArrow(record,  [locals.shortArrowKey, locals.shortArrowRankKeys[tier - 1]], tier, settings.shortBowDamageMultiplier, locals.shortProjectileProperties[tier], locals.patchFileRef);
						return;
					}
					
					if (recordId in locals.longArrowOverrides) {
						helpers.logMessage("custom entry " + recordId + " will become a long arrow ");
						let tier = locals.longArrowOverrides[recordId];
						helperRoutines.makeLongArrow(record, [locals.longArrowKey, locals.longArrowRankKeys[tier - 1]], tier, settings.longBowDamageMultiplier, locals.longProjectileProperties[tier], locals.patchFileRef);
						return;
					}
					
					if (recordId in locals.greatArrowOverrides) {
						helpers.logMessage("custom entry " + recordId + " will become a great arrow ");
						helperRoutines.makeGreatArrow(record, [locals.greatArrowKey], 1, settings.greatBowDamageMultiplier, locals.greatProjectileProperties[1], locals.patchFileRef);
						return;
					}
					
					/*
					Else
					Pull the tier data from the weapons material entry in weapons.json if available
					*/
					for (var materialType in locals.shortBows) {
						
						if (xelib.HasKeyword(record, materialType)) {
							helpers.logMessage(recordId + "matched with " + materialType + ". It will become a short arrow" );	
							let patchData = locals.shortBows[materialType];
							let tier = patchData["tier"];
							helperRoutines.makeShortArrow(record,  [locals.shortArrowKey, locals.shortArrowRankKeys[tier - 1]], tier, settings.shortBowDamageMultiplier, locals.shortProjectileProperties[tier], locals.patchFileRef);
							return;
						}
					}

					
					for (var materialType in locals.longBows) {
				
						if (xelib.HasKeyword(record, materialType)) {
							helpers.logMessage(recordId + "matched with " + materialType + ". It will become a long arrow" );	
							let patchData = locals.longBows[materialType];
							let tier = patchData["tier"];
							helperRoutines.makeLongArrow(record, [locals.longArrowKey, locals.longArrowRankKeys[tier - 1]], tier, settings.longBowDamageMultiplier, locals.longProjectileProperties[tier], locals.patchFileRef);
							return;
						}
					}
						
					helpers.logMessage("Arrow record " + recordId + " has no matching materials or custom entries.");
				}
				else {
					
					helpers.logMessage(recordId + " is a bolt.");
					
					
					if (recordId in locals.lightBoltOverrides) {
						helpers.logMessage("custom entry " + recordId + " will become a light bolt ");
						let tier = locals.lightBoltOverrides[recordId];
						helperRoutines.makeLightBolt(record,  [locals.lightBoltKey, locals.lightBoltRankKeys[tier - 1]], tier, settings.lightCrossBowDamageMultiplier, locals.lightProjectileProperties[tier], locals.patchFileRef);
						return;
					}
					
					if (recordId in locals.heavyBoltOverrides) {
						helpers.logMessage("custom entry " + recordId + " will become a heavy bolt ");
						let tier = locals.heavyBoltOverrides[recordId];
						helperRoutines.makeHeavyBolt(record, [locals.heavyBoltKey, locals.heavyBoltRankKeys[tier - 1]], tier, settings.heavyCrossBowDamageMultiplier, locals.heavyProjectileProperties[tier], locals.patchFileRef);
						return;
					}
					
					if (recordId in locals.siegeBoltOverrides) {
						helpers.logMessage("custom entry " + recordId + " will become a siege bolt ");
						helperRoutines.makeSiegeBolt(record, [locals.siegeBoltKey], 1, settings.siegeCrossBowDamageMultiplier, locals.siegeProjectileProperties[1], locals.patchFileRef);
						return;
					}
					
					for (var materialType in locals.lightCrossBows) {

						if (xelib.HasKeyword(record, materialType)) {
							helpers.logMessage(recordId + "matched with " + materialType + ". It will become a light bolt" );	
							let patchData = locals.lightCrossBows[materialType];
							let tier = patchData["tier"];
							helperRoutines.makeLightBolt(record, [locals.lightBoltKey, locals.lightBoltRankKeys[tier - 1]], tier, settings.lightCrossBowDamageMultiplier, locals.lightProjectileProperties[tier], locals.patchFileRef);
							return;
						}
					}
					
					for (var materialType in locals.heavyCrossBows) {

						if (xelib.HasKeyword(record, materialType)) {
							helpers.logMessage(recordId + "matched with " + materialType + ". It will become a heavy bolt" );	
							let patchData = locals.heavyCrossBows[materialType];
							let tier = patchData["tier"];
							helperRoutines.makeHeavyBolt(record, [locals.heavyBoltKey, locals.heavyBoltRankKeys[tier - 1]], tier, settings.heavyCrossBowDamageMultiplier, locals.heavyProjectileProperties[tier], locals.patchFileRef);
							return;
						}
					}
					helpers.logMessage("Bolt record " + recordId + " has no matching materials or custom entries.");
				}
			}
		},
		{ 
			// NPC Patcher. This will add the bow type perks to all npcs that can wield a crossbow or a bow
			load: {
				signature: 'NPC_',
				filter: function(record) {
					let recordId = xelib.GetValue(record, 'EDID');
					let lowerId = recordId.toLowerCase();
					locals.bannedNpcs.forEach(npcName => {
						if (lowerId.includes(npcName)) {
							return false;
						}
					})
					
					let raceRecord =xelib.GetLinksTo(record, 'RNAM');
					try {
						raceRecord = xelib.GetWinningOverride(raceRecord);
						let equipFlags = xelib.GetEnabledFlags(raceRecord, 'VNAM - Equipment Flags');
						if (equipFlags.includes('Crossbow') && equipFlags.includes('Bow')) {
							locals.npcCache[recordId] = 3;
						} 
						else if (equipFlags.includes('Crossbow')) {
							locals.npcCache[recordId] = 2;
						}
						else if(equipFlags.includes('Bow')) {
							locals.npcCache[recordId] = 1;
						}
						else {
							return false;
						}
						return true;
					} 
					catch (err) {
						helpers.logMessage("Error processing " + recordId + ". Missing Race links");
						return false;
					}
				}
			},
			patch: function (record) {
				
				//raceRecord = xelib.GetLinksTo(record, 'RNAM');
				let recordId = xelib.GetValue(record, 'EDID');
				
				if (locals.npcCache[recordId] == 1 || locals.npcCache[recordId] == 3) {
					helpers.logMessage('Adding bow perks to NPC ' + recordId);
					locals.heartSeekerBowPerks.forEach(perk => {
						xelib.AddPerk(record, perk, '1');
					})
					
				}
				if (locals.npcCache[recordId] == 2 || locals.npcCache[recordId] == 3) {
					helpers.logMessage('Adding Crossbow perks to NPC ' + recordId);
					locals.heartSeekerXBowPerks.forEach(perk => {
						xelib.AddPerk(record, perk, '1');
					})
					
				}
				
				if (recordId == "Player") {
					locals.heartSeekerPlayerOnlyPerks.forEach(perk => {
						xelib.AddPerk(record, perk, '1');
					})
				}
			}
		}  
		],
        finalize: function() {

        }
    })
});

/*
		{
			load: {
                signature: 'RACE',
                filter: function(record) {
					let recordId = xelib.GetValue(record, 'EDID');
					equipFlags = xelib.GetEnabledFlags(record, 'VNAM - Equipment Flags');
					if (equipFlags.includes('Bow') && equipFlags.includes('Crossbow')) {
						helpers.logMessage('"' + recordId + '":' + ' 3,');
						locals.race_data[recordId] = 3;
						return true;
					}
					else if (equipFlags.includes('Bow')) {
						helpers.logMessage('"' + recordId + '":' + ' 1,');
						locals.race_data[recordId] = 1;
						return true;
					}
					else if (equipFlags.includes('Crossbow')) {
						helpers.logMessage('"' + recordId + '":' + ' 2,');
						locals.race_data[recordId] = 2;
						return true;
					}
					
                    return false;
                }
            },
			patch: function (record) {
				return;
			}
		}
*/
/*
				let recordId = xelib.GetValue(record, 'EDID');
				let raceName = xelib.GetValue(record, 'RNAM').split(' ')[0];
				if (locals.races[raceName] == 1 || locals.races[raceName] == 3) {
					helpers.logMessage('Adding bow perks to NPC' + recordId);
					locals.heartSeekerBowPerks.forEach(perk => {
						xelib.AddPerk(record, perk, '1');
					})
					
				}
				if (locals.races[raceName] == 2 || locals.races[raceName] == 3) {
					helpers.logMessage('Adding Crossbow perks to ' + recordId);
					locals.heartSeekerXBowPerks.forEach(perk => {
						xelib.AddPerk(record, perk, '1');
					})
					
				}
				
				if (recordId == "Player") {
					locals.heartSeekerPlayerOnlyPerks.forEach(perk => {
						xelib.AddPerk(record, perk, '1');
					})
				} */

exports.enums = Object.freeze({
    
    InPlayEnum : Object.freeze({
        JAMMED_ASSAULT:"Jammed Assault",
        THIRTY_THREE:"Thirty Three",
        AMBUSH:"Ambush",
        CYLON_SWARM:"Cylon Swarm",
        DETECTOR_SABOTAGE:"Detector Sabotage",
        ACCEPT_PROPHECY:"Accept Prophecy",
    }),
    
    SkillTypeEnum : Object.freeze({
        TREACHERY:"Treachery",
        POLITICS:"Politics",
        LEADERSHIP:"Leadership",
        TACTICS:"Tactics",
        PILOTING:"Piloting",
        ENGINEERING:"Engineering",
        LEADERSHIPPOLITICS:"LeadershipPolitics",
        LEADERSHIPENGINEERING:"LeadershipEngineering",
    }),
    
    DeckTypeEnum : Object.freeze({
        ENGINEERING:"Engineering",
        LEADERSHIP:"Leadership",
        PILOTING:"Piloting",
        POLITICS:"Politics",
        TACTICS:"Tactics",
        LOYALTY:"Loyalty",
        DESTINATION:"Destination",
        CRISIS:"Crisis",
        SUPER_CRISIS:"SuperCrisis",
        DESTINY:"Destiny",
        QUORUM:"Quorum",
        GALACTICA_DAMAGE:"GalacticaDamage",
        BASESTAR_DAMAGE:"BasestarDamage",
        CIV_SHIP:"CivShip",
    }),
    
    CardTypeEnum : Object.freeze({
        LOYALTY : 'loyalty',
        SKILL : 'skill',
        CRISIS : 'crisis',
        SUPER_CRISIS: 'super crisis',
        QUORUM : 'quorum',
        DESTINATION : 'destination',
        
    }),
    
    SkillPlayTimeEnum : Object.freeze({
        
        ACTION : 'action',
        MOVEMENT : 'movement',
        ACTION_OR_MOVEMENT : 'action or movement',
        VIPER : 'while in a viper',
        NONE : 'none',
        
        //these will need pause phases to play them
        
        AFTER_VIPER_ATTACKED : 'after a viper is attacked',
        BEFORE_SKILL_CHECK : 'before skill check',
        BEFORE_LOCATION_SKILLCHECK : 'before location skill check',
        AFTER_SKILL_CHECK : 'after skill check',
        AFTER_SKILL_PASS : 'after skill pass',
        BEFORE_DIE_ROLL : 'before die roll',
        AFTER_DIE_ROLL : 'after die roll',
        AFTER_DESTROY : 'after a basestar or centurion are destroyed',
        BEFORE_RAIDERS : 'before raiders are activated',
        HUMAN_DISCARDS_TREACHERY : 'human discards treachery',
        BEFORE_PILOTED_VIPER_ATTACK : 'before piloted viper attack',
        
    }),
    
    CylonActivationTypeEnum : Object.freeze({
        //Cylon activation step
        ACTIVATE_RAIDERS:"Activate Raiders",
        LAUNCH_RAIDERS:"Launch Raiders",
        ACTIVATE_HEAVY_RAIDERS:"Activate Heavy Raiders",
        ACTIVATE_BASESTARS:"Activate Basestars",
        NONE:"None",
        
        //Cylon attack cards
        HEAVY_ASSAULT:"Heavy Assault",
        RAIDING_PARTY:"Raiding Party",
        THIRTY_THREE:"Thirty-Three",
        AMBUSH:"Ambush",
        SURROUNDED:"Surrounded",
        TACTICAL_STRIKE:"Tactical Strike",
        BOARDING_PARTIES:"Boarding Parties",
        BESIEGED:"Besieged",
        JAMMED_ASSAULT:"Jammed Assault",
        CYLON_SWARM:"Cylon Swarm",
        
        //Super Crisis
        MASSIVE_ASSAULT:"Massive Assault",
        
        //Other
        RESCUE_THE_FLEET:"Rescue the Fleet",
        CRIPPLED_RAIDER:"Crippled Raider",
        CYLON_TRACKING_DEVICE:"Cylon Tracking Device",
        CYLON_AMBUSH:"Cylon Ambush",
        
        //pegasus cylon attack cards
        DOGFIGHT:"Dogfight",
        SCAR:"Scar",
        THE_GUARDIANS:"The Guardians",
        
    }),
    
    CharacterTypeEnum : Object.freeze({
        MILITARY_LEADER:"Military Leader",
        POLITICAL_LEADER:"Political Leader",
        PILOT:"Pilot",
        SUPPORT:"Support",
        CYLON_LEADER:"Cylon Leader",
    }),
    
    GamePhaseEnum : Object.freeze({
        SETUP:"Setup",
        PICK_CHARACTERS:"Pick Characters",
        PICK_HYBRID_SKILL_CARD:"Pick Hybrid Skill Card",
        PICK_RESEARCH_CARD:"Pick Research Card",
        PICK_LAUNCH_LOCATION:"Pick Launch Location",
        PLACE_SHIPS:"Place Ships",
        LADAMA_STARTING_LAUNCH:"Lee Adama Starting Launch",
        CHOOSE_VIPER:"Choose Viper",
        ACTIVATE_VIPER:"Activate Viper",
        REPAIR_VIPERS_OR_HANGAR_DECK:"Repair vipers or hangar deck",
        ATTACK_CENTURION:"Attack Centurion",
        WEAPONS_ATTACK:"Weapons Attack",
        REVEAL_CIVILIANS:"Reveal Civilians",
        MOVE_CIVILIANS:"Move Civilians",
        MAIN_TURN:"Main Turn",
        MOVE_FROM_BRIG:"Move From Brig",
        DISCARD_FOR_MOVEMENT:"Discard for movement",
        CHOOSE:"Make a choice",
        SKILL_CHECK:"Skill Check",
        SINGLE_PLAYER_DISCARDS: "Single player discards",
        EACH_PLAYER_DISCARDS: "All players discard",
        LAUNCH_NUKE:"Launch Nuke",
        CYLON_DAMAGE_GALACTICA:"Cylon Damage Galactica",
        END_TURN:"End Turn",
        ROLL_DIE:"Roll Die",
    }),
    
    LocationEnum : Object.freeze({ //Shares some text with GalacticaDamageTypeEnum and also in client, don't change one without the others
        
        //Colonial One
        PRESS_ROOM:"Press Room",
        PRESIDENTS_OFFICE:"Presidents Office",
        ADMINISTRATION:"Administration",
        
        //Cylon Locations
        CAPRICA:"Caprica",
        CYLON_FLEET:"Cylon Fleet",
        HUMAN_FLEET:"Human Fleet",
        RESURRECTION_SHIP:"Resurrection Ship",
        
        //Galactica
        FTL_CONTROL:"FTL Control",
        WEAPONS_CONTROL:"Weapons Control",
        COMMUNICATIONS:"Communications",
        RESEARCH_LAB:"Research Lab",
        COMMAND:"Command",
        ADMIRALS_QUARTERS:"Admirals Quarters",
        HANGAR_DECK:"Hangar Deck",
        ARMORY:"Armory",
        SICKBAY:"Sickbay",
        BRIG:"Brig",
        
        //New Caprica
        MEDICAL_CENTER:"Medical Center",
        RESISTANCE_HQ:"Resistance HQ",
        DETENTION:"Detention",
        OCCUPATION_AUTHORITY:"Occupation Authority",
        BREEDERS_CANYON:"Breeder's Canyon",
        SHIPYARD:"Shipyard",
        
        //Pegasus
        PEGASUS_CIC:"Pegasus CIC",
        AIRLOCK:"Airlock",
        MAIN_BATTERIES:"Main Batteries",
        ENGINE_ROOM:"Engine room",
        
    }),
    
    SpaceEnum : Object.freeze({
        NE:"Northeast",
        E:"East",
        SE:"Southeast",
        SW:"Southwest",
        W:"West",
        NW:"Northwest",
    }),
    
    ShipTypeEnum : Object.freeze({
        VIPER:"Viper",
        BASESTAR:"Basestar",
        RAIDER:"Raider",
        HEAVY_RAIDER:"Heavy Raider",
        CIVILIAN:"Civilian",
    }),
    
    CivilianShipTypeEnum : Object.freeze({
        ONE_POPULATION:"One Population",
        TWO_POPULATION:"Two Population",
        POPULATION_FUEL:"Population Fuel",
        POPULATION_MORALE:"Population Morale",
        NOTHING:"Nothing",
    }),
    
    ActivationTimeEnum : Object.freeze({
        ACTION:"Action",
        BEFORE_SKILL_CHECK:"Before Skill Check",
        STRENGTH_TOTALED:"Strength Totaled",
        VIPER_ATTACKED:"Viper Attacked",
        BEFORE_DIE_ROLL:"Before Die Roll",
    }),
    
    GalacticaDamageTypeEnum : Object.freeze({ //Shares some text with LocationEnum and also in client, don't change one without the others
        FTL_CONTROL:"FTL Control",
        WEAPONS_CONTROL:"Weapons Control",
        COMMAND:"Command",
        ADMIRALS_QUARTERS:"Admirals Quarters",
        HANGAR_DECK:"Hangar Deck",
        ARMORY:"Armory",
        FOOD:"Food Stores",
        FUEL:"Fuel Stores"
    }),
    
    BasestarDamageTypeEnum : Object.freeze({
        CRITICAL:"Critical",
        HANGAR:"Hangar",
        WEAPONS:"Weapons",
        STRUCTURAL:"Structural"
    }),
    
    WhoEnum : Object.freeze({
        CURRENT : 'current',
        ADMIRAL : 'admiral',
        PRESIDENT : 'president',
        ACTIVE : 'active',
    }),
    
});

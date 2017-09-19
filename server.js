const MAX_RESOURCE=15;
const MAX_HAND_SIZE=10;
const JUMP_PREP_3POP_LOCATION=3;
const JUMP_PREP_1POP_LOCATION=4;
const JUMP_PREP_AUTOJUMP_LOCATION=5;
const CENTURION_DESTROYED_MINIMUM_ROLL=7;
const RAIDER_DESTROYED_MINIMUM_ROLL=3;
const HEAVY_RAIDER_DESTROYED_MINIMUM_ROLL=7;
const VIPER_DAMAGES_BASESTAR_MINIMUM_ROLL=8;
const GALACTICA_DAMAGES_BASESTAR_MINIMUM_ROLL=5;
const BASESTAR_DAMAGES_GALACTICA_MINIMUM_ROLL=4;
const RAIDER_DAMAGES_GALACTICA_MINIMUM_ROLL=8;
const GALACTICA_DESTROYED_DAMAGE=6;
const VIPER_DAMAGED_MINIMUM_ROLL=5;
const VIPER_DESTROYED_MINIMUM_ROLL=8;
const MAX_RAIDERS = 16;
const MAX_HEAVY_RAIDERS = 4;
const MAX_BASESTARS = 2;
const RAIDERS_LAUNCHED=3;
const RAIDERS_LAUNCHED_DURING_ACTIVATION=2;
const RAIDERS_DESTROYED_BY_NUKE=3;
const NUMBER_OF_VIPERS=8;
const NUMBER_OF_RAPTORS=4;
const NUMBER_OF_CYLON_ATTACK_CARDS=10;

//server
const express = require('express');
const app = express();
app.use(express.static(__dirname + '/images'));
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;
app.get('/', (req, res) => res.sendFile(__dirname + '/client.html') );
http.listen(port,() => console.log('listening on *:' + port) );

//import .js files
const enums = require(__dirname + '/enums').enums;
const base = require(__dirname + '/base').data;
const pegasus = require(__dirname + '/pegasus').data;
const daybreak = require(__dirname + '/daybreak').data;
const exodus = require(__dirname + '/exodus').data;

//boolean turns DB on and off
const dataBaseOn = false;
let pg;
let client;

if (dataBaseOn) {
    pg = require('pg');
    pg.defaults.ssl = true;
    client = new pg.Client(process.env.DATABASE_URL);
    client.connect();
}

//holds online users
const users = {};
const games = {};
const lobby = {};
const tables = {};
const offLineUsers = {};
function LoggedOut(gameId, index) {
    this.gameId = gameId;
    this.index = index;
}

if (dataBaseOn) {
    client.query('SELECT * FROM users;').on('row', row => {
        offLineUsers[row.name] = new LoggedOut(row.gameid, row.index)
    });
    client.query('SELECT * FROM games;').on('row', row => {
        let game = new Game(-1,-1);
        game.restore(row.game);
        games[row.id] = game;
    });
}

const InPlayEnum = enums.InPlayEnum;
const SkillTypeEnum = enums.SkillTypeEnum;
const DeckTypeEnum = enums.DeckTypeEnum;
const CardTypeEnum = enums.CardTypeEnum;
const SkillPlayTimeEnum = enums.SkillPlayTimeEnum;
const CylonActivationTypeEnum = enums.CylonActivationTypeEnum;
const CharacterTypeEnum = enums.CharacterTypeEnum;
const GamePhaseEnum = enums.GamePhaseEnum;
const LocationEnum = enums.LocationEnum;
const SpaceEnum = enums.SpaceEnum;
const ShipTypeEnum = enums.ShipTypeEnum;
const CivilianShipTypeEnum = enums.CivilianShipTypeEnum;
const ActivationTimeEnum = enums.ActivationTimeEnum;
const GalacticaDamageTypeEnum = enums.GalacticaDamageTypeEnum;
const BasestarDamageTypeEnum = enums.BasestarDamageTypeEnum;
const WhoEnum = enums.WhoEnum;
const SetEnum = enums.SetEnum;
const DamageToGraphic = enums.DamageToGraphic;

const AdmiralLineOfSuccession = Object.freeze([
	base.CharacterMap.BADAMA,
    base.CharacterMap.TIGH,
    base.CharacterMap.AGATHON,
    base.CharacterMap.LADAMA,
    base.CharacterMap.THRACE,
    base.CharacterMap.VALERII,
    base.CharacterMap.TYROL,
    base.CharacterMap.ZAREK,
    base.CharacterMap.BALTAR,
    base.CharacterMap.ROSLIN,
]);
const PresidentLineOfSuccession = Object.freeze([
    base.CharacterMap.ROSLIN,
    base.CharacterMap.BALTAR,
    base.CharacterMap.ZAREK,
    base.CharacterMap.LADAMA,
    base.CharacterMap.BADAMA,
    base.CharacterMap.AGATHON,
    base.CharacterMap.TYROL,
    base.CharacterMap.VALERII,
    base.CharacterMap.TIGH,
    base.CharacterMap.THRACE,
]);

function Game(users,gameId,data){
    console.log(data);
	let game = this;
	this.gameId = gameId;
	let players=users;
	let currentPlayer=-1;
	let phase=GamePhaseEnum.SETUP;
	let lastPhase=null;
	let activePlayer=-1;
	let currentMovementRemaining=-1;
	let activeMovementRemaining=-1;
	let currentActionsRemaining=-1;
	let activeActionsRemaining=-1;
	let spaceAreas={"Northeast":[],"East":[],"Southeast":[],"Southwest":[],"West":[],"Northwest":[]};	
    let availableCharacters=[];
    let charactersChosen=0;
    let discardAmount = 0;
    let activeTimer = null;
    let activeRoll = null;
    let activeRollNarration = null;
    let activeCrisis = null;
    let activeDestinations = null;
    let activeScout = null;
    let capricaOptions = null;
    let loyaltyShown = null;
    let activeQuorum = null;
    let hiddenQuorum = null;
    let committee = false;
    this.nextAction = game => {};
    this.nextAction = null;
    this.afterRoll = game => {};
    this.roll = -1;
    let reason = '';
    //let nextAction = aGame => this.nextAction(aGame);
    let hasAction = () => this.nextAction != null;
    
    
    
    
    
    
    //played skill cards
    let strategicPlanning = false;
    let research = false;
    
    
    
    
    
    
    
    let doRoll = () => {
        this.roll = rollDie();
        activeRoll = this.roll;
        sendNarrationToAll(game.getPlayers()[game.getActivePlayer()].character.name + " rolls a " + activeRoll, game.gameId);
        if (strategicPlanning) {
            this.roll += 2;
            sendNarrationToAll("Roll gets +2 for strategic planning for a total of " + this.roll, game.gameId);
            for(let i=0;i<players.length;i++){
                sendGameState(i);
            }
        }
        phase = savedPhase;
        savedPhase=null;
        activeRollNarration=null;
        this.afterRoll(this);
        this.afterRoll = game => {};
        this.roll=-1;
        for(let i=0;i<players.length;i++){
            sendGameState(i);
        }
    };
    
    this.setUpRoll = (seconds, who, why) => {
        savedPhase=phase;
        strategicPlanning = false;
        who = interpretWhoEnum(who);
        reason = `${players[who].character.name} is about to roll, reason:<br/>${why}`;
        phase = GamePhaseEnum.ROLL_DIE;
        game.setActiveRollNarration(game.getPlayers()[game.getActivePlayer()].character.name+" is rolling for:<br>"+why+"<br>You may play a Strategic Planning");
        sendNarrationToAll(reason,this.gameId);
        for(let i=0;i<players.length;i++){
            sendGameState(i);
        }
        game.setActiveTimer(setTimeout(doRoll,(seconds*1000)));
        console.log("timer: "+game.getActiveTimer());
    };
    
    this.randomLoyaltyReveal = (to, from) => {
        if (inPlay.indexOf(InPlayEnum.DETECTOR_SABOTAGE) === -1) {
            let rand = Math.floor(Math.random() * players[from].loyalty.length);
            loyaltyShown=[players[from].loyalty[rand].graphic];
            loyaltyRevealer=to;
            loyaltyRevealTarget=from;
            sendNarrationToPlayer(players[to].userId, `Random loyalty card from ${
                players[from].character.name} reads: <br/>${players[from].loyalty[rand].text}`);
            sendNarrationToPlayer(players[from].userId, `You reveal to ${
                players[to].character.name}, a loyalty random card: <br/>${players[from].loyalty[rand].text}`);
        } else sendNarrationToAll(`${players[to].character.name} tried to reveal a loyalty from ${
            players[from].character.name} but was blocked by detector sabotage card in play`, gameId);
        
    };
    
    this.fullLoyaltyReveal = (to, from) => {
        if (inPlay.indexOf(InPlayEnum.DETECTOR_SABOTAGE) === -1) {
            loyaltyRevealer=to;
            loyaltyRevealTarget=from;
            loyaltyShown=[];
            for(let i=0;i<players[from].loyalty.length;i++){
            	loyaltyShown.push(players[from].loyalty[i].graphic);
            	sendNarrationToPlayer(players[to].userId, `Random loyalty card from ${
                players[from].character.name} reads: <br/>${players[from].loyalty[i].text}`);
				sendNarrationToPlayer(players[from].userId, `You reveal to ${
					players[to].character.name}, a loyalty random card: <br/>${players[from].loyalty[i].text}`);
            }
        } else sendNarrationToAll(`${players[to].character.name} tried to reveal all loyalty from ${
            players[from].character.name} but was blocked by detector sabotage card in play`, gameId);
        
    };
    
    let activeChoice = game => {};
    let choice1 = game => {};
    let choice2 = game => {};
    let choiceText = 'no choice';
    let choiceOptions = [];

    let playersChecked = 0;
    let passValue = 0;
    let middleValue = -1;
    let skillText = '';
    let skillCheckTypes = []; //ie [SkillTypeEnum.POLITICS, SkillTypeEnum.PILOTING]
    let skillPass = game => {};
    let skillMiddle = game => {};
    let skillFail = game => {};
    
    let vipersInHangar=-1;
	let raptorsInHangar=-1;
	let damagedVipers=-1;
	
	let fuelAmount=-1;
	let foodAmount=-1;
	let moraleAmount=-1;
	let populationAmount=-1;

	let inPlay=[];
    let centurionTrack=[0,0,0,0];
    let jumpTrack=-1;
    let distanceTrack=0;
    let destinationsPlayed = [];
    let damagedLocations=[];
    let nukesRemaining=-1;
    let currentPresident=-1;
    let currentAdmiral=-1;
    let currentArbitrator=-1;
    this.setArbitrator = player => currentArbitrator = player;
    let currentMissionSpecialist=-1;
    this.setMissionSpecialist = player => currentMissionSpecialist = player;
    let currentVicePresident=-1;
    this.setVicePresident = player => currentPresident = player;
    let quorumHand=[];
    let skillCheckCards=[];

	//Flags etc
	let vipersToActivate=0;
	let currentViperLocation=-1;
    let civilianShipsToReveal=0;
    let currentCivilianShipLocation=-1;
    let shipNumberToPlace=[];
    let shipPlacementLocations=[];
    let damageOptions=[];
    let savedPhase=-1;
    let locationsToDamage=0;
    let maximumFirepower=0;
    let executiveOrderActive=false;
    let cylonPlayerWasInBrig=false;
    let loyaltyRevealer=-1;
    let loyaltyRevealTarget=-1;
    this.skillCardsToDraw=0;
    this.skillCardsLeft=[0,0,0,0,0];
    this.skillCardsOptions=[];

    let decks={
        Engineering:{ deck:[], discard:[], },
        Leadership:{ deck:[], discard:[], },
        Piloting:{ deck:[], discard:[], },
        Politics:{ deck:[], discard:[], },
        Tactics:{ deck:[], discard:[], },
        SuperCrisis:{ deck:[], discard:[], },
        Quorum:{ deck:[], discard:[], },
        Crisis:{ deck:[], discard:[], },
        
        //no discard decks
        Destination:{ deck:[], },
        Loyalty:{ deck:[], },
        Destiny:{ deck:[], },
        GalacticaDamage:{ deck:[], },
        BasestarDamage:{ deck:[], },
        CivShip:{ deck:[], },
	};

    let interpretWhoEnum = whoEnum => {
        switch (whoEnum) {
            case WhoEnum.PRESIDENT : whoEnum = currentPresident; break;
            case WhoEnum.ADMIRAL : whoEnum = currentAdmiral; break;
            case WhoEnum.CURRENT : whoEnum = currentPlayer; break;
            case WhoEnum.ACTIVE : whoEnum = activePlayer; break;
            case WhoEnum.CAG : whoEnum = currentCAG; break; //<--TODO
        }
        return whoEnum
    };
    
    
    this.narratePlayer = (player, text) => {
        sendNarrationToPlayer(players[player].userId, text);
    };
    
    this.narrateAll = text => sendNarrationToAll(text, gameId);

    this.readCard = card => readCard(card);

    this.rollDie = () => rollDie();

    this.endCrisis = () => {
        console.log("in end crisis");
        if (hasAction())
            this.nextAction(game);
        else nextTurn();
	};
    
    //SKILL CHECK STUFF
    let activeSkillCheck = null;
    
    let doSkillCheck = () => {
        
        if (research) {
            this.narrateAll('research card in play, engineering counts as positive strength.');
            activeSkillCheck.types.push(SkillTypeEnum.ENGINEERING);
            research = false;
        }
        
        if (committee)
            this.narrateAll('WARNING! Committee in play, Skill cards will be revealed.');
        
        this.doSkillCheck(activeSkillCheck);
        
    };
    
    this.beforeSkillCheck = JSON => {
        activeSkillCheck = JSON;
        phase = GamePhaseEnum.BEFORE_SKILL_CHECK;
        game.setActiveTimer(setTimeout(doSkillCheck,(8000)));
        for(let i=0;i<players.length;i++){
            sendGameState(i);
        }
        
    };
    
    this.doSkillCheck = skillJSON => {
        phase = GamePhaseEnum.SKILL_CHECK;
        skillCheckTypes = skillJSON.types;
        skillPass = skillJSON.pass;
        skillFail = skillJSON.fail;
        if ('middle' in skillJSON) {
            skillMiddle = skillJSON.middle.action;
            middleValue = skillJSON.middle.value;
        } else middleValue = -1;
        passValue = skillJSON.value;
        skillText = skillJSON.text;
        nextActive();
        for(let i=0;i<players.length;i++){
            sendGameState(i);
        }
        sendNarrationToPlayer(players[activePlayer].userId, skillText);
        
        skillJSON = null;
    };
    
    this.singlePlayerDiscards = (player, numberToDiscard) => {
        let interpret=interpretWhoEnum(player);
        if(interpret!==-1){
            player = interpret;
        }
        if(players[player].character.name===base.CharacterMap.LADAMA.name){
            for (let x = 0; x < numberToDiscard; x++){
                this.discardRandomSkill(player);
            }
            this.nextAction(this);
            return;
        }
        console.log("next action: "+this.nextAction + '');
        phase = GamePhaseEnum.SINGLE_PLAYER_DISCARDS;
        if (numberToDiscard >= players[player].hand.length) {
            console.log('AUTO DISCARDING');
            for (let x = 0; x < numberToDiscard; x++)
                this.discardRandomSkill(player);//only discards if player has card so no worries about over discarding
            this.nextAction(this);
            return;
        }
        activePlayer = player;
        discardAmount = numberToDiscard;
        sendNarrationToPlayer(players[activePlayer].userId, `Choose ${discardAmount} cards to discard.`);
    };
    
    this.eachPlayerDiscards = (numberToDiscard) => {
        phase = GamePhaseEnum.EACH_PLAYER_DISCARDS;
        nextActive();
        discardAmount = numberToDiscard;
        if (players[activePlayer].hand.length <= discardAmount) {
            while (players[activePlayer].hand.length <= discardAmount) {
                console.log('AUTO DISCARDING!');
                for (let x = 0; x < discardAmount; x++)
                    this.discardRandomSkill(activePlayer);
                if (++playersChecked === players.length) {
                    playersChecked = 0;
                    discardAmount = 0;
                    this.nextAction(this);
                    return;
                } else {
                    nextActive();
                    sendNarrationToPlayer(players[activePlayer].userId, `Please choose ${
                        discardAmount} skill cards to discard`);
                }
            }
        }else if(players[activePlayer].character.name===base.CharacterMap.LADAMA.name){
            for (let x = 0; x < numberToDiscard; x++){
                this.discardRandomSkill(player);
            }
            if (++playersChecked === players.length) {
				playersChecked = 0;
				discardAmount = 0;
				this.nextAction(this);
				return;
			} else {
				nextActive();
				sendNarrationToPlayer(players[activePlayer].userId, `Please choose ${
					discardAmount} skill cards to discard`);
			}
		}else{
			sendNarrationToPlayer(players[activePlayer], `Choose ${discardAmount} cards to discard.`);
		}          
    };
    
    this.choose = choice => {
        console.log("in choose");
        console.log("chocie is "+choice);

        phase = GamePhaseEnum.CHOOSE;
        activeChoice=choice;
        choice.chooser = interpretWhoEnum(choice.who);
        console.log("finished interpreting and chooser is "+choice.chooser);

        if (choice.player != null) {
            console.log("in player choice");

            choice1 = choice.player;
            choice2 = null;
        } else if (choice.other != null) {
            console.log("in misc choice");

            choice1 = choice.other;
            choice2 = null;
        } else {
            console.log("in this or that choice");

            choice1 = choice.choice1;
            choice2 = choice.choice2;
        }
        choiceText = choice.text;

        if(choice['options']!=null){
            console.log("found custom options");

            choiceOptions=choice.options(game);
        }else{
            console.log("no custom options");

            choiceOptions=["First","Second"];
        }
        activePlayer = choice.chooser;
        console.log("set active player to "+activePlayer);

        sendNarrationToPlayer(players[choice.chooser].userId, choice.text);
        
        if (!('private' in choice))
            for (let x = 0; x < players.length; x++)
                if (x !== choice.chooser)
                    sendNarrationToPlayer(players[x].userId, `${players[activePlayer].character.name} is making a choice: <br/>${choice.text}`)
        
    };
    
    let playCrisis = card => {
        let cardJSON = readCard(card);
        if(!players[activePlayer].isRevealedCylon){
        	jumpTrack += cardJSON.jump ? 1 : 0;
        }
        sendNarrationToAll(`${players[currentPlayer].character.name} plays a ${cardJSON.name} crisis card: `,game.gameId);
        sendNarrationToAll(cardJSON.text,game.gameId);
        activeCrisis = card;
        decks.Crisis.discard.push(card);
        if (cardJSON.choose != null)
            this.choose(cardJSON.choose);
        else if (cardJSON.skillCheck != null)
            this.beforeSkillCheck(cardJSON.skillCheck);
        else cardJSON.instructions(this);
    };

	//Getter and setter land
    this.getPhase = () => phase;
    this.getLastPhase = () => lastPhase;
    this.setPhase = phaseEnum => phase = phaseEnum;
    this.setLastPhase = phaseEnum => lastPhase = phaseEnum;
    this.getInPlay = () => inPlay;
    this.getPlayers = () => players;
	this.getCurrentPlayer = () => currentPlayer;
    this.getActivePlayer = () => activePlayer;
    this.getCurrentPresident = () => currentPresident;
    this.getCurrentAdmiral = () => currentAdmiral;
    this.getDecks = () => decks;
    this.getQuorumHand = () => quorumHand;
    this.getLocation = player => players[player].location;
    this.getDamagedLocations = () => damagedLocations;
    this.getJumpTrack = () => jumpTrack;
    this.getDistanceTrack = () => distanceTrack;
    this.getCenturionTrack = () => centurionTrack;
    this.getVipersInHangar = () => vipersInHangar;
    this.getRaptorsInHangar = () => raptorsInHangar;
    this.getNukesRemaining = () => nukesRemaining;
    this.getDamageOptions = () => damageOptions;
    this.getExecutiveOrderActive = () => executiveOrderActive;
    this.getActiveCrisis = () => activeCrisis;
    this.getActiveTimer = () => activeTimer;
    this.getActiveRoll = () => activeRoll;
    this.getActiveRollNarration = () => activeRollNarration;
    this.getActiveScout = () => activeScout;
    this.getCapricaOptions = () => capricaOptions;
    this.getLoyaltyShown = () => loyaltyShown;
    this.playCrisis = playCrisis;
    this.addFuel = x => fuelAmount += x;
    this.addFood = x => foodAmount += x;
    this.addMorale = x => moraleAmount += x;
    this.addPopulation = x => populationAmount += x;
    this.getFuel = () => fuelAmount;
    this.getFood = () => foodAmount;
    this.getMorale = () => moraleAmount;
    this.getPopulation = () => populationAmount;
    this.setActivePlayer = player => activePlayer = player;
    this.setPresident = x => currentPresident = x;
    this.setAdmiral = x => currentAdmiral = x;
    this.setActiveTimer = timer => activeTimer = timer;
    this.setActiveRoll = roll => activeRoll = roll;
    this.setActiveRollNarration = text => activeRollNarration = text;
    this.setHiddenQuorum = card => hiddenQuorum = card;
    this.addNukesRemaining = (num) => nukesRemaining+=num;
    this.setExecutiveOrderActive = active => executiveOrderActive = active;
    this.setActiveScout = scout => activeScout = scout;
    this.setCapricaOptions = options => capricaOptions = options;
    this.setLoyaltyShown = loyalty => loyaltyShown = loyalty;
    this.isLocationOnGalactica = function(loc){
    	return isLocationOnGalactica(loc);
	};
	this.isLocationOnColonialOne = function(loc){
    	return isLocationOnColonialOne(loc);
	};
    this.destroyCivilianShip = function(loc,num){
    	destroyCivilianShip(loc,num)
	};
    this.sendPlayerToLocation = function(player,loc){
        sendPlayerToLocation(player,loc)
    };
    this.setDamageOptions = function(options){
        damageOptions=options;
    };
    this.addToActionPoints = function(num){
        addToActionPoints(num);
    };
    this.addToActiveActionPoints = function(num){
        addToActiveActionPoints(num);
    };
    this.addToActiveMovementPoints = function(num){
        addToActiveMovementPoints(num);
    };
    this.playQuorumCard = function(num){
        playQuorumCard(num);
    };
    this.damageGalactica = function(){
        damageGalactica();
    };
    
    this.discardRandomSkill = player => {
        if (players[player].hand.length > 0) {
            let rand = Math.floor(Math.random() * players[player].hand.length);
            decks[readCard(players[player].hand[rand]).type].discard.push(players[player].hand.splice(rand, 1)[0]);
            sendNarrationToAll(`${players[player].character.name} discards a random card.`,game.gameId);
        } else {
            sendNarrationToAll(`${players[player].character.name} had no cards left to discard!`,game.gameId);
        }
    };
    
    this.discardSkill = (player, index) => {
      let card = players[player].hand.splice(index, 1)[0];
      decks[readCard(card).type].discard.push(card);
    };
    
    this.sendGameState = function(playerNumber){
    	sendGameState(playerNumber);
    };

    function sendGameState(playerNumber){
        let handArray=[];
        for(let i=0;i<players[playerNumber].hand.length;i++){
            handArray.push(readCard(players[playerNumber].hand[i]).graphic);
        }
        let quorumArray=[];
        for(let i=0;i<quorumHand.length;i++){
            console.log(quorumHand[i]);
            quorumArray.push(readCard(quorumHand[i]).graphic);
        }

        let gameStateJSON= {
            currentPlayer: currentPlayer,

            //Different for each player
            narration:"",
            reactNarration:"",
            character:players[playerNumber].character.characterGraphic,
            hand:handArray,
            quorumHand:[],
            nukes:0,
            activeLocation:-1,
            canMove:false,
            active:false,
            spaceAreas:{"Northeast":[],"East":[],"Southeast":[],"Southwest":[],"West":[],"Northwest":[]},
            loyalty:[],
            revealedLoyalty:[],
            superCrisis:[],
            quorum:null,


            playerLocations:[],
            availableCharacters:[],
            choiceOptions:choiceOptions,
            strategicPlanning:strategicPlanning,

            vipersInHangar:vipersInHangar,
            raptorsInHangar:raptorsInHangar,
            damagedVipers:damagedVipers,

            gamePhase:phase,
            crisis:null,
            roll:activeRoll,

            destinationsPlayed:[],
            fuelAmount:fuelAmount,
            foodAmount:foodAmount,
            moraleAmount:moraleAmount,
            populationAmount:populationAmount,
            jumpTrack:jumpTrack,
            damagedLocations:[],
            colonialOneDestroyed:false,
            centurionTrack:centurionTrack,
            
        };
        console.log("destinations: "+destinationsPlayed);
        for(let i=0;i<destinationsPlayed.length;i++){
        	gameStateJSON.destinationsPlayed.push(readCard(destinationsPlayed[i]).graphic);
        }
        
        if(inPlay.indexOf(InPlayEnum.BOMB_ON_COLONIAL_1)!==-1){
        	gameStateJSON.colonialOneDestroyed = true;
        }
       
        if(activeRollNarration!=null) {
            gameStateJSON.reactNarration = activeRollNarration;
        }else if(phase===GamePhaseEnum.PICK_CHARACTERS){
            if(playerNumber===activePlayer){
            	gameStateJSON.narration="Choose your character";
        	}else{
        		gameStateJSON.narration="Player "+(activePlayer+1)+" is choosing a character";
        	}
        }else if(phase===GamePhaseEnum.PICK_HYBRID_SKILL_CARD){
            if(playerNumber===activePlayer){
            	gameStateJSON.narration="Choose which skill cards to draw";
        	}else{
        		gameStateJSON.narration=players[activePlayer].character.name+" is choosing a skill card to draw";
        	}
        }else if(phase===GamePhaseEnum.PICK_RESEARCH_CARD){
            if(playerNumber===activePlayer){
            	gameStateJSON.narration="Choose which skill type to draw";
        	}else{
        		gameStateJSON.narration=players[activePlayer].character.name+" is choosing to draw engineering or tactics";
        	}
        }else if(phase===GamePhaseEnum.PICK_LAUNCH_LOCATION||phase===GamePhaseEnum.LADAMA_STARTING_LAUNCH){
            if(playerNumber===activePlayer){
            	gameStateJSON.narration="Launch to Southwest or Southeast?";
        	}else{
        		gameStateJSON.narration=players[activePlayer].character.name+" is choosing launch location";
        	}
        }else if(phase===GamePhaseEnum.PLACE_SHIPS){
            if(playerNumber===activePlayer){
            	gameStateJSON.narration="";
        	}else{
        		gameStateJSON.narration=players[activePlayer].character.name+" is placing ships";
        	}
        }else if(phase===GamePhaseEnum.CHOOSE_VIPER){
            if(playerNumber===activePlayer){
            	gameStateJSON.narration="Choose a viper or click below Galactica to launch a viper there";
        	}else{
        		gameStateJSON.narration=players[activePlayer].character.name+" is activating vipers";
        	}
        }else if(phase===GamePhaseEnum.ACTIVATE_VIPER){
            if(playerNumber===activePlayer){
            	gameStateJSON.narration="Select a ship to attack or area to move to";
        	}else{
        		gameStateJSON.narration=players[activePlayer].character.name+" is activating vipers";
        	}
        }else if(phase===GamePhaseEnum.REPAIR_VIPERS_OR_HANGAR_DECK){
            if(playerNumber===activePlayer){
            	gameStateJSON.narration="Select a damaged viper to repair it";
            	if(players[activePlayer].location===LocationEnum.HANGAR_DECK&&damagedLocations[players[activePlayer].location]){
            		gameStateJSON.narration+=", or select the damaged hangar deck";
            	}
        	}else{
        		gameStateJSON.narration=players[activePlayer].character.name+" is deciding what to repair";
        	}
        }else if(phase===GamePhaseEnum.ATTACK_CENTURION){
            if(playerNumber===activePlayer){
            	gameStateJSON.narration="Select a centurion to attack";
        	}else{
        		gameStateJSON.narration=players[activePlayer].character.name+" is attacking a centurion";
        	}
        }else if(phase===GamePhaseEnum.WEAPONS_ATTACK){
            gameStateJSON.narration = playerNumber===activePlayer ? "Select a ship to attack" : players[activePlayer].character.name+" is choosing a ship to attack";
        }else if(phase===GamePhaseEnum.MAXIMUM_FIREPOWER){
            if(playerNumber===activePlayer){
            	gameStateJSON.narration="Select a cylon ship to attack, or \"done\" to stop attacking";
        	}else{
        		gameStateJSON.narration=players[activePlayer].character.name+" is attacking the cylons with maximum firepower!";
        	}
        }else if(phase===GamePhaseEnum.REVEAL_CIVILIANS){
            if(playerNumber===activePlayer){
            	gameStateJSON.narration="Select a civilian ship to reveal";
        	}else{
        		gameStateJSON.narration=players[activePlayer].character.name+" is looking at civilian ships";
        	}
        }else if(phase===GamePhaseEnum.MOVE_CIVILIANS){
			if(playerNumber===activePlayer){
				if(currentCivilianShipLocation===-1){
					gameStateJSON.narration="Select a civilian ship to move";
				}else{
					gameStateJSON.narration="Select where to move the civilian ship";
				}
			}else{
				gameStateJSON.narration=players[activePlayer].character.name+" is moving civilian ships";
			}
        }else if(phase===GamePhaseEnum.DISCARD_FOR_MOVEMENT){
            if(playerNumber===activePlayer){
            	gameStateJSON.narration="Choose a card to discard for movement";
        	}else{
        		gameStateJSON.narration=players[activePlayer].character.name+" is choosing what to discard";
        	}
        }else if(phase===GamePhaseEnum.MOVE_FROM_BRIG){
            gameStateJSON.narration = playerNumber===activePlayer ? "Choose a location" : players[activePlayer].character.name+" is choosing where to move";
        }else if(phase===GamePhaseEnum.SINGLE_PLAYER_DISCARDS){
            gameStateJSON.narration = (playerNumber===activePlayer ? "You need " : players[activePlayer].character.name+" needs ") +
                " to discard "+discardAmount+" card(s)";
        }else if(phase===GamePhaseEnum.LAUNCH_NUKE){
            if(playerNumber===activePlayer){
            	gameStateJSON.narration="Select a basestar to nuke";
        	}else{
        		gameStateJSON.narration=players[activePlayer].character.name+" is launching a nuke!";
        	}
        }else if(phase===GamePhaseEnum.CYLON_DAMAGE_GALACTICA){
            if(playerNumber===activePlayer){
            	gameStateJSON.narration="Select a location on Galactica to damage";
        	}else{
        		gameStateJSON.narration=players[activePlayer].character.name+" is bombing Galactica!";
        	}
        }
        
        if(activeCrisis!=null){
        	if(playerNumber===activePlayer){
        		if(phase===GamePhaseEnum.CHOOSE){
        			gameStateJSON.narration=choiceOptions.length>1?"Make a choice":"";
            	}else if(phase===GamePhaseEnum.SINGLE_PLAYER_DISCARDS||phase===GamePhaseEnum.EACH_PLAYER_DISCARDS){
        			gameStateJSON.narration="Select "+discardAmount+" cards to discard";
            	}else{
            		gameStateJSON.narration="Select cards to help with crisis";
            	}	
        	}else{
        		gameStateJSON.narration="waiting for "+players[activePlayer].character.name;
        	}
            gameStateJSON.crisis=readCard(activeCrisis).graphic;
        }
        if(activeDestinations!=null){
            let destinations=[];
            for(let i=0;i<activeDestinations.length;i++){
                if(playerNumber===currentMissionSpecialist||(playerNumber==currentAdmiral&&currentMissionSpecialist===-1)){
                    if(activeDestinations.length>1&&phase===GamePhaseEnum.CHOOSE){
                        gameStateJSON.narration="Choose jump destination";
                    }else if(choiceOptions.length>1&&phase===GamePhaseEnum.CHOOSE){
                        gameStateJSON.narration="What do you want to do?";
                    }
                    destinations.push(readCard(activeDestinations[i]).graphic);
                }else{
                    if(activeDestinations.length>1&&phase===GamePhaseEnum.CHOOSE) {
                        gameStateJSON.narration = (currentMissionSpecialist != -1 ? "Mission specialist" : "Admiral") + " is looking at the destinations";
                        destinations.push("BSG_Destination_Back.png");
                    }else if(choiceOptions.length>1&&phase===GamePhaseEnum.CHOOSE){
                        gameStateJSON.narration = (currentMissionSpecialist != -1 ? "Mission specialist" : "Admiral") + " is deciding what to do";
                        destinations.push(readCard(activeDestinations[i]).graphic);
                    }else{
                        destinations.push(readCard(activeDestinations[i]).graphic);
                    }
                }
            }
            gameStateJSON.destinations=destinations;
        }
        if(activeScout!=null){
        	if(playerNumber===activePlayer){
        		gameStateJSON.narration="Place at top or bottom";
        		 gameStateJSON.scout=readCard(activeScout).graphic;
            }else{
            	gameStateJSON.narration=players[playerNumber].character.name+" is deciding to place<br>at top or bottom";
            	if(activeScout.type===CardTypeEnum.CRISIS){
            		gameStateJSON.scout="BSG_crisis_back.png";
            	}else{
            		gameStateJSON.scout="BSG_Destination_Back.png";
            	}
            }
        }
        if(capricaOptions!=null){
        	let options=[];
            for(let i=0;i<capricaOptions.length;i++){
            	options.push(readCard(capricaOptions[i]).graphic);
            }            	
                
            gameStateJSON.capricaOptions=options;
        }
        if(loyaltyShown!=null){
        	let shown=[];
            for(let i=0;i<loyaltyShown.length;i++){
            	if(playerNumber===loyaltyRevealer||playerNumber===loyaltyRevealTarget){
            		shown.push(loyaltyShown);
            	}else{
            		shown.push("BSG_Loyalty_Back.png");
            	}
            }            	
            gameStateJSON.loyaltyShown=shown;
            if(playerNumber===loyaltyRevealer){
            	gameStateJSON.narration="Revealed loyalty from "+players[loyaltyRevealTarget].character.name;
			}else if(playerNumber===loyaltyRevealTarget){
            	gameStateJSON.narration=players[loyaltyRevealer].character.name+" is looking at your loyalty";
			}else{
            	gameStateJSON.narration=players[loyaltyRevealer].character.name+" is looking at "+players[loyaltyRevealTarget].character.name+"'s loyalty";
			}
        }
        if(activeQuorum!=null){
            gameStateJSON.quorum=readCard(activeQuorum).graphic;
        }else if(hiddenQuorum!=null){
            if(playerNumber===activePlayer){
                gameStateJSON.quorum=readCard(hiddenQuorum).graphic;
            }else{
                gameStateJSON.narration=players[activePlayer].character.name+" is deciding to play or draw";
                gameStateJSON.quorum="BSG_Quorum_Back.png";
            }
        }
        for(let i=0;i<players[playerNumber].loyalty.length;i++){
            gameStateJSON.loyalty.push(players[playerNumber].loyalty[i].graphic);
        }
        for(let i=0;i<players[playerNumber].revealedLoyalty.length;i++){
            gameStateJSON.revealedLoyalty.push(players[playerNumber].revealedLoyalty[i].graphic);
        }
        for(let i=0;i<players[playerNumber].superCrisisHand.length;i++){
            gameStateJSON.superCrisis.push(readCard(players[playerNumber].superCrisisHand[i]).graphic);
        }
        for(let loc in LocationEnum){
            if(damagedLocations[LocationEnum[loc]]){
                gameStateJSON.damagedLocations.push([LocationEnum[loc],DamageToGraphic[LocationEnum[loc]]]);
            }
        }
        for(let s in SpaceEnum){
            for(let i=0;i<spaceAreas[SpaceEnum[s]].length;i++){
                let damage=[];
                if(spaceAreas[SpaceEnum[s]][i].damage[0]!==-1) damage.push(DamageToGraphic[spaceAreas[SpaceEnum[s]][i].damage[0]]);
                if(spaceAreas[SpaceEnum[s]][i].damage[1]!==-1) damage.push(DamageToGraphic[spaceAreas[SpaceEnum[s]][i].damage[1]]);
                let infoArr=[spaceAreas[SpaceEnum[s]][i].type,spaceAreas[SpaceEnum[s]][i].pilot===-1?-1:players[spaceAreas[SpaceEnum[s]][i].pilot].character.pilotGraphic,damage];
                if(spaceAreas[SpaceEnum[s]][i].activated&&playerNumber===activePlayer){
                    infoArr.push(spaceAreas[SpaceEnum[s]][i].resource);
                }
                gameStateJSON.spaceAreas[SpaceEnum[s]].push(infoArr);
            }
        }
        for(let i=0;i<players.length;i++){
            gameStateJSON.playerLocations.push([players[i].location,players[i].character.pieceGraphic]);
        }
        if(currentPresident===playerNumber){
            gameStateJSON.quorumHand=quorumArray;
        }
        if(currentAdmiral===playerNumber){
            gameStateJSON.nukes=nukesRemaining;
        }
        if(activePlayer===playerNumber&&activeActionsRemaining>0&&players[playerNumber].viperLocation===-1){
            gameStateJSON.activeLocation=players[playerNumber].location;
        }
        if(activePlayer===playerNumber&&activeMovementRemaining>0&&(phase===GamePhaseEnum.MAIN_TURN||phase===GamePhaseEnum.MOVE_FROM_BRIG)){
            gameStateJSON.canMove=true;
        }
        if(activePlayer===playerNumber){
            gameStateJSON.active=true;
        }
        if(phase===GamePhaseEnum.PICK_CHARACTERS&&playerNumber===activePlayer){
            for(let i=0;i<availableCharacters.length;i++){
                gameStateJSON.availableCharacters.push([availableCharacters[i],base.CharacterMap[availableCharacters[i]].characterGraphic]);
            }
        }

        sendGameStateToPlayer(players[playerNumber].userId,JSON.stringify(gameStateJSON));
    }
			
	let setUpNewGame=function() {
        let handicap = data.handicap;
        let evenlyDistributeCylonAttackCards=data.cylonAttackCards;
	    if (players === -1)
	        return;
        vipersInHangar = NUMBER_OF_VIPERS;
        raptorsInHangar = NUMBER_OF_RAPTORS;
        damagedVipers = 0;
        fuelAmount = 8 + parseInt(handicap);
        foodAmount = 8 + parseInt(handicap);
        moraleAmount = 10 + parseInt(handicap);
        populationAmount = 12 + parseInt(handicap);
        nukesRemaining = 2;
        jumpTrack = 0;
        
        currentPlayer = Math.floor(Math.random() * players.length);
        activePlayer=currentPlayer;
        currentMovementRemaining=1;
        activeMovementRemaining=1;
        currentActionsRemaining=1;
        activeActionsRemaining=1;
        sendNarrationToPlayer(players[currentPlayer].userId, "You are first player");

        //for testing
        let testSkills = buildStartingSkillCards();
        for (let x = 0; x < players.length; x++)
            if(x!==currentPlayer) for (let i = 0; i < 3; i++)
                players[x].hand.push(testSkills.pop());
        //end testing

        //Create Galactica damage array
		for(let type in GalacticaDamageTypeEnum){
			if(GalacticaDamageTypeEnum[type]===GalacticaDamageTypeEnum.FOOD||GalacticaDamageTypeEnum[type]===
                GalacticaDamageTypeEnum.FUEL){
				continue;
			}
			damagedLocations[type]=false;
		}

		console.log(damagedLocations);

		//Create starting skill card decks
        let skillDeck=buildStartingSkillCards();
        for (let i = 0; i < skillDeck.length; i++) {
            decks[readCard(skillDeck[i]).type].deck.push(skillDeck[i]);
        }

        //Create Destiny Deck
        buildDestiny();

        //Create Destination Deck
        for (let key in base.DestinationMap)
            for (let x = 0; x < base.DestinationMap[key].total; x++)
                decks[DeckTypeEnum.DESTINATION].deck.push(new Card(CardTypeEnum.DESTINATION, key, SetEnum.BASE));
        shuffle(decks[DeckTypeEnum.DESTINATION].deck);
        //decks[DeckTypeEnum.DESTINATION].deck.push(new Card(CardTypeEnum.DESTINATION, "ICY_MOON", SetEnum.BASE)); //For testing

        //Create Loyalty Deck
		let notACylonCards=0;
        let youAreACylonCards=0;
		if(players.length===2) {
            notACylonCards=3;
            youAreACylonCards=1;
        }else if(players.length===3){
			notACylonCards=5;
            youAreACylonCards=1;
		}else if(players.length===5){
            notACylonCards=8;
            youAreACylonCards=2;
		}
        for(let i=0;i<notACylonCards;i++){
			decks[DeckTypeEnum.LOYALTY].deck.push(base.LoyaltyMap.YOU_ARE_NOT_A_CYLON);
        }
        let tempCylons=[];
        tempCylons.push(base.LoyaltyMap.YOU_ARE_A_CYLON_AARON);
        tempCylons.push(base.LoyaltyMap.YOU_ARE_A_CYLON_BOOMER);
        tempCylons.push(base.LoyaltyMap.YOU_ARE_A_CYLON_LEOBEN);
        tempCylons.push(base.LoyaltyMap.YOU_ARE_A_CYLON_SIX);
        shuffle(tempCylons);
        for(let i=0;i<youAreACylonCards;i++){
            decks[DeckTypeEnum.LOYALTY].deck.push(tempCylons.pop());
        }
        shuffle(decks[DeckTypeEnum.LOYALTY].deck);
        //decks[DeckTypeEnum.LOYALTY].deck.push(base.LoyaltyMap.YOU_ARE_A_CYLON_LEOBEN); //For testing

        //Create Quorum Deck
        for(let key in base.QuorumMap){
            decks[DeckTypeEnum.QUORUM].deck.push(new Card(CardTypeEnum.QUORUM, key, SetEnum.BASE));
        }
        for(let i=0;i<3;i++){
            decks[DeckTypeEnum.QUORUM].deck.push(new Card(CardTypeEnum.QUORUM,'INSPIRATIONAL_SPEECH', SetEnum.BASE));
        }
        decks[DeckTypeEnum.QUORUM].deck.push(new Card(CardTypeEnum.QUORUM,'FOOD_RATIONING', SetEnum.BASE));
        decks[DeckTypeEnum.QUORUM].deck.push(new Card(CardTypeEnum.QUORUM,'ARREST_ORDER', SetEnum.BASE));
        shuffle(decks[DeckTypeEnum.QUORUM].deck);
        //decks[DeckTypeEnum.QUORUM].deck.push(new Card(CardTypeEnum.QUORUM,'RELEASE_CYLON_MUGSHOTS', SetEnum.BASE)); //For testing


        //Create galactica damage deck
        for(let type in GalacticaDamageTypeEnum){
            decks[DeckTypeEnum.GALACTICA_DAMAGE].deck.push(GalacticaDamageTypeEnum[type]);
        }
        shuffle(decks[DeckTypeEnum.GALACTICA_DAMAGE].deck);

        //Create basestar damage deck
		for(let type in BasestarDamageTypeEnum){
        	decks[DeckTypeEnum.BASESTAR_DAMAGE].deck.push(BasestarDamageTypeEnum[type]);
		}
		shuffle(decks[DeckTypeEnum.BASESTAR_DAMAGE].deck);

        //Create civilian ship deck
		for(let i=0;i<6;i++){
            decks[DeckTypeEnum.CIV_SHIP].deck.push(CivilianShipTypeEnum.ONE_POPULATION);
        }
        for(let i=0;i<2;i++){
            decks[DeckTypeEnum.CIV_SHIP].deck.push(CivilianShipTypeEnum.ONE_POPULATION);
        }
        for(let i=0;i<2;i++){
            decks[DeckTypeEnum.CIV_SHIP].deck.push(CivilianShipTypeEnum.NOTHING);
        }
        decks[DeckTypeEnum.CIV_SHIP].deck.push(CivilianShipTypeEnum.POPULATION_FUEL);
        decks[DeckTypeEnum.CIV_SHIP].deck.push(CivilianShipTypeEnum.POPULATION_MORALE);
        shuffle(decks[DeckTypeEnum.CIV_SHIP].deck);

		//Create crisis deck
        if(evenlyDistributeCylonAttackCards){
            let crisisMapLength=0;
            for(let key in base.CrisisMap){
                crisisMapLength++;
            }
            let pileSize=(crisisMapLength-NUMBER_OF_CYLON_ATTACK_CARDS)/NUMBER_OF_CYLON_ATTACK_CARDS;
            let piles=[];
            for(let i=0;i<NUMBER_OF_CYLON_ATTACK_CARDS;i++){
                piles.push([]);
            }
            let startingCrisisCards=[];
            for(let key in base.CrisisMap){
                if(base.CrisisMap[key].name!==base.CrisisMap.HEAVY_ASSAULT.name&&
                    base.CrisisMap[key].name!==base.CrisisMap.RAIDING_PARTY.name&&
                    base.CrisisMap[key].name!==base.CrisisMap.THIRTY_THREE.name&&
                    base.CrisisMap[key].name!==base.CrisisMap.AMBUSH.name&&
                    base.CrisisMap[key].name!==base.CrisisMap.SURROUNDED.name&&
                    base.CrisisMap[key].name!==base.CrisisMap.TACTICAL_STRIKE.name&&
                    base.CrisisMap[key].name!==base.CrisisMap.BOARDING_PARTIES.name&&
                    base.CrisisMap[key].name!==base.CrisisMap.BESIEGED.name&&
                    base.CrisisMap[key].name!==base.CrisisMap.JAMMED_ASSAULT.name&&
                    base.CrisisMap[key].name!==base.CrisisMap.CYLON_SWARM.name){
                    startingCrisisCards.push(new Card(CardTypeEnum.CRISIS, key, SetEnum.BASE));
                }
            }
            shuffle(startingCrisisCards);
            let currentNum=0;
            let currentPile=0;
            for(let i=0;i<startingCrisisCards.length;i++){
                piles[currentPile].push(startingCrisisCards[i]);
                currentNum++;
                if(currentNum>=pileSize){
                    currentNum=0;
                    currentPile++;
                }
            }
            let cylonAttackCards=[];
            cylonAttackCards.push(new Card(CardTypeEnum.CRISIS, 'HEAVY_ASSAULT', SetEnum.BASE));
            cylonAttackCards.push(new Card(CardTypeEnum.CRISIS, 'RAIDING_PARTY', SetEnum.BASE));
            cylonAttackCards.push(new Card(CardTypeEnum.CRISIS, 'THIRTY_THREE', SetEnum.BASE));
            cylonAttackCards.push(new Card(CardTypeEnum.CRISIS, 'AMBUSH', SetEnum.BASE));
            cylonAttackCards.push(new Card(CardTypeEnum.CRISIS, 'SURROUNDED', SetEnum.BASE));
            cylonAttackCards.push(new Card(CardTypeEnum.CRISIS, 'TACTICAL_STRIKE', SetEnum.BASE));
            cylonAttackCards.push(new Card(CardTypeEnum.CRISIS, 'BOARDING_PARTIES', SetEnum.BASE));
            cylonAttackCards.push(new Card(CardTypeEnum.CRISIS, 'BESIEGED', SetEnum.BASE));
            cylonAttackCards.push(new Card(CardTypeEnum.CRISIS, 'JAMMED_ASSAULT', SetEnum.BASE));
            cylonAttackCards.push(new Card(CardTypeEnum.CRISIS, 'CYLON_SWARM', SetEnum.BASE));
            shuffle(cylonAttackCards);
            for(let i=0;i<NUMBER_OF_CYLON_ATTACK_CARDS;i++){
                piles[i].push(cylonAttackCards[i]);
            }
            for(let i=0;i<NUMBER_OF_CYLON_ATTACK_CARDS;i++){
                shuffle(piles[i]);
                for(let j=0;j<piles[i].length;j++){
                    decks[DeckTypeEnum.CRISIS].deck.push(piles[i][j]);
                }
            }
        }else {
            for (let key in base.CrisisMap)
                decks[DeckTypeEnum.CRISIS].deck.push(new Card(CardTypeEnum.CRISIS, key, SetEnum.BASE));
            shuffle(decks[DeckTypeEnum.CRISIS].deck);
        }
        //decks[DeckTypeEnum.CRISIS].deck.push(new Card(CardTypeEnum.CRISIS, "CYLON_SCREENINGS", SetEnum.BASE)); //For testing

        //Create super crisis deck
        for (let key in base.SuperCrisisMap){
            decks[DeckTypeEnum.SUPER_CRISIS].deck.push(new Card(CardTypeEnum.SUPER_CRISIS, key, SetEnum.BASE));
            shuffle(decks[DeckTypeEnum.SUPER_CRISIS].deck);
        }
        //decks[DeckTypeEnum.SUPER_CRISIS].deck.push(new Card(CardTypeEnum.SUPER_CRISIS, 'BOMB_ON_COLONIAL_1', SetEnum.BASE)); //Testing

        //Place starting ships
        spaceAreas[SpaceEnum.W].push(new Ship(ShipTypeEnum.BASESTAR));
        spaceAreas[SpaceEnum.W].push(new Ship(ShipTypeEnum.RAIDER));
        spaceAreas[SpaceEnum.W].push(new Ship(ShipTypeEnum.RAIDER));
        spaceAreas[SpaceEnum.W].push(new Ship(ShipTypeEnum.RAIDER));
        spaceAreas[SpaceEnum.SW].push(new Ship(ShipTypeEnum.VIPER));
        spaceAreas[SpaceEnum.SE].push(new Ship(ShipTypeEnum.VIPER));
        vipersInHangar-=2;
        for(let i=0;i<2;i++){
        	let ship=new Ship(ShipTypeEnum.CIVILIAN);
            ship.resource=drawCard(decks[DeckTypeEnum.CIV_SHIP]);
            spaceAreas[SpaceEnum.E].push(ship);
        }
        for(let type in ShipTypeEnum){
        	shipPlacementLocations[ShipTypeEnum[type]]=[];
		}
        for(let type in ShipTypeEnum){
            shipNumberToPlace[ShipTypeEnum[type]]=0;
        }

        for(let key in base.CharacterMap){
            availableCharacters.push(key);
        }

		quorumHand.push(drawCard(decks[DeckTypeEnum.QUORUM]));
        phase=GamePhaseEnum.PICK_CHARACTERS;

        for(let i=0;i<players.length;i++){
            sendGameState(i);
        }

        askForCharacterChoice();
	};
	
	this.getHumanPlayerNames = function(){
        let names=[];
        for(let i=0;i<this.getPlayers().length;i++){
        	if(!this.getPlayers()[i].isRevealedCylon){
        		names.push(this.getPlayers()[i].character.name);
        	}
        }
        return names;
    };

    this.getPlayerNames = function(){
        let names=[];
        for(let i=0;i<this.getPlayers().length;i++){
            names.push(this.getPlayers()[i].character.name);
        }
        return names;
    };

    this.getSkillCardTypeNamesForPlayer = function(player) {
        if(player==null||player===-1) {
            return ["Politics", "Leadership", "Tactics", "Piloting", "Engineering"];
        }else{
            let skillsArr=[];
            let skills=players[player].character.skills;
            for(let type in SkillTypeEnum){
                if(skills[SkillTypeEnum[type]]!=null&&
                    SkillTypeEnum[type]!==SkillTypeEnum.LEADERSHIPPOLITICS&&
                    SkillTypeEnum[type]!==SkillTypeEnum.LEADERSHIPENGINEERING){
                    if(skillsArr.indexOf(SkillTypeEnum[type])===-1&&(
                    	(SkillTypeEnum[type]===SkillTypeEnum.POLITICS&&this.skillCardsLeft[0]>0)||
						(SkillTypeEnum[type]===SkillTypeEnum.LEADERSHIP&&this.skillCardsLeft[1]>0)||
						(SkillTypeEnum[type]===SkillTypeEnum.TACTICS&&this.skillCardsLeft[2]>0)||
						(SkillTypeEnum[type]===SkillTypeEnum.PILOTING&&this.skillCardsLeft[3]>0)||
						(SkillTypeEnum[type]===SkillTypeEnum.ENGINEERING&&this.skillCardsLeft[4]>0)
                    )){
                        skillsArr.push(SkillTypeEnum[type]);
                    }
                }else if(skills[SkillTypeEnum[type]]!=null&&
                    SkillTypeEnum[type]===SkillTypeEnum.LEADERSHIPPOLITICS){
                    if(skillsArr.indexOf(SkillTypeEnum.LEADERSHIP)===-1&&this.skillCardsLeft[1]>0){
                        skillsArr.push(SkillTypeEnum.LEADERSHIP);
                    }
                    if(skillsArr.indexOf(SkillTypeEnum.POLITICS)===-1&&this.skillCardsLeft[1]>0){
                        skillsArr.push(SkillTypeEnum.POLITICS);
                    }
                }else if(skills[SkillTypeEnum[type]]!=null&&
                    SkillTypeEnum[type]===SkillTypeEnum.LEADERSHIPENGINEERING){
                    if(skillsArr.indexOf(SkillTypeEnum.LEADERSHIP)===-1&&this.skillCardsLeft[1]>0){
                        skillsArr.push(SkillTypeEnum.LEADERSHIP);
                    }
                    if(skillsArr.indexOf(SkillTypeEnum.ENGINEERING)===-1&&this.skillCardsLeft[4]>0){
                        skillsArr.push(SkillTypeEnum.ENGINEERING);
                    }
                }
            }
            return skillsArr;
        }
    };

	let askForCharacterChoice=function(){
        sendNarrationToPlayer(players[activePlayer].userId, "Pick your character");
    };

    let chooseCharacter=function(character){
		if(availableCharacters.indexOf(character)>=0){
			players[activePlayer].character=base.CharacterMap[character];
            charactersChosen++;
            availableCharacters.splice(availableCharacters.indexOf(character),1);
            sendNarrationToAll("Player "+activePlayer+" picked "+base.CharacterMap[character].name,game.gameId);

            if(charactersChosen===players.length){
            	beginFirstTurn();
                return;
            }
            nextActive();
            askForCharacterChoice();
        }else{
            sendNarrationToPlayer(players[activePlayer].userId, "That character isn't available");
		}
	};

    let dealLoyaltyCards = function(){
    	for(let i=0;i<players.length;i++){
    		players[i].loyalty.push(decks[DeckTypeEnum.LOYALTY].deck.pop());
		}
		if(distanceTrack<4){
            for(let i=0;i<players.length;i++){
            	if(players[i].character.name===base.CharacterMap.BALTAR.name){
                    players[i].loyalty.push(decks[DeckTypeEnum.LOYALTY].deck.pop());
                    break;
				}
            }
		}else{
            for(let i=0;i<players.length;i++){
                if(players[i].character.name===base.CharacterMap.VALERII.name){
                    players[i].loyalty.push(decks[DeckTypeEnum.LOYALTY].deck.pop());
                    break;
                }
            }
		}
	};

    let beginFirstTurn=function(){
    	for(let i=0;i<players.length;i++){
			players[i].location=players[i].character.startLocation;
		}

		awardLinesOfSuccession();
		dealLoyaltyCards();
        for(let i=0;i<players.length;i++){
            let loyalty=players[i].loyalty;
            let loyaltyText="Loyalty:<br>";
            for(let j=0;j<loyalty.length;j++){
                loyaltyText+=loyalty[j].name+"- "+loyalty[j].text+",<br>";
            }
            sendNarrationToPlayer(players[i].userId, loyaltyText);
		}

		let ladamaPlaying=false;
        for(let i=0;i<players.length;i++){
            if(players[i].character.name===base.CharacterMap.LADAMA.name){
                activePlayer=i;
                sendNarrationToPlayer(players[i].userId, "Select 0 for Southwest launch or 1 for Southeast launch");
                phase=GamePhaseEnum.LADAMA_STARTING_LAUNCH;
                ladamaPlaying=true;
                break;
            }
        }

        if(!ladamaPlaying) {
            activePlayer = currentPlayer;
            phase = GamePhaseEnum.MAIN_TURN;
            sendNarrationToAll("It's " + players[currentPlayer].character.name + "'s turn",game.gameId);
            addStartOfTurnCardsForPlayer(currentPlayer);
        }
    };
    
    let awardLinesOfSuccession = function(){
    	let foundPresident=false;
		for(let i=0;i<PresidentLineOfSuccession.length&&!foundPresident;i++){
            for(let j=0;j<players.length;j++){
				if(players[j].character.name===PresidentLineOfSuccession[i].name&&!players[j].isRevealedCylon){
					if(currentPresident!==j){
						sendNarrationToAll(players[j].character.name + " becomes the President", game.gameId);
					}
					currentPresident=j;
                    foundPresident=true;
					break;
				}
            }
		}
        let foundAdmiral=false;
        for(let i=0;i<AdmiralLineOfSuccession.length&&!foundAdmiral;i++){
            for(let j=0;j<players.length;j++){
                if(players[j].character.name===AdmiralLineOfSuccession[i].name&&
                	players[j].location!==LocationEnum.BRIG&&
                	!players[j].isRevealedCylon){
                	if(currentAdmiral!==j){
						sendNarrationToAll(players[j].character.name + " becomes the Admiral", game.gameId);
					}
                    currentAdmiral=j;
                    foundAdmiral=true;
                    break;
                }
            }
        }
    };

    let pickHybridSkillCard=function(text){
        let amount=parseInt(text);
        if(isNaN(amount) || amount<0){
            sendNarrationToPlayer(players[activePlayer].userId, 'Not a valid amount');
            return;
        }

        let skills=players[activePlayer].character.skills;
        if(skills[SkillTypeEnum.LEADERSHIPPOLITICS]!=null&&skills[SkillTypeEnum.LEADERSHIPPOLITICS]>0){
            if(skills[SkillTypeEnum.LEADERSHIPPOLITICS]<amount){
                sendNarrationToPlayer(players[activePlayer].userId, 'Not a valid amount');
            }else{
                for(let i=0;i<amount;i++){
                    players[activePlayer].hand.push(drawCard(decks[DeckTypeEnum.LEADERSHIP]));
                }
                for(let i=0;i<skills[SkillTypeEnum.LEADERSHIPPOLITICS]-amount;i++){
                    players[activePlayer].hand.push(drawCard(decks[DeckTypeEnum.POLITICS]));
                }
                phase=GamePhaseEnum.MAIN_TURN;
                sendNarrationToAll(players[activePlayer].character.name + " picks " + amount + " Leadership and "+
                    (skills[SkillTypeEnum.LEADERSHIPPOLITICS]-amount)+" Politics",game.gameId);
            }
        }else if(skills[SkillTypeEnum.LEADERSHIPENGINEERING]!=null&&skills[SkillTypeEnum.LEADERSHIPENGINEERING]>0){
            if(skills[SkillTypeEnum.LEADERSHIPENGINEERING]<amount){
                sendNarrationToPlayer(players[activePlayer].userId, 'Not a valid amount');
            }else {
                for (let i = 0; i < amount; i++) {
                    players[activePlayer].hand.push(drawCard(decks[DeckTypeEnum.LEADERSHIP]));
                }
                for (let i = 0; i < skills[SkillTypeEnum.LEADERSHIPENGINEERING] - amount; i++) {
                    players[activePlayer].hand.push(drawCard(decks[DeckTypeEnum.ENGINEERING]));
                }
                phase=GamePhaseEnum.MAIN_TURN;
                sendNarrationToAll(players[activePlayer].character.name + " picks " + amount + " Leadership and " +
                    (skills[SkillTypeEnum.LEADERSHIPENGINEERING] - amount) + " Engineering",game.gameId);
            }
        }
    };

    let pickResearchCard=function(text){
		if(text==='0'){
            sendNarrationToAll(players[activePlayer].character.name + " draws an "+SkillTypeEnum.ENGINEERING+
                " skill card",game.gameId);
            players[activePlayer].hand.push(drawCard(decks[DeckTypeEnum.ENGINEERING]));
            phase=GamePhaseEnum.MAIN_TURN;
		}else if(text==='1'){
            sendNarrationToAll(players[activePlayer].character.name + " draws an "+SkillTypeEnum.TACTICS+" skill card",game.gameId);
            players[activePlayer].hand.push(drawCard(decks[DeckTypeEnum.TACTICS]));
            phase=GamePhaseEnum.MAIN_TURN;
		}else{
            sendNarrationToPlayer(players[activePlayer].userId, 'Not a valid amount');
        }
        return;
	};

    let pickLaunchLocation=function(text){
    	if(text!=='0'&&text!=='1'){
            sendNarrationToPlayer(players[activePlayer].userId, 'Not a valid amount');
			return;
        }

        let s = new Ship(ShipTypeEnum.VIPER);
    	s.pilot=activePlayer;

        if(text==='0'){
            sendNarrationToAll(players[activePlayer].character.name + " launches in a viper to the Southwest",game.gameId);
            players[activePlayer].viperLocation=SpaceEnum.SW;
            spaceAreas[SpaceEnum.SW].push(s);
        }else if(text==='1'){
            sendNarrationToAll(players[activePlayer].character.name + " launches in a viper to the Southeast",game.gameId);
            players[activePlayer].viperLocation=SpaceEnum.SE;
            spaceAreas[SpaceEnum.SE].push(s);
        }
        vipersInHangar--;

        if(phase===GamePhaseEnum.LADAMA_STARTING_LAUNCH) {
            activePlayer = currentPlayer;
            sendNarrationToAll("It's " + players[currentPlayer].character.name + "'s turn",game.gameId);
            addStartOfTurnCardsForPlayer(currentPlayer);
        }else{
            phase=GamePhaseEnum.MAIN_TURN;
        }

        return;
    };

    let revealCivilians = function(text){
        let input=text.split(" ");
        if(input.length!==2){
            sendNarrationToPlayer(players[activePlayer].userId, 'Invalid input');
            return;
        }
        let loc=SpaceEnum[input[0]];
        let num=parseInt(input[1]);
        if(loc==null || isNaN(num) || num<0 || num>=spaceAreas[loc].length){
            sendNarrationToPlayer(players[activePlayer].userId, 'Not a valid ship location');
            return;
        }else if(spaceAreas[loc][num].type!==ShipTypeEnum.CIVILIAN){
            sendNarrationToPlayer(players[activePlayer].userId, 'Not a civilian ship');
            return;
        }else if(spaceAreas[loc][num].activated){
            sendNarrationToPlayer(players[activePlayer].userId, 'Already revealed');
            return;
        }

        sendNarrationToPlayer(players[activePlayer].userId, 'Civilian ship type is '+spaceAreas[loc][num].resource);
        spaceAreas[loc][num].activated=true;
        civilianShipsToReveal--;
        if(civilianShipsToReveal===0){
            let count=countShips();
            if(count[ShipTypeEnum.CIVILIAN]===1){
                civilianShipsToReveal=1;
            }else{
                civilianShipsToReveal=2;
            }
            sendNarrationToPlayer(players[activePlayer].userId, ' Select the space location and number of the first revealed ship to move,' +
				' or \'done\' to skip moving ships');
            phase=GamePhaseEnum.MOVE_CIVILIANS;
            return;
		}

        sendNarrationToPlayer(players[activePlayer].userId, civilianShipsToReveal+" civilians to reveal. Select a space location and number");
        return;
	};

    let moveCivilians=function(text){
    	if(text.toUpperCase()==="DONE"){
            sendNarrationToPlayer(players[activePlayer].userId, 'Done moving ships');
            phase=GamePhaseEnum.MAIN_TURN;
            return;
		}
    	if(currentCivilianShipLocation!==-1){
            if(SpaceEnum[text]!=null){
                if(isAdjacentSpace(SpaceEnum[text],currentCivilianShipLocation[0])){
					let c = spaceAreas[currentCivilianShipLocation[0]][currentCivilianShipLocation[1]];
					c.activated=false;
					spaceAreas[currentCivilianShipLocation[0]].splice(currentCivilianShipLocation[1],1);
					spaceAreas[SpaceEnum[text]].push(c);
					sendNarrationToAll(players[activePlayer].character.name + " moves a civilian ship from "
						+currentCivilianShipLocation[0]
						+" to "+SpaceEnum[text],game.gameId);
					currentCivilianShipLocation=-1;
					civilianShipsToReveal--;
					if(civilianShipsToReveal===0){
						sendNarrationToPlayer(players[activePlayer].userId, 'Done moving ships');
						phase=GamePhaseEnum.MAIN_TURN;
					}else{
                        sendNarrationToPlayer(players[activePlayer].userId, civilianShipsToReveal+
							" civilians to move. Select a space location and number, or 'done' to skip moving ships");
                    }
					return;
                }else{
                    sendNarrationToPlayer(players[activePlayer].userId, 'Not an adjacent space');
                    return;
                }
            }else{
                sendNarrationToPlayer(players[activePlayer].userId, 'Invalid input');
                return;
            }
		}

        let input=text.split(" ");
        if(input.length!==2){
            sendNarrationToPlayer(players[activePlayer].userId, 'Invalid input');
            return;
        }
        let loc=SpaceEnum[input[0]];
        let num=parseInt(input[1]);
        if(loc==null || isNaN(num) || num<0 || num>=spaceAreas[loc].length){
            sendNarrationToPlayer(players[activePlayer].userId, 'Not a valid ship location');
            return;
        }else if(spaceAreas[loc][num].type!==ShipTypeEnum.CIVILIAN||!spaceAreas[loc][num].activated){
            sendNarrationToPlayer(players[activePlayer].userId, 'Not a revealed civilian ship to move');
            return;
        }

        sendNarrationToPlayer(players[activePlayer].userId, 'Choose a space location for this ship');
        currentCivilianShipLocation=[loc,num];
	};

    let chooseViper = function(text){
    	if(text.toUpperCase()==="DONE"){
    		sendNarrationToAll(players[activePlayer].character.name + " stops activating vipers",game.gameId);
            phase=GamePhaseEnum.MAIN_TURN;
            return;
    	}
        if(text==='SW'||text==='SE'){
            if(vipersInHangar===0){
                sendNarrationToPlayer(players[activePlayer].userId, 'No vipers left in reserve');
                return;
            }
            vipersInHangar--;
            vipersToActivate--;
            if(text==="SW"){
                sendNarrationToAll(players[activePlayer].character.name + " launches a viper to the SW",game.gameId);
                spaceAreas[SpaceEnum.SW].push(new Ship(ShipTypeEnum.VIPER));
            }else{
                sendNarrationToAll(players[activePlayer].character.name + " launches a viper to the SE",game.gameId);
                spaceAreas[SpaceEnum.SE].push(new Ship(ShipTypeEnum.VIPER));
            }
            if(vipersToActivate>0){
                sendNarrationToPlayer(players[activePlayer].userId, vipersToActivate+
                    ' viper(s) left to activate. Select a location to activate a viper');
                phase=GamePhaseEnum.CHOOSE_VIPER;
            }else{
                sendNarrationToPlayer(players[activePlayer].userId, "Done activating vipers");
                phase=GamePhaseEnum.MAIN_TURN;
            }
            return;
        }

        if(text.length<3){
            sendNarrationToPlayer(players[activePlayer].userId, 'Not a valid location');
            return;
        }

        let loc=text.split(" ")[0];
        let num=text.split(" ")[1];

        if(loc==null||SpaceEnum[loc]==null||isNaN(num)||num<0||num>spaceAreas[SpaceEnum[loc]].length){
            sendNarrationToPlayer(players[activePlayer].userId, 'Not a valid location');
            return;
		}
        if(spaceAreas[SpaceEnum[loc]][num].type===ShipTypeEnum.VIPER&&spaceAreas[SpaceEnum[loc]][num].pilot===-1){
            currentViperLocation=SpaceEnum[loc];
            phase=GamePhaseEnum.ACTIVATE_VIPER;
            sendNarrationToPlayer(players[activePlayer].userId, 'Choose an action for this viper');
            return;
        }

		sendNarrationToPlayer(players[activePlayer].userId, 'Not an unmanned viper');
		return;
	};
	
	let runMaximumFirepower = function(text){
		if(text.toUpperCase()==="DONE"){
			sendNarrationToAll(players[activePlayer].character.name+" stops attacking",game.gameId);
			maximumFirepower=0;
			phase=GamePhaseEnum.MAIN_TURN;
			return;
		}
		let currentViperLocation=players[activePlayer].viperLocation;
		if(currentViperLocation===-1){
			return false;
		}
		let num=parseInt(text.substr(2));
		if(isNaN(num) || num<0 || num>=spaceAreas[currentViperLocation].length){
			sendNarrationToPlayer(players[activePlayer].userId, 'Not a valid location');
			return;
		}
		game.attackCylonShip(currentViperLocation,num,false);
		return;
	};

	let activateViper = function(text){
        if(SpaceEnum[text]!=null){
			if(isAdjacentSpace(SpaceEnum[text],currentViperLocation)){
                for(let i=0;i<spaceAreas[currentViperLocation].length;i++){
                    if(spaceAreas[currentViperLocation][i].type===
                        ShipTypeEnum.VIPER&&spaceAreas[currentViperLocation][i].pilot===-1){
                    	console.log("viper found in area");
                        let v = spaceAreas[currentViperLocation][i];
                        spaceAreas[currentViperLocation].splice(i,1);
                        spaceAreas[SpaceEnum[text]].push(v);
                        sendNarrationToAll(players[activePlayer].character.name + " moves an unmanned viper from "
                            +currentViperLocation
                            +" to "+SpaceEnum[text],game.gameId);
                        currentViperLocation=-1;
                        vipersToActivate--;
                        break;
                    }
                    console.log("viper not found in area");
                }
			}else{
                sendNarrationToPlayer(players[activePlayer].userId, 'Not an adjacent space');
				return;
            }
        }else{
            let num=parseInt(text.substr(2));
            if(isNaN(num) || num<0 || num>=spaceAreas[currentViperLocation].length){
                sendNarrationToPlayer(players[activePlayer].userId, 'Not a valid location');
                return;
            }
            game.attackCylonShip(currentViperLocation,num,false);
            return;
        }
        postActivateViper();
        return;
	};

	let postActivateViper = function(){
        if(vipersToActivate>0){
            sendNarrationToPlayer(players[activePlayer].userId, vipersToActivate+
                ' viper(s) left to activate. Select a location to activate a viper, or \"done\" to stop');
            phase=GamePhaseEnum.CHOOSE_VIPER;
        }else{
            sendNarrationToPlayer(players[activePlayer].userId, "Done activating vipers");
            phase=GamePhaseEnum.MAIN_TURN;
        }
    };

	let attackCenturion=function(text){
        let num=parseInt(text.substr(10));
        if(isNaN(num) || num<0 || num>=centurionTrack.length){
            sendNarrationToPlayer(players[activePlayer].userId, 'Not a valid location');
            return;
        }else if(centurionTrack[num]===0){
            sendNarrationToPlayer(players[activePlayer].userId, 'No centurions there');
            return;
		}

        let finalRoll=0;
        if(game.getActiveRoll()==null) {
            game.afterRoll = game => {
                let roll = game.roll;
                finalRoll=roll;
                attackCenturion(text);
                phase = GamePhaseEnum.MAIN_TURN;
                game.doPostAction();
            };
            if(phase===GamePhaseEnum.ATTACK_CENTURION){
                addToActionPoints(-1);
            }
            sendNarrationToAll(players[activePlayer].character.name + " attacks the centurion at " + num, game.gameId);
            game.setUpRoll(8, WhoEnum.ACTIVE, 'attacking the centurion at '+num);
            return false;
        }else{
            finalRoll=game.roll;
        }

        if(finalRoll>=CENTURION_DESTROYED_MINIMUM_ROLL){
            sendNarrationToAll(players[activePlayer].character.name + " kills a centurion!",game.gameId);
            centurionTrack[num]--;
        }else{
            sendNarrationToAll(players[activePlayer].character.name + " didn't kill the centurion",game.gameId);
		}
        phase=GamePhaseEnum.MAIN_TURN;
        return;
	};

	this.attackCylonShip=function(loc, num, isAttackerGalactica){
        console.log("in attack cylon ship");

        let ship=spaceAreas[loc][num];
        if(ship.type===ShipTypeEnum.VIPER||ship.type===ShipTypeEnum.CIVILIAN){
            sendNarrationToPlayer(players[activePlayer].userId, 'Can\'t attack a human ship!');
            return false;
        }
        let attackerName=players[activePlayer].character.name;
        /*if(!isAttackerGalactica){
            attackerName="Viper";
        }*/

        let finalRoll=0;
        if(game.roll==null||game.roll===-1) {
            game.afterRoll = game => {
                let roll = game.roll;
                finalRoll=roll;
                game.attackCylonShip(loc, num, isAttackerGalactica);
                game.doPostAction();
            };
            if(phase===GamePhaseEnum.WEAPONS_ATTACK){
                addToActionPoints(-1);
            }
            sendNarrationToAll(attackerName + " attacks the " + ship.type + " at " + loc, game.gameId);
            game.setUpRoll(8, WhoEnum.ACTIVE, 'attacking the '+ship.type+' at '+loc+' '+(isAttackerGalactica?'with Galactica\'s weapons':"with a viper"));
            return false;
        }else{
            finalRoll=game.roll;
        }

        if(inPlay.indexOf(InPlayEnum.AMBUSH)!==-1&&!isAttackerGalactica){ //TO FIX: Don't reduce roll for piloted vipers
            finalRoll-=2;
            sendNarrationToAll("Viper gets -2 because of training new pilots!",game.gameId);
            return;
        }
        console.log("about to do ship calculations");

        if(ship.type===ShipTypeEnum.RAIDER) {
            if (finalRoll>=RAIDER_DESTROYED_MINIMUM_ROLL) {
                sendNarrationToAll(attackerName + " destroys the raider!",game.gameId);
                spaceAreas[loc].splice(num,1);
            } else {
                sendNarrationToAll(attackerName + " tries to attack the raider and misses",game.gameId);
            }
        }else if(ship.type===ShipTypeEnum.HEAVY_RAIDER) {
            if (finalRoll>=HEAVY_RAIDER_DESTROYED_MINIMUM_ROLL) {
                sendNarrationToAll(attackerName + " destroys the heavy raider!",game.gameId);
                spaceAreas[loc].splice(num,1);
            } else {
                sendNarrationToAll(attackerName + " tries to attack the heavy raider and misses",game.gameId);
            }
        }else if(ship.type===ShipTypeEnum.BASESTAR) {
            if(ship.damage[0]==BasestarDamageTypeEnum.STRUCTURAL||
                ship.damage[1]==BasestarDamageTypeEnum.STRUCTURAL){
                finalRoll+=2;
                sendNarrationToAll("Roll upgraded to "+finalRoll+" by basestar structural damage",game.gameId);
            }
            if((isAttackerGalactica&&finalRoll>=GALACTICA_DAMAGES_BASESTAR_MINIMUM_ROLL)
                ||finalRoll>=VIPER_DAMAGES_BASESTAR_MINIMUM_ROLL){
                damageBasestar(loc,num);
            }else{
                sendNarrationToAll(attackerName + " tries to attack the basestar and misses",game.gameId);
            }
        }
        if(phase===GamePhaseEnum.ACTIVATE_VIPER){
            vipersToActivate--;
            postActivateViper();
        }else if(phase===GamePhaseEnum.WEAPONS_ATTACK){
            phase = GamePhaseEnum.MAIN_TURN;
            game.doPostAction();
        }else if(phase===GamePhaseEnum.MAXIMUM_FIREPOWER){
        	maximumFirepower--;
        	if(maximumFirepower===0){
        		sendNarrationToPlayer(players[activePlayer].userId, "No more attacks left");
				phase = GamePhaseEnum.MAIN_TURN;
				game.doPostAction();
            }else{
            	sendNarrationToPlayer(players[activePlayer].userId, "You have "+maximumFirepower+" attacks left");
            }
        }else if(phase===GamePhaseEnum.MAIN_TURN&&players[activePlayer].viperLocation!==-1){
            addToActionPoints(-1);
            game.doPostAction();
        }
        return true;
	};

    let weaponsAttack=function(text){
        console.log("in weapons attack");

        let input=text.split(" ");
    	if(input.length!==2){
            sendNarrationToPlayer(players[activePlayer].userId, 'Invalid input');
            return;
        }
    	let loc=SpaceEnum[input[0]];
        let num=parseInt(input[1]);
        if(loc==null || isNaN(num) || num<0 || num>=spaceAreas[loc].length){
            sendNarrationToPlayer(players[activePlayer].userId, 'Not a valid ship location');
            return;
        }
        if(game.attackCylonShip(loc,num,true)) {
            console.log("attackcylon returned true");

            addToActionPoints(-1);
            phase = GamePhaseEnum.MAIN_TURN;
        }
        return;
    };

	let isAdjacentSpace = (space1,space2) =>
			(space1===SpaceEnum.NE&&(space2===SpaceEnum.NW||space2===SpaceEnum.E))||
            (space1===SpaceEnum.E&&(space2===SpaceEnum.NE||space2===SpaceEnum.SE))||
            (space1===SpaceEnum.SE&&(space2===SpaceEnum.E||space2===SpaceEnum.SW))||
            (space1===SpaceEnum.SW&&(space2===SpaceEnum.SE||space2===SpaceEnum.W))||
            (space1===SpaceEnum.W&&(space2===SpaceEnum.SW||space2===SpaceEnum.NW))||
            (space1===SpaceEnum.NW&&(space2===SpaceEnum.W||space2===SpaceEnum.NE));

	let damageBasestar=function(loc,num){
		let basestar=spaceAreas[loc][num];
		if(basestar.damage[1]!==-1||basestar.damage[0]===BasestarDamageTypeEnum.CRITICAL) {
            destroyBasestar(loc,num);
            return;
        }

        let damageType=drawCard(decks[DeckTypeEnum.BASESTAR_DAMAGE]);
        sendNarrationToAll(players[activePlayer].character.name + " hits the basestar!",game.gameId);
        sendNarrationToAll("The basestar has taken "+damageType+" damage!",game.gameId);
        if(basestar.damage[0]===-1){
            basestar.damage[0]=damageType;
		}else{
            basestar.damage[1]=damageType;
            if(damageType===BasestarDamageTypeEnum.CRITICAL){
                destroyBasestar(loc,num);
                return;
			}
		}
	};

	let destroyBasestar=function(loc,num){
        let basestar=spaceAreas[loc][num];
        sendNarrationToAll("The basestar is destroyed!",game.gameId);
        if(basestar.damage[0]!==-1) decks[DeckTypeEnum.BASESTAR_DAMAGE].deck.push(basestar.damage[0]);
        if(basestar.damage[1]!==-1) decks[DeckTypeEnum.BASESTAR_DAMAGE].deck.push(basestar.damage[1]);
        shuffle(decks[DeckTypeEnum.BASESTAR_DAMAGE].deck);
        spaceAreas[loc].splice(num, 1);
        return;
	};
	
	this.returnVipersToHangar = function(){
		for(let s in SpaceEnum){
            for(let i=0;i<spaceAreas[SpaceEnum[s]].length;i++) {
                if (spaceAreas[SpaceEnum[s]][i].type === ShipTypeEnum.VIPER) {
                    if(spaceAreas[SpaceEnum[s]][i].pilot!==-1){
                        players[spaceAreas[SpaceEnum[s]][0].pilot].viperLocation=-1;
                    }
                    spaceAreas[SpaceEnum[s]].splice(0,1);
                    vipersInHangar++;
                    i--;
                }
            }
        }
	};

    let nextActive=function(){
        activePlayer++;
        if(activePlayer>=players.length){
            activePlayer=0;
        }
    };
    this.nextActive = nextActive;
	
    this.jump = function(){
    	jump();	
    };
    let jump = () => {
        lastPhase = phase;
        jumpTrack = jumpTrack > 5 ? 1 : 0; //if jumptrack was overshot from network computers

        for(let s in SpaceEnum){
            let numShips=spaceAreas[SpaceEnum[s]].length;
            for(let i=0;i<numShips;i++) {
                if (spaceAreas[SpaceEnum[s]][0].type === ShipTypeEnum.VIPER) {
                    if(spaceAreas[SpaceEnum[s]][0].pilot!==-1){
                        players[spaceAreas[SpaceEnum[s]][0].pilot].viperLocation=-1;
                    }
                    vipersInHangar++;
                }else if (spaceAreas[SpaceEnum[s]][0].type === ShipTypeEnum.BASESTAR) {
                    let basestar=spaceAreas[SpaceEnum[s]][0];
                    if(basestar.damage[0]!==-1) decks[DeckTypeEnum.BASESTAR_DAMAGE].deck.push(basestar.damage[0]);
                    if(basestar.damage[1]!==-1) decks[DeckTypeEnum.BASESTAR_DAMAGE].deck.push(basestar.damage[1]);
                    shuffle(decks[DeckTypeEnum.BASESTAR_DAMAGE].deck);
                }
                spaceAreas[SpaceEnum[s]].splice(0,1);
            }
        }

        let cardOne = drawCard(decks[DeckTypeEnum.DESTINATION]);
        let cardTwo = drawCard(decks[DeckTypeEnum.DESTINATION]);

        activeDestinations=[cardOne,cardTwo];

        if (currentMissionSpecialist !== -1) {
            currentMissionSpecialist = -1;
            decks[DeckTypeEnum.QUORUM].discard.push(new Card(CardTypeEnum.QUORUM, 'ASSIGN_MISSION_SPECIALIST', SetEnum.BASE));
        }

        for(let i=0;i<players.length;i++){
            sendGameState(i);
        }

        this.choose({
            who : currentMissionSpecialist === -1 ? WhoEnum.ADMIRAL : currentMissionSpecialist,
            text : `${readCard(cardOne).name}: ${readCard(cardOne).text} (-OR-) ${
                readCard(cardTwo).name}: ${readCard(cardTwo).text}`,
            private : `IMPORTANT CONFIDENTIAL DOCUMENTS`,
            options: game => [readCard(cardOne).name,readCard(cardTwo).name],
            choice1 : game => {
                activeDestinations=[cardOne];
                decks[DeckTypeEnum.DESTINATION].deck.splice(0, 0, cardTwo);
                playDestination(cardOne);
            },
            choice2 : game => {
                activeDestinations=[cardTwo];
                decks[DeckTypeEnum.DESTINATION].deck.splice(0, 0, cardOne);
                playDestination(cardTwo);
            },
        });
    };
    
	let nextTurn=function(){
        console.log("in next turn");

        phase = GamePhaseEnum.END_TURN;

        if (jumpTrack >= 5) {
            jump();
            return;
        }

        activeCrisis=null;

        let handMax=MAX_HAND_SIZE;
        if(players[currentPlayer].character.name===base.CharacterMap.TYROL.name){
            handMax-=2;
        }else if(players[currentPlayer].character.name===base.CharacterMap.TIGH.name&&players[currentPlayer].hand.length===1){
            sendNarrationToAll(players[currentPlayer].character.name+" is drunk and must discard a card!",gameId);
            handMax=0;
        }
        if(players[currentPlayer].hand.length>handMax){
            sendNarrationToAll(players[currentPlayer].character.name+" needs to discard",gameId);
            game.nextAction = next => {
                next.nextAction=null;
                next.nextTurn();
            };
            game.singlePlayerDiscards(WhoEnum.CURRENT, players[currentPlayer].hand.length-handMax);
            return;
        }

		currentPlayer++;
		
		if(currentPlayer>=players.length){
			currentPlayer=0;
		}
		
		activePlayer=currentPlayer;
		currentMovementRemaining=1;
		activeMovementRemaining=1;
		currentActionsRemaining=1;
		activeActionsRemaining=1;
		activeRoll=null;
        activeRollNarration=null;
        strategicPlanning = false;

        if(players[currentPlayer].character.name===base.CharacterMap.THRACE.name&&players[currentPlayer].viperLocation!==-1){
            currentActionsRemaining+=1;
            activeActionsRemaining+=1;
            sendNarrationToPlayer(players[currentPlayer].userId, 'You get an extra action as an expert pilot');
        }
        addStartOfTurnCardsForPlayer(currentPlayer);

        sendNarrationToAll("It's "+players[currentPlayer].character.name+"'s turn",game.gameId);
	};
	this.nextTurn = nextTurn;
	
	let addStartOfTurnCardsForPlayer=function(player){
	    if(players[currentPlayer].location===LocationEnum.SICKBAY){
            base.LocationMap.SICKBAY.action(game);
            return;
        }else if(players[currentPlayer].isRevealedCylon){
            game.setUpPlayerSkillDraw(game.getCurrentPlayer(),2);
            game.choose({
				who : WhoEnum.CURRENT,
				text : 'Choose skill card to draw',
				options: (game) => {
					return game.getSkillCardTypeNamesForPlayer(game.getCurrentPlayer());
				},
				other : (game, num) => {
					game.drawPlayerSkillCard(game.getCurrentPlayer(),num);
					if(game.skillCardsToDraw>0){
						game.choose({
							who : WhoEnum.CURRENT,
							text : 'Choose skill card to draw',
							options: (next) => {
								return next.getSkillCardTypeNamesForPlayer(next.getCurrentPlayer());
							},
							other : (next, num) => {
								next.drawPlayerSkillCard(game.getCurrentPlayer(),num);
								next.setPhase(GamePhaseEnum.MAIN_TURN);
							}
						});
					}else{
						game.setPhase(GamePhaseEnum.MAIN_TURN);
					}
				}
			});
            return;
        }

		let skills=players[player].character.skills;

		for(let type in SkillTypeEnum){
			if(skills[SkillTypeEnum[type]]==null||SkillTypeEnum[type]===SkillTypeEnum.LEADERSHIPENGINEERING
                || SkillTypeEnum[type]===SkillTypeEnum.LEADERSHIPPOLITICS){
				continue;
			}
			for(let i=0;i<skills[SkillTypeEnum[type]];i++) {
                players[player].hand.push(drawCard(decks[DeckTypeEnum[type]]));
            }
		}

		let hasHybridSkill=false;
        if(skills[SkillTypeEnum.LEADERSHIPPOLITICS]!=null&&skills[SkillTypeEnum.LEADERSHIPPOLITICS]>0){
        	game.skillCardsToDraw=skills[SkillTypeEnum.LEADERSHIPPOLITICS];
        	game.skillCardsLeft=[skills[SkillTypeEnum.LEADERSHIPPOLITICS],skills[SkillTypeEnum.LEADERSHIPPOLITICS],0,0,0];
        	game.skillCardsOptions=["Leadership","Politics"];
        	hasHybridSkill=true;
		}else if(skills[SkillTypeEnum.LEADERSHIPENGINEERING]!=null&&skills[SkillTypeEnum.LEADERSHIPENGINEERING]>0){
			game.skillCardsToDraw=skills[SkillTypeEnum.LEADERSHIPENGINEERING];
        	game.skillCardsLeft=[0,skills[SkillTypeEnum.LEADERSHIPENGINEERING],0,0,skills[SkillTypeEnum.LEADERSHIPENGINEERING]];
        	game.skillCardsOptions=["Leadership","Engineering"];
        	hasHybridSkill=true;
        }else{
			phase=GamePhaseEnum.MAIN_TURN;
		}
		
		if(hasHybridSkill){
			game.choose({
				who : WhoEnum.CURRENT,
				text : 'Choose skill card to draw',
				options: (game) => {
					return game.skillCardsOptions;
				},
				other : (game, num) => {
					game.drawPlayerSkillCard(game.getCurrentPlayer(),num);
					if(game.skillCardsToDraw>0){
						game.choose({
							who : WhoEnum.CURRENT,
							text : 'Choose skill card to draw',
							options: (next) => {
								let options=[];
								if(game.skillCardsLeft[1]>0){
									options.push("Leadership");
								}
								if(game.skillCardsLeft[0]>0){
									options.push("Politics");
								}
								if(game.skillCardsLeft[4]>0){
									options.push("Engineering");
								}
								return options;
							},
							other : (next, num) => {
								next.drawPlayerSkillCard(game.getCurrentPlayer(),num);
								next.setPhase(GamePhaseEnum.MAIN_TURN);
							}
						});
					}else{
						game.setPhase(GamePhaseEnum.MAIN_TURN);
					}
				}
			});
            return;
		}
	};

	this.setInPlay = function(card){
		this.getInPlay().push(card);
	};
	
	this.setUpPlayerSkillDraw = function(player,num){
		this.skillCardsToDraw=num;
		this.skillCardsLeft=[0,0,0,0,0];
		let skills=this.getPlayers()[player].character.skills;
		for(let type in SkillTypeEnum){
			if(skills[SkillTypeEnum[type]]!=null&&
				SkillTypeEnum[type]!==SkillTypeEnum.LEADERSHIPPOLITICS&&
				SkillTypeEnum[type]!==SkillTypeEnum.LEADERSHIPENGINEERING){
				console.log("type:"+skills[SkillTypeEnum[type]]);
				switch(SkillTypeEnum[type]){
					case SkillTypeEnum.POLITICS:
						this.skillCardsLeft[0]+=skills[SkillTypeEnum[type]];
						break;
					case SkillTypeEnum.LEADERSHIP:
						this.skillCardsLeft[1]+=skills[SkillTypeEnum[type]];
						break;
					case SkillTypeEnum.TACTICS:
						this.skillCardsLeft[2]+=skills[SkillTypeEnum[type]];
						break;
					case SkillTypeEnum.PILOTING:
						this.skillCardsLeft[3]+=skills[SkillTypeEnum[type]];
						break;
					case SkillTypeEnum.ENGINEERING:
						this.skillCardsLeft[4]+=skills[SkillTypeEnum[type]];
						break;
					default:
						break;
				}
			}else if(skills[SkillTypeEnum[type]]!=null&&
				SkillTypeEnum[type]===SkillTypeEnum.LEADERSHIPPOLITICS){
				this.skillCardsLeft[0]+=skills[SkillTypeEnum.LEADERSHIPPOLITICS];
				this.skillCardsLeft[1]+=skills[SkillTypeEnum.LEADERSHIPPOLITICS];
			}else if(skills[SkillTypeEnum[type]]!=null&&
				SkillTypeEnum[type]===SkillTypeEnum.LEADERSHIPENGINEERING){
				this.skillCardsLeft[1]+=skills[SkillTypeEnum.LEADERSHIPENGINEERING];
				this.skillCardsLeft[4]+=skills[SkillTypeEnum.LEADERSHIPENGINEERING];			
			}
		}
	};
	
	this.drawPlayerSkillCard = function(player,num){
		let currentNum=0;
		let skills=game.getPlayers()[player].character.skills;
		let cardTypeDrawn=null;
		for(let type in SkillTypeEnum){
			switch(SkillTypeEnum[type]){
				case SkillTypeEnum.POLITICS:
					if(this.skillCardsLeft[0]===0){
						continue;
					}
					break;
				case SkillTypeEnum.LEADERSHIP:
					if(this.skillCardsLeft[1]===0){
						continue;
					}
					break;
				case SkillTypeEnum.TACTICS:
					if(this.skillCardsLeft[2]===0){
						continue;
					}
					break;
				case SkillTypeEnum.PILOTING:
					if(this.skillCardsLeft[3]===0){
						continue;
					}
					break;
				case SkillTypeEnum.ENGINEERING:
					if(this.skillCardsLeft[4]===0){
						continue;
					}
					break;
				case SkillTypeEnum.LEADERSHIPENGINEERING:
					if(this.skillCardsLeft[1]===0&&this.skillCardsLeft[4]===0){
						continue;
					}
					break;
				case SkillTypeEnum.LEADERSHIPPOLITICS:
					if(this.skillCardsLeft[1]===0&&this.skillCardsLeft[0]===0){
						continue;
					}
					break;
				default:
					break;
			}
			if(skills[SkillTypeEnum[type]]!=null){
				if(SkillTypeEnum[type]===SkillTypeEnum.LEADERSHIPENGINEERING){
					if(currentNum===num){
						if(this.skillCardsLeft[1]>0){
							cardTypeDrawn=DeckTypeEnum.LEADERSHIP;
						}else{
							cardTypeDrawn=DeckTypeEnum.ENGINEERING;
						}
						this.skillCardsLeft[1]--;
						this.skillCardsLeft[4]--;
						break;
					}
					currentNum++;
					if(currentNum===num){
						cardTypeDrawn=DeckTypeEnum.ENGINEERING;
						this.skillCardsLeft[4]--;
						break;
					}
				}else if(SkillTypeEnum[type]===SkillTypeEnum.LEADERSHIPPOLITICS){
					if(currentNum===num){
						if(this.skillCardsLeft[1]>0){
							cardTypeDrawn=DeckTypeEnum.LEADERSHIP;
						}else{
							cardTypeDrawn=DeckTypeEnum.POLITICS;
						}
						this.skillCardsLeft[0]--;
						this.skillCardsLeft[1]--;
						break;
					}
					currentNum++;
					if(currentNum===num){
						cardTypeDrawn=DeckTypeEnum.POLITICS;
						this.skillCardsLeft[0]--;
						break;
					}
				}else{
					if(currentNum===num){
						cardTypeDrawn=DeckTypeEnum[type];
						switch(SkillTypeEnum[type]){
							case SkillTypeEnum.POLITICS:
								this.skillCardsLeft[0]--;
								break;
							case SkillTypeEnum.LEADERSHIP:
								this.skillCardsLeft[1]--;
								break;
							case SkillTypeEnum.TACTICS:
								this.skillCardsLeft[2]--;
								break;
							case SkillTypeEnum.PILOTING:
								this.skillCardsLeft[3]--;
								break;
							case SkillTypeEnum.ENGINEERING:
								this.skillCardsLeft[4]--;
								break;
							default:
								break;
						}
						break;
					}
				}
				currentNum++;
			}
		}
		game.narrateAll(game.getPlayers()[player].character.name+" draws "+cardTypeDrawn);
		game.getPlayers()[player].hand.push(game.drawCard(game.getDecks()[cardTypeDrawn]));	
		this.skillCardsToDraw--;
	};

    let drawCard = function(deck){
    	if(deck.deck.length===0){
    		if(deck.discard==null||deck.discard.length===0){
    			return null;
			}
    		console.log("reshuffling "+deck.deck);
    		while(deck.discard.length>0){
    			deck.deck.push(deck.discard.pop());
			}
			shuffle(deck.deck);
		}
		return deck.deck.pop();
	};
    this.drawCard = drawCard;

    let buildDestiny =  function(){
        let deck=decks[DeckTypeEnum.DESTINY].deck;
        deck.push(drawCard(decks[DeckTypeEnum.POLITICS]));
        deck.push(drawCard(decks[DeckTypeEnum.POLITICS]));
        deck.push(drawCard(decks[DeckTypeEnum.LEADERSHIP]));
        deck.push(drawCard(decks[DeckTypeEnum.LEADERSHIP]));
        deck.push(drawCard(decks[DeckTypeEnum.TACTICS]));
        deck.push(drawCard(decks[DeckTypeEnum.TACTICS]));
        deck.push(drawCard(decks[DeckTypeEnum.PILOTING]));
        deck.push(drawCard(decks[DeckTypeEnum.PILOTING]));
        deck.push(drawCard(decks[DeckTypeEnum.ENGINEERING]));
        deck.push(drawCard(decks[DeckTypeEnum.ENGINEERING]));
        shuffle(deck);
	};

    let drawDestiny = function(){
    	let deck=decks[DeckTypeEnum.DESTINY].deck;
        if(deck.length===0){
			buildDestiny();
        }
        return deck.pop();
    };

    let getPlayerNumberById = function(userId){
    	for(let i=0;i<players.length;i++){
    		if(players[i].userId===userId) {
				return i;
            }
		}
		return -1;
	};

	let isLocationOnColonialOne=function(location){
    	return location === LocationEnum.PRESS_ROOM || location === LocationEnum.PRESIDENTS_OFFICE ||
            location === LocationEnum.ADMINISTRATION;
	};

    let isLocationCylon=function(location){
        return location === LocationEnum.CAPRICA || location === LocationEnum.CYLON_FLEET ||
            location === LocationEnum.HUMAN_FLEET || location === LocationEnum.RESURRECTION_SHIP;
    };

    let isLocationOnGalactica=function(location){
    	return !isLocationOnColonialOne() && !isLocationCylon();
	};

	let addToActionPoints=function(num){
		if(num<0){ //Need to stop movement step after doing an action, so this should work for now
			activeMovementRemaining=0;
		}
		activeActionsRemaining+=num;

        if(activePlayer===currentPlayer){
        	if(num<0){
        		currentMovementRemaining=0;
        	}
			currentActionsRemaining+=num;
		}
	};
	
	let addToActiveActionPoints=function(num){
		if(num<0){ //Need to stop movement step after doing an action, so this should work for now
			activeMovementRemaining=0;
		}
		activeActionsRemaining+=num;
	};
	
	let addToActiveMovementPoints=function(num){
		activeMovementRemaining+=num;
	};

	this.addToFTL=function(num){
        jumpTrack+=num;
        if(jumpTrack<0){
        	jumpTrack=0;
		}
    };

    this.addCenturion=function(loc,num){
        centurionTrack[loc]+=num;
        if(centurionTrack[loc]<0){
        	centurionTrack[loc]=0;
		}
    };

	let doCrisisStep=function(){
		console.log("starting crisis step");
		let crisisCard=drawCard(decks[DeckTypeEnum.CRISIS]);
		console.log(readCard(crisisCard));
		if(players[activePlayer].character.name===base.CharacterMap.BALTAR.name){
			sendNarrationToAll(base.CharacterMap.BALTAR.name+" draws a card from delusional intuition",game.gameId);
			game.choose({
				who : WhoEnum.ACTIVE,
				text : `choose a skill card: 'politics', 'leadership', 'tactics', 'piloting' or 'engineering'.`,
				options: (next) => {
					return next.getSkillCardTypeNamesForPlayer(null);
				},
				other : (game, text) => {
					let type = 'error';
					switch (text) {
						case 0 : type = DeckTypeEnum.POLITICS; break;
						case 1 : type = DeckTypeEnum.LEADERSHIP; break;
						case 2 : type = DeckTypeEnum.TACTICS; break;
						case 3 : type = DeckTypeEnum.PILOTING; break;
						case 4 : type = DeckTypeEnum.ENGINEERING; break;
						default :
							break;
					}
					game.narrateAll(game.getPlayers()[game.getActivePlayer()].character.name + " draws a "+type+" skill card");
					game.getPlayers()[game.getActivePlayer()].hand.push(game.drawCard(game.getDecks()[type]));
					game.playCrisis(crisisCard);
				},
			});	
			activeCrisis = crisisCard;
			decks[DeckTypeEnum.CRISIS].discard.push(crisisCard);
			return;
		}
		playCrisis(crisisCard);
        decks[DeckTypeEnum.CRISIS].discard.push(crisisCard);
    };

	let destroyCivilianShip = function(loc,num){
        sendNarrationToAll("Civilian ship destoyed!",game.gameId);
        let ship=null;
        if(loc===-1){
            ship=new Ship(ShipTypeEnum.CIVILIAN);
            ship.resource=drawCard(decks[DeckTypeEnum.CIV_SHIP]);
		}else{
            ship=spaceAreas[loc][num];
            spaceAreas[loc].splice(num,1);
        }
        switch(ship.resource){
			case CivilianShipTypeEnum.ONE_POPULATION:
                sendNarrationToAll("One population lost!",game.gameId);
                populationAmount--;
                break;
            case CivilianShipTypeEnum.TWO_POPULATION:
                sendNarrationToAll("Two population lost!",game.gameId);
                populationAmount-=2;
                break;
            case CivilianShipTypeEnum.POPULATION_FUEL:
                sendNarrationToAll("Population and fuel lost!",game.gameId);
                populationAmount--;
                fuelAmount--;
                break;
            case CivilianShipTypeEnum.POPULATION_MORALE:
                sendNarrationToAll("Population and morale lost!",game.gameId);
                populationAmount--;
                moraleAmount--;
                break;
            case CivilianShipTypeEnum.NOTHING:
                sendNarrationToAll("Luckily not much was in the ship",game.gameId);
                break;
			default:
				break;
		}
	};
	
	this.damageVipersInHangar = function(num){
		if(num>vipersInHangar){
			num=vipersInHangar;
		}
		vipersInHangar-=num;
		damagedVipers+=num;
	};
	
    this.addRaptor = function(num){
    	raptorsInHangar+=num;
    	if(raptorsInHangar<0){
            raptorsInHangar=0;
		}else if(raptorsInHangar>NUMBER_OF_RAPTORS){
            raptorsInHangar=NUMBER_OF_RAPTORS;
		}
    };

	let activateRaider=function(loc,num){ //Returns true if raider moved or ship destroyed
		if(spaceAreas[loc][num].activated){
			return false;
		}
		spaceAreas[loc][num].activated=true;

        for(let i=0;i<spaceAreas[loc].length;i++) {
            if (spaceAreas[loc][i].type === ShipTypeEnum.VIPER&&spaceAreas[loc][i].pilot === -1) {
                sendNarrationToAll("Cylon raider attacks a viper",game.gameId);
                let roll = rollDie();
                game.setActiveRoll(roll);
                sendNarrationToAll("Cylon raider rolls a " + roll,game.gameId);
                if (roll >= VIPER_DESTROYED_MINIMUM_ROLL) {
                    sendNarrationToAll("Critical hit, the viper is destroyed!",game.gameId);
                    spaceAreas[loc].splice(i,1);
                    return true;
                } else if (roll >= VIPER_DAMAGED_MINIMUM_ROLL) {
                    sendNarrationToAll("The viper is damaged",game.gameId);
                    spaceAreas[loc].splice(i,1);
                    damagedVipers++;
                    return true;
                } else {
                    sendNarrationToAll("The raider misses!",game.gameId);
                    return false;
                }
            }
        }

        for(let i=0;i<spaceAreas[loc].length;i++) {
            if (spaceAreas[loc][i].type === ShipTypeEnum.VIPER&&spaceAreas[loc][i].pilot !== -1) {
                sendNarrationToAll("Cylon raider attacks viper piloted by "
                    +players[spaceAreas[loc][i].pilot].character.name+"!",game.gameId);
                let roll = rollDie();
                game.setActiveRoll(roll);
                sendNarrationToAll("Cylon raider rolls a " + roll,game.gameId);
                if (roll >= VIPER_DESTROYED_MINIMUM_ROLL) {
                    sendNarrationToAll("Critical hit, the viper is destroyed!",game.gameId);
                    players[spaceAreas[loc][i].pilot].viperLocation=-1;
                    players[spaceAreas[loc][i].pilot].location=LocationEnum.SICKBAY;
                    sendNarrationToAll(players[spaceAreas[loc][i].pilot].character.name+" is sent to Sickbay!",game.gameId);
                    spaceAreas[loc].splice(i,1);
                    return true;
                } else if (roll >= VIPER_DAMAGED_MINIMUM_ROLL) {
                    sendNarrationToAll("The viper is damaged",game.gameId);
                    players[spaceAreas[loc][i].pilot].viperLocation=-1;
                    players[spaceAreas[loc][i].pilot].location=LocationEnum.SICKBAY;
                    sendNarrationToAll(players[spaceAreas[loc][i].pilot].character.name+" is sent to Sickbay!",game.gameId);
                    spaceAreas[loc].splice(i,1);
                    damagedVipers++;
                    return true;
                } else {
                    sendNarrationToAll("The raider misses!",game.gameId);
                    return false;
                }
            }
        }

        for(let i=0;i<spaceAreas[loc].length;i++) {
            if (spaceAreas[loc][i].type === ShipTypeEnum.CIVILIAN) {
                sendNarrationToAll("Cylon raider attacks a civilian ship!",game.gameId);
				destroyCivilianShip(loc,i);
				return true;
            }
        }

		let closestPath=[];
		switch(loc){
			case SpaceEnum.NE:
                closestPath=[SpaceEnum.E,SpaceEnum.NW,SpaceEnum.SE,SpaceEnum.W,SpaceEnum.SW];
				break;
            case SpaceEnum.E:
                closestPath=[SpaceEnum.SE,SpaceEnum.NE,SpaceEnum.SW,SpaceEnum.NW,SpaceEnum.W];
                break;
            case SpaceEnum.SE:
                closestPath=[SpaceEnum.SW,SpaceEnum.E,SpaceEnum.W,SpaceEnum.NE,SpaceEnum.NW];
                break;
            case SpaceEnum.SW:
                closestPath=[SpaceEnum.W,SpaceEnum.SE,SpaceEnum.NW,SpaceEnum.E,SpaceEnum.NE];
                break;
            case SpaceEnum.W:
                closestPath=[SpaceEnum.NW,SpaceEnum.SW,SpaceEnum.NE,SpaceEnum.SE,SpaceEnum.E];
                break;
            case SpaceEnum.NW:
                closestPath=[SpaceEnum.NE,SpaceEnum.W,SpaceEnum.E,SpaceEnum.SW,SpaceEnum.SE];
                break;
			default:
				break;
		}

		for(let i=0;i<closestPath.length;i++){
			for(let j=0;j<spaceAreas[closestPath[i]].length;j++){
				if(spaceAreas[closestPath[i]][j].type===ShipTypeEnum.CIVILIAN){
					let newLocation=-1;
					if(i%2===0){ //Clockwise
						switch(loc){
                            case SpaceEnum.NE:
                                newLocation=SpaceEnum.E;
                                break;
                            case SpaceEnum.E:
                                newLocation=SpaceEnum.SE;
                                break;
                            case SpaceEnum.SE:
                                newLocation=SpaceEnum.SW;
                                break;
                            case SpaceEnum.SW:
                                newLocation=SpaceEnum.W;
                                break;
                            case SpaceEnum.W:
                                newLocation=SpaceEnum.NW;
                                break;
                            case SpaceEnum.NW:
                                newLocation=SpaceEnum.NE;
                                break;
                            default:
                                break;
						}
					}else{ //Counterclockwise
                        switch(loc){
                            case SpaceEnum.NE:
                                newLocation=SpaceEnum.NW;
                                break;
                            case SpaceEnum.E:
                                newLocation=SpaceEnum.NE;
                                break;
                            case SpaceEnum.SE:
                                newLocation=SpaceEnum.E;
                                break;
                            case SpaceEnum.SW:
                                newLocation=SpaceEnum.SE;
                                break;
                            case SpaceEnum.W:
                                newLocation=SpaceEnum.SW;
                                break;
                            case SpaceEnum.NW:
                                newLocation=SpaceEnum.W;
                                break;
                            default:
                                break;
                        }
					}
                    sendNarrationToAll("Cylon raider advances towards the civilian ships",game.gameId);
                    let v = spaceAreas[loc][num];
                    spaceAreas[loc].splice(num,1);
                    spaceAreas[newLocation].push(v);
                    return true;
                }
			}
		}

        sendNarrationToAll("Cylon raider attacks galactica!",game.gameId);
        let roll = rollDie();
        game.setActiveRoll(roll);
        sendNarrationToAll("Cylon raider rolls a " + roll,game.gameId);
        if (roll >= RAIDER_DAMAGES_GALACTICA_MINIMUM_ROLL) {
            sendNarrationToAll("Galactica is hit!",game.gameId);
            damageGalactica();
        } else {
            sendNarrationToAll("The raider misses!",game.gameId);
        }

        return false;
    };

	this.activateRaiders = function(){
        sendNarrationToAll("Cylons activate raiders!",game.gameId);
        let totalRaiders=0;
        for(let s in SpaceEnum){
            for(let i=0;i<spaceAreas[SpaceEnum[s]].length;i++) {
                if (spaceAreas[SpaceEnum[s]][i].type === ShipTypeEnum.RAIDER) {
                    totalRaiders++;
                }
            }
        }
        if(totalRaiders===0){
            for(let s in SpaceEnum){
                for(let i=0;i<spaceAreas[SpaceEnum[s]].length;i++){
                    if(spaceAreas[SpaceEnum[s]][i].type===ShipTypeEnum.BASESTAR){
                        if(spaceAreas[SpaceEnum[s]][i].damage[0]==BasestarDamageTypeEnum.HANGAR||
                            spaceAreas[SpaceEnum[s]][i].damage[1]==BasestarDamageTypeEnum.HANGAR){
                            sendNarrationToAll("Basestar can't launch raiders because of hangar damage",game.gameId);
                            continue;
                        }
                        sendNarrationToAll("Basestar launches raiders!",game.gameId);
                        let raidersToLaunch=RAIDERS_LAUNCHED_DURING_ACTIVATION;
                        if(inPlay.indexOf(InPlayEnum.CYLON_SWARM)!==-1){
                            sendNarrationToAll("Cylons are swarming!",game.gameId);
                            raidersToLaunch++;
                        }
                        if(totalRaiders+RAIDERS_LAUNCHED_DURING_ACTIVATION>MAX_RAIDERS){
                            raidersToLaunch=MAX_RAIDERS-totalRaiders;
                        }
                        totalRaiders+=raidersToLaunch;
                        for(let j=0;j<raidersToLaunch;j++){
                            spaceAreas[SpaceEnum[s]].push(new Ship(ShipTypeEnum.RAIDER));
                        }
                    }
                }
            }
        }else{
            for(let s in SpaceEnum){
                for(let i=0;i<spaceAreas[SpaceEnum[s]].length;i++) {
                    if (spaceAreas[SpaceEnum[s]][i].type === ShipTypeEnum.RAIDER) {
                        if(activateRaider(SpaceEnum[s],i)){
                            i--;
                        }
                    }
                }
            }
            for(let s in SpaceEnum){
                for(let i=0;i<spaceAreas[SpaceEnum[s]].length;i++) {
                    if (spaceAreas[SpaceEnum[s]][i].type === ShipTypeEnum.RAIDER) {
                        spaceAreas[SpaceEnum[s]][i].activated=false;
                    }
                }
            }
        }

    };

	this.launchRaiders = function(amount){
        sendNarrationToAll("Cylon basestars launch raiders!",game.gameId);
        let totalRaiders=0;
        for(let s in SpaceEnum){
            for(let i=0;i<spaceAreas[SpaceEnum[s]].length;i++) {
                if (spaceAreas[SpaceEnum[s]][i].type === ShipTypeEnum.RAIDER) {
                    totalRaiders++;
                }
            }
        }

        for(let s in SpaceEnum){
            for(let i=0;i<spaceAreas[SpaceEnum[s]].length;i++){
                if(spaceAreas[SpaceEnum[s]][i].type===ShipTypeEnum.BASESTAR){
                    if(spaceAreas[SpaceEnum[s]][i].damage[0]==BasestarDamageTypeEnum.HANGAR||
                        spaceAreas[SpaceEnum[s]][i].damage[1]==BasestarDamageTypeEnum.HANGAR){
                        sendNarrationToAll("Basestar can't launch raiders because of hangar damage",game.gameId);
                        continue;
                    }
                    let raidersToLaunch=amount;
                    if(inPlay.indexOf(InPlayEnum.CYLON_SWARM)!==-1){
                        sendNarrationToAll("Cylons are swarming!",game.gameId);
                        raidersToLaunch++;
                    }
                    if(totalRaiders+amount>MAX_RAIDERS){
                        raidersToLaunch=MAX_RAIDERS-totalRaiders;
                    }
                    totalRaiders+=raidersToLaunch;
                    for(let j=0;j<raidersToLaunch;j++){
                        spaceAreas[SpaceEnum[s]].push(new Ship(ShipTypeEnum.RAIDER));
                    }
                }
            }
        }
	};
	
	this.launchHeavyRaiders = function(){
		let totalRaiders=0;
        for(let s in SpaceEnum){
            for(let i=0;i<spaceAreas[SpaceEnum[s]].length;i++){
                if(spaceAreas[SpaceEnum[s]][i].type===ShipTypeEnum.HEAVY_RAIDER){
                    totalRaiders++;
                }
            }
        }		
		
		for(let s in SpaceEnum){
			for(let i=0;i<spaceAreas[SpaceEnum[s]].length;i++){
				if(totalRaiders>=MAX_HEAVY_RAIDERS){
					return;
				}
				if(spaceAreas[SpaceEnum[s]][i].type===ShipTypeEnum.BASESTAR){
					sendNarrationToAll("Cylon basestar launches heavy raiders!",game.gameId);
					spaceAreas[SpaceEnum[s]].push(new Ship(ShipTypeEnum.HEAVY_RAIDER));
					totalRaiders++;
				}
			}
		}
	};

	this.activateHeavyRaiders = function(){
        sendNarrationToAll("Cylons activate heavy raiders!",game.gameId);
        if(centurionTrack[centurionTrack.length-1]>0){
            sendNarrationToAll("Centurions kill the crew of Galactica!",game.gameId);
            gameOver();
            return;
        }
        for(let i=centurionTrack.length-2;i>=0;i--){
            if(centurionTrack[i]>0){
                sendNarrationToAll("Centurions advance!",game.gameId);
                centurionTrack[i+1]=centurionTrack[i];
            }
        }
        centurionTrack[0]=0;

        let totalRaiders=0;
        for(let s in SpaceEnum){
            for(let i=0;i<spaceAreas[SpaceEnum[s]].length;i++){
                if(spaceAreas[SpaceEnum[s]][i].type===ShipTypeEnum.HEAVY_RAIDER){
                    totalRaiders++;
                    let newLocation=-1;
                    switch(SpaceEnum[s]){
                        case SpaceEnum.NE:
                            newLocation=SpaceEnum.E;
                            break;
                        case SpaceEnum.E:
                            newLocation=SpaceEnum.SE;
                            break;
                        case SpaceEnum.W:
                            newLocation=SpaceEnum.SW;
                            break;
                        case SpaceEnum.NW:
                            newLocation=SpaceEnum.W;
                            break;
                        case SpaceEnum.SE:
                        case SpaceEnum.SW:
                            break;
                        default:
                            break;
                    }
                    if(newLocation===-1){
                        sendNarrationToAll("Centurions board Galactica!",game.gameId);
                        centurionTrack[0]++;
                        spaceAreas[SpaceEnum[s]].splice(i,1);
                        i--;
                        totalRaiders--;
                    }else{
                        let heavyRaider = spaceAreas[SpaceEnum[s]][i];
                        spaceAreas[SpaceEnum[s]].splice(i,1);
                        i--;
                        spaceAreas[newLocation].push(heavyRaider);
                    }
                }
            }
        }

        if(totalRaiders===0){
        	this.launchHeavyRaiders();
        }
	};

	this.activateBasestars = function(){
        for(let s in SpaceEnum){
            for(let i=0;i<spaceAreas[SpaceEnum[s]].length;i++){
                if(spaceAreas[SpaceEnum[s]][i].type===ShipTypeEnum.BASESTAR){
                    if(spaceAreas[SpaceEnum[s]][i].damage[0]==BasestarDamageTypeEnum.WEAPONS||
                        spaceAreas[SpaceEnum[s]][i].damage[1]==BasestarDamageTypeEnum.WEAPONS){
                        sendNarrationToAll("Basestar can't attack Galactica because of weapons damage",game.gameId);
                        continue;
                    }
                    sendNarrationToAll("Cylon basestar attacks Galactica!",game.gameId);
                    let roll = rollDie();
                    game.setActiveRoll(roll);
                    sendNarrationToAll("Cylon basestar rolls a " + roll,game.gameId);
                    if (roll >= BASESTAR_DAMAGES_GALACTICA_MINIMUM_ROLL) {
                        sendNarrationToAll("Galactica is hit!",game.gameId);
                        damageGalactica();
                    } else {
                        sendNarrationToAll("The basestar misses!",game.gameId);
                    }
                }
            }
        }
	};

	let countShips = function(){
		let shipCount=[];
		for(let type in ShipTypeEnum){
			shipCount[ShipTypeEnum[type]]=0;
			for(let area in SpaceEnum){
				let ships=spaceAreas[SpaceEnum[area]];
				for(let i=0;i<ships.length;i++){
					if(ships[i].type===ShipTypeEnum[type]){
                        shipCount[ShipTypeEnum[type]]++;
					}
				}
			}
		}
		console.log(shipCount);
		return shipCount;
	};

	let placeShips = function(text){
        if(SpaceEnum[text]==null){
            sendNarrationToPlayer(players[activePlayer].userId, 'Not a valid location');
            return;
        }

        for(let type in ShipTypeEnum){
            if(shipNumberToPlace[ShipTypeEnum[type]]>0) {
            	for(let i=0;i<shipPlacementLocations[ShipTypeEnum[type]].length;i++){
            		if(shipPlacementLocations[ShipTypeEnum[type]][i]===SpaceEnum[text]){
            			let location=shipPlacementLocations[ShipTypeEnum[type]][i];
                        if(ShipTypeEnum[type]===ShipTypeEnum.CIVILIAN){
                            let ship=new Ship(ShipTypeEnum.CIVILIAN);
                            ship.resource=drawCard(decks[DeckTypeEnum.CIV_SHIP]);
                            spaceAreas[location].push(ship);
                        }else{
                            spaceAreas[location].push(new Ship(ShipTypeEnum[type]));
                        }
                        if(ShipTypeEnum[type]===ShipTypeEnum.VIPER){
                            vipersInHangar--;
                        }

                        shipPlacementLocations[ShipTypeEnum[type]].splice(i,1);
                        shipNumberToPlace[ShipTypeEnum[type]]--;
                        for(let type in ShipTypeEnum){
                            if(shipNumberToPlace[ShipTypeEnum[type]]>0) {
                                sendNarrationToPlayer(players[activePlayer].userId,
									'Place '+shipNumberToPlace[ShipTypeEnum[type]]+" "+ShipTypeEnum[type]+
                                    "(s) at the following options:"+shipPlacementLocations[ShipTypeEnum[type]]);
                                return;
                            }
                        }

                        sendNarrationToPlayer(players[activePlayer].userId, "Done placing ships");
						phase=GamePhaseEnum.MAIN_TURN;
                        if (hasAction())
                            this.nextAction(game);
                        else nextTurn();
                        return;
					}
				}
            }
        }

        sendNarrationToPlayer(players[activePlayer].userId, "Can't place there");
		return;
	};

	let calcShipsToPlace = function(){
        let shipCount=countShips();
        for(let type in ShipTypeEnum){
            shipNumberToPlace[ShipTypeEnum[type]]=0;
        }
        for(let type in ShipTypeEnum){
        	let num = shipPlacementLocations[ShipTypeEnum[type]].length;
        	let num2 = num;
        	switch(ShipTypeEnum[type]){
				case ShipTypeEnum.BASESTAR:
					num2=MAX_BASESTARS-shipCount[ShipTypeEnum.BASESTAR];
					break;
				case ShipTypeEnum.RAIDER:
                    num2=MAX_RAIDERS-shipCount[ShipTypeEnum.RAIDER];
                    break;
                case ShipTypeEnum.HEAVY_RAIDER:
                   	num2=MAX_HEAVY_RAIDERS-shipCount[ShipTypeEnum.HEAVY_RAIDER];
                    break;
                case ShipTypeEnum.VIPER:
                	num2=vipersInHangar;
                    break;
                case ShipTypeEnum.CIVILIAN:
                    num2=decks[DeckTypeEnum.CIV_SHIP].deck.length;
                    break;
                default:
					break;
			}
            shipNumberToPlace[ShipTypeEnum[type]]=Math.min(num,num2);
        }

        let needToPlaceManually=false;
        for(let type in ShipTypeEnum){
            if(shipPlacementLocations[ShipTypeEnum[type]]!=null&&shipPlacementLocations[ShipTypeEnum[type]].length
                ===shipNumberToPlace[ShipTypeEnum[type]]){
                for(let i=0;i<shipPlacementLocations[ShipTypeEnum[type]].length;i++){
                    console.log(shipPlacementLocations[ShipTypeEnum[type]]);
                    if(ShipTypeEnum[type]===ShipTypeEnum.CIVILIAN){
                        let ship=new Ship(ShipTypeEnum.CIVILIAN);
                        ship.resource=drawCard(decks[DeckTypeEnum.CIV_SHIP]);
                        spaceAreas[shipPlacementLocations[ShipTypeEnum[type]][i]].push(ship);
                    }else{
                        spaceAreas[shipPlacementLocations[ShipTypeEnum[type]][i]].push(new Ship(ShipTypeEnum[type]));
                    }
                    if(ShipTypeEnum[type]===ShipTypeEnum.VIPER){
                        vipersInHangar--;
                    }
                }
                shipNumberToPlace[ShipTypeEnum[type]]=0;
                shipPlacementLocations[type]=[];
            }else{
                needToPlaceManually=true;
            }
        }

        if(needToPlaceManually){
            for(let type in ShipTypeEnum){
                if(shipNumberToPlace[ShipTypeEnum[type]]>0) {
                    sendNarrationToPlayer(players[activePlayer].userId,
                        'Place '+shipNumberToPlace[ShipTypeEnum[type]]+" "+ShipTypeEnum[type]+
                        "(s) at the following options:"+shipPlacementLocations[ShipTypeEnum[type]]);
                    phase = GamePhaseEnum.PLACE_SHIPS;
                    return true;
                }
            }
        }

        return false;
	};

	this.activateCylons = type => {
		if(this.getActiveCrisis()==null||!this.getPlayers()[this.getCurrentPlayer()].isRevealedCylon){
			//Cylon activation step
			if(type===CylonActivationTypeEnum.ACTIVATE_RAIDERS){
				this.activateRaiders();
			}else if(type===CylonActivationTypeEnum.ACTIVATE_HEAVY_RAIDERS){
				this.activateHeavyRaiders();
			}else if(type===CylonActivationTypeEnum.ACTIVATE_BASESTARS){
				this.activateBasestars();
			}else if(type===CylonActivationTypeEnum.LAUNCH_RAIDERS){
				this.launchRaiders(RAIDERS_LAUNCHED);
			}else if(type===CylonActivationTypeEnum.NONE){
	
			}
        }

        //Cylon attack cards
        if(type===CylonActivationTypeEnum.AMBUSH){
            shipPlacementLocations[ShipTypeEnum.BASESTAR].push(SpaceEnum.W);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.E);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.E);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.E);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.E);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.W);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.W);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.W);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.W);
            shipPlacementLocations[ShipTypeEnum.VIPER].push(SpaceEnum.SE);
            shipPlacementLocations[ShipTypeEnum.VIPER].push(SpaceEnum.SE);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.NW);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.SE);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.SW);
            if(calcShipsToPlace()){
                return;
            }
        }
        else if(type===CylonActivationTypeEnum.BESIEGED){
            shipPlacementLocations[ShipTypeEnum.BASESTAR].push(SpaceEnum.SE);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.SW);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.SW);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.SW);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.SW);
            shipPlacementLocations[ShipTypeEnum.HEAVY_RAIDER].push(SpaceEnum.W);
            shipPlacementLocations[ShipTypeEnum.VIPER].push(SpaceEnum.SW);
            shipPlacementLocations[ShipTypeEnum.VIPER].push(SpaceEnum.SW);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.SW);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.W);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.NW);
            if(calcShipsToPlace()){
                return;
            }
        }
        else if(type===CylonActivationTypeEnum.POST_BESIEGED){
        	let activated=0;
			for(let i=0;i<spaceAreas[SpaceEnum.SW].length&&activated<4;i++) {
				if (spaceAreas[SpaceEnum.SW][i].type === ShipTypeEnum.RAIDER) {
					activated++;
					if(activateRaider(SpaceEnum.SW,i)){
						i--;
					}
				}
			}
        }
        else if(type===CylonActivationTypeEnum.BOARDING_PARTIES){
            shipPlacementLocations[ShipTypeEnum.BASESTAR].push(SpaceEnum.NW);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.NW);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.NW);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.NW);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.NW);
            shipPlacementLocations[ShipTypeEnum.HEAVY_RAIDER].push(SpaceEnum.W);
            shipPlacementLocations[ShipTypeEnum.HEAVY_RAIDER].push(SpaceEnum.W);
            shipPlacementLocations[ShipTypeEnum.HEAVY_RAIDER].push(SpaceEnum.NE);
            shipPlacementLocations[ShipTypeEnum.HEAVY_RAIDER].push(SpaceEnum.NE);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.E);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.SE);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.SE);
            if(calcShipsToPlace()){
                return;
            }
        }
        else if(type===CylonActivationTypeEnum.CYLON_SWARM){
            shipPlacementLocations[ShipTypeEnum.BASESTAR].push(SpaceEnum.W);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.W);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.W);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.W);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.W);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.W);
            shipPlacementLocations[ShipTypeEnum.HEAVY_RAIDER].push(SpaceEnum.NW);
            shipPlacementLocations[ShipTypeEnum.VIPER].push(SpaceEnum.SE);
            shipPlacementLocations[ShipTypeEnum.VIPER].push(SpaceEnum.SW);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.E);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.SE);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.SW);
            if(calcShipsToPlace()){
                return;
            }
        }
        else if(type===CylonActivationTypeEnum.HEAVY_ASSAULT){
            shipPlacementLocations[ShipTypeEnum.BASESTAR].push(SpaceEnum.NW);
            shipPlacementLocations[ShipTypeEnum.BASESTAR].push(SpaceEnum.W);
            shipPlacementLocations[ShipTypeEnum.VIPER].push(SpaceEnum.SW);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.SW);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.SE);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.E);
			if(calcShipsToPlace()){
				return;
			}
        }
        else if(type===CylonActivationTypeEnum.JAMMED_ASSAULT){
            shipPlacementLocations[ShipTypeEnum.BASESTAR].push(SpaceEnum.NE);
            shipPlacementLocations[ShipTypeEnum.BASESTAR].push(SpaceEnum.W);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.NW);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.NW);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.NW);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.NW);
            shipPlacementLocations[ShipTypeEnum.HEAVY_RAIDER].push(SpaceEnum.NE);
            shipPlacementLocations[ShipTypeEnum.HEAVY_RAIDER].push(SpaceEnum.NE);
            shipPlacementLocations[ShipTypeEnum.VIPER].push(SpaceEnum.SE);
            shipPlacementLocations[ShipTypeEnum.VIPER].push(SpaceEnum.SW);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.E);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.SE);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.SW);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.W);
            if(calcShipsToPlace()){
                return;
            }
        }
        else if(type===CylonActivationTypeEnum.RAIDING_PARTY){
            shipPlacementLocations[ShipTypeEnum.BASESTAR].push(SpaceEnum.NE);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.NE);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.NE);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.NE);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.W);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.W);
            shipPlacementLocations[ShipTypeEnum.HEAVY_RAIDER].push(SpaceEnum.W);
            shipPlacementLocations[ShipTypeEnum.HEAVY_RAIDER].push(SpaceEnum.W);
            shipPlacementLocations[ShipTypeEnum.VIPER].push(SpaceEnum.SW);
            shipPlacementLocations[ShipTypeEnum.VIPER].push(SpaceEnum.SW);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.SE);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.SW);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.SW);
            if(calcShipsToPlace()){
                return;
            }
        }
        else if(type===CylonActivationTypeEnum.SURROUNDED){
            shipPlacementLocations[ShipTypeEnum.BASESTAR].push(SpaceEnum.NW);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.NE);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.NE);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.NE);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.W);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.W);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.W);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.W);
            shipPlacementLocations[ShipTypeEnum.HEAVY_RAIDER].push(SpaceEnum.NE);
            shipPlacementLocations[ShipTypeEnum.VIPER].push(SpaceEnum.SE);
            shipPlacementLocations[ShipTypeEnum.VIPER].push(SpaceEnum.SW);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.E);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.SE);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.SW);
            if(calcShipsToPlace()){
                return;
            }
        }
        else if(type===CylonActivationTypeEnum.TACTICAL_STRIKE){
            shipPlacementLocations[ShipTypeEnum.BASESTAR].push(SpaceEnum.SW);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.SW);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.SW);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.SW);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.SW);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.SW);
            shipPlacementLocations[ShipTypeEnum.HEAVY_RAIDER].push(SpaceEnum.W);
            shipPlacementLocations[ShipTypeEnum.VIPER].push(SpaceEnum.SE);
            shipPlacementLocations[ShipTypeEnum.VIPER].push(SpaceEnum.SE);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.NE);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.E);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.SE);
            if(calcShipsToPlace()){
                return;
            }
        }
        else if(type===CylonActivationTypeEnum.THIRTY_THREE){
            shipPlacementLocations[ShipTypeEnum.BASESTAR].push(SpaceEnum.W);
            shipPlacementLocations[ShipTypeEnum.VIPER].push(SpaceEnum.SE);
            shipPlacementLocations[ShipTypeEnum.VIPER].push(SpaceEnum.SE);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.NE);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.E);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.SE);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.SW);
            if(calcShipsToPlace()){
                return;
            }
        }

        //Other
        else if(type===CylonActivationTypeEnum.RESCUE_THE_FLEET){
            shipPlacementLocations[ShipTypeEnum.BASESTAR].push(SpaceEnum.W);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.W);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.W);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.W);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.E);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.E);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.E);
            if(calcShipsToPlace()){
                return;
            }
        }else if(type===CylonActivationTypeEnum.CRIPPLED_RAIDER){
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.W);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.W);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.W);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.E);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.E);
            if(calcShipsToPlace()){
                return;
            }
        }else if(type===CylonActivationTypeEnum.CYLON_TRACKING_DEVICE){
            shipPlacementLocations[ShipTypeEnum.BASESTAR].push(SpaceEnum.W);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.E);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.E);
            if(calcShipsToPlace()){
                return;
            }
        }else if(type===CylonActivationTypeEnum.CYLON_AMBUSH){
            shipPlacementLocations[ShipTypeEnum.BASESTAR].push(SpaceEnum.W);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.W);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.W);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.W);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.E);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.E);
            if(calcShipsToPlace()){
                return;
            }
        }else if(type===CylonActivationTypeEnum.CYLON_FLEET){
            this.launchRaiders(2);
            this.launchHeavyRaiders();
        }else if(type===CylonActivationTypeEnum.MASSIVE_ASSAULT){
            shipPlacementLocations[ShipTypeEnum.BASESTAR].push(SpaceEnum.NW);
            shipPlacementLocations[ShipTypeEnum.BASESTAR].push(SpaceEnum.NE);
            shipPlacementLocations[ShipTypeEnum.HEAVY_RAIDER].push(SpaceEnum.NE);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.NW);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.NW);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.NW);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.NW);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.NE);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.NE);
            shipPlacementLocations[ShipTypeEnum.VIPER].push(SpaceEnum.SW);
            shipPlacementLocations[ShipTypeEnum.VIPER].push(SpaceEnum.SE);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.SW);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.SW);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.SE);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.SE);
			if(calcShipsToPlace()){
				return;
			}
        }

        //if any instructions on what to do next exist, do them, else go to next turn
        if (hasAction())
            this.nextAction(game);
        else nextTurn();
        
        return;
	};
	    
	let damageGalactica=function(){
        let damageType=drawCard(decks[DeckTypeEnum.GALACTICA_DAMAGE]);
        sendNarrationToAll("Cylons damage "+damageType+"!",game.gameId);
        damageLocation(damageType);
		return;
	};

    let damageLocation=function(loc){
        if(loc===GalacticaDamageTypeEnum.FOOD){
            game.addFood(-1);
        }else if(loc===GalacticaDamageTypeEnum.FUEL){
            game.addFuel(-1);
        }else{
            damagedLocations[loc]=true;
            let totalDamage=0;
            for(let type in damagedLocations){
                if(damagedLocations[type]){
                    totalDamage++;
                }
            }
            if(totalDamage>=6){
                sendNarrationToAll("Galactica is destroyed!",game.gameId);
                gameOver();
                return;
            }
            for(let i=0;i<players.length;i++){
                if(players[i].location===loc&&players[i].viperLocation===-1){
                    players[i].location=LocationEnum.SICKBAY;
                    sendNarrationToAll(players[i].character.name+" is sent to Sickbay!",game.gameId);
                }
            }
        }
    };

    let sendPlayerToLocation = function(player, location){
        if(players[player].viperLocation!==-1){
            for(let i=0;i<spaceAreas[players[player].viperLocation].length;i++){
                if(spaceAreas[players[player].viperLocation][i].pilot===player){
                    spaceAreas[players[player].viperLocation].splice(i,1);
                    players[player].viperLocation=-1;
                    vipersInHangar++;
                    break;
                }
            }
        }
        if(location===LocationEnum.BRIG){
        	awardLinesOfSuccession();	
        }
        sendNarrationToAll(players[player].character.name + " is sent to " + location,game.gameId);
        players[player].location = location;
    };

	let playQuorumCard = num => {
		if(readCard(quorumHand[num]).name===base.QuorumMap.ENCOURAGE_MUTINY.name){
			let foundEligible=false;
			for(let i=0;i<players.length;i++){
				if(!players[i].isRevealedCylon&&currentAdmiral!=i&&activePlayer!=i){
					foundEligible=true;
				}
			}
			if(!foundEligible){
				sendNarrationToPlayer(players[activePlayer].userId, 'No valid players to target');
				return;
			}
		}
        activeQuorum = quorumHand[num];
        quorumHand.splice(num,1);
        readCard(activeQuorum).action(game);
	};
    
    this.afterQuorum = discardBool => {
        if (discardBool)
            decks[DeckTypeEnum.QUORUM].discard.push(activeQuorum);
        activeQuorum = null;
        playCrisis(this.drawCard(this.getDecks()[DeckTypeEnum.CRISIS]));
    };
    
    let launchNuke = function(text){
        let input=text.split(" ");
        if(input.length!==2){
            sendNarrationToPlayer(players[activePlayer].userId, 'Invalid input');
            return;
        }
        let loc=SpaceEnum[input[0]];
        let num=parseInt(input[1]);
        if(loc==null || isNaN(num) || num<0 || num>=spaceAreas[loc].length){
            sendNarrationToPlayer(players[activePlayer].userId, 'Not a valid ship location');
            return;
        }else if(spaceAreas[loc][num].type!==ShipTypeEnum.BASESTAR){
            sendNarrationToPlayer(players[activePlayer].userId, 'Not a basestar');
            return;
        }
        sendNarrationToAll(players[activePlayer].character.name+" launches a nuke at the basestar to the "+loc+"!",game.gameId);
        game.afterRoll = game => {
        	let roll = game.roll;
        	if(spaceAreas[loc][num].damage[0]==BasestarDamageTypeEnum.STRUCTURAL||
				spaceAreas[loc][num].damage[1]==BasestarDamageTypeEnum.STRUCTURAL){
				roll+=2;
				sendNarrationToAll("Roll upgraded to "+roll+" by basestar structural damage",game.gameId);
			}
			if(roll>6){
				destroyBasestar(loc,num);
				let raidersDestroyed=0;
				for(let i=0;i<spaceAreas[loc].length&&raidersDestroyed<RAIDERS_DESTROYED_BY_NUKE;i++){
					if(spaceAreas[loc][num].type===ShipTypeEnum.RAIDER){
						spaceAreas[loc].splice(i,1);
						raidersDestroyed++;
						i--;
					}
				}
				if(raidersDestroyed>0){
					sendNarrationToAll(raidersDestroyed+" raiders were also destroyed!",game.gameId);
				}
			}else if(roll>2){
				destroyBasestar(loc,num);
			}else{
				let bs=spaceAreas[loc][num];
				damageBasestar(loc,num);
				if(spaceAreas[loc][num]===bs) {
					damageBasestar(loc, num);
				}
			}
			phase=GamePhaseEnum.MAIN_TURN;
			game.doPostAction();
        };
        nukesRemaining--;
        game.setUpRoll(8, WhoEnum.ACTIVE, 'nuking the basestar at '+loc+","+num);
        return false;
    };

    let runCylonReveal = function(num){                        
        sendNarrationToAll(players[activePlayer].character.name+" reveals as a Cylon!",game.gameId);
        let wasInBrig=false;
        if(players[activePlayer].location===base.LocationMap.BRIG){
            wasInBrig=true;
        }
        players[activePlayer].isRevealedCylon=true;
        awardLinesOfSuccession();
        let numberToDiscard=players[activePlayer].hand.length-3;
        if(numberToDiscard>0){
        	game.nextAction = next => {
				next.nextAction = null;
				next.setPhase(GamePhaseEnum.MAIN_TURN);
				next.runCylonRevealActions(num);
			};
			sendNarrationToAll(players[activePlayer].character.name+" discards down to 3",game.gameId);
        	game.singlePlayerDiscards(WhoEnum.ACTIVE,numberToDiscard);
        }else{
        	game.runCylonRevealActions(num, wasInBrig);
        }
	};
	
	this.runCylonRevealActions = function(num, wasInBrig){
		sendPlayerToLocation(activePlayer,LocationEnum.RESURRECTION_SHIP);
        players[activePlayer].superCrisisHand.push(decks[DeckTypeEnum.SUPER_CRISIS].deck.pop());
        sendNarrationToAll(players[activePlayer].character.name+" draws a super crisis card",game.gameId);
        let card=players[activePlayer].loyalty[num];
        players[activePlayer].revealedLoyalty.push(card);
        players[activePlayer].loyalty.splice(num,1);
        if(wasInBrig) {
        	sendNarrationToAll(players[activePlayer].character.name+" was in the brig and couldn't cause any damage",game.gameId);
        	return;
        }
        card.action(game);
	};
	                                                       
	this.playSuperCrisis = function(card){
		let cardJSON = readCard(card);
        sendNarrationToAll(`${players[currentPlayer].character.name} plays a ${cardJSON.name} super crisis card: `,game.gameId);
        sendNarrationToAll(cardJSON.text,game.gameId);
        activeCrisis = card;
        decks.SuperCrisis.discard.push(card);
        if (cardJSON.choose != null)
            this.choose(cardJSON.choose);
        else if (cardJSON.skillCheck != null)
            this.beforeSkillCheck(cardJSON.skillCheck);
        else cardJSON.instructions(this);
	};
    
    this.cylonDamageGalactica = function(){
        let damageOptions=[];
        for(let i=0;i<5;i++){
            let damage=game.getDecks()[DeckTypeEnum.GALACTICA_DAMAGE].deck.pop();
            damageOptions.push(damage);
            sendNarrationToPlayer(game.getPlayers()[game.getActivePlayer()].userId,i+": "+damage);
        }
        game.setDamageOptions(damageOptions);
    	phase=GamePhaseEnum.CYLON_DAMAGE_GALACTICA;
	};

    let cylonDamageGalactica = function(text){
        let input=text.split(" ");
        if(input.length!==2||isNaN(input[0])||isNaN(input[1])||input[0]>game.getDamageOptions().length||input[1]>game.getDamageOptions().length){
            sendNarrationToPlayer(game.getPlayers()[game.getActivePlayer()].userId, 'Invalid input');
            return;

        }
        sendNarrationToAll(game.getPlayers()[game.getActivePlayer()].character.name+" damages "+game.getDamageOptions()[input[0]]+"!",game.gameId);
        damageLocation(game.getDamageOptions()[input[0]]);
        sendNarrationToAll(game.getPlayers()[game.getActivePlayer()].character.name+" damages "+game.getDamageOptions()[input[1]]+"!",game.gameId);
        damageLocation(game.getDamageOptions()[input[1]]);
        phase=GamePhaseEnum.MAIN_TURN;
	};

	let playSkillCardAction = function(card){
		switch(card.name){
			case "Repair": //Action
				//Works but technically you should be able to repair only 1 viper out of 2
				if(players[activePlayer].location===LocationEnum.HANGAR_DECK){
                    if(!damagedLocations[players[activePlayer].location]&&damagedVipers==0){
                        sendNarrationToPlayer(players[activePlayer].userId, 'Nothing to repair');
                        return false;
                    }else if(damagedLocations[players[activePlayer].location]&&damagedVipers==0){
                        repairVipersOrHangarDeck(false);
                        return true;
                    }else if(!damagedLocations[players[activePlayer].location]&&damagedVipers>0){
                        repairVipersOrHangarDeck(true);
                        return true;
                    }
                    game.choose({
						who : WhoEnum.ACTIVE,
						text : 'Repair vipers or hangar deck?',
						options: (next) => {
							return ["Vipers","Hangar Deck"];
						},
						choice1 : third => {
							repairVipersOrHangarDeck(true);
							doPostAction();
						},
						choice2 : third => {
							repairVipersOrHangarDeck(false);
							doPostAction();
						},
					});
				}else{
                    if(damagedLocations[players[activePlayer].location]){
                        sendNarrationToAll(players[activePlayer].character.name + " repairs the "
                            +LocationEnum[players[activePlayer]].location,game.gameId);
                        damagedLocations[players[activePlayer].location]=false;
                        return true;
                    }else{
                        sendNarrationToPlayer(players[activePlayer].userId, 'Current location isn\'t damaged');
                        return false;
                    }
                }
				break;
            case "Research":
                break;
            case "XO": //Action
            	if(executiveOrderActive){
                    sendNarrationToPlayer(players[activePlayer].userId, "Already an executive order");
					return false;
            	}
            	game.choose({
					who : WhoEnum.ACTIVE,
					text : 'Who gets the executive order?',
					options: (next) => {
						return next.getHumanPlayerNames();
					},
					player : (next, player) => {
						if (next.getActivePlayer()===player) {
							next.narratePlayer(player, 'Not yourself!');
							return false;
						} else {
							sendNarrationToAll(players[activePlayer].character.name + " gives "
                            +players[player].character.name+" an executive order",next.gameId);
                            next.addToActiveActionPoints(2);
                            next.addToActiveMovementPoints(1);
							next.setExecutiveOrderActive(true);
							next.setActivePlayer(player);
							next.setPhase(GamePhaseEnum.MAIN_TURN);
						}
					},
				});
                return true;
            case "Emergency":
                break;
            case "Evasive":
                break;
            case "Firepower": //Action
            	if(players[activePlayer].viperLocation===-1){
            		sendNarrationToPlayer(players[activePlayer].userId, "You're not in a viper");
            		return false;
            	}
            	sendNarrationToAll(players[activePlayer].character.name + " activates Maximum Firepower!",game.gameId);
            	sendNarrationToPlayer(players[activePlayer].userId, "You have 4 attacks left");
            	maximumFirepower=4;
            	phase=GamePhaseEnum.MAXIMUM_FIREPOWER;
                return true;
            case "Consolidate": //Action
            	sendNarrationToAll(players[activePlayer].character.name + " consolidates power",game.gameId);
            	game.choose({
					who : WhoEnum.ACTIVE,
					text : `choose a skill card: 'politics', 'leadership', 'tactics', 'piloting' or 'engineering'.`,
					options: (next) => {
						return next.getSkillCardTypeNamesForPlayer(null);
					},
					other : (next, text) => {
						let type = 'error';
						switch (text) {
							case 0 : type = DeckTypeEnum.POLITICS; break;
							case 1 : type = DeckTypeEnum.LEADERSHIP; break;
							case 2 : type = DeckTypeEnum.TACTICS; break;
							case 3 : type = DeckTypeEnum.PILOTING; break;
							case 4 : type = DeckTypeEnum.ENGINEERING; break;
							default :
								return;
						}
						next.narrateAll(next.getPlayers()[next.getActivePlayer()].character.name + " draws a "+type+" skill card");
						next.getPlayers()[next.getActivePlayer()].hand.push(next.drawCard(next.getDecks()[type]));
						next.choose({
							who : WhoEnum.ACTIVE,
							text : `choose a skill card: 'politics', 'leadership', 'tactics', 'piloting' or 'engineering'.`,
							options: (second) => {
								return second.getSkillCardTypeNamesForPlayer(null);
							},
							other : (second, text) => {
								let type = 'error';
								switch (text) {
									case 0 : type = DeckTypeEnum.POLITICS; break;
									case 1 : type = DeckTypeEnum.LEADERSHIP; break;
									case 2 : type = DeckTypeEnum.TACTICS; break;
									case 3 : type = DeckTypeEnum.PILOTING; break;
									case 4 : type = DeckTypeEnum.ENGINEERING; break;
									default :
										return;
								}
								second.narrateAll(second.getPlayers()[second.getActivePlayer()].character.name + " draws a "+type+" skill card");
								second.getPlayers()[second.getActivePlayer()].hand.push(second.drawCard(second.getDecks()[type]));	
								second.setPhase(GamePhaseEnum.MAIN_TURN);
							},
						});	
					},
				});
				return true;
            case "Committee":
                break;
            case "Launch Scout": //Action
            	if (game.getRaptorsInHangar() === 0) {
					game.narrateAll("No raptors left to risk");
					return false;
				}
                game.afterRoll = next => {
                    let roll = next.roll;
                    next.setActiveRoll(roll);
                    if (roll > 2) {
                        next.narrateAll("The scout was successful!");	
                    	next.choose({
							who : WhoEnum.ACTIVE,
							text : "Look at crisis or destination deck?",
							options: second => ["Crisis","Destination"],
							choice1 : second => {
								second.narrateAll(second.getPlayers()[second.getActivePlayer()].character.name+" looks at the crisis deck");
								second.setActiveScout(second.drawCard(second.getDecks()[DeckTypeEnum.CRISIS]));				
								for(let i=0;i<players.length;i++){
									second.sendGameState(i);
								}
								second.choose({
									who : WhoEnum.ACTIVE,
									text : "Place at top or bottom?",
									options: third => ["Top","Bottom"],
									choice1 : third => {
										third.narrateAll(third.getPlayers()[third.getActivePlayer()].character.name+" places crisis at the top of the deck");
										third.getDecks()[DeckTypeEnum.CRISIS].deck.push(third.getActiveScout());
										third.setActiveScout(null);		
										third.setPhase(GamePhaseEnum.MAIN_TURN);
									},
									choice2 : third => {
										third.narrateAll(third.getPlayers()[third.getActivePlayer()].character.name+" places crisis at the bottom of the deck");
										third.getDecks()[DeckTypeEnum.CRISIS].deck.unshift(third.getActiveScout());
										third.setActiveScout(null);		
										third.setPhase(GamePhaseEnum.MAIN_TURN);
									},
								});
							},
							choice2 : second => {
								second.narrateAll(second.getPlayers()[second.getActivePlayer()].character.name+" looks at the destination deck");
								second.setActiveScout(second.drawCard(second.getDecks()[DeckTypeEnum.DESTINATION]));				
								for(let i=0;i<players.length;i++){
									second.sendGameState(i);
								}
								second.choose({
									who : WhoEnum.ACTIVE,
									text : "Place at top or bottom?",
									options: third => ["Top","Bottom"],
									choice1 : third => {
										third.narrateAll(third.getPlayers()[third.getActivePlayer()].character.name+" places destination at the top of the deck");
										third.getDecks()[DeckTypeEnum.DESTINATION].deck.push(third.getActiveScout());
										third.setActiveScout(null);		
										third.setPhase(GamePhaseEnum.MAIN_TURN);
									},
									choice2 : third => {
										third.narrateAll(third.getPlayers()[third.getActivePlayer()].character.name+" places destination at the bottom of the deck");
										third.getDecks()[DeckTypeEnum.DESTINATION].deck.unshift(third.getActiveScout());
										third.setActiveScout(null);		
										third.setPhase(GamePhaseEnum.MAIN_TURN);
									},
								});
							},
						});
                    } else {
                        next.narrateAll("Raptor destroyed!");
                        next.addRaptor(-1);
                        next.setPhase(GamePhaseEnum.MAIN_TURN);
                        next.doPostAction();
                    }
                };
                game.narrateAll(game.getPlayers()[game.getCurrentPlayer()].character.name+" launches a scout");
                game.setUpRoll(8, WhoEnum.ACTIVE, "If 3 or higher, "+game.getPlayers()[game.getCurrentPlayer()].character.name+
                	" looks at the top card of crisis or destination deck and puts it at top or bottom. Otherwise destroy a raptor");
                return true;
            case "Planning":
                break;
			default:
				return false;
		}
	};
	
	this.repairVipers = function(num,includeDestroyed){
		repairVipers(num,includeDestroyed);
	};
	
	let repairVipers = function(num,includeDestroyed){
		if(includeDestroyed){
			let vipersInSpace=0;
			for(let s in SpaceEnum){
				for(let i=0;i<spaceAreas[SpaceEnum[s]].length;i++) {
					if (spaceAreas[SpaceEnum[s]][i].type === ShipTypeEnum.VIPER) {
						vipersInSpace++;
					}
				}
			}
			let destroyedVipers=NUMBER_OF_VIPERS-vipersInSpace-vipersInHangar-damagedVipers;
			if(destoyedVipers>0){
				sendNarrationToAll(players[activePlayer].character.name + " repairs "+destroyedVipers+" destroyed viper(s)",game.gameId);
			}
			for(let i=0;i<destroyedVipers&&num>0;i++){
				vipersInHangar++;
				num--;
			}
			if(num===0){
				return;
			}
		}
		
		if(num>vipersInHangar){
			num=vipersInHangar;
		}
		
		if(num>0){
			damagedVipers-=num;
			vipersInHangar+=num;
			sendNarrationToAll(players[activePlayer].character.name + " repairs "+numVipers+" damaged viper(s)",game.gameId);
			return;
		}else{
			sendNarrationToPlayer(players[activePlayer].userId, 'No damaged vipers to repair');
			return;
		}
	};

	let repairVipersOrHangarDeck = function(repairViper){
        if(!repairViper){
            if(damagedLocations[LocationEnum.HANGAR_DECK]){
                sendNarrationToAll(players[activePlayer].character.name + " repairs the "+LocationEnum.HANGAR_DECK,game.gameId);
                damagedLocations[LocationEnum.HANGAR_DECK]=false;
                return true;
            }else{
                sendNarrationToPlayer(players[activePlayer].userId, 'Nothing to repair');
                return false;
            }
        }else{
        	repairVipers(2,false);          
		}
	};

	let doCharacterAction = function(){
		if(players[activePlayer].isRevealedCylon){
			sendNarrationToPlayer(players[activePlayer].userId, "Revealed cylons can't use character abilities!");
			return;
		}
		
        switch(players[activePlayer].character.name){
        	case base.CharacterMap.BALTAR.name:
        		if(!players[activePlayer].usedOncePerGame){
                    sendNarrationToAll(players[activePlayer].character.name + " uses the Cylon Detector!",game.gameId);
                    players[activePlayer].usedOncePerGame=true;
                    addToActionPoints(-1);
                    base.CharacterMap.BALTAR.oncePerGame(game);
                }else{
                    sendNarrationToPlayer(players[activePlayer].userId, 'Already used your once per game');
                }
        		break;
            case base.CharacterMap.LADAMA.name:
                if(!players[activePlayer].usedOncePerGame){
                    sendNarrationToAll(players[activePlayer].character.name + " uses CAG ability to activate up to 6 vipers!",game.gameId);
                    players[activePlayer].usedOncePerGame=true;
                    vipersToActivate = 6;
                    addToActionPoints(-1);
                    phase = GamePhaseEnum.CHOOSE_VIPER;
                }else{
                    sendNarrationToPlayer(players[activePlayer].userId, 'Already used your once per game');
                }
                break;
            case base.CharacterMap.TIGH.name:
                if(!players[activePlayer].usedOncePerGame){
                    sendNarrationToAll(players[activePlayer].character.name + " declares martial law!",game.gameId);
                    if(currentAdmiral!==currentPresident){
                        sendNarrationToAll(players[currentAdmiral].character.name + " takes the presidency from "+players[currentPresident].character.name,game.gameId);
                    }else{
                        sendNarrationToAll("Admiral"+players[currentAdmiral].character.name + " was already the president!",game.gameId);
                    }
                    currentPresident=currentAdmiral;
                    players[activePlayer].usedOncePerGame=true;
                    addToActionPoints(-1);
                }else{
                    sendNarrationToPlayer(players[activePlayer].userId, 'Already used your once per game');
                }
                break;
            default:
                break;
        }
    };

	let doMainTurn = function(text){
        if(text.toUpperCase()==="CHARACTER"){
            doCharacterAction();
            return;
        }else if(text.substr(0,4).toUpperCase()==="HAND" && text.length>5){
			if(players[activePlayer].isRevealedCylon){
                sendNarrationToPlayer(players[activePlayer].userId, 'Revealed cylons can\'t use skill card abilities!');
                return;
			}
            let num=parseInt(text.substr(5));
            if(isNaN(num) || num<0 || num>=players[activePlayer].hand.length){
                sendNarrationToPlayer(players[activePlayer].userId, 'Not a valid hand card');
                return;
            }

            let card=players[activePlayer].hand[num];
            if(playSkillCardAction(readCard(card))){
            	players[activePlayer].hand.splice(num,1);
                addToActionPoints(-1);
			}
            return;
		}else if(text.substr(0,6).toUpperCase()==="QUORUM" && text.length>7){
            if(players[activePlayer].isRevealedCylon){
                sendNarrationToPlayer(players[activePlayer].userId, 'Revealed cylons can\'t use quorum card abilities!');
                return;
            }
            let num=parseInt(text.substr(7));
            if(isNaN(num) || num<0 || num>=quorumHand.length){
                sendNarrationToPlayer(players[activePlayer].userId, 'Not a valid quorum card');
                return;
            }
            if(readCard(quorumHand[num]).name===base.QuorumMap.PRESIDENTIAL_PARDON.name){
                let foundBrig=false;
                for(let i=0;i<players.length;i++){
                    if(players[i].location===LocationEnum.BRIG){
                        foundBrig=true;
                        break;
                    }
                }
                if(!foundBrig){
                    sendNarrationToPlayer(players[activePlayer].userId, 'No one is in the Brig');
                    return;
                }
            }
            playQuorumCard(num);
            return;
        }if(text.toUpperCase()==="ACTIVATE"){
		    if(players[activePlayer].character.name===base.CharacterMap.ZAREK.name&&players[activePlayer].location!==LocationEnum.BRIG){
                for(let i=0;i<players.length;i++){
                    if(i!==activePlayer&&players[i].location===players[activePlayer].location){
                        sendNarrationToPlayer(players[activePlayer].userId, "You can't do that because you're a convicted criminal!");
                        return;
                    }
                }
            }
            let success=activateLocation(players[activePlayer].location);
            if(success && players[activePlayer].viperLocation===-1){
                addToActionPoints(-1);
            }
            return;
        }else if(text.toUpperCase()==="NUKE"){
			if(activePlayer!==currentAdmiral){
                sendNarrationToPlayer(players[activePlayer].userId, "You're not the admiral!");
                return;
            }else if(nukesRemaining===0){
                sendNarrationToPlayer(players[activePlayer].userId, "No nukes left");
				return;
			}
            let count=countShips();
            if(count[ShipTypeEnum.BASESTAR]===0){
                sendNarrationToPlayer(players[activePlayer].userId, "No basestars to nuke");
                return;
            }
            addToActionPoints(-1);
            phase = GamePhaseEnum.LAUNCH_NUKE;
            sendNarrationToPlayer(players[activePlayer].userId, "Select the space location and number of the basestar to nuke");
            return;
        }else if(text.toUpperCase().substr(0,7)==="LOYALTY"){
            let num=parseInt(text.substr(8));
            if(isNaN(num) || num<0 || num>players[activePlayer].loyalty.length){
                sendNarrationToPlayer(players[activePlayer].userId, 'Not a valid card');
                return;
            }else if(players[activePlayer].loyalty[num].role!=="cylon"){
                sendNarrationToPlayer(players[activePlayer].userId, 'Not a cylon card');
                return;
            }
            addToActionPoints(-1);
            runCylonReveal(num);
            return;
        }else if(text.toUpperCase()==="NOTHING"){
            addToActionPoints(-1);
            return;
		}

		if(activeMovementRemaining>0){
			if(LocationEnum[text]!=null){
				game.doMovement(text);
				return;
			}
        }

        if(players[activePlayer].viperLocation!==-1&&SpaceEnum[text]!=null){
            if(isAdjacentSpace(SpaceEnum[text],players[activePlayer].viperLocation)){
                for(let i=0;i<spaceAreas[players[activePlayer].viperLocation].length;i++){
                    if(spaceAreas[players[activePlayer].viperLocation][i].pilot===activePlayer){
                        let v = spaceAreas[players[activePlayer].viperLocation][i];
                        spaceAreas[players[activePlayer].viperLocation].splice(i,1);
                        spaceAreas[SpaceEnum[text]].push(v);
                        sendNarrationToAll(players[activePlayer].character.name +
                            " moves in viper from "+players[activePlayer].viperLocation+" to "+SpaceEnum[text],game.gameId);
                        players[activePlayer].viperLocation=SpaceEnum[text];
                        if(currentMovementRemaining>0){
                            currentMovementRemaining--;
						}else{
                        	addToActionPoints(-1);
						}
                        break;
                    }
                }
            }
        }else if(players[activePlayer].viperLocation!==-1){
            let loc=text.split(" ")[0];
            let num=text.split(" ")[1];
            if(loc==null||SpaceEnum[loc]==null||isNaN(num) || num<0 || num>=spaceAreas[players[activePlayer].viperLocation].length){
                sendNarrationToPlayer(players[activePlayer].userId, 'Not a valid ship location');
                return;
            }
            game.attackCylonShip(SpaceEnum[loc],num,false);
            return;
		}

		return;
	};

	this.doMovement = function(text){
        if(LocationEnum[text]==null) {
            sendNarrationToPlayer(players[activePlayer].userId, "Not a location");
            return false;
        }
        let l=text;
        if(players[activePlayer].location === LocationEnum[l]){
            sendNarrationToPlayer(players[activePlayer].userId, "You are already there!");
            return false;
        }else if(players[activePlayer].location === LocationEnum.BRIG){
            sendNarrationToPlayer(players[activePlayer].userId, "You can't just walk out of the Brig!");
            return false;
        }else if(LocationEnum[l] === LocationEnum.SICKBAY||LocationEnum[l] === LocationEnum.BRIG){
            sendNarrationToPlayer(players[activePlayer].userId, "You can't move to hazardous locations!");
            return false;
        }else if(inPlay.indexOf(InPlayEnum.BOMB_ON_COLONIAL_1)!==-1&&isLocationOnColonialOne(LocationEnum[l])){
        	sendNarrationToPlayer(players[activePlayer].userId, "Colonial One was destroyed!");
            return false;
        }

        if(players[activePlayer].isRevealedCylon && LocationEnum[l]!==LocationEnum.CAPRICA&&LocationEnum[l]!==
            LocationEnum.CYLON_FLEET&&
            LocationEnum[l]!==LocationEnum.HUMAN_FLEET&&LocationEnum[l]!==LocationEnum.RESURRECTION_SHIP) {
            sendNarrationToPlayer(players[activePlayer].userId, "You can't move there as a revealed cylon!");
            return false;
        }else if(!players[activePlayer].isRevealedCylon && (LocationEnum[l]===
                LocationEnum.CAPRICA||LocationEnum[l]===LocationEnum.CYLON_FLEET||
                LocationEnum[l]===LocationEnum.HUMAN_FLEET||LocationEnum[l]===LocationEnum.RESURRECTION_SHIP)) {
            sendNarrationToPlayer(players[activePlayer].userId,
                "You can't move there unless you're a revealed cylon!");
            return false;
        }

        if(!players[activePlayer].isRevealedCylon){
            if(players[activePlayer].viperLocation!==-1||isLocationOnColonialOne(players[activePlayer].location)
                !==isLocationOnColonialOne(LocationEnum[l])){
                if(players[activePlayer].hand.length===0){
                    sendNarrationToPlayer(players[activePlayer].userId, "Not enough cards");
                    return false;
                }

                if(players[activePlayer].viperLocation!==-1){
                    for(let i=0;i<spaceAreas[players[activePlayer].viperLocation].length;i++){
                        if(spaceAreas[players[activePlayer].viperLocation][i].pilot===activePlayer){
                            console.log("found pilot");
                            spaceAreas[players[activePlayer].viperLocation].splice(i,1);
                            break;
                        }
                    }

                    sendNarrationToAll(players[activePlayer].character.name + " stops piloting their viper",game.gameId);
                    vipersInHangar++;
                    players[activePlayer].viperLocation=-1;
                }

                players[activePlayer].location = LocationEnum[l];
                if(currentPlayer===activePlayer){
					currentMovementRemaining--;
				}
				activeMovementRemaining--;
				if(executiveOrderActive){
					activeActionsRemaining--;
				}
                sendNarrationToAll(players[activePlayer].character.name + " moves to " + LocationEnum[l],game.gameId);
                sendNarrationToPlayer(players[activePlayer].userId, "Discard a card to continue");
                phase=GamePhaseEnum.DISCARD_FOR_MOVEMENT;
                return false;
            }
        }

        players[activePlayer].location = LocationEnum[l];
        if(currentPlayer===activePlayer){
        	currentMovementRemaining--;
        }
        activeMovementRemaining--;
        if(executiveOrderActive){
        	activeActionsRemaining--;
        }
        sendNarrationToAll(players[activePlayer].character.name + " moves to " + LocationEnum[l],game.gameId);
        return true;
    };

    let moveFromBrig=function(text){
        if(game.doMovement(text)){
            game.addToActionPoints(-1);
            phase=GamePhaseEnum.MAIN_TURN;
        }else{
            sendNarrationToPlayer(players[activePlayer].userId, 'Not a valid location');
        }
    };

	let discardForMovement=function(text){
        let num=parseInt(text.substr(5,1));
        if(isNaN(num) || num<0 || num>=players[activePlayer].hand.length){
            sendNarrationToPlayer(players[activePlayer].userId, 'Not a valid card');
            return;
        }

        let cardName=readCard(players[activePlayer].hand[num]).name+" "+readCard(players[activePlayer].hand[num]).value;
        players[activePlayer].hand.splice(num,1);
        sendNarrationToAll(players[activePlayer].character.name+" discards "+cardName,game.gameId);
		phase=GamePhaseEnum.MAIN_TURN;
    };
	
	let makeChoice = text => {
		console.log("in make choice");
		console.log("choice is "+text);
		if(activeChoice.player!=null){ //Checking player choice which should not include cylon players as options
					console.log("is player type choice");

			text=parseInt(text);
			if (isNaN(text) || text < 0 || text >= choiceOptions.length){
						console.log("bad choice");

                return;   
            }
			let humans=-1;
			for(let i=0;i<players.length;i++){
				if(!players[i].isRevealedCylon){
					humans++;
					if(humans===text){
						text=i;
						break;
					}
				}
			}
		}
		choiceOptions=[];
        if (choice2 === null) {
            if (isNaN(parseInt(text)) || parseInt(text) < 0)
                return;
            choice1(this, parseInt(text));
        } else if (choice1 === null) {
            choice1(this, text);
        } else {
            if (text === '0') choice1(this);
            else if (text === '1') choice2(this);
            else return;
        }
        if (hasAction())
            this.nextAction(this);
    };
	
	let singlePlayerDiscardPick = text => {
        let indexes = isLegitIndexString(text, players[activePlayer].hand.length, discardAmount);
        if (indexes !== false) {
            for (let x = players[activePlayer].hand.length - 1; x > -1; x--)
                if (indexes.indexOf(x) > -1)
                    this.discardSkill(activePlayer, x);
            discardAmount = 0;
            if (hasAction())
                this.nextAction(this);
        } else {
        	sendNarrationToPlayer(players[activePlayer].userId,
                `illegitimate input: please enter a string of ${discardAmount} indexes from 0 to ${
                players[activePlayer].hand.length -1}`);
        }
    };
	
	let eachPlayerDiscardPick = text => {
        let indexes = isLegitIndexString(text, players[activePlayer].hand.length, discardAmount);
        if (indexes !== false) {
            for (let x = players[activePlayer].hand.length - 1; x > -1; x--)
                if (indexes.indexOf(x) > -1)
                    this.discardSkill(activePlayer, x);
            if (++playersChecked === players.length) {
                playersChecked = 0;
                discardAmount = 0;
                this.nextAction(this);
            } else {
                nextActive();
                if (players[activePlayer].hand.length <= discardAmount) {
    //if you set discardAmount to the players hand length then it will be that way for all players who have to discard
                    while (players[activePlayer].hand.length <= discardAmount) {
                        for (let x = 0; x < discardAmount; x++)
                            this.discardRandomSkill(activePlayer);
                        if (++playersChecked === players.length) {
                            playersChecked = 0;
                            discardAmount = 0;
                            this.nextAction(this);
                            return;
                        } else {
                            nextActive();
                            sendNarrationToPlayer(players[activePlayer].userId, `Please choose ${
                                discardAmount} skill cards to discard`);
                        }
                    }
                } else sendNarrationToPlayer(players[activePlayer].userId, `Please choose ${
                    discardAmount} skill cards to discard`);
            }
        } else sendNarrationToPlayer(players[activePlayer].userId,
            `illegitimate input: please enter a string of ${discardAmount} indexes from 0 to ${
            players[activePlayer].hand.length -1}`);
    };
	
	let calculateSkillCheckCards = () => {
	    let count = 0;
        sendNarrationToAll('Two random cards are added from the destiny deck.',game.gameId);
        skillCheckCards.push(drawDestiny());
        skillCheckCards.push(drawDestiny());
	    shuffle(skillCheckCards);
	    console.log(skillCheckCards);
	    for (let x = skillCheckCards.length -1; x > -1; x--) {
	        let card = skillCheckCards[x];
	        sendNarrationToAll(`Counting skill check reveals: ${readCard(card).name} ${
	            readCard(card).value} - ${readCard(card).type}`,game.gameId);
	        if(players[currentPlayer].character.name===base.CharacterMap.BADAMA.name&&readCard(card).value===1){
	        	if(!skillCheckTypes.indexOf(readCard(card).type) > -1){
	        		sendNarrationToAll(base.CharacterMap.BADAMA.name+"'s inspirational leadership turns a negative point positive.",game.gameId);
	        	}
                count++;
            }else{
                count += readCard(card).value * (skillCheckTypes.indexOf(readCard(card).type) > -1 ? 1 : -1);
            }
        }
        sendNarrationToAll(`Skill Check count results: ${count}`,game.gameId);
        //Discard skill check cards
        for (let x = skillCheckCards.length -1; x > -1; x--) {
            let card = skillCheckCards[x];
            decks[readCard(card).type].discard.push(skillCheckCards.splice(x, 1)[0]);
        }

        console.log('skill check calculated to: ' + count);
        committee = false;
	    return count;
    };
	
	let doSkillCheckPick = text => {
		if(text.toUpperCase()==="PASS"){
            sendNarrationToAll(players[activePlayer].character.name+" passes",game.gameId);
		}else{
            let indexes = false;
            for (let x = 1; x <= players[activePlayer].hand.length; x++) {
                indexes = isLegitIndexString(text, players[activePlayer].hand.length, x);
                if (indexes !== false)
                    x = 420;
            }
            console.log(indexes);
            if (indexes === false){
                sendNarrationToPlayer(players[activePlayer].userId, 'does not compute');
                return;
            }
            if(players[activePlayer].isRevealedCylon&&indexes.length>1){
                sendNarrationToPlayer(players[activePlayer].userId, 'Can\'t contribute more than 1 card as a revealed cylon');
                return;
			}else if(players[activePlayer].location === LocationEnum.BRIG&&indexes.length>1){
                sendNarrationToPlayer(players[activePlayer].userId, 'Can\'t contribute more than 1 card from the Brig');
                return;
            }
            for (let x = 0; x < indexes.length; x++) {
                let player = players[activePlayer];
                let card = readCard(player.hand[indexes[x]]);
                let revealString = `${card.type}: ${card.name} ${card.value}`;
                sendNarrationToAll(`${player.character.name} added a ${
                    committee ? revealString : 'card'} to the skill check.`,game.gameId);
                skillCheckCards.push(player.hand.splice(indexes[x], 1)[0]);
            }
		}
        console.log('skillcheckcards: ');
		console.dir(skillCheckCards);
		
        if (++playersChecked === players.length) {
            console.log('checked');
            playersChecked = 0;
            let temp = calculateSkillCheckCards();
            if (temp >= passValue){
                sendNarrationToAll((activeCrisis==null?"Skill Check":"Crisis")+" passed!",game.gameId);
                skillPass(this);
            }else if (temp >= middleValue && middleValue !== -1) {
                sendNarrationToAll((activeCrisis==null?"Skill Check":"Crisis")+" partially passed",game.gameId);
                skillMiddle(this);
            }else{
                sendNarrationToAll((activeCrisis==null?"Skill Check":"Crisis")+" failed!",game.gameId);
                skillFail(this);
            }
        } else {
            nextActive();
            sendNarrationToPlayer(players[activePlayer].userId, skillText);
        }
    };
	
	let didSecondRound = false;
	let playDestination = card => {
        console.log("in play destination");
        console.log("card action: "+readCard(card).action);
        let cardJSON = readCard(card);
        destinationsPlayed.push(card);
        distanceTrack += cardJSON.value;
        if(readCard(card).action!=null){
            console.log("found card action");
            readCard(card).action(game, null);
            return;
        }
        game.doPostDestination();
    };

	this.doPostDestination = function(){
		this.setPhase(this.getLastPhase());
		this.setLastPhase(null);
	    activeDestinations=null;
	    
	    if (distanceTrack > 4 && !didSecondRound) {
	        didSecondRound = true;
            dealLoyaltyCards();
        }
        
        if (distanceTrack > 7) {
	        //end game?
        }    
	    
	    this.doPostAction();
    };
    
    let activateLocation=function(location){
		if(damagedLocations[location]){
            sendNarrationToPlayer(players[activePlayer].userId, location+" is damaged!");
            return false;
        }
        switch (location) {
            //Colonial One
            case LocationEnum.PRESS_ROOM:
                sendNarrationToAll(players[activePlayer].character.name + " activates " + LocationEnum.PRESS_ROOM,game.gameId);
                sendNarrationToAll(players[activePlayer].character.name + " draws 2 Politics skill cards",game.gameId);
                players[activePlayer].hand.push(drawCard(decks[DeckTypeEnum.POLITICS]));
                players[activePlayer].hand.push(drawCard(decks[DeckTypeEnum.POLITICS]));
                return true;
            case LocationEnum.PRESIDENTS_OFFICE:
                if(activePlayer===currentPresident){
                    base.LocationMap.PRESIDENTS_OFFICE.action(game);
                }else{
                    sendNarrationToPlayer(activePlayer, "You're not the president");
                    return false;
                }
                return false;
            case LocationEnum.ADMINISTRATION:
                sendNarrationToAll(players[activePlayer].character.name + " activates " + LocationEnum.ADMINISTRATION,game.gameId);
                base.LocationMap.ADMINISTRATION.action(game);
                return false;
            //Cylon Locations
            case LocationEnum.CAPRICA:
                base.LocationMap.CAPRICA.action(game);
                return false;
            case LocationEnum.CYLON_FLEET:
                base.LocationMap.CYLON_FLEET.action(game);
                return false;
            case LocationEnum.HUMAN_FLEET:
                return true;
            case LocationEnum.RESURRECTION_SHIP:
                base.LocationMap.RESURRECTION_SHIP.action(game);
                return false;

            //Galactica
            case LocationEnum.FTL_CONTROL:
                if (jumpTrack < JUMP_PREP_3POP_LOCATION) {
                    sendNarrationToPlayer(players[activePlayer].userId, "Jump track is in the red!");
                    return false;
                }
                game.afterRoll = game => {
					let roll = game.roll;
					if (roll < 7) {
						let popLoss = 0;
						if (game.getJumpTrack() <= JUMP_PREP_3POP_LOCATION) {
							popLoss = 3;
						} else if (game.getJumpTrack() <= JUMP_PREP_1POP_LOCATION) {
							popLoss = 1;
						}
						sendNarrationToAll(popLoss + " population was left behind!",game.gameId);
						game.addPopulation(-popLoss);
					} else {
						sendNarrationToAll("Everyone made it safely!",game.gameId);
					}
					game.setPhase(GamePhaseEnum.MAIN_TURN);
					game.jump();
				};
                sendNarrationToAll(players[activePlayer].character.name + " activates " + LocationEnum.FTL_CONTROL,game.gameId);
				game.setUpRoll(8, WhoEnum.ACTIVE, "Activating FTL control");
                return true;
			case LocationEnum.WEAPONS_CONTROL:
				let cylonShipFound=false;
				for(let s in SpaceEnum){
					for(let i=0;i<spaceAreas[SpaceEnum[s]].length;i++){
						let ship=spaceAreas[SpaceEnum[s]][i];
						if(ship.type===ShipTypeEnum.BASESTAR||ship.type===ShipTypeEnum.RAIDER||ship.type===ShipTypeEnum.HEAVY_RAIDER){
							cylonShipFound=true;
							break;
						}
					}
					if(cylonShipFound){
						break;
					}
				}
				if(!cylonShipFound){
					game.narratePlayer(game.getActivePlayer(), "No cylon ships to attack");            
					return;
				}
                base.LocationMap.WEAPONS_CONTROL.action(game);
                return false;
            case LocationEnum.COMMUNICATIONS:
                if(inPlay.indexOf(InPlayEnum.JAMMED_ASSAULT)!==-1){
                    sendNarrationToPlayer(players[activePlayer].userId, "Communications has been jammed!");
                    return;
                }
                sendNarrationToAll(players[activePlayer].character.name + " activates " + LocationEnum.COMMUNICATIONS,game.gameId);
                sendNarrationToPlayer(players[activePlayer].userId, "Select a space location and a ship number");
                let count=countShips();
                if(count[ShipTypeEnum.CIVILIAN]===0){
                    sendNarrationToPlayer(players[activePlayer].userId, "No civilian ships to activate");
                    return;
				}else if(count[ShipTypeEnum.CIVILIAN]===1){
                    civilianShipsToReveal=1;
                }else{
                    civilianShipsToReveal=2;
                }
                phase = GamePhaseEnum.REVEAL_CIVILIANS;
                return true;
            case LocationEnum.RESEARCH_LAB:
                sendNarrationToAll(players[activePlayer].character.name + " activates " + LocationEnum.RESEARCH_LAB,game.gameId);
                sendNarrationToPlayer(players[activePlayer].userId, "Select 0 for Engineering or 1 for Tactics");
                phase = GamePhaseEnum.PICK_RESEARCH_CARD;
                return true;
            case LocationEnum.COMMAND:
                sendNarrationToAll(players[activePlayer].character.name + " activates " + LocationEnum.COMMAND,game.gameId);
                sendNarrationToPlayer(players[activePlayer].userId,
                    "Select a viper to activate, or select the SW or SE space area to launch a viper");
                vipersToActivate = 2;
                phase = GamePhaseEnum.CHOOSE_VIPER;
                return true;
            case LocationEnum.ADMIRALS_QUARTERS:
                if(players[activePlayer].character.name===base.CharacterMap.BADAMA.name){
                    sendNarrationToPlayer(players[activePlayer].userId, "You're too attached to send anyone to the brig!");
                    return false;
                }
                base.LocationMap.ADMIRALS_QUARTERS.action(game);
                return false;
            case LocationEnum.HANGAR_DECK:
				if(players[activePlayer].viperLocation!==-1){
                    sendNarrationToPlayer(players[activePlayer].userId, "You're already piloting a viper!");
                    return false;
				}else if(players[activePlayer].character.skills.Piloting == null) {
                    sendNarrationToPlayer(players[activePlayer].userId, "You're not a pilot!");
                    return false;
                }else if(vipersInHangar>0){
                    sendNarrationToAll(players[activePlayer].character.name+" activates "+LocationEnum.HANGAR_DECK,game.gameId);
                    sendNarrationToPlayer(players[activePlayer].userId,
                        "Select 0 for Southwest launch or 1 for Southeast launch");
                    addToActionPoints(1);
                    phase=GamePhaseEnum.PICK_LAUNCH_LOCATION;
                    return true;
				}else{
                    sendNarrationToPlayer(players[activePlayer].userId, "No vipers left to pilot");
            		return false;
				}
                return true;
            case LocationEnum.ARMORY:
                base.LocationMap.ARMORY.action(game);
                return false;
            case LocationEnum.SICKBAY:
                sendNarrationToPlayer(players[activePlayer].userId, "Can't activate sickbay");
                return false;
            case LocationEnum.BRIG:
                base.LocationMap.BRIG.action(game);
                return true;
            default:
                return false;
        }



	};

    let playStrategicPlanning = (text, userId) => {
        //get player index
        let player = -1;
        for (let x = 0; x < players.length; x++)
            if (players[x].userId === userId)
                player = x;
            
        if(players[player].isRevealedCylon){
        	sendNarrationToPlayer(userId, "Can't play skill cards as a revealed cylon!");
            return;
        }
        
        if (!strategicPlanning) {
            text = parseInt(text.substr(5));
            if (!isNaN(text)) {
                if (players[player].hand.length > 0)
                    if (text < players[player].hand.length && text > -1)
                        if (readCard(players[player].hand[text]).name === 'Planning') {
                            sendNarrationToAll(`${players[player].character.name
                                } played a strategic planning card to increase die roll by 2`,game.gameId);
                            this.discardSkill(player, text);
                            strategicPlanning = true;
                            clearTimeout(game.getActiveTimer());
                            doRoll();
                            return;
                        }

            }
        }
        sendNarrationToPlayer(userId, strategicPlanning ?
            'Someone already played a strategic planning' : 'That is not a strategic planning!');
    };
    
    let playBeforeSkillCheck = (text, userId) => {
    	//get player
        let player = getPlayerNumberById(userId);

    	if(players[player].isRevealedCylon){
			sendNarrationToPlayer(players[activePlayer].userId, 'Revealed cylons can\'t use skill card abilities!');
			return;
		}
        text = parseInt(text);
        
        //validate is legit skill card index
        if (isNaN(text)){
            return;
        }
        if (text < 0 || text >= players[player].hand.length){
            return;
        }
        
        let cardPlayed = false;
        
        switch (readCard(players[player].hand[text]).name) {
            
            case 'Research' :
                if (!research){
                	sendNarrationToAll(players[player].character.name + " plays Scientific Research",game.gameId);
                	research = true;
                    cardPlayed = true;
                }else{
                	sendNarrationToPlayer(players[player].userId, 'Already played');
                	return;
                }
                break;
            
            case  'Committee' :
                if (!committee){
                	sendNarrationToAll(players[player].character.name + " plays Investigative Committee",game.gameId);
                	committee = true;
                    cardPlayed = true;
                }else{
                	sendNarrationToPlayer(players[player].userId, 'Already played');
                	return;
                }
                break;
            
        }
        if (cardPlayed){
            game.discardSkill(player, text);
            for(let i=0;i<players.length;i++){
				sendGameState(i);
			}
        }
        
    };
    
    this.runCommand= function(text,userId){
        text=text.toString();
    
        if (phase === GamePhaseEnum.ROLL_DIE) {
            playStrategicPlanning(text, userId);
            return;
        }
    
        if (phase === GamePhaseEnum.BEFORE_SKILL_CHECK) {
        	if(text.substr(0,4).toUpperCase()==="HAND"){
				let num=text.substr(5);     	
				playBeforeSkillCheck(num, userId);
				return;
            }else{
				return;
            }
        }
        
    	if(text.toUpperCase()==="HAND"){
            let hand=players[getPlayerNumberById(userId)].hand;
            let handText="Hand:<br>";
    		for(let i=0;i<hand.length;i++){
                handText+=i+": "+hand[i].name+" "+hand[i].value+" - "+hand[i].type+"<br>";
			}
            sendNarrationToPlayer(userId, handText);
            return;
		}else if (text.toUpperCase()==="LOYALTY") {
            let loyalty=players[getPlayerNumberById(userId)].loyalty;
            let loyaltyText="Loyalty:<br>";
            for(let i=0;i<loyalty.length;i++){
                loyaltyText+=loyalty[i].name+"- "+loyalty[i].text+",<br>";
            }
            loyalty=players[getPlayerNumberById(userId)].revealedLoyalty;
            loyaltyText+="Revealed:<br>";
            for(let i=0;i<loyalty.length;i++){
                loyaltyText+=loyalty[i].name+"- "+loyalty[i].text+",<br>";
            }
            sendNarrationToPlayer(userId, loyaltyText);
            return;
        }else if (text.toUpperCase()==="PLAYERS") {
    	    let list = '';
    	    for (let x = 0; x < players.length; x++)
    	        list += `(${x} - ${players[x].character.name}) `;
    	    sendNarrationToPlayer(userId, list);
    	    return;
        }else if(text.toUpperCase()==="TITLES"){
            let msg="";
            msg+="President: "+players[currentPresident].character.name+"<br>";
            msg+="Admiral: "+players[currentAdmiral].character.name+"<br>";
            sendNarrationToPlayer(userId, msg);
            return;
        }else if(text.toUpperCase()==="QUORUM"){
            if(getPlayerNumberById(userId)===currentPresident){
            	let msg="Quorum: ";
            	for(let i=0;i<quorumHand.length;i++){
            		msg+=readCard(quorumHand[i]).name+",";
				}
                sendNarrationToPlayer(userId, msg);
            }else{
                sendNarrationToPlayer(userId, "You're not the president");
            }
            return;
        }else if(text.toUpperCase()==="LOCATION"){
            sendNarrationToPlayer(userId, players[getPlayerNumberById(userId)].location);
            if(players[getPlayerNumberById(userId)].viperLocation!==-1){
                sendNarrationToPlayer(userId, "& in a viper at "+players[getPlayerNumberById(userId)].viperLocation);
			}
            return;
        }else if(text.toUpperCase()==="LOCATIONS"){
            for(let i=0;i<players.length;i++){
                sendNarrationToPlayer(userId, players[i].character.name+": "+players[i].location);
            }
            return;
        }else if(text.toUpperCase()==="SPACE"){
        	let msg="";
            for(let s in SpaceEnum){
            	msg=SpaceEnum[s]+": ";
            	for(let i=0;i<spaceAreas[SpaceEnum[s]].length;i++){
            		msg+=spaceAreas[SpaceEnum[s]][i].type;
            		if(spaceAreas[SpaceEnum[s]][i].pilot!==-1){
                        msg+=" & pilot "+players[spaceAreas[SpaceEnum[s]][i].pilot].character.name;
					}
                    if(spaceAreas[SpaceEnum[s]][i].damage[0]!==-1){
                        msg+=" with "+spaceAreas[SpaceEnum[s]][i].damage[0]+" damage";
                        if(spaceAreas[SpaceEnum[s]][i].damage[1]!==-1){
                            msg+=" and "+spaceAreas[SpaceEnum[s]][i].damage[1]+" damage";
						}
                    }
                    msg+=", ";
                }
                sendNarrationToPlayer(userId, msg);
            }
            return;
        }else if(text.toUpperCase()==="MOVEACTION"){
            sendNarrationToPlayer(userId, "Active movement remaining: "+activeMovementRemaining);
            sendNarrationToPlayer(userId, "Active actions remaining: "+activeActionsRemaining);
            sendNarrationToPlayer(userId, "Current movement remaining: "+currentMovementRemaining);
            sendNarrationToPlayer(userId, "Current actions remaining: "+currentActionsRemaining);
            return;
        }else if(text.toUpperCase()==="GALACTICA") {
        	let msg="";
        	msg+="Fuel:"+fuelAmount+" Food:"+foodAmount+" Morale:"+moraleAmount+" Population:"+populationAmount+"<br>";
        	msg+="Vipers: hangar-"+vipersInHangar+" damaged-"+damagedVipers+"<br>";
            msg+="Raptors: "+raptorsInHangar+"<br>";
        	msg+="Damaged Locations: ";
        	for(let type in GalacticaDamageTypeEnum){
        		if(damagedLocations[GalacticaDamageTypeEnum[type]]){
                    msg+=GalacticaDamageTypeEnum[type]+",";
                }
            }
            msg+="<br>";
        	msg+="Centurions:"+centurionTrack+"<br>";
            msg+="Jump:"+jumpTrack+"/5";
            sendNarrationToPlayer(userId, msg);
            return;
        }else if(text.toUpperCase()==="INPLAY") {
            sendNarrationToPlayer(userId, this.getInPlay());
            return;
        }else if(text.toUpperCase()==="PHASE"){
            sendNarrationToPlayer(userId, phase);
            return;
        }else if(players[activePlayer].userId!==userId){
        	sendNarrationToPlayer(userId, 'It is not your turn to act!');
            return;
        }
        if(phase===GamePhaseEnum.PICK_CHARACTERS){
            chooseCharacter(text);
        }else if(phase===GamePhaseEnum.PICK_HYBRID_SKILL_CARD){
            pickHybridSkillCard(text);
        }else if(phase===GamePhaseEnum.PICK_RESEARCH_CARD){
            pickResearchCard(text);
        }else if(phase===GamePhaseEnum.PICK_LAUNCH_LOCATION||phase===GamePhaseEnum.LADAMA_STARTING_LAUNCH){
            pickLaunchLocation(text);
        }else if(phase===GamePhaseEnum.CHOOSE_VIPER){
            chooseViper(text);
        }else if(phase===GamePhaseEnum.ACTIVATE_VIPER){
            activateViper(text);
        }else if(phase===GamePhaseEnum.ATTACK_CENTURION){
            attackCenturion(text);
        }else if(phase===GamePhaseEnum.WEAPONS_ATTACK){
            weaponsAttack(text);
        }else if(phase===GamePhaseEnum.REVEAL_CIVILIANS){
            revealCivilians(text);
        }else if(phase===GamePhaseEnum.MOVE_CIVILIANS){
            moveCivilians(text);
        }else if(phase===GamePhaseEnum.PLACE_SHIPS){
            placeShips(text);
        }else if(phase===GamePhaseEnum.MAXIMUM_FIREPOWER){
            runMaximumFirepower(text);
        }else if(phase===GamePhaseEnum.MAIN_TURN){
            doMainTurn(text);
        }else if(phase===GamePhaseEnum.DISCARD_FOR_MOVEMENT){
            discardForMovement(text);
        }else if(phase===GamePhaseEnum.MOVE_FROM_BRIG){
            moveFromBrig(text);
        }else if(phase===GamePhaseEnum.CHOOSE){
            makeChoice(text);
        }else if (phase === GamePhaseEnum.SKILL_CHECK) {
            doSkillCheckPick(text);
        }else if (phase === GamePhaseEnum.EACH_PLAYER_DISCARDS) {
            eachPlayerDiscardPick(text)
        }else if (phase === GamePhaseEnum.SINGLE_PLAYER_DISCARDS) {
            singlePlayerDiscardPick(text);
        }else if (phase === GamePhaseEnum.LAUNCH_NUKE) {
            launchNuke(text);
        }else if (phase === GamePhaseEnum.CYLON_DAMAGE_GALACTICA) {
            cylonDamageGalactica(text);
        }
        console.log("about to do post action from run command");
        
        //maybe put this somewhere else
        //for (let x = 0; x < players.length; x++)
        //    players[x].hand = sortSkills(players[x].hand);
        
        
        game.doPostAction();
	};

    this.doPostAction = function(){
    	if(phase===GamePhaseEnum.MAIN_TURN&&activeActionsRemaining===0){
    		executiveOrderActive=false;
    		activePlayer=currentPlayer;
    	}
    	if(activePlayer===currentPlayer){
			if(currentActionsRemaining===0&&phase===GamePhaseEnum.MAIN_TURN&&!players[currentPlayer].isRevealedCylon&&players[activePlayer].location !== LocationEnum.BRIG){
				doCrisisStep();
			}else if(currentActionsRemaining===0&&phase===GamePhaseEnum.MAIN_TURN){
				nextTurn();
			}
        }
        if(phase===GamePhaseEnum.END_TURN){
    		this.nextTurn();
    	}
        for(let i=0;i<players.length;i++){
            sendGameState(i);
        }
    };
	
	this.save = () => {
	    let savedGame = {};
	    savedGame.gameId = this.gameId;
	    savedGame.players = players;
	    savedGame.currentPlayer = currentPlayer;
	    savedGame.phase = phase;
	    savedGame.activePlayer = activePlayer;
	    savedGame.currentMovmentRemaining = currentMovementRemaining;
	    savedGame.activeMovementRemaining = activeMovementRemaining;
        savedGame.currentActionsRemaining = currentActionsRemaining;
        savedGame.activeActionsRemaining = activeActionsRemaining;
        savedGame.spaceAreas = spaceAreas;
        savedGame.availableCharacters = availableCharacters;
        savedGame.charactersChosen = charactersChosen;
        savedGame.discardAmount = discardAmount;
        savedGame.activeCrisis = activeCrisis;
        savedGame.revealSkillChecks = committee;
        
        //functions
        savedGame.nextAction = hasAction() ? ('' + this.nextAction) : 'null';
        savedGame.choice1 = choice1 != null ? (choice1 + '') : 'null';
        savedGame.choice2 = choice2 != null ? (choice1 + '') : 'null';
        
        
        savedGame.choiceText = choiceText;
        savedGame.playersChecked = playersChecked;
        savedGame.passValue = passValue;
        savedGame.middleValue = middleValue;
        savedGame.skillText = skillText;
        savedGame.skillCheckTypes = skillCheckTypes;
        
        //functions
        savedGame.skillPass = skillPass + '';
        savedGame.skillMiddle = skillMiddle + '';
        savedGame.skillFail = skillFail + '';
        
        
        savedGame.vipersInHangar = vipersInHangar;
        savedGame.raptorsInHangar = raptorsInHangar;
        savedGame.damagedVipers = damagedVipers;
        savedGame.fuelAmount = fuelAmount;
        savedGame.foodAmount = foodAmount;
        savedGame.moraleAmount = moraleAmount;
        savedGame.populationAmount = populationAmount;
        savedGame.inPlay = inPlay;
        savedGame.centurionTrack = centurionTrack;
        savedGame.jumpTrack = jumpTrack;
        savedGame.distanceTrack = distanceTrack;
        savedGame.damagedLocations = damagedLocations;
        savedGame.nukesRemaining = nukesRemaining;
        savedGame.currentPresident = currentPresident;
        savedGame.currentAdmiral = currentAdmiral;
        savedGame.currentArbitrator = currentArbitrator;
        savedGame.currentMissionSpecialist = currentMissionSpecialist;
        savedGame.currentVicePresident = currentVicePresident;
        savedGame.quorumHand = quorumHand;
        savedGame.skillCheckCards = skillCheckCards;
        savedGame.vipersToActivate = vipersToActivate;
        savedGame.currentViperLocation = currentViperLocation;
        savedGame.civilianShipsToReveal = civilianShipsToReveal;
        savedGame.currentCivilianShipLocation = currentCivilianShipLocation;
        savedGame.shipNumberToPlace = shipNumberToPlace;
        savedGame.shipPlacementLocations = shipPlacementLocations;
        savedGame.damageOptions = damageOptions;
        savedGame.decks = decks;
	    return savedGame;
    };
    
    this.restore = savedGame => {
        this.gameId = savedGame.gameId;
        players = savedGame.players;
        currentPlayer = savedGame.currentPlayer;
        phase = savedGame.phase;
        activePlayer = savedGame.activePlayer;
        currentMovementRemaining = savedGame.currentMovmentRemaining;
        activeMovementRemaining = savedGame.activeMovementRemaining;
        currentActionsRemaining = savedGame.currentActionsRemaining;
        activeActionsRemaining = savedGame.activeActionsRemaining;
        spaceAreas = savedGame.spaceAreas;
        availableCharacters = savedGame.availableCharacters;
        charactersChosen = savedGame.charactersChosen;
        discardAmount = savedGame.discardAmount;
        activeCrisis = savedGame.activeCrisis;
        committee = savedGame.revealSkillChecks;
        
        //functions
        this.nextAction = eval(savedGame.nextAction);
        choice1 = eval(savedGame.choice1);
        choice2 = eval(savedGame.choice2);
    
        choiceText = savedGame.choiceText;
        playersChecked = savedGame.playersChecked;
        passValue = savedGame.passValue;
        middleValue = savedGame.middleValue;
        skillText = avedGame.skillText;
        skillCheckTypes = savedGame.skillCheckTypes;
        
        //functions
        skillPass = eval(savedGame.skillPass);
        skillMiddle = eval(savedGame.skillMiddle);
        skillFail = eval(savedGame.skillFail);
    
        vipersInHangar = savedGame.vipersInHangar;
        raptorsInHangar = savedGame.raptorsInHangar;
        damagedVipers = savedGame.damagedVipers;
        fuelAmount = savedGame.fuelAmount;
        foodAmount = savedGame.foodAmount;
        moraleAmount = savedGame.moraleAmount;
        populationAmount = savedGame.populationAmount;
        inPlay = savedGame.inPlay;
        centurionTrack = savedGame.centurionTrack;
        jumpTrack = savedGame.jumpTrack;
        distanceTrack = savedGame.distanceTrack;
        damagedLocations = savedGame.damagedLocations;
        nukesRemaining = savedGame.nukesRemaining;
        currentPresident = savedGame.currentPresident;
        currentAdmiral = savedGame.currentAdmiral;
        currentArbitrator = savedGame.currentArbitrator;
        currentMissionSpecialist = savedGame.currentMissionSpecialist;
        currentVicePresident = savedGame.currentVicePresident;
        quorumHand = savedGame.quorumHand;
        skillCheckCards = savedGame.skillCheckCards;
        vipersToActivate = savedGame.vipersToActivate;
        currentViperLocation = savedGame.currentViperLocation;
        civilianShipsToReveal = savedGame.civilianShipsToReveal;
        currentCivilianShipLocation = savedGame.currentCivilianShipLocation;
        shipNumberToPlace = savedGame.shipNumberToPlace;
        shipPlacementLocations = savedGame.shipPlacementLocations;
        damageOptions = savedGame.damageOptions;
        decks = savedGame.decks;
    };
    
    setUpNewGame();
    
}

const rollDie = () => Math.ceil(Math.random() * 8);

function buildStartingSkillCards(){
	let cards =[];
    for(let key in base.SkillCardMap){
        for (let i = 0; i < base.SkillCardMap[key].total; i++) {
            cards.push(new Card(CardTypeEnum.SKILL, key, SetEnum.BASE));
        }
    }
    shuffle(cards);
	return cards;
}

function Player(userId, username){
    this.username=username;
	this.userId=userId;
	this.gameId='none';
	this.character=-1;
	this.hand=[];
    this.superCrisisHand=[];
    this.loyalty=[];
    this.revealedLoyalty=[];
    this.usedOncePerGame=false;
	this.isRevealedCylon=false;
	this.viperLocation=-1;
	this.ready = false;
}

function Table(host) {
    this.host = host;
    this.gameId = Math.random().toString(36);
    this.players = [];
}

function Ship(type){
	this.type=type;
	this.location=-1;
	this.pilot=-1;
	this.damage=[-1,-1];
	this.resource=-1;
	this.activated=false;
}

io.on('connection', socket => {
    
    let userId = socket.id;
    let user;
    let name = 'error';

    //send a message to the user
    io.to(userId).emit('game_text', '<p>The server says: welcome to the server!</p>');
    
    //send a message to all connected sockets
    io.sockets.emit('game_text', '<p>A new user has just connected</p>');
    
    //receives emit type 'text' and sends the data back to all clients
    //this can be expanded to do diffrent things depending on what data is
    socket.on('chat', text => io.sockets.emit('chat', text));
    
    //logs in user if username not in use
    socket.on('login', username => {
      
        let available = true;
        for (let id in users)
            if (users[id].username === username)
                available = false;
        if (available) {
    
            name = username;
            io.to(userId).emit('login', name);
            
            if (username in offLineUsers) {
                let oldUser = offLineUsers[username];
                let game = games[oldUser.gameId];
                
                users[userId] = game.getPlayers()[oldUser.index];
                users[userId].userId = userId;
                user = users[userId];
                
                io.to(userId).emit('clear');
                sendNarrationToPlayer(userId, 'You have re-joined the game, welcome back.');
                sendNarrationToAll(`We have regained communication with ${
                    games[user.gameId].getPlayers()[oldUser.index].character.name}`, user.gameId);
                
                delete offLineUsers[name];
                
                if (dataBaseOn) {
                    client.query(`DELETE FROM users WHERE name = '${name}';`);
                }
                
            }  else {
                
                users[userId] = new Player(userId, username);
                user = users[userId];
                lobby[name] = userId;
                for (let key in lobby)
                    io.to(lobby[key]).emit('lobby', tables);
    
            }
            
        }
    });
    
    socket.on('game_text', text => runCommand(text,userId,user.gameId));
    
    socket.on('new_table', () => {
        delete lobby[users[userId].username];
        let newTable = new Table(name);
        user.gameId = newTable.gameId;
        newTable.players.push(user);
        tables[user.gameId] = newTable;
        for (let key in lobby)
            io.to(lobby[key]).emit('lobby', tables);
        io.to(userId).emit('table', newTable);
    });
    
    socket.on('join_table', gameId =>{
        console.log('join table');
        let table = tables[gameId];
        user.gameId = gameId;
        table.players.push(user);
        delete lobby[name];
        for (let key in lobby)
            io.to(lobby[key]).emit('lobby', tables);
    
        for (let x = 0; x < table.players.length; x++)
            io.to(table.players[x].userId).emit('table', table);
    });
    
    socket.on('ready', () => {
        let table = tables[user.gameId];
        let player;
        for (let x = 0; x < table.players.length; x++)
            if (table.players[x].username === name)
                player = x;
        table.players[player].ready = !table.players[player].ready;
        
        let count = 0;
        for (let x = 0; x < table.players.length; x++)
            if (table.players[x].ready)
                count++;
        
        for (let x = 0; x < table.players.length; x++)
            io.to(table.players[x].userId).emit('table', table);
    });
    
    socket.on('start_game', handicap => {
        let table = tables[user.gameId];
        for (let x = 0; x < table.players.length; x++)
            io.to(table.players[x].userId).emit('clear');
    
        games[user.gameId] = new Game(table.players,user.gameId,handicap);
    
        if (dataBaseOn) {
            client.query(`INSERT INTO games (id, game) VALUES ('${
                user.gameId}', '${JSON.stringify(games[user.gameId].save())}');`);
        }
    
        delete tables[user.gameId];
        for (let key in lobby)
            io.to(lobby[key]).emit('lobby', tables);
    });
    
    //when a user disconnects remove them from users
    socket.on('disconnect', () => {
    
        if (name !== 'error') {
    
            if (user.gameId in tables) {
                let index;
                for (let x = 0; x < tables[user.gameId].players.length; x++)
                    if (tables[user.gameId].username === name)
                        index = x;
        
                if (name === tables[user.gameId].host) {
                    
                    //put players back in lobby
                    for (let x = 0; x < tables[user.gameId].players.length; x++)
                        if (tables[user.gameId].players[x].username !== name)
                            lobby[tables[user.gameId].players[x].username] = tables[user.gameId].players[x].userId;
                    
                    delete tables[user.gameId];
    
                } else {
                    
                    tables[user.gameId].players.splice(index, 1);
            
                    for (let x = 0; x < tables[user.gameId].players.length; x++)
                        io.to(tables[user.gameId].players[x].userId).emit('table', tables[user.gameId]);
            
                }
        
                for (let key in lobby)
                    io.to(lobby[key]).emit('lobby', tables);
        
            } else if (user.gameId in games) {
                let index = 'index finding error';
                for (let x = 0; x < games[user.gameId].getPlayers().length; x++)
                    if (games[user.gameId].getPlayers()[x].username === name)
                        index = x;
        
                sendNarrationToAll(`Oh no! we've lost communication with ${
                    games[user.gameId].getPlayers()[index].character.name}`, user.gameId);
                
                offLineUsers[name] = new LoggedOut(user.gameId, index);
                
                if (dataBaseOn) {
                    client.query(`INSERT INTO users (name, gameid, index) VALUES ('${name}','${user.gameId}',${index})`);
                }
        
            } else if (name in lobby) delete lobby[name];
    
            delete users[userId];
    
        }
        
    });
    
});

function sendGameStateToPlayer(userId, gameState){
    io.to(userId).emit('gameState', gameState);
}

function sendNarrationToPlayer(userId, narration){
	if(userId===-1){
		for(let key in users){
			io.to(users[key]).emit('game_text', narration);
		}
	}else{
		io.to(userId).emit('game_text', '<p>'+narration+"</p>");
	}
}

function sendNarrationToAll(narration, gameId){
    let game = games[gameId];
    for(let x = 0; x < game.getPlayers().length; x++){
        io.to(game.getPlayers()[x].userId).emit('game_text', "<p>"+narration+"</p>");
    }
}

function runCommand(text,userId,gameId){
	if(gameId==='none'){
        io.to(userId).emit('game_text', "<p>Game hasn't started yet</p>");
		return;
	}
	
	games[gameId].runCommand(text,userId);
    
    if (dataBaseOn) {
        client.query(`UPDATE games SET game = '${JSON.stringify(games[gameId].save())}' WHERE id = '${gameId}';`);
    }
    
}

/**
 * Shuffles array in place.
 * @param {Array} a items The array containing the items.
 */
function shuffle(a) {
    let j, x, i;
    for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
}

const isLegitIndexString = (string, max, amount) => {
    string = string.split(' ');
    let numbers = [];
    if (string.length !== amount)
        return false;
    for (x = 0; x < string.length; x++)
        if (isNaN(string[x]))
            return false;
        else if(parseInt(string[x]) >= max || parseInt(string[x]) < 0)
            return false;
        else if (numbers.indexOf(parseInt(string[x])) !== -1)
            return false;
        else numbers.push(parseInt(string[x]));
    return numbers.sort((a, b) => b - a);
};

function Card(type, key, set) {
    this.type = type;
    this.key = key;
    this.set = set;
}

const readCard = card => {
    let x = 'card reading error';
    switch (card.set) {
        case SetEnum.BASE :
            switch (card.type) {
                case CardTypeEnum.SKILL : x = base.SkillCardMap[card.key]; break;
                case CardTypeEnum.CRISIS : x = base.CrisisMap[card.key]; break;
                case CardTypeEnum.SUPER_CRISIS : x = base.SuperCrisisMap[card.key]; break;
                case CardTypeEnum.QUORUM : x = base.QuorumMap[card.key]; break;
                case CardTypeEnum.LOYALTY : x = base.LoyaltyMap[card.key]; break;
                case CardTypeEnum.DESTINATION : x = base.DestinationMap[card.key]; break;
            }
            break;
        case SetEnum.PEGASUS :
            switch (card.type) {
                case CardTypeEnum.SKILL : x = pegasus.SkillCardMap[card.key]; break;
                case CardTypeEnum.CRISIS : x = pegasus.CrisisMap[card.key]; break;
                case CardTypeEnum.SUPER_CRISIS : x = pegasus.SuperCrisisMap[card.key]; break;
                case CardTypeEnum.QUORUM : x = pegasus.QuorumMap[card.key]; break;
                case CardTypeEnum.LOYALTY : x = pegasus.LoyaltyMap[card.key]; break;
                case CardTypeEnum.DESTINATION : x = pegasus.DestinationMap[card.key]; break;
                case CardTypeEnum.CAPRICA_CRISIS : x = pegasus.CapricaCrisisMap[card.key]; break;
                case CardTypeEnum.AGENDA : x = pegasus.AgendaMap[card.key]; break;
            }
            break;
        case SetEnum.DAYBREAK :
            switch (card.type) {
                case CardTypeEnum.SKILL : x = daybreak.SkillCardMap[card.key]; break;
                case CardTypeEnum.CRISIS : x = daybreak.CrisisMap[card.key]; break;
                case CardTypeEnum.QUORUM : x = daybreak.QuorumMap[card.key]; break;
                case CardTypeEnum.LOYALTY : x = daybreak.LoyaltyMap[card.key]; break;
                case CardTypeEnum.DESTINATION : x = daybreak.DestinationMap[card.key]; break;
                case CardTypeEnum.MUTINY : x = daybreak.MutinyMap[card.key]; break;
                case CardTypeEnum.MISSION : x = daybreak.MissionMap[card.key]; break;
                case CardTypeEnum.MOTIVE : x = daybreak.MotiveMap[card.key]; break;
            }
            break;
        case SetEnum.EXODUS :
            switch (card.type) {
                case CardTypeEnum.SKILL : x = exodus.SkillCardMap[card.key]; break;
                case CardTypeEnum.CRISIS : x = exodus.CrisisMap[card.key]; break;
                case CardTypeEnum.QUORUM : x = exodus.QuorumMap[card.key]; break;
                case CardTypeEnum.LOYALTY : x = exodus.LoyaltyMap[card.key]; break;
                case CardTypeEnum.DESTINATION : x = exodus.DestinationMap[card.key]; break;
                //TODO crossroads, ally
            }
            break;
    }
    return x;
};

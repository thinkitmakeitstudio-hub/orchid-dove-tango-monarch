import { i as __toESM } from "../_runtime.mjs";
import { K as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as Backpack, a as Skull, c as Leaf, d as Flame, f as Feather, g as CloudLightning, h as Crown, i as Sparkles, l as HeartPulse, m as DoorOpen, n as Swords, o as Shield, p as Droplet, r as Sun, s as Music, u as Gem } from "../_libs/lucide-react.mjs";
import { t as create } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CTdcfIpP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ctx = null;
var muted = false;
function setMuted(next) {
	muted = next;
}
function resumeAudio() {
	const Ctx = window.AudioContext || window.webkitAudioContext;
	if (!Ctx) return;
	if (!ctx) ctx = new Ctx();
	if (ctx.state === "suspended") ctx.resume();
}
function tone(freq, dur, type, gain, when, slide = 0) {
	if (!ctx) return;
	const o = ctx.createOscillator();
	const g = ctx.createGain();
	o.type = type;
	o.frequency.setValueAtTime(freq, when);
	if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), when + dur);
	g.gain.setValueAtTime(1e-4, when);
	g.gain.exponentialRampToValueAtTime(gain, when + .012);
	g.gain.exponentialRampToValueAtTime(1e-4, when + dur);
	o.connect(g);
	g.connect(ctx.destination);
	o.start(when);
	o.stop(when + dur + .02);
}
function playSfx(kind) {
	if (muted || !ctx || ctx.state !== "running") return;
	const t = ctx.currentTime;
	if (kind === "hit") {
		tone(196, .09, "square", .05, t, -80);
		tone(90, .12, "triangle", .04, t);
	} else if (kind === "heal") {
		tone(520, .12, "sine", .04, t, 80);
		tone(780, .14, "sine", .03, t + .05);
	} else if (kind === "block") {
		tone(240, .08, "triangle", .05, t);
		tone(360, .1, "triangle", .03, t + .03);
	} else if (kind === "card") tone(660, .05, "square", .03, t);
	else if (kind === "door") tone(140, .18, "sawtooth", .03, t, -40);
	else if (kind === "rage") {
		tone(110, .28, "sawtooth", .05, t, -50);
		tone(70, .32, "square", .04, t);
	} else if (kind === "poison") tone(320, .1, "triangle", .03, t, -140);
	else if (kind === "unlock") {
		tone(523, .1, "triangle", .04, t);
		tone(659, .12, "triangle", .04, t + .08);
		tone(784, .16, "triangle", .04, t + .16);
	} else if (kind === "win") [
		523,
		659,
		784,
		1046
	].forEach((f, i) => tone(f, .18, "triangle", .04, t + i * .12));
	else if (kind === "lose") {
		tone(220, .3, "triangle", .05, t, -120);
		tone(130, .4, "sine", .04, t + .1);
	} else tone(480, .04, "square", .02, t);
}
function card(id, name, kind, target, text, effects, mana) {
	return {
		id,
		name,
		kind,
		target,
		text,
		effects,
		...mana ? { mana } : {}
	};
}
var CARDS = {};
function add(c) {
	CARDS[c.id] = c;
	return c;
}
add(card("basic-strike", "Desperate Swing", "attack", "enemy", "Deal your Attack.", [{
	op: "hit",
	bonus: 0
}]));
add(card("k-strike", "Heavy Strike", "attack", "enemy", "Deal your Attack + 2.", [{
	op: "hit",
	bonus: 2
}]));
add(card("k-guard", "Tower Guard", "guard", "none", "Gain 8 Block.", [{
	op: "block",
	amount: 8
}]));
add(card("k-bash", "Shield Bash", "attack", "enemy", "Deal your Attack. Gain 5 Block.", [{
	op: "hit",
	bonus: 0
}, {
	op: "block",
	amount: 5
}]));
add(card("k-cleave", "Cleave", "attack", "none", "Deal your Attack − 1 to every foe.", [{
	op: "hit",
	bonus: -1,
	all: true
}]));
add(card("k-taunt", "Challenge", "guard", "none", "Foes strike you this round. Gain 6 Block.", [{ op: "taunt" }, {
	op: "block",
	amount: 6
}]));
add(card("k-rally", "Rally", "guard", "none", "Every hero gains 4 Block.", [{
	op: "block",
	amount: 4,
	all: true
}]));
add(card("k-bulwark", "Bulwark", "guard", "none", "Gain 12 Block.", [{
	op: "block",
	amount: 12
}]));
add(card("k-earthsplit", "Earthsplit", "attack", "none", "Deal your Attack + 3 to every foe.", [{
	op: "hit",
	bonus: 3,
	all: true
}]));
add(card("k-kingwall", "Kingwall", "guard", "none", "Every hero gains 8 Block.", [{
	op: "block",
	amount: 8,
	all: true
}]));
add(card("b-bolt", "Arc Bolt", "attack", "enemy", "Deal your Attack + 3.", [{
	op: "hit",
	bonus: 3
}]));
add(card("b-well", "Well Bolt", "attack", "enemy", "Spend 2 mana. Deal your Attack + 8.", [{
	op: "hit",
	bonus: 8
}], 2));
add(card("b-inspire", "Inspire", "skill", "ally", "An ally gains +2 Attack for this battle.", [{
	op: "atk",
	amount: 2
}]));
add(card("b-discord", "Discord", "skill", "enemy", "A foe loses 3 Attack for this battle.", [{
	op: "weaken",
	amount: 3
}]));
add(card("b-encore", "Encore", "attack", "enemy", "Deal your Attack. You heal 4.", [{
	op: "hit",
	bonus: 0
}, {
	op: "heal",
	amount: 4,
	self: true
}]));
add(card("b-verse", "Verse", "skill", "none", "Every hero heals 3.", [{
	op: "heal",
	amount: 3,
	all: true
}]));
add(card("b-highnote", "High Note", "attack", "enemy", "Deal your Attack + 6.", [{
	op: "hit",
	bonus: 6
}]));
add(card("b-chorus", "Chorus", "skill", "none", "Every hero gains +2 Attack for this battle.", [{
	op: "atk",
	amount: 2,
	all: true
}]));
add(card("b-finale", "Finale", "attack", "none", "Deal your Attack + 3 to every foe. Every hero heals 4.", [{
	op: "hit",
	bonus: 3,
	all: true
}, {
	op: "heal",
	amount: 4,
	all: true
}]));
add(card("p-smite", "Smite", "attack", "enemy", "Deal your Attack + 2. If the foe is below half health, deal 4 more.", [{
	op: "hit",
	bonus: 2,
	smite: true
}]));
add(card("p-hands", "Lay on Hands", "skill", "ally", "Heal an ally for 8.", [{
	op: "heal",
	amount: 8
}]));
add(card("p-ward", "Holy Ward", "guard", "ally", "An ally gains 7 Block.", [{
	op: "block",
	amount: 7
}]));
add(card("p-judgment", "Judgment", "attack", "enemy", "Deal your Attack + 1. You heal 3.", [{
	op: "hit",
	bonus: 1
}, {
	op: "heal",
	amount: 3,
	self: true
}]));
add(card("p-aura", "Aura", "skill", "none", "Every hero gains 3 Block and heals 2.", [{
	op: "block",
	amount: 3,
	all: true
}, {
	op: "heal",
	amount: 2,
	all: true
}]));
add(card("p-mend", "Greater Mend", "skill", "ally", "Heal an ally for 12.", [{
	op: "heal",
	amount: 12
}]));
add(card("p-radiant", "Radiant Smite", "attack", "enemy", "Deal your Attack + 5. If the foe is below half health, deal 4 more.", [{
	op: "hit",
	bonus: 5,
	smite: true
}]));
add(card("p-sanctuary", "Sanctuary", "guard", "none", "Every hero gains 8 Block.", [{
	op: "block",
	amount: 8,
	all: true
}]));
add(card("d-thorn", "Thorn Lash", "attack", "enemy", "Deal your Attack + 1. Apply 2 Poison.", [{
	op: "hit",
	bonus: 1
}, {
	op: "poison",
	amount: 2
}]));
add(card("d-well", "Ley Thorn", "attack", "enemy", "Spend 2 mana. Deal your Attack + 3. Apply 5 Poison.", [{
	op: "hit",
	bonus: 3
}, {
	op: "poison",
	amount: 5
}], 2));
add(card("d-bark", "Barkskin", "guard", "none", "Gain 7 Block and +1 Defense for this battle.", [{
	op: "block",
	amount: 7
}, {
	op: "def",
	amount: 1
}]));
add(card("d-shed", "Shedding", "guard", "none", "Exhaust your other cards. Gain 6 Block, plus 4 for each card exhausted.", [{
	op: "exhaust",
	base: 6,
	each: 4
}]));
add(card("d-regrowth", "Regrowth", "skill", "none", "Heal 5. Gain 3 Block.", [{
	op: "heal",
	amount: 5,
	self: true
}, {
	op: "block",
	amount: 3
}]));
add(card("d-entangle", "Entangle", "skill", "enemy", "A foe skips its next action and loses 2 Attack.", [{ op: "skip" }, {
	op: "weaken",
	amount: 2
}]));
add(card("d-briar", "Briar", "attack", "enemy", "Deal your Attack + 2. Apply 4 Poison.", [{
	op: "hit",
	bonus: 2
}, {
	op: "poison",
	amount: 4
}]));
add(card("d-deeproot", "Deep Root", "skill", "none", "Every hero heals 4 and gains +1 Defense for this battle.", [{
	op: "heal",
	amount: 4,
	all: true
}, {
	op: "def",
	amount: 1,
	all: true
}]));
add(card("d-ancient", "Ancient Shedding", "guard", "none", "Exhaust your other cards. Gain 10 Block, plus 6 for each card exhausted.", [{
	op: "exhaust",
	base: 10,
	each: 6
}]));
add(card("r-shiv", "Shiv", "attack", "enemy", "Deal your Attack + 3.", [{
	op: "hit",
	bonus: 3
}]));
add(card("r-backstab", "Backstab", "attack", "enemy", "Deal your Attack + 2. If the foe is above 80% health, deal 5 more.", [{
	op: "hit",
	bonus: 2,
	openingBonus: 5
}]));
add(card("r-fade", "Fade", "guard", "none", "Gain 9 Block.", [{
	op: "block",
	amount: 9
}]));
add(card("r-venom", "Venom Blade", "attack", "enemy", "Deal your Attack. Apply 4 Poison.", [{
	op: "hit",
	bonus: 0
}, {
	op: "poison",
	amount: 4
}]));
add(card("r-flurry", "Flurry", "attack", "enemy", "Deal your Attack twice.", [{
	op: "hit",
	bonus: 0,
	hits: 2
}]));
add(card("r-garrote", "Garrote", "attack", "enemy", "Deal your Attack + 2. The foe loses 4 Attack.", [{
	op: "hit",
	bonus: 2
}, {
	op: "weaken",
	amount: 4
}]));
add(card("r-shadowstep", "Shadowstep", "attack", "enemy", "Deal your Attack + 4. Gain 4 Block.", [{
	op: "hit",
	bonus: 4
}, {
	op: "block",
	amount: 4
}]));
add(card("r-killstroke", "Killstroke", "attack", "enemy", "Deal your Attack twice, +3 each time.", [{
	op: "hit",
	bonus: 3,
	hits: 2
}]));
add(card("w-cinder", "Cinderbolt", "attack", "enemy", "Deal your Attack + 4.", [{
	op: "hit",
	bonus: 4
}]));
add(card("w-well", "Mana Pyre", "attack", "enemy", "Spend 3 mana. Deal your Attack + 12.", [{
	op: "hit",
	bonus: 12
}], 3));
add(card("w-hex", "Hex", "skill", "enemy", "A foe loses 3 Attack and gains 2 Poison.", [{
	op: "weaken",
	amount: 3
}, {
	op: "poison",
	amount: 2
}]));
add(card("w-pact", "Blood Pact", "attack", "enemy", "Lose 3 health. You cannot fall below 1. Deal your Attack + 8.", [{
	op: "wound",
	amount: 3
}, {
	op: "hit",
	bonus: 8
}]));
add(card("w-ash", "Ash Shield", "guard", "none", "Gain 8 Block.", [{
	op: "block",
	amount: 8
}]));
add(card("w-wildfire", "Wildfire", "attack", "none", "Deal your Attack + 2 to every foe.", [{
	op: "hit",
	bonus: 2,
	all: true
}]));
add(card("w-immolate", "Immolate", "attack", "enemy", "Lose 2 health. You cannot fall below 1. Deal your Attack + 10.", [{
	op: "wound",
	amount: 2
}, {
	op: "hit",
	bonus: 10
}]));
add(card("w-curse", "Cinder Curse", "skill", "enemy", "Apply 5 Poison. The foe loses 2 Attack.", [{
	op: "poison",
	amount: 5
}, {
	op: "weaken",
	amount: 2
}]));
add(card("w-cataclysm", "Cataclysm", "attack", "none", "Deal your Attack + 6 to every foe.", [{
	op: "hit",
	bonus: 6,
	all: true
}]));
add(card("c-mend", "Mend", "skill", "ally", "Heal an ally for 7.", [{
	op: "heal",
	amount: 7
}]));
add(card("c-smite", "Grave Smite", "attack", "enemy", "Deal your Attack + 3.", [{
	op: "hit",
	bonus: 3
}]));
add(card("c-sanctuary", "Hallowed Ground", "guard", "none", "Every hero gains 6 Block.", [{
	op: "block",
	amount: 6,
	all: true
}]));
add(card("c-purify", "Purify", "skill", "ally", "Clear an ally's Poison and heal 5.", [{ op: "cleanse" }, {
	op: "heal",
	amount: 5
}]));
add(card("c-requiem", "Requiem", "attack", "enemy", "Deal your Attack + 2. Every hero heals 3.", [{
	op: "hit",
	bonus: 2
}, {
	op: "heal",
	amount: 3,
	all: true
}]));
add(card("c-miracle", "Miracle", "skill", "ally", "Heal an ally for 14.", [{
	op: "heal",
	amount: 14
}]));
add(card("c-litany", "Litany", "skill", "none", "Every hero heals 6 and gains 4 Block.", [{
	op: "heal",
	amount: 6,
	all: true
}, {
	op: "block",
	amount: 4,
	all: true
}]));
add(card("c-ascension", "Ascension", "skill", "none", "Every hero heals 8 and gains +2 Attack for this battle.", [{
	op: "heal",
	amount: 8,
	all: true
}, {
	op: "atk",
	amount: 2,
	all: true
}]));
add(card("s-lance", "Storm Lance", "attack", "enemy", "Deal your Attack + 3.", [{
	op: "hit",
	bonus: 3
}]));
add(card("s-howl", "Bulwark Howl", "guard", "none", "Every hero gains 4 Block and +1 Defense for this battle.", [{
	op: "block",
	amount: 4,
	all: true
}, {
	op: "def",
	amount: 1,
	all: true
}]));
add(card("s-charge", "Beast Charge", "attack", "enemy", "Deal your Attack + 5.", [{
	op: "hit",
	bonus: 5
}]));
add(card("s-gale", "Gale", "skill", "enemy", "A foe loses 4 Attack for this battle.", [{
	op: "weaken",
	amount: 4
}]));
add(card("s-thunder", "Thunder", "attack", "none", "Deal your Attack + 1 to every foe.", [{
	op: "hit",
	bonus: 1,
	all: true
}]));
add(card("s-tempest", "Tempest", "attack", "none", "Deal your Attack + 4 to every foe.", [{
	op: "hit",
	bonus: 4,
	all: true
}]));
add(card("s-bastion", "Living Bastion", "guard", "none", "Gain 14 Block. Every other hero gains 4 Block.", [{
	op: "block",
	amount: 10
}, {
	op: "block",
	amount: 4,
	all: true
}]));
add(card("s-eye", "Eye of the Gale", "attack", "enemy", "Deal your Attack + 4. The foe loses 3 Attack.", [{
	op: "hit",
	bonus: 4
}, {
	op: "weaken",
	amount: 3
}]));
add(card("k-crest", "Holt's Oath", "attack", "enemy", "The crest answers. Deal your Attack + 4 and gain 6 Block.", [{
	op: "hit",
	bonus: 4
}, {
	op: "block",
	amount: 6
}]));
add(card("b-staff", "Staff Crescendo", "attack", "enemy", "The staff sings. Deal your Attack + 7.", [{
	op: "hit",
	bonus: 7
}]));
add(card("p-halo", "Halo Smite", "attack", "enemy", "The halo strikes. Deal your Attack + 5. Below half health, deal 4 more.", [{
	op: "hit",
	bonus: 5,
	smite: true
}]));
add(card("d-staff", "Staffroot", "attack", "enemy", "The grove staff bites. Deal your Attack + 3. Apply 4 Poison.", [{
	op: "hit",
	bonus: 3
}, {
	op: "poison",
	amount: 4
}]));
add(card("r-knives", "Veil Flurry", "attack", "enemy", "The knives answer. Deal your Attack twice, +2 each time.", [{
	op: "hit",
	bonus: 2,
	hits: 2
}]));
add(card("w-focus", "Focused Pyre", "attack", "enemy", "The focus tightens. Deal your Attack + 9.", [{
	op: "hit",
	bonus: 9
}]));
add(card("c-bell", "Bell Mend", "skill", "ally", "The bell rings. Heal an ally for 14.", [{
	op: "heal",
	amount: 14
}]));
add(card("s-totem", "Totem Gale", "guard", "none", "The totem answers. Every hero gains 8 Block.", [{
	op: "block",
	amount: 8,
	all: true
}]));
add(card("n-lash", "Grave Lash", "attack", "enemy", "Deal your Attack + 2.", [{
	op: "hit",
	bonus: 2
}]));
add(card("n-raise", "Raise Bones", "skill", "none", "Spend 2 mana. Raise a Bone Thrall. Two may stand with you.", [{
	op: "summon",
	name: "Bone Thrall",
	hp: 10,
	atk: 5
}], 2));
add(card("n-command", "Death March", "skill", "none", "Spend 1 mana. Each of your thralls strikes.", [{ op: "minion-strike" }], 1));
add(card("n-guard", "Ossuary", "guard", "none", "Gain 7 Block.", [{
	op: "block",
	amount: 7
}]));
add(card("n-drain", "Siphon", "attack", "enemy", "Deal your Attack. Heal 4.", [{
	op: "hit",
	bonus: 0
}, {
	op: "heal",
	amount: 4,
	self: true
}]));
add(card("n-legion", "Twin Raising", "skill", "none", "Spend 3 mana. Raise two Bone Thralls.", [{
	op: "summon",
	name: "Bone Thrall",
	hp: 10,
	atk: 5
}, {
	op: "summon",
	name: "Bone Thrall",
	hp: 10,
	atk: 5
}], 3));
add(card("n-grave", "Grave Wind", "attack", "none", "Spend 2 mana. Deal your Attack + 2 to every foe.", [{
	op: "hit",
	bonus: 2,
	all: true
}], 2));
add(card("n-king", "Raise the King", "skill", "none", "Spend 3 mana. Raise a Grave King. It strikes harder and lasts longer.", [{
	op: "summon",
	name: "Grave King",
	hp: 18,
	atk: 8
}], 3));
add(card("n-scepter", "Scepter Call", "skill", "none", "The scepter calls. Raise a Bone Thrall.", [{
	op: "summon",
	name: "Bone Thrall",
	hp: 12,
	atk: 6
}]));
add(card("nph-palm", "Open Palm", "attack", "enemy", "Deal your Attack + 2.", [{
	op: "hit",
	bonus: 2
}]));
add(card("nph-smite", "Godsmite", "attack", "enemy", "Deal your Attack + 4. Below half health, deal 4 more.", [{
	op: "hit",
	bonus: 4,
	smite: true
}]));
add(card("nph-aegis", "Godshell", "guard", "none", "Gain 10 Block.", [{
	op: "block",
	amount: 10
}]));
add(card("nph-wrath", "Petty Wrath", "attack", "none", "Deal your Attack to every foe.", [{
	op: "hit",
	bonus: 0,
	all: true
}]));
add(card("nph-mercy", "Mercy", "skill", "ally", "Heal an ally for 10.", [{
	op: "heal",
	amount: 10
}]));
add(card("nph-bolt", "Heaven's Bolt", "attack", "enemy", "Spend 2 mana. Deal your Attack + 9.", [{
	op: "hit",
	bonus: 9
}], 2));
add(card("nph-host", "The Host", "skill", "none", "Every hero gains 5 Block and +1 Attack for this battle.", [{
	op: "block",
	amount: 5,
	all: true
}, {
	op: "atk",
	amount: 1,
	all: true
}]));
add(card("nph-judgment", "Judgment", "attack", "none", "Spend 2 mana. Deal your Attack + 4 to every foe.", [{
	op: "hit",
	bonus: 4,
	all: true
}], 2));
add(card("nph-apocalypse", "Apocalypse", "attack", "none", "Spend 3 mana. Deal your Attack + 8 to every foe. Every hero heals 6.", [{
	op: "hit",
	bonus: 8,
	all: true
}, {
	op: "heal",
	amount: 6,
	all: true
}], 3));
add(card("nph-hand", "Hand of God", "attack", "enemy", "The godhand closes. Deal your Attack + 8 and heal 6.", [{
	op: "hit",
	bonus: 8
}, {
	op: "heal",
	amount: 6,
	self: true
}]));
add(card("cov-word", "Unpriced Word", "skill", "none", "Once this room, your next spell costs no mana.", [{ op: "free-spell" }]));
add(card("grd-blow", "Grudge Blow", "attack", "enemy", "The plate must hold 12. Deal that damage, ignoring armor, heal 8, and empty it.", [{ op: "grudge" }]));
var SUPPLIES = {};
function supply(id, name, target, text, effects, copies) {
	SUPPLIES[id] = {
		id,
		name,
		target,
		text,
		effects
	};
	return Array.from({ length: copies }, () => id);
}
var SUPPLY_DECK = [
	...supply("sup-salve", "Healing Salve", "ally", "Heal an ally for 8.", [{
		op: "heal",
		amount: 8
	}], 3),
	...supply("sup-rations", "Iron Rations", "none", "Every hero heals 4.", [{
		op: "heal",
		amount: 4,
		all: true
	}], 2),
	...supply("sup-oil", "Whetstone Oil", "ally", "An ally gains +3 Attack for this battle.", [{
		op: "atk",
		amount: 3
	}], 2),
	...supply("sup-smoke", "Smoke Vial", "enemy", "A foe skips its next action.", [{ op: "skip" }], 2),
	...supply("sup-shields", "Tower Kit", "none", "Every hero gains 6 Block.", [{
		op: "block",
		amount: 6,
		all: true
	}], 2),
	...supply("sup-phoenix", "Phoenix Mote", "any-hero", "An ally heals 6. A downed ally returns with 6 health.", [{
		op: "revive",
		amount: 6
	}], 1),
	...supply("sup-focus", "Focusing Draught", "ally", "That hero plays two cards on their next turn this round.", [{ op: "extra" }], 1),
	...supply("sup-anti", "Antitoxin", "ally", "Clear Poison and heal 4.", [{ op: "cleanse" }, {
		op: "heal",
		amount: 4
	}], 2),
	...supply("sup-knives", "Throwing Knives", "enemy", "Deal 6 damage.", [{
		op: "flat",
		amount: 6
	}], 2),
	...supply("sup-horn", "Guard Horn", "ally", "An ally gains +2 Defense for this battle.", [{
		op: "def",
		amount: 2
	}], 2),
	...supply("sup-mana", "Mana Phial", "ally", "Restore 4 mana to a spellcaster.", [{
		op: "mana",
		amount: 4
	}], 2),
	...supply("sup-revive", "Revive Phial", "any-hero", "A downed ally stands with 12 health. A standing ally heals 12.", [{
		op: "revive",
		amount: 12
	}], 2)
];
var SUPPLY_COST = {
	"sup-salve": 12,
	"sup-rations": 14,
	"sup-oil": 16,
	"sup-smoke": 18,
	"sup-shields": 16,
	"sup-phoenix": 36,
	"sup-focus": 28,
	"sup-anti": 18,
	"sup-knives": 14,
	"sup-horn": 16,
	"sup-mana": 22,
	"sup-revive": 34
};
function relicCost(rarity) {
	if (rarity === "mythic") return 78;
	if (rarity === "rare") return 46;
	return 24;
}
var RELICS = {};
function relic(def, copies) {
	RELICS[def.id] = def;
	return Array.from({ length: copies }, () => def.id);
}
var TREASURE_DECKS = {
	common: [
		...relic({
			id: "rel-band",
			name: "Iron Band",
			rarity: "common",
			text: "+2 Attack.",
			atk: 2
		}, 2),
		...relic({
			id: "rel-wrap",
			name: "Leather Wrap",
			rarity: "common",
			text: "+2 Defense.",
			def: 2
		}, 2),
		...relic({
			id: "rel-cord",
			name: "Vitality Cord",
			rarity: "common",
			text: "+8 maximum health.",
			hp: 8
		}, 2),
		...relic({
			id: "rel-edge",
			name: "Sharpened Edge",
			rarity: "common",
			text: "+1 Attack. +4 maximum health.",
			atk: 1,
			hp: 4
		}, 2),
		...relic({
			id: "rel-cloak",
			name: "Scout's Cloak",
			rarity: "common",
			text: "+1 Defense. Start each battle with 3 Block.",
			def: 1,
			startBlock: 3
		}, 2),
		...relic({
			id: "rel-charm",
			name: "Blood Charm",
			rarity: "common",
			text: "Your attacks heal you for 1.",
			lifesteal: 1
		}, 2),
		...relic({
			id: "rel-brooch",
			name: "Thorn Brooch",
			rarity: "common",
			text: "When you gain Block, deal 2 to a random foe.",
			thorns: 2
		}, 2),
		...relic({
			id: "rel-vial",
			name: "Venom Vial",
			rarity: "common",
			text: "Your attacks apply 1 Poison.",
			poisonOnHit: 1
		}, 2),
		...relic({
			id: "rel-fang",
			name: "Mana Fang",
			rarity: "common",
			text: "When an attack deals damage, gain 3 mana.",
			manaOnHit: 3
		}, 2),
		...relic({
			id: "rel-bead",
			name: "Bulwark Bead",
			rarity: "common",
			text: "When you gain Block, gain 3 mana.",
			manaOnBlock: 3
		}, 2),
		...relic({
			id: "rel-saw",
			name: "Sawtooth",
			rarity: "common",
			text: "Your attacks apply 2 Bleed.",
			bleedOnHit: 2
		}, 2),
		...relic({
			id: "rel-hook",
			name: "Gut Hook",
			rarity: "common",
			text: "+1 Attack. Your attacks apply 1 Bleed.",
			atk: 1,
			bleedOnHit: 1
		}, 2)
	],
	rare: [
		...relic({
			id: "rel-sun",
			name: "Sunbrand",
			rarity: "rare",
			text: "+4 Attack.",
			atk: 4
		}, 2),
		...relic({
			id: "rel-aegis",
			name: "Aegis Plate",
			rarity: "rare",
			text: "+3 Defense. +6 maximum health.",
			def: 3,
			hp: 6
		}, 2),
		...relic({
			id: "rel-heart",
			name: "Vampire Pin",
			rarity: "rare",
			text: "+2 Attack. Your attacks heal you for 2.",
			atk: 2,
			lifesteal: 2
		}, 2),
		...relic({
			id: "rel-mail",
			name: "Thornmail",
			rarity: "rare",
			text: "+2 Defense. Gaining Block deals 3 to a random foe.",
			def: 2,
			thorns: 3
		}, 2),
		...relic({
			id: "rel-splash",
			name: "Splinter Crown",
			rarity: "rare",
			text: "+2 Attack. Attacks also deal 2 to other foes.",
			atk: 2,
			splash: 2
		}, 2),
		...relic({
			id: "rel-oath",
			name: "Saint's Oath",
			rarity: "rare",
			text: "+8 health, +1 Defense. The first time you would fall, stay at 1 health.",
			hp: 8,
			def: 1,
			deathWard: true
		}, 1),
		...relic({
			id: "rel-crest",
			name: "Holt Crest",
			rarity: "rare",
			text: "Knight only. +2 Defense. While worn, Holt's Oath is in the deck.",
			classes: ["knight"],
			def: 2,
			grantCards: ["k-crest"]
		}, 1),
		...relic({
			id: "rel-staff",
			name: "Chanter's Staff",
			rarity: "rare",
			text: "Mage Bard only. +2 Attack. While worn, Staff Crescendo is in the deck.",
			classes: ["bard"],
			atk: 2,
			grantCards: ["b-staff"]
		}, 1),
		...relic({
			id: "rel-halo",
			name: "Oath Halo",
			rarity: "rare",
			text: "Paladin only. +1 Attack, +4 health. While worn, Halo Smite is in the deck.",
			classes: ["paladin"],
			atk: 1,
			hp: 4,
			grantCards: ["p-halo"]
		}, 1),
		...relic({
			id: "rel-grove",
			name: "Grove Staff",
			rarity: "rare",
			text: "Druid only. +1 Attack, +1 Defense. While worn, Staffroot is in the deck.",
			classes: ["druid"],
			atk: 1,
			def: 1,
			grantCards: ["d-staff"]
		}, 1),
		...relic({
			id: "rel-knives",
			name: "Veil Knives",
			rarity: "rare",
			text: "Rogue only. Attacks apply 1 Poison. While worn, Veil Flurry is in the deck.",
			classes: ["rogue"],
			poisonOnHit: 1,
			grantCards: ["r-knives"]
		}, 1),
		...relic({
			id: "rel-focus",
			name: "Cinder Focus",
			rarity: "rare",
			text: "Witch only. +2 Attack. While worn, Focused Pyre is in the deck.",
			classes: ["witch"],
			atk: 2,
			grantCards: ["w-focus"]
		}, 1),
		...relic({
			id: "rel-bell",
			name: "Grave Bell",
			rarity: "rare",
			text: "Cleric only. +6 health. While worn, Bell Mend is in the deck.",
			classes: ["cleric"],
			hp: 6,
			grantCards: ["c-bell"]
		}, 1),
		...relic({
			id: "rel-totem",
			name: "Storm Totem",
			rarity: "rare",
			text: "Warden only. Start each battle with 4 Block. While worn, Totem Gale is in the deck.",
			classes: ["warden"],
			startBlock: 4,
			grantCards: ["s-totem"]
		}, 1),
		...relic({
			id: "rel-scepter",
			name: "Bone Scepter",
			rarity: "rare",
			text: "Necromancer only. +1 Attack. While worn, Scepter Call is in the deck.",
			classes: ["necro"],
			atk: 1,
			grantCards: ["n-scepter"]
		}, 1),
		...relic({
			id: "rel-godhand",
			name: "Godhand",
			rarity: "rare",
			text: "Nephilim only. +3 Attack. While worn, Hand of God is in the deck.",
			classes: ["nephilim"],
			atk: 3,
			grantCards: ["nph-hand"]
		}, 1),
		...relic({
			id: "rel-covenant",
			name: "Ley Covenant",
			rarity: "rare",
			text: "When an attack deals damage, or you gain Block, gain 1 mana. While worn, Unpriced Word is in the deck: once each room, your next spell costs no mana.",
			manaOnHit: 1,
			manaOnBlock: 1,
			grantCards: ["cov-word"]
		}, 1),
		...relic({
			id: "rel-leech",
			name: "Leech Blade",
			rarity: "rare",
			text: "Your attacks apply 2 Bleed and heal you for 2.",
			bleedOnHit: 2,
			lifesteal: 2
		}, 1),
		...relic({
			id: "rel-grudge",
			name: "Grudge Plate",
			rarity: "rare",
			text: "Damage you weather is stored, up to 12. While worn, Grudge Blow is in the deck. At 12 it deals that much, ignoring armor, heals 8, and empties.",
			storeCap: 12,
			grudgeHeal: 8,
			grantCards: ["grd-blow"]
		}, 1)
	],
	mythic: [
		...relic({
			id: "rel-dragon",
			name: "Dragonheart",
			rarity: "mythic",
			text: "+5 Attack. +12 maximum health.",
			atk: 5,
			hp: 12
		}, 1),
		...relic({
			id: "rel-root",
			name: "Worldroot",
			rarity: "mythic",
			text: "+4 Defense. Start each battle with 8 Block.",
			def: 4,
			startBlock: 8
		}, 1),
		...relic({
			id: "rel-ember",
			name: "Crown of Embers",
			rarity: "mythic",
			text: "+4 Attack. Attacks splash 3 and apply 1 Poison.",
			atk: 4,
			splash: 3,
			poisonOnHit: 1
		}, 1),
		...relic({
			id: "rel-warden",
			name: "Last Light",
			rarity: "mythic",
			text: "+10 health, +2 Defense. The first time you would fall, stay at 1. Attacks heal 1.",
			hp: 10,
			def: 2,
			deathWard: true,
			lifesteal: 1
		}, 1)
	]
};
var MONSTERS = {};
function monster(def, copies = 0) {
	MONSTERS[def.id] = def;
	return Array.from({ length: copies }, () => def.id);
}
var WEAK_DECK = [
	...monster({
		id: "goblin",
		name: "Goblin Skirmisher",
		blurb: "Quick, mean, and underpaid.",
		hp: 12,
		atk: 6,
		armor: 0,
		xp: 6,
		tier: "weak"
	}, 6),
	...monster({
		id: "bat",
		name: "Cave Bat",
		blurb: "A shriek, then teeth.",
		hp: 9,
		atk: 5,
		armor: 0,
		xp: 6,
		tier: "weak"
	}, 4),
	...monster({
		id: "slime",
		name: "Ash Slime",
		blurb: "It tightens when hurt.",
		hp: 15,
		atk: 5,
		armor: 0,
		xp: 7,
		tier: "weak",
		enrageAtHalf: 3
	}, 4)
];
var STANDARD_DECK = [
	...monster({
		id: "bone",
		name: "Bone Guard",
		blurb: "Old armor, older orders.",
		hp: 16,
		atk: 7,
		armor: 1,
		xp: 8,
		tier: "standard"
	}, 4),
	...monster({
		id: "cultist",
		name: "Cultist",
		blurb: "Chants that sharpen a knife.",
		hp: 13,
		atk: 8,
		armor: 0,
		xp: 8,
		tier: "standard"
	}, 4),
	...monster({
		id: "spider",
		name: "Crypt Spider",
		blurb: "The bite keeps working.",
		hp: 12,
		atk: 6,
		armor: 0,
		xp: 8,
		tier: "standard",
		poisonOnHit: 2
	}, 4)
];
var ELITE_DECK = [
	...monster({
		id: "ogre",
		name: "Hall Ogre",
		blurb: "The ceiling is a suggestion.",
		hp: 26,
		atk: 9,
		armor: 1,
		xp: 14,
		tier: "elite"
	}, 2),
	...monster({
		id: "wraith",
		name: "Veil Wraith",
		blurb: "Armor means less to smoke.",
		hp: 18,
		atk: 8,
		armor: 0,
		xp: 14,
		tier: "elite",
		pierce: 2
	}, 2),
	...monster({
		id: "hunter",
		name: "Seal Hunter",
		blurb: "It came for your heart.",
		hp: 20,
		atk: 10,
		armor: 0,
		xp: 16,
		tier: "elite"
	}, 2)
];
monster({
	id: "warden",
	name: "Grim Warden",
	blurb: "Keeper of the first seal. Armor first, then the whole table.",
	hp: 34,
	atk: 9,
	armor: 2,
	xp: 40,
	tier: "boss",
	rageAt: .5,
	rageBonus: 3,
	phases: 3,
	shifts: [{
		form: "Oathbroken",
		line: "The oath snaps. Armor means less to the Warden now.",
		hp: 8,
		atk: 2,
		armor: 0,
		pierce: 2
	}, {
		form: "Unsealed",
		line: "The seal is gone. Grim Warden strikes everyone still standing.",
		hp: 8,
		atk: 2,
		armor: 1,
		alwaysCleave: true,
		rageBonus: 2
	}]
});
monster({
	id: "hydra",
	name: "Mire Hydra",
	blurb: "One mouth, until you cut it off.",
	hp: 32,
	atk: 7,
	armor: 0,
	xp: 42,
	tier: "boss",
	rageAt: .5,
	rageBonus: 1,
	rageDouble: true,
	phases: 3,
	shifts: [{
		form: "Two Heads",
		line: "A second head tears free. Both bite, and the venom sticks.",
		hp: 8,
		atk: 1,
		armor: 0,
		alwaysDouble: true,
		poisonOnHit: 1
	}, {
		form: "The Maw",
		line: "The maw opens. Two bites, and the poison sinks deeper.",
		hp: 8,
		atk: 2,
		armor: 0,
		pierce: 1,
		poisonOnHit: 2
	}]
});
monster({
	id: "priestess",
	name: "Ash Priestess",
	blurb: "Her sermon is fire. It does not stay a private one.",
	hp: 30,
	atk: 8,
	armor: 1,
	xp: 42,
	tier: "boss",
	rageAt: .5,
	rageBonus: 3,
	rageCleave: true,
	phases: 3,
	shifts: [{
		form: "Sermon",
		line: "The sermon catches. Ash Priestess burns the whole party.",
		hp: 6,
		atk: 2,
		armor: 0,
		alwaysCleave: true
	}, {
		form: "Pyre",
		line: "The pyre answers. Fire, poison, and nowhere to stand aside.",
		hp: 8,
		atk: 2,
		armor: 0,
		pierce: 2,
		poisonOnHit: 2,
		rageBonus: 2
	}]
});
monster({
	id: "king",
	name: "The Hollow King",
	blurb: "The last door has a crown. He stands up once.",
	hp: 48,
	atk: 11,
	armor: 2,
	xp: 64,
	tier: "final",
	rageAt: .5,
	rageBonus: 4,
	rageCleave: true,
	phases: 2,
	shifts: [{
		form: "Crowned",
		line: "The crown seats itself. The room is the target.",
		hp: 14,
		atk: 3,
		armor: 1,
		pierce: 2,
		alwaysCleave: true,
		rageBonus: 2
	}]
});
var MINIBOSS_IDS = [
	"warden",
	"hydra",
	"priestess"
];
var CLASSES = {
	knight: {
		id: "knight",
		name: "Rough Knight",
		role: "Tank",
		blurb: "High health, heavier armor, and the nerve to be hit on purpose.",
		excel: "Excels at taking the hit. High health and defense, big Block, and taunts that pull the monsters onto him.",
		icon: "shield",
		heroName: "Brann Holt",
		baseHp: 34,
		hpPerLevel: 4,
		baseAtk: 4,
		baseDef: 3,
		deck: [
			"k-strike",
			"k-strike",
			"k-strike",
			"k-guard",
			"k-guard",
			"k-bash",
			"k-bash",
			"k-cleave",
			"k-taunt",
			"k-rally"
		],
		milestones: [
			{
				level: 5,
				cardId: "k-bulwark"
			},
			{
				level: 12,
				cardId: "k-earthsplit"
			},
			{
				level: 25,
				cardId: "k-kingwall"
			}
		],
		unlock: null
	},
	bard: {
		id: "bard",
		name: "Mage Bard",
		role: "Support",
		blurb: "Bolts, songs, and the kind of courage that keeps everyone else standing.",
		excel: "Excels at mana and morale. Well Bolt spends mana for a heavy hit, and songs raise attack or patch the party.",
		icon: "music",
		heroName: "Lira Voss",
		baseHp: 24,
		hpPerLevel: 3,
		baseAtk: 5,
		baseDef: 1,
		deck: [
			"b-bolt",
			"b-bolt",
			"b-well",
			"b-inspire",
			"b-inspire",
			"b-discord",
			"b-discord",
			"b-encore",
			"b-encore",
			"b-verse"
		],
		milestones: [
			{
				level: 5,
				cardId: "b-highnote"
			},
			{
				level: 12,
				cardId: "b-chorus"
			},
			{
				level: 25,
				cardId: "b-finale"
			}
		],
		mana: 8,
		unlock: null
	},
	paladin: {
		id: "paladin",
		name: "Oath Paladin",
		role: "Guard",
		blurb: "Smite the wicked, then put the party back together.",
		excel: "Excels at smiting a wounded foe and mending afterward. A guard who can heal as well as hit.",
		icon: "sun",
		heroName: "Ser Caldus",
		baseHp: 30,
		hpPerLevel: 3,
		baseAtk: 4,
		baseDef: 2,
		deck: [
			"p-smite",
			"p-smite",
			"p-smite",
			"p-hands",
			"p-hands",
			"p-ward",
			"p-ward",
			"p-judgment",
			"p-judgment",
			"p-aura"
		],
		milestones: [
			{
				level: 5,
				cardId: "p-mend"
			},
			{
				level: 12,
				cardId: "p-radiant"
			},
			{
				level: 25,
				cardId: "p-sanctuary"
			}
		],
		unlock: null
	},
	druid: {
		id: "druid",
		name: "Grove Druid",
		role: "Ward",
		blurb: "Poison, bark, and a deck that gets meaner when you throw cards away.",
		excel: "Excels at poison and staying in the fight. Mana thorns, bark for Block, and cards that get meaner when thrown away.",
		icon: "leaf",
		heroName: "Moss Quill",
		baseHp: 28,
		hpPerLevel: 3,
		baseAtk: 4,
		baseDef: 2,
		deck: [
			"d-thorn",
			"d-thorn",
			"d-well",
			"d-bark",
			"d-bark",
			"d-shed",
			"d-shed",
			"d-regrowth",
			"d-regrowth",
			"d-entangle"
		],
		milestones: [
			{
				level: 5,
				cardId: "d-briar"
			},
			{
				level: 12,
				cardId: "d-deeproot"
			},
			{
				level: 25,
				cardId: "d-ancient"
			}
		],
		mana: 6,
		unlock: null
	},
	rogue: {
		id: "rogue",
		name: "Veil Rogue",
		role: "Striker",
		blurb: "Opens on the healthy and finishes what poison started.",
		excel: "Excels at opening on a healthy foe and stacking poison. Fast hits, little armor, and a second strike.",
		icon: "feather",
		heroName: "Nyx Vale",
		baseHp: 22,
		hpPerLevel: 2,
		baseAtk: 6,
		baseDef: 1,
		deck: [
			"r-shiv",
			"r-shiv",
			"r-shiv",
			"r-backstab",
			"r-backstab",
			"r-fade",
			"r-fade",
			"r-venom",
			"r-venom",
			"r-flurry"
		],
		milestones: [
			{
				level: 5,
				cardId: "r-garrote"
			},
			{
				level: 12,
				cardId: "r-shadowstep"
			},
			{
				level: 25,
				cardId: "r-killstroke"
			}
		],
		unlock: {
			key: "door-ambush",
			label: "Clear an Ambush Stair"
		}
	},
	witch: {
		id: "witch",
		name: "Cinder Witch",
		role: "Striker",
		blurb: "Pays in blood for bolts that end arguments.",
		excel: "Excels at mana bolts that end a foe. She pays health for the biggest single hits at the table.",
		icon: "flame",
		heroName: "Sable Morne",
		baseHp: 22,
		hpPerLevel: 2,
		baseAtk: 6,
		baseDef: 1,
		deck: [
			"w-cinder",
			"w-cinder",
			"w-well",
			"w-hex",
			"w-hex",
			"w-pact",
			"w-pact",
			"w-ash",
			"w-ash",
			"w-wildfire"
		],
		milestones: [
			{
				level: 5,
				cardId: "w-immolate"
			},
			{
				level: 12,
				cardId: "w-curse"
			},
			{
				level: 25,
				cardId: "w-cataclysm"
			}
		],
		mana: 8,
		unlock: {
			key: "door-curse",
			label: "Survive a Cursed Reliquary"
		}
	},
	cleric: {
		id: "cleric",
		name: "Grave Cleric",
		role: "Support",
		blurb: "Big heals, clean poison, and a smite with dirt under its nails.",
		excel: "Excels at healing, wiping poison, and standing the fallen back up. The party's medicine.",
		icon: "heart",
		heroName: "Osric Bale",
		baseHp: 28,
		hpPerLevel: 3,
		baseAtk: 3,
		baseDef: 2,
		deck: [
			"c-mend",
			"c-mend",
			"c-mend",
			"c-smite",
			"c-smite",
			"c-sanctuary",
			"c-sanctuary",
			"c-purify",
			"c-purify",
			"c-requiem"
		],
		milestones: [
			{
				level: 5,
				cardId: "c-miracle"
			},
			{
				level: 12,
				cardId: "c-litany"
			},
			{
				level: 25,
				cardId: "c-ascension"
			}
		],
		unlock: {
			key: "door-font",
			label: "Step into a Ley Font"
		}
	},
	warden: {
		id: "warden",
		name: "Storm Warden",
		role: "Guard",
		blurb: "A wall that throws lightning back.",
		excel: "Excels at shielding the whole party, then throwing the storm back. Block for everyone, and lightning on top.",
		icon: "storm",
		heroName: "Hera Flint",
		baseHp: 32,
		hpPerLevel: 3,
		baseAtk: 4,
		baseDef: 2,
		deck: [
			"s-lance",
			"s-lance",
			"s-lance",
			"s-howl",
			"s-howl",
			"s-charge",
			"s-charge",
			"s-gale",
			"s-gale",
			"s-thunder"
		],
		milestones: [
			{
				level: 5,
				cardId: "s-tempest"
			},
			{
				level: 12,
				cardId: "s-bastion"
			},
			{
				level: 25,
				cardId: "s-eye"
			}
		],
		unlock: {
			key: "boss-warden",
			label: "Slay the Grim Warden"
		}
	},
	necro: {
		id: "necro",
		name: "Bone Necromancer",
		role: "Summoner",
		blurb: "Spends mana to raise thralls that strike beside the party and sometimes take the blow.",
		excel: "Excels at thralls. Spends mana to raise up to two bones that strike on their own and sometimes take the blow.",
		icon: "skull",
		heroName: "Vesper Cain",
		baseHp: 24,
		hpPerLevel: 2,
		baseAtk: 3,
		baseDef: 1,
		deck: [
			"n-lash",
			"n-lash",
			"n-lash",
			"n-raise",
			"n-raise",
			"n-guard",
			"n-guard",
			"n-drain",
			"n-drain",
			"n-command"
		],
		milestones: [
			{
				level: 5,
				cardId: "n-legion"
			},
			{
				level: 12,
				cardId: "n-grave"
			},
			{
				level: 25,
				cardId: "n-king"
			}
		],
		mana: 7,
		unlock: null
	},
	nephilim: {
		id: "nephilim",
		name: "Nephilim",
		role: "Ascendant",
		blurb: "The power of the gods in one body. Smite, shelter, and a mana bolt that ends rooms.",
		excel: "Excels at ending the room. A huge body, a mana bolt, smites, and shelter for the whole party.",
		icon: "crown",
		heroName: "The Nephilim",
		baseHp: 38,
		hpPerLevel: 4,
		baseAtk: 6,
		baseDef: 2,
		deck: [
			"nph-palm",
			"nph-palm",
			"nph-smite",
			"nph-smite",
			"nph-aegis",
			"nph-aegis",
			"nph-wrath",
			"nph-wrath",
			"nph-mercy",
			"nph-bolt"
		],
		milestones: [
			{
				level: 5,
				cardId: "nph-host"
			},
			{
				level: 12,
				cardId: "nph-judgment"
			},
			{
				level: 25,
				cardId: "nph-apocalypse"
			}
		],
		mana: 6,
		unlock: null
	}
};
var CLASS_ORDER = [
	"knight",
	"bard",
	"paladin",
	"druid",
	"rogue",
	"witch",
	"cleric",
	"warden",
	"necro",
	"nephilim"
];
function defaultRoster() {
	return CLASS_ORDER.map((id) => {
		const c = CLASSES[id];
		return {
			id,
			name: c.heroName,
			classId: id,
			level: 1,
			xp: 0,
			keepsakeId: null,
			unlocked: c.unlock === null
		};
	});
}
var DOOR_TEMPLATES = {
	quiet: {
		kind: "quiet",
		title: "Quiet Hall",
		risk: "Low",
		lootLabel: "Common or rare",
		odds: {
			common: 76,
			rare: 24,
			mythic: 0
		},
		hints: [
			"Scratching, then nothing. Probably nothing.",
			"A draft that smells like wet coin.",
			"One set of footprints, already drying."
		],
		fight: true
	},
	vault: {
		kind: "vault",
		title: "Guarded Vault",
		risk: "Measured",
		lootLabel: "Common or rare",
		odds: {
			common: 58,
			rare: 42,
			mythic: 0
		},
		hints: [
			"A lock, and someone still holding the key.",
			"Torchlight moves on the far side of the bars.",
			"The chest is real. So is the breathing."
		],
		fight: true
	},
	ambush: {
		kind: "ambush",
		title: "Ambush Stair",
		risk: "High",
		lootLabel: "Rare leaning",
		odds: {
			common: 30,
			rare: 50,
			mythic: 20
		},
		hints: [
			"The quiet is arranged.",
			"Something large shifted its weight and pretended not to.",
			"A hunter's mark, freshly cut."
		],
		fight: true
	},
	nest: {
		kind: "nest",
		title: "Monster Nest",
		risk: "Measured",
		lootLabel: "Common or rare. No mythic.",
		odds: {
			common: 82,
			rare: 18,
			mythic: 0
		},
		hints: [
			"Too many eyes for one animal.",
			"Bones stacked the way a creature stacks toys.",
			"The skittering has a rhythm."
		],
		fight: true
	},
	supplies: {
		kind: "supplies",
		title: "Supply Nook",
		risk: "Low",
		lootLabel: "No relics — bandages and oil",
		odds: null,
		hints: [
			"Cork, linen, and the ghost of a cookfire.",
			"Someone cached a pack and never came back.",
			"The door sticks like a pantry."
		],
		fight: false
	},
	curse: {
		kind: "curse",
		title: "Cursed Reliquary",
		risk: "High",
		lootLabel: "Rare likely, after the bite",
		odds: {
			common: 20,
			rare: 55,
			mythic: 25
		},
		hints: [
			"The lid is warm. The lock is already open.",
			"A sweet smell, and a click that isn't a lock.",
			"Gold, if you don't mind paying in skin."
		],
		fight: false
	},
	shop: {
		kind: "shop",
		title: "Wayside Stall",
		risk: "Low",
		lootLabel: "Buy supplies, relics, or a revive",
		odds: null,
		hints: [
			"A lamp, a scale, and a merchant who does not ask names.",
			"Corks, charms, and prices scratched into the wood.",
			"The stall is open. The road behind it is not."
		],
		fight: false
	},
	font: {
		kind: "font",
		title: "Ley Font",
		risk: "Low",
		lootLabel: "Mana, and a phial",
		odds: null,
		hints: [
			"The air tastes like rain on hot stone.",
			"A basin that refills itself with pale light.",
			"Spellcasters know this smell."
		],
		fight: false
	}
};
var BOSS_DOOR = {
	title: "Seal Gate",
	risk: "Deadly",
	lootLabel: "Rare or better",
	odds: {
		common: 10,
		rare: 55,
		mythic: 35
	},
	hints: [
		"It falls. Then it stands. Then it stands again.",
		"A crown-shaped shadow, and the sense it has more than one life.",
		"This is not a rumor. Something enthroned is listening."
	]
};
var FINAL_DOOR = {
	title: "The Hollow Gate",
	risk: "Deadly",
	lootLabel: "A king's hoard",
	odds: {
		common: 0,
		rare: 45,
		mythic: 55
	},
	hints: ["Three seals are broken. The King falls once, then wears the crown."]
};
function xpThreshold(level) {
	if (level >= 50) return 0;
	return 22 + level * 8;
}
function relicIdsOf(keepsakeId, equipped) {
	const ids = [...equipped];
	if (keepsakeId && RELICS[keepsakeId]) ids.push(keepsakeId);
	return ids;
}
function computeStats(classId, level, relicIds) {
	const c = CLASSES[classId];
	const lvl = Math.max(1, Math.min(50, level));
	let maxHp = c.baseHp + (lvl - 1) * c.hpPerLevel;
	let atk = c.baseAtk + Math.floor((lvl - 1) / 2);
	let def = c.baseDef + Math.floor((lvl - 1) / 3);
	let startBlock = 0;
	let lifesteal = 0;
	let thorns = 0;
	let splash = 0;
	let deathWard = false;
	let poisonOnHit = 0;
	let manaOnHit = 0;
	let manaOnBlock = 0;
	let bleedOnHit = 0;
	let storeCap = 0;
	let grudgeHeal = 0;
	for (const id of relicIds) {
		const r = RELICS[id];
		if (!r) continue;
		maxHp += r.hp ?? 0;
		atk += r.atk ?? 0;
		def += r.def ?? 0;
		startBlock += r.startBlock ?? 0;
		lifesteal += r.lifesteal ?? 0;
		thorns += r.thorns ?? 0;
		splash += r.splash ?? 0;
		poisonOnHit += r.poisonOnHit ?? 0;
		manaOnHit += r.manaOnHit ?? 0;
		manaOnBlock += r.manaOnBlock ?? 0;
		bleedOnHit += r.bleedOnHit ?? 0;
		storeCap += r.storeCap ?? 0;
		grudgeHeal += r.grudgeHeal ?? 0;
		if (r.deathWard) deathWard = true;
	}
	return {
		maxHp,
		atk,
		def,
		startBlock,
		lifesteal,
		thorns,
		splash,
		deathWard,
		poisonOnHit,
		manaOnHit,
		manaOnBlock,
		bleedOnHit,
		storeCap,
		grudgeHeal
	};
}
function deckFor(classId, level) {
	const c = CLASSES[classId];
	const ids = [...c.deck];
	for (const m of c.milestones) if (level >= m.level) ids.push(m.cardId);
	return ids;
}
function relicEffects(relic) {
	const bits = [];
	if (relic.atk) bits.push(`+${relic.atk} Attack`);
	if (relic.def) bits.push(`+${relic.def} Defense`);
	if (relic.hp) bits.push(`+${relic.hp} maximum health`);
	if (relic.startBlock) bits.push(`${relic.startBlock} Block at battle start`);
	if (relic.lifesteal) bits.push(`Attacks heal ${relic.lifesteal}`);
	if (relic.thorns) bits.push(`Block deals ${relic.thorns} to a foe`);
	if (relic.splash) bits.push(`Splash ${relic.splash}`);
	if (relic.poisonOnHit) bits.push(`Attacks apply ${relic.poisonOnHit} Poison`);
	if (relic.manaOnHit) bits.push(`Attacks grant ${relic.manaOnHit} mana`);
	if (relic.manaOnBlock) bits.push(`Block grants ${relic.manaOnBlock} mana`);
	if (relic.bleedOnHit) bits.push(`Attacks apply ${relic.bleedOnHit} Bleed`);
	if (relic.storeCap) bits.push(`Stores ${relic.storeCap} damage`);
	if (relic.grudgeHeal) bits.push(`Full plate heals ${relic.grudgeHeal}`);
	if (relic.deathWard) bits.push("First lethal blow leaves you at 1");
	return bits;
}
function foePlan(kind, party) {
	if (kind === "supplies") return {
		label: "No fight",
		count: 0
	};
	if (kind === "shop") return {
		label: "Spend gold on supplies and relics",
		count: 0
	};
	if (kind === "font") return {
		label: "A spring of mana. No fight",
		count: 0
	};
	if (kind === "curse") return {
		label: "A trap, then treasure",
		count: 0
	};
	if (kind === "miniboss") return {
		label: "Seal boss · 3 forms, each harder",
		count: 1
	};
	if (kind === "final") return {
		label: "Hollow King · 2 forms",
		count: 1
	};
	if (kind === "quiet") {
		const n = party >= 4 ? 2 : 1;
		return {
			label: n === 1 ? "1 foe" : "2 foes",
			count: n
		};
	}
	if (kind === "vault") {
		const n = party <= 2 ? 1 : party === 3 ? 2 : 3;
		return {
			label: n === 1 ? "1 foe" : `${n} foes`,
			count: n
		};
	}
	if (kind === "ambush") {
		const n = party >= 3 ? 2 : 1;
		return {
			label: n === 1 ? "1 elite" : "An elite and a foe",
			count: n
		};
	}
	const n = Math.min(4, party + 1);
	return {
		label: `${n} foes`,
		count: n
	};
}
function assertContent() {
	for (const c of Object.values(CLASSES)) {
		for (const id of c.deck) if (!CARDS[id]) throw new Error(`Missing card ${id}`);
		for (const m of c.milestones) if (!CARDS[m.cardId]) throw new Error(`Missing milestone ${m.cardId}`);
	}
	for (const id of [
		...WEAK_DECK,
		...STANDARD_DECK,
		...ELITE_DECK
	]) if (!MONSTERS[id]) throw new Error(`Missing monster ${id}`);
	for (const id of [...MINIBOSS_IDS, "king"]) {
		const m = MONSTERS[id];
		if (!m) throw new Error(`Missing monster ${id}`);
		const forms = m.phases ?? 1;
		if ((m.shifts?.length ?? 0) !== forms - 1) throw new Error(`Boss ${id} phases do not match shifts`);
	}
	for (const id of SUPPLY_DECK) if (!SUPPLIES[id]) throw new Error(`Missing supply ${id}`);
	for (const pile of [
		TREASURE_DECKS.common,
		TREASURE_DECKS.rare,
		TREASURE_DECKS.mythic
	]) for (const id of pile) if (!RELICS[id]) throw new Error(`Missing relic ${id}`);
	for (const relic of Object.values(RELICS)) for (const id of relic.grantCards ?? []) if (!CARDS[id]) throw new Error(`Missing grant ${relic.id}:${id}`);
}
assertContent();
function rngNext(state) {
	let a = state | 0;
	a = a + 1831565813 | 0;
	let t = Math.imul(a ^ a >>> 15, 1 | a);
	t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
	return {
		value: ((t ^ t >>> 14) >>> 0) / 4294967296,
		state: a >>> 0
	};
}
function roll(run) {
	const n = rngNext(run.rng >>> 0);
	run.rng = n.state;
	return n.value;
}
function shuffle(list, rnd) {
	const a = [...list];
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(rnd() * (i + 1));
		const tmp = a[i];
		a[i] = a[j];
		a[j] = tmp;
	}
	return a;
}
function nextUid(run, prefix) {
	run.uid += 1;
	return `${prefix}-${run.uid}`;
}
function log(run, line) {
	run.log = [...run.log, line].slice(-40);
}
function clone(run) {
	return structuredClone(run);
}
function livingHeroes(run) {
	return run.party.filter((h) => !h.down && h.hp > 0);
}
function livingEnemies(run) {
	return run.enemies.filter((e) => e.hp > 0);
}
function heroById(run, id) {
	if (!id) return void 0;
	return run.party.find((h) => h.id === id);
}
function enemyById(run, id) {
	if (!id) return void 0;
	return run.enemies.find((e) => e.uid === id);
}
function relicBuild(hero, run) {
	const equipped = run.equipped[hero.id] ?? [];
	return computeStats(hero.classId, hero.level, relicIdsOf(hero.keepsakeId, equipped));
}
function recompute(hero, run, healDelta) {
	const before = hero.maxHp;
	const stats = relicBuild(hero, run);
	hero.maxHp = stats.maxHp;
	hero.atk = stats.atk;
	hero.def = stats.def;
	if (healDelta && stats.maxHp > before) hero.hp += stats.maxHp - before;
	if (hero.hp > hero.maxHp) hero.hp = hero.maxHp;
	if (hero.hp < 0) hero.hp = 0;
}
function partyLow(run) {
	return run.party.some((h) => h.down || h.hp / Math.max(1, h.maxHp) <= .3);
}
function grantXp(run, hero, amount, events) {
	if (amount <= 0 || hero.level >= 50) return;
	hero.xp += amount;
	run.xpGained[hero.id] = (run.xpGained[hero.id] ?? 0) + amount;
	while (hero.level < 50 && hero.xp >= xpThreshold(hero.level)) {
		hero.xp -= xpThreshold(hero.level);
		hero.level += 1;
		const before = hero.maxHp;
		recompute(hero, run, false);
		const gain = Math.max(0, hero.maxHp - before);
		hero.hp += gain;
		const fresh = deckFor(hero.classId, hero.level);
		const known = /* @__PURE__ */ new Set([
			...hero.deck,
			...hero.discard,
			...hero.exhaust,
			...run.hand.map((c) => c.cardId)
		]);
		for (const id of fresh) if (!known.has(id)) {
			hero.discard.push(id);
			known.add(id);
		}
		const line = `${hero.name} reaches level ${hero.level}.`;
		log(run, line);
		events.push({
			banner: line,
			sfx: "unlock"
		});
	}
	if (hero.level >= 50) hero.xp = 0;
}
function grantPartyXp(run, amount, events) {
	for (const h of run.party) grantXp(run, h, amount, events);
}
var WEAKEN_CAP = 8;
function hallPressure(run) {
	return Math.max(0, run.round - 20);
}
function effectiveAtk(run, e) {
	return Math.max(1, e.atk - e.weaken) + hallPressure(run);
}
function pull(deck, discard, rnd) {
	let d = deck.slice();
	let g = discard.slice();
	if (d.length === 0) {
		if (g.length === 0) return {
			id: null,
			deck: d,
			discard: g
		};
		d = shuffle(g, rnd);
		g = [];
	}
	return {
		id: d.pop() ?? null,
		deck: d,
		discard: g
	};
}
function drawIds(deck, discard, n, rnd) {
	let d = deck;
	let g = discard;
	const ids = [];
	for (let i = 0; i < n; i++) {
		const got = pull(d, g, rnd);
		d = got.deck;
		g = got.discard;
		if (!got.id) break;
		ids.push(got.id);
	}
	return {
		ids,
		deck: d,
		discard: g
	};
}
function dealHand(run, hero) {
	const rnd = () => roll(run);
	const got = drawIds(hero.deck, hero.discard, 3, rnd);
	hero.deck = got.deck;
	hero.discard = got.discard;
	run.hand = got.ids.map((cardId) => ({
		uid: nextUid(run, "c"),
		cardId
	}));
	if (run.hand.length === 0) run.hand = [{
		uid: nextUid(run, "c"),
		cardId: "basic-strike"
	}];
}
function giveBlock(run, hero, amount, events) {
	if (amount <= 0 || hero.down) return;
	hero.block += amount;
	events.push({
		sfx: "block",
		floater: {
			key: `hero:${hero.id}`,
			text: `+${amount}`,
			kind: "block"
		}
	});
	const build = relicBuild(hero, run);
	if (build.thorns > 0) {
		const foes = livingEnemies(run);
		if (foes.length) {
			const foe = foes[Math.floor(roll(run) * foes.length)];
			damageEnemy(run, foe, build.thorns, false, events, `${hero.name}'s thorns bite ${foe.name}.`);
		}
	}
	if (build.manaOnBlock) gainMana(hero, build.manaOnBlock, events);
}
function gainMana(hero, amount, events) {
	if (amount <= 0 || hero.down || hero.maxMana <= 0) return;
	const before = hero.mana;
	hero.mana = Math.min(hero.maxMana, hero.mana + amount);
	const gained = hero.mana - before;
	if (gained <= 0) return;
	events.push({
		sfx: "heal",
		floater: {
			key: `hero:${hero.id}`,
			text: `+${gained} mana`,
			kind: "buff"
		}
	});
}
function healHero(hero, amount, events) {
	if (hero.down || amount <= 0) return;
	const before = hero.hp;
	hero.hp = Math.min(hero.maxHp, hero.hp + amount);
	const gained = hero.hp - before;
	if (gained > 0) events.push({
		sfx: "heal",
		floater: {
			key: `hero:${hero.id}`,
			text: `+${gained}`,
			kind: "heal"
		}
	});
}
function fellHero(run, hero, events) {
	if (relicBuild(hero, run).deathWard && !hero.deathWardUsed) {
		hero.deathWardUsed = true;
		hero.hp = 1;
		hero.down = false;
		log(run, `${hero.name}'s keepsake flares. They stay at 1.`);
		events.push({
			sfx: "heal",
			banner: `${hero.name} refuses to fall.`,
			floater: {
				key: `hero:${hero.id}`,
				text: "+1",
				kind: "heal"
			}
		});
		return;
	}
	hero.hp = 0;
	hero.down = true;
	hero.block = 0;
	log(run, `${hero.name} is down.`);
	events.push({
		sfx: "hit",
		shake: true,
		floater: {
			key: `hero:${hero.id}`,
			text: "Down",
			kind: "dmg"
		}
	});
}
function chargeStore(run, hero, amount, events) {
	const cap = relicBuild(hero, run).storeCap ?? 0;
	if (cap <= 0 || amount <= 0 || hero.down) return;
	const before = hero.stored || 0;
	hero.stored = Math.min(cap, before + amount);
	const gained = hero.stored - before;
	if (gained <= 0) return;
	const full = hero.stored >= cap;
	events.push({
		sfx: "ui",
		floater: {
			key: `hero:${hero.id}`,
			text: full ? "Full" : `+${gained} stored`,
			kind: "buff"
		}
	});
	if (full && before < cap) log(run, `${hero.name}'s grudge is full.`);
}
function hurtHero(run, hero, amount, events, ignoreBlock) {
	if (hero.down || amount <= 0) return;
	let incoming = amount;
	let weathered = 0;
	if (!ignoreBlock && hero.block > 0) {
		const blocked = Math.min(hero.block, incoming);
		hero.block -= blocked;
		incoming -= blocked;
		weathered += blocked;
		if (blocked > 0 && incoming <= 0) {
			chargeStore(run, hero, weathered, events);
			events.push({
				floater: {
					key: `hero:${hero.id}`,
					text: "Blocked",
					kind: "miss"
				},
				sfx: "block"
			});
			return;
		}
	}
	if (incoming <= 0) return;
	hero.hp -= incoming;
	if (!ignoreBlock) {
		weathered += incoming;
		chargeStore(run, hero, weathered, events);
	}
	events.push({
		sfx: "hit",
		shake: incoming >= 6,
		floater: {
			key: `hero:${hero.id}`,
			text: `−${incoming}`,
			kind: "dmg"
		}
	});
	if (hero.hp <= 0) fellHero(run, hero, events);
}
function noteBossDeath(run, enemy, events) {
	const low = partyLow(run);
	if (low) run.lowHpBossKill = true;
	if (enemy.final) run.finalSlain = true;
	else run.seals = Math.min(3, run.seals + 1);
	run.bossesSlain = [...run.bossesSlain, enemy.defId];
	const line = enemy.final ? `${enemy.name} falls. The dungeon exhales.` : `Seal broken — ${enemy.name} is slain. (${run.seals}/3)`;
	log(run, line);
	events.push({
		banner: line,
		sfx: "rage",
		shake: true,
		bossDead: {
			id: enemy.defId,
			lowHp: low,
			final: enemy.final
		}
	});
}
function damageEnemy(run, enemy, amount, useArmor, events, quiet) {
	if (enemy.hp <= 0 || amount <= 0) return 0;
	if (typeof enemy.baseAtk !== "number") enemy.baseAtk = enemy.atk;
	if (typeof enemy.form !== "number") enemy.form = 1;
	if (typeof enemy.forms !== "number") enemy.forms = enemy.boss ? MONSTERS[enemy.defId]?.phases ?? 1 : 1;
	if (typeof enemy.alwaysCleave !== "boolean") enemy.alwaysCleave = false;
	if (typeof enemy.alwaysDouble !== "boolean") enemy.alwaysDouble = false;
	const dealt = useArmor ? Math.max(1, amount - enemy.armor) : Math.max(1, amount);
	enemy.hp -= dealt;
	events.push({
		sfx: "hit",
		shake: dealt >= 8 || enemy.boss,
		floater: {
			key: `enemy:${enemy.uid}`,
			text: `−${dealt}`,
			kind: "dmg"
		}
	});
	if (!quiet) log(run, `${enemy.name} takes ${dealt}.`);
	else log(run, quiet.replace("{d}", String(dealt)));
	if (!enemy.halfEnraged && enemy.enrageAtHalf > 0 && enemy.hp > 0 && enemy.hp * 2 <= enemy.maxHp) {
		enemy.halfEnraged = true;
		enemy.baseAtk += enemy.enrageAtHalf;
		log(run, `${enemy.name} surges (+${enemy.enrageAtHalf} Attack).`);
	}
	if (!enemy.raging && enemy.rageAt > 0 && enemy.hp > 0 && enemy.hp / enemy.maxHp <= enemy.rageAt) {
		enemy.raging = true;
		const line = `${enemy.name} enters a rage.`;
		log(run, line);
		events.push({
			banner: line,
			sfx: "rage",
			shake: true
		});
	}
	enemy.atk = enemy.baseAtk + (enemy.raging ? enemy.rageBonus : 0);
	if (enemy.hp <= 0) {
		if (tryAscend(run, enemy, events)) return dealt;
		enemy.hp = 0;
		log(run, `${enemy.name} is defeated.`);
		const xp = enemy.xp;
		for (const h of run.party) grantXp(run, h, xp, events);
		if (enemy.boss) noteBossDeath(run, enemy, events);
	}
	return dealt;
}
function strikeHero(run, enemy, hero, events) {
	if (enemy.skip || enemy.hp <= 0 || hero.down) return;
	const atk = effectiveAtk(run, enemy);
	const cleave = enemy.alwaysCleave || enemy.raging && enemy.rageCleave;
	const targets = cleave ? livingHeroes(run) : [hero];
	for (const target of targets) {
		const raw = cleave ? Math.max(1, Math.round(atk * .6)) : atk;
		const def = Math.max(0, target.def + target.defBuff - enemy.pierce);
		const after = Math.max(0, raw - def);
		if (after <= 0) {
			log(run, `${target.name} shrugs off ${enemy.name}.`);
			events.push({
				floater: {
					key: `hero:${target.id}`,
					text: "0",
					kind: "miss"
				},
				sfx: "block"
			});
			continue;
		}
		const beforeHp = target.hp;
		if (soakMinion(run, target, after, events)) {
			log(run, `${enemy.name} strikes a thrall instead of ${target.name}.`);
			continue;
		}
		hurtHero(run, target, after, events, false);
		const lost = beforeHp - Math.max(0, target.hp);
		log(run, lost > 0 ? `${enemy.name} strikes ${target.name} for ${lost}.` : `${enemy.name}'s strike glances off ${target.name}.`);
		if (enemy.poisonOnHit && target.hp > 0 && !target.down && beforeHp > target.hp) {
			target.poison += enemy.poisonOnHit;
			log(run, `${target.name} is poisoned (${target.poison}).`);
			events.push({ sfx: "poison" });
		}
	}
}
function rawHit(hero, bonus, extra) {
	return hero.atk + hero.atkBuff + bonus + extra;
}
function applyHitTo(run, hero, enemy, raw, events, splash) {
	if (raw <= 0 || enemy.hp <= 0) return;
	const build = relicBuild(hero, run);
	const dealt = damageEnemy(run, enemy, raw, true, events, `${hero.name} hits ${enemy.name} for {d}.`);
	if (dealt > 0 && build.lifesteal && !hero.down) healHero(hero, build.lifesteal, events);
	if (dealt > 0 && build.poisonOnHit && enemy.hp > 0) {
		enemy.poison += build.poisonOnHit;
		log(run, `${enemy.name} is poisoned (${enemy.poison}).`);
	}
	if (dealt > 0 && build.bleedOnHit && enemy.hp > 0) {
		enemy.bleed = (enemy.bleed || 0) + build.bleedOnHit;
		log(run, `${enemy.name} is bleeding (${enemy.bleed}).`);
		events.push({ floater: {
			key: `enemy:${enemy.uid}`,
			text: `B${enemy.bleed}`,
			kind: "buff"
		} });
	}
	if (dealt > 0 && build.manaOnHit) gainMana(hero, build.manaOnHit, events);
	if (splash && build.splash) for (const other of livingEnemies(run)) {
		if (other.uid === enemy.uid) continue;
		damageEnemy(run, other, build.splash, false, events, `Splinters catch ${other.name} for {d}.`);
	}
}
function resolveEffects(run, hero, effects, targetId, events, exhaustHand) {
	const foe = enemyById(run, targetId);
	const ally = heroById(run, targetId);
	for (const effect of effects) if (effect.op === "wound") {
		const loss = Math.min(effect.amount, Math.max(0, hero.hp - 1));
		if (loss > 0) {
			hero.hp -= loss;
			log(run, `${hero.name} pays ${loss} health.`);
			events.push({
				floater: {
					key: `hero:${hero.id}`,
					text: `−${loss}`,
					kind: "dmg"
				},
				sfx: "hit"
			});
		}
	} else if (effect.op === "hit") {
		const hits = effect.hits ?? 1;
		const targets = effect.all ? livingEnemies(run).slice() : foe ? [foe] : [];
		for (const enemy of targets) {
			if (enemy.hp <= 0) continue;
			let extra = 0;
			if (effect.smite && enemy.hp * 2 <= enemy.maxHp) extra += 4;
			if (effect.openingBonus && enemy.hp / enemy.maxHp > .8) extra += effect.openingBonus;
			const raw = rawHit(hero, effect.bonus, extra);
			for (let i = 0; i < hits; i++) {
				if (enemy.hp <= 0) break;
				applyHitTo(run, hero, enemy, raw, events, !effect.all);
			}
		}
	} else if (effect.op === "flat") {
		const targets = effect.all ? livingEnemies(run).slice() : foe ? [foe] : [];
		for (const enemy of targets) damageEnemy(run, enemy, effect.amount, false, events);
	} else if (effect.op === "block") continue;
	else if (effect.op === "heal") {
		if (effect.self) healHero(hero, effect.amount, events);
		else if (effect.all) for (const t of livingHeroes(run)) healHero(t, effect.amount, events);
		else if (ally && !ally.down) healHero(ally, effect.amount, events);
	} else if (effect.op === "atk") {
		const targets = effect.all ? livingHeroes(run) : ally && !ally.down ? [ally] : [hero];
		for (const t of targets) {
			t.atkBuff += effect.amount;
			log(run, `${t.name} gains +${effect.amount} Attack.`);
			events.push({
				floater: {
					key: `hero:${t.id}`,
					text: `+${effect.amount} ATK`,
					kind: "buff"
				},
				sfx: "ui"
			});
		}
	} else if (effect.op === "def") {
		const targets = effect.all ? livingHeroes(run) : ally && !ally.down ? [ally] : [hero];
		for (const t of targets) {
			t.defBuff += effect.amount;
			log(run, `${t.name} gains +${effect.amount} Defense.`);
			events.push({ floater: {
				key: `hero:${t.id}`,
				text: `+${effect.amount} DEF`,
				kind: "buff"
			} });
		}
	} else if (effect.op === "weaken" && foe && foe.hp > 0) {
		const next = Math.min(WEAKEN_CAP, foe.weaken + effect.amount);
		const gained = next - foe.weaken;
		foe.weaken = next;
		if (gained > 0) {
			log(run, `${foe.name} is weakened (−${gained} Attack).`);
			events.push({ floater: {
				key: `enemy:${foe.uid}`,
				text: `−${gained} ATK`,
				kind: "buff"
			} });
		} else log(run, `${foe.name} cannot be weakened further.`);
	} else if (effect.op === "poison" && foe && foe.hp > 0) {
		foe.poison += effect.amount;
		log(run, `${foe.name} is poisoned (${foe.poison}).`);
		events.push({
			sfx: "poison",
			floater: {
				key: `enemy:${foe.uid}`,
				text: `P${foe.poison}`,
				kind: "buff"
			}
		});
	} else if (effect.op === "taunt") {
		run.tauntHeroId = hero.id;
		log(run, `${hero.name} demands every blow.`);
	} else if (effect.op === "skip" && foe && foe.hp > 0) {
		foe.skip = true;
		log(run, `${foe.name} will skip its next action.`);
	} else if (effect.op === "exhaust") {
		const count = exhaustHand.filter((c) => c.cardId !== "basic-strike").length;
		const block = effect.base + effect.each * count;
		log(run, `${hero.name} exhausts ${count} card${count === 1 ? "" : "s"}.`);
		giveBlock(run, hero, block, events);
	} else if (effect.op === "cleanse") {
		const t = ally ?? hero;
		if (t.poison > 0) {
			t.poison = 0;
			log(run, `${t.name} is cleansed.`);
		}
	} else if (effect.op === "revive") {
		const t = ally;
		if (!t) continue;
		if (t.down) {
			t.down = false;
			t.hp = Math.min(t.maxHp, effect.amount);
			log(run, `${t.name} rises with ${t.hp} health.`);
			events.push({
				sfx: "heal",
				banner: `${t.name} rises.`,
				floater: {
					key: `hero:${t.id}`,
					text: `+${t.hp}`,
					kind: "heal"
				}
			});
		} else healHero(t, effect.amount, events);
	} else if (effect.op === "extra") {
		const t = ally && !ally.down ? ally : hero;
		t.extraPlay = true;
		log(run, `${t.name} will play an extra card this round.`);
		events.push({
			floater: {
				key: `hero:${t.id}`,
				text: "+card",
				kind: "buff"
			},
			sfx: "ui"
		});
	} else if (effect.op === "mana") {
		const targets = ally ? [ally] : [hero];
		for (const t of targets) {
			if (t.down || t.maxMana <= 0) {
				log(run, `${t.name} has no mana to restore.`);
				continue;
			}
			const before = t.mana;
			t.mana = Math.min(t.maxMana, t.mana + effect.amount);
			const gained = t.mana - before;
			if (gained > 0) {
				log(run, `${t.name} recovers ${gained} mana.`);
				events.push({
					sfx: "heal",
					floater: {
						key: `hero:${t.id}`,
						text: `+${gained} mana`,
						kind: "buff"
					}
				});
			}
		}
	} else if (effect.op === "summon") raiseMinion(run, hero, effect.name, effect.hp, effect.atk, events);
	else if (effect.op === "minion-strike") minionsAct(run, hero, events);
	else if (effect.op === "free-spell") {
		if (!hero.freeSpellUsed) {
			hero.freeSpell = true;
			log(run, `${hero.name} prepares a free spell.`);
			events.push({
				sfx: "heal",
				floater: {
					key: `hero:${hero.id}`,
					text: "Rite",
					kind: "buff"
				}
			});
		}
	} else if (effect.op === "grudge") {
		const build = relicBuild(hero, run);
		const blow = hero.stored || 0;
		if (foe && foe.hp > 0 && blow > 0) {
			damageEnemy(run, foe, blow, false, events, `${hero.name} releases the grudge into ${foe.name} for {d}.`);
			if ((build.grudgeHeal ?? 0) > 0) healHero(hero, build.grudgeHeal, events);
			hero.stored = 0;
			log(run, `${hero.name} empties the plate.`);
		}
	}
}
function applyBlocks(run, hero, effects, targetId, events) {
	const ally = heroById(run, targetId);
	for (const effect of effects) {
		if (effect.op !== "block") continue;
		if (effect.all) for (const t of livingHeroes(run)) giveBlock(run, t, effect.amount, events);
		else giveBlock(run, ally && !ally.down ? ally : hero, effect.amount, events);
	}
}
function needsEnemy(effects) {
	return effects.some((e) => e.op === "hit" && !e.all || e.op === "flat" && !e.all || e.op === "weaken" || e.op === "poison" || e.op === "skip");
}
function cardNeedsTarget(target, effects) {
	if (target === "enemy" || target === "ally" || target === "any-hero") return true;
	return needsEnemy(effects);
}
function cardPowerLabel(hero, cardId) {
	const card = CARDS[cardId] ?? SUPPLIES[cardId];
	if (!card) return null;
	const hit = card.effects.find((e) => e.op === "hit");
	if (hit && hit.op === "hit") {
		const base = Math.max(0, hero.atk + hero.atkBuff + hit.bonus);
		const high = base + (hit.smite ? 4 : 0) + (hit.openingBonus ?? 0);
		const hits = hit.hits ?? 1;
		const body = hit.smite || hit.openingBonus ? `${base}–${high}` : `${base}`;
		if (hit.all) return `${body} each`;
		if (hits > 1) return `${body} × ${hits}`;
		return body;
	}
	const flat = card.effects.find((e) => e.op === "flat");
	if (flat && flat.op === "flat") return flat.all ? `${flat.amount} each` : `${flat.amount}`;
	const block = card.effects.find((e) => e.op === "block");
	if (block && block.op === "block" && card.effects.every((e) => e.op === "block" || e.op === "taunt")) return block.all ? `${block.amount} all` : `${block.amount}`;
	const heal = card.effects.find((e) => e.op === "heal");
	if (heal && heal.op === "heal" && !card.effects.some((e) => e.op === "hit")) return heal.all ? `+${heal.amount} all` : `+${heal.amount}`;
	return null;
}
function discardHand(hero, hand, playedUid, exhausted) {
	for (const c of hand) {
		if (c.cardId === "basic-strike") continue;
		if (c.uid === playedUid) {
			hero.discard.push(c.cardId);
			continue;
		}
		if (exhausted) hero.exhaust.push(c.cardId);
		else hero.discard.push(c.cardId);
	}
}
function raiseMinion(run, hero, name, hp, atk, events) {
	if (!run.minions) run.minions = [];
	const mine = run.minions.filter((m) => m.ownerId === hero.id && m.hp > 0);
	if (mine.length >= 2) {
		const weakest = mine.slice().sort((a, b) => a.hp - b.hp)[0];
		weakest.hp = weakest.maxHp;
		log(run, `${weakest.name} is knit back together.`);
		events.push({
			sfx: "heal",
			floater: {
				key: `minion:${weakest.uid}`,
				text: "Rise",
				kind: "heal"
			}
		});
		return;
	}
	const minion = {
		uid: nextUid(run, "m"),
		ownerId: hero.id,
		name,
		hp,
		maxHp: hp,
		atk
	};
	run.minions.push(minion);
	log(run, `${hero.name} raises ${name}.`);
	events.push({
		sfx: "card",
		floater: {
			key: `hero:${hero.id}`,
			text: "Rise",
			kind: "buff"
		},
		banner: `${name} rises.`
	});
	const foes = livingEnemies(run);
	if (foes.length > 0) {
		const foe = foes[Math.floor(roll(run) * foes.length)];
		damageEnemy(run, foe, atk, false, events, `${name} strikes ${foe.name} for {d}.`);
	}
}
function minionsAct(run, hero, events) {
	const mine = (run.minions ?? []).filter((m) => m.ownerId === hero.id && m.hp > 0);
	for (const minion of mine) {
		const foes = livingEnemies(run);
		if (foes.length === 0) break;
		const foe = foes[Math.floor(roll(run) * foes.length)];
		damageEnemy(run, foe, minion.atk, false, events, `${minion.name} strikes ${foe.name} for {d}.`);
	}
}
function soakMinion(run, hero, amount, events) {
	const mine = (run.minions ?? []).filter((m) => m.ownerId === hero.id && m.hp > 0);
	if (mine.length === 0 || roll(run) > .5) return false;
	const minion = mine[0];
	minion.hp -= amount;
	events.push({
		sfx: "hit",
		floater: {
			key: `minion:${minion.uid}`,
			text: `−${amount}`,
			kind: "dmg"
		}
	});
	if (minion.hp <= 0) {
		minion.hp = 0;
		log(run, `${minion.name} crumbles.`);
	}
	return true;
}
function minionsMayClear(run, events) {
	if (run.enemies.length === 0 || livingEnemies(run).length > 0) return false;
	grantPartyXp(run, 4, events);
	log(run, "The fight breaks.");
	roomCleared(run, events);
	return true;
}
function startActor(run, index, events) {
	const hero = run.party[index];
	if (!hero) return;
	const extra = hero.extraPlay ? 1 : 0;
	hero.extraPlay = false;
	run.actorIndex = index;
	run.playsLeft = 1 + extra;
	run.phase = "battle";
	dealHand(run, hero);
	minionsAct(run, hero, events);
	minionsMayClear(run, events);
}
function beginRoundBattle(run, events) {
	const idx = run.party.findIndex((h) => !h.down && h.hp > 0);
	if (idx < 0) return;
	startActor(run, idx, events);
}
function enterEnemyPhase(run) {
	run.phase = "enemy";
	run.beat = "bleed";
	run.strikeIndex = 0;
	run.strikeHitsLeft = 0;
	run.hand = [];
	for (const e of run.enemies) {
		e.poisonTicked = false;
		e.bleedTicked = false;
	}
	for (const h of run.party) h.poisonTicked = false;
}
function awardGold(run, events) {
	if (run.enemies.length === 0) return;
	let purse = run.depth * 2;
	for (const enemy of run.enemies) if (enemy.final) purse += 55;
	else if (enemy.boss) purse += 36;
	else if (enemy.tier === "elite") purse += 18;
	else if (enemy.tier === "standard") purse += 10;
	else purse += 6;
	run.gold += purse;
	log(run, `The fallen leave ${purse} gold. You hold ${run.gold}.`);
	events.push({ banner: `+${purse} gold` });
}
function roomCleared(run, events) {
	awardGold(run, events);
	stashMonsters(run);
	run.enemies = [];
	run.hand = [];
	run.tauntHeroId = null;
	run.minions = [];
	if (run.activeDoor) events.push({ doorDone: run.activeDoor.kind });
	for (const h of run.party) {
		h.block = 0;
		h.braced = false;
		h.freeSpell = false;
		h.freeSpellUsed = false;
	}
	const odds = run.activeDoor?.odds;
	if (!odds) {
		run.phase = run.finalSlain ? "onward" : "onward";
		run.clearedNote = "The room stills.";
		return;
	}
	run.offer = rollOffer(run, odds, 3);
	run.pendingRelic = null;
	if (run.offer.length === 0) {
		run.phase = "onward";
		run.clearedNote = "The hoard was already picked clean.";
		log(run, run.clearedNote);
		return;
	}
	run.phase = "treasure";
	run.clearedNote = "Choose one relic.";
	events.push({ sfx: "card" });
}
function finishIfWiped(run) {
	if (livingHeroes(run).length === 0) return "defeat";
	return null;
}
function endOfEnemyPhase(run, events) {
	if (finishIfWiped(run)) return {
		run,
		events,
		outcome: "defeat"
	};
	const won = maybeWonRoom(run, events);
	if (won) return won;
	for (const h of run.party) {
		h.block = 0;
		h.braced = false;
	}
	run.tauntHeroId = null;
	run.round += 1;
	run.prepSupplyUsed = false;
	run.phase = "prep";
	run.hand = [];
	let restored = 0;
	for (const hero of run.party) {
		if (hero.down || hero.maxMana <= 0 || hero.mana >= hero.maxMana) continue;
		hero.mana += 1;
		restored += 1;
		events.push({ floater: {
			key: `hero:${hero.id}`,
			text: "+1 mana",
			kind: "buff"
		} });
	}
	log(run, restored > 0 ? `Round ${run.round}. The ley returns a little mana.` : `Round ${run.round}.`);
	if (run.round > 20) log(run, `The hall grows cruel. Foes hit ${run.round - 20} harder.`);
	return {
		run,
		events
	};
}
function partyScale(run, base, kind) {
	const party = run.party.length;
	const avg = run.party.reduce((s, h) => s + h.level, 0) / Math.max(1, party);
	return scaleNumber(base, party, run.depth, avg, kind);
}
function tryAscend(run, enemy, events) {
	if (!enemy.boss || enemy.form >= enemy.forms) return false;
	const shift = MONSTERS[enemy.defId]?.shifts?.[enemy.form - 1];
	if (!shift) return false;
	enemy.form += 1;
	enemy.formName = shift.form;
	enemy.maxHp += partyScale(run, shift.hp, "hp");
	enemy.hp = enemy.maxHp;
	enemy.baseAtk += partyScale(run, shift.atk, "atk");
	enemy.atk = enemy.baseAtk;
	enemy.armor += shift.armor;
	enemy.pierce += shift.pierce ?? 0;
	if (shift.poisonOnHit) enemy.poisonOnHit = Math.max(enemy.poisonOnHit, shift.poisonOnHit);
	if (shift.rageCleave) enemy.rageCleave = true;
	if (shift.rageDouble) enemy.rageDouble = true;
	if (shift.alwaysCleave) enemy.alwaysCleave = true;
	if (shift.alwaysDouble) enemy.alwaysDouble = true;
	if (shift.rageBonus) enemy.rageBonus += shift.rageBonus;
	enemy.raging = false;
	enemy.halfEnraged = false;
	enemy.poison = 0;
	enemy.bleed = 0;
	enemy.bleedTicked = false;
	enemy.skip = false;
	enemy.blurb = shift.line;
	const banner = `${enemy.name} returns at full health — ${shift.form}.`;
	log(run, `${banner} ${shift.line}`);
	events.push({
		banner,
		sfx: "rage",
		shake: true,
		floater: {
			key: `enemy:${enemy.uid}`,
			text: shift.form,
			kind: "buff"
		}
	});
	return true;
}
function scaleNumber(base, party, depth, avgLevel, kind) {
	const hpM = [
		0,
		1,
		1.75,
		2.45,
		3.05
	][party] ?? 1;
	const atkM = [
		0,
		1,
		1.12,
		1.22,
		1.32
	][party] ?? 1;
	const depthM = kind === "hp" ? 1 + (depth - 1) * .07 : 1 + (depth - 1) * .04;
	const lvlM = 1 + Math.max(0, avgLevel - 1) * (kind === "hp" ? .04 : .025);
	return Math.max(1, Math.round(base * (kind === "hp" ? hpM : atkM) * depthM * lvlM));
}
function spawn(run, defId) {
	const def = MONSTERS[defId];
	const party = run.party.length;
	const avg = run.party.reduce((s, h) => s + h.level, 0) / Math.max(1, party);
	const boss = def.tier === "boss" || def.tier === "final";
	const atk = scaleNumber(def.atk, party, run.depth, avg, "atk");
	const hp = scaleNumber(def.hp, party, run.depth, avg, "hp");
	return {
		uid: nextUid(run, "e"),
		defId,
		name: def.name,
		blurb: def.blurb,
		hp,
		maxHp: hp,
		atk,
		armor: def.armor,
		xp: def.xp,
		tier: def.tier,
		poison: 0,
		bleed: 0,
		weaken: 0,
		skip: false,
		raging: false,
		halfEnraged: false,
		poisonTicked: false,
		bleedTicked: false,
		poisonOnHit: def.poisonOnHit ?? 0,
		pierce: def.pierce ?? 0,
		enrageAtHalf: def.enrageAtHalf ?? 0,
		rageAt: def.rageAt ?? 0,
		rageBonus: def.rageBonus ?? 0,
		rageCleave: Boolean(def.rageCleave),
		rageDouble: Boolean(def.rageDouble),
		form: 1,
		forms: def.phases ?? 1,
		formName: "",
		baseAtk: atk,
		alwaysCleave: false,
		alwaysDouble: false,
		boss,
		final: def.tier === "final"
	};
}
function drawMonster(run, tier) {
	const rnd = () => roll(run);
	if (tier === "weak") {
		const got = pull(run.weakDeck, run.weakDiscard, rnd);
		run.weakDeck = got.deck;
		run.weakDiscard = got.discard;
		return got.id ?? "goblin";
	}
	if (tier === "elite") {
		const got = pull(run.eliteDeck, run.eliteDiscard, rnd);
		run.eliteDeck = got.deck;
		run.eliteDiscard = got.discard;
		return got.id ?? "ogre";
	}
	const got = pull(run.standardDeck, run.standardDiscard, rnd);
	run.standardDeck = got.deck;
	run.standardDiscard = got.discard;
	return got.id ?? "cultist";
}
function stashMonsters(run) {
	for (const e of run.enemies) if (e.tier === "weak") run.weakDiscard.push(e.defId);
	else if (e.tier === "standard") run.standardDiscard.push(e.defId);
	else if (e.tier === "elite") run.eliteDiscard.push(e.defId);
}
function buildFight(run, door) {
	const plan = foePlan(door.kind, run.party.length);
	const enemies = [];
	if (door.kind === "miniboss" && door.bossId) {
		enemies.push(spawn(run, door.bossId));
		for (let i = 1; i < plan.count; i++) enemies.push(spawn(run, drawMonster(run, "weak")));
	} else if (door.kind === "final") {
		enemies.push(spawn(run, "king"));
		for (let i = 1; i < plan.count; i++) enemies.push(spawn(run, drawMonster(run, "standard")));
	} else if (door.kind === "ambush") {
		enemies.push(spawn(run, drawMonster(run, "elite")));
		for (let i = 1; i < plan.count; i++) enemies.push(spawn(run, drawMonster(run, "weak")));
	} else if (door.kind === "quiet" || door.kind === "nest") for (let i = 0; i < plan.count; i++) enemies.push(spawn(run, drawMonster(run, "weak")));
	else if (door.kind === "vault") for (let i = 0; i < plan.count; i++) enemies.push(spawn(run, drawMonster(run, i === 0 ? "standard" : "weak")));
	run.enemies = enemies;
}
function openCombat(run, events) {
	run.round = 1;
	run.prepSupplyUsed = false;
	run.tauntHeroId = null;
	for (const h of run.party) {
		if (h.exhaust.length) {
			h.deck = shuffle([...h.deck, ...h.exhaust], () => roll(run));
			h.exhaust = [];
		}
		h.block = 0;
		h.atkBuff = 0;
		h.defBuff = 0;
		h.poison = 0;
		h.braced = false;
		h.extraPlay = false;
		h.deathWardUsed = false;
		h.poisonTicked = false;
		h.freeSpell = false;
		h.freeSpellUsed = false;
		const block = relicBuild(h, run).startBlock;
		if (block > 0 && !h.down) giveBlock(run, h, block, events);
	}
	run.phase = "prep";
	const names = run.enemies.map((e) => e.name).join(", ");
	const phased = run.enemies.find((e) => e.boss && e.forms > 1);
	run.intro = phased ? `${run.activeDoor?.title ?? "The hall"} — ${names}. ${phased.forms} forms. Relics from the halls are how you last.` : `${run.activeDoor?.title ?? "The hall"} opens onto ${names}.`;
	log(run, run.intro);
}
function rollRarity(odds, rnd) {
	if (rnd * 100 < odds.mythic) return "mythic";
	if (rnd * 100 < odds.mythic + odds.rare) return "rare";
	return "common";
}
function drawRelic(run, rarity, allowMythic) {
	const order = [];
	const push = (key) => {
		if (!allowMythic && key === "mythic") return;
		if (!order.includes(key)) order.push(key);
	};
	push(rarity === "mythic" && !allowMythic ? "rare" : rarity);
	push("rare");
	push("common");
	if (allowMythic) push("mythic");
	const rnd = () => roll(run);
	for (const key of order) {
		const got = pull(run.treasures[key], run.treasureDiscard[key], rnd);
		run.treasures[key] = got.deck;
		run.treasureDiscard[key] = got.discard;
		if (got.id) return got.id;
	}
	return null;
}
function partyCanWear(run, relicId) {
	const rel = RELICS[relicId];
	if (!rel?.classes?.length) return true;
	return run.party.some((h) => rel.classes.includes(h.classId));
}
function grantIds() {
	const ids = /* @__PURE__ */ new Set();
	for (const relic of Object.values(RELICS)) for (const cardId of relic.grantCards ?? []) ids.add(cardId);
	return ids;
}
function syncGrants(hero, run) {
	const grants = grantIds();
	const want = /* @__PURE__ */ new Set();
	for (const id of relicIdsOf(hero.keepsakeId, run.equipped[hero.id] ?? [])) for (const cardId of RELICS[id]?.grantCards ?? []) want.add(cardId);
	const drop = (id) => grants.has(id) && !want.has(id);
	hero.deck = hero.deck.filter((id) => !drop(id));
	hero.discard = hero.discard.filter((id) => !drop(id));
	hero.exhaust = hero.exhaust.filter((id) => !drop(id));
	const acting = run.party[run.actorIndex]?.id === hero.id;
	if (acting) run.hand = run.hand.filter((c) => !drop(c.cardId));
	const have = /* @__PURE__ */ new Set([
		...hero.deck,
		...hero.discard,
		...hero.exhaust,
		...acting ? run.hand.map((c) => c.cardId) : []
	]);
	for (const id of want) if (!have.has(id)) hero.deck.push(id);
}
function takeRelic(run, rarity, allowMythic) {
	for (let i = 0; i < 6; i++) {
		const id = drawRelic(run, rarity, allowMythic);
		if (!id) return null;
		if (partyCanWear(run, id)) return id;
		const rel = RELICS[id];
		if (rel) run.treasureDiscard[rel.rarity].push(id);
	}
	return null;
}
function rollOffer(run, odds, n) {
	const offer = [];
	const seen = /* @__PURE__ */ new Set();
	for (let i = 0; i < n + 4 && offer.length < n; i++) {
		const id = takeRelic(run, rollRarity(odds, roll(run)), odds.mythic > 0);
		if (!id || seen.has(id)) {
			if (id) {
				const rel = RELICS[id];
				run.treasureDiscard[rel.rarity].push(id);
			}
			continue;
		}
		seen.add(id);
		offer.push({
			uid: nextUid(run, "o"),
			defId: id
		});
	}
	return offer;
}
function makeDoor(run, kind, bossId) {
	if (kind === "miniboss") {
		const hint = BOSS_DOOR.hints[Math.floor(roll(run) * BOSS_DOOR.hints.length)] ?? BOSS_DOOR.hints[0];
		const boss = bossId ? MONSTERS[bossId] : void 0;
		return {
			uid: nextUid(run, "d"),
			kind,
			title: boss ? `Seal — ${boss.name}` : BOSS_DOOR.title,
			hint,
			risk: BOSS_DOOR.risk,
			lootLabel: BOSS_DOOR.lootLabel,
			foes: foePlan(kind, run.party.length).label,
			odds: BOSS_DOOR.odds,
			bossId
		};
	}
	if (kind === "final") return {
		uid: nextUid(run, "d"),
		kind,
		title: FINAL_DOOR.title,
		hint: FINAL_DOOR.hints[0],
		risk: FINAL_DOOR.risk,
		lootLabel: FINAL_DOOR.lootLabel,
		foes: foePlan(kind, run.party.length).label,
		odds: FINAL_DOOR.odds,
		bossId: "king"
	};
	const tpl = DOOR_TEMPLATES[kind];
	const hint = tpl.hints[Math.floor(roll(run) * tpl.hints.length)] ?? tpl.hints[0];
	return {
		uid: nextUid(run, "d"),
		kind,
		title: tpl.title,
		hint,
		risk: tpl.risk,
		lootLabel: tpl.lootLabel,
		foes: foePlan(kind, run.party.length).label,
		odds: tpl.odds
	};
}
function generateDoors(run) {
	const rnd = () => roll(run);
	if (run.seals >= 3) {
		const doors = [makeDoor(run, "final")];
		if (!run.cacheTaken) doors.push(makeDoor(run, "supplies"));
		if (roll(run) < .55) doors.push(makeDoor(run, "shop"));
		run.doors = doors;
		run.phase = "doors";
		run.intro = run.cacheTaken ? "Only the Hollow Gate remains." : "The Hollow Gate is the only way forward. A side cache remains, if you want one more breath.";
		if (doors.some((d) => d.kind === "shop")) run.intro += " A stall waits beside it.";
		return;
	}
	const bag = [
		"quiet",
		"vault",
		"ambush",
		"nest",
		"supplies",
		"curse",
		"font",
		"shop",
		"shop",
		"shop"
	];
	const want = run.depth === 1 ? 3 : 2;
	const picked = [];
	for (const kind of shuffle(bag, rnd)) {
		if (picked.includes(kind)) continue;
		picked.push(kind);
		if (picked.length >= want) break;
	}
	const doors = picked.map((k) => makeDoor(run, k));
	if (run.depth >= 2 && run.seals < 3) {
		const bossId = run.bossOrder[run.seals];
		doors.push(makeDoor(run, "miniboss", bossId));
	}
	while (doors.length < 3) doors.push(makeDoor(run, doors.some((d) => d.kind === "quiet") ? "nest" : "quiet"));
	if (roll(run) < .42) {
		const extra = makeDoor(run, "shop");
		if (doors.some((d) => d.kind === "shop")) {
			extra.title = "Side Stall";
			extra.hint = "A second lamp, and a merchant who already knows your coin.";
			extra.lootLabel = "Another stall. Same gold.";
		}
		doors.push(extra);
	}
	run.doors = shuffle(doors, rnd);
	run.phase = "doors";
	run.activeDoor = null;
	const stalls = run.doors.filter((d) => d.kind === "shop").length;
	if (run.depth === 1) run.intro = stalls > 1 ? "Three ways down, and more than one stall." : stalls === 1 ? "Three ways down. A stall has set up among them." : "Three ways down. The seals are deeper.";
	else run.intro = `Depth ${run.depth}. Seals ${run.seals}/3.${stalls ? " A stall is open." : ""}`;
}
function curseDamage(run, events) {
	for (const hero of livingHeroes(run)) {
		const raw = Math.max(2, 7 - (hero.def + hero.defBuff));
		const loss = Math.min(raw, Math.max(0, hero.hp - 1));
		if (loss <= 0) {
			log(run, `${hero.name} is barely nicked.`);
			continue;
		}
		hero.hp -= loss;
		log(run, `The trap bites ${hero.name} for ${loss}.`);
		events.push({
			sfx: "hit",
			floater: {
				key: `hero:${hero.id}`,
				text: `−${loss}`,
				kind: "dmg"
			},
			shake: true
		});
	}
}
function startRun(roster, partyIds, seed) {
	const ids = partyIds.filter((id) => roster.some((h) => h.id === id && h.unlocked)).slice(0, 4);
	const run = {
		rng: (seed ?? (Date.now() ^ Math.floor(Math.random() * 4294967295)) >>> 0) >>> 0 || 1,
		depth: 1,
		seals: 0,
		phase: "doors",
		beat: "poison",
		strikeIndex: 0,
		strikeHitsLeft: 0,
		doors: [],
		activeDoor: null,
		intro: "",
		party: [],
		enemies: [],
		minions: [],
		hand: [],
		actorIndex: 0,
		playsLeft: 1,
		round: 1,
		tauntHeroId: null,
		prepSupplyUsed: false,
		supplies: [],
		gold: 0,
		shop: [],
		afterEquip: null,
		supplyDeck: [],
		supplyDiscard: [],
		weakDeck: [],
		weakDiscard: [],
		standardDeck: [],
		standardDiscard: [],
		eliteDeck: [],
		eliteDiscard: [],
		treasures: {
			common: [],
			rare: [],
			mythic: []
		},
		treasureDiscard: {
			common: [],
			rare: [],
			mythic: []
		},
		bossOrder: [],
		equipped: {},
		locker: [],
		offer: [],
		pendingRelic: null,
		log: [],
		xpGained: {},
		levelStart: {},
		lowHpBossKill: false,
		finalSlain: false,
		bossesSlain: [],
		uid: 1,
		clock: 0,
		cacheTaken: false,
		clearedNote: ""
	};
	const rnd = () => roll(run);
	run.supplyDeck = shuffle(SUPPLY_DECK, rnd);
	run.weakDeck = shuffle(WEAK_DECK, rnd);
	run.standardDeck = shuffle(STANDARD_DECK, rnd);
	run.eliteDeck = shuffle(ELITE_DECK, rnd);
	run.treasures = {
		common: shuffle(TREASURE_DECKS.common, rnd),
		rare: shuffle(TREASURE_DECKS.rare, rnd),
		mythic: shuffle(TREASURE_DECKS.mythic, rnd)
	};
	run.bossOrder = shuffle(MINIBOSS_IDS, rnd);
	run.party = ids.map((id, seat) => {
		const src = roster.find((h) => h.id === id);
		const cls = CLASSES[id];
		const stats = computeStats(id, src.level, relicIdsOf(src.keepsakeId, []));
		run.equipped[id] = [];
		run.levelStart[id] = src.level;
		run.xpGained[id] = 0;
		return {
			id,
			name: src.name || cls.heroName,
			classId: id,
			seat,
			level: src.level,
			xp: src.xp,
			hp: stats.maxHp,
			maxHp: stats.maxHp,
			atk: stats.atk,
			def: stats.def,
			keepsakeId: src.keepsakeId,
			block: 0,
			atkBuff: 0,
			defBuff: 0,
			poison: 0,
			down: false,
			braced: false,
			extraPlay: false,
			deathWardUsed: false,
			poisonTicked: false,
			deck: shuffle(deckFor(id, src.level), rnd),
			discard: [],
			exhaust: [],
			mana: CLASSES[id]?.mana ?? 0,
			maxMana: CLASSES[id]?.mana ?? 0,
			freeSpell: false,
			freeSpellUsed: false,
			stored: 0
		};
	});
	const opening = drawIds(run.supplyDeck, run.supplyDiscard, 2, rnd);
	run.supplyDeck = opening.deck;
	run.supplyDiscard = opening.discard;
	run.supplies = opening.ids.map((defId) => ({
		uid: nextUid(run, "s"),
		defId
	}));
	for (const hero of run.party) syncGrants(hero, run);
	log(run, "The guild steps under the first arch.");
	generateDoors(run);
	return run;
}
function maybeWonRoom(run, events) {
	if (run.enemies.length === 0 || livingEnemies(run).length > 0) return null;
	grantPartyXp(run, 4, events);
	log(run, "The fight breaks.");
	roomCleared(run, events);
	if (run.finalSlain && run.phase === "onward") return {
		run,
		events,
		outcome: "victory"
	};
	return {
		run,
		events
	};
}
function chooseDoor(prev, doorUid) {
	const run = clone(prev);
	const events = [];
	if (run.phase !== "doors") return {
		run: prev,
		events
	};
	const door = run.doors.find((d) => d.uid === doorUid);
	if (!door) return {
		run: prev,
		events
	};
	run.activeDoor = door;
	events.push({ sfx: "door" });
	if (door.kind === "supplies") {
		if (run.seals >= 3) run.cacheTaken = true;
		const rnd = () => roll(run);
		const got = drawIds(run.supplyDeck, run.supplyDiscard, 2, rnd);
		run.supplyDeck = got.deck;
		run.supplyDiscard = got.discard;
		for (const id of got.ids) run.supplies.push({
			uid: nextUid(run, "s"),
			defId: id
		});
		run.phase = "supply";
		run.intro = door.hint;
		log(run, `You find ${got.ids.map((id) => SUPPLIES[id]?.name ?? "a supply").join(" and ") || "nothing"}.`);
		grantPartyXp(run, 3, events);
		events.push({
			sfx: "card",
			doorDone: "supplies"
		});
		return {
			run,
			events
		};
	}
	if (door.kind === "shop") {
		run.shop = stockShop(run);
		run.phase = "shop";
		run.intro = "The stallkeeper weighs your coin.";
		log(run, `A stall. You hold ${run.gold} gold.`);
		events.push({
			sfx: "card",
			doorDone: "shop"
		});
		return {
			run,
			events
		};
	}
	if (door.kind === "font") {
		let restored = 0;
		for (const hero of run.party) {
			if (hero.down || hero.maxMana <= 0) continue;
			const before = hero.mana;
			hero.mana = Math.min(hero.maxMana, hero.mana + 3);
			restored += hero.mana - before;
		}
		const notes = [];
		notes.push(restored > 0 ? `The font restores ${restored} mana.` : "The font is still. No one here drinks from it.");
		if (run.supplies.length < 5) {
			run.supplies.push({
				uid: nextUid(run, "s"),
				defId: "sup-mana"
			});
			notes.push("A Mana Phial sits on the basin.");
		}
		run.phase = "onward";
		run.clearedNote = notes.join(" ");
		log(run, run.clearedNote);
		grantPartyXp(run, 3, events);
		events.push({
			sfx: "heal",
			banner: run.clearedNote,
			doorDone: "font"
		});
		return {
			run,
			events
		};
	}
	if (door.kind === "curse") {
		run.intro = "The reliquary bites before it pays.";
		curseDamage(run, events);
		run.phase = "curse";
		log(run, run.intro);
		return {
			run,
			events
		};
	}
	buildFight(run, door);
	openCombat(run, events);
	return maybeWonRoom(run, events) ?? {
		run,
		events
	};
}
function brace(prev, heroId) {
	const run = clone(prev);
	const events = [];
	if (run.phase !== "prep") return {
		run: prev,
		events
	};
	const hero = heroById(run, heroId);
	if (!hero || hero.down || hero.braced) return {
		run: prev,
		events
	};
	hero.braced = true;
	const amount = Math.max(0, hero.def + hero.defBuff);
	log(run, `${hero.name} braces.`);
	giveBlock(run, hero, amount, events);
	return maybeWonRoom(run, events) ?? {
		run,
		events
	};
}
function useSupply(prev, supplyUid, targetId) {
	const run = clone(prev);
	const events = [];
	if (run.phase !== "prep" || run.prepSupplyUsed) return {
		run: prev,
		events
	};
	const inst = run.supplies.find((s) => s.uid === supplyUid);
	if (!inst) return {
		run: prev,
		events
	};
	const def = SUPPLIES[inst.defId];
	if (!def) return {
		run: prev,
		events
	};
	if (def.target === "enemy") {
		const foe = enemyById(run, targetId);
		if (!foe || foe.hp <= 0) return {
			run: prev,
			events
		};
	} else if (def.target === "ally") {
		const ally = heroById(run, targetId);
		if (!ally || ally.down) return {
			run: prev,
			events
		};
	} else if (def.target === "any-hero") {
		if (!heroById(run, targetId)) return {
			run: prev,
			events
		};
	}
	if (def.effects.some((e) => e.op === "mana")) {
		const ally = heroById(run, targetId);
		if (!ally || ally.maxMana <= 0) {
			log(run, "That hero has no mana to restore.");
			return {
				run,
				events: [{
					sfx: "ui",
					banner: "No mana to restore"
				}]
			};
		}
	}
	const actor = livingHeroes(run)[0] ?? run.party[0];
	log(run, `The party uses ${def.name}.`);
	resolveEffectsClean(run, actor, def.effects, targetId, events, []);
	run.supplies = run.supplies.filter((s) => s.uid !== supplyUid);
	run.supplyDiscard.push(inst.defId);
	run.prepSupplyUsed = true;
	events.push({ sfx: "card" });
	if (finishIfWiped(run)) return {
		run,
		events,
		outcome: "defeat"
	};
	return maybeWonRoom(run, events) ?? {
		run,
		events
	};
}
function resolveEffectsClean(run, hero, effects, targetId, events, exhaustHand) {
	resolveEffects(run, hero, effects.filter((e) => e.op !== "block"), targetId, events, exhaustHand);
	applyBlocks(run, hero, effects.filter((e) => e.op === "block"), targetId, events);
}
function beginBattle(prev) {
	const events = [];
	if (prev.phase !== "prep") return {
		run: prev,
		events
	};
	const run = clone(prev);
	if (livingHeroes(run).length === 0) return {
		run,
		events,
		outcome: "defeat"
	};
	beginRoundBattle(run, events);
	if (livingEnemies(run).length > 0) log(run, `${run.party[run.actorIndex]?.name ?? "A hero"}'s turn.`);
	events.push({ sfx: "card" });
	if (livingEnemies(run).length === 0 && run.finalSlain && run.phase !== "treasure") return {
		run,
		events,
		outcome: "victory"
	};
	return {
		run,
		events
	};
}
function playCard(prev, handUid, targetId) {
	const run = clone(prev);
	const events = [];
	if (run.phase !== "battle") return {
		run: prev,
		events
	};
	const hero = run.party[run.actorIndex];
	if (!hero || hero.down) return {
		run: prev,
		events
	};
	const handCard = run.hand.find((c) => c.uid === handUid);
	if (!handCard) return {
		run: prev,
		events
	};
	const def = CARDS[handCard.cardId];
	if (!def) return {
		run: prev,
		events
	};
	if (def.effects.some((e) => e.op === "grudge")) {
		const cap = relicBuild(hero, run).storeCap ?? 0;
		if (cap <= 0 || hero.stored < cap) {
			log(run, `${hero.name}'s grudge holds ${hero.stored}/${cap || 0}.`);
			return {
				run,
				events: [{
					sfx: "ui",
					banner: cap > 0 ? `Grudge ${hero.stored}/${cap}` : "Nothing stored"
				}]
			};
		}
	}
	if (def.effects.some((e) => e.op === "free-spell") && (hero.freeSpellUsed || hero.freeSpell)) {
		log(run, hero.freeSpellUsed ? `${hero.name} already spent the rite this room.` : `${hero.name} already holds a free spell.`);
		return {
			run,
			events: [{
				sfx: "ui",
				banner: hero.freeSpellUsed ? "Rite spent this room" : "A spell is already free"
			}]
		};
	}
	if (def.target === "enemy" || needsEnemy(def.effects)) {
		const foe = enemyById(run, targetId);
		if (!foe || foe.hp <= 0) return {
			run: prev,
			events
		};
	}
	if (def.target === "ally") {
		const ally = heroById(run, targetId);
		if (!ally || ally.down) return {
			run: prev,
			events
		};
	}
	const exhausts = def.effects.some((e) => e.op === "exhaust");
	const cost = def.mana ?? 0;
	const waived = cost > 0 && hero.freeSpell;
	if (cost > 0 && !waived && (hero.maxMana <= 0 || hero.mana < cost)) {
		log(run, `${hero.name} lacks the mana for ${def.name}.`);
		return {
			run,
			events: [{
				sfx: "ui",
				banner: "Not enough mana"
			}]
		};
	}
	if (waived) {
		hero.freeSpell = false;
		hero.freeSpellUsed = true;
		log(run, `${hero.name}'s spell costs nothing.`);
		events.push({ floater: {
			key: `hero:${hero.id}`,
			text: "Free",
			kind: "buff"
		} });
	} else if (cost > 0) {
		hero.mana -= cost;
		events.push({ floater: {
			key: `hero:${hero.id}`,
			text: `−${cost} mana`,
			kind: "buff"
		} });
	}
	const others = run.hand.filter((c) => c.uid !== handCard.uid);
	log(run, `${hero.name} plays ${def.name}.`);
	resolveEffectsClean(run, hero, def.effects, targetId, events, others);
	discardHand(hero, run.hand, handCard.uid, exhausts);
	run.hand = [];
	events.push({ sfx: "card" });
	return afterPlay(run, events);
}
function nextActor(run, events) {
	let next = run.actorIndex + 1;
	while (next < run.party.length && (run.party[next].down || run.party[next].hp <= 0)) next += 1;
	if (next >= run.party.length) {
		enterEnemyPhase(run);
		return {
			run,
			events
		};
	}
	startActor(run, next, events);
	if (run.phase !== "battle") return {
		run,
		events
	};
	log(run, `${run.party[next].name}'s turn.`);
	return {
		run,
		events
	};
}
function afterPlay(run, events) {
	if (finishIfWiped(run)) return {
		run,
		events,
		outcome: "defeat"
	};
	const won = maybeWonRoom(run, events);
	if (won) return won;
	run.playsLeft -= 1;
	const hero = run.party[run.actorIndex];
	if (run.playsLeft > 0 && hero && !hero.down) {
		dealHand(run, hero);
		log(run, `${hero.name} plays again.`);
		return {
			run,
			events
		};
	}
	return nextActor(run, events);
}
function endTurn(prev) {
	const run = clone(prev);
	const events = [];
	if (run.phase !== "battle") return {
		run: prev,
		events
	};
	const hero = run.party[run.actorIndex];
	if (!hero || hero.down) return {
		run: prev,
		events
	};
	log(run, `${hero.name} ends the turn.`);
	discardHand(hero, run.hand, "", false);
	run.hand = [];
	run.playsLeft = 1;
	events.push({ sfx: "ui" });
	return afterPlay(run, events);
}
function stepEnemies(prev) {
	if (prev.phase !== "enemy") return {
		run: prev,
		events: []
	};
	const run = clone(prev);
	run.clock += 1;
	const events = [];
	let guard = 0;
	while (guard++ < 8 && run.phase === "enemy") {
		if (run.beat === "bleed") {
			const foe = livingEnemies(run).find((e) => (e.bleed || 0) > 0 && !e.bleedTicked);
			if (!foe) {
				run.beat = "poison";
				continue;
			}
			foe.bleedTicked = true;
			const amt = foe.bleed;
			foe.bleed = Math.floor(foe.bleed / 2);
			damageEnemy(run, foe, amt, false, events, `Bleed weeps from ${foe.name} for {d}.`);
			events.push({ sfx: "hit" });
			if (livingEnemies(run).length === 0) return endOfEnemyPhase(run, events);
			return {
				run,
				events
			};
		}
		if (run.beat === "poison") {
			const foe = livingEnemies(run).find((e) => e.poison > 0 && !e.poisonTicked);
			if (!foe) {
				run.beat = "strikes";
				run.strikeIndex = 0;
				run.strikeHitsLeft = 0;
				continue;
			}
			foe.poisonTicked = true;
			const amt = foe.poison;
			foe.poison = Math.max(0, foe.poison - 1);
			damageEnemy(run, foe, amt, false, events, `Poison gnaws ${foe.name} for {d}.`);
			events.push({ sfx: "poison" });
			if (livingEnemies(run).length === 0) return endOfEnemyPhase(run, events);
			return {
				run,
				events
			};
		}
		if (run.beat === "strikes") {
			const foes = livingEnemies(run);
			if (run.strikeIndex >= foes.length) {
				run.beat = "hero-poison";
				continue;
			}
			const foe = foes[run.strikeIndex];
			if (foe.skip) {
				foe.skip = false;
				log(run, `${foe.name} loses its action in the smoke.`);
				run.strikeIndex += 1;
				run.strikeHitsLeft = 0;
				events.push({ sfx: "ui" });
				return {
					run,
					events
				};
			}
			const swings = foe.alwaysDouble || foe.raging && foe.rageDouble ? 2 : 1;
			if (run.strikeHitsLeft <= 0) run.strikeHitsLeft = swings;
			const living = livingHeroes(run);
			if (living.length === 0) return {
				run,
				events,
				outcome: "defeat"
			};
			let target = living[0];
			const taunt = living.find((h) => h.id === run.tauntHeroId);
			if (taunt) target = taunt;
			else {
				const weights = living.map((h) => 1.2 - h.hp / Math.max(1, h.maxHp));
				let r = roll(run) * weights.reduce((a, b) => a + b, 0);
				for (let i = 0; i < living.length; i++) {
					r -= weights[i];
					if (r <= 0) {
						target = living[i];
						break;
					}
				}
			}
			strikeHero(run, foe, target, events);
			run.strikeHitsLeft -= 1;
			if (run.strikeHitsLeft <= 0) run.strikeIndex += 1;
			if (livingHeroes(run).length === 0) return {
				run,
				events,
				outcome: "defeat"
			};
			return {
				run,
				events
			};
		}
		if (run.beat === "hero-poison") {
			const hero = run.party.find((h) => !h.down && h.hp > 0 && h.poison > 0 && !h.poisonTicked);
			if (!hero) {
				run.beat = "cleanup";
				continue;
			}
			hero.poisonTicked = true;
			const amt = hero.poison;
			hero.poison = Math.max(0, hero.poison - 1);
			log(run, `Poison ticks on ${hero.name} for ${amt}.`);
			hurtHero(run, hero, amt, events, true);
			events.push({ sfx: "poison" });
			if (livingHeroes(run).length === 0) return {
				run,
				events,
				outcome: "defeat"
			};
			return {
				run,
				events
			};
		}
		return endOfEnemyPhase(run, events);
	}
	return {
		run,
		events
	};
}
function acknowledgeCurse(prev) {
	const run = clone(prev);
	const events = [];
	if (run.phase !== "curse" || !run.activeDoor?.odds) return {
		run: prev,
		events
	};
	grantPartyXp(run, 4, events);
	run.offer = rollOffer(run, run.activeDoor.odds, 3);
	run.pendingRelic = null;
	run.phase = run.offer.length ? "treasure" : "onward";
	run.clearedNote = run.offer.length ? "The trap paid out. Choose one relic." : "Nothing inside but teeth.";
	return {
		run,
		events: [...events, {
			sfx: "card",
			doorDone: "curse"
		}]
	};
}
function chooseRelic(prev, offerUid) {
	const run = clone(prev);
	const events = [];
	if (run.phase !== "treasure") return {
		run: prev,
		events
	};
	if (offerUid === "none") {
		for (const o of run.offer) {
			const rel = RELICS[o.defId];
			if (rel) run.treasureDiscard[rel.rarity].push(o.defId);
		}
		run.offer = [];
		log(run, "The party leaves the relics.");
		if (run.finalSlain) return {
			run,
			events,
			outcome: "victory"
		};
		run.phase = "onward";
		run.clearedNote = "Onward.";
		return {
			run,
			events
		};
	}
	const offer = run.offer.find((o) => o.uid === offerUid);
	if (!offer) return {
		run: prev,
		events
	};
	for (const o of run.offer) {
		if (o.uid === offer.uid) continue;
		const rel = RELICS[o.defId];
		if (rel) run.treasureDiscard[rel.rarity].push(o.defId);
	}
	run.offer = [];
	run.pendingRelic = offer.defId;
	run.phase = "equip";
	log(run, `Claimed ${RELICS[offer.defId]?.name ?? "a relic"}. Who wears it?`);
	return {
		run,
		events: [{ sfx: "card" }]
	};
}
function slotsFor(run, hero) {
	const relics = run.equipped[hero.id] ?? [];
	const used = relics.length + (hero.keepsakeId ? 1 : 0);
	return {
		free: Math.max(0, 3 - used),
		relics
	};
}
function equipRelic(prev, heroId, replaceId) {
	const run = clone(prev);
	const events = [];
	if (run.phase !== "equip" || !run.pendingRelic) return {
		run: prev,
		events
	};
	const hero = heroById(run, heroId);
	if (!hero) return {
		run: prev,
		events
	};
	const relicId = run.pendingRelic;
	const rel = RELICS[relicId];
	if (rel?.classes?.length && !rel.classes.includes(hero.classId)) {
		log(run, `${rel.name} will not answer ${hero.name}.`);
		return {
			run,
			events: [{
				sfx: "ui",
				banner: "Not their art"
			}]
		};
	}
	const list = [...run.equipped[hero.id] ?? []];
	if (slotsFor(run, hero).free <= 0) {
		if (!replaceId || !list.includes(replaceId)) return {
			run: prev,
			events
		};
		const idx = list.indexOf(replaceId);
		const dropped = list[idx];
		list[idx] = relicId;
		const old = RELICS[dropped];
		if (old) run.treasureDiscard[old.rarity].push(dropped);
		log(run, `${hero.name} replaces ${old?.name ?? "a relic"} with ${RELICS[relicId]?.name}.`);
	} else {
		list.push(relicId);
		log(run, `${hero.name} equips ${RELICS[relicId]?.name}.`);
	}
	run.equipped[hero.id] = list;
	recompute(hero, run, true);
	syncGrants(hero, run);
	grantXp(run, hero, 6, events);
	run.pendingRelic = null;
	events.push({
		sfx: "unlock",
		banner: `${hero.name} takes ${RELICS[relicId]?.name}.`
	});
	if (run.finalSlain) return {
		run,
		events,
		outcome: "victory"
	};
	if (run.afterEquip === "shop") {
		run.afterEquip = null;
		run.phase = "shop";
		run.clearedNote = "The stall is still open.";
		return {
			run,
			events
		};
	}
	run.phase = "onward";
	run.clearedNote = "Packed. The next arch waits.";
	return {
		run,
		events
	};
}
function stockShop(run) {
	const rnd = () => roll(run);
	const stock = [];
	const caster = run.party.some((h) => h.maxMana > 0);
	const supplyIds = shuffle(Object.keys(SUPPLIES).filter((id) => id !== "sup-mana" && id !== "sup-revive"), rnd).slice(0, caster ? 1 : 2);
	supplyIds.push("sup-revive");
	if (caster) supplyIds.push("sup-mana");
	for (const id of supplyIds) stock.push({
		uid: nextUid(run, "k"),
		kind: "supply",
		defId: id,
		price: SUPPLY_COST[id] ?? 16
	});
	for (let i = 0; i < 2; i++) {
		const n = roll(run);
		const id = takeRelic(run, i === 0 ? "common" : n < .08 ? "mythic" : n < .42 ? "rare" : "common", true);
		if (!id) continue;
		stock.push({
			uid: nextUid(run, "k"),
			kind: "relic",
			defId: id,
			price: relicCost(RELICS[id]?.rarity ?? "common")
		});
	}
	return stock;
}
function unsoldRelics(run) {
	for (const item of run.shop) {
		if (item.kind !== "relic") continue;
		const rel = RELICS[item.defId];
		if (rel) run.treasureDiscard[rel.rarity].push(item.defId);
	}
	run.shop = [];
}
function buySupply(prev, entryUid) {
	const run = clone(prev);
	const events = [];
	if (run.phase !== "shop") return {
		run: prev,
		events
	};
	const item = run.shop.find((entry) => entry.uid === entryUid && entry.kind === "supply");
	if (!item) return {
		run: prev,
		events
	};
	const def = SUPPLIES[item.defId];
	if (!def) return {
		run: prev,
		events
	};
	if (run.supplies.length >= 5) {
		log(run, "The pouch is full.");
		return {
			run,
			events: [{ sfx: "ui" }]
		};
	}
	if (run.gold < item.price) {
		log(run, `Not enough gold for ${def.name}.`);
		return {
			run,
			events: [{ sfx: "ui" }]
		};
	}
	run.gold -= item.price;
	run.supplies.push({
		uid: nextUid(run, "s"),
		defId: item.defId
	});
	run.shop = run.shop.filter((entry) => entry.uid !== item.uid);
	log(run, `Bought ${def.name} for ${item.price} gold. ${run.gold} left.`);
	return {
		run,
		events: [{
			sfx: "card",
			banner: `${def.name} — ${item.price} gold`
		}]
	};
}
function buyRelic(prev, entryUid) {
	const run = clone(prev);
	const events = [];
	if (run.phase !== "shop") return {
		run: prev,
		events
	};
	const item = run.shop.find((entry) => entry.uid === entryUid && entry.kind === "relic");
	if (!item) return {
		run: prev,
		events
	};
	const rel = RELICS[item.defId];
	if (!rel) return {
		run: prev,
		events
	};
	if (run.gold < item.price) {
		log(run, `Not enough gold for ${rel.name}.`);
		return {
			run,
			events: [{ sfx: "ui" }]
		};
	}
	run.gold -= item.price;
	run.shop = run.shop.filter((entry) => entry.uid !== item.uid);
	run.pendingRelic = item.defId;
	run.afterEquip = "shop";
	run.phase = "equip";
	log(run, `Bought ${rel.name} for ${item.price} gold. Who wears it?`);
	return {
		run,
		events: [{ sfx: "card" }]
	};
}
function leaveShop(prev) {
	const run = clone(prev);
	if (run.phase !== "shop") return {
		run: prev,
		events: []
	};
	unsoldRelics(run);
	run.phase = "onward";
	run.clearedNote = "The stall shutters.";
	log(run, run.clearedNote);
	return {
		run,
		events: []
	};
}
function discardSupply(prev, supplyUid) {
	const run = clone(prev);
	if (run.phase !== "supply") return {
		run: prev,
		events: []
	};
	const inst = run.supplies.find((s) => s.uid === supplyUid);
	if (!inst) return {
		run: prev,
		events: []
	};
	run.supplies = run.supplies.filter((s) => s.uid !== supplyUid);
	run.supplyDiscard.push(inst.defId);
	log(run, `Left ${SUPPLIES[inst.defId]?.name ?? "a supply"} behind.`);
	return {
		run,
		events: [{ sfx: "ui" }]
	};
}
function packSupplies(prev) {
	const run = clone(prev);
	if (run.phase !== "supply") return {
		run: prev,
		events: []
	};
	if (run.supplies.length > 5) return {
		run: prev,
		events: []
	};
	run.phase = "onward";
	run.clearedNote = "Pouches cinched.";
	return {
		run,
		events: []
	};
}
function goDeeper(prev) {
	const run = clone(prev);
	if (run.phase !== "onward") return {
		run: prev,
		events: []
	};
	if (run.finalSlain) return {
		run,
		events: [],
		outcome: "victory"
	};
	stashMonsters(run);
	run.enemies = [];
	run.depth += 1;
	run.offer = [];
	run.pendingRelic = null;
	generateDoors(run);
	return {
		run,
		events: [{ sfx: "door" }]
	};
}
function syncRoster(roster, run) {
	return roster.map((h) => {
		const p = run.party.find((x) => x.id === h.id);
		if (!p) return h;
		return {
			...h,
			level: p.level,
			xp: p.xp
		};
	});
}
function newlyUnlocked(roster, stats) {
	const doors = new Set(stats.doors ?? []);
	const slain = new Set(stats.slain ?? []);
	const ids = [];
	for (const h of roster) {
		if (h.unlocked) continue;
		const key = CLASSES[h.classId]?.unlock?.key;
		if (key === "door-ambush" && doors.has("ambush") || key === "door-curse" && doors.has("curse") || key === "door-font" && doors.has("font") || key === "boss-warden" && slain.has("warden") || key === "boss-king" && (slain.has("king") || stats.wins > 0)) ids.push(h.id);
	}
	return ids;
}
function cardNeeds(cardId) {
	const card = CARDS[cardId] ?? SUPPLIES[cardId];
	if (!card) return "none";
	if (card.target === "any-hero") return "any-hero";
	if (card.target === "ally") return "ally";
	if (card.target === "enemy") return "enemy";
	if (cardNeedsTarget(card.target, card.effects)) return "enemy";
	return "none";
}
function enemyIntent(enemy, round = 1) {
	const atk = Math.max(1, enemy.atk - enemy.weaken) + Math.max(0, round - 20);
	if (enemy.skip) return "Skips";
	const cleave = enemy.alwaysCleave || enemy.raging && enemy.rageCleave;
	const double = enemy.alwaysDouble || enemy.raging && enemy.rageDouble;
	let line = `${enemy.raging ? "Rage " : "Attack "}${cleave ? Math.max(1, Math.round(atk * .6)) : atk}`;
	if (cleave) line += " all";
	if (double) line += " × 2";
	if (enemy.poisonOnHit > 0) line += ` · P${enemy.poisonOnHit}`;
	return line;
}
var KEY = "adventure-cards-v1";
function emptyStats() {
	return {
		runs: 0,
		wins: 0,
		bosses: 0,
		lowHpBoss: false,
		fullPartyWin: false,
		doors: [],
		slain: []
	};
}
function emptySave() {
	return {
		version: 1,
		roster: defaultRoster(),
		stats: emptyStats(),
		settings: { mute: false },
		partyIds: ["knight"],
		locker: [],
		loadout: {},
		run: null,
		results: null
	};
}
function clampLevel(n) {
	return Math.max(1, Math.min(50, typeof n === "number" && Number.isFinite(n) ? Math.round(n) : 1));
}
function normalizeRoster(raw) {
	const incoming = Array.isArray(raw) ? raw : [];
	return defaultRoster().map((base) => {
		const found = incoming.find((h) => h && typeof h === "object" && h.id === base.id);
		if (!found) return base;
		const keepsake = typeof found.keepsakeId === "string" && RELICS[found.keepsakeId] ? found.keepsakeId : null;
		const unlocked = CLASSES[base.id]?.unlock ? Boolean(found.unlocked) : true;
		return {
			...base,
			level: clampLevel(found.level),
			xp: typeof found.xp === "number" && found.xp > 0 ? Math.floor(found.xp) : 0,
			keepsakeId: keepsake,
			unlocked,
			name: base.name
		};
	});
}
function normalizeRun(raw) {
	if (!raw || typeof raw !== "object") return null;
	const run = raw;
	if (!Array.isArray(run.party) || run.party.length === 0 || typeof run.phase !== "string") return null;
	run.clock = typeof run.clock === "number" ? run.clock : 0;
	run.cacheTaken = Boolean(run.cacheTaken);
	run.gold = typeof run.gold === "number" && Number.isFinite(run.gold) ? Math.max(0, Math.floor(run.gold)) : 0;
	if (!Array.isArray(run.shop)) run.shop = [];
	if (run.afterEquip !== "shop") run.afterEquip = null;
	if (!run.equipped) run.equipped = {};
	if (!Array.isArray(run.locker)) run.locker = [];
	if (!Array.isArray(run.log)) run.log = [];
	if (!Array.isArray(run.minions)) run.minions = [];
	for (const hero of run.party) {
		const maxMana = CLASSES[hero.classId]?.mana ?? 0;
		if (typeof hero.maxMana !== "number") hero.maxMana = maxMana;
		if (typeof hero.mana !== "number" || !Number.isFinite(hero.mana)) hero.mana = hero.maxMana;
		hero.mana = Math.max(0, Math.min(hero.maxMana, Math.floor(hero.mana)));
		hero.freeSpell = hero.freeSpell === true;
		hero.freeSpellUsed = hero.freeSpellUsed === true;
		if (typeof hero.stored !== "number" || !Number.isFinite(hero.stored)) hero.stored = 0;
		hero.stored = Math.max(0, Math.min(99, Math.floor(hero.stored)));
	}
	if (Array.isArray(run.enemies)) for (const enemy of run.enemies) hardenEnemy(enemy);
	return run;
}
function hardenEnemy(enemy) {
	const def = MONSTERS[enemy.defId];
	if (typeof enemy.baseAtk !== "number") enemy.baseAtk = enemy.raging ? Math.max(1, enemy.atk - (enemy.rageBonus || 0)) : enemy.atk;
	if (typeof enemy.form !== "number" || enemy.form < 1) enemy.form = 1;
	if (typeof enemy.forms !== "number") enemy.forms = enemy.boss ? def?.phases ?? 1 : 1;
	if (typeof enemy.formName !== "string") enemy.formName = "";
	if (typeof enemy.alwaysCleave !== "boolean") enemy.alwaysCleave = false;
	if (typeof enemy.alwaysDouble !== "boolean") enemy.alwaysDouble = false;
	if (typeof enemy.bleed !== "number" || !Number.isFinite(enemy.bleed)) enemy.bleed = 0;
	enemy.bleed = Math.max(0, Math.floor(enemy.bleed));
	if (typeof enemy.bleedTicked !== "boolean") enemy.bleedTicked = false;
}
function normalizeResults(raw) {
	if (!raw || typeof raw !== "object") return null;
	const r = raw;
	if (typeof r.victory !== "boolean" || !Array.isArray(r.rows)) return null;
	return {
		victory: r.victory,
		rows: r.rows,
		unlocked: Array.isArray(r.unlocked) ? r.unlocked.filter((id) => typeof id === "string") : [],
		bound: Boolean(r.bound),
		choice: r.choice && typeof r.choice.heroId === "string" && typeof r.choice.relicId === "string" ? r.choice : null
	};
}
function normalizeSave(raw) {
	const base = emptySave();
	if (!raw || typeof raw !== "object") return base;
	const s = raw;
	const roster = normalizeRoster(s.roster);
	const unlocked = new Set(roster.filter((h) => h.unlocked).map((h) => h.id));
	const partyIds = Array.isArray(s.partyIds) ? s.partyIds.filter((id) => typeof id === "string" && unlocked.has(id)).slice(0, 4) : base.partyIds;
	const statsIn = s.stats && typeof s.stats === "object" ? s.stats : base.stats;
	const settings = { mute: Boolean(s.settings && typeof s.settings === "object" && s.settings.mute) };
	return {
		version: 1,
		roster,
		stats: {
			runs: num(statsIn.runs),
			wins: num(statsIn.wins),
			bosses: num(statsIn.bosses),
			lowHpBoss: Boolean(statsIn.lowHpBoss),
			fullPartyWin: Boolean(statsIn.fullPartyWin),
			doors: strings(statsIn.doors),
			slain: strings(statsIn.slain)
		},
		settings,
		partyIds: partyIds.length ? partyIds : roster.some((h) => h.id === "knight" && h.unlocked) ? ["knight"] : [],
		locker: [],
		loadout: {},
		run: normalizeRun(s.run),
		results: normalizeResults(s.results)
	};
}
function num(n) {
	return typeof n === "number" && Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
}
function strings(raw) {
	if (!Array.isArray(raw)) return [];
	return raw.filter((id) => typeof id === "string");
}
function loadSave() {
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) return emptySave();
		return normalizeSave(JSON.parse(raw));
	} catch {
		return emptySave();
	}
}
function writeSave(blob) {
	try {
		const prev = localStorage.getItem(KEY);
		if (prev) localStorage.setItem(`${KEY}-bak`, prev);
		localStorage.setItem(KEY, JSON.stringify({
			...blob,
			version: 1
		}));
	} catch {}
}
function persist(s) {
	writeSave({
		version: 1,
		roster: s.roster,
		stats: s.stats,
		settings: s.settings,
		partyIds: s.partyIds,
		locker: [],
		loadout: {},
		run: s.run,
		results: s.results
	});
}
function outcomeResults(run, victory, unlocked) {
	return {
		victory,
		unlocked,
		bound: false,
		choice: null,
		rows: run.party.map((h) => ({
			id: h.id,
			name: h.name,
			classId: h.classId,
			xp: run.xpGained[h.id] ?? 0,
			from: run.levelStart[h.id] ?? h.level,
			to: h.level,
			relics: [...run.equipped[h.id] ?? []]
		}))
	};
}
var useGame = create((set, get) => {
	function commit(result) {
		const cur = get();
		let roster = syncRoster(cur.roster, result.run);
		const stats = { ...cur.stats };
		if (!Array.isArray(stats.doors)) stats.doors = [];
		if (!Array.isArray(stats.slain)) stats.slain = [];
		let seq = cur.seq;
		let shakeId = cur.shakeId;
		const floaters = [...cur.floaters];
		let bannerText = null;
		for (const e of result.events) {
			if (e.floater) {
				seq += 1;
				floaters.push({
					id: seq,
					key: e.floater.key,
					text: e.floater.text,
					kind: e.floater.kind
				});
			}
			if (e.banner) bannerText = e.banner;
			if (e.shake) {
				seq += 1;
				shakeId = seq;
			}
			if (e.sfx && !cur.settings.mute) playSfx(e.sfx);
			if (e.bossDead) {
				stats.bosses += 1;
				if (e.bossDead.lowHp) stats.lowHpBoss = true;
				if (!stats.slain.includes(e.bossDead.id)) stats.slain = [...stats.slain, e.bossDead.id];
			}
			if (e.doorDone && !stats.doors.includes(e.doorDone)) stats.doors = [...stats.doors, e.doorDone];
		}
		const unlockedNow = newlyUnlocked(roster, stats);
		if (unlockedNow.length) roster = roster.map((h) => unlockedNow.includes(h.id) ? {
			...h,
			unlocked: true
		} : h);
		let unlocked = [...unlockedNow];
		let results = cur.results;
		let run = result.run;
		if (result.outcome) {
			if (result.outcome === "victory") {
				stats.wins += 1;
				if (result.run.party.length >= 4) stats.fullPartyWin = true;
				if (!cur.settings.mute) playSfx("win");
			} else if (!cur.settings.mute) playSfx("lose");
			const more = newlyUnlocked(roster, stats);
			if (more.length) {
				roster = roster.map((h) => more.includes(h.id) ? {
					...h,
					unlocked: true
				} : h);
				unlocked = [...unlocked, ...more];
			}
			if (unlocked.length) {
				bannerText = `${unlocked.map((id) => CLASSES[id]?.heroName ?? "A hero").join(", ")} joins the guild.`;
				if (!cur.settings.mute) playSfx("unlock");
			}
			results = outcomeResults(result.run, result.outcome === "victory", unlocked);
			run = null;
		} else if (unlocked.length) {
			bannerText = `${unlocked.map((id) => CLASSES[id]?.heroName ?? "A hero").join(", ")} joins the guild.`;
			if (!cur.settings.mute) playSfx("unlock");
		}
		if (bannerText) seq += 1;
		const banner = bannerText ? {
			id: seq,
			text: bannerText
		} : cur.banner;
		set({
			roster,
			stats,
			run,
			results,
			floaters: floaters.slice(-10),
			banner,
			shakeId,
			seq
		});
		persist(get());
	}
	return {
		hydrated: false,
		roster: emptySave().roster,
		stats: emptySave().stats,
		settings: { mute: false },
		partyIds: ["knight"],
		run: null,
		results: null,
		floaters: [],
		banner: null,
		shakeId: 0,
		seq: 1,
		rules: false,
		sheet: null,
		abandonAsk: false,
		hydrate: () => {
			const saved = loadSave();
			const ids = newlyUnlocked(saved.roster, saved.stats);
			const roster = ids.length ? saved.roster.map((h) => ids.includes(h.id) ? {
				...h,
				unlocked: true
			} : h) : saved.roster;
			setMuted(saved.settings.mute);
			set({
				hydrated: true,
				roster,
				stats: saved.stats,
				settings: saved.settings,
				partyIds: saved.partyIds,
				run: saved.results ? null : saved.run,
				results: saved.results,
				floaters: [],
				banner: null
			});
			if (ids.length) persist(get());
		},
		toggleMute: () => {
			const settings = { mute: !get().settings.mute };
			setMuted(settings.mute);
			set({ settings });
			persist(get());
		},
		toggleHero: (id) => {
			const { roster, partyIds, run } = get();
			if (run) return;
			const hero = roster.find((h) => h.id === id);
			if (!Boolean(hero && (hero.unlocked || !CLASSES[id]?.unlock)) || !hero) return;
			set({
				roster: hero.unlocked ? roster : roster.map((h) => h.id === id ? {
					...h,
					unlocked: true
				} : h),
				partyIds: partyIds.includes(id) ? partyIds.filter((x) => x !== id) : partyIds.length >= 4 ? partyIds : [...partyIds, id]
			});
			persist(get());
		},
		openRules: (open) => set({ rules: open }),
		openSheet: (id) => set({ sheet: id }),
		askAbandon: (open) => set({ abandonAsk: open }),
		start: () => {
			const s = get();
			if (s.run || s.partyIds.length === 0) return;
			set({
				run: startRun(s.roster, s.partyIds),
				results: null,
				stats: {
					...s.stats,
					runs: s.stats.runs + 1
				},
				floaters: [],
				banner: null,
				abandonAsk: false
			});
			if (!s.settings.mute) playSfx("door");
			persist(get());
		},
		abandon: () => {
			set({
				run: null,
				abandonAsk: false,
				floaters: [],
				banner: null
			});
			persist(get());
		},
		resetGuild: () => {
			const mute = get().settings.mute;
			const blank = emptySave();
			blank.settings.mute = mute;
			setMuted(mute);
			set({
				roster: blank.roster,
				stats: blank.stats,
				settings: blank.settings,
				partyIds: blank.partyIds,
				run: null,
				results: null,
				floaters: [],
				banner: null,
				rules: false,
				sheet: null
			});
			persist(get());
		},
		chooseDoor: (id) => {
			const run = get().run;
			if (!run) return;
			commit(chooseDoor(run, id));
		},
		brace: (id) => {
			const run = get().run;
			if (!run) return;
			commit(brace(run, id));
		},
		applySupply: (id, target) => {
			const run = get().run;
			if (!run) return;
			commit(useSupply(run, id, target));
		},
		beginBattle: () => {
			const run = get().run;
			if (!run) return;
			commit(beginBattle(run));
		},
		playCard: (id, target) => {
			const run = get().run;
			if (!run) return;
			commit(playCard(run, id, target));
		},
		endTurn: () => {
			const run = get().run;
			if (!run) return;
			commit(endTurn(run));
		},
		step: () => {
			const run = get().run;
			if (!run || run.phase !== "enemy") return;
			commit(stepEnemies(run));
		},
		acknowledgeCurse: () => {
			const run = get().run;
			if (!run) return;
			commit(acknowledgeCurse(run));
		},
		chooseRelic: (id) => {
			const run = get().run;
			if (!run) return;
			commit(chooseRelic(run, id));
		},
		equipRelic: (heroId, replaceId) => {
			const run = get().run;
			if (!run) return;
			commit(equipRelic(run, heroId, replaceId));
		},
		discardSupply: (id) => {
			const run = get().run;
			if (!run) return;
			commit(discardSupply(run, id));
		},
		packSupplies: () => {
			const run = get().run;
			if (!run) return;
			commit(packSupplies(run));
		},
		buySupply: (id) => {
			const run = get().run;
			if (!run) return;
			commit(buySupply(run, id));
		},
		buyRelic: (id) => {
			const run = get().run;
			if (!run) return;
			commit(buyRelic(run, id));
		},
		leaveShop: () => {
			const run = get().run;
			if (!run) return;
			commit(leaveShop(run));
		},
		goDeeper: () => {
			const run = get().run;
			if (!run) return;
			commit(goDeeper(run));
		},
		pickKeepsake: (heroId, relicId) => {
			const results = get().results;
			if (!results?.victory) return;
			if (!results.rows.find((r) => r.id === heroId)?.relics.includes(relicId)) return;
			const same = results.choice?.heroId === heroId && results.choice.relicId === relicId;
			set({ results: {
				...results,
				choice: same ? null : {
					heroId,
					relicId
				}
			} });
			persist(get());
		},
		returnToCamp: () => {
			const { results, roster } = get();
			let next = roster;
			if (results?.choice) {
				const { heroId, relicId } = results.choice;
				next = roster.map((h) => h.id === heroId ? {
					...h,
					keepsakeId: relicId
				} : h);
			}
			set({
				roster: next,
				results: null,
				run: null,
				floaters: [],
				banner: null
			});
			persist(get());
		},
		dismissBanner: () => set({ banner: null })
	};
});
var MAP = {
	shield: Shield,
	music: Music,
	sun: Sun,
	leaf: Leaf,
	feather: Feather,
	flame: Flame,
	heart: HeartPulse,
	storm: CloudLightning,
	sword: Swords,
	skull: Skull,
	door: DoorOpen,
	pack: Backpack,
	gem: Gem,
	crown: Crown,
	droplet: Droplet,
	spark: Sparkles
};
function GameIcon({ name, className }) {
	const Icon = MAP[name];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
		className: className ?? "icon",
		"aria-hidden": "true",
		strokeWidth: 1.75
	});
}
function Floaters({ items }) {
	if (!items.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "floaters",
		"aria-hidden": "true",
		children: items.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", {
			className: `floater floater-${f.kind}`,
			children: f.text
		}, f.id))
	});
}
function PowerCard({ cardId, selected, disabled, onClick, testId, atk, atkBuff, dry, free, spent, held, badge, badgeHot, accent }) {
	const card = CARDS[cardId] ?? SUPPLIES[cardId];
	if (!card) return null;
	const power = cardPowerLabel({
		atk,
		atkBuff
	}, cardId);
	const kind = "kind" in card ? card.kind : "supply";
	const manaCost = "mana" in card ? card.mana : void 0;
	const body = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "card-kicker",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
				kind,
				free ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
					className: "card-mana is-free",
					children: " · free"
				}) : null,
				!free && manaCost ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
					className: "card-mana",
					children: [
						" · ",
						manaCost,
						" mana"
					]
				}) : null,
				held ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
					className: "card-mana is-free",
					children: " · ready"
				}) : null,
				spent ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
					className: "card-mana",
					children: " · spent"
				}) : null,
				badge ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
					className: `card-mana${badgeHot ? " is-free" : ""}`,
					children: [" · ", badge]
				}) : null
			] }), power ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
				className: "card-power",
				children: power
			}) : null]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "card-name font-display",
			children: card.name
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "card-text",
			children: card.text
		})
	] });
	const className = `playing-card${accent ? ` class-${accent}` : ""}${selected ? " is-selected" : ""}${disabled ? " is-disabled" : ""}${dry ? " is-dry" : ""}`;
	if (onClick) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		className,
		onClick,
		disabled,
		"data-testid": testId,
		children: body
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className,
		children: body
	});
}
function RelicCard({ relicId, selected, onClick, testId }) {
	const relic = RELICS[relicId];
	if (!relic) return null;
	const className = `playing-card relic relic-${relic.rarity}${selected ? " is-selected" : ""}`;
	const body = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "card-kicker",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: rarityLabel(relic.rarity) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameIcon, {
				name: relic.rarity === "mythic" ? "crown" : relic.rarity === "rare" ? "gem" : "spark",
				className: "icon-sm"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "card-name font-display",
			children: relic.name
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "card-text",
			children: relic.text
		})
	] });
	if (onClick) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		className,
		onClick,
		"data-testid": testId,
		children: body
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className,
		children: body
	});
}
function rarityLabel(r) {
	if (r === "mythic") return "Mythic";
	if (r === "rare") return "Rare";
	return "Common";
}
function ClassMark({ classId, className }) {
	const cls = CLASSES[classId];
	if (!cls) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: className ?? "mark",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameIcon, { name: cls.icon })
	});
}
function Rules() {
	const openRules = useGame((s) => s.openRules);
	const resetGuild = useGame((s) => s.resetGuild);
	const [ask, setAsk] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overlay",
		role: "presentation",
		onClick: () => openRules(false),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "sheet",
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": "rules-title",
			onClick: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "kicker",
					children: "Rules"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					id: "rules-title",
					children: "How a delve works"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "The goal" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Break three seals by defeating mini-bosses, then survive the Hollow King. Wipe, and the delve ends. Levels stay." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Doors" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Each depth offers doors. Risk, foe count, and loot odds are true. The flavor is only a rumor. Bigger parties face more foes, more health, and harder hits." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Prep" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Brace once: gain Block equal to your Defense." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Spend at most one supply. The pouch holds five." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Then begin the clash." })
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Battle" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Heroes act in seat order. Each plays one card from three drawn." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Damage is Attack + the card, then minus Armor (at least 1 if you connect)." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Incoming hits subtract Defense, then Block. Block clears after the monsters act." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Poison ticks at the start of the monster phase for foes, and after their strikes for heroes. It then drops by 1." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "At half a form, a boss rages — harder hits, sometimes the whole party." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Seal bosses have three forms. Drop one to zero and it returns at full health, meaner. The Hollow King does this once." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Quiet halls, nests, and vaults pay common or rare relics only. Mythic loot waits on elites, cursed reliquaries, and bosses." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Clearing a fight pays gold. Weak foes pay least, bosses pay most." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "A wayside stall sells supplies and relics for that gold. Every stall stocks a Revive Phial: in prep, use it on a downed ally and they stand with 12 health. Stalls are common, and sometimes a second one sets up as an extra door. The pouch still holds five." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Mages, druids, witches, the necromancer, and the Nephilim have a mana bar. Some cards spend it. Mana does not come back on its own — buy a Mana Phial, step into a Ley Font, or wear a relic that drinks from a strike or a shield." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Mana Fang returns 3 mana when an attack lands. Bulwark Bead returns 3 mana when you gain Block. Ley Covenant still returns 1, and adds Unpriced Word: once each room, the next spell costs nothing." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Bleed deals its stacks when the monsters begin to act, then halves. Poison fades by 1 instead. Sawtooth and Gut Hook open bleeds. Leech Blade bleeds and heals." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Grudge Plate stores damage you weather, block included, up to 12. Grudge Blow then spends it: a heavy hit that ignores armor, and a heal." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Some relics belong to one class. While worn, they add a card to that hero's deck. Take the relic off and the card leaves with it." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "The necromancer raises thralls. They strike when called and sometimes step in front of a blow. Two may stand at once." })
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Treasure" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Claim one relic and equip it. Three slots, and a keepsake counts. If you win, bind one relic from the delve to its owner. Everything else stays in the dark." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Unlocks" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Veil Rogue — clear an Ambush Stair." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Cinder Witch — survive a Cursed Reliquary." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Grave Cleric — step into a Ley Font." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Storm Warden — slay the Grim Warden." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "The Nephilim is already in the guild." })
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "inline-actions",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "btn btn-gold",
						onClick: () => openRules(false),
						children: "Back to the table"
					}), ask ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "btn btn-blood",
						onClick: resetGuild,
						children: "Confirm disband"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "btn btn-ghost",
						onClick: () => setAsk(true),
						children: "Disband guild"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "hint",
					children: "Disband resets levels, keepsakes, and unlocks on this device."
				})
			]
		})
	});
}
function HeroSheet() {
	const id = useGame((s) => s.sheet);
	const roster = useGame((s) => s.roster);
	const openSheet = useGame((s) => s.openSheet);
	if (!id) return null;
	const hero = roster.find((h) => h.id === id);
	const cls = CLASSES[id];
	if (!hero || !cls) return null;
	const built = computeStats(id, hero.unlocked ? hero.level : 1, relicIdsOf(hero.keepsakeId, []));
	const cards = deckFor(id, hero.unlocked ? hero.level : 1);
	const unique = [...new Set(cards)];
	const need = xpThreshold(hero.level);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overlay",
		role: "presentation",
		onClick: () => openSheet(null),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `sheet class-${id}`,
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": "sheet-title",
			onClick: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "plate-top",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "kicker",
							children: cls.role
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							id: "sheet-title",
							children: hero.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: cls.name })
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClassMark, { classId: id })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: cls.blurb }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "stats-row",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "stat",
							children: ["HP ", built.maxHp]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "stat",
							children: ["ATK ", built.atk]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "stat",
							children: ["DEF ", built.def]
						}),
						hero.unlocked ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "stat",
							children: ["Lv ", hero.level]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "stat",
							children: "Locked"
						})
					]
				}),
				hero.unlocked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "hint",
					children: hero.level >= 50 ? "Max level" : `${hero.xp} / ${need} xp to next level`
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "lock-line",
					children: cls.unlock?.label
				}),
				hero.keepsakeId && RELICS[hero.keepsakeId] ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "hint",
					children: [
						"Keepsake: ",
						RELICS[hero.keepsakeId].name,
						" — ",
						RELICS[hero.keepsakeId].text
					]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Deck" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: unique.map((cid) => {
					const card = CARDS[cid];
					const n = cards.filter((c) => c === cid).length;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: card?.name }),
						n > 1 ? ` ×${n}` : "",
						" — ",
						card?.text
					] }, cid);
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Learned later" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: cls.milestones.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
					"Level ",
					m.level,
					": ",
					CARDS[m.cardId]?.name,
					hero.unlocked && hero.level >= m.level ? " (known)" : "",
					" — ",
					CARDS[m.cardId]?.text
				] }, m.cardId)) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "btn btn-gold",
					onClick: () => openSheet(null),
					children: "Close"
				})
			]
		})
	});
}
function GearBook({ onClose }) {
	const run = useGame((s) => s.run);
	const roster = useGame((s) => s.roster);
	const partyIds = useGame((s) => s.partyIds);
	const heroes = run ? run.party.map((h) => ({
		id: h.id,
		name: h.name,
		classId: h.classId,
		level: h.level,
		keepsakeId: h.keepsakeId,
		equipped: run.equipped[h.id] ?? []
	})) : partyIds.map((id) => roster.find((h) => h.id === id)).filter((h) => Boolean(h)).map((h) => ({
		id: h.id,
		name: h.name,
		classId: h.classId,
		level: h.level,
		keepsakeId: h.keepsakeId,
		equipped: []
	}));
	const [tab, setTab] = (0, import_react.useState)(heroes[0]?.id ?? "");
	const hero = heroes.find((h) => h.id === tab) ?? heroes[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overlay",
		role: "presentation",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "sheet",
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": "gear-title",
			"data-testid": "gear-sheet",
			onClick: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "kicker",
					children: "Equipment"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					id: "gear-title",
					children: "What you are wearing"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: run ? "Keepsakes came from a won delve. The other slots are relics from this one. Three pieces total." : "Only keepsakes survive a delve. Seat a hero, then open Gear inside a run to see relics as you claim them." }),
				heroes.length === 0 || !hero ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "hint",
					children: "Seat a hero to see their belt."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "gear-tabs",
					role: "tablist",
					"aria-label": "Heroes",
					children: heroes.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						role: "tab",
						"aria-selected": h.id === hero.id,
						className: `${h.id === hero.id ? "is-on" : ""} class-${h.classId}`,
						onClick: () => setTab(h.id),
						children: h.name
					}, h.id))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeroGear, {
					hero,
					inRun: Boolean(run)
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "btn btn-gold",
					onClick: onClose,
					children: "Close"
				})
			]
		})
	});
}
function HeroGear({ hero, inRun }) {
	const cls = CLASSES[hero.classId];
	const worn = relicIdsOf(hero.keepsakeId, hero.equipped);
	const withGear = computeStats(hero.classId, hero.level, worn);
	const bare = computeStats(hero.classId, hero.level, []);
	const slots = [{
		label: "Keepsake",
		id: hero.keepsakeId
	}, ...hero.equipped.map((id, i) => ({
		label: `Delve relic ${i + 1}`,
		id
	}))];
	const delveCap = 3 - (hero.keepsakeId ? 1 : 0);
	const empty = Math.max(0, delveCap - hero.equipped.length);
	const dh = withGear.maxHp - bare.maxHp;
	const da = withGear.atk - bare.atk;
	const dd = withGear.def - bare.def;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "hint",
			children: cls?.name
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "stats-row",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "stat",
					children: ["HP ", withGear.maxHp]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "stat",
					children: ["ATK ", withGear.atk]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "stat",
					children: ["DEF ", withGear.def]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "hint",
			children: dh || da || dd ? `Gear is worth ${signed(dh)} HP, ${signed(da)} ATK, ${signed(dd)} DEF, before any other tricks below.` : "Nothing equipped is changing these numbers yet."
		}),
		slots.map((slot) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GearSlot, {
			label: slot.label,
			relicId: slot.id
		}, slot.label)),
		Array.from({ length: empty }, (_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GearSlot, {
			label: inRun ? "Empty slot" : "Delve slot",
			relicId: null
		}, `empty-${i}`))
	] });
}
function GearSlot({ label, relicId }) {
	const relic = relicId ? RELICS[relicId] : void 0;
	if (!relic) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "gear-slot is-empty",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "kicker",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "name font-display",
				children: "Empty"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "hint",
				children: label === "Keepsake" ? "Win a delve and bind one relic. It comes home on this hero and uses one of the three slots." : "Clear a hall and claim a relic. Bosses expect you to have some."
			})
		]
	});
	const bits = relicEffects(relic);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: `gear-slot relic-${relic.rarity}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "kicker",
				children: [
					label,
					" · ",
					relic.rarity
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "name font-display",
				children: relic.name
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: relic.text }),
			bits.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "badge-row",
				children: bits.map((bit) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "badge",
					children: bit
				}, bit))
			}) : null
		]
	});
}
function signed(n) {
	if (n > 0) return `+${n}`;
	return String(n);
}
function ItemCodex({ onClose }) {
	const supplies = Object.values(SUPPLIES);
	const groups = [
		"common",
		"rare",
		"mythic"
	].map((rarity) => ({
		rarity,
		relics: [...new Set(TREASURE_DECKS[rarity])].map((id) => RELICS[id]).filter((relic) => Boolean(relic))
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overlay",
		role: "presentation",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "sheet",
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": "items-title",
			"data-testid": "items-sheet",
			onClick: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "kicker",
					children: "Codex"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					id: "items-title",
					children: "Every item"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Supplies sit in the pouch. Relics are worn, three to a hero. The gold is what a stall charges." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Supplies" }),
				supplies.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "codex-row",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						className: "codex-art",
						src: `/supplies/${item.id}.png`,
						alt: ""
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "kicker",
							children: [SUPPLY_COST[item.id], " gold"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "name font-display",
							children: item.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: item.text })
					] })]
				}, item.id)),
				groups.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", { children: [group.rarity[0].toUpperCase() + group.rarity.slice(1), " relics"] }), group.relics.map((relic) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: `codex-row relic-${relic.rarity}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						className: "codex-art",
						src: `/relics/${relic.id}.png`,
						alt: ""
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "kicker",
							children: [
								relic.rarity,
								" · ",
								relicCost(relic.rarity),
								" gold"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "name font-display",
							children: relic.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: relic.text })
					] })]
				}, relic.id))] }, group.rarity)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "btn btn-gold",
					onClick: onClose,
					children: "Close"
				})
			]
		})
	});
}
var HALL = [
	"",
	"Calm halls",
	"Stirring halls",
	"Dangerous halls",
	"Brutal halls"
];
function Camp() {
	const roster = useGame((s) => s.roster);
	const partyIds = useGame((s) => s.partyIds);
	const stats = useGame((s) => s.stats);
	const mute = useGame((s) => s.settings.mute);
	const toggleHero = useGame((s) => s.toggleHero);
	const toggleMute = useGame((s) => s.toggleMute);
	const openRules = useGame((s) => s.openRules);
	const openSheet = useGame((s) => s.openSheet);
	const start = useGame((s) => s.start);
	const [gear, setGear] = (0, import_react.useState)(false);
	const [codex, setCodex] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "scroll-body",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "mast",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "kicker",
								children: "Guild hall"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "Adventure Cards" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "lede",
								children: "Draft up to four heroes, pick a door, and break three seals before the Hollow King. Pass the device for co-op, or take the table alone."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "sub",
								children: [
									stats.wins,
									" wins · ",
									stats.runs,
									" delves · ",
									stats.bosses,
									" bosses slain"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mast-actions",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "btn btn-ghost",
										"data-testid": "open-gear",
										onClick: () => setGear(true),
										children: "Gear"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "btn btn-ghost",
										"data-testid": "open-items",
										onClick: () => setCodex(true),
										children: "Items"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "btn btn-ghost",
										onClick: () => openRules(true),
										children: "How to play"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "btn btn-ghost",
										onClick: toggleMute,
										children: mute ? "Sound off" : "Sound on"
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "section",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "The table" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "hint",
								children: partyIds.length === 0 ? "Seat at least one hero." : `${partyIds.length} seated · ${HALL[partyIds.length]}. More heroes, tougher foes.`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "seats",
								children: Array.from({ length: 4 }, (_, i) => {
									const id = partyIds[i];
									const hero = roster.find((h) => h.id === id);
									const cls = id ? CLASSES[id] : void 0;
									if (!hero || !cls) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "seat is-empty",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "seat-no",
												children: ["Player ", i + 1]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "name font-display",
												children: "Empty seat"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "hint",
												children: "Choose a hero below."
											})
										]
									}, i);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: `seat class-${id}`,
										onClick: () => toggleHero(id),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "roster-row",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												className: "roster-portrait",
												src: `/figures/hero-${id}.png`,
												alt: ""
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "roster-body",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
														className: "seat-no",
														children: ["Player ", i + 1]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "name font-display",
														children: hero.name
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "role",
														children: cls.name
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "hint",
														children: "Tap to unseat"
													})
												]
											})]
										})
									}, id);
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "section",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Guild roster" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "hint",
								children: "Heroes keep their levels. Relics last one delve — a single keepsake may come home if you win."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "roster",
								children: CLASS_ORDER.map((id) => {
									const hero = roster.find((h) => h.id === id);
									const cls = CLASSES[id];
									if (!hero || !cls) return null;
									const open = hero.unlocked || !cls.unlock;
									const seated = partyIds.includes(id);
									const statsNow = computeStats(id, hero.level, relicIdsOf(hero.keepsakeId, []));
									const need = xpThreshold(hero.level);
									const pct = hero.level >= 50 || need === 0 ? 100 : Math.min(100, hero.xp / need * 100);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
										className: `hero-plate class-${id}${open ? "" : " is-locked"}${seated ? " is-seated" : ""}`,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "roster-row",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												className: "roster-portrait",
												src: `/figures/hero-${id}.png`,
												alt: ""
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "roster-body",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "plate-top",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "role",
															children: cls.role
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
															className: "name font-display",
															children: hero.name
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "hint",
															children: cls.name
														})
													] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClassMark, { classId: id })]
												}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "stats-row",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																className: "stat",
																children: ["Lv ", hero.level]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																className: "stat",
																children: ["HP ", statsNow.maxHp]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																className: "stat",
																children: ["ATK ", statsNow.atk]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																className: "stat",
																children: ["DEF ", statsNow.def]
															}),
															cls.mana ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																className: "stat",
																children: ["Mana ", cls.mana]
															}) : null
														]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "xp",
														"aria-hidden": true,
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { width: `${pct}%` } })
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
														className: "hint",
														children: [hero.level >= 50 ? "Max level" : `${hero.xp} / ${need} xp`, hero.keepsakeId && RELICS[hero.keepsakeId] ? ` · Keepsake: ${RELICS[hero.keepsakeId].name}` : ""]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "inline-actions",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															type: "button",
															className: "btn btn-tiny btn-gold",
															"data-testid": `roster-${id}`,
															onClick: () => toggleHero(id),
															disabled: !seated && partyIds.length >= 4,
															children: seated ? "Unseat" : "Seat"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															type: "button",
															className: "btn btn-tiny btn-ghost",
															onClick: () => openSheet(id),
															children: "Deck"
														})]
													})
												] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "lock-line",
														children: cls.unlock?.label
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "hint",
														children: cls.blurb
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														className: "btn btn-tiny btn-ghost",
														onClick: () => openSheet(id),
														children: "Preview"
													})
												] })]
											})]
										})
									}, id);
								})
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "action-bar",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "btn btn-gold",
					"data-testid": "begin-delve",
					disabled: partyIds.length === 0,
					onClick: start,
					children: "Begin delve"
				})
			}),
			gear ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GearBook, { onClose: () => setGear(false) }) : null,
			codex ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemCodex, { onClose: () => setCodex(false) }) : null
		]
	});
}
var HINT = {
	doors: "Risk, foe count, and loot odds are true. The sentence under them is only a rumor.",
	prep: "Brace for Block equal to Defense, or spend one supply. Then start the clash.",
	battle: "Play one card. Defense subtracts first, then Block. Block fades after the monsters act.",
	enemy: "Monsters are striking. Defense, then Block.",
	treasure: "Claim one relic. Three slots per hero — a keepsake already counts.",
	equip: "Choose who wears it. A full hero must replace a delve relic. Keepsakes stay.",
	supply: "The pouch holds five. Leave extras behind, then pack up.",
	shop: "Buy supplies or relics with gold from cleared fights. The pouch still holds five.",
	curse: "The trap stops at 1 health. The relic inside might be worth the bite.",
	onward: "Deeper halls hit a little harder."
};
var PHASE_LABEL = [
	["doors", "Doors"],
	["prep", "Prep"],
	["battle", "Battle"],
	["treasure", "Treasure"]
];
function phaseIndex(phase) {
	if (phase === "doors" || phase === "onward" || phase === "supply" || phase === "shop") return 0;
	if (phase === "prep") return 1;
	if (phase === "battle" || phase === "enemy") return 2;
	return 3;
}
function strikingUid(run) {
	if (run.phase !== "enemy" || run.beat !== "strikes") return null;
	return run.enemies.filter((enemy) => enemy.hp > 0)[run.strikeHitsLeft > 0 ? run.strikeIndex : run.strikeIndex - 1]?.uid ?? null;
}
function Delve() {
	const run = useGame((s) => s.run);
	const floaters = useGame((s) => s.floaters);
	const shakeId = useGame((s) => s.shakeId);
	const mute = useGame((s) => s.settings.mute);
	const openRules = useGame((s) => s.openRules);
	const toggleMute = useGame((s) => s.toggleMute);
	const abandonAsk = useGame((s) => s.abandonAsk);
	const askAbandon = useGame((s) => s.askAbandon);
	const abandon = useGame((s) => s.abandon);
	const chooseDoor = useGame((s) => s.chooseDoor);
	const brace = useGame((s) => s.brace);
	const applySupply = useGame((s) => s.applySupply);
	const beginBattle = useGame((s) => s.beginBattle);
	const play = useGame((s) => s.playCard);
	const endTurn = useGame((s) => s.endTurn);
	const step = useGame((s) => s.step);
	const acknowledgeCurse = useGame((s) => s.acknowledgeCurse);
	const chooseRelic = useGame((s) => s.chooseRelic);
	const equipRelic = useGame((s) => s.equipRelic);
	const discardSupply = useGame((s) => s.discardSupply);
	const packSupplies = useGame((s) => s.packSupplies);
	const goDeeper = useGame((s) => s.goDeeper);
	const buySupply = useGame((s) => s.buySupply);
	const buyRelic = useGame((s) => s.buyRelic);
	const leaveShop = useGame((s) => s.leaveShop);
	const [pick, setPick] = (0, import_react.useState)(null);
	const [replacing, setReplacing] = (0, import_react.useState)(null);
	const [shaking, setShaking] = (0, import_react.useState)(false);
	const [gear, setGear] = (0, import_react.useState)(false);
	const [codex, setCodex] = (0, import_react.useState)(false);
	const handKey = run?.hand.map((c) => c.uid).join("|") ?? "";
	const phase = run?.phase;
	const actor = run?.actorIndex ?? 0;
	const clock = run?.clock ?? 0;
	const round = run?.round ?? 0;
	(0, import_react.useEffect)(() => {
		setPick(null);
		setReplacing(null);
	}, [
		phase,
		actor,
		handKey,
		round
	]);
	(0, import_react.useEffect)(() => {
		if (phase !== "enemy" || gear) return;
		const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		const t = window.setTimeout(() => step(), reduced ? 160 : 560);
		return () => window.clearTimeout(t);
	}, [
		phase,
		clock,
		step,
		gear
	]);
	(0, import_react.useEffect)(() => {
		if (!shakeId) return;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		setShaking(true);
		const t = window.setTimeout(() => setShaking(false), 320);
		return () => window.clearTimeout(t);
	}, [shakeId]);
	if (!run) return null;
	const actorHero = run.party[run.actorIndex];
	const on = phaseIndex(run.phase);
	const attacker = strikingUid(run);
	const upper = run.enemies.length > 0 || run.phase === "treasure" || run.phase === "shop" || run.phase === "equip" && Boolean(run.pendingRelic);
	function storeCapOf(hero) {
		const gear = run?.equipped[hero.id] ?? [];
		return computeStats(hero.classId, hero.level, relicIdsOf(hero.keepsakeId, gear)).storeCap;
	}
	function floats(key) {
		return floaters.filter((f) => f.key === key);
	}
	function commitPick(target) {
		if (!pick) return;
		if (pick.source === "card") play(pick.id, target);
		else applySupply(pick.id, target);
		setPick(null);
	}
	function clickHero(hero) {
		if (!pick) return;
		if (pick.need === "any-hero") commitPick(hero.id);
		else if (pick.need === "ally" && !hero.down) commitPick(hero.id);
	}
	const pickedCard = pick?.source === "card" ? run.hand.find((c) => c.uid === pick.id) : void 0;
	const pickedSupply = pick?.source === "supply" ? run.supplies.find((s) => s.uid === pick.id) : void 0;
	const pickLabel = pickedCard ? CARDS[pickedCard.cardId]?.name ?? "Card" : pickedSupply ? SUPPLIES[pickedSupply.defId]?.name ?? "Supply" : "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `screen scene${shaking ? " is-shaking" : ""}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "topbar",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "kicker",
						children: ["Depth ", run.depth]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "seals",
						"aria-label": `${run.seals} of 3 seals broken`,
						children: [
							[
								0,
								1,
								2
							].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `seal${i < run.seals ? " is-on" : ""}` }, i)),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "stat",
								children: ["Gold ", run.gold]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "hint",
								children: [run.seals, "/3 seals"]
							})
						]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "phase-track",
						"aria-label": "Phase",
						children: PHASE_LABEL.map(([key, label], i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: i === on ? "is-on" : "",
							children: label
						}, key))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "inline-actions",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "btn btn-tiny btn-gold",
								"data-testid": "open-gear",
								onClick: () => setGear(true),
								children: "Gear"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "btn btn-tiny btn-ghost",
								"data-testid": "open-items",
								onClick: () => setCodex(true),
								children: "Items"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "btn btn-tiny btn-ghost",
								onClick: () => openRules(true),
								children: "Rules"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "btn btn-tiny btn-ghost",
								onClick: toggleMute,
								children: mute ? "Sound off" : "Sound on"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "btn btn-tiny btn-ghost",
								onClick: () => askAbandon(true),
								children: "Flee"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "stage",
				children: run.phase === "doors" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "hint",
						children: HINT.doors
					}),
					run.intro ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "name",
						children: run.intro
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "door-grid",
						children: run.doors.map((door, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: `door door-${door.kind}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DoorArt, { kind: door.kind }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "door-body",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: `role risk-${door.risk.toLowerCase()}`,
										children: [door.risk, " risk"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "name",
										children: door.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: door.hint }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "chip-name",
										children: door.foes
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "hint",
										children: door.lootLabel
									}),
									door.odds ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "odds",
										"aria-hidden": true,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
												className: "odd-common",
												style: { flex: `${door.odds.common} 0 0` }
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
												className: "odd-rare",
												style: { flex: `${door.odds.rare} 0 0` }
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
												className: "odd-mythic",
												style: { flex: `${door.odds.mythic} 0 0` }
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "hint",
										children: [
											door.odds.common,
											"% common · ",
											door.odds.rare,
											"% rare · ",
											door.odds.mythic,
											"% mythic"
										]
									})] }) : null,
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "btn btn-gold",
										"data-testid": `door-${i}`,
										onClick: () => chooseDoor(door.uid),
										children: "Enter"
									})
								]
							})]
						}, door.uid))
					})
				] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `battlefield${upper ? " has-upper" : ""}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "scene-caption",
							children: run.log.at(-1) || run.intro || HINT[run.phase]
						}),
						run.enemies.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "foe-line",
							"aria-label": "Foes",
							children: run.enemies.map((enemy) => {
								const dead = enemy.hp <= 0;
								const targetable = !dead && pick?.need === "enemy";
								const hit = floats(`enemy:${enemy.uid}`).some((f) => f.kind === "dmg");
								const form = enemy.form || 1;
								const art = enemy.boss && form > 1 ? `/figures/foe-${enemy.defId}-${form}.png` : `/figures/foe-${enemy.defId}.png`;
								const wide = enemy.defId === "bat" || enemy.defId === "spider" || enemy.defId === "hydra";
								const swinging = attacker === enemy.uid;
								const className = `stand${enemy.boss ? ` is-boss is-form-${form}` : ""}${wide ? " is-wide" : ""}${enemy.raging ? " is-raging" : ""}${dead ? " is-down" : ""}${targetable ? " is-target" : ""}${hit ? " is-hit" : ""}${swinging ? " is-striking" : ""}`;
								const body = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Floaters, { items: floats(`enemy:${enemy.uid}`) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhaseFlash, { form }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StandArt, {
										src: art,
										mark: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameIcon, { name: "skull" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "stand-plate",
										children: [
											enemy.boss && form > 1 && enemy.formName ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "role",
												children: enemy.formName
											}) : null,
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "chip-name",
												children: [enemy.name, dead ? " · Down" : ` · ${enemy.hp}/${enemy.maxHp}`]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VitalBar, {
												hp: enemy.hp,
												maxHp: enemy.maxHp,
												poison: enemy.poison,
												bleed: enemy.bleed,
												shield: 0,
												foe: true
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "hint",
												children: [
													dead ? "Defeated" : enemyIntent(enemy, run.round),
													!dead && enemy.armor > 0 ? ` · Armor ${enemy.armor}` : "",
													!dead && enemy.pierce > 0 ? ` · Pierce ${enemy.pierce}` : "",
													!dead && enemy.poison > 0 ? ` · Poison ${enemy.poison}` : "",
													!dead && enemy.bleed > 0 ? ` · Bleed ${enemy.bleed}` : ""
												]
											}),
											enemy.boss && (enemy.forms || 1) > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "form-pips",
												"aria-label": `Form ${form} of ${enemy.forms}`,
												children: Array.from({ length: enemy.forms }, (_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `form-pip${i < form ? " is-on" : ""}` }, i))
											}) : null
										]
									})
								] });
								if (targetable) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className,
									onClick: () => commitPick(enemy.uid),
									children: body
								}, swinging ? `${enemy.uid}-${run.clock}` : enemy.uid);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className,
									children: body
								}, swinging ? `${enemy.uid}-${run.clock}` : enemy.uid);
							})
						}) : null,
						run.enemies.length === 0 && (run.phase === "treasure" || run.phase === "equip" && run.pendingRelic) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "foe-line is-loot-row",
							"aria-label": "Relics",
							children: (run.phase === "equip" && run.pendingRelic ? [{
								uid: "pending",
								defId: run.pendingRelic
							}] : run.offer).map((offer, i) => {
								const relic = RELICS[offer.defId];
								const picking = run.phase === "treasure";
								const body = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StandArt, {
									src: `/relics/${offer.defId}.png`,
									mark: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameIcon, { name: relic?.rarity === "mythic" ? "crown" : "gem" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "stand-plate is-wares",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "role",
											children: [relic?.rarity ?? "relic", relic?.classes?.length ? ` · ${relic.classes.map((id) => CLASSES[id]?.name ?? id).join(", ")}` : ""]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "chip-name",
											children: relic?.name ?? "Relic"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "hint",
											children: relic?.text
										})
									]
								})] });
								if (!picking) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `stand is-loot is-${relic?.rarity ?? "common"}`,
									children: body
								}, offer.uid);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: `stand is-loot is-${relic?.rarity ?? "common"}`,
									"data-testid": `relic-${i}`,
									onClick: () => chooseRelic(offer.uid),
									children: body
								}, offer.uid);
							})
						}) : null,
						run.phase === "shop" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "foe-line is-stall",
							"aria-label": "Stall",
							children: ["supply", "relic"].map((kind) => {
								const items = run.shop.filter((item) => item.kind === kind);
								if (items.length === 0) return null;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "ware-band",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "ware-kicker",
										children: kind === "supply" ? "Supplies" : "Relics"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "ware-items",
										children: items.map((item) => {
											const relic = item.kind === "relic" ? RELICS[item.defId] : void 0;
											const supply = item.kind === "supply" ? SUPPLIES[item.defId] : void 0;
											const name = relic?.name ?? supply?.name ?? "Goods";
											const text = relic?.text ?? supply?.text ?? "";
											const broke = run.gold < item.price;
											const full = item.kind === "supply" && run.supplies.length >= 5;
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												className: `stand is-loot is-${relic?.rarity ?? "common"}${broke || full ? " is-down" : ""}`,
												"data-testid": `ware-${item.uid}`,
												disabled: broke || full,
												onClick: () => item.kind === "supply" ? buySupply(item.uid) : buyRelic(item.uid),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StandArt, {
													src: item.kind === "relic" ? `/relics/${item.defId}.png` : `/supplies/${item.defId}.png`,
													mark: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameIcon, { name: item.kind === "relic" ? "gem" : "pack" })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "stand-plate is-wares",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
															className: "role",
															children: [item.price, " gold"]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "chip-name",
															children: name
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "hint",
															children: broke ? "Not enough gold" : full ? "Pouch full" : text
														})
													]
												})]
											}, item.uid);
										})
									})]
								}, kind);
							})
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `hero-line${run.enemies.length > 0 || run.phase === "treasure" || run.phase === "shop" || run.phase === "equip" && run.pendingRelic ? " is-below" : ""}`,
							"aria-label": "Party",
							children: [run.party.map((hero) => {
								const targetable = Boolean(pick && (pick.need === "any-hero" || pick.need === "ally" && !hero.down));
								const hit = floats(`hero:${hero.id}`).some((f) => f.kind === "dmg");
								const acting = run.phase === "battle" && actorHero?.id === hero.id;
								const className = `stand class-${hero.classId}${hero.down ? " is-down" : ""}${acting ? " is-actor" : ""}${targetable ? " is-target" : ""}${hit ? " is-hit" : ""}`;
								const slots = run.phase === "equip" ? slotsFor(run, hero) : null;
								const pending = run.pendingRelic ? RELICS[run.pendingRelic] : void 0;
								const wrongClass = Boolean(pending?.classes?.length && !pending.classes.includes(hero.classId));
								const body = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Floaters, { items: floats(`hero:${hero.id}`) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StandArt, {
										src: `/figures/hero-${hero.classId}.png`,
										mark: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClassMark, { classId: hero.classId })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "stand-plate",
										children: [
											acting ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "turn-flag",
												children: "Your turn"
											}) : null,
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: `chip-name${acting ? " is-turn" : ""}`,
												children: [hero.name, hero.down ? " · Down" : ""]
											}),
											acting ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "hint",
												children: [
													hero.hp,
													"/",
													hero.maxHp,
													hero.maxMana > 0 ? ` · Mana ${hero.mana}/${hero.maxMana}` : "",
													run.playsLeft > 1 ? " · plays twice" : ""
												]
											}) : null,
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VitalBar, {
												hp: hero.hp,
												maxHp: hero.maxHp,
												poison: hero.poison,
												shield: hero.block
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ManaBar, {
												mana: hero.mana,
												max: hero.maxMana
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "hint",
												children: [
													"ATK ",
													hero.atk + hero.atkBuff,
													" · DEF ",
													hero.def + hero.defBuff,
													hero.block > 0 ? ` · Block ${hero.block}` : "",
													hero.poison > 0 ? ` · Poison ${hero.poison}` : "",
													storeCapOf(hero) > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: hero.stored >= storeCapOf(hero) ? "grudge-full" : "",
														children: ` · Stored ${hero.stored}/${storeCapOf(hero)}`
													}) : null,
													!acting && hero.maxMana > 0 ? ` · Mana ${hero.mana}/${hero.maxMana}` : ""
												]
											}),
											run.phase === "prep" && !hero.down && !targetable ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												className: "btn btn-tiny btn-ghost",
												disabled: hero.braced,
												onClick: () => brace(hero.id),
												children: hero.braced ? "Braced" : `Brace +${hero.def + hero.defBuff}`
											}) : null,
											slots && !replacing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												className: "btn btn-tiny btn-gold",
												disabled: wrongClass,
												onClick: () => {
													if (wrongClass) return;
													if (slots.free > 0) equipRelic(hero.id, null);
													else setReplacing(hero.id);
												},
												children: wrongClass ? "Not their art" : slots.free > 0 ? "Wear" : "Full"
											}) : null
										]
									})
								] });
								if (targetable) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className,
									onClick: () => clickHero(hero),
									children: body
								}, hero.id);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className,
									children: body
								}, hero.id);
							}), (run.minions ?? []).filter((minion) => minion.hp > 0).map((minion) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "stand is-minion",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Floaters, { items: floats(`minion:${minion.uid}`) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StandArt, {
										src: "/figures/minion-thrall.png",
										mark: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameIcon, { name: "skull" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "stand-plate",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "chip-name",
												children: minion.name
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VitalBar, {
												hp: minion.hp,
												maxHp: minion.maxHp,
												poison: 0,
												shield: 0
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "hint",
												children: ["ATK ", minion.atk]
											})
										]
									})
								]
							}, minion.uid))]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "action-bar card-dock",
				children: [
					run.phase !== "battle" && run.phase !== "enemy" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "hint",
						children: HINT[run.phase]
					}) : null,
					run.phase === "prep" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "h-scroll",
						children: [run.supplies.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "hint",
							children: "Pouch empty."
						}) : null, run.supplies.map((inst) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PowerCard, {
							cardId: inst.defId,
							atk: 0,
							atkBuff: 0,
							disabled: run.prepSupplyUsed,
							selected: pick?.source === "supply" && pick.id === inst.uid,
							onClick: () => {
								if (run.prepSupplyUsed) return;
								const need = cardNeeds(inst.defId);
								setPick({
									source: "supply",
									id: inst.uid,
									need
								});
							}
						}, inst.uid))]
					}), pick?.source === "supply" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PickBar, {
						label: pickLabel,
						need: pick.need,
						onPlay: () => commitPick(null),
						onCancel: () => setPick(null)
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "btn btn-gold",
						"data-testid": "begin-battle",
						onClick: beginBattle,
						children: "Begin the clash"
					})] }) : null,
					run.phase === "battle" && actorHero ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `turn-banner class-${actorHero.classId}`,
							"data-testid": "turn-banner",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "turn-seat",
									children: ["Player ", actorHero.seat + 1]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "turn-name",
									children: actorHero.name
								}),
								actorHero.maxMana > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "turn-note",
									children: [
										"Mana ",
										actorHero.mana,
										"/",
										actorHero.maxMana,
										actorHero.freeSpell ? " · next spell free" : ""
									]
								}) : null,
								storeCapOf(actorHero) > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: `turn-note${actorHero.stored >= storeCapOf(actorHero) ? " grudge-full" : ""}`,
									children: [
										"Stored ",
										actorHero.stored,
										"/",
										storeCapOf(actorHero)
									]
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "turn-note",
									children: run.playsLeft > 1 ? "plays twice" : "your cards"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-scroll deal",
							children: run.hand.map((card, i) => {
								const def = CARDS[card.cardId];
								const cost = def?.mana ?? 0;
								const rite = def?.effects.some((e) => e.op === "free-spell") ?? false;
								const free = actorHero.freeSpell && cost > 0;
								const spent = rite && actorHero.freeSpellUsed;
								const held = rite && actorHero.freeSpell && !actorHero.freeSpellUsed;
								const grudge = def?.effects.some((e) => e.op === "grudge") ?? false;
								const cap = grudge ? storeCapOf(actorHero) : 0;
								const grudgeReady = grudge && cap > 0 && actorHero.stored >= cap;
								const grudgeWait = grudge && !grudgeReady;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PowerCard, {
									cardId: card.cardId,
									atk: actorHero.atk,
									atkBuff: actorHero.atkBuff,
									dry: cost > 0 && !free && cost > actorHero.mana || spent || held || grudgeWait,
									free,
									spent,
									held,
									badge: grudge ? grudgeReady ? "ready" : `${actorHero.stored}/${cap || 12}` : void 0,
									badgeHot: grudgeReady,
									accent: actorHero.classId,
									testId: `hand-${i}`,
									selected: pick?.source === "card" && pick.id === card.uid,
									onClick: () => setPick({
										source: "card",
										id: card.uid,
										need: cardNeeds(card.cardId)
									})
								}, card.uid);
							})
						}),
						pick?.source === "card" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PickBar, {
							label: pickLabel,
							need: pick.need,
							onPlay: () => commitPick(null),
							onCancel: () => setPick(null)
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "hint",
							children: "Tap a card, then confirm. Or end the turn."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "btn btn-ghost",
							"data-testid": "end-turn",
							onClick: () => {
								setPick(null);
								endTurn();
							},
							children: "End turn"
						})
					] }) : null,
					run.phase === "treasure" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "btn btn-ghost",
						onClick: () => chooseRelic("none"),
						children: "Leave the relics"
					}) : null,
					run.phase === "equip" && run.pendingRelic ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: replacing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "inline-actions",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "hint",
								children: [
									"Replace one of ",
									run.party.find((h) => h.id === replacing)?.name,
									"'s delve relics."
								]
							}),
							(run.equipped[replacing] ?? []).map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "btn btn-tiny btn-ghost",
								onClick: () => equipRelic(replacing, id),
								children: ["Replace ", RELICS[id]?.name]
							}, id)),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "btn btn-tiny btn-ghost",
								onClick: () => setReplacing(null),
								children: "Back"
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "hint",
						children: "Tap Wear on whoever should carry it."
					}) }) : null,
					run.phase === "supply" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-scroll",
						children: run.supplies.map((inst) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "playing-card",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "card-kicker",
									children: "Supply"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "card-name font-display",
									children: SUPPLIES[inst.defId]?.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "card-text",
									children: SUPPLIES[inst.defId]?.text
								}),
								run.supplies.length > 5 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "btn btn-tiny btn-ghost",
									onClick: () => discardSupply(inst.uid),
									children: "Leave behind"
								}) : null
							]
						}, inst.uid))
					}) : null,
					run.phase === "enemy" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "btn btn-ghost",
						onClick: step,
						children: "Hasten the strikes"
					}) : null,
					run.phase === "curse" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "btn btn-gold",
						onClick: acknowledgeCurse,
						children: "Search the wreckage"
					}) : null,
					run.phase === "supply" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "btn btn-gold",
						disabled: run.supplies.length > 5,
						onClick: packSupplies,
						children: run.supplies.length > 5 ? `Leave ${run.supplies.length - 5} more` : "Pack up"
					}) : null,
					run.phase === "shop" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "btn btn-gold",
						"data-testid": "leave-shop",
						onClick: leaveShop,
						children: [
							"Leave the stall · ",
							run.gold,
							" gold"
						]
					}) : null,
					run.phase === "onward" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "btn btn-gold",
						onClick: goDeeper,
						children: run.clearedNote || "Deeper"
					}) : null
				]
			}),
			abandonAsk ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overlay",
				role: "presentation",
				onClick: () => askAbandon(false),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "sheet",
					role: "dialog",
					"aria-modal": "true",
					"aria-labelledby": "flee-title",
					onClick: (e) => e.stopPropagation(),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							id: "flee-title",
							children: "Flee the delve?"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Experience already earned stays with the guild. Relics from this delve do not." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "inline-actions",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "btn btn-blood",
								onClick: abandon,
								children: "Flee"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "btn btn-ghost",
								onClick: () => askAbandon(false),
								children: "Stay"
							})]
						})
					]
				})
			}) : null,
			gear ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GearBook, { onClose: () => setGear(false) }) : null,
			codex ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemCodex, { onClose: () => setCodex(false) }) : null
		]
	});
}
function DoorArt({ kind }) {
	const [failed, setFailed] = (0, import_react.useState)(false);
	if (failed) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		className: "door-art",
		src: `/doors/door-${kind}.jpg`,
		alt: "",
		draggable: false,
		onError: () => setFailed(true)
	});
}
function VitalBar({ hp, maxHp, poison, bleed = 0, shield, foe }) {
	const life = Math.max(0, hp);
	const guard = Math.max(0, shield);
	const scale = Math.max(1, maxHp, life + guard);
	const bleedAmt = Math.min(life, Math.max(0, bleed));
	const poisonAmt = Math.min(Math.max(0, life - bleedAmt), Math.max(0, poison));
	const safePct = (life - bleedAmt - poisonAmt) / scale * 100;
	const poisonPct = poisonAmt / scale * 100;
	const bleedPct = bleedAmt / scale * 100;
	const lifePct = life / scale * 100;
	const shieldPct = guard / scale * 100;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `hp${foe ? " hp-foe" : ""}`,
		"aria-hidden": true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "hp-life",
				style: { width: `${safePct}%` }
			}),
			poisonAmt > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "hp-poison",
				style: {
					width: `${poisonPct}%`,
					left: `${safePct}%`
				}
			}) : null,
			bleedAmt > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "hp-bleed",
				style: {
					width: `${bleedPct}%`,
					left: `${safePct + poisonPct}%`
				}
			}) : null,
			guard > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "hp-shield",
				style: {
					width: `${shieldPct}%`,
					left: `${lifePct}%`
				}
			}) : null
		]
	});
}
function ManaBar({ mana, max }) {
	if (max <= 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mana",
		"aria-label": `Mana ${mana} of ${max}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { width: `${Math.max(0, Math.min(100, mana / max * 100))}%` } })
	});
}
function PhaseFlash({ form }) {
	if (form <= 1) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "phase-flash",
		"aria-hidden": true
	}, form);
}
function StandArt({ src, mark }) {
	const [failed, setFailed] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setFailed(false), [src]);
	if (failed) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "stand-fallback",
		children: mark
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src,
		alt: "",
		draggable: false,
		onError: () => setFailed(true)
	});
}
function PickBar({ label, need, onPlay, onCancel }) {
	const prompt = need === "enemy" ? `Choose a foe for ${label}` : need === "none" ? `Play ${label}` : `Choose a hero for ${label}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "inline-actions",
		children: [need === "none" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "btn btn-gold",
			onClick: onPlay,
			children: prompt
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "hint",
			children: prompt
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "btn btn-ghost",
			onClick: onCancel,
			children: "Cancel"
		})]
	});
}
function Results() {
	const results = useGame((s) => s.results);
	const pickKeepsake = useGame((s) => s.pickKeepsake);
	const returnToCamp = useGame((s) => s.returnToCamp);
	if (!results) return null;
	const anyRelic = results.rows.some((r) => r.relics.length > 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "screen",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "scroll-body",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "mast",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "kicker",
							children: results.victory ? "The gate is quiet" : "The hall keeps you"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: results.victory ? "Victory" : "Defeated" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "lede",
							children: results.victory ? "The Hollow King is dust. Levels stay with the guild. Bind one relic as a keepsake, or leave them all." : "The delve ends. Experience already earned stays. The relics do not."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "section",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "roster",
						children: results.rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: `hero-plate class-${row.classId}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "plate-top",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "role",
									children: CLASSES[row.classId]?.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "name font-display",
									children: row.name
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClassMark, { classId: row.classId })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "stats-row",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "stat",
									children: [
										"+",
										row.xp,
										" xp"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "stat",
									children: [
										"Lv ",
										row.from,
										row.to !== row.from ? ` → ${row.to}` : ""
									]
								})]
							})]
						}, row.id))
					})
				}),
				results.unlocked.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "section",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "New at the guild" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: results.unlocked.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "hint",
						children: [
							CLASSES[id]?.heroName,
							" — ",
							CLASSES[id]?.name
						]
					}, id)) })]
				}) : null,
				results.victory && anyRelic ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "section",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Bind a keepsake" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "hint",
							children: "One relic, on the hero who carried it. This replaces their previous keepsake."
						}),
						results.rows.map((row) => row.relics.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "role",
							children: row.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-scroll",
							children: row.relics.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RelicCard, {
								relicId: id,
								selected: results.choice?.heroId === row.id && results.choice.relicId === id,
								onClick: () => pickKeepsake(row.id, id)
							}, id))
						})] }, row.id) : null),
						results.choice ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "lock-line",
							children: [
								results.rows.find((r) => r.id === results.choice?.heroId)?.name,
								" will keep",
								" ",
								RELICS[results.choice.relicId]?.name,
								"."
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "hint",
							children: "Nothing selected — you can leave empty-handed."
						})
					]
				}) : null
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
			className: "action-bar",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "btn btn-gold",
				onClick: returnToCamp,
				children: "Return to the hall"
			})
		})]
	});
}
function Game() {
	const hydrated = useGame((s) => s.hydrated);
	const hydrate = useGame((s) => s.hydrate);
	const run = useGame((s) => s.run);
	const results = useGame((s) => s.results);
	const rules = useGame((s) => s.rules);
	const sheet = useGame((s) => s.sheet);
	const banner = useGame((s) => s.banner);
	const dismissBanner = useGame((s) => s.dismissBanner);
	const floaters = useGame((s) => s.floaters);
	(0, import_react.useEffect)(() => {
		hydrate();
	}, [hydrate]);
	(0, import_react.useEffect)(() => {
		const unlock = () => resumeAudio();
		window.addEventListener("pointerdown", unlock, { once: false });
		return () => window.removeEventListener("pointerdown", unlock);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!banner) return;
		const t = window.setTimeout(() => dismissBanner(), 2600);
		return () => window.clearTimeout(t);
	}, [banner, dismissBanner]);
	(0, import_react.useEffect)(() => {
		const first = floaters[0];
		if (!first) return;
		const t = window.setTimeout(() => {
			useGame.setState((s) => ({ floaters: s.floaters.filter((f) => f.id !== first.id) }));
		}, 880);
		return () => window.clearTimeout(t);
	}, [floaters]);
	if (!hydrated) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "screen",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mast",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "kicker",
					children: "Guild hall"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "Adventure Cards" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "lede",
					children: "Shuffling the decks…"
				})
			]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
		banner ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "banner",
			onClick: dismissBanner,
			children: banner.text
		}) : null,
		results ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Results, {}) : run ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Delve, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camp, {}),
		rules ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rules, {}) : null,
		sheet ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeroSheet, {}) : null
	] });
}
var SplitComponent = Game;
//#endregion
export { SplitComponent as component };

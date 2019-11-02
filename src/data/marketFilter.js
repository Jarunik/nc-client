const filter = [
  {
    category: "item",
    subcategory: "blueprint",
    name: "Corvette Petunia BP",
    type: "blueprint_01"
  },
  {
    category: "item",
    subcategory: "blueprint",
    name: "Frigate Redmill BP",
    type: "blueprint_02"
  },
  {
    category: "item",
    subcategory: "blueprint",
    name: "Destroyer Janus BP",
    type: "blueprint_03"
  },
  {
    category: "item",
    subcategory: "blueprint",
    name: "Cruiser Drake BP",
    type: "blueprint_04"
  },
  {
    category: "item",
    subcategory: "blueprint",
    name: "Battlecruiser Lion BP",
    type: "blueprint_05"
  },
  {
    category: "item",
    subcategory: "blueprint",
    name: "Carrier Unicorn BP",
    type: "blueprint_06"
  },
  {
    category: "item",
    subcategory: "blueprint",
    name: "Dreadnought Imperial BP",
    type: "blueprint_07"
  },
  {
    category: "item",
    subcategory: "blueprint",
    name: "Explorer II BP",
    type: "blueprint_08"
  },
  {
    category: "item",
    subcategory: "blueprint",
    name: "Transporter II BP",
    type: "blueprint_09"
  },
  {
    category: "item",
    subcategory: "blueprint",
    name: "Transporter III BP",
    type: "blueprint_10"
  },
  {
    category: "item",
    subcategory: "blueprint",
    name: "Scout Athene BP",
    type: "blueprint_11"
  },
  {
    category: "item",
    subcategory: "blueprint",
    name: "Patrol Hermes BP",
    type: "blueprint_12"
  },
  {
    category: "item",
    subcategory: "blueprint",
    name: "Cutter Canard BP",
    type: "blueprint_13"
  },
  {
    category: "item",
    subcategory: "blueprint",
    name: "Yamato BP",
    type: "blueprint_14"
  },
  {
    category: "item",
    subcategory: "blueprint",
    name: "Scout Minerva BP",
    type: "blueprint_15"
  },
  {
    category: "item",
    subcategory: "blueprint",
    name: "Patrol Cruqal BP",
    type: "blueprint_16"
  },
  {
    category: "item",
    subcategory: "blueprint",
    name: "Cutter Orchis BP",
    type: "blueprint_17"
  },
  {
    category: "item",
    subcategory: "blueprint",
    name: "Corvette Najtar BP",
    type: "blueprint_18"
  },
  {
    category: "item",
    subcategory: "blueprint",
    name: "Frigate Droeel BP",
    type: "blueprint_19"
  },
  {
    category: "item",
    subcategory: "blueprint",
    name: "Destroyer Halgoin BP",
    type: "blueprint_20"
  },
  {
    category: "item",
    subcategory: "blueprint",
    name: "Cruiser Eceza BP",
    type: "blueprint_21"
  },
  {
    category: "item",
    subcategory: "blueprint",
    name: "Battlecruiser Dejah BP",
    type: "blueprint_22"
  },
  {
    category: "item",
    subcategory: "blueprint",
    name: "Carrier Bhun'il BP",
    type: "blueprint_23"
  },
  {
    category: "item",
    subcategory: "blueprint",
    name: "Dreadnought Zaneel BP",
    type: "blueprint_24"
  },
  {
    category: "item",
    subcategory: "booster",
    name: "Rune",
    type: "booster_01"
  },
  {
    category: "item",
    subcategory: "booster",
    name: "Mighty Rune",
    type: "booster_02"
  },
  {
    category: "item",
    subcategory: "booster",
    name: "Holy Rune",
    type: "booster_03"
  },
  { category: "item", subcategory: "chest", name: "Chest", type: "chest_01" },
  {
    category: "item",
    subcategory: "chest",
    name: "Huge Chest",
    type: "chest_02"
  },
  {
    category: "item",
    subcategory: "chest",
    name: "Imperium Chest",
    type: "chest_03"
  },
  {
    category: "ship",
    subcategory: "battlecruiser",
    type: "battlecruiser",
    name: "Battlecruiser Tiger"
  },
  {
    category: "ship",
    subcategory: "battlecruiser",
    type: "battlecruiser1",
    name: "Battlecruiser Lion"
  },
  {
    category: "ship",
    subcategory: "battlecruiser",
    type: "battlecruiser2",
    name: "Battlecruiser Dejah"
  },
  {
    category: "ship",
    subcategory: "carrier",
    type: "carrier",
    name: "Carrier Argus"
  },
  {
    category: "ship",
    subcategory: "carrier",
    type: "carrier1",
    name: "Carrier Unicorn"
  },
  {
    category: "ship",
    subcategory: "carrier",
    type: "carrier2",
    name: "Carrier Bhun'il"
  },
  {
    category: "ship",
    subcategory: "corvette",
    type: "corvette",
    name: "Corvette Crocus"
  },
  {
    category: "ship",
    subcategory: "corvette",
    type: "corvette1",
    name: "Corvette Petunia"
  },
  {
    category: "ship",
    subcategory: "corvette",
    type: "corvette2",
    name: "Corvette Najtar"
  },
  {
    category: "ship",
    subcategory: "cruiser",
    type: "cruiser",
    name: "Cruiser Kent"
  },
  {
    category: "ship",
    subcategory: "cruiser",
    type: "cruiser1",
    name: "Cruiser Drake"
  },
  {
    category: "ship",
    subcategory: "cruiser",
    type: "cruiser2",
    name: "Cruiser Eceza"
  },
  {
    category: "ship",
    subcategory: "cutter",
    type: "cutter",
    name: "Cutter Arrow"
  },
  {
    category: "ship",
    subcategory: "cutter",
    type: "cutter1",
    name: "Cutter Canard"
  },
  {
    category: "ship",
    subcategory: "cutter",
    type: "cutter2",
    name: "Cutter Orchis"
  },
  {
    category: "ship",
    subcategory: "destroyer",
    type: "destroyer",
    name: "Destroyer Rocket"
  },
  {
    category: "ship",
    subcategory: "destroyer",
    type: "destroyer1",
    name: "Destroyer Janus"
  },
  {
    category: "ship",
    subcategory: "destroyer",
    type: "destroyer2",
    name: "Destroyer Halgoin"
  },
  {
    category: "ship",
    subcategory: "dreadnought",
    type: "dreadnought",
    name: "Dreadnought Royal"
  },
  {
    category: "ship",
    subcategory: "dreadnought",
    type: "dreadnought1",
    name: "Dreadnought Imperial"
  },
  {
    category: "ship",
    subcategory: "dreadnought",
    type: "dreadnought2",
    name: "Dreadnought Zaneel"
  },
  {
    category: "ship",
    subcategory: "explorer",
    type: "explorership",
    name: "Explorer"
  },
  {
    category: "ship",
    subcategory: "explorer",
    type: "explorership1",
    name: "Explorer II"
  },
  {
    category: "ship",
    subcategory: "frigate",
    type: "frigate",
    name: "Frigate Quorn"
  },
  {
    category: "ship",
    subcategory: "frigate",
    type: "frigate1",
    name: "Frigate Redmill"
  },
  {
    category: "ship",
    subcategory: "frigate",
    type: "frigate2",
    name: "Frigate Droeel"
  },
  {
    category: "ship",
    subcategory: "patrol",
    type: "patrol",
    name: "Patrol Amaterasu"
  },
  {
    category: "ship",
    subcategory: "patrol",
    type: "patrol1",
    name: "Patrol Hermes"
  },
  {
    category: "ship",
    subcategory: "patrol",
    type: "patrol2",
    name: "Patrol Cruqal"
  },
  {
    category: "ship",
    subcategory: "scout",
    type: "scout",
    name: "Scout Sentry"
  },
  {
    category: "ship",
    subcategory: "scout",
    type: "scout1",
    name: "Scout Athene"
  },
  {
    category: "ship",
    subcategory: "scout",
    type: "scout2",
    name: "Scout Minerva"
  },
  {
    category: "ship",
    subcategory: "transporter",
    type: "transportship",
    name: "Transporter"
  },
  {
    category: "ship",
    subcategory: "transporter",
    type: "transportship1",
    name: "Transporter II"
  },
  {
    category: "ship",
    subcategory: "transporter",
    type: "transportship2",
    name: "Transporter III"
  },
  { category: "ship", subcategory: "yamato", type: "yamato", name: "Yamato" },
  { category: "ship", subcategory: "yamato", type: "yamato1", name: "Yamato1" },
  {
    category: "ship",
    subcategory: "yamato",
    type: "yamato10",
    name: "Yamato10"
  },
  {
    category: "ship",
    subcategory: "yamato",
    type: "yamato11",
    name: "Yamato11"
  },
  {
    category: "ship",
    subcategory: "yamato",
    type: "yamato12",
    name: "Yamato12"
  },
  {
    category: "ship",
    subcategory: "yamato",
    type: "yamato13",
    name: "Yamato13"
  },
  {
    category: "ship",
    subcategory: "yamato",
    type: "yamato14",
    name: "Yamato14"
  },
  {
    category: "ship",
    subcategory: "yamato",
    type: "yamato15",
    name: "Yamato15"
  },
  {
    category: "ship",
    subcategory: "yamato",
    type: "yamato16",
    name: "Yamato16"
  },
  {
    category: "ship",
    subcategory: "yamato",
    type: "yamato17",
    name: "Yamato17"
  },
  {
    category: "ship",
    subcategory: "yamato",
    type: "yamato18",
    name: "Yamato18"
  },
  {
    category: "ship",
    subcategory: "yamato",
    type: "yamato19",
    name: "Yamato19"
  },
  { category: "ship", subcategory: "yamato", type: "yamato2", name: "Yamato2" },
  {
    category: "ship",
    subcategory: "yamato",
    type: "yamato20",
    name: "Yamato20"
  },
  { category: "ship", subcategory: "yamato", type: "yamato3", name: "Yamato3" },
  { category: "ship", subcategory: "yamato", type: "yamato4", name: "Yamato4" },
  { category: "ship", subcategory: "yamato", type: "yamato5", name: "Yamato5" },
  { category: "ship", subcategory: "yamato", type: "yamato6", name: "Yamato6" },
  { category: "ship", subcategory: "yamato", type: "yamato7", name: "Yamato7" },
  { category: "ship", subcategory: "yamato", type: "yamato8", name: "Yamato8" },
  { category: "ship", subcategory: "yamato", type: "yamato9", name: "Yamato9" },
  {
    category: "planet",
    subcategory: "all",
    type: "1",
    name: "Atmosphere"
  },
  {
    category: "planet",
    subcategory: "all",
    type: "2",
    name: "Coal"
  },
  {
    category: "planet",
    subcategory: "all",
    type: "2",
    name: "Ore"
  },
  {
    category: "planet",
    subcategory: "all",
    type: "4",
    name: "Copper"
  },
  {
    category: "planet",
    subcategory: "all",
    type: "5",
    name: "Uranium"
  }
];

export default filter;

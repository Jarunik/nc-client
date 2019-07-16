const attackerShips = [
  {
    id: "corvette",
    name: "Corvette Crocus",
    class: "Corvette",
    structure: 6,
    armor: 8,
    shield: 10,
    rocket: 2,
    bullet: 0,
    laser: 0
  },
  {
    id: "frigate",
    name: "Frigate Quorn",
    class: "Frigate",
    structure: 12,
    armor: 16,
    shield: 8,
    rocket: 3,
    bullet: 0,
    laser: 0
  },
  {
    id: "destroyer",
    name: "Destroyer Rocket",
    class: "Destroyer",
    structure: 12,
    armor: 14,
    shield: 16,
    rocket: 4,
    bullet: 0,
    laser: 0
  },
  {
    id: "cruiser",
    name: "Cruiser Kent",
    class: "Cruiser",
    structure: 15,
    armor: 25,
    shield: 20,
    rocket: 5,
    bullet: 0,
    laser: 0
  },
  {
    id: "battlecruiser",
    name: "Battlecruiser Tiger",
    class: "Battlecruiser",
    structure: 40,
    armor: 20,
    shield: 36,
    rocket: 8,
    bullet: 0,
    laser: 0
  },
  {
    id: "carrier",
    name: "Carrier Argus",
    class: "Carrier",
    structure: 60,
    armor: 100,
    shield: 80,
    rocket: 20,
    bullet: 0,
    laser: 0
  },
  {
    id: "dreadnought",
    name: "Dreadnought Royal",
    class: "Dreadnought",
    structure: 200,
    armor: 240,
    shield: 160,
    rocket: 50,
    bullet: 0,
    laser: 0
  },
  {
    id: "tansporter",
    name: "Transporter",
    class: "Civil",
    structure: 80,
    armor: 20,
    shield: 20,
    rocket: 0,
    bullet: 0,
    laser: 0
  },
  // Bullet with Shield
  {
    id: "corvette1",
    name: "Corvette Petunia",
    class: "Corvette",
    structure: 6,
    armor: 8,
    shield: 10,
    rocket: 0,
    bullet: 2,
    laser: 0
  },
  {
    id: "frigate1",
    name: "Frigate Redmill",
    class: "Frigate",
    structure: 12,
    armor: 16,
    shield: 8,
    rocket: 0,
    bullet: 3,
    laser: 0
  },
  {
    id: "destroyer1",
    name: "Destroyer Janus",
    class: "Destroyer",
    structure: 12,
    armor: 14,
    shield: 16,
    rocket: 0,
    bullet: 4,
    laser: 0
  },
  {
    id: "cruiser1",
    name: "Cruiser Drake",
    class: "Cruiser",
    structure: 15,
    armor: 25,
    shield: 20,
    rocket: 0,
    bullet: 5,
    laser: 0
  },
  {
    id: "battlecruiser1",
    name: "Battlecruiser Lion",
    class: "Battlecruiser",
    structure: 40,
    armor: 20,
    shield: 36,
    rocket: 0,
    bullet: 8,
    laser: 0
  },
  {
    id: "carrier1",
    name: "Carrier Unicorn",
    class: "Carrier",
    structure: 60,
    armor: 100,
    shield: 80,
    rocket: 0,
    bullet: 20,
    laser: 0
  },
  {
    id: "dreadnought1",
    name: "Dreadnought Imperial",
    class: "Dreadnought",
    structure: 200,
    armor: 240,
    shield: 160,
    rocket: 0,
    bullet: 50,
    laser: 0
  },
  // Laser with Armor
  {
    id: "corvette2",
    name: "Corvette Pimpernel",
    class: "Corvette",
    structure: 6,
    armor: 8,
    shield: 10,
    rocket: 0,
    bullet: 0,
    laser: 2
  },
  {
    id: "frigate2",
    name: "Frigate Lasalle",
    class: "Frigate",
    structure: 12,
    armor: 16,
    shield: 8,
    rocket: 0,
    bullet: 0,
    laser: 3
  },
  {
    id: "destroyer2",
    name: "Destroyer Banshee",
    class: "Destroyer",
    structure: 12,
    armor: 14,
    shield: 16,
    rocket: 0,
    bullet: 0,
    laser: 4
  },
  {
    id: "cruiser2",
    name: "Cruiser Hogue",
    class: "Cruiser",
    structure: 15,
    armor: 25,
    shield: 20,
    rocket: 0,
    bullet: 0,
    laser: 5
  },
  {
    id: "battlecruiser2",
    name: "Battlecruiser Leopard",
    class: "Battlecruiser",
    structure: 40,
    armor: 20,
    shield: 36,
    rocket: 0,
    bullet: 0,
    laser: 8
  },
  {
    id: "carrier2",
    name: "Carrier Centaur",
    class: "Carrier",
    structure: 60,
    armor: 100,
    shield: 80,
    rocket: 0,
    bullet: 0,
    laser: 20
  },
  {
    id: "dreadnought2",
    name: "Dreadnought Galactic",
    class: "Dreadnought",
    structure: 200,
    armor: 240,
    shield: 160,
    rocket: 0,
    bullet: 0,
    laser: 50
  },
  {
    id: "explorer",
    name: "Explorer",
    class: "Civil",
    structure: 80,
    armor: 20,
    shield: 20,
    rocket: 0,
    bullet: 0,
    laser: 0
  },
  {
    id: "explorer1",
    name: "Explorer II",
    class: "Civil",
    structure: 45,
    armor: 0,
    shield: 0,
    rocket: 0,
    bullet: 0,
    laser: 0
  },
  {
    id: "transporter1",
    name: "Transporter II",
    class: "Civil",
    structure: 25,
    armor: 0,
    shield: 0,
    rocket: 0,
    bullet: 0,
    laser: 0
  },
  {
    id: "transporter2",
    name: "Transporter III",
    class: "Civil",
    structure: 50,
    armor: 0,
    shield: 0,
    rocket: 0,
    bullet: 0,
    laser: 0
  },
  {
    id: "end",
    name: "end",
    class: "end",
    structure: 0,
    armor: 0,
    shield: 0,
    rocket: 0,
    bullet: 0,
    laser: 0,
    defense: 0
  }
];

export default attackerShips;

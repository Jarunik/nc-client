import { Client } from "steemconnect";

class SteemConnectService extends Client {
  constructor() {
    super({
      app: process.env.VUE_APP_STEEMCONNECT_APP,
      callbackURL: location.protocol + "//" + location.host,
      scope: ["custom_json"]
    });
  }

  appId() {
    var appId = process.env.VUE_APP_JSON_ID;
    return appId;
  }

  renamePlanet(user, planetId, newName, cb) {
    var scJson = {};
    var scCommand = {};
    scJson["username"] = user;
    scJson["type"] = "renameplanet";
    scCommand["tr_var1"] = planetId;
    scCommand["tr_var2"] = newName;
    scJson["command"] = scCommand;
    var finalJson = JSON.stringify(scJson);
    var appId = this.appId();

    super.customJson([], [user], [appId], finalJson, cb);
  }

  enhanceSkill(user, planetId, skillName, cb) {
    var scJson = {};
    var scCommand = {};
    // Create Command
    scJson["username"] = user;
    scJson["type"] = "enhance";
    scCommand["tr_var1"] = user;
    scCommand["tr_var2"] = planetId;
    scCommand["tr_var3"] = skillName;

    scJson["command"] = scCommand;
    var finalJson = JSON.stringify(scJson);
    var appId = this.appId();

    super.customJson([], [user], [appId], finalJson, cb);
  }

  upgradeBuilding(user, planetId, buildingName, cb) {
    var scJson = {};
    var scCommand = {};
    // Create Command
    scJson["username"] = user;
    scJson["type"] = "upgrade";
    scCommand["tr_var1"] = planetId;
    scCommand["tr_var2"] = buildingName;

    scJson["command"] = scCommand;
    var finalJson = JSON.stringify(scJson);
    var appId = this.appId();

    super.customJson([], [user], [appId], finalJson, cb);
  }

  buildShip(user, planetId, shipName, cb) {
    var scJson = {};
    var scCommand = {};
    // Create Command
    scJson["username"] = user;
    scJson["type"] = "buildship";
    scCommand["tr_var1"] = planetId;
    scCommand["tr_var2"] = shipName;

    scJson["command"] = scCommand;
    var finalJson = JSON.stringify(scJson);
    var appId = this.appId();

    super.customJson([], [user], [appId], finalJson, cb);
  }

  giftItem(user, itemId, recipient, cb) {
    var scJson = {};
    var scCommand = {};
    scJson["username"] = user;
    scJson["type"] = "giftitem";
    scCommand["tr_var1"] = itemId;
    scCommand["tr_var2"] = recipient;
    scJson["command"] = scCommand;
    var finalJson = JSON.stringify(scJson);
    var appId = this.appId();

    super.customJson([], [user], [appId], finalJson, cb);
  }

  activateItem(user, itemId, planetId, cb) {
    var scJson = {};
    var scCommand = {};
    scJson["username"] = user;
    scJson["type"] = "activate";
    scCommand["tr_var1"] = itemId;
    scCommand["tr_var2"] = planetId;
    scJson["command"] = scCommand;
    var finalJson = JSON.stringify(scJson);
    var appId = this.appId();

    super.customJson([], [user], [appId], finalJson, cb);
  }

  giftPlanet(user, planetId, recipient, cb) {
    var scJson = {};
    var scCommand = {};
    scJson["username"] = user;
    scJson["type"] = "giftplanet";
    scCommand["tr_var1"] = planetId;
    scCommand["tr_var2"] = recipient;
    scJson["command"] = scCommand;
    var finalJson = JSON.stringify(scJson);
    var appId = this.appId();

    super.customJson([], [user], [appId], finalJson, cb);
  }

  newUser(user, cb) {
    var scJson = {};
    var scCommand = {};
    scJson["username"] = user;
    scJson["type"] = "newuser";
    scCommand["tr_var1"] = user;
    scJson["command"] = scCommand;
    var finalJson = JSON.stringify(scJson);
    var appId = this.appId();

    super.customJson([], [user], [appId], finalJson, cb);
  }

  explorespace(user, originPlanetId, x, y, shipName, cb) {
    var scJson = {};
    var scCommand = {};
    scJson["username"] = user;
    scJson["type"] = "explorespace";
    scCommand["tr_var1"] = originPlanetId;
    scCommand["tr_var2"] = x;
    scCommand["tr_var3"] = y;
    scCommand["tr_var4"] = shipName;
    scJson["command"] = scCommand;
    var finalJson = JSON.stringify(scJson);
    var appId = this.appId();

    super.customJson([], [user], [appId], finalJson, cb);
  }

  transport(
    user,
    originPlanetId,
    x,
    y,
    numberOfTransporter,
    coal,
    ore,
    copper,
    uranium,
    cb
  ) {
    var scJson = {};
    var scCommand = {};
    scJson["username"] = user;
    scJson["type"] = "transport";
    scCommand["tr_var1"] = numberOfTransporter;
    scCommand["tr_var2"] = originPlanetId;
    scCommand["tr_var3"] = x;
    scCommand["tr_var4"] = y;
    scCommand["tr_var5"] = coal;
    scCommand["tr_var6"] = ore;
    scCommand["tr_var7"] = copper;
    scCommand["tr_var8"] = uranium;
    scJson["command"] = scCommand;
    var finalJson = JSON.stringify(scJson);
    var appId = this.appId();

    super.customJson([], [user], [appId], finalJson, cb);
  }

  // shipList = { "transportship": 2, "explorership": 1 }
  deploy(user, originPlanetId, x, y, shipList, coal, ore, copper, uranium, cb) {
    var scJson = {};
    var scCommand = {};
    scJson["username"] = user;
    scJson["type"] = "deploy";
    scCommand["tr_var1"] = shipList;
    scCommand["tr_var2"] = x;
    scCommand["tr_var3"] = y;
    scCommand["tr_var4"] = coal;
    scCommand["tr_var5"] = ore;
    scCommand["tr_var6"] = copper;
    scCommand["tr_var7"] = uranium;
    scCommand["tr_var8"] = originPlanetId;
    scJson["command"] = scCommand;
    var finalJson = JSON.stringify(scJson);
    var appId = this.appId();

    super.customJson([], [user], [appId], finalJson, cb);
  }

  // shipList = { "corvette": { "pos": 1, "n": 1 }, "frigate": { "pos": 2, "n": 1 }}
  attack(user, originPlanetId, x, y, shipList, cb) {
    var scJson = {};
    var scCommand = {};
    scJson["username"] = user;
    scJson["type"] = "attack";
    scCommand["tr_var1"] = shipList;
    scCommand["tr_var2"] = x;
    scCommand["tr_var3"] = y;
    scCommand["tr_var4"] = originPlanetId;
    scJson["command"] = scCommand;
    var finalJson = JSON.stringify(scJson);
    var appId = this.appId();

    super.customJson([], [user], [appId], finalJson, cb);
  }

  cancel(user, missionId, cb) {
    var scJson = {};
    var scCommand = {};
    scJson["username"] = user;
    scJson["type"] = "cancel";
    scCommand["tr_var1"] = missionId;
    scJson["command"] = scCommand;
    var finalJson = JSON.stringify(scJson);
    var appId = this.appId();

    super.customJson([], [user], [appId], finalJson, cb);
  }

  // shipList = {"corvette": { "pos": 1, "n": 2 }, "transportship": { "pos": 8, "n": 1 } }
  support(user, originPlanetId, x, y, shipList, cb) {
    var scJson = {};
    var scCommand = {};
    scJson["username"] = user;
    scJson["type"] = "support";
    scCommand["tr_var1"] = shipList;
    scCommand["tr_var2"] = x;
    scCommand["tr_var3"] = y;
    scCommand["tr_var4"] = originPlanetId;
    scJson["command"] = scCommand;
    var finalJson = JSON.stringify(scJson);
    var appId = this.appId();

    super.customJson([], [user], [appId], finalJson, cb);
  }

  enable(user, originPlanetId, buildingName, cb) {
    var scJson = {};
    var scCommand = {};
    scJson["username"] = user;
    scJson["type"] = "enable";
    scCommand["tr_var1"] = originPlanetId;
    scCommand["tr_var2"] = buildingName;
    scJson["command"] = scCommand;
    var finalJson = JSON.stringify(scJson);
    var appId = this.appId();

    super.customJson([], [user], [appId], finalJson, cb);
  }

  charge(user, originPlanetId, buildingName, cb) {
    var scJson = {};
    var scCommand = {};
    scJson["username"] = user;
    scJson["type"] = "charge";
    scCommand["tr_var1"] = originPlanetId;
    scCommand["tr_var2"] = buildingName;
    scJson["command"] = scCommand;
    var finalJson = JSON.stringify(scJson);
    var appId = this.appId();

    super.customJson([], [user], [appId], finalJson, cb);
  }

  // shipList = {"corvette": { "pos": 1, "n": 2 }, "transportship": { "pos": 8, "n": 1 } }
  siege(user, originPlanetId, x, y, shipList, cb) {
    var scJson = {};
    var scCommand = {};
    scJson["username"] = user;
    scJson["type"] = "siege";
    scCommand["tr_var1"] = shipList;
    scCommand["tr_var2"] = x;
    scCommand["tr_var3"] = y;
    scCommand["tr_var4"] = originPlanetId;
    scJson["command"] = scCommand;
    var finalJson = JSON.stringify(scJson);
    var appId = this.appId();

    super.customJson([], [user], [appId], finalJson, cb);
  }

  // shipList = { "corvette": { "pos": 1, "n": 1 }, "frigate": { "pos": 2, "n": 1 }}
  breaksiege(user, originPlanetId, x, y, shipList, cb) {
    var scJson = {};
    var scCommand = {};
    scJson["username"] = user;
    scJson["type"] = "breaksiege";
    scCommand["tr_var1"] = shipList;
    scCommand["tr_var2"] = x;
    scCommand["tr_var3"] = y;
    scCommand["tr_var4"] = originPlanetId;
    scJson["command"] = scCommand;
    var finalJson = JSON.stringify(scJson);
    var appId = this.appId();

    super.customJson([], [user], [appId], finalJson, cb);
  }
}

export default new SteemConnectService();

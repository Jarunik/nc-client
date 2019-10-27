import { Client } from "steemconnect";

class SteemConnectService extends Client {
  constructor() {
    super({
      app: process.env.VUE_APP_STEEMCONNECT_APP,
      callbackURL: location.protocol + "//" + location.host,
      scope: ["custom_json"]
    });
  }

  useSteemKeychain() {
    return Client.useSteemKeychain;
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

  // shipList = { "transportship": 2, "explorership": 1 }
  transport(
    user,
    originPlanetId,
    x,
    y,
    shipList,
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
    scCommand["tr_var1"] = shipList;
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

  transferStardust(user, amount, recipient, cb) {
    var scJson = {};
    var scCommand = {};
    scJson["username"] = user;
    scJson["type"] = "transferstardust";
    scCommand["tr_var1"] = amount;
    scCommand["tr_var2"] = recipient;
    scJson["command"] = scCommand;
    var finalJson = JSON.stringify(scJson);
    var appId = this.appId();

    super.customJson([], [user], [appId], finalJson, cb);
  }

  upgradeYamato(user, planetId, shipType, cb) {
    var scJson = {};
    var scCommand = {};
    scJson["username"] = user;
    scJson["type"] = "upgradeyamato";
    scCommand["tr_var1"] = planetId;
    scCommand["tr_var2"] = shipType;
    scJson["command"] = scCommand;
    var finalJson = JSON.stringify(scJson);
    var appId = this.appId();

    super.customJson([], [user], [appId], finalJson, cb);
  }

  respawnPlanet(user, planetId, cb) {
    var scJson = {};
    var scCommand = {};
    scJson["username"] = user;
    scJson["type"] = "respawn";
    scCommand["tr_var1"] = planetId;
    scJson["command"] = scCommand;
    var finalJson = JSON.stringify(scJson);
    var appId = this.appId();

    super.customJson([], [user], [appId], finalJson, cb);
  }

  burnPlanet(user, planetId, cb) {
    var scJson = {};
    var scCommand = {};
    scJson["username"] = user;
    scJson["type"] = "burn";
    scCommand["tr_var1"] = planetId;
    scJson["command"] = scCommand;
    var finalJson = JSON.stringify(scJson);
    var appId = this.appId();

    super.customJson([], [user], [appId], finalJson, cb);
  }

  updateShop(user, itemId, shopParameter, amount, cb) {
    var scJson = {};
    var scCommand = {};
    // Create Command
    scJson["username"] = user;
    scJson["type"] = "updateshop";
    scCommand["tr_var1"] = itemId;
    scCommand["tr_var2"] = shopParameter;
    scCommand["tr_var3"] = amount;

    scJson["command"] = scCommand;
    var finalJson = JSON.stringify(scJson);
    var appId = this.appId();

    super.customJson([], [user], [appId], finalJson, cb);
  }

  issue(user, itemId, amount, recipient, cb) {
    var scJson = {};
    var scCommand = {};
    // Create Command
    scJson["username"] = user;
    scJson["type"] = "issue";
    scCommand["tr_var1"] = itemId;
    scCommand["tr_var2"] = amount;
    scCommand["tr_var3"] = recipient;

    scJson["command"] = scCommand;
    var finalJson = JSON.stringify(scJson);
    var appId = this.appId();

    super.customJson([], [user], [appId], finalJson, cb);
  }

  issueStardust(user, amount, recipient, cb) {
    var scJson = {};
    var scCommand = {};
    // Create Command
    scJson["username"] = user;
    scJson["type"] = "issuestardust";
    scCommand["tr_var1"] = amount;
    scCommand["tr_var2"] = recipient;

    scJson["command"] = scCommand;
    var finalJson = JSON.stringify(scJson);
    var appId = this.appId();

    super.customJson([], [user], [appId], finalJson, cb);
  }

  newSeason(user, name, duration, reward, killRate, deployRate, cb) {
    var scJson = {};
    var scCommand = {};
    // Create Command
    scJson["username"] = user;
    scJson["type"] = "newseason";
    scCommand["tr_var1"] = name;
    scCommand["tr_var2"] = duration;
    scCommand["tr_var3"] = reward;
    scCommand["tr_var4"] = killRate;
    scCommand["tr_var5"] = deployRate;

    scJson["command"] = scCommand;
    var finalJson = JSON.stringify(scJson);
    var appId = this.appId();

    super.customJson([], [user], [appId], finalJson, cb);
  }

  ask(user, category, uid, price, market, cb) {
    var scJson = {};
    var scCommand = {};
    // Create Command
    scJson["username"] = user;
    scJson["type"] = "ask";
    scCommand["tr_var1"] = category;
    scCommand["tr_var2"] = uid;
    scCommand["tr_var3"] = price;
    scCommand["tr_var4"] = market;

    scJson["command"] = scCommand;
    var finalJson = JSON.stringify(scJson);
    var appId = this.appId();

    super.customJson([], [user], [appId], finalJson, cb);
  }

  cancel_ask(user, askId, cb) {
    var scJson = {};
    var scCommand = {};
    // Create Command
    scJson["username"] = user;
    scJson["type"] = "cancel_ask";
    scCommand["tr_var1"] = askId;

    scJson["command"] = scCommand;
    var finalJson = JSON.stringify(scJson);
    var appId = this.appId();

    super.customJson([], [user], [appId], finalJson, cb);
  }

  fill_ask(user, askId, cb) {
    var scJson = {};
    var scCommand = {};
    // Create Command
    scJson["username"] = user;
    scJson["type"] = "fill_ask";
    scCommand["tr_var1"] = askId;

    scJson["command"] = scCommand;
    var finalJson = JSON.stringify(scJson);
    var appId = this.appId();

    super.customJson([], [user], [appId], finalJson, cb);
  }
}

export default new SteemConnectService();

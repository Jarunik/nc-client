import { Client } from "steemconnect";

class SteemConnectService extends Client {
  constructor() {
    super({
      app: process.env.VUE_APP_STEEMCONNECT_APP,
      callbackURL: location.protocol + "//" + location.host,
      scope: ["login", "custom_json", "offline"]
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
}

export default new SteemConnectService();

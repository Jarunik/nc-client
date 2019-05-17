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
}

export default new SteemConnectService();

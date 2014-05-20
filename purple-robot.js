// Initialize the client with an options object made up of
//   serverUrl - the url to which commands are sent
function PurpleRobot(options) {
  options = options || {};

  this._serverUrl = options.serverUrl || "http://localhost:12345/json/submit";
  this._script = options.script || "";
}

// The version of the API, corresponding to the version of Purple Robot.
PurpleRobot.apiVersion = "1.5.2";

// Enables chaining of method calls.
PurpleRobot.prototype._apiMethod = function(nextScript) {
  return new PurpleRobot({
    serverUrl: this._serverUrl,
    script: [this._script, "PurpleRobot." + nextScript + ";"].join(" ").trim()
  });
}

// Returns the string representation of the method call.
PurpleRobot.prototype.toString = function() {
  return this._script;
};

// Returns the escaped string representation of the method call.
PurpleRobot.prototype.toJson = function() {
  return JSON.stringify(this.toString());
};

// Executes the current method (and any previously chained methods) by
// making an HTTP request to the Purple Robot HTTP server.
PurpleRobot.prototype.execute = function() {
  var httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = function() {
  };
  var isAsynchronous = true;
  httpRequest.open("POST", this._serverUrl, isAsynchronous);
  httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  var json = JSON.stringify({
    command: "execute_script",
    script: this.toString()
  });
  httpRequest.send("json=" + json);
};

// ##Purple Robot API

// Broadcasts an Android intent.
PurpleRobot.prototype.broadcastIntent = function(action, options) {
  return this._apiMethod("/* broadcastIntent NOT IMPLEMENTED YET */");
};

// Removes the tray notification from the task bar.
//
// Example
//
//     pr.cancelScriptNotification();
PurpleRobot.prototype.cancelScriptNotification = function() {
  return this._apiMethod("cancelScriptNotification()");
};

PurpleRobot.prototype.dateFromTimestamp = function(epoch) {
  return this._apiMethod("/* dateFromTimestamp NOT IMPLEMENTED YET */");
};

// Transmits a name value pair to be stored in Purple Robot Warehouse. The
// table name will be *name*, and the columns and data values will be
// extrapolated from the *value*.
//
// Example
//
//     pr.emitReading("sandwich", "pb&j").execute();
PurpleRobot.prototype.emitReading = function(name, value) {
  return this._apiMethod("emitReading('" + name + "', " + JSON.stringify(value) + ")");
};

// Displays a native toast message on the phone.
//
// Example
//
//     pr.emitToast("howdy", true);
PurpleRobot.prototype.emitToast = function(message, hasLongDuration) {
  hasLongDuration = (typeof hasLongDuration === "boolean") ? hasLongDuration : true;

  return this._apiMethod("emitToast('" + message + "', " + hasLongDuration + ")");
};

PurpleRobot.prototype.fetchConfig = function() {
  return this._apiMethod("fetchConfig()");
};

// Returns a value stored for the namespace and key provided. Generally
// paired with `persistEncryptedString`.
//
// Examples
//
//     pr.fetchEncryptedString("x", "my stuff");
//     pr.fetchEncryptedString("y");
PurpleRobot.prototype.fetchEncryptedString = function(key, namespace) {
  if (typeof namespace === "undefined") {
    return this._apiMethod("fetchEncryptedString('" + key + "')");
  } else {
    return this._apiMethod("fetchEncryptedString('" + namespace + "', '" + key + "')");
  }
};

PurpleRobot.prototype.fetchNamespace = function(namespace) {
};

PurpleRobot.prototype.fetchNamespaces = function() {
};

PurpleRobot.prototype.fetchSnapshot = function(timestamp) {
};

PurpleRobot.prototype.fetchSnapshotIds = function() {
};

PurpleRobot.prototype.fetchTrigger = function(id) {
};

PurpleRobot.prototype.fetchTriggerIds = function() {
};

PurpleRobot.prototype.fetchWidget = function(id) {
};

PurpleRobot.prototype.formatDate = function(date) {
};

// Launches the specified Android application as if the user had pressed
// the icon.
//
// Example
//
//     pr.launchApplication("edu.northwestern.cbits.awesome_app");
PurpleRobot.prototype.launchApplication = function(name) {
  return this._apiMethod("launchApplication('" + name + "')");
};

PurpleRobot.prototype.launchInternalUrl = function(url) {
};

PurpleRobot.prototype.launchUrl = function(url) {
};

PurpleRobot.prototype.loadLibrary = function(name) {
};

PurpleRobot.prototype.log = function(name, value) {
};

PurpleRobot.prototype.models = function() {
};

PurpleRobot.prototype.now = function() {
};

PurpleRobot.prototype.packageForApplicationName = function(applicationName) {
};

PurpleRobot.prototype.parseDate = function(dateString) {
};

// Stores the *value* within the *namespace*, identified by the *key*.
//
// Examples
//
//     pr.persistEncryptedString("foo", "bar", "app Q");
//     pr.persistEncryptedString("foo", "bar");
PurpleRobot.prototype.persistEncryptedString = function(key, value, namespace) {
  if (typeof namespace === "undefined") {
    return this._apiMethod("persistEncryptedString('" + key + "', '" + value + "')");
  } else {
    return this._apiMethod("persistEncryptedString('" + namespace + "', '" + key + "', '" + value + "')");
  }
};

// Plays a default Android notification sound.
//
// Example
//
//     pr.playDefaultTone();
PurpleRobot.prototype.playDefaultTone = function() {
  return this._apiMethod("playDefaultTone()");
};

PurpleRobot.prototype.playTone = function(tone) {
};

PurpleRobot.prototype.predictions = function() {
};

PurpleRobot.prototype.readings = function() {
};

PurpleRobot.prototype.readUrl = function(url) {
};

// Runs a script immediately.
//
// @param script a PurpleRobot instance
//
// Example
//
//     pr.runScript(pr.emitToast("toasty"));
PurpleRobot.prototype.runScript = function(script) {
  return this._apiMethod("runScript(" + script.toJson() + ")");
};

// Schedules a script to run a specified number of minutes in the future
// (calculated from when this script is evaluated).
//
// Example
//
//     pr.scheduleScript("fancy script", 5, pr.playDefaultTone());
PurpleRobot.prototype.scheduleScript = function(name, minutes, script) {
  var timestampStr = "(function() { var now = new Date(); var scheduled = new Date(now.getTime() + " + minutes + " * 60000); var pad = function(n) { return n < 10 ? '0' + n : n; }; return '' + scheduled.getFullYear() + pad(scheduled.getMonth() + 1) + pad(scheduled.getDate()) + 'T' + pad(scheduled.getHours()) + pad(scheduled.getMinutes()) + pad(scheduled.getSeconds()); })()";

  return this._apiMethod("scheduleScript('" + name + "', " + timestampStr + ", " + script.toJson() + ")");
};

PurpleRobot.prototype.showApplicationLaunchNotification = function(title, message, applicationName, displayWhen, isPersistent, launchParameters, script) {
};

// Opens an Android dialog with two buttons, *A* and *B*, and associates
// scripts to be run when each is pressed.
//
// Example
// 
//     pr.showNativeDialog({
//       title: "My Dialog",
//       message: "What say you?",
//       buttonLabelA: "cheers",
//       scriptA: pr.emitToast("cheers!"),
//       buttonLabelB: "boo",
//       scriptB: pr.emitToast("boo!")
//     });
PurpleRobot.prototype.showNativeDialog = function(options) {
  return this._apiMethod("showNativeDialog('" + options.title + "', '" +
    options.message + "', '" + options.buttonLabelA + "', '" +
    options.buttonLabelB + "', " + options.scriptA.toJson() +
    ", " + options.scriptB.toJson() + ")");
};

PurpleRobot.prototype.updateConfig = function(options) {
};

// Adds or updates a Purple Robot trigger to be run at a time and with a
// recurrence rule.
//
// Example
//
// The following would emit a toast daily at the same time:
//
//     pr.updateTrigger({
//       script: pr.emitToast("butter"),
//       startAt: "20140505T020304",
//       endAt: "20140505T020404"
//     });
PurpleRobot.prototype.updateTrigger = function(options) {
  options = options || {};

  var timestamp = (new Date()).getTime();
  var triggerId = options.triggerId || ("TRIGGER-" + timestamp);
  var triggerJson = JSON.stringify({
    type: options.type || "datetime",
    name: triggerId,
    identifier: triggerId,
    action: options.script.toString(),
    datetime_start: options.startAt,
    datetime_end: options.endAt,
    datetime_repeat: options.repeatRule || "FREQ=DAILY;INTERVAL=1"
  });

  return this._apiMethod("updateTrigger('" + triggerId + "', " + triggerJson + ")");
};

PurpleRobot.prototype.updateWidget = function(parameters) {
};

PurpleRobot.prototype.version = function() {
};

// Vibrates the phone with a preset pattern.
//
// Examples
//
//     pr.vibrate("buzz");
//     pr.vibrate("blip");
//     pr.vibrate("sos");
PurpleRobot.prototype.vibrate = function(pattern) {
  pattern = pattern || "buzz";

  return this._apiMethod("vibrate('" + pattern + "')");
};

PurpleRobot.prototype.widgets = function() {
};

// ##Further examples
//
// Example of nesting
//
//     var playTone = pr.playDefaultTone();
//     var toast = pr.emitToast("sorry");
//     var dialog1 = pr.showNativeDialog(
//       "dialog 1", "are you happy?", "Yes", "No", playTone, toast
//     );
//     pr.scheduleScript("dialog 1", 10, "minutes", dialog1)
//       .execute();
//
// Example of chaining
//
//     pr.playDefaultTone().emitToast("hey there").execute();

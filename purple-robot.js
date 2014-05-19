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
  return this._apiMethod("emitReading('" + name + "', '" + JSON.stringify(value) + "')");
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
// Example
//
//     pr.fetchEncryptedString("my stuff", "x");
PurpleRobot.prototype.fetchEncryptedString = function(namespace, key) {
  return this._apiMethod("fetchEncryptedString('" + namespace + "', '" + key + "')");
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
// Example
//
//     pr.persistEncryptedString("app Q", "foo", "bar");
PurpleRobot.prototype.persistEncryptedString = function(namespace, key, value) {
};

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

PurpleRobot.prototype.runScript = function(script) {
};

// Schedules a script to run a specified number of minutes in the future
// (calculated from when this script is evaluated).
//
// Example
//
//     pr.scheduleScript("fancy script", 5, pr.playDefaultTone());
PurpleRobot.prototype.scheduleScript = function(name, minutes, method) {
  return this._apiMethod("scheduleScript('" + name + "', '" + units + "', " + JSON.stringify(method.toString()) + ")");
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
    options.buttonLabelB + "', " + JSON.stringify(options.scriptA.toString()) +
    ", " + JSON.stringify(options.scriptB.toString()) + ")");
};

PurpleRobot.prototype.updateConfig = function(options) {
};

PurpleRobot.prototype.updateTrigger = function(triggerId, parameters) {
};

PurpleRobot.prototype.updateWidget = function(parameters) {
};

PurpleRobot.prototype.version = function() {
};

PurpleRobot.prototype.vibrate = function(pattern) {
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

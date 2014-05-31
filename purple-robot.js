// Initialize the client with an options object made up of
//   serverUrl - the url to which commands are sent
function PurpleRobot(options) {
  options = options || {};

  // __className__
  //
  // `@public`
  this.className = "PurpleRobot";

  // ___serverUrl__
  //
  // `@private`
  this._serverUrl = options.serverUrl || "http://localhost:12345/json/submit";
  // ___script__
  //
  // `@private`
  this._script = options.script || "";
}

// The version of the API, corresponding to the version of Purple Robot.
PurpleRobot.apiVersion = "1.5.2.5";

// ___apiMethod(nextScript)__
//
// `@returns {Object}` A new PurpleRobot instance.
//
// Enables chaining of method calls.
PurpleRobot.prototype._apiMethod = function(nextScript) {
  return new PurpleRobot({
    serverUrl: this._serverUrl,
    script: [this._script, "PurpleRobot." + nextScript + ";"].join(" ").trim()
  });
};

// ___stringify(value)__
//
// `@private`  
// `@param {any} value` The value to be stringified.  
// `@returns {string}` The stringified representation.
//
// Returns a string representation of the input. If the input is a
// `PurpleRobot` instance, a string expression is returned, otherwise a JSON
// stringified version is returned.
PurpleRobot.prototype._stringify = function(value) {
  var str;

  if (value !== null &&
      typeof value === "object" &&
      value.className === this.className) {
    str = value.toStringExpression();
  } else {
    str = JSON.stringify(value);
  }

  return str;
};

// __toString()__
//
// `@returns {string}` The current script as a string.
//
// Returns the string representation of the current script.
PurpleRobot.prototype.toString = function() {
  return this._script;
};

// __toStringExpression()__
//
// `@returns {string}` A string representation of a function that returns the
// value of this script when evaluated.
//
// Example
//
//     pr.emitToast("foo").toStringExpression();
//     // "(function() { return PurpleRobot.emitToast('foo'); })()"
PurpleRobot.prototype.toStringExpression = function () {
  return "(function() { return " + this._script + " })()";
};

// __toJson()__
//
// `@returns {string}` A JSON stringified version of this script.
//
// Returns the escaped string representation of the method call.
PurpleRobot.prototype.toJson = function() {
  return JSON.stringify(this.toString());
};

// __execute(callbacks)__
//
// Executes the current method (and any previously chained methods) by
// making an HTTP request to the Purple Robot HTTP server.
//
// Example
//
//     pr.fetchEncryptedString("foo").execute({
//       done: function(payload) {
//               console.log(payload);
//             }
//     })
PurpleRobot.prototype.execute = function(callbacks) {
  callbacks = callbacks || {};
  callbacks.done = callbacks.done || function() {};
  callbacks.fail = callbacks.fail || function() {};

  var httpRequest = new XMLHttpRequest();
  var isAsynchronous = true;
  var json = JSON.stringify({
    command: "execute_script",
    script: this.toString()
  });

  function onChange() {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.response === null) {
        callbacks.fail();
      } else {
        callbacks.done(JSON.parse(httpRequest.response).payload);
      }
    }
  }

  httpRequest.onreadystatechange = onChange;
  httpRequest.open("POST", this._serverUrl, isAsynchronous);
  httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  httpRequest.send("json=" + json);
};

// Saves a string representation of script(s) to localStorage.
//
// Example
// 
//     pr.emitReading("foo", "bar").save();
//
// `@returns {Object}` Returns the current object instance.
PurpleRobot.prototype.save = function() {
  localStorage.prQueue = localStorage.prQueue || "";
  localStorage.prQueue += this.toString();

  return this;
};

// Restores saved script(s) from localStorage.
//
// Example
//
//     pr.restore().execute();
//
// `@returns {Object}` Returns the current object instance.
PurpleRobot.prototype.restore = function() {
  localStorage.prQueue = localStorage.prQueue || "";
  this._script = localStorage.prQueue;

  return this;
};

// Deletes saved script(s) from localStorage.
//
// Example
//
//     pr.destroy();
//
// `@returns {Object}` Returns the current object instance.
PurpleRobot.prototype.destroy = function() {
  delete localStorage.prQueue;

  return this;
};

// Generates an equality expression between two values.
//
// Example
//
//     pr.isEqual(pr.fetchEncryptedString("a"), null);
//
// `@param {any} valA` The left hand value.
// `@param {any} valB` The right hand value.
// `@returns {Object}` Returns the current object instance.
PurpleRobot.prototype.isEqual = function(valA, valB) {
  var expr = this._stringify(valA) + " == " + this._stringify(valB);

  return new PurpleRobot({
    serverUrl: this._serverUrl,
    script: [this._script, expr].join(" ").trim()
  });
};

PurpleRobot.prototype.ifThenElse = function(condition, thenStmt, elseStmt) {
  var expr = "if (" + condition.toString() + ") { " +
    thenStmt.toString() +
    " } else { " +
    elseStmt.toString() +
    " }";

  return new PurpleRobot({
    serverUrl: this._serverUrl,
    script: [this._script, expr].join(" ").trim()
  });
};

// ##Purple Robot API

// Broadcasts an Android intent.
//
// `@returns {Object}` Returns a new object instance.
PurpleRobot.prototype.broadcastIntent = function(action, options) {
  return this._apiMethod("/* broadcastIntent NOT IMPLEMENTED YET */");
};

// Removes the tray notification from the task bar.
//
// Example
//
//     pr.cancelScriptNotification();
//
// `@returns {Object}` Returns a new object instance.
PurpleRobot.prototype.cancelScriptNotification = function() {
  return this._apiMethod("cancelScriptNotification()");
};

// Returns a Date object given an epoch timestamp.
//
// Example
//
//     pr.dateFromTimestamp(1401205124000);
//
// `@param {number} epoch` The Unix epoch timestamp including milliseconds.
// `@returns {Object}` Returns a new object instance.
PurpleRobot.prototype.dateFromTimestamp = function(epoch) {
  return this._apiMethod("dateFromTimestamp(" + epoch + ")");
};

// Disables the Purple Robot trigger identified by *id*;
//
// Example
//
//     pr.disableTrigger("MY-TRIGGER");
//
// `@param {string} id` The id of the trigger.
// `@returns {Object}` Returns a new object instance.
PurpleRobot.prototype.disableTrigger = function(id) {
  return this._apiMethod("disableTrigger('" + id + "')");
};

// Transmits a name value pair to be stored in Purple Robot Warehouse. The
// table name will be *name*, and the columns and data values will be
// extrapolated from the *value*.
//
// Example
//
//     pr.emitReading("sandwich", "pb&j");
//
// `@param {string} name` The name of the reading.
// `@param {any} value` The value of the reading.
// `@returns {Object}` Returns a new object instance.
PurpleRobot.prototype.emitReading = function(name, value) {
  return this._apiMethod("emitReading('" + name + "', " + JSON.stringify(value) + ")");
};

// Displays a native toast message on the phone.
//
// Example
//
//     pr.emitToast("howdy", true);
//
// `@param {string} message` The text of the toast.
// `@param {boolean} hasLongDuration` True if the toast should display longer.
// `@returns {Object}` Returns a new object instance.
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
//
// `@returns {Object}` Returns a new object instance.
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

// Returns the Purple Robot configured user id string.
//
// Example
//
//     pr.fetchUserId().execute().done(function(userId) {
//       console.log(userId);
//     });
//
// `@returns {Object}` Returns a new object instance.
PurpleRobot.prototype.fetchUserId = function() {
  return this._apiMethod("fetchUserId()");
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
//
// `@returns {Object}` Returns a new object instance.
PurpleRobot.prototype.launchApplication = function(name) {
  return this._apiMethod("launchApplication('" + name + "')");
};

PurpleRobot.prototype.launchInternalUrl = function(url) {
};

PurpleRobot.prototype.launchUrl = function(url) {
};

PurpleRobot.prototype.loadLibrary = function(name) {
};

// Logs an event to the PR event capturing service as well as the Android log.
//
// Example
//
//     pr.log("zing", { wing: "ding" });
//
// `@returns {Object}` Returns a new object instance.
PurpleRobot.prototype.log = function(name, value) {
  return this._apiMethod("log('" + name + "', " + JSON.stringify(value) + ")");
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
//
// `@returns {Object}` Returns a new object instance.
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
//
// `@returns {Object}` Returns a new object instance.
PurpleRobot.prototype.playDefaultTone = function() {
  return this._apiMethod("playDefaultTone()");
};

// Plays an existing notification sound on an Android phone.
//
// Example
//
//     pr.playTone("Hojus");
//
// `@returns {Object}` Returns a new object instance.
PurpleRobot.prototype.playTone = function(tone) {
  return this._apiMethod("playTone('" + tone + "')");
};

PurpleRobot.prototype.predictions = function() {
};

PurpleRobot.prototype.readings = function() {
};

// Attempts to GET a URL and return the body as a string.
//
// Example
//
//     pr.readUrl("http://www.northwestern.edu");
//
// `@returns {Object}` Returns a new object instance.
PurpleRobot.prototype.readUrl = function(url) {
  return this._apiMethod("readUrl('" + url + "')");
};

// Runs a script immediately.
//
// @param script a PurpleRobot instance
//
// Example
//
//     pr.runScript(pr.emitToast("toasty"));
//
// `@returns {Object}` Returns a new object instance.
PurpleRobot.prototype.runScript = function(script) {
  return this._apiMethod("runScript(" + script.toJson() + ")");
};

// Schedules a script to run a specified number of minutes in the future
// (calculated from when this script is evaluated).
//
// Example
//
//     pr.scheduleScript("fancy script", 5, pr.playDefaultTone());
//
// `@returns {Object}` Returns a new object instance.
PurpleRobot.prototype.scheduleScript = function(name, minutes, script) {
  var timestampStr = "(function() { var now = new Date(); var scheduled = new Date(now.getTime() + " + minutes + " * 60000); var pad = function(n) { return n < 10 ? '0' + n : n; }; return '' + scheduled.getFullYear() + pad(scheduled.getMonth() + 1) + pad(scheduled.getDate()) + 'T' + pad(scheduled.getHours()) + pad(scheduled.getMinutes()) + pad(scheduled.getSeconds()); })()";

  return this._apiMethod("scheduleScript('" + name + "', " + timestampStr + ", " + script.toJson() + ")");
};

// Sets the Purple Robot user id string.
//
// Example
//
//     pr.setUserId("Bobbie");
//
// `@returns {Object}` Returns a new object instance.
PurpleRobot.prototype.setUserId = function(value) {
  return this._apiMethod("setUserId('" + value + "')");
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
//
// `@returns {Object}` Returns a new object instance.
PurpleRobot.prototype.showNativeDialog = function(options) {
  return this._apiMethod("showNativeDialog('" + options.title + "', '" +
    options.message + "', '" + options.buttonLabelA + "', '" +
    options.buttonLabelB + "', " + options.scriptA.toJson() +
    ", " + options.scriptB.toJson() + ")");
};

// Adds a notification to the the tray and atttaches a script to be run when
// it is pressed.
//
// Example
//
//     pr.showScriptNotification({
//       title: "My app",
//       message: "Press here",
//       isPersistent: true,
//       isSticky: false,
//       script: pr.emitToast("You pressed it")
//     });
//
// `@returns {Object}` Returns a new object instance.
PurpleRobot.prototype.showScriptNotification = function(options) {
  options = options || {};

  return this._apiMethod("showScriptNotification('" + options.title + "', '" +
    options.message + "', " + options.isPersistent + ", " + options.isSticky +
    ", " + options.script.toJson() + ")");
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
//
// `@returns {Object}` Returns a new object instance.
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

// Returns the current version string for Purple Robot.
//
// Example
//
//     pr.version();
//
// `@returns {Object}` Returns a new object instance.
PurpleRobot.prototype.version = function() {
  return this._apiMethod("version()");
};

// Vibrates the phone with a preset pattern.
//
// Examples
//
//     pr.vibrate("buzz");
//     pr.vibrate("blip");
//     pr.vibrate("sos");
//
// `@returns {Object}` Returns a new object instance.
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

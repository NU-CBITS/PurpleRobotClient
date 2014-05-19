// Initialize the client with an options object made up of
//   serverUrl - the url to which commands are sent
function PurpleRobot(options) {
  options = options || {};

  var config = {
    serverUrl: options.serverUrl || "http://localhost:12345/json/submit"
  };

  // The version of the API, corresponding to the version of Purple Robot.
  this.apiVersion = "1.5.2";

  function ApiMethod(script) {
    script = script || "";

    // Enables chaining of method calls.
    function apiMethod(nextScript) {
      return new ApiMethod([script, "PurpleRobot." + nextScript + ";"].join(" ").trim());
    }

    // Returns the string representation of the method call.
    this.toString = function() {
      return script;
    };

    // Executes the current method (and any previously chained methods) by
    // making an HTTP request to the Purple Robot HTTP server.
    this.execute = function() {
      var httpRequest = new XMLHttpRequest();
      httpRequest.onreadystatechange = function() {
      };
      var isAsynchronous = true;
      httpRequest.open("POST", config.serverUrl, isAsynchronous);
      httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      var json = JSON.stringify({
        command: "execute_script",
        script: this.toString()
      });
      httpRequest.send("json=" + json);
    };

    // ##Purple Robot API

    // Broadcasts an Android intent.
    this.broadcastIntent = function(action, options) {
      return apiMethod("/* broadcastIntent NOT IMPLEMENTED YET */");
    };

    this.dateFromTimestamp = function(epoch) {
      return apiMethod("/* dateFromTimestamp NOT IMPLEMENTED YET */");
    };

    // Transmits a name value pair to be stored in Purple Robot Warehouse. The
    // table name will be *name*, and the columns and data values will be
    // extrapolated from the *value*.
    //
    // Example
    //
    //     pr.emitReading("sandwich", "pb&j").execute();
    this.emitReading = function(name, value) {
      return apiMethod("emitReading('" + name + "', '" + JSON.stringify(value) + "')");
    };

    // Displays a native toast message on the phone.
    //
    // Example
    //
    //     pr.emitToast("howdy", true);
    this.emitToast = function(message, hasLongDuration) {
      return apiMethod("emitToast('" + message + "', " + hasLongDuration + ")");
    };

    this.fetchConfig = function() {
      return apiMethod("fetchConfig()");
    };

    // Returns a value stored for the namespace and key provided. Generally
    // paired with `persistEncryptedString`.
    //
    // Example
    //
    //     pr.fetchEncryptedString("my stuff", "x");
    this.fetchEncryptedString = function(namespace, key) {
      return apiMethod("fetchEncryptedString('" + namespace + "', '" + key + "')");
    };

    this.fetchNamespace = function(namespace) {
    };

    this.fetchNamespaces = function() {
    };

    this.fetchSnapshot = function(timestamp) {
    };

    this.fetchSnapshotIds = function() {
    };

    this.fetchTrigger = function(id) {
    };

    this.fetchTriggerIds = function() {
    };

    this.fetchWidget = function(id) {
    };

    this.formatDate = function(date) {
    };

    // Launches the specified Android application as if the user had pressed
    // the icon.
    //
    // Example
    //
    //     pr.launchApplication("edu.northwestern.cbits.awesome_app");
    this.launchApplication = function(name) {
      return apiMethod("launchApplication('" + name + "')");
    };

    this.launchInternalUrl = function(url) {
    };

    this.launchUrl = function(url) {
    };

    this.loadLibrary = function(name) {
    };

    this.log = function(name, value) {
    };

    this.models = function() {
    };

    this.now = function() {
    };

    this.packageForApplicationName = function(applicationName) {
    };

    this.parseDate = function(dateString) {
    };

    // Stores the *value* within the *namespace*, identified by the *key*.
    //
    // Example
    //
    //     pr.persistEncryptedString("app Q", "foo", "bar");
    this.persistEncryptedString = function(namespace, key, value) {
    };

    this.playDefaultTone = function() {
      return apiMethod("playDefaultTone()");
    };

    this.playTone = function(tone) {
    };

    this.predictions = function() {
    };

    this.readings = function() {
    };

    this.readUrl = function(url) {
    };

    this.runScript = function(script) {
    };

    // Schedules a script to run a specified number of minutes in the future
    // (calculated from when this script is evaluated).
    //
    // Example
    //
    //     pr.scheduleScript("fancy script", 5, pr.playDefaultTone());
    this.scheduleScript = function(name, minutes, method) {
      return apiMethod("scheduleScript('" + name + "', '" + units + "', " + JSON.stringify(method.toString()) + ")");
    };

    this.showApplicationLaunchNotification = function(title, message, applicationName, displayWhen, isPersistent, launchParameters, script) {
    };

    this.showNativeDialog = function(name, text, confirm, cancel, confirmScript, cancelScript) {
    };

    this.updateConfig = function(options) {
    };

    this.updateTrigger = function(triggerId, parameters) {
    };

    this.updateWidget = function(parameters) {
    };

    this.version = function() {
    };

    this.vibrate = function(pattern) {
    };

    this.widgets = function() {
    };
  }

  var base = new ApiMethod();
  this.emitReading = base.emitReading;
  this.emitToast = base.emitToast;
  this.playDefaultTone = base.playDefaultTone;
  this.scheduleScript = base.scheduleScript;

  // ##Further examples
  //
  // Example of nesting
  //
  //     var playTone = pr.playDefaultTone();
  //     var toast = pr.emitToast("sorry");
  //     var dialog1 = pr.showNativeDialog(
  //       "dialog 1", "are you happy?", "Yes", "No", playTone, toast
  //     );
  //     pr.scheduleScript("dialog 1", 10, "minutes", dialog1).execute();
  //
  // Example of chaining
  //
  //     pr.playDefaultTone().emitToast("hey there").execute();
}

// ## Examples
//
// Basic
//
//     var pr = new PurpleRobot();
//     pr.playDefaultTone().execute();
//
// Nesting (API calls within calls)
//
//     var playTone = pr.playDefaultTone();
//     var toast = pr.emitToast("sorry");
//     var dialog1 = pr.showNativeDialog({
//       title: "My Dialog",
//       message: "What say you?",
//       buttonLabelA: "cheers",
//       scriptA: pr.emitToast("cheers!"),
//       buttonLabelB: "boo",
//       scriptB: pr.emitToast("boo!"),
//       tag: "my-dialog",
//       priority: 3
//     });
//     pr.scheduleScript("dialog 1", 10, "minutes", dialog1)
//       .execute();
//
// Chaining (sequential API calls)
//
//     pr.playDefaultTone().emitToast("hey there").execute();

// ## Implementation

;(function() {
  // __constructor__
  //
  // Initialize the client with an options object made up of
  // `serverUrl` - the url to which commands are sent
  function PR(options) {
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

  function PurpleRobotArgumentException(methodName, argument, expectedArgument) {
    this.methodName = methodName;
    this.argument = argument;
    this.expectedArgument = expectedArgument;
    this.message = ' received an unexpected argument "';

    this.toString = function() {
      return [
        "PurpleRobot.",
        this.methodName,
        this.message,
        this.argument,
        '" expected: ',
        this.expectedArgument
      ].join("");
    };
  }

  // __apiVersion__
  //
  // `@public`
  //
  // The version of the API, corresponding to the version of Purple Robot.
  PR.apiVersion = "1.6.8.0";

  // __setEnvironment()__
  //
  // `@public`  
  // `@param {string} ['production'|'debug'|'web']`
  //
  // Set the environment to one of:  
  // `production`: Make real calls to the Purple Robot HTTP server with minimal
  // logging.  
  // `debug': Make real calls to the Purple Robot HTTP server with extra
  // logging.  
  // `web`: Make fake calls to the Purple Robot HTTP server with extra logging.
  PR.setEnvironment = function(env) {
    if (env !== 'production' && env !== 'debug' && env !== 'web') {
      throw new PurpleRobotArgumentException('setEnvironment', env, '["production", "debug", "web"]');
    }

    this.env = env;

    return this;
  };

  // __toString()__
  //
  // `@returns {string}` The current script as a string.
  //
  // Returns the string representation of the current script.
  PR.prototype.toString = function() {
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
  PR.prototype.toStringExpression = function () {
    return "(function() { return " + this._script + " })()";
  };

  // __toJson()__
  //
  // `@returns {string}` A JSON stringified version of this script.
  //
  // Returns the escaped string representation of the method call.
  PR.prototype.toJson = function() {
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
  PR.prototype.execute = function(callbacks) {
    var json = JSON.stringify({
      command: "execute_script",
      script: this.toString()
    });

    function onChange() {
      if (callbacks && httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.response === null &&
            typeof callbacks.fail === "function") {
          callbacks.fail();
        } else if (callbacks.done) {
          callbacks.done(JSON.parse(httpRequest.response).payload);
        }
      }
    }

    if (PR.env !== 'web') {
      var httpRequest = new XMLHttpRequest();
      httpRequest.onreadystatechange = onChange;
      var isAsynchronous = true;
      httpRequest.open("POST", this._serverUrl, isAsynchronous);
      httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
      httpRequest.send("json=" + json);
    } else {
      console.log('PurpleRobot POSTing to "' + this._serverUrl + '": ' + json);
    }
  };

  // __save()__
  //
  // `@returns {Object}` Returns the current object instance.
  //
  // Saves a string representation of script(s) to localStorage.
  //
  // Example
  // 
  //     pr.emitReading("foo", "bar").save();
  PR.prototype.save = function() {
    localStorage.prQueue = localStorage.prQueue || "";
    localStorage.prQueue += this.toString();

    return this;
  };

  // __restore()__
  //
  // `@returns {Object}` Returns the current object instance.
  //
  // Restores saved script(s) from localStorage.
  //
  // Example
  //
  //     pr.restore().execute();
  PR.prototype.restore = function() {
    localStorage.prQueue = localStorage.prQueue || "";
    this._script = localStorage.prQueue;

    return this;
  };

  // __destroy()__
  //
  // `@returns {Object}` Returns the current object instance.
  //
  // Deletes saved script(s) from localStorage.
  //
  // Example
  //
  //     pr.destroy();
  PR.prototype.destroy = function() {
    delete localStorage.prQueue;

    return this;
  };

  // __isEqual(valA, valB)__
  //
  // `@param {*} valA` The left hand value.  
  // `@param {*} valB` The right hand value.  
  // `@returns {Object}` Returns the current object instance.
  //
  // Generates an equality expression between two values.
  //
  // Example
  //
  //     pr.isEqual(pr.fetchEncryptedString("a"), null);
  PR.prototype.isEqual = function(valA, valB) {
    var expr = this._stringify(valA) + " == " + this._stringify(valB);

    return new PR({
      serverUrl: this._serverUrl,
      script: [this._script, expr].join(" ").trim()
    });
  };

  // __ifThenElse(condition, thenStmt, elseStmt)__
  //
  // `@param {Object} condition` A PurpleRobot instance that evaluates to true or
  // false.  
  // `@param {Object} thenStmt` A PurpleRobot instance.  
  // `@param {Object} elseStmt` A PurpleRobot instance.  
  // `@returns {Object}` A new PurpleRobot instance.
  //
  // Generates a conditional expression.
  //
  // Example
  //
  //     pr.ifThenElse(pr.isEqual(1, 1), pr.emitToast("true"), pr.emitToast("error"));
  PR.prototype.ifThenElse = function(condition, thenStmt, elseStmt) {
    var expr = "if (" + condition.toString() + ") { " +
      thenStmt.toString() +
      " } else { " +
      elseStmt.toString() +
      " }";

    return new PR({
      serverUrl: this._serverUrl,
      script: [this._script, expr].join(" ").trim()
    });
  };

  // __doNothing()__
  //
  // `@returns {Object}` A new PurpleRobot instance.
  //
  // Generates an explicitly empty script.
  //
  // Example
  //
  //     pr.doNothing();
  PR.prototype.doNothing = function() {
    return new PR({
      serverUrl: this._serverUrl,
      script: this._script
    });
  };

  // ## Purple Robot API

  // __addNamespace(namespace)__
  //
  // `@param {string} namespace` The name of the namespace.  
  // `@returns {Object}` A new PurpleRobot instance.
  //
  // Adds a namespace under which unencrypted values might be stored.
  //
  // Example
  //
  //     pr.addNamespace("foo");
  PR.prototype.addNamespace = function(namespace) {
    return this._push("addNamespace", [q(namespace)].join(", "));
  };

  // __broadcastIntent(action, options)__
  //
  // `@returns {Object}` A new PurpleRobot instance.
  //
  // Broadcasts an Android intent.
  //
  // Example
  //
  //     pr.broadcastIntent("intent");
  PR.prototype.broadcastIntent = function(action, options) {
    return this._push("broadcastIntent", [q(action),
      JSON.stringify(options || null)].join(", "));
  };

  // __cancelScriptNotification()__
  //
  // `@returns {Object}` A new PurpleRobot instance.
  //
  // Removes the tray notification from the task bar.
  //
  // Example
  //
  //     pr.cancelScriptNotification();
  PR.prototype.cancelScriptNotification = function() {
    return this._push("cancelScriptNotification");
  };

  // __clearNativeDialogs()__  
  // __clearNativeDialogs(tag)__
  //
  // `@param {string} tag (optional)` An identifier of a specific dialog.  
  // `@returns {Object}` A new PurpleRobot instance.
  //
  // Removes all native dialogs from the screen.
  //
  // Examples
  //
  //     pr.clearNativeDialogs();
  //     pr.clearNativeDialogs("my-id");
  PR.prototype.clearNativeDialogs = function(tag) {
    if (tag) {
      return this._push("clearNativeDialogs", q(tag));
    } else {
      return this._push("clearNativeDialogs");
    }
  };

  // __clearTriggers()__
  //
  // `@returns {Object}` A new PurpleRobot instance.
  //
  // Deletes all Purple Robot triggers.
  //
  // Example
  //
  //     pr.clearTriggers();
  PR.prototype.clearTriggers = function() {
    return this._push("clearTriggers");
  };

  // __dateFromTimestamp(epoch)__
  //
  // `@param {number} epoch` The Unix epoch timestamp including milliseconds.  
  // `@returns {Object}` A new PurpleRobot instance.
  //
  // Returns a Date object given an epoch timestamp.
  //
  // Example
  //
  //     pr.dateFromTimestamp(1401205124000);
  PR.prototype.dateFromTimestamp = function(epoch) {
    return this._push("dateFromTimestamp", epoch);
  };

  // __deleteTrigger(id)__
  //
  // `@param {string} id` The id of the trigger.  
  // `@returns {Object}` A new PurpleRobot instance.
  //
  // Deletes the Purple Robot trigger identified by `id`;
  //
  // Example
  //
  //     pr.deleteTrigger("MY-TRIGGER");
  PR.prototype.deleteTrigger = function(id) {
    return this._push("deleteTrigger", q(id));
  };

  // __disableEachProbe()__
  //
  // `@returns {Object}` A new PurpleRobot instance.
  //
  // Disables all individual probes by setting the disabled flag. **Must** have
  // probes globally enabled for this to take effect.
  //
  // Example
  //
  //     pr.disableEachProbe();
  PR.prototype.disableEachProbe = function() {
    return this._push("disableEachProbe");
  };

  // __disableProbes()__
  //
  // `@returns {Object}` A new PurpleRobot instance.
  //
  // Disables probes globally, but does not affect individual probe settings,
  // including enabled/disabled flags.
  //
  // Example
  //
  //     pr.disableProbes();
  PR.prototype.disableProbes = function() {
    return this._push("disableProbes");
  };

  // __disableTrigger(id)__
  //
  // `@param {string} id` The id of the trigger.  
  // `@returns {Object}` A new PurpleRobot instance.
  //
  // Disables the Purple Robot trigger identified by `id`;
  //
  // Example
  //
  //     pr.disableTrigger("MY-TRIGGER");
  PR.prototype.disableTrigger = function(id) {
    return this._push("disableTrigger", q(id));
  };

  // __emitReading(name, value)__
  //
  // `@param {string} name` The name of the reading.  
  // `@param {*} value` The value of the reading.  
  // `@returns {Object}` A new PurpleRobot instance.
  //
  // Transmits a name value pair to be stored in Purple Robot Warehouse. The
  // table name will be *name*, and the columns and data values will be
  // extrapolated from the *value*.
  //
  // Example
  //
  //     pr.emitReading("sandwich", "pb&j");
  PR.prototype.emitReading = function(name, value) {
    return this._push("emitReading", q(name) + ", " + JSON.stringify(value));
  };

  // __emitToast(message, hasLongDuration)__
  //
  // `@param {string} message` The text of the toast.  
  // `@param {boolean} hasLongDuration` True if the toast should display longer.  
  // `@returns {Object}` A new PurpleRobot instance.
  //
  // Displays a native toast message on the phone.
  //
  // Example
  //
  //     pr.emitToast("howdy", true);
  PR.prototype.emitToast = function(message, hasLongDuration) {
    hasLongDuration = (typeof hasLongDuration === "boolean") ? hasLongDuration : true;

    return this._push("emitToast", q(message) + ", " + hasLongDuration);
  };

  // __enableProbes()__
  //
  // `@returns {Object}` A new PurpleRobot instance.
  //
  // Enables all individually enabled probes.
  //
  // Example
  //
  //     pr.enableProbes();
  PR.prototype.enableProbes = function() {
    return this._push("enableProbes");
  };

  // __enableTrigger(id)__
  //
  // `@param {string} id` The trigger ID.
  //
  // Enables the trigger.
  //
  // Example
  //
  //     pr.enableTrigger("my-trigger");
  PR.prototype.enableTrigger = function(id) {
    return this._push("enableTrigger", q(id));
  };

  // __fetchConfig()__
  //
  // `@returns {Object}` A new PurpleRobot instance.
  //
  // Returns the Purple Robot configuration.
  //
  // Example
  //
  //     pr.fetchConfig();
  PR.prototype.fetchConfig = function() {
    return this._push("fetchConfig");
  };

  // __fetchEncryptedString(key, namespace)__  
  // __fetchEncryptedString(key)__
  //
  // `@returns {Object}` A new PurpleRobot instance.
  //
  // Returns a value stored for the namespace and key provided. Generally
  // paired with `persistEncryptedString`.
  //
  // Examples
  //
  //     pr.fetchEncryptedString("x", "my stuff");
  //     pr.fetchEncryptedString("y");
  PR.prototype.fetchEncryptedString = function(key, namespace) {
    if (typeof namespace === "undefined") {
      return this._push("fetchEncryptedString", q(key));
    } else {
      return this._push("fetchEncryptedString", q(namespace) + ", " + q(key));
    }
  };

  // __fetchNamespace(namespace)__
  //
  // `@returns {Object}` A new PurpleRobot instance.
  //
  // Returns a hash of the keys and values stored in the namespace.
  //
  // Examples
  //
  //     pr.fetchNamespace("x").execute({
  //       done(function(store) {
  //         ...
  //       });
  PR.prototype.fetchNamespace = function(namespace) {
    return this._push("fetchNamespace", [q(namespace)].join(", "));
  };

  // __fetchNamespaces()__
  //
  // `@returns {Object}` A new PurpleRobot instance.
  //
  // Returns an array of all the namespaces
  //
  // Examples
  //
  //     pr.fetchNamespaces.execute({
  //       done(function(namespaces) {
  //         ...
  //       });
  PR.prototype.fetchNamespaces = function() {
    return this._push("fetchNamespaces");
  };

  // __fetchTrigger(id)__
  //
  // Example
  //
  //     pr.fetchTrigger("my-trigger").execute({
  //       done: function(triggerConfig) {
  //         ...
  //       }
  //     });
  PR.prototype.fetchTrigger = function(id) {
    return this._push("fetchTrigger", [q(id)].join(", "));
  };

  // __fetchTriggerIds()__
  //
  // `@returns {Object}` A new PurpleRobot instance.
  //
  // Returns an array of Trigger id strings.
  //
  // Example
  //
  //     pr.fetchTriggerIds().execute({
  //       done: function(ids) {
  //         ...
  //       }
  //     });
  PR.prototype.fetchTriggerIds = function() {
    return this._push("fetchTriggerIds");
  };

  // __fetchUserId()__
  //
  // `@returns {Object}` A new PurpleRobot instance.
  //
  // Returns the Purple Robot configured user id string.
  //
  // Example
  //
  //     pr.fetchUserId().execute().done(function(userId) {
  //       console.log(userId);
  //     });
  PR.prototype.fetchUserId = function() {
    return this._push("fetchUserId");
  };

  // __fetchWidget(id)__
  //
  // `@returns {Object}` A new PurpleRobot instance.
  //
  // Returns the widget identified by id.
  //
  // Example
  //
  //    pr.fetchWidget("asdf").execute({
  //      done: function(widget) {
  //        ...
  //      }
  //    });
  PR.prototype.fetchWidget = function(id) {
    return this._push("fetchWidget", q(id));
  };

  // __fireTrigger(id)__
  //
  // `@param {string} id` The trigger ID.  
  // `@returns {Object}` A new PurpleRobot instance.
  //
  // Fires the trigger immediately.
  //
  // Example
  //
  //     pr.fireTrigger("my-trigger");
  PR.prototype.fireTrigger = function(id) {
    return this._push("fireTrigger", q(id));
  };

  // __formatDate(date)__
  //
  // `@param {date} date` The date to be formatted for trigger purposes
  // `@returns {string}` The trigger date format for iCal compatibility
  //  Wed Sep 24 2014 11:17:40 GMT-0500 (CDT) is transformed to "20140924T111740" 
  PR.prototype.formatDate = function(date) {

   throw new error('There is no formatDate function on PR client');

  };

  // __getUploadUrl()__
  //
  // `@returns {Object}` A new PurpleRobot instance.
  //
  // Fetches the HTTP Upload Endpoint.
  //
  // Example
  //
  //    pr.getUploadUrl().execute({
  //      done: function(result) {
  //        ...
  //      }
  //    });
  PR.prototype.getUploadUrl = function() {
    return this._push("getUploadUrl");
  };

  // __launchApplication(name)__
  //
  // `@returns {Object}` A new PurpleRobot instance.
  //
  // Launches the specified Android application as if the user had pressed
  // the icon.
  //
  // Example
  //
  //     pr.launchApplication("edu.northwestern.cbits.awesome_app");
  PR.prototype.launchApplication = function(name) {
    return this._push("launchApplication", q(name));
  };

  // __launchInternalUrl(url)__
  //
  // `@param {string} url` The URL to request.  
  // `@returns {Object}` A new PurpleRobot instance.
  //
  // Launches a URL within the Purple Robot application WebView.
  //
  // Example
  //
  //     pr.launchInternalUrl("https://www.google.com");
  PR.prototype.launchInternalUrl = function(url) {
    return this._push("launchInternalUrl", [q(url)].join(", "));
  };

  // __launchUrl(url)__
  //
  // `@param {string} url` The URL to request.  
  // `@returns {Object}` A new object instance.
  //
  // Opens a new browser tab and requests the URL.
  //
  // Example
  //
  //     pr.launchUrl("https://www.google.com");
  PR.prototype.launchUrl = function(url) {
    return this._push("launchUrl", q(url));
  };

  // __loadLibrary(name)__
  //
  // `@param {string} name` The name of the JavaScript library to load.  
  // `@returns {Object}` A new PurpleRobot instance.
  //
  // Loads a JavaScript library in the context of Purple Robot.
  //
  // Example
  //
  //     pr.loadLibrary("Underscore");
  //
  // Possible values
  //
  //     D3
  //     Moment
  //     Underscore
  PR.prototype.loadLibrary = function(name) {
    return this._push("loadLibrary", q(name));
  };

  // __log(name, value)__
  //
  // `@param {string} name` The prefix to the log message.  
  // `@param {*} value` The contents of the log message.  
  // `@returns {Object}` A new PurpleRobot instance.
  //
  // Logs an event to the PR event capturing service as well as the Android log.
  //
  // Example
  //
  //     pr.log("zing", { wing: "ding" });
  PR.prototype.log = function(name, value) {
    return this._push("log", q(name) + ", " + JSON.stringify(value));
  };

  // __models()__
  PR.prototype.models = function() {
    throw new Error("PurpleRobot.prototype.models not implemented yet");
  };

  // __now()__
  //
  // `@returns {Object}` A new PurpleRobot instance.
  //
  // Calculates a string representing the current date.
  //
  // Example
  //
  //     pr.now().execute({
  //       done: function(dateStr) {
  //         ...
  //       }
  //     });
  PR.prototype.now = function() {
    return this._push("now");
  };

  // __packageForApplicationName(applicationName)__
  //
  // `@returns {Object}` A new PurpleRobot instance.
  //
  // Returns the package name string for the application.
  //
  // Example
  //
  //     pr.packageForApplicationName("edu.northwestern.cbits.purple_robot_manager").execute({
  //       done: function(package) {
  //         ...
  //       }
  //     });
  PR.prototype.packageForApplicationName = function(applicationName) {
    return this._push("packageForApplicationName", [q(applicationName)].join(", "));
  };

  // __parseDate(dateString)__
  PR.prototype.parseDate = function(dateString) {
    throw new Error("PurpleRobot.prototype.parseDate not implemented yet");
  };

  // __persistEncryptedString(key, value, namespace)__  
  // __persistEncryptedString(key, value)__
  //
  // `@param {string} key` The name of the key where the value will be stored.  
  // `@param {*} value` The thing to store.  
  // `@param {string} namespace (optional)` The namespace in which to store the
  // data.  
  // `@returns {Object}` A new PurpleRobot instance.
  //
  // Stores the *value* within the *namespace*, identified by the *key*.
  //
  // Examples
  //
  //     pr.persistEncryptedString("foo", "bar", "app Q");
  //     pr.persistEncryptedString("foo", "bar");
  PR.prototype.persistEncryptedString = function(key, value, namespace) {
    if (typeof namespace === "undefined") {
      return this._push("persistEncryptedString", q(key) + ", " + q(value));
    } else {
      return this._push("persistEncryptedString", q(namespace) + ", " + q(key) + ", " + q(value));
    }
  };

  // __persistString(key, value, namespace)__  
  // __persistString(key, value)__
  //
  // `@param {string} key` The name of the key where the value will be stored.  
  // `@param {*} value` The thing to store.  
  // `@param {string} namespace (optional)` The namespace in which to store the
  // data.  
  // `@returns {Object}` A new PurpleRobot instance.
  //
  // Stores the *value* within the *namespace*, identified by the *key*.
  //
  // Examples
  //
  //     pr.persistString("foo", "bar", "app Q");
  //     pr.persistString("foo", "bar");
  PR.prototype.persistString = function(key, value, namespace) {
    if (typeof namespace === "undefined") {
      return this._push("persistString", q(key) + ", " + q(value));
    } else {
      return this._push("persistString", q(namespace) + ", " + q(key) + ", " + q(value));
    }
  };

  // __playDefaultTone()__
  // __playDefaultTone(loops)__
  //
  // `@param {boolean} loops (optional)` The tone loops indefinitely.  
  // `@returns {Object}` A new PurpleRobot instance.
  //
  // Plays a default Android notification sound.
  //
  // Examples
  //
  //     pr.playDefaultTone();
  //     pr.playDefaultTone(true);
  PR.prototype.playDefaultTone = function(loops) {
    if (typeof loops !== "boolean") {
      loops = false;
    }

    return this._push("playDefaultTone", loops);
  };

  // __playTone(tone)__
  //
  // `@returns {Object}` A new PurpleRobot instance.
  //
  // Plays an existing notification sound on an Android phone.
  //
  // Example
  //
  //     pr.playTone("Hojus");
  PR.prototype.playTone = function(tone) {
    return this._push("playTone", q(tone));
  };

  // __predictions()__
  PR.prototype.predictions = function() {
    throw new Error("PurpleRobot.prototype.predictions not implemented yet");
  };

  // __readings()__
  PR.prototype.readings = function() {
    throw new Error("PurpleRobot.prototype.readings not implemented yet");
  };

  // __readUrl(url)__
  //
  // `@param {string}` The URL to GET.  
  // `@returns {Object}` A new PurpleRobot instance.
  //
  // Attempts to GET a URL and return the body as a string.
  //
  // Example
  //
  //     pr.readUrl("http://www.northwestern.edu").execute({
  //       done: function(body) {
  //         ...
  //       }
  //     });
  PR.prototype.readUrl = function(url) {
    return this._push("readUrl", q(url));
  };

  // __resetTrigger(id)__
  //
  // `@param {string} id` The trigger ID.
  //
  // Resets the trigger. __Note: the default implementation of this method in
  // PurpleRobot does nothing.__
  //
  // Example
  //
  //     pr.resetTrigger("my-trigger");
  PR.prototype.resetTrigger = function(id) {
    return this._push("resetTrigger", q(id));
  };

  // __runScript(script)__
  //
  // `@param {Object} script` A PurpleRobot instance.  
  // `@returns {Object}` A new PurpleRobot instance.
  //
  // Runs a script immediately.
  //
  // Example
  //
  //     pr.runScript(pr.emitToast("toasty"));
  PR.prototype.runScript = function(script) {
    return this._push("runScript", script.toJson());
  };

  // __scheduleScript(name, minutes, script)__
  //
  // `@returns {Object}` A new PurpleRobot instance.
  //
  // Schedules a script to run a specified number of minutes in the future
  // (calculated from when this script is evaluated).
  //
  // Example
  //
  //     pr.scheduleScript("fancy script", 5, pr.playDefaultTone());
  PR.prototype.scheduleScript = function(name, minutes, script) {
    var timestampStr = "(function() { var now = new Date(); var scheduled = new Date(now.getTime() + " + minutes + " * 60000); var pad = function(n) { return n < 10 ? '0' + n : n; }; return '' + scheduled.getFullYear() + pad(scheduled.getMonth() + 1) + pad(scheduled.getDate()) + 'T' + pad(scheduled.getHours()) + pad(scheduled.getMinutes()) + pad(scheduled.getSeconds()); })()";

    return this._push("scheduleScript", q(name) + ", " + timestampStr + ", " + script.toJson());
  };

  // __setUploadUrl(url)__
  //
  // `@param {String} url` The URL to set as the HTTP Upload Endpoint.  
  // `@returns {Object}` A new PurpleRobot instance.
  //
  // Example
  //
  //    pr.setUploadUrl("https://my-endpoint");
  PR.prototype.setUploadUrl = function(url) {
    return this._push("setUploadUrl", q(url));
  };

  // __setUserId(value)__
  //
  // `@returns {Object}` A new PurpleRobot instance.
  //
  // Sets the Purple Robot user id string.
  //
  // Example
  //
  //     pr.setUserId("Bobbie");
  PR.prototype.setUserId = function(value) {
    return this._push("setUserId", q(value));
  };

  // __showApplicationLaunchNotification(options)__
  PR.prototype.showApplicationLaunchNotification = function(options) {
    throw new Error("PurpleRobot.prototype.showApplicationLaunchNotification not implemented yet");
  };

  // __showNativeDialog(options)__
  //
  // `@param {Object} options` Parameterized options for the dialog, including:
  // `{string} title` the dialog title, `{string} message` the body text,
  // `{string} buttonLabelA` the first button label, `{Object} scriptA` a
  // PurpleRobot instance to be run when button A is pressed, `{string}
  // buttonLabelB` the second button label, `{Object} scriptB` a PurpleRobot
  // instance to be run when button B is pressed, `{string} tag (optional)` an
  // id to be associated with the dialog, `{number} priority` an importance
  // associated with the dialog that informs stacking where higher means more
  // important.  
  // `@returns {Object}` A new PurpleRobot instance.
  //
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
  //       scriptB: pr.emitToast("boo!"),
  //       tag: "my-dialog",
  //       priority: 3
  //     });
  PR.prototype.showNativeDialog = function(options) {
    var args = [q(options.title),
      q(options.message), q(options.buttonLabelA),
      q(options.buttonLabelB), options.scriptA.toJson(),
      options.scriptB.toJson()];

    if (options.tag !== undefined && options.priority !== undefined) {
      args = args.concat([JSON.stringify(options.tag), options.priority]);
    }

    return this._push("showNativeDialog", args.join(", "));
  };

  // __showScriptNotification(options)__
  //
  // `@returns {Object}` A new PurpleRobot instance.
  //
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
  PR.prototype.showScriptNotification = function(options) {
    options = options || {};

    return this._push("showScriptNotification", [q(options.title),
      q(options.message), options.isPersistent, options.isSticky,
      options.script.toJson()].join(", "));
  };

  // __stopPlayback()__
  //
  // `@returns {Ojbect}` A new PurpleRobot instance.
  //
  // Stops tone playback.
  //
  // Example
  //
  //     pr.stopPlayback();
  PR.prototype.stopPlayback = function() {
    return this._push("stopPlayback");
  };

  // __updateConfig(options)__
  //
  // `@param {Object} options` The options to configure.  
  // `@returns {Object}` A new PurpleRobot instance.
  //
  // Example
  //
  //     pr.updateConfig({
  //       config_enable_data_server: true,
  //       config_restrict_data_wifi: false
  //     });
  //
  // Options
  //
  //     config_data_server_uri
  //     config_enable_data_server
  //     config_feature_weather_underground_enabled
  //     config_http_liberal_ssl
  //     config_last_weather_underground_check
  //     config_probe_running_software_enabled
  //     config_probe_running_software_frequency
  //     config_probes_enabled
  //     config_restrict_data_wifi
  PR.prototype.updateConfig = function(options) {
    return this._push("updateConfig", [JSON.stringify(options)].join(", "));
  };

  // __updateConfigUrl(url)__
  //
  // `@param {String} url` The URL from which Purple Robot should fetch JSON
  // configurations.  
  // `@returns {Object}` A new PurpleRobot instance.
  //
  // Example
  //
  //    pr.updateConfigUrl("http://my-endpoint");
  PR.prototype.updateConfigUrl = function(url) {
    return this._push("updateConfigUrl", q(url));
  };

  // __updateProbe(options)__
  // 
  // `@param {Object}` The probe settings.  
  // `@returns {Object}` A new PurpleRobot instance.
  //
  // Applies settings to an individual probe.
  //
  // Example
  //
  //    pr.updateProbe({
  //      name: "edu.northwestern.cbits.purple_robot_manager.probes.builtin.BatteryProbe",
  //      enabled: true
  //    });
  PR.prototype.updateProbe = function(options) {
    return this._push("updateProbe", JSON.stringify(options));
  };

  // __updateTrigger(options)__
  //
  // `@returns {Object}` A new PurpleRobot instance.
  //
  // Adds or updates a Purple Robot trigger to be run at a time and with a
  // recurrence rule.
  //
  // Example
  //
  // The following would emit a toast every 30 minutes:
  //
  //     pr.updateTrigger({
  //       script: pr.emitToast("butter"),
  //       startAt: new Date(2014, 10, 24, 13, 54, 33, 0),
  //       endAt: new Date(2014, 10, 24, 13, 54, 34, 0),
  //       repeatRule: "FREQ=MINUTELY;INTERVAL=30",
  //       fire_on_boot: false
  //     });
  PR.prototype.updateTrigger = function(options) {
    options = options || {};

    var timestamp = (new Date()).getTime();
    var triggerId = options.triggerId || ("TRIGGER-" + timestamp);

    function formatDate (date){
      function formatYear(date){
        return date.getFullYear();
      }

      function formatMonth(date){
        return ("0" + parseInt(1+date.getMonth())).slice(-2);
      }

      function formatDays(date){
        return ("0" + parseInt(date.getDate())).slice(-2);
      }

      function formatHours(date){
        return ("0" + date.getHours()).slice(-2);
      }

      function formatMinutes(date){
        return ("0" + date.getMinutes()).slice(-2);
      }

      function formatSeconds  (date){
        return ("0" + date.getSeconds()).slice(-2);
      }

      return formatYear(date) + formatMonth(date) + formatDays(date) + "T" +
             formatHours(date) + formatMinutes(date) + formatSeconds(date);
    
    }

    var triggerJson = JSON.stringify({
      type: options.type || "datetime",
      name: triggerId,
      identifier: triggerId,
      action: options.script.toString(),
      datetime_start: formatDate(options.startAt),
      datetime_end: formatDate(options.endAt),
      datetime_repeat: options.repeatRule || "FREQ=DAILY;INTERVAL=1",
      datetime_random: (options.random === true) || false,
      fire_on_boot: true && (options.fire_on_boot !== false)
    });

    return this._push("updateTrigger", q(triggerId) + ", " + triggerJson);
  };

  // __updateWidget(parameters)__
  PR.prototype.updateWidget = function(parameters) {
    throw new Error("PurpleRobot.prototype.updateWidget not implemented yet");
  };

  // __version()__
  //
  // `@returns {Object}` A new PurpleRobot instance.
  //
  // Returns the current version string for Purple Robot.
  //
  // Example
  //
  //     pr.version().execute({
  //       done: function(version) {
  //         ...
  //       }
  //     });
  PR.prototype.version = function() {
    return this._push("version");
  };

  // __vibrate(pattern)__
  // __vibrate(pattern, repeats)__
  //
  // `@param {string} pattern` The name of the vibration pattern.  
  // `@param {boolean} repeats (optional)` True if the pattern repeats.  
  // `@returns {Object}` A new PurpleRobot instance.
  //
  // Vibrates the phone with a preset pattern.
  //
  // Example
  //
  //     pr.vibrate("buzz");
  //     pr.vibrate("buzz", true);
  //
  // Patterns
  //
  //     blip
  //     buzz
  //     sos
  PR.prototype.vibrate = function(pattern, repeats) {
    pattern = pattern || "buzz";

    if (typeof repeats !== "boolean") {
      repeats = false;
    }

    return this._push("vibrate", q(pattern) + ", " + repeats);
  };

  // __widgets()__
  PR.prototype.widgets = function() {
    throw new Error("PurpleRobot.prototype.widgets not implemented yet");
  };

  // ## Internal methods

  // ___push(nextScript)__
  //
  // `@private`  
  // `@returns {Object}` A new PurpleRobot instance.
  //
  // Enables chaining of method calls.
  PR.prototype._push = function(methodName, argStr) {
    var nextScript = ["PurpleRobot.", methodName, "(", argStr, ");"].join("");

    return new PR({
      serverUrl: this._serverUrl,
      script: [this._script, nextScript].join(" ").trim()
    });
  };

  // ___stringify(value)__
  //
  // `@private`  
  // `@param {*} value` The value to be stringified.  
  // `@returns {string}` The stringified representation.
  //
  // Returns a string representation of the input. If the input is a
  // `PurpleRobot` instance, a string expression is returned, otherwise a JSON
  // stringified version is returned.
  PR.prototype._stringify = function(value) {
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

  // __q(value)__
  //
  // `@private`  
  // `@param {string} value` A string argument.  
  // `@returns {string}` A string with extra single quotes surrounding it.
  function q(value) {
    return "'" + value + "'";
  }

  window.PurpleRobot = PR;
})();

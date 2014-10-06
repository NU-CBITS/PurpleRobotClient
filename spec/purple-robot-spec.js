describe("PurpleRobot", function() {
  var pr;

  beforeEach(function() {
    pr = new PurpleRobot();
    delete localStorage.prQueue;
  });

  it("should be able to generate a string representation of chained methods", function() {
    var str = pr.emitReading("a", "1").playDefaultTone().toString();
    expect(str).toEqual("PurpleRobot.emitReading('a', \"1\"); PurpleRobot.playDefaultTone();");
  });

  it("should generate a string representing nested methods", function() {
    var str = pr.showNativeDialog({
      title: "My Dialog",
      message: "What say you?",
      buttonLabelA: "cheers",
      scriptA: pr.emitToast("cheers!"),
      buttonLabelB: "boo",
      scriptB: pr.emitToast("boo!")
    }).toString();
    expect(str).toEqual("PurpleRobot.showNativeDialog('My Dialog', 'What say you?', 'cheers', 'boo', \"PurpleRobot.emitToast('cheers!', true);\", \"PurpleRobot.emitToast('boo!', true);\", null, 0);");
  });

  describe(".setEnvironment", function() {
    it("should raise an exception given unrecognized environments", function() {
      expect(function() { PurpleRobot.setEnvironment("blurg"); }).toThrow();
    });

    it("should set the environment if recognized", function() {
      expect(PurpleRobot.setEnvironment("production").env).toEqual("production");
    });
  });

  describe("#execute", function() {
    var mockXHR = jasmine.createSpyObj("mockXHR", ["open", "setRequestHeader",
      "send"]);

    beforeEach(function() {
      spyOn(window, "XMLHttpRequest").and.returnValue(mockXHR);
    });

    it("should not make an HTTP request in web environment", function() {
      PurpleRobot.setEnvironment("web");
      pr.execute();
      expect(mockXHR.send).not.toHaveBeenCalled();
    });

    it("should make an HTTP request in production environment", function() {
      PurpleRobot.setEnvironment("production");
      pr.execute();
      expect(mockXHR.send)
        .toHaveBeenCalledWith('json={"command":"execute_script","script":""}');
    });
  });

  describe("#isEqual", function() {
    it("should generate an equality expression", function () {
      expect(pr.isEqual(pr.fetchEncryptedString("a"), null).toString())
        .toEqual("(function() { return PurpleRobot.fetchEncryptedString('a'); })() == null");
    });
  });

  describe("#ifThenElse", function() {
    it("should generate a conditional statement", function() {
      expect(pr.ifThenElse(pr.isEqual(1, 1), pr.playDefaultTone(), pr.vibrate()).toString())
        .toEqual("if (1 == 1) { PurpleRobot.playDefaultTone(); } else { PurpleRobot.vibrate('buzz'); }");
    });
  });

  describe("#doNothing", function() {
    it("should generate a script that does nothing additional", function() {
      expect(pr.doNothing().toString()).toEqual("");
    });
  });

  describe("#save", function() {
    it("should save a string representation in localStorage", function() {
      expect(pr.emitReading("foo", "bar").save().toString())
        .toEqual("PurpleRobot.emitReading('foo', \"bar\");");
      expect(localStorage.prQueue)
        .toEqual("PurpleRobot.emitReading('foo', \"bar\");");
    });
  });

  describe("#restore", function() {
    it("should restore a string representation from localStorage", function() {
      localStorage.prQueue = "PurpleRobot.emitToast('toast');";
      expect(pr.restore().toString())
        .toEqual("PurpleRobot.emitToast('toast');");
    });
  });

  describe("#destroy", function() {
    it("should remove a string representation from localStorage", function() {
      localStorage.prQueue = "PurpleRobot.emitToast('toast');";
      pr.destroy();
      expect(localStorage.prQueue).toBeUndefined();
    });
  });

  describe("should implement API methods", function() {
    it("#addNamespace", function() {
      expect(pr.addNamespace("foo").toString())
        .toEqual("PurpleRobot.addNamespace('foo');");
    });

    it("#broadcastIntent", function() {
      expect(pr.broadcastIntent("foo", { bar: "baz" }).toString())
        .toEqual("PurpleRobot.broadcastIntent('foo', {\"bar\":\"baz\"});");
    });

    it("#cancelScriptNotification", function() {
      expect(pr.cancelScriptNotification().toString())
        .toEqual("PurpleRobot.cancelScriptNotification();");
    });

    it("#clearNativeDialogs", function() {
      expect(pr.clearNativeDialogs().toString())
        .toEqual("PurpleRobot.clearNativeDialogs();");
      expect(pr.clearNativeDialogs("my-id").toString())
        .toEqual("PurpleRobot.clearNativeDialogs('my-id');");
    });

    it("#clearTriggers", function() {
      expect(pr.clearTriggers().toString())
        .toEqual("PurpleRobot.clearTriggers();");
    });

    it("#dateFromTimestamp", function() {
      expect(pr.dateFromTimestamp(1401205124000).toString())
        .toEqual("PurpleRobot.dateFromTimestamp(1401205124000);");
    });

    it("#deleteTrigger", function() {
      expect(pr.deleteTrigger("my-trigger").toString())
        .toEqual("PurpleRobot.deleteTrigger('my-trigger');");
    });

    it("#disableProbes", function() {
      expect(pr.disableProbes().toString())
        .toEqual("PurpleRobot.disableProbes();");
    });

    it("#disableTrigger", function() {
      expect(pr.disableTrigger("MY-TRIGGER").toString())
        .toEqual("PurpleRobot.disableTrigger('MY-TRIGGER');");
    });

    it("#emitReading", function() {
      expect(pr.emitReading("a", "b").toString())
        .toEqual("PurpleRobot.emitReading('a', \"b\");");
    });

    it("#emitToast", function() {
      expect(pr.emitToast("a").toString())
        .toEqual("PurpleRobot.emitToast('a', true);");
      expect(pr.emitToast("a", true).toString())
        .toEqual("PurpleRobot.emitToast('a', true);");
      expect(pr.emitToast("a", false).toString())
        .toEqual("PurpleRobot.emitToast('a', false);");
    });

    it("#enableProbes", function() {
      expect(pr.enableProbes().toString())
        .toEqual("PurpleRobot.enableProbes();");
    });

    it("#enableTrigger", function() {
      expect(pr.enableTrigger("MY-TRIGGER").toString())
        .toEqual("PurpleRobot.enableTrigger('MY-TRIGGER');");
    });

    it("#fetchConfig", function() {
      expect(pr.fetchConfig().toString())
        .toEqual("PurpleRobot.fetchConfig();");
    });

    it("#fetchEncryptedString", function() {
      expect(pr.fetchEncryptedString("key", "namespace").toString())
        .toEqual("PurpleRobot.fetchEncryptedString('namespace', 'key');");
      expect(pr.fetchEncryptedString("key").toString())
        .toEqual("PurpleRobot.fetchEncryptedString('key');");
    });

    it("#fetchNamespace", function() {
      expect(pr.fetchNamespace("x").toString())
        .toEqual("PurpleRobot.fetchNamespace('x');");
    });

    it("#fetchNamespaces", function() {
      expect(pr.fetchNamespaces().toString())
        .toEqual("PurpleRobot.fetchNamespaces();");
    });

    it("#fetchTrigger", function() {
      expect(pr.fetchTrigger("x").toString())
        .toEqual("PurpleRobot.fetchTrigger('x');");
    });

    it("#fetchTriggerIds", function() {
      expect(pr.fetchTriggerIds().toString())
        .toEqual("PurpleRobot.fetchTriggerIds();");
    });

    it("#fetchUserId", function() {
      expect(pr.fetchUserId().toString())
        .toEqual("PurpleRobot.fetchUserId();");
    });

    it("#fetchWidget", function() {
      expect(pr.fetchWidget("abcd").toString())
        .toEqual("PurpleRobot.fetchWidget('abcd');");
    });

    it("#fireTrigger", function() {
      expect(pr.fireTrigger("MY-TRIGGER").toString())
        .toEqual("PurpleRobot.fireTrigger('MY-TRIGGER');");
    });

    it("#launchApplication", function() {
      expect(pr.launchApplication("foo.bar").toString())
        .toEqual("PurpleRobot.launchApplication('foo.bar');");
    });

    it("#launchInternalUrl", function() {
      expect(pr.launchInternalUrl("https://www.google.com").toString())
        .toEqual("PurpleRobot.launchInternalUrl('https://www.google.com');");
    });

    it("#launchUrl", function() {
      expect(pr.launchUrl("https://www.google.com").toString())
        .toEqual("PurpleRobot.launchUrl('https://www.google.com');");
    });

    it("#loadLibrary", function() {
      expect(pr.loadLibrary("Underscore").toString())
        .toEqual("PurpleRobot.loadLibrary('Underscore');");
    });

    it("#log", function() {
      expect(pr.log("wing", { zing: "ding" }).toString())
        .toEqual("PurpleRobot.log('wing', {\"zing\":\"ding\"});");
    });

    it("#now", function() {
      expect(pr.now().toString())
        .toEqual("PurpleRobot.now();");
    });

    it("#packageForApplicationName", function() {
      expect(pr.packageForApplicationName("asdf").toString())
        .toEqual("PurpleRobot.packageForApplicationName('asdf');");
    });

    it("#persistEncryptedString", function() {
      expect(pr.persistEncryptedString("key", "val", "namespace").toString())
        .toEqual("PurpleRobot.persistEncryptedString('namespace', 'key', 'val');");
      expect(pr.persistEncryptedString("key", "val").toString())
        .toEqual("PurpleRobot.persistEncryptedString('key', 'val');");
    });

    it("#playDefaultTone", function() {
      expect(pr.playDefaultTone().toString())
        .toEqual("PurpleRobot.playDefaultTone();");
    });

    it("#playTone", function() {
      expect(pr.playTone('Hojus').toString())
        .toEqual("PurpleRobot.playTone('Hojus');");
    });

    it("#readUrl", function() {
      expect(pr.readUrl("http://www.northwestern.edu").toString())
        .toEqual("PurpleRobot.readUrl('http://www.northwestern.edu');");
    });

    it("#resetTrigger", function() {
      expect(pr.resetTrigger("MY-TRIGGER").toString())
        .toEqual("PurpleRobot.resetTrigger('MY-TRIGGER');");
    });

    it("#runScript", function() {
      expect(pr.runScript(pr.playDefaultTone()).toString())
        .toEqual("PurpleRobot.runScript(\"PurpleRobot.playDefaultTone();\");");
    });

    it("#scheduleScript", function() {
      expect(pr.scheduleScript("Tone 1", 3, pr.playDefaultTone()).toString())
        .toEqual("PurpleRobot.scheduleScript('Tone 1', (function() { var now = new Date(); var scheduled = new Date(now.getTime() + 3 * 60000); var pad = function(n) { return n < 10 ? '0' + n : n; }; return '' + scheduled.getFullYear() + pad(scheduled.getMonth() + 1) + pad(scheduled.getDate()) + 'T' + pad(scheduled.getHours()) + pad(scheduled.getMinutes()) + pad(scheduled.getSeconds()); })(), \"PurpleRobot.playDefaultTone();\");");
    });

    it("#setUserId", function() {
      expect(pr.setUserId("Bobbie").toString())
        .toEqual("PurpleRobot.setUserId('Bobbie');");
    });

    it("#showNativeDialog", function() {
      var str = pr.showNativeDialog({
        title: "My Dialog",
        message: "What say you?",
        buttonLabelA: "cheers",
        scriptA: pr.emitToast("cheers!"),
        buttonLabelB: "boo",
        scriptB: pr.emitToast("boo!"),
        tag: "my-dialog",
        priority: 3
      }).toString();

      expect(str).toEqual("PurpleRobot.showNativeDialog('My Dialog', 'What say you?', 'cheers', 'boo', \"PurpleRobot.emitToast('cheers!', true);\", \"PurpleRobot.emitToast('boo!', true);\", \"my-dialog\", 3);");
    });

    it("#showScriptNotification", function() {
      var str = pr.showScriptNotification({
        title: "My app",
        message: "Press here",
        isPersistent: true,
        isSticky: false,
        script: pr.emitToast("You pressed it")
      }).toString();

      expect(str).toEqual("PurpleRobot.showScriptNotification('My app', 'Press here', true, false, \"PurpleRobot.emitToast('You pressed it', true);\");");
    });

    it("#updateTrigger", function() {
      var str = pr.updateTrigger({
        script: pr.emitToast("butter"),
        triggerId: "Z",
        startAt: new Date(2014, 10, 24, 13, 54, 33, 0),
        endAt: new Date(2014, 10, 24, 13, 54, 34, 0),
      }).toString();

      expect(str).toEqual("PurpleRobot.updateTrigger('Z', {\"type\":\"datetime\",\"name\":\"Z\",\"identifier\":\"Z\",\"action\":\"PurpleRobot.emitToast('butter', true);\",\"datetime_start\":\"20141124T135433\",\"datetime_end\":\"20141124T135434\",\"datetime_repeat\":\"FREQ=DAILY;INTERVAL=1\",\"fire_on_boot\":true});");
    });

    it("#version", function() {
      expect(pr.version().toString()).toEqual("PurpleRobot.version();");
    });

    it("#vibrate", function() {
      expect(pr.vibrate().toString()).toEqual("PurpleRobot.vibrate('buzz');");
      expect(pr.vibrate("sos").toString()).toEqual("PurpleRobot.vibrate('sos');");
    });
  });
});

describe("PurpleRobot", function() {
  var pr;

  beforeEach(function() {
    pr = new PurpleRobot();
  });

  it("should be able to generate a string representation of a method", function() {
    expect(pr.playDefaultTone().toString()).toEqual("PurpleRobot.playDefaultTone();");
  });

  it("should be able to generate a string representation of chained methods", function() {
    var str = pr.emitReading("a", "1").playDefaultTone().toString();
    expect(str).toEqual("PurpleRobot.emitReading('a', '\"1\"'); PurpleRobot.playDefaultTone();");
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
    expect(str).toEqual("PurpleRobot.showNativeDialog('My Dialog', 'What say you?', 'cheers', 'boo', \"PurpleRobot.emitToast('cheers!', true);\", \"PurpleRobot.emitToast('boo!', true);\");");
  });
});

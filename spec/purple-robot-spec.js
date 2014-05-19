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
});

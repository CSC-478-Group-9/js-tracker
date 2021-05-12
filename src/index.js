import cookie from "component-cookie";
import { v4 as uuidv4 } from "uuid";

class JSTracker {
  constructor(config) {
    // generate cookie if none exists with uuid
    if (!cookie("tracking_web_uid")) {
      cookie("tracking_web_uid", uuidv4());
    }
    const tracker = this;

    // noinspection CommaExpressionJS
    (tracker.apiKey = typeof config.apiKey == "string" ? config.apiKey : ""),
      (tracker.anonymousID = {}),
      (tracker.endpoint =
        typeof config.endpoint == "string" ? config.endpoint : "api"),
      (tracker.async = typeof config.async == "boolean" ? config.async : true),
      (tracker.debug = typeof config.debug == "boolean" ? config.debug : true),
      (tracker.records = []),
      (tracker.session = {}),
      (tracker.loadTime = new Date());

    this.apiKey = config.apiKey;

    this.startSession();
    this.bindEvents();

    return tracker;
  }

  bindEvents() {
    const tracker = this;
    /*
    // Bind error Event (currently disabled)
    window.addEventListener("error", function (e) {
      tracker.addErrorEvent(e);
    });
     */

    // Bind onbeforeunload Event
    window.onbeforeunload = function () {
      // Close Session
      tracker.endSession();
      tracker.sendEvent(tracker.session);
    };

    return tracker;
  }

  addErrorEvent(e) {
    const tracker = this,
      // Error Object
      error = {
        type: "error",
        apiKey: this.apiKey,
        message: e.message,
        source: e.source,
        lineno: e.lineno,
        colno: e.colno,
        errorObj: e.error,
        createdAt: new Date().now,
      };

    // Insert into Records Array
    tracker.records.push(error);

    // Log Interaction if Debugging
    if (tracker.debug) {
      // Close Session & Log to Console
      tracker.endSession();
      console.log("Session:\n", tracker.session);
    }

    return tracker;
  }

  startSession() {
    const tracker = this;

    // Assign Session Property
    tracker.session = {
      type: "session",
      apiKey: this.apiKey,
      anonymousID: cookie("tracking_web_uid"),
      loadTime: tracker.loadTime,
      unloadTime: new Date().now,
      language: window.navigator.language,
      platform: window.navigator.platform,
      port: window.location.port,
      referer: document.referrer,
      location: window.location.pathname,
      href: window.location.href,
      origin: window.location.origin,
      title: document.title,
      endpoint: tracker.endpoint,
    };

    this.sendEvent(tracker.session);

    return tracker;
  }

  endSession() {
    const tracker = this;

    // Assign Session Properties
    tracker.session.unloadTime = new Date().now;

    return tracker;
  }

  sendEvent(payload) {
    const tracker = this,
      xhr = new XMLHttpRequest();
    // Post Session Data Serialized as JSON
    xhr.open("POST", tracker.endpoint, tracker.async);
    xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");

    xhr.send(JSON.stringify(payload));

    return tracker;
  }
}

export default JSTracker;

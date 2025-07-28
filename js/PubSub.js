const PubSub = (function () {
  const events = {}; // Stores event names as keys and arrays of callbacks as values

  /**
   * Subscribes a callback function to a specific event.
   */
  const subscribe = function thatTriggersCallbacksAfterEvents(
    eventName,
    callback
  ) {
    if (!events[eventName]) {
      events[eventName] = [];
    }

    events[eventName].push(callback);
  };

  const publish = function thatTriggersAllSubscribedCallbacks(eventName, data) {
    if (events[eventName]) {
      events[eventName].forEach((callback) => {
        callback(data);
      });
    }
  };

  return { subscribe, publish };
})();

export default PubSub;

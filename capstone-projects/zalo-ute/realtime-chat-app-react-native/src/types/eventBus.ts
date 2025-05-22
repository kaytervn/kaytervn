import mitt from "mitt";

// Define the types of events
type Events = {
  REFRESH_DATA: void; // No payload is needed for a simple refresh signal
};

const eventBus = mitt<Events>();

export default eventBus;
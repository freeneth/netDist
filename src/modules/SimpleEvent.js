export class SimpleEvent {
    constructor() {
        this.events = {};
    }
    on(eventName, callback) {
        const { events } = this;
        const event = events[eventName] || (events[eventName] = []);
        return event.push(callback) - 1;
    }
    emit(eventName, payload) {
        const event = this.events[eventName];
        event && event.forEach(c => c(payload));
    }
    unbind(eventName, index) {
        const event = this.events[eventName];
        event.splice(index, 1);
    }
}

export class SimpleEvent {
    events: object;

    constructor() {
        this.events = {}
    }
  
    on(eventName: string, callback: Function): number {
        const {events} = this;
        const event = events[eventName] || (events[eventName] = []);
        return event.push(callback) - 1
    }

    emit(eventName: string, payload: object): void {
        const event = this.events[eventName];
        event && event.forEach(c => c(payload))
    }

    unbind(eventName: string, index: number): void {
        const event = this.events[eventName];
        event.splice(index, 1)
    }
}
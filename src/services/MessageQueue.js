class MessageQueue {
    constructor() {
        this.messages = [];
    }

    log(channel, message) {
        const timestamp = Date.now();
        this.messages.push({ id: timestamp, channel, message});
    }

    getMessages(channel, since = 0) {
        let messages = this.messages.filter((msg) => msg.channel === channel)
        messages = messages.filter((msg) => msg.id > since);

        return messages.sort((a, b) => a.id - b.id);
    }
}

const messageQueue = new MessageQueue;
export { messageQueue }
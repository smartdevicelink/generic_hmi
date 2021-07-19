// Helper reducer to gather all labels of messages, mostly used for functional groups
export function GatherLabels(messages) {
    return messages.reduce((labels, msg) => {
        if (msg.label) { labels.push(msg.label); }
        return labels;
    }, []).join(', ');
}

// Helper function to replace variabels in Consumer Friendly Messages
export default function FillConsumerFriendlyMessages(appName, messages, labels=undefined) {
    var allLabels = labels ?? GatherLabels(messages);

    var newMessages = [];
    for (var message of messages) {
        if ('string' === typeof message.ttsString) {
            message.ttsString = message.ttsString.replace(/%appName%/g, appName);
            message.ttsString = message.ttsString.replace(/%vehicleMake%/g, 'SDL');
            message.ttsString = message.ttsString.replace(/%functionalGroupLabels%/g, allLabels);
        }

        if ('string' === typeof message.textBody) {
            message.textBody = message.textBody.replace(/%appName%/g, appName);
            message.textBody = message.textBody.replace(/%vehicleMake%/g, 'SDL');
            message.textBody = message.textBody.replace(/%functionalGroupLabels%/g, allLabels);
        }

        newMessages.push(message);
    }

    return newMessages;
}
type MessageContent = [string, string, string];

class Quest {
    items: ItemType[];
    nickname: string;
    briefing: MessageContent;
    debriefing: MessageContent;
    newsLine: string;

}
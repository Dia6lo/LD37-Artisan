type MessageContent = [string, string, string];

class Quest {
    items: ItemType[];
    nickname: string;
    briefing: MessageContent;
    debriefing: MessageContent;
    newsLine: string;

    static createStory(): Quest[] {
        return [
            {
                items: [ItemType.Pipe, ItemType.Lighter, ItemType.Apple, ItemType.Clock, ItemType.Cat],
                nickname: "",
                briefing: [
                    "Good day, Artis@n! I have a great plan and I need",
                    "a powerful weapon to accomplish it.",
                    "Craft it quickly and quietly and I will buy it."],
                debriefing: [
                    "Looks strange, but I’ve heard about your craftstyle.",
                    "But if it's a fake, I will FIND YOU.",
                    "                                             Cheers."],
                newsLine: "A man with a {0} successfully robbed main bank of CyberGhoul."
            },
            {
                items: [ItemType.Sandwich, ItemType.Apple, ItemType.Cat],
                nickname: "",
                briefing: [
                    "Our agent was killed by a new {0}",
                    "weapon yesterday. We will pay for a prototype",
                    "of new vision upgrade."],
                debriefing: [
                    "Good job, agent Artis@n. We sent the device to",
                    "our R&D department for subsequent research.",
                    ""],
                newsLine: "Government has increased funding for vision upgrades research. *** Taxes were increased by 15%"
            },
            {
                items: [],
                nickname: "",
                briefing: [
                    "",
                    "",
                    ""],
                debriefing: [
                    "",
                    "",
                    ""],
                newsLine: ""
            },
            {
                items: [],
                nickname: "",
                briefing: [
                    "",
                    "",
                    ""],
                debriefing: [
                    "",
                    "",
                    ""],
                newsLine: ""
            },
            {
                items: [],
                nickname: "",
                briefing: [
                    "",
                    "",
                    ""],
                debriefing: [
                    "",
                    "",
                    ""],
                newsLine: ""
            },
            {
                items: [],
                nickname: "",
                briefing: [
                    "",
                    "",
                    ""],
                debriefing: [
                    "",
                    "",
                    ""],
                newsLine: ""
            },
            {
                items: [],
                nickname: "",
                briefing: [
                    "",
                    "",
                    ""],
                debriefing: [
                    "",
                    "",
                    ""],
                newsLine: ""
            },
        ];
    }
}

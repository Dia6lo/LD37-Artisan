type MessageContent = [string, string, string];

class Quest {
    items: ItemType[];
    face: string;
    nickname: string;
    briefing: MessageContent;
    debriefing: MessageContent;
    newsLine: string;

    static createStory(): Quest[] {
        return [
            {
                items: [ItemType.Pipe, ItemType.Lighter, ItemType.Apple, ItemType.Clock, ItemType.Cat],
                face: AssetBundle.boss,
                nickname: "Crazyvan",
                briefing: [
                    "Good day, Artis@n! I have a great plan and I need",
                    "a powerful weapon to accomplish it.",
                    "Craft it quickly and quietly and I will buy it."],
                debriefing: [
                    "Looks strange, but I’ve heard about your craftstyle.",
                    "But if it's a fake, I will FIND YOU.",
                    "                                             Cheers."],
                newsLine: "A man with a {0} robbed main bank of CyberGhoul last night. If you know any information about criminal - call police immediately."
            },
            {
                items: [ItemType.Pipe, ItemType.Lighter, ItemType.Glass, ItemType.Glass],
                face: AssetBundle.verySecretMan,
                nickname: "FBI",
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
                items: [ItemType.Sandwich, ItemType.Apple, ItemType.Cat, ItemType.Pen],
                face: AssetBundle.folk,
                nickname: "B1gM0ther",
                briefing: [
                    "I’ve heard that you can craft anything. I’ll give you",
                    "my last money for a new energy source.",
                    "P.S. Geez, new taxes are crazy!"],
                debriefing: [
                    "Thank goodness!",
                    "Big thanks, my family can now run away from city.",
                    ""],
                newsLine: "The number of CyberGhoul residents decreased by six today."
            },
            {
                items: [ItemType.Pipe, ItemType.Boot, ItemType.Car, ItemType.Pineapple],
                face: AssetBundle.secretMan,
                nickname: "Buggy",
                briefing: [
                    "Hello. Artis@n. My project’s deadline was yesterday,",
                    "so I outsource you developing of movement system for",
                    "brand new Cyberdog. Please, send it ASAP."],
                debriefing: [
                    "It works. Sometimes.",
                    "Usually, I don't have a time for finding bugs.",
                    "I appreciate your help."],
                newsLine: "New Cyberdogs will return escaped residents from dangerous wild to safety. *** Government decides to decrease taxes by 0.5% *** BREAKING NEWS: Cyberdogs have gone aggressive after release, avoid them at all costs!"
            },
            {
                items: [ItemType.Boot, ItemType.Car, ItemType.Clock, ItemType.Cat, ItemType.Glass],
                face: AssetBundle.western,
                nickname: "Santafe",
                briefing: [
                    "Good day, mister Artis@n! My employees fail deadlines",
                    "every time, so I want to replace them with AI systems.",
                    "Can your genius help me?"],
                debriefing: [
                    "Hmm. You didn't receive my five last calls. I thought",
                    "that you are dead. But I was wrong, sorry.",
                    ""],
                newsLine: "CyberSoft corporation has fired 90% of employees *** CyberSoft's share price has fell by 60% *** ATTENTION: City is not burning. Is is just a try-out of new fireworks. Please, stay inside your homes"
            },
            {
                items: [ItemType.Car, ItemType.Clock, ItemType.Cat, ItemType.Pen],
                face: AssetBundle.goverment,
                nickname: "BOSSHERE",
                briefing: [
                    "Artis@n? We have really big problems - people assault",
                    "the Government with {0}.",
                    "Only miracle can help us. Just DO something."],
                debriefing: [
                    "",
                    "",
                    ""],
                newsLine: "Situation is under control. Chemical leak has been fixed. If you feel an aggression attack - drink a lot of water. *** Please stay away from sharp objects."
            },
            {
                items: [],
                face: AssetBundle.hero,
                nickname: "Artis@n",
                briefing: [
                    "Good unending night, ghost. Can you leave the room?",
                    "Do you have a shadow? Guess what? We are both dead.",
                    "But I know a Genius that can craft a body for us ;)"],
                debriefing: [
                    "Good unending night, ghost. Can you leave the room?",
                    "Do you have a shadow? Guess what? We are both dead.",
                    "But I know a Genius that can craft a body for us ;)"],
                newsLine: ""
            }
        ];
    }
}

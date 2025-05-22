const quotes: any = [
  "The code works, now it's time to pray. 🙏",
  "A bug-free software is a software without users. 😅",
  "90% of programming is complaining about old code, the other 10% is writing code others will complain about. 🤣",
  "If debugging is the process of removing bugs, then programming must be the process of adding them! 🐞",
  "Fix one line of code, and ten new bugs appear. 🐛🐛🐛",
  "Programming is the only job where people call you when the system breaks! 🔧💻",
  "It's not the code's fault… it's the Internet! 🌐😅",
  "Debugging: 10 minutes of thinking, followed by 2 hours wondering why there's a bug. 🤯",
  "The IT wizard's spell: Must be the server! 🧙‍♂️💾",
  "Deadlines are really just friendly suggestions. 🤭",
  "Sometimes, when the code actually works, it's pure magic. ✨🧑‍💻",
  "Just because it runs once, doesn't mean it will run again. 🏃‍♂️",
  "When in doubt, just ask, 'Hey boss, can we restart the server?' 😜",
  "Want to see if there's a bug? Let the boss try running it. 👀",
  "If it's not fixed by code, it's definitely a hardware issue. 😂",
  "Can't find the bug? Just add more console logs! 👨‍💻",
  "If you think you've found all the bugs, double-check. 🐛",
  "Two types of programming deadlines: 'never gonna finish' and 'almost done.' 🕰️😆",
  "The more you fix, the worse it gets. 🤦‍♂️",
  "Adding people to a project doesn't speed it up; it just adds more bugs. 😂",
  "Most coding time is spent finding bugs in someone else's code. 👨‍💻",
  "Software development is a race against the bugs. 🏃‍♂️💻",
  "If the code doesn't work, go get some sleep. 🛌💻",
  "Optimizing code only happens when there's nothing left to do. 🤷‍♂️",
  "Programming: solving problems you didn't know you had in ways you don't understand. 🤔",
  "Coding is like riding a bike... except the bike is on fire and you're on fire and everything is on fire. 🚴🔥",
  "Real programmers don't document. If it was hard to write, it should be hard to understand! 📝",
  "You miss 100% of the bugs you don't test for. 🐞",
  "There are two hard things in computer science: cache invalidation, naming things, and off-by-one errors. 🤓",
  "'Works on my machine' is the programmer's national anthem. 🎶",
  "Writing code is like writing a book, except if you miss a single comma, the whole thing makes no sense. 📖",
];

const getRandomQuote = () => {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
};

export { getRandomQuote };

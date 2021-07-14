
import * as fs from "fs";

const main = async () => {

  const rawEventsFile = "./txEvents.json";

  interface RawEvent {
    topics: string[];
  }

  const rawEvents = JSON.parse(fs.readFileSync(rawEventsFile).toString()) as RawEvent[];

  console.log(`${rawEvents.length} events`)
  const rawAddresses: string[] = [];

  for (const event of rawEvents) {
    rawAddresses.push(event.topics[1])
    rawAddresses.push(event.topics[2])
  };

  const uniqueRawAddresses: string[] = rawAddresses.filter((e, index, self) => {
    return index === self.indexOf(e);
  });

  const cleanAddresses: string[] = uniqueRawAddresses.map(e => {
    return `0x${e.substr(e.length - 40, 40)}`;
  });

  fs.writeFileSync(`addresses.json`, JSON.stringify(cleanAddresses, null, 2));
}

main();
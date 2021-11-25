import { MessageEmbed } from "discord.js";

function empty() {
  return new MessageEmbed();
}

function error(text: string, title = "Error Detected!") {
    return empty()
      .setColor(`RED`)
      .setTitle(title)
      .setDescription(text)
      .setTimestamp();
}

export default {
  error, empty
};

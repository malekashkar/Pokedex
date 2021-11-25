import { Client, ClientOptions, Message } from "discord.js";
import dotenv from "dotenv";

import embeds from "./util/embeds";
import Stat from "./structures/Stat";
import Pokemon from "./structures/Pokemon";

import { toTitleCase } from "./util";
import { stripIndents } from "common-tags";
import { getPokemonImageUrl } from "./util/resources";

dotenv.config();

export default class Bot extends Client {
  prefix = "p.";

  constructor(options?: ClientOptions) {
    super({
        ...options,
        partials: ["MESSAGE"],
        intents: [
            "GUILDS",
            "GUILD_MESSAGES",
        ],
    });

    this.on("messageCreate", this.handleCommand);
  }

    async handleCommand(message: Message) {
        if (message.author?.bot) return;

        const prefixRegex = new RegExp(
            `^${this.prefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`,
            "i"
        );

        const content = message.content.replace(prefixRegex, "");
        let args = content.trim().replace(/ /g, "\n").split(/\n+/g);
        const command = args.shift().toLowerCase();

        // commandObj.aliases.map((x) => x.toLowerCase()).includes(command)
        if(command == "pokedex") {
            if (!args[0]) {
                await message.channel.send({
                    embeds: [embeds.error("What do I info? :face_with_raised_eyebrow:")]
                });
                return;
            }
        
            let shiny = false;
            if (/^shiny( )?/i.test(args.join(" "))) {
            shiny = true;
            args = args
                .join(" ")
                .replace(/^shiny( )?/, "")
                .split(" ");
            }
        
            const id = parseInt(args[0]);
            const pokemon = isNaN(id) ? Pokemon.get(args.join(" ")) : Pokemon.get(id);
        
            if (!pokemon || !pokemon.id) {
                await message.channel.send({
                    embeds: [embeds.error("No pokémon found with that name/pokedex number.")]
                });
                return;
            }
        
            const genderRate =
                pokemon.species.genderRate === -1
                ? "Genderless"
                : `${100 - pokemon.species.genderRate * 12.5}% Male, ${
                    pokemon.species.genderRate * 12.5
                    }% Female`,
            nextEvolution =
                pokemon.nextEvolutions && pokemon.nextEvolutions.length
                ? pokemon.nextEvolutions
                    .sort((a, b) => a - b)
                    .map((x) => Pokemon.get(x)?.name)
                    .join(", ")
                : pokemon.species.evolvesFromSpeciesId
                ? "Last Stage"
                : "No Evolution",
            prevEvolution = pokemon.species.evolvesFromSpeciesId
                ? Pokemon.get(pokemon.species.evolvesFromSpeciesId)?.name
                : "First Stage";
        
            const dex = embeds
            .empty()
            .setTitle(
                `#${"0".repeat(3 - pokemon.id.toString().length)}${pokemon.id} | ${
                pokemon.name
                }${shiny ? " ⭐" : ""} | Pokémon Info`
            )
            .setColor("BLUE")
            .addField(`Type`, pokemon.types.map((x) => x.name).join(", "), true)
            .addField(`Height`, `${pokemon.height / 10} m`, true)
            .addField(`Weight`, `${pokemon.weight / 10} kg`, true)
            .addField(`Prev Evolution`, prevEvolution, true)
            .addField(
                `Next Evolution${pokemon.nextEvolutions.length === 1 ? "" : "s"}`,
                nextEvolution,
                true
            )
            .addField(`Habitat`, toTitleCase(pokemon.species.habitat.name), true)
            .addField(`Gender Rate`, genderRate, true)
            .addField(`Genus`, pokemon.species.genus, true)
            .addField(`Generation`, pokemon.species.romanGenerationId, true)
            .addField(
                "Base Stats",
                stripIndents`
                **HP**: ${new Stat("hp").getBaseStatValue(pokemon.id)}
                **Attack**: ${new Stat("attack").getBaseStatValue(pokemon.id)}
                **Special Attack**: ${new Stat("special-attack").getBaseStatValue(
                    pokemon.id
                )}
                **Defense**: ${new Stat("defense").getBaseStatValue(pokemon.id)}
                **Special Defense**: ${new Stat("special-defense").getBaseStatValue(
                    pokemon.id
                )}
                **Speed**: ${new Stat("speed").getBaseStatValue(pokemon.id)}
                `,
                true
            )
            .addField(
                "Alternative Names",
                Array.from(new Set(pokemon.species.names.map((x) => x.name))).join(
                ", "
                ),
                true
            )
            .setImage(getPokemonImageUrl(pokemon.id, shiny))
            .setColor(pokemon.colorCode);
            await message.channel.send({
                embeds: [dex]
            });
        }
    }
}

new Bot().login(process.env.TOKEN);
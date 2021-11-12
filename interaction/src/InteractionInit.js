const { BaseJob, Util, App } = require("dio.js");

class InteractionInit extends BaseJob {
    async handle(client) {
        this.check();
        const interactions = this.interactionNeed();

        const guilds = await client.guilds.fetch();

        guilds.forEach(async (guild) => {
            const options = App.config.discord.interactions.filter((i) => i.id === guild.id)[0];
            guild = await client.guilds.fetch(guild.id);
            this.remove(interactions, guild, options);
            this.create(interactions, guild, options);
        });
    }

    check() {}

    interactionNeed() {
        const listenerInteraction = Util.defaultRequire(Util.getFiles("App/Listeners", ["Interaction"]))[0];
        if (listenerInteraction.all) return Util.getFilenames("App/Jobs/Interaction");
        const jobInteractions = Util.getFilenames("App/Jobs/Interaction");
        const viewInteractions = Util.getFilenames("App/Interaction");
        const need = jobInteractions.filter((i) => viewInteractions.includes(i));
        return need.filter((i) => listenerInteraction.actions.includes(i));
    }

    async remove(interactions, guild, options) {
        const commands = (await guild.commands.fetch()).map((g) => g.name);
        console.log(commands);
    }

    create() {}

    rename(value) {
        return value.name[0].toLowerCase() + value.name.slice(1);
    }
}

exports.InteractionInit = InteractionInit;

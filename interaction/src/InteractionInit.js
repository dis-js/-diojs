const { BaseJob, Util, App } = require("dio.js");

class InteractionInit extends BaseJob {
    async handle(client) {
        this.check();

        const viewInteractions = Util.getFilenames("App/Interaction");
        const interactions = this.interactionNeed();

        const guilds = await client.guilds.fetch();

        guilds.forEach(async (guild) => {
            const options = App.config.discord.interactions.filter((i) => i.id === guild.id)[0];
            guild = await client.guilds.fetch(guild.id);
            this.remove(viewInteractions, guild, options);
            this.create(interactions, guild, options);
        });

        console.log("[INTERACTION] - Interaction refreshed");
    }

    check() {}

    interactionNeed() {
        const listenerInteraction = Util.defaultRequire(Util.getFiles("App/Listeners", ["Interaction"]))[0];
        if (listenerInteraction.all) return Util.getFilenames("App/Jobs/Interaction");
        const jobInteractions = Util.getFilenames("App/Jobs/Interaction");
        const viewInteractions = Util.getFiles("App/Interaction").map((i) => require(i));
        const need = viewInteractions.filter((i) => jobInteractions.includes(this.rename(i)));
        return need.filter((i) => listenerInteraction.actions.includes(this.rename(i)));
    }

    async remove(viewInteractions, guild, options) {
        const commands = (await guild.commands.fetch()).map((g) => g);
        if (options.all)
            commands.filter((c) => !viewInteractions.includes(this.rename(c))).forEach(async (c) => await guild.commands.delete(c));
        else commands.filter((c) => !options.whitelist.includes(this.rename(c))).forEach(async (c) => await guild.commands.delete(c));
    }

    async create(interactions, guild, options) {
        if (options.all) interactions.forEach(async (i) => await guild.commands.create(i));
        else interactions.filter((i) => options.whitelist.includes(this.rename(i))).forEach(async (i) => await guild.commands.create(i));
    }

    rename(value) {
        return value.name[0].toUpperCase() + value.name.slice(1);
    }
}

exports.InteractionInit = InteractionInit;

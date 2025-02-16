
module.exports = class LastMessageTimePlugin {
  constructor() {
    this.name = "LastMessageTimePlugin";
    this.description = "show last message's hour from user";
  }

  start() {
    console.log("LastTimeUserMessage started");
    this.patchUserProfile();
  }

  stop() {
    console.log("LastTimeUserMessage stopped");
    this.unpatchUserProfile();
  }

  patchUserProfile() {
    const originalRender = DiscordNative.userProfile.render;
    DiscordNative.userProfile.render = async function(...args) {
      const userId = args[0];
      const lastMessageTime = await this.getLastMessageTime(userId);

      const profileElement = originalRender.apply(this, args);
      if (lastMessageTime) {
        const timeElement = document.createElement('div');
        timeElement.innerText = `latest message at ${lastMessageTime}`;
        profileElement.appendChild(timeElement);
      }
      return profileElement;
    };
  }

  /*unpatchUserProfile() {
  }*/

  async getLastMessageTime(userId) {
    try {
      const userToken = DiscordNative.getToken();

      // get all servers
      const guildsResponse = await fetch('https://discord.com/api/v9/users/@me/guilds', {
        headers: {
          Authorization: userToken,
        },
      });

      const guilds = await guildsResponse.json();
      let lastMessageTime = null;

      // search for user
      for (const guild of guilds) {
        const response = await fetch(`https://discord.com/api/v9/guilds/`${{guild.id}/messages/search?author_id=}$`{userId}`, {
          headers: {
            Authorization: userToken,
          },
        });

        const data = await response.json();
        if (data.messages && data.messages.length > 0) {
          const lastMessage = data.messages[0];
          const messageTime = new Date(lastMessage.timestamp);
          if (!lastMessageTime || messageTime > lastMessageTime) {
            lastMessageTime = messageTime;
          }
        }
      }

      return lastMessageTime ? lastMessageTime.toLocaleTimeString() : null;
    } catch (error) {
      console.error("Error:", error);
    }
    return null;
  }
};

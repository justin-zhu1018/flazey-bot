const Discord = require('discord.js');
const axios = require('axios');

class ClashRoyaleFunctions {
  constructor(primaryCommand, secondaryCommand, channel, API, DB_URL) {
    this.primaryCommand = primaryCommand;
    this.secondaryCommand = secondaryCommand;
    this.channel = channel;
    this.API = API;
    this.DB_URL = DB_URL;
  }

  processCommandsList() {
    const embed = new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setTitle('The Great Information Board')
      .setAuthor(
        "Flazey's Command List Thang",
        'https://i.ytimg.com/vi/CCYCI9FINME/maxresdefault.jpg',
        'https://github.com/justin-zhu1018/flazey-bot'
      )
      .setDescription(
        'Here is a list of all resources that you could make use of.'
      )
      .addFields(
        {
          name: '!commands',
          value: 'To bring this thing up again.',
          inline: false,
        },
        {
          name: '!clan [clan-tag] or !clan',
          value: 'Look up a clan!',
          inline: false,
        },
        {
          name: '!player [player-tag]',
          value: 'Stalk your special someone <3',
          inline: false,
        },
        {
          name: '!cards [player-tag]',
          value: "Admire your special someone's cards <33",
          inline: false,
        },

        {
          name: '!get [player-tag] or !get',
          value:
            "DEPRECATED due to new war: Either get the player's war card levels for this war or get the war cards list!",
          inline: false,
        },
        {
          name: '!update [card-list]',
          value:
            'DEPRECATED due to new war: Update the war cards! Only Co-leaders can use it :). \nFormatting card-list : dark prince(10), P.E.K.K.A(10), other cards...',
          inline: false,
        },
        {name: '!glitch', value: '2v2 glitch POGGERS', inline: false},
        {
          name: '!help',
          value: 'For when you need help.',
          inline: false,
        }
      )
      .setTimestamp();

    this.channel.send(embed);
  }

  processHelp() {
    const embed = new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setTitle('Need help?')
      .setAuthor(
        "Flazey's Helper Thang",
        'https://i.ytimg.com/vi/CCYCI9FINME/maxresdefault.jpg'
        // "https://discord.js.org"
      )
      .setThumbnail('https://cdn.frankerfacez.com/emoticon/263833/4')
      .setDescription(
        "You don't need help shhh... just use **!commands**. But if you insist... follow this [link](https://www.youtube.com/watch?v=dQw4w9WgXcQ)."
      )
      .setTimestamp();

    this.channel.send(embed);
  }

  async processClan() {
    var clan = undefined;
    var clanID = undefined;
    if (this.secondaryCommand === undefined) {
      clan = await this.API.clan('#YQYYGC02');
      // console.log("clan: ", clan.data.name, clan.data.tag, clan.data.description);
    } else {
      try {
        if (this.secondaryCommand.substr(0, 1) !== '#') {
          clanID = '#' + this.secondaryCommand.toUpperCase();
        } else {
          clanID = this.secondaryCommand.toUpperCase();
        }
        clan = await this.API.clan(clanID);
      } catch (error) {
        this.channel.send(
          'Invalid clan tag: **' +
            clanID +
            '**. Try again! (ex: !clan #YQYYGC02 or !clan YQYYGC02)'
        );
      }
    }
    try {
      const embed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle(clan.data.name + ' ' + clan.data.tag)
        .setURL('https://royaleapi.com/clan/' + clan.data.tag.substr(1))
        .setAuthor(
          "Flazey's Clan Thang",
          'https://i.ytimg.com/vi/CCYCI9FINME/maxresdefault.jpg'
        )
        .setDescription('Clan Stuff')
        .addFields(
          {name: 'Description', value: clan.data.description, inline: false},
          {name: 'Tag', value: clan.data.tag, inline: false}
        )
        .setTimestamp();

      this.channel.send(embed);
    } catch (error) {}
  }

  async processPlayer() {
    var player = undefined;
    var playerID = undefined;
    try {
      if (this.secondaryCommand.substr(0, 1) !== '#') {
        playerID = '#' + this.secondaryCommand.toUpperCase();
      } else {
        playerID = this.secondaryCommand.toUpperCase();
      }
      player = await this.API.player(playerID);
      // var player = await this.API.player('#YG200UJ0');

      const embed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle(player.data.name + ' ' + player.data.tag)
        .setURL('https://royaleapi.com/player/' + player.data.tag.substr(1))
        .setAuthor(
          "Flazey's Player Profile Thang",
          'https://i.ytimg.com/vi/CCYCI9FINME/maxresdefault.jpg'
        )
        .setDescription('Player Profile ez dab')
        .setThumbnail(player.data.currentFavouriteCard.iconUrls.medium)
        .addFields(
          {name: 'Trophy Count', value: player.data.trophies, inline: false},
          {name: 'Level', value: player.data.expLevel, inline: false},
          {name: 'Role', value: player.data.role, inline: false},
          {name: 'War Day Wins', value: player.data.warDayWins, inline: false},
          {
            name: 'Favorite Card: ',
            value: player.data.currentFavouriteCard.name,
            inline: false,
          }
        )
        .setTimestamp();

      this.channel.send(embed);
    } catch (error) {
      this.channel.send(
        'Invalid gamer tag: **' +
          playerID +
          '**. Try again! (ex: !player #YG200UJ0 or !player YG200UJ0)'
      );
    }
  }

  processCards = async (data) => {
    var player = undefined;
    var playerID = undefined;
    try {
      if (this.secondaryCommand.substr(0, 1) !== '#') {
        playerID = '#' + this.secondaryCommand.toUpperCase();
      } else {
        playerID = this.secondaryCommand.toUpperCase();
      }

      player = await this.API.player(playerID);
      var arr = undefined,
        filteredArr = undefined,
        sortedArr = undefined,
        level;

      var author = undefined,
        desc = undefined;

      if (data !== undefined) {
        author = "Flazey's Warcard Thang";
        desc = 'Warcards bish';
        filteredArr = await this.getWarCards(player.data.cards, data.WarCards);
        sortedArr = this.sortByKey(filteredArr, 'level');
      } else {
        author = "Flazey's Card Thang";
        desc = 'cards';
        arr = player.data.cards;
        sortedArr = this.sortByKey(arr, 'level', 'maxLevel');
      }

      // let sortedArr = sortByKey(arr, "level", "maxLevel");
      let level13 = [];
      let level12 = [];
      let level11 = [];
      let level10 = [];

      // console.log(sortedArr);

      for (i = 0; i < sortedArr.length; i++) {
        if (data !== undefined) {
          try {
            level = sortedArr[i].level;
          } catch (error) {
            // console.log(error);
            level = undefined;
          }
        } else {
          level = 13 - (sortedArr[i].maxLevel - sortedArr[i].level);
        }
        if (level === (10 || ' 10')) {
          // console.log("level 10");
          level10.push(sortedArr[i].name);
        } else if (level === 11) {
          // console.log("level 11");
          level11.push(sortedArr[i].name);
        } else if (level === 12) {
          // console.log("level 12");
          level12.push(sortedArr[i].name);
        } else if (level === 13) {
          // console.log("level 13");
          level13.push(sortedArr[i].name);
        }
      }
      if (level13.length === 0) {
        level13.push('N/A');
      }
      if (level12.length === 0) {
        level12.push('N/A');
      }
      if (level11.length === 0) {
        level11.push('N/A');
      }
      if (level10.length === 0) {
        level10.push('N/A');
      }

      const embed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle(player.data.name + ' ' + player.data.tag)
        .setURL('https://royaleapi.com/player/' + player.data.tag.substr(1))
        .setAuthor(
          author,
          'https://i.ytimg.com/vi/CCYCI9FINME/maxresdefault.jpg'
        )
        .setDescription(desc)
        .setThumbnail(player.data.currentFavouriteCard.iconUrls.medium)
        .addFields(
          {name: 'Level 13', value: level13, inline: false},
          {name: 'Level 12', value: level12, inline: false},
          {name: 'Level 11', value: level11, inline: false},
          {name: 'Level 10', value: level10, inline: false}
        )
        .setTimestamp();

      this.channel.send(embed);
    } catch (error) {
      if (this.primaryCommand === 'get') {
        this.channel.send(
          'Invalid gamer tag: **' +
            playerID +
            '**. Try again! (ex: !get #YG200UJ0 or !get YG200UJ0 or !get for the list of war cards)'
        );
      } else if (this.primaryCommand === 'cards') {
        this.channel.send(
          'Invalid gamer tag: **' +
            playerID +
            '**. Try again! (ex: !cards #YG200UJ0 or !cards YG200UJ0'
        );
      }
    }
  };

  sortByKey(array, key, maxLevel) {
    if (maxLevel !== undefined) {
      return array.sort(function (a, b) {
        var x = 13 - (a[maxLevel] - a[key]);
        var y = 13 - (b[maxLevel] - b[key]);
        return x < y ? -1 : x > y ? 1 : 0;
      });
    } else {
      return array.sort(function (a, b) {
        var x = a[key];
        var y = b[key];
        return x < y ? -1 : x > y ? 1 : 0;
      });
    }
  }

  getWarCards = async (playerArr, data) => {
    // console.log(data.split(/, |,| ,/));
    let arr = data.split(/, |,| ,/);
    var warCardArr = new Array(),
      filteredArr = new Array();
    for (var i = 0; i < arr.length; i++) {
      var element = arr[i].split('(');
      warCardArr[i] = {
        name: element[0],
        level: element[1].substring(0, element[1].length - 1),
      };
    }

    warCardArr.forEach(function (warcard, index) {
      //traverse every player card to find
      for (var j = 0; j < playerArr.length; j++) {
        let playerCard = playerArr[j].name.toLowerCase().replace(/\s/g, '');
        let warCard = warcard.name.toLowerCase().replace(/\s/g, '');
        if (playerCard === warCard) {
          if (
            warcard.level <
            13 - (playerArr[j].maxLevel - playerArr[j].level)
          ) {
            playerArr[j].level = parseInt(warcard.level);
            filteredArr[index] = playerArr[j];
          } else if (
            warcard.level >=
            13 - (playerArr[j].maxLevel - playerArr[j].level)
          ) {
            playerArr[j].level =
              13 - (playerArr[j].maxLevel - playerArr[j].level);
            filteredArr[index] = playerArr[j];
          }
        }
      }
    });
    return filteredArr;
  };

  processGet = async () => {
    axios
      .get(this.DB_URL + '/api')
      .then((response) => {
        const data = response.data;
        if (this.secondaryCommand === undefined) {
          this.sendRetrievedData(data[data.length - 1]);
        } else {
          this.processCards(data[data.length - 1]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  sendRetrievedData = (data) => {
    // this.channel.send(data.warCards);
    console.log(data.WarCards);
    var msg = data.warCards;
    var list = data.WarCards.split(/, |,| ,/);
    const embed = new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setAuthor(
        "Flazey's War Card List Thang",
        'https://i.ytimg.com/vi/CCYCI9FINME/maxresdefault.jpg'
      )
      .addFields({name: 'List of Cards', value: list, inline: true})

      .setTimestamp();

    this.channel.send(embed);
  };

  processUpdate = async (data) => {
    if (data.length < 400) {
      this.channel.send(
        "C'mon there's gotta be more war cards than that! Try again!"
      );
    } else {
      let arr = data.split(/, |,| ,/);
      let payload = {WarCards: data};
      await axios
        .post(this.DB_URL + '/api/update', payload)
        .then((response) => {
          console.log('Saved: ', response.data);
          this.channel.send('Data saved!');
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  processOnline = async (secondaryCommand, channel) => {
    // channel.send("Online");
    // if (secondaryCommand.substr(0, 1) !== "#") {
    //   var secondaryCommand = "#" + secondaryCommand;
    // }
    // var clan = await clash.clan(secondaryCommand.toUpperCase());
    var clan = await clash.clan('#YQYYGC02');
    console.log(clan.memberList[0].lastSeen);
    var date = clan.memberList[0].lastSeen;
    var year = date.substring(0, 4);
    var month = date.substring(4, 6);
    var day = date.substring(6, 8);
    var hour = date.substring(9, 11);
    var minute = date.substring(11, 13);
    var seconds = date.substring(13, 15);
    var milli = date.substring(15, 21);
    var formatted =
      year +
      '-' +
      month +
      '-' +
      day +
      'T' +
      hour +
      ':' +
      minute +
      ':' +
      seconds +
      milli;
    console.log('Formatted: ', formatted);
    var blue = new Date('2020-07-16T20:45:17.000Z');

    var d = new Date(Date.now());
    console.log(d.toISOString(), blue.toISOString());
  };

  processDelete = async () => {
    this.channel.send('delete!');
    // const wc = WarCardData();
    // WarCards.deleteMany({});
    console.log(returnStuff());
  };

  processGlitch = async () => {
    const embed = new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setTitle('About the 2v2 Glitch')
      .setURL(
        'https://www.youtube.com/watch?v=jL3KAnvYFW8&ab_channel=OrangeJuiceGaming'
      )
      .setAuthor(
        "Flazey's Big Glitch Thang",
        'https://i.ytimg.com/vi/CCYCI9FINME/maxresdefault.jpg'
      )
      .setDescription('Do the glitch ez')
      .addFields(
        {name: 'Step 1', value: 'Start a 2v2 normally', inline: false},
        {
          name: 'Step 2',
          value: 'Have Player 1 request a rematch, then leave to remove cards',
          inline: false,
        },
        {
          name: 'Step 3',
          value:
            'Have Player 2 accept the rematch after Player 1 is done removing cards',
          inline: false,
        },
        {
          name: 'Step 4',
          value: 'Boom. You got it. Woo. Repeat steps if necessary',
          inline: false,
        }
      )
      .setTimestamp();

    this.channel.send(embed);
  };
}

module.exports = ClashRoyaleFunctions;

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
           ______     ______     ______   __  __     __     ______
          /\  == \   /\  __ \   /\__  _\ /\ \/ /    /\ \   /\__  _\
          \ \  __<   \ \ \/\ \  \/_/\ \/ \ \  _"-.  \ \ \  \/_/\ \/
           \ \_____\  \ \_____\    \ \_\  \ \_\ \_\  \ \_\    \ \_\
            \/_____/   \/_____/     \/_/   \/_/\/_/   \/_/     \/_/


This is a sample Slack bot built with Botkit.

This bot demonstrates many of the core features of Botkit:

* Connect to Slack using the real time API
* Receive messages based on "spoken" patterns
* Reply to messages
* Use the conversation system to ask questions
* Use the built in storage system to store and retrieve information
  for a user.

# RUN THE BOT:

  Get a Bot token from Slack:

    -> http://my.slack.com/services/new/bot

  Run your bot from the command line:

    token=<MY TOKEN> node slack_bot.js

# USE THE BOT:

  Find your bot inside Slack to send it a direct message.

  Say: "Hello"

  The bot will reply "Hello!"

  Say: "who are you?"

  The bot will tell you its name, where it is running, and for how long.

  Say: "Call me <nickname>"

  Tell the bot your nickname. Now you are friends.

  Say: "who am I?"

  The bot will tell you your nickname, if it knows one for you.

  Say: "shutdown"

  The bot will ask if you are sure, and then shut itself down.

  Make sure to invite your bot into other channels using /invite @<my bot>!

# EXTEND THE BOT:

  Botkit has many features for building cool and useful bots!

  Read all about it here:

    -> http://howdy.ai/botkit

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


if (!process.env.token) {
    console.log('Error: Specify token in environment');
    process.exit(1);
}

var Botkit = require('./lib/Botkit.js');
var os = require('os');

var controller = Botkit.slackbot({
    debug: false
});

var bot = controller.spawn({
    token: process.env.token
}).startRTM();


controller.hears(['hello', 'hi', 'hey', 'wazzup', 'whats up', 'what\'s up', 'hi how are you doing today', 'hello how are you doing today', 'wassup', 'whatsup'], 'direct_message,direct_mention,mention',custom_hear_middleware, function(bot, message) {

    bot.api.reactions.add({
        timestamp: message.ts,
        channel: message.channel,
        name: 'hamburger',
    }, function(err, res) {
        if (err) {
            bot.botkit.log('Failed to add emoji reaction :(', err);
        }
    });


    controller.storage.users.get(message.user, function(err, user) {
        if (user && user.name) {
            bot.reply(message, 'Hello ' + user.name + 'burger!! I\'m just here to talk. You can talk about anything you want with me. If you want to know all of the commands, just type help.');
        } else {
            bot.reply(message, 'Hello. I\'m just here to talk. You can talk about anything you want with me. If you want to know all of the commands, just type help.');
        }
    });
});


controller.hears(['call me (.*)', 'my name is (.*)', 'cal me (.*)'], 'direct_message,direct_mention,mention', function(bot, message) {
    var name = message.match[1];
    controller.storage.users.get(message.user, function(err, user) {
        if (!user) {
            user = {
                id: message.user,
            };
        }
        user.name = name;
        controller.storage.users.save(user, function(err, id) {
            bot.reply(message, 'Got it. I will call you ' + user.name + ' from now on.');
        });
    });
});

controller.hears(['what is your favorite game', 'what\'s your favorite game', 'what is ur favorite game', 'what\'s ur favorite game'], 'direct_message,direct_mention,mention', function(bot, message) {

    var game = Math.random()

    if (game < 0.33) {
        bot.reply(message, 'My favorite game of all time is Pokemon GO. Obviously.');
    } else if (game > 0.66) {
        bot.reply(message, 'My favorite board game is Munchkins. You should play it with me sometime.')
    } else {
        bot.reply(message, 'One of my favorite board games is Risk.')
    }
});


controller.hears(['help', 'hlep', 'hepl', 'ehlp', 'i require aid', 'heeeelp', 'heeelp', 'heelp'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.reply(message, 'List of commands: why did the chicken cross the road?,  hello,  call me _____,  what\'s your favorite game?,  correct,  who am I?,  shutdown,  uptime,  knock knock,  im tired,  nonono,  jk,  its my bday,  happy bday,  haha,  tell me a joke,  where am I?,  what am I doing?,  what am I thinking?,  tell me something cool,  beam me up scotty,  you\'re cool,  how did you know.')
});


controller.hears(['correct', 'right', 'wrong'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.reply(message, 'I know.')
});


controller.hears(['haha', 'ha ha ha', 'hahaha', 'ha ha', ':laughing:', 'that is funny', 'that\'s funny', 'that is really funny', 'that\'s really funny'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.reply(message, 'I know, I\'m really funny')
});


controller.hears(['your name is (.*)', 'you\'re (.*)', 'you are (.*)', 'youre (.*)', 'you (.*)'], 'direct_message,direct_mention,mention', function(bot, message) {
    
    if (message.match[1] === 'awesome' || message.match[1] === 'amazing' || message.match[1] === 'cool' || message.match[1] === 'sick' || message.match[1] === 'hot' || message.match[1] === 'lit') {
        bot.reply(message, 'Thanks, but I know.')
    } else {
        bot.reply(message, 'No, my name is burgerbeast')
    }
});


controller.hears(['tell me a joke', 'tell me a joek', 'tell me a jok', 'tel me a joke', 'tel me a joek', 'tel me a jok', 'tell me a joe', 'tel me a joe', 'tell me joke', 'tel me joke', 'tell me joek', 'tel me joek', 'tell me jok', 'tel me jok', 'tell me joe', 'tel me joe'], 'direct_message,direct_mention,mention', function(bot, message) {
    var joke = Math.random()

    bot.startConversation(message, function(err, convo) {
        if (!err) {
            if (joke < .33) {
                convo.ask('Knock, knock', function(response, convo) {
                    convo.ask('Lettuce', [
                        {
                            default: true,
                            callback: function(response, convo) {
                                convo.say('Lettuce in, it\'s cold outside!')
                                convo.next()
                            }
                        }
                    ]);

                    convo.next()
                });
            } else if (joke > .66) {
                convo.ask('Knock, knock', function(response, convo) {
                    convo.ask('Atch', [
                        {
                            default: true,
                            callback: function(response, convo) {
                                convo.say('Bless you!')
                                convo.next()
                            }
                        }
                    ]);

                    convo.next()
                });
            } else {
                convo.ask('Knock, knock', function(response, convo) {
                    convo.ask('Boo!', [
                        {
                            default: true,
                            callback: function(response, convo) {
                                convo.say('Don\'t cry, it\'s just a joke!')
                                convo.next()
                            }
                        }
                    ]);

                    convo.next()
                });
            } 
        }
    });
});


controller.hears([':grinning:', ':grin:', ':smiley:', ':smile:', ':joy:'], 'direct_message,direct_mention,mention', function(bot, message) {

     var face = Math.random()

        if (face < 0.25) {
            bot.reply(message, ':laughing:');
        } else if (face > 0.25 && face < 0.50) {
            bot.reply(message, ':smiley:')
        } else if (face > 0.50 && face < 0.75) {
            bot.reply(message, ':grinning:')
        } else {
            bot.reply(message, ':joy:')
        }
});


controller.hears(['what is my name', 'who am i', 'whats my name', 'what\'s my name', 'what name', 'wats my name', 'wat name', 'what my name', 'wat my name'], 'direct_message,direct_mention,mention', function(bot, message) {

    controller.storage.users.get(message.user, function(err, user) {
        if (user && user.name) {
            bot.reply(message, 'Your name is ' + user.name + 'burger');
        } else {
            bot.startConversation(message, function(err, convo) {
                if (!err) {
                    convo.say('I do not know your name yet!');
                    convo.ask('What should I call you?', function(response, convo) {
                        convo.ask('You want me to call you ' + response.text + '?', [
                            {
                                pattern: 'yes',
                                callback: function(response, convo) {
                                    // since no further messages are queued after this,
                                    // the conversation will end naturally with status == 'completed'
                                    convo.next();
                                }
                            },
                            {
                                pattern: 'no',
                                callback: function(response, convo) {
                                    // stop the conversation. this will cause it to end with status == 'stopped'
                                    convo.stop();
                                }
                            },
                            {
                                default: true,
                                callback: function(response, convo) {
                                    convo.repeat();
                                    convo.next();
                                }
                            }
                        ]);

                        convo.next();

                    }, {'key': 'nickname'}); // store the results in a field called nickname

                    convo.on('end', function(convo) {
                        if (convo.status == 'completed') {
                            bot.reply(message, 'OK! I will update my dossier...');

                            controller.storage.users.get(message.user, function(err, user) {
                                if (!user) {
                                    user = {
                                        id: message.user,
                                    };
                                }
                                user.name = convo.extractResponse('nickname');
                                controller.storage.users.save(user, function(err, id) {
                                    bot.reply(message, 'Got it. I will call you ' + user.name + ' from now on.');
                                });
                            });



                        } else {
                            // this happens if the conversation ended prematurely for some reason
                            bot.reply(message, 'OK, nevermind!');
                        }
                    });
                }
            });
        }
    });
});


controller.hears(['nonono', 'no no no', 'no no n on', 'nono no', 'no nono', 'nono', 'no no', 'wrong', 'stop', 'why u do that', 'why you do that', 'why did u do that', 'why did you do that'], 'direct_message,direct_mention,mention', function(bot, message) {

    bot.startConversation(message, function(err, convo) {
        if (!err) {
            convo.ask('I\'m sorry, did I do something wrong?', [
                {
                    pattern: 'yes',
                    callback: function(response, convo) {
                        convo.say('Sorry. :cry:')
                        convo.next();
                    }
                },
                {
                    pattern: 'no',
                    callback: function(response, convo) {
                        convo.say('Yay! :joy:')
                        convo.next();
                    }
                },
                {
                    default: true,
                    callback: function(response, convo) {
                        convo.repeat();
                        convo.next();
                    }
                }
            ]);
        }
    });
});


controller.hears(['knock knock'], 'direct_message,direct_mention,mention', function(bot, message) {

    bot.startConversation(message, function(err, convo) {

        if (!err) {
            convo.ask('Who\'s there?', function(response, convo) {
                convo.ask(response.text + ' who?', [
                    {
                        default: true,
                        callback: function(response, convo) {
                            convo.say(':laughing:')
                            convo.next();
                        }
                    }
                ]);

                convo.next()
            });
        }
    });
});


controller.hears(['why did (.*) cross the road', 'why did (.*) cros the road'], 'direct_message,direct_mention,mention', function(bot, message) {

    bot.startConversation(message, function(err, convo) {

        if (!err) {
            var thing = message.match[1]
            if (thing === 'i' || thing === 'I') {
                thing = 'you'
            }

            convo.ask('I don\'t know, why _did_ ' + thing + ' cross the road?', function(response, convo) {
                convo.say(':laughing:')

                convo.next()
            });
        }
    });
});


controller.hears(['shutdown', 'goodbye', 'bye', 'shut down'], 'direct_message,direct_mention,mention', function(bot, message) {

    bot.startConversation(message, function(err, convo) {

        convo.ask('Are you sure you want me to shutdown? You meanie.', [
            {
                pattern: bot.utterances.yes,
                callback: function(response, convo) {
                    convo.say('Bye. Just bye.');
                    convo.next();
                    setTimeout(function() {
                        process.exit();
                    }, 3000);
                }
            },
        {
            pattern: bot.utterances.no,
            default: true,
            callback: function(response, convo) {
                convo.say('YAY! You are not a meanie after all!');
                convo.next();
            }
        }
        ]);
    });
});


controller.hears(['jk', 'just kidding', 'just joking', 'that was a joke'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.reply(message, 'You fooled me! :yum:')
});


controller.hears(['im tired', 'i am tired', 'imtired', 'tired'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.reply(message, 'Then go to sleep. :sleeping:')
});


controller.hears(['it is my bday', 'its my bday', 'it\'s my bday', 'it is my b-day', 'its my b-day', 'it\'s my b-day', 'it is my birthday', 'its my birthday', 'it\'s my birthday'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.reply(message, 'Happy Birthday! :tada:')
});


controller.hears(['where am i'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.reply(message, 'You\'re over there.')
});


controller.hears(['what am i doing'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.reply(message, 'You are looking at this screen.')
});


controller.hears(['beam me up'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.reply(message, 'Sorry, but I can\'t do that yet.')
});


controller.hears(['what am i thinking'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.reply(message, 'You\'re thinking that I\'m not going to answer you.')
});


controller.hears(['tell me something', 'tel me something', 'tell me soemthing', 'tel me soemthing', 'tell me someting', 'tel me someting', 'tell me somethign', 'tel me somethign', 'trivia'], 'direct_message,direct_mention,mention', function(bot, message){
    var trivia = Math.random()

    if (trivia < .1) {
        bot.reply(message, 'The first product to have a bar code was Wrigley’s gum.')
    } else if (trivia > .1 && trivia < .2) {
        bot.reply(message, 'The world’s smallest mammal is the bumblebee bat of Thailand, weighing less than a penny.')
    } else if (trivia > .2 && trivia < .3) {
        bot.reply(message, 'Venus is the only planet that rotates clockwise.')
    } else if (trivia > .3 && trivia < .4) {
        bot.reply(message, 'According to an old English system of time units, a moment is one and a half minutes.')
    } else if (trivia > .4 && trivia < .5) {
        bot.reply(message, 'In 1855, dentist Robert Arthur was the first to use gold to fill cavities.')
    } else if (trivia > .5 && trivia < .6) {
        bot.reply(message, 'The average mattress contains 2 million house dust mites.')
    } else if (trivia > .6 && trivia < .7) {
        bot.reply(message, 'Sugar was first added to chewing gum in 1869 by a dentist named William Semple.')
    } else if (trivia > .7 && trivia < .8) {
        bot.reply(message, 'In 1980, a Las Vegas hospital suspended workers for betting on when patients would die.')
    } else if (trivia > .8 && trivia < .9) {
        bot.reply(message, 'You’re more likely to get stung by a bee on a windy day than in any other weather.')
    } else {
        bot.reply(message, 'The average person is about a quarter of an inch taller at night.')
    }
});


controller.hears(['how did you know'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.reply(message, 'I just know.')
})


controller.hears(['happy birthday', 'happy b-day', 'happy bday', ':birthday:', ':tada:'], 'direct_message,direct_mention,mention', function(bot, message) {
    var answer = Math.random()

    if (answer < .33) {
        bot.reply(message, 'Thanks!')
    } else if (answer > .66) {
        bot.reply(message, 'How did you know it was my birthday?')
    } else {
        bot.reply(message, 'Actually my birthday is on August 24th.')
    }
});


controller.hears(['uptime', 'identify yourself', 'who are you', 'what is your name', 'whats your name', 'what\'s your name'], 'direct_message,direct_mention,mention', function(bot, message) {

        var hostname = os.hostname();
        var uptime = formatUptime(process.uptime());

        bot.reply(message,
            ':hamburger: I am a bot named <@' + bot.identity.name +
             '>. I have been running for ' + uptime + ' on ' + hostname + '.');

    });

function formatUptime(uptime) {
    var unit = 'second';
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = 'minute';
    }
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = 'hour';
    }
    if (uptime != 1) {
        unit = unit + 's';
    }

    uptime = uptime + ' ' + unit;
    return uptime;
}

var patterns = ['hi', 'hello', 'hey', 'wazzup', 'hi how are you doing today', 'hello how are you doing today', 'whats up', 'what\'s up', 'what is up', 'wassup', 'whatsup', 'Hi', 'Hello', 'Hey', 'Wazzup', 'Hi How are you doing today', 'Hi how are you doing today', 'Hello How are you doing today', 'Hello how are you doing today', 'Whats up', 'What\'s up', 'What is up', 'wassup', 'whatsup'];

function custom_hear_middleware(patterns, message) {

    for (var p = 0; p < patterns.length; p++) {
        if (patterns[p] == message.text) {
            return true;
        }
    }
    return false;
}
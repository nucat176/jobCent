JobBot
This bot will be used to periodically send messages to the JobBot Telegram room

Setup
Create a secret.env file that looks like this:

TOKEN=ISSUED_BOT_TOKEN
CHAT_ID=CHAT_ID
Run
sh dockerExec.sh
Stop
docker rm -f messageBotContainer
Logs
docker logs messageBotContainer
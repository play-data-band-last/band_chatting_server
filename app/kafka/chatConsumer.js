const { Kafka } = require('kafkajs');
const Chatting = require("../controllers/chatting.controller");

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092']
})

const consumer = kafka.consumer({ groupId: 'user' })

const initKafka = async () => {
  console.log('start subscribe')
  await consumer.connect()
  await consumer.subscribe({ topic: 'chattingUpdate', fromBeginning: true })
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const value = JSON.parse(message.value);
        await Chatting.updateMemberInfo({
          body: {
            memberId: value.memberId,
            memberName: value.memberName,
            memberImage: value.memberImage
          }
        });
      } catch (error) {
        console.error(error);
      }
    },
  });
}

initKafka()
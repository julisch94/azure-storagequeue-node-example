import { QueueServiceClient } from '@azure/storage-queue';

let queueServiceClient: QueueServiceClient;

async function main(): Promise<void> {
  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING as string;
  console.log('Connection string from environment: ' + connectionString);
  queueServiceClient = QueueServiceClient.fromConnectionString(connectionString);

  const queueName = await createQueue();
  insertSamplesIntoQueue(queueName);

  const queueClient = queueServiceClient.getQueueClient(queueName);
  const props = await queueClient.getProperties();
  console.log(props);
}

function insertSamplesIntoQueue(queueName: string) {
  console.log('Inserting into queue');

  const queueClient = queueServiceClient.getQueueClient(queueName);
  queueClient.sendMessage('Hello, World!');
  queueClient.sendMessage('Hello, World 2!');
}

async function createQueue(): Promise<string> {
  const queueName = 'myqueue' + Date.now().toString();
  console.log('Creating queue: ' + queueName);

  await queueServiceClient.createQueue(queueName);
  return queueName;
}

main().catch(err => {
  console.log('Error occurred: ', err);
  process.exit(1);
});

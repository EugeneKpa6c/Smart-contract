import { ethers } from 'hardhat';
import TelegramBot from 'node-telegram-bot-api';

// Установите адрес локально запущенной ноды Hardhat
const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545/');

// Установите адрес контракта и его ABI
const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const contractABI = [
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_name",
                "type": "string"
            },
            {
                "internalType": "uint256[]",
                "name": "_values",
                "type": "uint256[]"
            }
        ],
        "name": "addData",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_name",
                "type": "string"
            },
            {
                "internalType": "uint256[]",
                "name": "_values",
                "type": "uint256[]"
            }
        ],
        "name": "addDataRequest",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_description",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_dataUrl",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "_price",
                "type": "uint256"
            }
        ],
        "name": "addDataset",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_dataContract",
                "type": "address"
            }
        ],
        "name": "addExternalData",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "uint256[]",
                "name": "values",
                "type": "uint256[]"
            }
        ],
        "name": "DataAdded",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "requester",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "uint256[]",
                "name": "values",
                "type": "uint256[]"
            }
        ],
        "name": "DataRequest",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "buyer",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "datasetName",
                "type": "string"
            }
        ],
        "name": "DatasetPurchased",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "deposit",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "account",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "Deposit",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_name",
                "type": "string"
            }
        ],
        "name": "purchaseDataset",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "withdraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "account",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "Withdrawal",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "balanceOf",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            }
        ],
        "name": "balanceOfUser",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "name": "datasetByName",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "description",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "dataUrl",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "price",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_id",
                "type": "uint256"
            }
        ],
        "name": "getData",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "name",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256[]",
                        "name": "values",
                        "type": "uint256[]"
                    }
                ],
                "internalType": "struct DataLoader.Data",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getDataCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_name",
                "type": "string"
            }
        ],
        "name": "getDatasetByName",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "internalType": "string",
                        "name": "name",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "description",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "dataUrl",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "price",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct DataLoader.Dataset",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_name",
                "type": "string"
            }
        ],
        "name": "searchDatasets",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "internalType": "string",
                        "name": "name",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "description",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "dataUrl",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "price",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct DataLoader.Dataset[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

// Инициализация бота
const bot = new TelegramBot('6149571891:AAGvYdiRWcjnHDcrDrwn-GIMHpqvmyTy9-k', { polling: true });

// Хранилище учетных данных пользователей
let userCredentials = {};

// Обработка команды /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Добро пожаловать! Установите свой адрес и приватный ключ с помощью /set_credentials <account> <privateKey>. Для пополнения баланса отправьте команду /deposit <ETH>, а для проверки баланса используйте команду /balance.');
});

// Обработка команды /set_credentials
bot.onText(/\/set_credentials (\w+) (\w+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const account = match[1];
  const privateKey = match[2];

  userCredentials[chatId] = { account, privateKey };
  bot.sendMessage(chatId, 'Учетные данные установлены успешно.');
});

// Обработка команды /deposit
bot.onText(/\/deposit (\d+\.?\d*)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const amount = match[1];  // Вводите сумму в ETH

  try {
    const { privateKey } = userCredentials[chatId];
    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(contractAddress, contractABI, wallet);

    // Конвертируйте сумму в ETH в wei для отправки в контракт
    const amountWei = ethers.utils.parseEther(amount.toString());

    const tx = await contract.deposit({ value: amountWei });
    await tx.wait();

    bot.sendMessage(chatId, `Баланс пополнен на ${amount} ETH.`);
  } catch (error) {
    bot.sendMessage(chatId, 'Ошибка при пополнении баланса.');
    console.error(error);
  }
});

// Обработка команды /balance
bot.onText(/\/balance/, async (msg) => {
  const chatId = msg.chat.id;

  try {
    const { account, privateKey } = userCredentials[chatId];
    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(contractAddress, contractABI, wallet);

    const balanceWei = await contract.balanceOfUser(account);
    const balanceEth = ethers.utils.formatEther(balanceWei);

    bot.sendMessage(chatId, `Ваш текущий баланс: ${balanceEth} ETH.`);
  } catch (error) {
    bot.sendMessage(chatId, 'Ошибка при проверке баланса.');
    console.error(error);
  }
});

let datasetData = {};
let state = '';

bot.onText(/\/add_dataset/, (msg) => {
  const chatId = msg.chat.id;
  state = 'NAME';
  bot.sendMessage(chatId, 'Введите название датасета.');
});

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;

  if (state === 'NAME') {
    datasetData.name = msg.text;
    state = 'DESCRIPTION';
    bot.sendMessage(chatId, 'Введите описание датасета.');
  } else if (state === 'DESCRIPTION') {
    datasetData.description = msg.text;
    state = 'CSV';
    bot.sendMessage(chatId, 'Отправьте .csv файл с данными.');
  } else if (state === 'CSV') {
    bot.on('document', async (msg) => {
      if (msg.document.mime_type === 'text/csv') {
        datasetData.dataUrl = await bot.getFileLink(msg.document.file_id);
        state = 'PRICE';
        bot.sendMessage(chatId, 'Введите цену за получение данных (в ETH).');
      }
    });
  } else if (state === 'PRICE') {
    const priceWei = ethers.utils.parseEther(msg.text);

    try {
      const { privateKey } = userCredentials[chatId];
      const wallet = new ethers.Wallet(privateKey, provider);
      const contract = new ethers.Contract(contractAddress, contractABI, wallet);

      const tx = await contract.addDataset(datasetData.name, datasetData.description, datasetData.dataUrl, priceWei);
      await tx.wait();

      bot.sendMessage(chatId, 'Датасет успешно добавлен.');
      state = '';
      datasetData = {};
    } catch (error) {
      bot.sendMessage(chatId, 'Ошибка при добавлении датасета.');
      console.error(error);
    }
  }
});


// Обработка команды /search_dataset
bot.onText(/\/search_dataset (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const name = match[1];

  try {
    const { privateKey } = userCredentials[chatId];
    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(contractAddress, contractABI, wallet);

    // Search for datasets
    const datasets = await contract.searchDatasets(name);
    
    for (const dataset of datasets) {
      const datasetName = dataset.name;
      const datasetDescription = dataset.description;
      const datasetPrice = ethers.utils.formatEther(dataset.price);
      bot.sendMessage(chatId, `Name: ${datasetName}\nDescription: ${datasetDescription}\nPrice: ${datasetPrice} ETH`, {
        reply_markup: {
          inline_keyboard: [
            [{
              text: 'Purchase',
              callback_data: JSON.stringify({
                'command': 'purchase',
                'name': datasetName,
              })
            }]
          ]
        }
      });
    }
  } catch (error) {
    bot.sendMessage(chatId, 'Error searching for datasets.');
    console.error(error);
  }
});


// Обработка кнопки покупки
bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  
  const data = JSON.parse(query.data);
  const datasetName = data.name;

  try {
    const { account, privateKey } = userCredentials[chatId];
    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(contractAddress, contractABI, wallet);

    const tx = await contract.purchaseDataset(datasetName);
    await tx.wait();

    // Получаем информацию о датасете после покупки
    const dataset = await contract.getDatasetByName(datasetName);

    // Обновляем баланс пользователя
    const balanceWei = await contract.balanceOfUser(account);
    const balanceEth = ethers.utils.formatEther(balanceWei);

    // Отправляем URL датасета и обновленный баланс
    bot.sendMessage(chatId, `Вы успешно приобрели датасет. URL датасета: ${dataset.dataUrl}.\nВаш обновленный баланс: ${balanceEth} ETH.`);
  } catch (error) {
    bot.sendMessage(chatId, 'Ошибка при покупке датасета.');
    console.error(error);
  }
});

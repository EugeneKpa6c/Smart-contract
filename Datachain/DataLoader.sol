// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DataLoader {
    // Объявляем структуру данных.
    struct Data {
        uint id;
        string name;
        uint[] values;
    }

    // Новая структура для хранения информации о датасете
    struct Dataset {
        uint id;
        address owner;
        string name;
        string description;
        string dataUrl;
        uint price;
    }

    // Объявляем приватную переменную для хранения последнего использованного ID.
    uint private lastId = 0;

    // Объявляем массив для хранения загруженных данных.
    Data[] private data;

    // Объявляем маппинг для хранения балансов пользователей.
    mapping(address => uint) private balances;

    mapping(string => Dataset) public datasetByName;

    // Объявляем события, которые будут вызываться при добавлении данных, пополнении и выводе средств.
    event DataAdded(uint id, string name, uint[] values);
    event Deposit(address indexed account, uint amount);
    event Withdrawal(address indexed account, uint amount);
    event DataRequest(address indexed requester, string name, uint[] values);

    // Функция для добавления данных по запросу.
    function addDataRequest(string memory _name, uint[] memory _values) public {
        emit DataRequest(msg.sender, _name, _values);
    }

    // "123",[1,2,3]
    // Функция для добавления данных.
    function addData(string memory _name, uint[] memory _values) public payable {
        uint _id = lastId;
        data.push(Data(_id, _name, _values));
        emit DataAdded(_id, _name, _values);
        lastId++;
    }


    // Функция для получения количества загруженных данных.
    function getDataCount() public view returns (uint) {
        return data.length;
    }

    // Функция для добавления в контракт данных из внешнего контракта.
    function addExternalData(address _dataContract) public {
        DataLoader dataContract = DataLoader(_dataContract);
        uint count = dataContract.getDataCount();
        Data memory externalData = dataContract.getData(count - 1);
        addData(externalData.name, externalData.values);
    }

    // Функция для получения данных по ID.
    function getData(uint _id) public view returns (Data memory) {
        require(_id < data.length, "Invalid data id");
        return data[_id];
    }

    // Функция для пополнения баланса пользователя.
    function deposit() public payable {
        balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }


    // Функция для вывода средств с баланса пользователя на кошелек.
    function withdraw(uint amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
        emit Withdrawal(msg.sender, amount);
    }


    // Функция проверки баланса.
    function balanceOf() public view returns (uint) {
        return address(this).balance / (1 ether);
    }

    function balanceOfUser(address user) public view returns (uint) {
        return balances[user];
    }

    // Массив для хранения датасетов
    Dataset[] private datasets;
    uint private lastDatasetId = 0;

    // Функция для добавления нового датасета
    function addDataset(string memory _name, string memory _description, string memory _dataUrl, uint _price) public {
        uint _id = lastDatasetId;
        Dataset memory newDataset = Dataset(_id, msg.sender, _name, _description, _dataUrl, _price);
        datasets.push(newDataset);
        datasetByName[_name] = newDataset;
        lastDatasetId++;
    }




    event DatasetPurchased(address indexed buyer, string datasetName);

    function getDatasetByName(string memory _name) public view returns (Dataset memory) {
        return datasetByName[_name];
    }


    function purchaseDataset(string memory _name) public {
        Dataset memory dataset = getDatasetByName(_name);
        require(balances[msg.sender] >= dataset.price, "Insufficient balance");

        balances[msg.sender] -= dataset.price;
        balances[dataset.owner] += dataset.price;

        emit DatasetPurchased(msg.sender, _name);
    }

    // Функция для поиска датасетов по имени.
    function searchDatasets(string memory _name) public view returns (Dataset[] memory) {
        // Создаем временный массив в памяти для хранения совпадающих датасетов.
        Dataset[] memory matchingDatasets = new Dataset[](datasets.length);

        // Индекс для отслеживания количества совпадающих датасетов.
        uint matchingIndex = 0;

        // Проходим по всем датасетам.
        for (uint i = 0; i < datasets.length; i++) {
            // Если имя датасета содержит указанную строку, добавляем его в массив.
            if (keccak256(bytes(datasets[i].name)) == keccak256(bytes(_name))) {
                matchingDatasets[matchingIndex] = datasets[i];
                matchingIndex++;
            }
        }

        // Создаем новый массив с правильным размером.
        Dataset[] memory result = new Dataset[](matchingIndex);

        // Копируем совпадающие датасеты в новый массив.
        for (uint i = 0; i < matchingIndex; i++) {
            result[i] = matchingDatasets[i];
        }

        // Возвращаем массив совпадающих датасетов.
        return result;
    }
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
    // function transfer(address recipient, uint256 amount) external returns (bool);
    // function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}

contract DataLoader {
    // Объявляем структуру данных.
    struct Data {
        uint id;
        string name;
        uint[] values;
    }

    // Объявляем приватную переменную для хранения последнего использованного ID.
    uint private lastId = 0;

    // Объявляем массив для хранения загруженных данных.
    Data[] private data;

    // Объявляем маппинг для хранения балансов пользователей.
    mapping(address => uint) private balances;

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
        uint amount = msg.value / (1 ether);
        balances[msg.sender] += amount;
        emit Deposit(msg.sender, amount);
    }

    // Функция для вывода средств с баланса пользователя на кошелек.
    function withdraw(uint amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount * (1 ether));
        emit Withdrawal(msg.sender, amount);
    }

    // Функция проверки баланса.
    function balanceOf() public view returns (uint) {
        return address(this).balance / (1 ether);
    }
}
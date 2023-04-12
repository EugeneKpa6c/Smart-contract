// Импортируем необходимые библиотеки и контракты.
import "remix_tests.sol";
import "../contracts/DataLoader.sol";

// Описываем контракт тестов.
contract DataLoaderTest {
    // Объявляем контракт, который будем тестировать.
    DataLoader dataLoader;

    // Вызываем функцию beforeEach, чтобы создать новый экземпляр контракта перед каждым тестом.
    function beforeEach() public {
        dataLoader = new DataLoader();
    }

    // Тест для проверки добавления данных в контракт.
    function testAddData() public {
        // Создаем тестовые данные.
        string memory name = "test";
        uint[] memory values = new uint[](3);
        values[0] = 1;
        values[1] = 2;
        values[2] = 3;


        // Вызываем функцию добавления данных в контракт.
        dataLoader.addData{value: 1 ether}(name, values);

        // Получаем количество загруженных данных.
        uint dataCount = dataLoader.getDataCount();

        // Проверяем, что количество загруженных данных равно 1.
        Assert.equal(dataCount, 1, "Data count should be 1");

        // Получаем добавленные данные по ID.
        DataLoader.Data memory addedData = dataLoader.getData(0);

        // Проверяем, что добавленные данные имеют ожидаемые значения.
        Assert.equal(addedData.id, 0, "Data id should be 0");
        Assert.equal(addedData.name, name, "Data name should be 'test'");
        Assert.equal(addedData.values.length, 3, "Data values length should be 3");
        Assert.equal(addedData.values[0], 1, "Data value should be 1");
        Assert.equal(addedData.values[1], 2, "Data value should be 2");
        Assert.equal(addedData.values[2], 3, "Data value should be 3");
    }

    // Тест для проверки пополнения баланса пользователя.
    function testDeposit() public {
        // Пополняем баланс пользователя.
        dataLoader.deposit{value: 1 ether}();

        // Получаем баланс пользователя.
        uint balance = dataLoader.balanceOf();

        // Проверяем, что баланс пользователя равен 1.
        Assert.equal(balance, 1, "Balance should be 1");
    }

    // Тест для проверки вывода средств с баланса пользователя.
    function testWithdraw() public {
        // Пополняем баланс пользователя.
        dataLoader.deposit{value: 1 ether}();

        // Выводим средства с баланса пользователя.
        dataLoader.withdraw(1);

        // Получаем баланс пользователя.
        uint balance = dataLoader.balanceOf();

        // Проверяем, что баланс пользователя равен 0.
        Assert.equal(balance, 0, "Balance should be 0");
    }
}

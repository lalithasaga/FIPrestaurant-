import React, { useState, useEffect } from 'react';

const App = () => {
  const [orders, setOrders] = useState([]);
  const [uniqueId, setUniqueId] = useState(1);
  const [price, setPrice] = useState('');
  const [dish, setDish] = useState('');
  const [table, setTable] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const storedOrders = localStorage.getItem('orders');
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  const handleAddToBill = () => {
    if (!price || !dish || !table) {
      setErrorMessage('Please fill in all the details');
      return;
    }

    const newOrder = {
      id: uniqueId,
      price,
      dish,
      table,
    };
    setOrders([...orders, newOrder]);
    setUniqueId(uniqueId + 1);
    setPrice('');
    setDish('');
    setTable('');
    setErrorMessage('');
  };

  const handleDeleteOrder = (orderId) => {
    const updatedOrders = orders.filter((order) => order.id !== orderId);
    setOrders(updatedOrders);
  };

  const getOrdersByTable = () => {
    const ordersByTable = {};
    orders.forEach((order) => {
      if (!ordersByTable[order.table]) {
        ordersByTable[order.table] = [];
      }
      ordersByTable[order.table].push(order);
    });
    return ordersByTable;
  };

  return (
    <div>
      <h1>Restaurant Orders</h1>
      <div>
        <label htmlFor="uniqueId">Unique Order ID:</label>
        <input type="text" id="uniqueId" value={uniqueId} disabled />
      </div>
      <div>
        <label htmlFor="price">Choose Price:</label>
        <input type="text" id="price" value={price} onChange={(e) => setPrice(e.target.value)} />
      </div>
      <div>
        <label htmlFor="dish">Choose Dish:</label>
        <input type="text" id="dish" value={dish} onChange={(e) => setDish(e.target.value)} />
      </div>
      <div>
        <label htmlFor="table">Choose a Table:</label>
        <select id="table" value={table} onChange={(e) => setTable(e.target.value)}>
          <option value="">Select a table</option>
          <option value=" 1">Table 1</option>
          <option value=" 2">Table 2</option>
          <option value=" 3">Table 3</option>
        </select>
      </div>
      <button onClick={handleAddToBill}>Add to Bill</button>
      {errorMessage && <p>{errorMessage}</p>}
      <h2>Orders</h2>
      {Object.entries(getOrdersByTable()).map(([table, tableOrders]) => (
        <div key={table}>
          <h3>Table {table}</h3>
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Price</th>
                <th>Dish</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tableOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.price}</td>
                  <td>{order.dish}</td>
                  <td>
                    <button onClick={() => handleDeleteOrder(order.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default App;

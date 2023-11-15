import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [datetime, setDatetime] = useState('');
  const [description, setDescription] = useState('');
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    getTransactions().then(setTransactions);
  }, []);

  async function getTransactions() {
    const url = process.env.REACT_APP_API_URL + '/transactions';
    const response = await fetch(url);
    return response.json();
  }

  function addNewTransaction(ev) {
    ev.preventDefault();
    const url = process.env.REACT_APP_API_URL + '/transaction';
    fetch(url, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ name, description, datetime, price })
    }).then(response => {
      response.json().then(json => {
        setName('');
        setDatetime('');
        setDescription('');
        setPrice('');
        console.log('result', json)
        getTransactions().then(setTransactions);
      })
    })
  }



  function formattedDate(dateString) {
    let dateObject = new Date(dateString);
    let formattedDate =
      dateObject.getFullYear() + '-' +
      ('0' + (dateObject.getMonth() + 1)).slice(-2) + '-' +
      ('0' + dateObject.getDate()).slice(-2) + ' ' +
      ('0' + dateObject.getHours()).slice(-2) + ':' +
      ('0' + dateObject.getMinutes()).slice(-2);
    return formattedDate;
  }

  let balance = 0;
  for (const transaction of transactions) {
    balance = balance + transaction.price;
  }

  balance = balance.toFixed(2);
  const fraction = balance.split('.')[1];
  balance = balance.split('.')[0];

  return (

    <main>
      <h1>${balance}<span>{fraction}</span></h1>
      <form onSubmit={addNewTransaction}>
        <div className='basic'>
          <input type='number'
            value={price}
            onChange={ev => setPrice(ev.target.value)}
            placeholder={200} />
          <input
            value={datetime}
            onChange={ev => setDatetime(ev.target.value)}
            type='datetime-local' />
        </div>
        <div className='description'>
          <input type='text'
            value={name}
            onChange={ev => setName(ev.target.value)}
            placeholder={'name'} />
        </div>
        <div className='description'>
          <input type='text'
            value={description}
            onChange={ev => setDescription(ev.target.value)}
            placeholder={'description'} />
        </div>
        <button type='submit'>Add new transaction</button>
      </form>
      <div className='transactions'>
        {

          transactions.length > 0 && transactions.map((transaction, index) => (
            <div className='transaction' key={index}>
              <div className='left'>
                <div className='name'>{transaction.name}</div>
                <div className='description'>{transaction.description}</div>
              </div>
              <div className='right'>
                <div className={'price ' + (transaction.price < 0 ? 'red' : 'green')}>{transaction.price}</div>
                <div className='datetime'>{formattedDate(transaction.datetime)}</div>
              </div>
            </div>
          ))
        }

      </div>
    </main>
  );
}

export default App;

import fetch from 'isomorphic-fetch';
import Fetch from '../utils/fetch';
import {stockSymbolActions} from '../reducers/stock_symbols_reducer';

function errorStockSymbolAction(payload) {return {type: stockSymbolActions.ERROR_STOCK_SYMBOLS, payload: payload};}
function loadStockSymbolsAction(payload) {return {type: stockSymbolActions.LOAD_STOCK_SYMBOLS,  payload: payload};}

export function loadStockSymbols() {
  return function(dispatch) {
    dispatch({type: 'LOADING_STOCK_SYMBOLS', payload: ''})
    return (
      fetch('/api/stock_symbols', {
        headers: {
          'Accept': 'application/json',
        },
      })
      .then(Fetch.checkStatus)
      .then(response => response.json())
      .then(responseJson => {
        if (!responseJson.length) {
          throw new Error('Empty response from server');
        }
        dispatch(loadStockSymbolsAction(responseJson));
      })
      .catch(error => dispatch(errorStockSymbolAction({prefix: 'Load Stock Symbols Error: ', error: error})))
    )
  }
}

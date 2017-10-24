import fetch from 'isomorphic-fetch';
import Fetch from '../utils/fetch';
import {portfolioActions} from '../reducers/portfolios_reducer';

const GUEST_USER_ID = 1;

function addPortfolioAction(payload)    {return {type: portfolioActions.ADD_PORTFOLIO,     payload: payload};}
function deletePortfolioAction(payload) {return {type: portfolioActions.DELETE_PORTFOLIO,  payload: payload};}
function errorPortfolioAction(payload)  {return {type: portfolioActions.ERROR_PORTFOLIOS,  payload: payload};}
function loadPortfoliosAction(payload)  {return {type: portfolioActions.LOAD_PORTFOLIOS,   payload: payload};}
function sortPortfoliosAction(payload)  {return {type: portfolioActions.SORT_PORTFOLIOS,   payload: payload};}
function updatePortfolioAction(payload) {return {type: portfolioActions.UPDATE_PORTFOLIOS, payload: payload};}
function updatingPortfolioAction()      {return {type: portfolioActions.UPDATING_PORTFOLIO};}

export function addPortfolio(portfolio) {
  return function(dispatch) {
    dispatch(updatingPortfolioAction());
    return (
      fetch('/api/portfolios/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: GUEST_USER_ID,
          name: portfolio.name,
        }),
      })
      .then(Fetch.checkStatus)
      .then(response => response.json())
      .then(responseJson => {
        if (!responseJson.id) {
          throw responseJson;
        }
        dispatch(addPortfolioAction(responseJson));
      })
      .catch(error => dispatch(errorPortfolioAction({prefix: 'Add Portfolio Error: ', error: error})))
    );
  }
}

export function deletePortfolio(portfolioId) {
  return function(dispatch) {
    dispatch(updatingPortfolioAction());
    return (
      fetch(`/api/portfolios/${portfolioId}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
        },
      })
      .then(Fetch.checkStatus)
      .then(response => response.json())
      .then(responseJson => {
        if (!responseJson.id) {
          throw responseJson;
        }
        dispatch(deletePortfolioAction(portfolioId));
      })
      .catch(error => dispatch(errorPortfolioAction({prefix: 'Delete Portfolio Error: ', error: error})))
    );
  }
}

export function loadPortfolios() {
  return function(dispatch) {
    dispatch(updatingPortfolioAction());
    return (
      fetch('/api/portfolios', {
        headers: {
          'Accept': 'application/json',
        },
      })
      .then(Fetch.checkStatus)
      .then(response => response.json())
      .then(portfolios => {
        if (!portfolios.length) {
          throw new Error('Empty response from server');
        }
        let symbols = [];

        portfolios.forEach(function(portfolio) {
          portfolio.marketValue = 0.0;
          portfolio.totalCost   = 0.0;
          portfolio.gainLoss    = 0.0;
          portfolio.open_positions.forEach(function(position) {
            position.lastClosePrice = 0.0;
            position.marketValue    = 0.0;
            position.gainLoss       = 0.0;
            symbols.push(position.stock_symbol.name);
          });
        });

        if (symbols.length > 0) {
          fetch(`/api/daily_trades/lastPrices?symbols=${symbols.toString()}`, {
            headers: {
              'Accept': 'application/json',
            },
          })
          .then(Fetch.checkStatus)
          .then(response => response.json())
          .then(dailyTrades => {
            if (!dailyTrades.length) {
              throw new Error('Empty response from server');
            }

            portfolios.forEach(function(portfolio) {
              portfolio.open_positions.forEach(function(position) {
                const dailyTradesIndex = dailyTrades.findIndex(dailyTrade => {return dailyTrade.stock_symbol_id === position.stock_symbol.id});
                if (dailyTradesIndex !== -1) {
                  position.lastClosePrice = dailyTrades[dailyTradesIndex].close_price;
                  position.marketValue    = position.quantity * position.lastClosePrice;
                  position.gainLoss       = position.marketValue - position.cost;
                  portfolio.marketValue  += position.marketValue;
                  portfolio.totalCost    += position.cost;
                  portfolio.gainLoss     += position.gainLoss;
                }
              });
            });
            dispatch(loadPortfoliosAction(portfolios));
          });
        }




      })
      .catch(error => dispatch(errorPortfolioAction({prefix: 'Load Portfolios Error: ', error: error})))
    );
  }
}

export function refreshPortfolio(portfolioId) {
  return function(dispatch) {
    dispatch(updatingPortfolioAction());
    return (
      fetch(`/api/portfolios/${portfolioId}`, {
        headers: {
          'Accept': 'application/json',
        },
      })
      .then(Fetch.checkStatus)
      .then(response => response.json())
      .then(portfolio => {
        if (!portfolio.id) {
          throw portfolio;
        }


        let symbols = [];

        portfolio.marketValue = 0.0;
        portfolio.totalCost   = 0.0;
        portfolio.gainLoss    = 0.0;
        portfolio.open_positions.forEach(function(position) {
          position.lastClosePrice = 0.0;
          position.marketValue    = 0.0;
          position.gainLoss       = 0.0;
          symbols.push(position.stock_symbol.name);
        });

        if (symbols.length > 0) {
          fetch(`/api/daily_trades/lastPrices?symbols=${symbols.toString()}&livePrices`, {
            headers: {
              'Accept': 'application/json',
            },
          })
          .then(Fetch.checkStatus)
          .then(response => response.json())
          .then(dailyTrades => {
            if (!dailyTrades.length) {
              throw new Error('Empty response from server');
            }


            portfolio.open_positions.forEach(function(position) {
              const dailyTradesIndex = dailyTrades.findIndex(dailyTrade => {return dailyTrade.stock_symbol_id === position.stock_symbol.id});
              if (dailyTradesIndex !== -1) {
                position.lastClosePrice = dailyTrades[dailyTradesIndex].close_price;
                position.marketValue    = position.quantity * position.lastClosePrice;
                position.gainLoss       = position.marketValue - position.cost;
                portfolio.marketValue  += position.marketValue;
                portfolio.totalCost    += position.cost;
                portfolio.gainLoss     += position.gainLoss;
              }
            });
            dispatch(updatePortfolioAction(portfolio));
          });
        }
      })
      .catch(error => dispatch(errorPortfolioAction({prefix: 'Refresh Portfolio Error: ', error: error})))
    );
  }
}

export function refreshPortfolios() {
  return function(dispatch) {
    dispatch(updatingPortfolioAction());
  }
}

export function sortPortfolios(columnName, reverseSort) {
  return function(dispatch) {
    dispatch(updatingPortfolioAction());
    return (
        dispatch(sortPortfoliosAction({columnName, reverseSort}))
    );
  }
}

export function updatePortfolio(portfolio) {
  return function(dispatch) {
    dispatch(updatingPortfolioAction());
    return (
      fetch(`/api/portfolios/${portfolio.id}`, {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: portfolio.name,
        }),
      })
      .then(Fetch.checkStatus)
      .then(response => response.json())
      .then(responseJson => {
        if (!responseJson.id) {
          throw responseJson;
        }
        dispatch(updatePortfolioAction(responseJson));
      })
      .catch(error => dispatch(errorPortfolioAction({prefix: 'Update Portfolio Error: ', error: error})))
    );
  }
}

import React from 'react';

// Returns a formatted currency string.
const Currency = (props) => {
  let result = '';
  if (typeof props.value !== "undefined") {
    const formattedValue = parseFloat(props.value).toLocaleString(undefined, {style:'currency', currency:'USD', minimumFractionDigits: 2, maximumFractionDigits: 2});
    if (formattedValue[0] === '-') {
      result = <span style={{color:'red'}}>{formattedValue}</span>;
    } else {
      result = <span>{formattedValue}</span>;
    }
  }
  return result;
}

// Returns a formatted Date string.
const DateOnly = (props) => {
  let result = '';
  if (typeof props.value !== "undefined") {
    const date = new Date(props.value);
    result = date.toLocaleDateString();
  }
  return result;
}

// Returns a formatted DateTime string.
const DateTime = (props) => {
// TODO find out why props.value is undefined.
  let result = '';
  if (typeof props.value !== "undefined") {
    const date = new Date(props.value);
    result = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  }
  return result;
}

// Returns a formatted quantity string.
const Quantity = (props) => {
  let result = '';
  if (typeof props.value !== "undefined") {
    const formattedValue = parseFloat(props.value).toLocaleString(undefined, {style:'decimal', minimumFractionDigits: 0, maximumFractionDigits: 5});
    result = <span>{formattedValue}</span>;
  }
  return result;
}

// Returns a formatted server error string.
const ServerError = (error, prefix) => {
  let formattedValue;
  if (error.status === 500) {
    formattedValue = `${prefix} status: ${error.status} error: ${error.error}: ${error.exception}  @ ${error.traces['Application Trace'][0].trace}`;
  } else {
    formattedValue = `${prefix}${error}`;
  }
  return formattedValue;
}

const Fmt = {Currency, DateOnly, DateTime, Quantity, ServerError};
export default Fmt;

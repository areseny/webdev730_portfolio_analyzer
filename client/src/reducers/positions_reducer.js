export default function positionsReducer(state= {loadingPositions: false, removingPosition: false, updatingPosition: false, portfolio_id: -1, positions: {}}, action) {
  let index, positions;
  switch ( action.type ) {
    // Load Positions
    // case 'LOADING_POSITIONS':
    //   return Object.assign({}, state, {loadingPositions: true, portfolio_id: action.payload})
    // case 'LOAD_POSITIONS':
    //   return Object.assign({}, state, {loadingPositions: false, positions: action.payload})

    // Delete a Position
    // case 'DELETING_POSITION':
    //   return Object.assign({}, state, {removingPosition: true})
    // case 'DELETE_POSITION':
    //   index = action.payload;
    //   positions = Object.assign({}, state.positions);
    //   positions.open_positions = [...state.positions.open_positions.slice(0,index), ...state.positions.open_positions.slice(index+1)]
    //   return Object.assign({}, state, {removingPosition: false, positions: positions})

    // default action
    default:
      return state;
  }
}

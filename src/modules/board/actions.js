import _ from 'lodash';
import * as types from '../../constants/actionTypes';
import { changeTurn } from '../game/actions';
import {
  getPossibleDirections,
  calculateNextImpact
} from '../../utils/helpers';

export const initShips = () => {
  return {
    type: types.INIT_SHIPS
  };
};

export const selectShip = ship => {
  return {
    type: types.SELECT_SHIP,
    payload: {
      ship
    }
  };
};

export const rotateShip = ship => {
  const newShip = ship;

  if (ship.direction === 'horizontal') {
    newShip.direction = 'vertical';
  } else {
    newShip.direction = 'horizontal';
  }

  return {
    type: types.SELECT_SHIP,
    payload: {
      ship: newShip
    }
  };
};

export const highlightPossibleSelection = (cellsToHighlight, cells) => {
  const cellsToFill = cellsToHighlight;
  const idsToChange = [];

  cellsToFill.map(cell => {
    const cellToChange = _.find(
      cells,
      c =>
        c.xCoordinate === cell.xCoordinate && c.yCoordinate === cell.yCoordinate
    );
    idsToChange.push(cellToChange.id);
  });

  const finalCells = cells;

  const result = finalCells.map(cell => {
    const c = cell;

    if (idsToChange.indexOf(c.id) >= 0) {
      c.highlighted = true;
    } else {
      c.highlighted = false;
    }

    return c;
  });

  return {
    type: types.HIGHLIGHT_POSSIBLE_SELECTION,
    payload: {
      cells: result,
      highlightedCells: idsToChange
    }
  };
};

export const setShipPosition = (ships, selectedShip, positions, cells) => {
  const shipToTransform = selectedShip;

  const cellsToUseAsPosition = positions.map(position => {
    return cells.find(cell => {
      return cell.id === position;
    });
  });

  const coordinatesForPosition = cellsToUseAsPosition.map(cell => {
    return _.pick(cell, ['xCoordinate', 'yCoordinate']);
  });

  ships.map(ship => {
    const iterableShip = ship;
    if (ship.id === shipToTransform.id) {
      iterableShip.position = coordinatesForPosition;
    }
    return iterableShip;
  });

  cells.map(cell => {
    const c = cell;

    if (positions.indexOf(c.id) >= 0) {
      c.isAvailable = false;
      c.type = selectedShip.type;
    }
    return c;
  });

  return {
    type: types.SET_SHIP_POSITION,
    payload: {
      ships,
      positionedShip: shipToTransform,
      cells
    }
  };
};

export const attackShipFlow = (cell, cells, ships) => {
  const newCell = cell;
  const { xCoordinate, yCoordinate } = newCell;
  newCell.condition = 'water';

  let cellsToDestroy;

  const newShips = ships.map(ship => {
    const newShip = ship;

    const { position, hits } = newShip;
    const { condition } = newShip;

    const matchedPosition = position.find(pos => {
      return pos.xCoordinate === xCoordinate && pos.yCoordinate === yCoordinate;
    });

    if (matchedPosition) {
      hits.push(matchedPosition);
      newCell.condition = 'damaged';
      if (condition === 'new') {
        newShip.condition = 'damaged';
      }
      if (hits.length === position.length) {
        newShip.condition = 'destroyed';
        cellsToDestroy = position;
      }
      return newShip;
    }

    return newShip;
  });

  const newCells = cells.map(cellElement => {
    const c = cellElement;

    if (c.xCoordinate === xCoordinate && c.yCoordinate === yCoordinate) {
      c.condition = newCell.condition;
    }

    return c;
  });

  if (cellsToDestroy) {
    newCells.map(cellToCheck => {
      const cellToReturn = cellToCheck;

      return cellsToDestroy.map(cellToDestroy => {
        if (
          cellToDestroy.xCoordinate === cellToCheck.xCoordinate &&
          cellToDestroy.yCoordinate === cellToCheck.yCoordinate
        ) {
          cellToReturn.condition = 'destroyed';
        }
        return cellToReturn;
      });
    });
  }
  return {
    newShips,
    newCells,
    destroyedShips: cellsToDestroy ? 1 : 0,
    attackedCell: newCell
  };
};

export const userAttackShip = (cell, cells, ships) => {
  const result = attackShipFlow(cell, cells, ships, 'user');

  const { newShips, newCells, destroyedShips } = result;
  return {
    type: types.USER_ATTACK_SHIP,
    payload: {
      cpuShips: newShips,
      cpuCells: newCells,
      destroyedShips
    }
  };
};

export const cpuAttackShip = (
  cell,
  cells,
  ships,
  possibleDirectionsForTarget,
  requireTargetReconfig
) => {
  const result = attackShipFlow(cell, cells, ships, 'cpu');

  const { newShips, newCells, destroyedShips, attackedCell } = result;
  return {
    type: types.CPU_ATTACK_SHIP,
    payload: {
      userShips: newShips,
      userCells: newCells,
      destroyedShips,
      attackedCell,
      lastDirection: attackedCell.direction,
      possibleDirectionsForTarget,
      requireTargetReconfig
    }
  };
};

export const changeStrategy = (strategy, target, requireTargetReconfig) => {
  return {
    type: types.CHANGE_STRATEGY,
    payload: {
      strategy,
      target,
      requireTargetReconfig
    }
  };
};

// export const cpuAttack = cpuData => {
//   const {
//     userCells,
//     userShips,
//     latestCpuImpacts,
//     target,
//     strategy,
//     lastDirection,
//     requireTargetReconfig
//   } = cpuData;

//   let { possibleDirectionsForTarget } = cpuData;

//   const availableUserCells = userCells.filter(cell => cell.condition === null);

//   console.log('INICIO ACTION', strategy);
//   let lastImpact;

//   if (latestCpuImpacts.length > 0) {
//     lastImpact = _.last(latestCpuImpacts);
//   }

//   // check updated value to evaluate if a ship was destroyed
//   if (lastImpact) {
//     const checkedLastCell = userCells.find(
//       cell =>
//         cell.xCoordinate === lastImpact.xCoordinate &&
//         cell.yCoordinate === lastImpact.yCoordinate
//     );

//     if (checkedLastCell.condition === 'destroyed') {
//       const damagedShips = userCells.filter(
//         cell => cell.condition === 'damaged'
//       );

//       if (damagedShips.length > 0) {
//         const randomDamagedShip = _.sample(damagedShips);

//         return dispatch => {
//           dispatch(changeStrategy('strategy', randomDamagedShip, true));
//         };
//       }
//       return dispatch => {
//         dispatch(changeStrategy('random', null, true));
//       };
//     }
//   }

//   // if (strategy === 'random') {
//   //   return dispatch => {
//   //     dispatch(changeStrategy('testing', null, false));
//   //   };
//   // }
//   // if (strategy === 'testing') {
//   //   console.log('estoy en teging');
//   // }

//   if (strategy === 'random') {
//     console.log('estoy en random');
//     if (lastImpact && lastImpact.condition === 'damaged') {
//       return dispatch => {
//         dispatch(changeStrategy('strategy', lastImpact, true));
//       };
//     }
//     const randomCell = _.sample(availableUserCells);

//     return dispatch => {
//       dispatch(
//         cpuAttackShip(
//           randomCell,
//           userCells,
//           userShips,
//           possibleDirectionsForTarget
//         )
//       );
//     };
//   }

//   if (strategy === 'strategy') {
//     const directionToApply = lastDirection;

//     if (lastImpact.condition === 'water') {
//       possibleDirectionsForTarget = getPossibleDirections(
//         availableUserCells,
//         target
//       );
//     } else {
//       possibleDirectionsForTarget = getPossibleDirections(
//         availableUserCells,
//         lastImpact
//       );
//     }

//     const nextImpact = calculateNextImpact(
//       target,
//       lastImpact,
//       possibleDirectionsForTarget,
//       directionToApply,
//       latestCpuImpacts
//     );

//     return dispatch => {
//       dispatch(
//         cpuAttackShip(
//           nextImpact,
//           userCells,
//           userShips,
//           possibleDirectionsForTarget
//         )
//       );
//     };
//   }
// };

// const cpuAttack = cpuData => {
//   const {
//     userTurn,
//     userCells,
//     userShips,
//     latestCpuImpacts,
//     strategy,
//     requireTargetReconfig,
//     lastDirection,
//     target
//   } = cpuData;

//   let { possibleDirectionsForTarget } = cpuData;

//   const availableUserCells = userCells.filter(cell => cell.condition === null);

//   let lastImpact;

//   if (latestCpuImpacts.length > 0) {
//     lastImpact = _.last(latestCpuImpacts);
//   }

//   let destroyedCell;
//   if (lastImpact) {
//     destroyedCell = userCells.find(
//       cell =>
//         cell.xCoordinate === lastImpact.xCoordinate &&
//         cell.yCoordinate === lastImpact.yCoordinate
//     );
//   }

//   // check updated value to evaluate if a ship was destroyed
//   if (
//     strategy === 'strategy' &&
//     destroyedCell &&
//     destroyedCell.condition === 'destroyed'
//   ) {
//     const damagedShips = userCells.filter(cell => cell.condition === 'damaged');

//     if (damagedShips.length > 0) {
//       const randomDamagedShip = _.sample(damagedShips);

//       return dispatch => {
//         dispatch(changeStrategy('strategy', randomDamagedShip, true));
//       };
//     }
//     return dispatch => {
//       dispatch(changeStrategy('random', null, true));
//     };
//   }

//   if (strategy === 'random') {
//     if (requireTargetReconfig) {
//       const randomCell = _.sample(availableUserCells);

//       return dispatch => {
//         return dispatch(
//           cpuAttackShip(
//             randomCell,
//             userCells,
//             userShips,
//             possibleDirectionsForTarget,
//             false
//           )
//         );
//       };
//     }

//     if (lastImpact && lastImpact.condition === 'damaged') {
//       return dispatch => {
//         dispatch(changeStrategy('strategy', lastImpact, false));
//       };
//     }
//     const randomCell = _.sample(availableUserCells);
//     return dispatch => {
//       dispatch(
//         cpuAttackShip(
//           randomCell,
//           userCells,
//           userShips,
//           possibleDirectionsForTarget,
//           false
//         )
//       );
//     };
//   }

//   if (strategy === 'strategy' && destroyedCell.condition !== 'destroyed') {
//     const directionToApply = lastDirection;

//     if (lastImpact.condition === 'water') {
//       possibleDirectionsForTarget = getPossibleDirections(
//         availableUserCells,
//         target
//       );
//     } else {
//       possibleDirectionsForTarget = getPossibleDirections(
//         availableUserCells,
//         lastImpact
//       );
//     }

//     debugger;

//     const nextImpact = calculateNextImpact(
//       target,
//       lastImpact,
//       possibleDirectionsForTarget,
//       directionToApply,
//       latestCpuImpacts
//     );

//     return dispatch => {
//       dispatch(
//         cpuAttackShip(
//           nextImpact,
//           userCells,
//           userShips,
//           possibleDirectionsForTarget,
//           false
//         )
//       );
//     };
//   }
// };

export const attackShip = (
  userTurn,
  cell,
  cells,
  ships,
  possibleDirectionsForTarget,
  requireTargetReconfig,
  target
) => {
  return dispatch => {
    // dispatch(userAttackShip(cell, cells, ships));
    // dispatch(changeTurn());
    // dispatch(cpuAttack(cpuData));
    // dispatch(changeTurn());

    if (userTurn) {
      dispatch(userAttackShip(cell, cells, ships));
      dispatch(changeTurn());
    }

    if (!userTurn) {
      setTimeout(() => {
        dispatch(
          cpuAttackShip(
            cell,
            cells,
            ships,
            possibleDirectionsForTarget,
            requireTargetReconfig
          )
        );
        // dispatch(changeTurn());
      }, 100);
    }
  };
};

export const setTarget = target => {
  return {
    type: types.SET_TARGET,
    payload: {
      target
    }
  };
};

// export const changeGameMode = (strategy, target, requireTargetReconfig) => {

//   if (target) {
//     return dispatch => {
//       dispatch(setTarget(target));
//       dispatch(changeStrategy(strategy, requireTargetReconfig));
//     };
//   }

//   return dispatch => {
//     dispatch(setTarget(null));
//     dispatch(changeStrategy(strategy, false));
//   };
// };

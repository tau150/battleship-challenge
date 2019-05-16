import _ from 'lodash';
import { isBoolean } from 'util';

export const generateMatrix = () => {
  const cells = [];

  for (let i = 0; i <= 9; i += 1) {
    for (let j = 0; j <= 9; j += 1) {
      cells.push({
        xCoordinate: i,
        yCoordinate: j,
        isAvailable: true,
        highlighted: false,
        type: null,
        condition: null,
        id: Math.random()
          .toString(36)
          .substr(2, 9)
      });
    }
  }
  return cells;
};

export const makeCoordinatesObject = (
  extension,
  direction,
  xCoordinate,
  yCoordinate
) => {
  const cellsToFill = [];
  if (direction === 'horizontal') {
    if (Number(yCoordinate) + extension <= 10) {
      for (let i = 0; i < extension; i += 1) {
        cellsToFill.push({
          xCoordinate: Number(xCoordinate),
          yCoordinate: Number(yCoordinate) + i
        });
      }
    }
  } else if (direction === 'vertical') {
    if (Number(xCoordinate) + extension <= 10) {
      for (let i = 0; i < extension; i += 1) {
        cellsToFill.push({
          xCoordinate: Number(xCoordinate) + i,
          yCoordinate: Number(yCoordinate)
        });
      }
    }
  }

  return cellsToFill;
};

export const positionShip = (cells, ship, xCoordinate, yCoordinate) => {
  let cellsToFill;
  const notAvailableCells = cells.filter(cell => !cell.isAvailable);

  const { direction, type } = ship;
  if (type === 'Carrier') {
    cellsToFill = makeCoordinatesObject(4, direction, xCoordinate, yCoordinate);
  } else if (type === 'Cruisers') {
    cellsToFill = makeCoordinatesObject(3, direction, xCoordinate, yCoordinate);
  } else {
    cellsToFill = makeCoordinatesObject(2, direction, xCoordinate, yCoordinate);
  }

  const coordinatesOfNotAvailableCells = notAvailableCells.map(cell =>
    _.pick(cell, ['xCoordinate', 'yCoordinate'])
  );
  let isPossibleMatch = true;

  coordinatesOfNotAvailableCells.forEach(cell => {
    cellsToFill.forEach(cellToFill => {
      if (
        cell.xCoordinate === cellToFill.xCoordinate &&
        cell.yCoordinate === cellToFill.yCoordinate
      ) {
        isPossibleMatch = false;
      }
    });
  });

  if (isPossibleMatch) {
    return cellsToFill;
  }

  return false;
};

export const initCpu = () => {
  console.log('iniciando cpu');

  const shipDirection = ['horizontal', 'vertical'];

  const ships = [
    {
      type: 'Carrier',
      id: Math.random()
        .toString(36)
        .substr(2, 9),
      position: null,
      hits: [],
      condition: 'new',
      direction: shipDirection[Math.floor(Math.random() * shipDirection.length)]
    },
    {
      type: 'Cruisers',
      id: Math.random()
        .toString(36)
        .substr(2, 9),
      position: null,
      hits: [],
      condition: 'new',
      direction: shipDirection[Math.floor(Math.random() * shipDirection.length)]
    },
    {
      type: 'Cruisers',
      id: Math.random()
        .toString(36)
        .substr(2, 9),
      position: null,
      condition: 'new',
      hits: [],
      direction: shipDirection[Math.floor(Math.random() * shipDirection.length)]
    },
    {
      type: 'Cruisers',
      id: Math.random()
        .toString(36)
        .substr(2, 9),
      position: null,
      hits: [],
      condition: 'new',
      direction: shipDirection[Math.floor(Math.random() * shipDirection.length)]
    },
    {
      type: 'Submarine',
      id: Math.random()
        .toString(36)
        .substr(2, 9),
      position: null,
      hits: [],
      condition: 'new',
      direction: shipDirection[Math.floor(Math.random() * shipDirection.length)]
    }
  ];
  let cells = generateMatrix();
  ships.map(ship => {
    const { direction, type } = ship;
    const availableCells = cells.filter(cell => cell.isAvailable);
    let positionedShip = false;

    const coordinatesAvailableCells = availableCells.map(cell =>
      _.pick(cell, ['xCoordinate', 'yCoordinate'])
    );

    while (!positionedShip) {
      let cellsToFill;

      while (!cellsToFill) {
        const xCoordinate = Math.floor(Math.random() * (9 - 0 + 1)) + 0;
        const yCoordinate = Math.floor(Math.random() * (9 - 0 + 1)) + 0;

        if (type === 'Carrier') {
          cellsToFill = makeCoordinatesObject(
            4,
            direction,
            xCoordinate,
            yCoordinate
          );
        }
        if (type === 'Cruisers') {
          cellsToFill = makeCoordinatesObject(
            3,
            direction,
            xCoordinate,
            yCoordinate
          );
        }
        if (type === 'Submarine') {
          cellsToFill = makeCoordinatesObject(
            2,
            direction,
            xCoordinate,
            yCoordinate
          );
        }
      }

      let isPossibleMatch = false;

      coordinatesAvailableCells.map(cell => {
        cellsToFill.map(cellToFill => {
          if (
            cell.xCoordinate === cellToFill.xCoordinate &&
            cell.yCoordinate === cellToFill.yCoordinate
          ) {
            isPossibleMatch = true;
          }
        });
      });

      if (isPossibleMatch) {
        const shipWithPostion = ship;
        shipWithPostion.position = cellsToFill;

        const newCells = cells.map(cell => {
          const c = cell;
          const isFill = cellsToFill.find(
            cellToFill =>
              cellToFill.xCoordinate === cell.xCoordinate &&
              cellToFill.yCoordinate === cell.yCoordinate
          );
          if (isFill) {
            c.isAvailable = false;
          }
          return c;
        });

        positionedShip = true;

        cells = newCells;
        return shipWithPostion;
      }
    }
  });

  return {
    ships,
    cells
  };
};

export const getNextAvailableCellForImpact = (
  possibleImpact,
  availableUserCells
) => {
  return availableUserCells.some(
    cell =>
      cell.xCoordinate === possibleImpact.xCoordinate &&
      cell.yCoordinate === possibleImpact.yCoordinate
  );
};

export const calculateNextImpact = (
  target,
  lastImpact,
  possibleDirections,
  lastDirection
) => {
  let nextImpact;
  let direction;

  if (!lastDirection) {
    direction = _.sample(possibleDirections);
  } else {
    direction = lastDirection;
  }

  const initialPoint = lastImpact || target;

  if (direction === 'left') {
    nextImpact = {
      xCoordinate: initialPoint.xCoordinate,
      yCoordinate: initialPoint.yCoordinate - 1
    };
  }

  if (direction === 'right') {
    nextImpact = {
      xCoordinate: initialPoint.xCoordinate,
      yCoordinate: initialPoint.yCoordinate + 1
    };
  }

  if (direction === 'down') {
    nextImpact = {
      xCoordinate: initialPoint.xCoordinate + 1,
      yCoordinate: initialPoint.yCoordinate
    };
  }

  if (direction === 'up') {
    nextImpact = {
      xCoordinate: initialPoint.xCoordinate - 1,
      yCoordinate: initialPoint.yCoordinate
    };
  }

  nextImpact.direction = direction;

  return nextImpact;
};

export const getPossibleDirections = (availableUserCells, lastImpact) => {
  const possibleDirections = [];

  const aboveCell = availableUserCells.find(
    cell =>
      cell.xCoordinate === lastImpact.xCoordinate + 1 &&
      cell.yCoordinate === lastImpact.yCoordinate
  );

  const belowCell = availableUserCells.find(
    cell =>
      cell.xCoordinate === lastImpact.xCoordinate + -1 &&
      cell.yCoordinate === lastImpact.yCoordinate
  );

  const rightCell = availableUserCells.find(
    cell =>
      cell.xCoordinate === lastImpact.xCoordinate &&
      cell.yCoordinate === lastImpact.yCoordinate + 1
  );
  const leftCell = availableUserCells.find(
    cell =>
      cell.xCoordinate === lastImpact.xCoordinate &&
      cell.yCoordinate === lastImpact.yCoordinate - 1
  );

  if (lastImpact.xCoordinate > 0 && aboveCell && aboveCell.condition === null) {
    possibleDirections.push('up');
  }
  if (lastImpact.xCoordinate < 9 && belowCell && belowCell.condition === null) {
    possibleDirections.push('down');
  }
  if (lastImpact.yCoordinate > 0 && leftCell && leftCell.condition === null) {
    possibleDirections.push('left');
  }
  if (lastImpact.yCoordinate < 9 && rightCell && rightCell.condition === null) {
    possibleDirections.push('right');
  }

  return possibleDirections;
};

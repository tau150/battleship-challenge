import _ from 'lodash';

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

  let ships = [
    {
      type: 'Carrier',
      id: Math.random()
        .toString(36)
        .substr(2, 9),
      position: null,
      hits: null,
      direction: shipDirection[Math.floor(Math.random() * shipDirection.length)]
    },
    {
      type: 'Cruisers',
      id: Math.random()
        .toString(36)
        .substr(2, 9),
      position: null,
      hits: null,
      direction: shipDirection[Math.floor(Math.random() * shipDirection.length)]
    },
    {
      type: 'Cruisers',
      id: Math.random()
        .toString(36)
        .substr(2, 9),
      position: null,
      hits: null,
      direction: shipDirection[Math.floor(Math.random() * shipDirection.length)]
    },
    {
      type: 'Cruisers',
      id: Math.random()
        .toString(36)
        .substr(2, 9),
      position: null,
      hits: null,
      direction: shipDirection[Math.floor(Math.random() * shipDirection.length)]
    },
    {
      type: 'Submarine',
      id: Math.random()
        .toString(36)
        .substr(2, 9),
      position: null,
      hits: null,
      direction: shipDirection[Math.floor(Math.random() * shipDirection.length)]
    }
  ];
  let cells = generateMatrix();
  const shipsWithPosition = [];
  ships.forEach(ship => {
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

      coordinatesAvailableCells.forEach(cell => {
        cellsToFill.forEach(cellToFill => {
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
        shipsWithPosition.push(shipWithPostion);

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
        ships = shipsWithPosition;
      }
    }
  });

  return {
    ships,
    cells
  };
};

const generateMatrix = () => {
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

export default generateMatrix;

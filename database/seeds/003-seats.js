exports.seed = function (knex) {
  return knex("seats")
    .then(function () {
      const letters = ["A", "B", "C", "D", "E", "F", "G", "H"]
      const seatsLoop = (letter, number) => {
        return {
          row: letter,
          column: number,
          seatName: `${letter}${number}`,
          available: true,
          handicap: false
        }
      }
      function seatsNumber() {
        let seats = []
        letters.map(lett => {
          for (let i = 0; i < 8; i++) {
            seats.push(seatsLoop(lett, i))
          }
        })
        return (seats)
      }

      return knex("seats").insert(seatsNumber())
    });
};

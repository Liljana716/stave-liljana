const {
  calculateOdds,
  calculateWinnings,
  calculateCombinedOdds,
  validateBetSlip,
  filterWinningBets,
} = require("../src/betting");

describe("calculateOdds", () => {
  test("calculates odds correctly", () => {
    expect(calculateOdds(0.5)).toBe(2.0);
  });

  test("throws for probability <= 0", () => {
    expect(() => calculateOdds(0)).toThrow();
  });

  test("throws for probability >= 1", () => {
    expect(() => calculateOdds(1)).toThrow();
  });
});

describe("calculateWinnings", () => {
  test("calculates winnings correctly", () => {
    expect(calculateWinnings(10, 2)).toBe(20.0);
  });

  test("throws for stake <= 0", () => {
    expect(() => calculateWinnings(0, 2)).toThrow();
  });

  test("throws for odds <= 1", () => {
    expect(() => calculateWinnings(10, 1)).toThrow();
  });
});

describe("calculateCombinedOdds", () => {
  test("multiplies odds", () => {
    expect(calculateCombinedOdds([1.5, 2])).toBe(3.0);
  });

  test("throws for invalid odds", () => {
    expect(() => calculateCombinedOdds([1])).toThrow();
  });

  test("throws for empty array", () => {
    expect(() => calculateCombinedOdds([])).toThrow();
  });
});

describe("validateBetSlip", () => {
  test("returns true for valid bets", () => {
    expect(validateBetSlip([{ stake: 10, odds: 2.5, team: "A" }])).toBe(true);
  });

  test("returns false for invalid bets", () => {
    expect(validateBetSlip([{ stake: 0, odds: 2, team: "A" }])).toBe(false);
  });
});

describe("filterWinningBets", () => {
  test("filters correctly", () => {
    const bets = [
      { id: 1, isWon: true },
      { id: 2, isWon: false },
    ];
    expect(filterWinningBets(bets)).toEqual([{ id: 1, isWon: true }]);
  });

  test("returns [] on invalid input", () => {
    expect(filterWinningBets(null)).toEqual([]);
  });
});

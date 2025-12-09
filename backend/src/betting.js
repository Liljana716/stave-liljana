function calculateOdds(probability) {
  if (typeof probability !== "number") {
    throw new Error("Probability must be a number.");
  }
  if (probability <= 0 || probability >= 1) {
    throw new Error("Probability must be between 0 and 1.");
  }
  return +(1 / probability).toFixed(2);
}

function calculateWinnings(stake, odds) {
  if (stake <= 0) {
    throw new Error("Stake must be positive.");
  }
  if (odds <= 1) {
    throw new Error("Odds must be greater than 1.");
  }
  return +(stake * odds).toFixed(2);
}

function calculateCombinedOdds(oddsArray) {
  if (!Array.isArray(oddsArray) || oddsArray.length === 0) {
    throw new Error("At least one odds value is required.");
  }

  return +oddsArray.reduce((acc, o) => {
    if (typeof o !== "number") {
      throw new Error("Odds must be numbers.");
    }
    if (o <= 1) throw new Error("Each odds must be greater than 1.");
    return acc * o;
  }, 1).toFixed(2);
}

function validateBetSlip(bets) {
  if (!Array.isArray(bets) || bets.length === 0) return false;

  return bets.every((bet) => {
    if (!bet) return false;
    const { stake, odds, team } = bet;
    if (typeof team !== "string" || team.trim() === "") return false;
    if (typeof stake !== "number" || stake <= 0) return false;
    if (typeof odds !== "number" || odds <= 1) return false;
    return true;
  });
}

function filterWinningBets(bets) {
  if (!Array.isArray(bets)) return [];
  return bets.filter((b) => b && b.isWon === true);
}

module.exports = {
  calculateOdds,
  calculateWinnings,
  calculateCombinedOdds,
  validateBetSlip,
  filterWinningBets,
};

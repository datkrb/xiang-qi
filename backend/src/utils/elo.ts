export function calculateElo(
  playerRating: number,
  opponentRating: number,
  playerWon: boolean,
): number {
  const K = 32; // K-factor determines max points gained/lost
  const expectedScore =
    1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
  const actualScore = playerWon ? 1 : 0;

  return Math.round(playerRating + K * (actualScore - expectedScore));
}

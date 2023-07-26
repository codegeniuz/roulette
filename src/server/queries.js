import HttpError from '@wasp/core/HttpError.js'

export const getUserBets = async (args, context) => {
  if (!context.user) { throw new HttpError(401) }

  const bets = await context.entities.Bet.findMany({
    where: {
      user: { id: context.user.id }
    }
  });

  return bets;
}

export const getUserBalance = async (args, context) => {
  if (!context.user) { throw new HttpError(401) }

  const bets = await context.entities.Bet.findMany({
    where: { userId: context.user.id }
  });

  const balance = bets.reduce((total, bet) => total + bet.amount, 0);

  return balance;
}

export const placeBet = async (args, context) => {
  if (!context.user) { throw new HttpError(401) }

  const { amount, number } = args;

  const user = await context.entities.User.findUnique({
    where: { id: context.user.id }
  });

  if (user.balance < amount) { throw new HttpError(400, 'Insufficient balance') }

  const bet = await context.entities.Bet.create({
    data: {
      amount,
      number,
      user: { connect: { id: context.user.id } }
    }
  });

  await context.entities.User.update({
    where: { id: context.user.id },
    data: { balance: user.balance - amount }
  });

  return bet;
}

export const spinWheel = async (args, context) => {
  if (!context.user) { throw new HttpError(401) }

  const winningNumber = Math.floor(Math.random() * 37);

  const bets = await context.entities.Bet.findMany({
    where: { number: winningNumber }
  });

  const totalWinningAmount = bets.reduce((total, bet) => total + bet.amount * 36, 0);

  await context.entities.User.update({
    where: { id: context.user.id },
    data: { balance: context.user.balance + totalWinningAmount }
  });

  return winningNumber;
}
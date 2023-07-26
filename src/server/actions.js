import HttpError from '@wasp/core/HttpError.js'


export const placeBet = async (args, context) => {
  if (!context.user) { throw new HttpError(401) };

  const { amount, number } = args;

  const bet = await context.entities.Bet.create({
    data: {
      amount,
      number,
      user: { connect: { id: context.user.id } }
    }
  });

  return bet;
}

export const spinWheel = async (args, context) => {
  const randomNumber = Math.floor(Math.random() * 37);
  return randomNumber;
}
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@wasp/queries';
import { useAction } from '@wasp/actions';
import placeBet from '@wasp/actions/placeBet';
import spinWheel from '@wasp/actions/spinWheel';
import getUserBets from '@wasp/queries/getUserBets';
import getUserBalance from '@wasp/queries/getUserBalance';

export function Roulette() {
  const { data: bets, isLoading: betsLoading, error: betsError } = useQuery(getUserBets);
  const { data: balance, isLoading: balanceLoading, error: balanceError } = useQuery(getUserBalance);
  const placeBetFn = useAction(placeBet);
  const spinWheelFn = useAction(spinWheel);
  const [betAmount, setBetAmount] = useState(0);
  const [betNumber, setBetNumber] = useState(0);

  if (betsLoading || balanceLoading) return 'Loading...';
  if (betsError || balanceError) return 'Error: ' + (betsError || balanceError);

  const handlePlaceBet = () => {
    placeBetFn({ amount: betAmount, number: betNumber });
    setBetAmount(0);
    setBetNumber(0);
  };

  const handleSpinWheel = () => {
    spinWheelFn();
  };

  return (
    <div className='p-4'>
      <div className='mb-4'>
        <p>Balance: ${balance}</p>
      </div>
      <div className='mb-4'>
        <input
          type='number'
          placeholder='Amount'
          className='px-1 py-2 border rounded text-lg'
          value={betAmount}
          onChange={(e) => setBetAmount(e.target.value)}
        />
        <input
          type='number'
          placeholder='Number'
          className='px-1 py-2 border rounded text-lg'
          value={betNumber}
          onChange={(e) => setBetNumber(e.target.value)}
        />
        <button
          onClick={handlePlaceBet}
          className='bg-blue-500 hover:bg-blue-700 px-2 py-2 text-white font-bold rounded'
        >
          Place Bet
        </button>
      </div>
      <div>
        <button
          onClick={handleSpinWheel}
          className='bg-green-500 hover:bg-green-700 px-2 py-2 text-white font-bold rounded'
        >
          Spin Wheel
        </button>
      </div>
    </div>
  );
}
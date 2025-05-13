
import React from 'react';

const UserRanking = ({ showMonthly = false, limit = 5 }) => {
  return (
    <div className="p-4 bg-premium-dark/50 border border-premium-light/10 rounded-lg">
      <h2 className="text-lg font-bold mb-3">Ranking użytkowników</h2>
      <p className="text-premium-light/70">
        Ranking użytkowników jest obecnie wyłączony. Zostanie zaimplementowany z integracją Sanity.io.
      </p>
    </div>
  );
};

export default UserRanking;

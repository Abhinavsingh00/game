import React from 'react';
import type { SaveState } from '../types/game';
import { SKINS } from '../utils/shop';
import { ArrowLeft, Coins, Check } from 'lucide-react';

interface ShopProps {
  saveState: SaveState;
  buySkin: (id: string) => void;
  equipSkin: (id: string) => void;
  goHome: () => void;
}

export const Shop: React.FC<ShopProps> = ({ saveState, buySkin, equipSkin, goHome }) => {
  return (
    <div className="screen-container">
      <div className="screen-header glass-card">
        <button className="back-btn" onClick={goHome}><ArrowLeft size={18} /> Back</button>
        <h2>Skin Shop</h2>
        <div className="coins-badge"><Coins size={18} /> {saveState.coins}</div>
      </div>
      
      <div className="shop-grid">
        {SKINS.map((skin) => {
          const isUnlocked = saveState.unlockedSkins.includes(skin.id);
          const isEquipped = saveState.equippedSkin === skin.id;
          const canAfford = saveState.coins >= skin.cost;
          
          return (
            <div key={skin.id} className={`shop-card glass-card ${isEquipped ? 'equipped' : ''}`}>
              <div className="skin-preview" style={{ background: `linear-gradient(135deg, ${skin.colorHead}, ${skin.colorBody})`, boxShadow: `0 0 15px ${skin.glowColor}` }}></div>
              <h3 className="skin-name">{skin.name}</h3>
              <p className="skin-desc">{skin.description}</p>
              
              <div className="shop-actions">
                {isEquipped ? (
                  <button className="shop-btn equipped-btn" disabled><Check size={16} /> Equipped</button>
                ) : isUnlocked ? (
                  <button className="shop-btn equip-btn" onClick={() => equipSkin(skin.id)}>Equip</button>
                ) : (
                  <button className={`shop-btn buy-btn ${!canAfford ? 'disabled' : ''}`} onClick={() => canAfford && buySkin(skin.id)} disabled={!canAfford}>
                    <Coins size={16} /> {skin.cost}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Shop;

import express from 'express';

const router = express.Router();

router.post('/advice', async (req, res) => {
  try {
    const { investorType, cryptoAssets } = req.body;
    
    let advice = `Based on your ${investorType} investor profile and tracking for ${cryptoAssets?.join(', ') || 'selected assets'}: `;
    if (investorType === 'conservative') {
      advice += 'It is recommended to maintain broad diversification and focus strictly on major, stable assets.';
    } else if (investorType === 'aggressive') {
      advice += 'There is room for high-growth opportunities, but ensure you maintain strict risk management protocols.';
    } else {
      advice += 'It is recommended to perform periodic portfolio rebalancing and closely monitor market trends.';
    }

    res.status(200).json({ advice });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate AI advice' });
  }
});

export default router;
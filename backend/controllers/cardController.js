import cardModel from "../models/cardModel.js";
// import { updateCardAfterReview } from "../utils/spacedRepetition.js";

// add new card
export const addcard = async (req, res) => {
  const card = new cardModel({
    question: req.body.question,
    answer: req.body.answer,
    deckId: req.body.deckId,
    userId: req.body.userId,
    easeFactor: req.body.easeFactor,
    interval: req.body.interval,
    repetitions: req.body.repetitions,
    dueDate: req.body.nextReview,
  });

  try {
    await card.save();
    res.json({ success: true, message: "Card added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// number of cards in each deck

export const getCardsByDeck = async (req, res) => {
  const { deckId } = req.params;
  try {
    const cards = await cardModel.find({ deckId });
    res.json({ success: true, data: cards });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching cards" });
  }
};

// delete card

export const deletecard = async (req, res) => {
  const { cardId } = req.params;
  try {
    await cardModel.findByIdAndDelete(cardId);
    res.json({ success: true, message: "Card deleted" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error deleting card" });
  }
};

// fetch number of cards of user

export const userCardsCount = async (req, res) => {
  try {
    const cardsCount = await cardModel.countDocuments({ userId: req.userId });
    res.json({ success: true, data: cardsCount });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error while fetching number of cards",
    });
  }
};

export const getDueCards = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueCards = await cardModel.find({
      userId: req.userId,
      dueDate: { $lte: new Date() },
      isSuspended: false,
    });

    const reviewedToday = await cardModel.countDocuments({
      userId: req.userId,
      lastReviewed: { $gte: today },
    });

    const totalDueToday = dueCards.length + reviewedToday;

    res.json({
      success: true,
      data: dueCards,
      totalTodayCount: totalDueToday,
      reviewedTodayCount: reviewedToday,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching due cards" });
  }
};



// Update card review using SM-2
export const updateCardReview = async (req, res) => {
  const { cardId, quality } = req.body;
  try {
    const card = await cardModel.findById(cardId);
    if (!card) return res.json({ success: false, message: "Card not found" });

    // Apply SM-2
    let ef = card.easeFactor;
    if (quality >= 3) {
      card.repetitions += 1;
      if (card.repetitions === 1) {
        card.interval = 1;
      } else if (card.repetitions === 2) {
        card.interval = 6;
      } else {
        card.interval = Math.round(card.interval * ef);
      }
      ef = ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    } else {
      card.repetitions = 0;
      card.interval = 1;
    }

    card.easeFactor = Math.max(1.3, ef);
    card.dueDate = new Date(Date.now() + card.interval * 24 * 60 * 60 * 1000);
    card.lastReviewed = new Date();
    card.lastQuality = quality;

    await card.save();

    res.json({ success: true, data: card });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Failed to update card review" });
  }
};
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const SECRET_KEY = process.env.JWT_SECRET || 'capital-care-secret-key-change-this';

// Middleware to verify token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// GET /api/user/history
router.get('/history', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: "User not found" });
        
        // Return reverse chronological order (newest first)
        const history = user.history || [];
        res.json({ history: history.reverse() });
    } catch (e) {
        console.error("Get history error", e);
        res.status(500).json({ error: "Failed to fetch history" });
    }
});

// POST /api/user/history
router.post('/history', authenticateToken, async (req, res) => {
    try {
        const { symbol } = req.body;
        if (!symbol) return res.status(400).json({ error: "Symbol is required" });

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        // Remove if exists (to move to top)
        let newHistory = user.history.filter(item => item !== symbol);
        newHistory.push(symbol);

        // Limit to last 10
        if (newHistory.length > 10) {
            newHistory = newHistory.slice(newHistory.length - 10);
        }

        user.history = newHistory;
        await user.save();

        res.json({ success: true, history: user.history });
    } catch (e) {
        console.error("Save history error", e);
        res.status(500).json({ error: "Failed to save history" });
    }
});

// POST /api/user/upgrade
router.post('/upgrade', authenticateToken, async (req, res) => {
    try {
        const { plan } = req.body;
        const VALID_PLANS = ['free', 'essential', 'pro'];
        
        if (!plan || !VALID_PLANS.includes(plan)) {
            return res.status(400).json({ error: "Invalid plan" });
        }

        const user = await User.findByIdAndUpdate(
            req.user.id, 
            { plan }, 
            { new: true }
        ).select('-password');
        
        if (!user) return res.status(404).json({ error: "User not found" });

        res.json({ success: true, user });
    } catch (e) {
        console.error("Upgrade error", e);
        res.status(500).json({ error: "Failed to upgrade plan" });
    }
});

module.exports = router;

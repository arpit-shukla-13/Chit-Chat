const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); // Import Mongoose here
const Message = require('../models/Message');
const authMiddleware = require('../middleware/authMiddleware');

// GET /api/conversations
// Fetches a list of the user's most recent conversations
router.get('/', authMiddleware, async (req, res) => {
    try {
        // Convert the string ID from the token into a MongoDB ObjectId
        const loggedInUserId = new mongoose.Types.ObjectId(req.user.id);

        const conversations = await Message.aggregate([
            // 1. Find all messages involving the logged-in user
            {
                $match: {
                    $or: [{ sender: loggedInUserId }, { recipient: loggedInUserId }]
                }
            },
            // 2. Sort messages by timestamp to get the latest one on top
            {
                $sort: { timestamp: -1 }
            },
            // 3. Group messages by conversation partner
            {
                $group: {
                    _id: {
                        $cond: {
                            if: { $eq: ['$sender', loggedInUserId] },
                            then: '$recipient',
                            else: '$sender'
                        }
                    },
                    lastMessage: { $first: '$$ROOT' }
                }
            },
            // 4. Get user details for the conversation partner
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'otherUser'
                }
            },
            // 5. Unwind the otherUser array
            {
                $unwind: '$otherUser'
            },
            // 6. Project the final fields
            {
                $project: {
                    _id: 1,
                    lastMessage: 1,
                    otherUser: { _id: 1, username: 1 }
                }
            },
            // 7. Sort the conversations by the last message's timestamp
            {
                $sort: { 'lastMessage.timestamp': -1 }
            }
        ]);

        res.json(conversations);

    } catch (err) {
        // Log the actual error on the server for debugging
        console.error("Error in /api/conversations:", err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
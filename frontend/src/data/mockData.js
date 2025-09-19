// This file contains dummy data to build the UI without a backend.

// Assume our logged-in user is 'Arpit'
export const loggedInUserId = "user_arpit";

// This is the data for the Chat List Sidebar.
// It shows a list of active conversations.
export const dummyConversations = [
  {
    _id: "convo_1", // A unique ID for the conversation
    otherUser: {
      _id: "user_rohan",
      username: "Rohan Sharma",
    },
    lastMessage: {
      text: "Sure, let's catch up tomorrow!",
      timestamp: "2025-09-19T18:30:00Z",
    },
  },
  {
    _id: "convo_2",
    otherUser: {
      _id: "user_priya",
      username: "Priya Singh",
    },
    lastMessage: {
      text: "Haha, that's hilarious 😂",
      timestamp: "2025-09-19T16:45:00Z",
    },
  },
  {
    _id: "convo_3",
    otherUser: {
      _id: "user_vikas",
      username: "Vikas Kumar",
    },
    lastMessage: {
      text: "You sent a photo.",
      timestamp: "2025-09-18T11:20:00Z",
    },
  },
];


// This is the data for the main chat window.
// It holds the message history for a specific conversation.
// We'll simulate fetching this when a user is clicked.
export const dummyChatHistory = {
  // Key is the 'otherUser's ID'
  "user_rohan": [
    {
      _id: "msg1",
      sender: { _id: "user_rohan", username: "Rohan Sharma" },
      text: "Hey Arpit, are you free this weekend?",
      timestamp: "2025-09-19T18:25:00Z",
    },
    {
      _id: "msg2",
      sender: { _id: "user_arpit", username: "Arpit" },
      text: "Hey Rohan! Not sure yet, what's up?",
      timestamp: "2025-09-19T18:26:00Z",
    },
    {
      _id: "msg3",
      sender: { _id: "user_rohan", username: "Rohan Sharma" },
      text: "Was thinking of going for that new superhero movie.",
      timestamp: "2025-09-19T18:28:00Z",
    },
    {
        _id: "msg4",
        sender: { _id: "user_arpit", username: "Arpit" },
        text: "Sure, let's catch up tomorrow!",
        timestamp: "2025-09-19T18:30:00Z",
    },
  ],
  "user_priya": [
    {
        _id: "msg5",
        sender: { _id: "user_priya", username: "Priya Singh" },
        text: "Did you see that meme I sent you?",
        timestamp: "2025-09-19T16:44:00Z",
    },
    {
        _id: "msg6",
        sender: { _id: "user_arpit", username: "Arpit" },
        text: "Haha, that's hilarious 😂",
        timestamp: "2025-09-19T16:45:00Z",
    },
  ]
};

// ... purane data ke neeche yeh add karein ...

// This is a list of ALL users on the platform for the "New Message" search.
export const dummyAllUsers = [
  { _id: "user_rohan", username: "Rohan Sharma" },
  { _id: "user_priya", username: "Priya Singh" },
  { _id: "user_vikas", username: "Vikas Kumar" },
  { _id: "user_sneha", username: "Sneha Patil" },
  { _id: "user_amit", username: "Amit Desai" },
];
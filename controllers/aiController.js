const openrouter = require('../config/openrouter');
const User = require('../models/User');

// ✅ 1. AI Matchmaker (Compatibility Check)
exports.checkCompatibility = async (req, res) => {
  const { userId1, userId2 } = req.body;

  try {
    const user1 = await User.findById(userId1).select('-password');
    const user2 = await User.findById(userId2).select('-password');

    if (!user1 || !user2) {
      return res.status(404).json({ error: "User not found" });
    }

    const prompt = `
      You are an expert dating matchmaker. Analyze these two users and rate their compatibility (0-100).
      Also, give a short, friendly explanation (2-3 sentences) about why they might be a good match.
      
      User 1:
      Name: ${user1.name}
      Age: ${user1.age}
      Gender: ${user1.gender}
      Looking For: ${user1.lookingFor}
      Bio: ${user1.bio}
      City: ${user1.city}
      
      User 2:
      Name: ${user2.name}
      Age: ${user2.age}
      Gender: ${user2.gender}
      Looking For: ${user2.lookingFor}
      Bio: ${user2.bio}
      City: ${user2.city}
      
      Respond ONLY in this JSON format (no other text):
      {
        "compatibility": 85,
        "explanation": "Both share a love for travel and have similar life goals."
      }
    `;

    const response = await openrouter.chat.completions.create({
      model: "openrouter/free", // ✅ Yahan change kiya
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const aiText = response.choices[0].message.content;
    
    const jsonMatch = aiText.match(/\{[\s\S]*\}/);
    const result = jsonMatch ? JSON.parse(jsonMatch[0]) : { compatibility: 50, explanation: aiText };

    res.status(200).json(result);
  } catch (error) {
    console.error("AI Compatibility Error:", error);
    res.status(500).json({ error: "AI Service unavailable" });
  }
};

// ✅ 2. AI Ice-Breaker (Chat shuru karne ke liye)
exports.generateIceBreaker = async (req, res) => {
  const { userBio, partnerBio, partnerName } = req.body;

  try {
    const prompt = `
      You are a witty dating coach. Generate 3 short, fun, and engaging ice-breaker messages 
      that someone can send to their match to start a conversation.
      
      My bio: "${userBio}"
      Their name: ${partnerName}
      Their bio: "${partnerBio}"
      
      Keep messages under 100 characters. Make them playful, not creepy.
      Respond ONLY in this JSON format:
      {
        "messages": ["Message 1", "Message 2", "Message 3"]
      }
    `;

    const response = await openrouter.chat.completions.create({
      model: "openrouter/free", // ✅ Yahan change kiya
      messages: [{ role: "user", content: prompt }],
      temperature: 0.9,
    });

    const aiText = response.choices[0].message.content;
    const jsonMatch = aiText.match(/\{[\s\S]*\}/);
    const result = jsonMatch ? JSON.parse(jsonMatch[0]) : { messages: [] };

    res.status(200).json(result);
  } catch (error) {
    console.error("AI Ice-breaker Error:", error);
    res.status(500).json({ error: "AI Service unavailable" });
  }
};

// ✅ 3. AI Bio Generator
exports.generateBio = async (req, res) => {
  const { name, age, interests, lookingFor } = req.body;

  try {
    const prompt = `
      You are a dating profile expert. Write 3 short, catchy, and unique dating bios 
      (under 150 characters each) for a person.
      
      Name: ${name}
      Age: ${age}
      Interests: ${interests}
      Looking for: ${lookingFor}
      
      Make them sound genuine, fun, and not cliché. Avoid "love to laugh" and "looking for partner in crime".
      Respond ONLY in this JSON format:
      {
        "bios": ["Bio 1", "Bio 2", "Bio 3"]
      }
    `;

    const response = await openrouter.chat.completions.create({
      model: "openrouter/free", // ✅ Yahan change kiya
      messages: [{ role: "user", content: prompt }],
      temperature: 0.9,
    });

    const aiText = response.choices[0].message.content;
    const jsonMatch = aiText.match(/\{[\s\S]*\}/);
    const result = jsonMatch ? JSON.parse(jsonMatch[0]) : { bios: [] };

    res.status(200).json(result);
  } catch (error) {
    console.error("AI Bio Error:", error);
    res.status(500).json({ error: "AI Service unavailable" });
  }
};
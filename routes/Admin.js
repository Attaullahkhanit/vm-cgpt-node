const express = require('express')
const router = express.Router()
const alcohlicPerfume = require('../models/alcohlicPerfume')
const user_content = require('../models/user_content')
const Accounts = require('../models/Accounts')
const RegisterUsers = require('../models/Registeration')
const uploadImg = require('../src/uploader') 
const path = require('path')
const axios = require('axios');
const { Configuration, OpenAIApi } = require("openai");
 
  


// all none alcohlic perfume
router.post('/call-chatgpt-api', async (req, res) => { 
 console.log(req.body.prompt, 'req')
const configuration = new Configuration({ apiKey: "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" });
const openai = new OpenAIApi(configuration); 
  
const prompt = req.body.prompt;

  const messages = [
    { role: 'system', content: 'You: ' + prompt },
    { role: 'user', content: prompt }
  ];

  try {
    const response = await openai.createChatCompletion({
      messages,
      model: 'gpt-3.5-turbo',
    });

    const botMessage = response.data.choices[0].message.content;

    res.json({ botMessage });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'An error occurred while calling the OpenAI API.' });
  }
})


// all none alcohlic perfume
router.get('/user_content', async (req, res) => {
  try {
    const noneAlcohlic = await user_content.find()
    res.json(noneAlcohlic)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Get user content by user_id
router.post('/user_content', async (req, res) => {
  try {
    const userContent = await user_content.find({ user_id: req.body.user_id });
    if (!userContent) {
      return res.status(404).json({ message: 'User content not found' });
    }
    res.json(userContent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Creating one
router.post('/user_content_save', async (req, res) => {
  const user_content_save = new user_content({
    user_id: req.body.user_id,
    description: req.body.description,
    boxname: req.body.boxname,
    
  })
  try {
    const user_content = await user_content_save.save()
    res.status(201).json({ message: 'successfuly created', error: false })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})
 
// Deleting One
router.delete(
  '/user_content_deleted/:id',
  removeuser_content,
  async (req, res) => {
    try {
      await res.alcolicPer.remove()
      res.json({ message: 'Deleted record' })
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
  },
)
 
  
// // Updating One
router.patch(
  '/user_content_update/:id',
  alcohlicMiddleFunc,
  async (req, res) => {
    if (req.body.name != null) {
      res.alcolicPer.name = req.body.name
    }
    if (req.body.top != null) {
      res.alcolicPer.top = req.body.top
    }
    if (req.body.middle != null) {
      res.alcolicPer.middle = req.body.middle
    }
    
    try {
      const updateRecord = await alcohlicPerfume.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        { new: true },
      )
      res.json(updateRecord)
    } catch (err) {
      res.status(400).json({ message: err.message })
    }
  },
)

 

// uploading multiple images together
router.post('/images-upload', uploadImg.single('images'), async (req, res) => {
  const fileName = req.file.originalname
  const dirPath =  'https://backend-apis.pasha.org.uk/images/' + fileName

  try {
    return res.status(200).json({
      imgePath: dirPath,
      message: 'images uploaded successfuly.',
      status: true,
    })
  } catch (error) {
    console.log(error)
    res.json(400)
  }
})
 
async function alcohlicMiddleFunc(req, res, next) {
  let alcolicPer
  try {
    alcolicPer = await alcohlicPerfume.findById(req.params.id)
    if (alcolicPer == null) {
      return res.status(404).json({ message: 'Cannot find subscriber' })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }

  res.alcolicPer = alcolicPer
  next()
}
 
async function removeuser_content(req, res, next) {
  let noneAlochlic
  try {
    noneAlochlic = await user_content.findById(req.params.user_id)
    if (noneAlochlic == null) {
      return res.status(404).json({ message: 'Cannot find record' })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }

  res.noneAlochlic = noneAlochlic
  next()
}

module.exports = router

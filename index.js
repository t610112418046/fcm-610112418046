const admin = require('firebase-admin')
const { google } = require('googleapis')
const axios = require('axios')

const MESSAGING_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging'
const SCOPES = [MESSAGING_SCOPE]

const serviceAccount = require('./fcm-9fca5-firebase-adminsdk-pdr2u-0c613c6492.json')
const databaseURL = 'https://fcm-9fca5.firebaseio.com'
const URL =
  'https://fcm.googleapis.com/v1/projects/fcm-9fca5/messages:send'
const deviceToken =
  'djDZhjjZ3Tk9QmZ03dG_PO:APA91bE3JJS_O-8j7QFA-YPzYyjI5Y4x20QPjEkDa2o66gGZgYoxcvb5PAgsXJ92tHtISHmIphKB_GXIf54hxiXxRxs8AJUhYibxq2UBeSmtx4dGTs0LX1RlBy-dXbmSFryrotHZsvAV'
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: databaseURL
})

function getAccessToken() {
  return new Promise(function(resolve, reject) {
    var key = serviceAccount
    var jwtClient = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      SCOPES,
      null
    )
    jwtClient.authorize(function(err, tokens) {
      if (err) {
        reject(err)
        return
      }
      resolve(tokens.access_token)
    })
  })
}

async function init() {
  const body = {
    message: {
      data: { key: 'value' },
      notification: {
        title: 'Notification title',
        body: 'Notification body'
      },
      webpush: {
        headers: {
          Urgency: 'high'
        },
        notification: {
          requireInteraction: 'true'
        }
      },
      token: deviceToken
    }
  }

  try {
    const accessToken = await getAccessToken()
    console.log('accessToken: ', accessToken)
    const { data } = await axios.post(URL, JSON.stringify(body), {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    })
    console.log('name: ', data.name)
  } catch (err) {
    console.log('err: ', err.message)
  }
}

init()
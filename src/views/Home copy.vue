<template>
  <div id="header">
    <h3>HI CONGRATULATIONS</h3>
    <p>{{ profile.displayName }}</p>
    <h3>lineUserId</h3>
    <p>{{ profile.userId }}</p>
    <h3>botUserId:</h3>
    <p>{{ this._botUserId }}</p>
    <h3>ipAddress_queryString</h3>
    <p>{{ this.ipAddress_queryString }}</p>
    <h3>new IpAddress</h3>
    <p>{{ this.new_IPADDRESS }}</p>
    <!-- <h3>userId</h3>
    <p>{{ this.userId_queryString }}</p> -->
  </div>

  <div id="app">
    <!-- <img :src="profile.pictureUrl" width="150" height="150" /> -->
    <img
      :src="profile.pictureUrl ? profile.pictureUrl : 'https://cdn-icons-png.flaticon.com/512/4042/4042356.png'"
      width="150"
      height="150"
    />

    <p id="displayName">{{ profile.displayName }}</p>
    <p id="userId">{{ profile.userId }}</p>
    <p id="os">{{ os }}</p>
    <p id="botUserId">{{ this._botUserId }}</p>
    <!-- <p id="ipAddress">{{ this.ipAddress }}</p>
    <p id="userAgent">{{ this.userAgent }}</p>
    <p id="sessionId">{{ this._sessionId }}</p> -->

    <!-- <p>param : {{ this.getParam }}</p> -->
  </div>
  <!-- <div id="btn">
    <button @click="openLineChat">Line@</button>
    <button @click="saveData">Save data</button>
  </div> -->
</template>

<script>
//import HelloWorld from "./components/HelloWorld.vue";
import liff from '@line/liff'
//import SetDataService from '../../services/SetDataService'
import axios from 'axios'
export default {
  name: 'App',
  components: {
    // HelloWorld,
  },
  data() {
    return {
      imageProfile: '',
      os: '',
      loggedIn: false,
      profile: {},
      displayName: '',
      userId: '',
      alert: '',
      getParam: '',
      //queryString
      client_id: '',
      userId: '',
      userAgent: '',
      ipAddress_queryString: '',
      userId_queryString: '',
      ipAddress: '',
      new_IPADDRESS: '',
      uniqueEventId: '',
      _sessionId: '',
      botUserId: '',
      _botUserId: '',
      //test
      changeUserAgent: '',
      //test: '',
      //line uid
      lineUid: '',
      lineDisplayName: '',
      //data
      data: '',

      // ติดตาม Ads
      _ads_utm_source: '',
      _ads_utm_medium: '',
      _ads_utm_term: '',
      _IP: '',
    }
  },
  // Url Dev = https://liff.line.me/1656824759-PrZzVE5w/?botUserId=Uad26c3928a8f42fb5eb677bf560bf07f
  mounted() {
    this.ipAddress_queryString = this.$route.query.setIpAddress
    this.botUserId = this.$route.query.botUserId
    console.log('this.botUserId--> ', this.$route.query.botUserId)

    console.log('MOUNT-->')

    // get ip address

    //console.log('process.env.VUE_APP_API-->', process.env.VUE_APP_API)
    // console.log('process.env.VUE_APP_ENV_VARIABLE-->', process.env.VUE_APP_ENV_VARIABLE)
    //console.log('process.env.VUE_APP_TITLE-->', process.env.VUE_APP_TITLE)

    //this.userId = this.$route.query.userId
    //console.log('userId-->', this.userId)
    // this.client_id = this.$route.query.client_id
    // console.log('client_id-->', this.client_id)

    // this.userAgent = this.$route.query.userAgent
    // console.log('userAgent-->', this.userAgent)

    // this.ipAddress = this.$route.query.getIpAddress
    // console.log('ipAddress-->', this.ipAddress)
    // this.uniqueEventId = this.$route.query.uniqueEventId
    // console.log('uniqueEventId-->', this.uniqueEventId)
    // this._sessionId = this.$route.query.sessionId
    // console.log('sessionId-->', this._sessionId)

    this._botUserId = this.$route.query.botUserId
    console.log('_botUserId-->', this._botUserId)

    // this._ads_utm_source = this.$route.query.ads_utm_source
    // console.log('_ads_utm_source-->', this._ads_utm_source)

    // this._ads_utm_medium = this.$route.query.ads_utm_medium
    // console.log('_ads_utm_medium-->', this._ads_utm_medium)

    // this.utm_source = this.$route.query.ads_utm_source
    // console.log('utm_source-->', this.utm_source)
    // this.utm_medium = this.$route.query.ads_utm_medium
    // console.log('utm_medium-->', this.utm_medium)

    //run liff
    this.liffAdd()

    this.getIpAddress()
  },
  methods: {
    async getIpAddress() {
      this.new_IPADDRESS = await axios.get('https://api.ipify.org?format=text').then(function (response) {
        console.log('response IP data -->', response.data)
        //return response.text()
        return response.data
      })

      console.log('this.new_IPADDRESS---> ', this.new_IPADDRESS)
    },
    async liffAdd() {
      await liff
        // .init({ liffId: '1656824759-rnzoblkn' })
        .init({ liffId: '1656824759-PrZzVE5w' })
        .then(() => {
          if (!liff.isLoggedIn()) {
            //console.log('Not Login')
            liff.login()
          } else {
            //console.log('Not Login')
            this.loggedIn = liff.isLoggedIn()
            this.os = liff.getOS()

            this.getProfile()
            this.getFriendship()

            console.log('getOS--> ', this.os)

            /// start line chat api
            liff.getProfile().then(profile => {
              console.log('profile--> ', profile)

              this.profile = profile
              this.lineUid = this.profile.userId
              this.lineDisplayName = this.profile.displayName

              var gtm_data = {
                //sample data
                botUserId: this.$route.query.botUserId, //use
                lineUid: this.profile.userId, //use
                lineDisplayName: this.profile.displayName, //use
                ipAddressWebStart: this.ipAddress_queryString,
                //ipAddressWebStart: this.new_IPADDRESS,
                ipAddressChatLine: this.new_IPADDRESS,
                userId: this.userId_queryString,
              }

              // get data from api audience
              this.saveDataUserGtm(gtm_data)
            })
          }
        })
        .catch(err => {
          this.occoredError = 'error:' + err
        })
    },

    async getAllData() {
      try {
        // await axios.get('http://localhost:8080/api/userGtms').then(response => {
        await axios.get('https://mkt-linebot-nodejs-production.up.railway.app/api/userGtms').then(response => {
          console.log('response data-->', response.data)
        })
      } catch (err) {
        console.log('err-->', err)
      }
    },
    async sendGAapiStartChat(data, lineUid, lineDisplayName) {
      console.log('sendGAapiStartChat--> ')
      //***************************** *///TODO Send data to GA4 API
      gtm_data = {
        botUserId: this._botUserId,
        userId: data.userId,
        lineUid: lineUid,
        lineDisplayName: lineDisplayName,
        client_id: data.client_id,
        userAgent: data.userAgent,
        //ipAddressWebStart: data.ipAddress,
        // ipAddressWebStart: this.ipAddress_queryString,
        ipAddressWebStart: this.ipAddress_queryString,
        ipAddressChatLine: this.new_IPADDRESS,
        uniqueEventId: data.uniqueEventId,
        sessionId: data.sessionId,
        timeStamp: data.timeStamp,
        utm_source: data.utm_source,
        utm_medium: data.utm_medium,
        utm_term: data.utm_term,
      }
      try {
        this.HEADER = {
          headers: {
            'Access-Control-Allow-Headers': '*',
            'Content-Type': 'application/json',
          },
        }

        await axios
          .post('https://mkt-linebot-nodejs-production.up.railway.app/api/userGtms/GA4', gtm_data, this.HEADER)
          .then(response => {
            console.log('save data-->', response.data)
            response.send('SEND TO GA4 OK')
          })
      } catch (err) {
        console.log('err--> ', err)
      }

      //***************************** */
    },

    async saveDataUserGtm(gtm_data) {
      console.log('SAVE DATABASE==>')
      console.log('gtm_data==>', gtm_data)

      try {
        this.HEADER = {
          headers: {
            'Access-Control-Allow-Headers': '*',
            'Content-Type': 'application/json',
          },
        }
        // await axios.post('http://localhost:8080/api/userGtms', data, this.HEADER).then(response => {
        // await axios.post(process.env.VUE_APP_API + '/api/userGtms/', gtm_data, this.HEADER).then(response => {
        await axios
          .post('https://mkt-linebot-nodejs-production.up.railway.app/api/userGtms/', gtm_data, this.HEADER)
          .then(response => {
            console.log('save data-->', response.data)
            this.sendMsg()
          })
      } catch (err) {
        console.log('err--> ', err)
      }
    },

    async getProfile() {
      await liff.getProfile().then(profile => {
        console.log('profile--> ', profile)
        this.profile = profile
        this.lineUid = this.profile.userId
        console.log('lineUid-->', this.lineUid)

        this.imageProfile = profile.pictureUrl

        // var gtm_data = {
        //   // sample data
        //   botUserId: this.$route.query.botUserId,
        //   userId: this.$route.query.userId,
        //   client_id: this.$route.query.client_id,
        //   lineUid: this.lineUid,
        //   userAgent: this.$route.query.userAgent,
        //   ipAddress: this.$route.query.ipAddress,
        //   uniqueEventId: this.$route.query.uniqueEventId,
        //   sessionId: this.$route.query.sessionId,
        //   lineDisplayName: this.profile.displayName,
        // }
        //this.checkData(this.lineUid)
        // this.saveData(gtm_data)
        //this.sendGAapiStartChat(gtm_data)
        // this.sendMsg()

        // console.log("this.profile--> ", this.profile);
      })
    },
    async getFriendship() {
      await liff.getFriendship().then(data => {
        console.log('getFriendship--> ', data)
        if (data.friendFlag) {
          console.log('getFriendship--> = true')
          this.alert = data.friendFlag
          // alert(`data.friendFlag--> ${this.alert}`)
          //alert(`Send Message-->`)
          //this.sendMsg()
        }
      })
    },
    async getAccessToken() {
      console.log('token--> ')
      await liff.getAccessToken().then(token => {
        console.log('token--> ', token)
      })
    },

    openLineChat() {
      console.log('openLineChat--> ')
      window.open('https://line.me/ti/p/@889mtekm', '_blank')
    },
    async sendMsg() {
      const profile = await liff.getProfile()
      console.log('userId---> ' + profile.userId)
      // console.log("liff.getContext().type--> ", liff.getContext().type);
      // if (liff.getContext().type !== "none") {
      //   await liff.sendMessages([
      //     {
      //       type: "sticker",
      //       stickerId: 1,
      //       packageId: 1,
      //     },
      //   ]);
      //   alert("Message sent");
      // }

      if (!liff.isInClient()) {
        window.alert('This button is unavailable as LIFF is currently being opened in an external browser.')
      } else {
        await liff
          .sendMessages([
            //{
            //  type: 'sticker',
            //  stickerId: 52002736,
            //  packageId: 11537,
            //},
            // {
            //   type: 'text',
            //   text: `สวัสดีค่ะ คุณ: ${profile.displayName} แจ้งความต้องการเลยค่ะ`,
            // },
            {
              type: 'text',
              text: 'START',
            },
            // {
            //   type: "text",
            //   text: profile.displayName,
            // },
          ])
          .then(() => {
            console.log('Send message')
            //window.alert(`Message sent Register ` + profile.userId)
          })
          .catch(error => {
            window.alert('Error sending message: ' + error)
          })
      }
    },
  },
}
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #fcfcfc;
  margin-top: 10px;
}
#header {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #444242;
  margin-top: 10px;
}

#btn {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #797777;
  margin-top: 60px;
}
</style>

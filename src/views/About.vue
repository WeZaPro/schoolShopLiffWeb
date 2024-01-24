<template>
  <h2>About</h2>
</template>

<script>
import TutorialDataService from '../../services/SetDataService'

export default {
  name: 'add-tutorial',
  data() {
    return {
      tutorials: [],
      currentTutorial: null,
      currentIndex: -1,
      title: '',
    }
  },
  methods: {
    retrieveTutorials() {
      TutorialDataService.getAll()
        .then(response => {
          console.log('response--> ', response.data)
          // this.tutorials = response.data
          // console.log(response.data)
        })
        .catch(e => {
          console.log(e)
        })
    },
  },
  mounted() {
    this.retrieveTutorials()
    console.log('mount--> ')
  },
  created() {
    console.log('create--> ')
  },
}
</script>

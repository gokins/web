<template>
  <div>
    <CCard>
      <CCardHeader>
        User id:
      </CCardHeader>
      <CCardBody>
        123
      </CCardBody>
      <CCardFooter>
        <CButton color="primary" @click="goBack">Back</CButton>
      </CCardFooter>
    </CCard>
  </div>
</template>

<script>
export default {

  data () {
    return {
      usersOpened: null
    }
  },
  methods: {
    goBack () {

    }
  }
}
</script>

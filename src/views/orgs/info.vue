<template>
  <div>test:{{ info.name }}</div>
</template>
<script>
import { UtilCatch, OrgInfo } from "@/assets/js/apis";
export default {
  data() {
    return {
      info: {},
    };
  },
  mounted() {
    if (
      this.$route.params == null ||
      this.$route.params.id == null ||
      this.$route.params.id == ""
    ) {
      this.$router.push("/404");
      return;
    }
    this.getInfo(this.$route.params.id);
  },
  methods: {
    getInfo(id) {
      OrgInfo(id)
        .then((res) => {
          this.info = res.data;
        })
        .catch((err) =>
          UtilCatch(this, err, (err) => {
            this.$router.push("/500");
          })
        );
    },
  },
};
</script>
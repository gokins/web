<template>
  <div>
    <CRow>
      <CCol sm="2"></CCol>
      <CCol sm="8">
        <CCard>
          <CCardHeader>
            <strong>组织信息 </strong> <small>Org</small>
            <!-- <div class="card-header-actions"></div> -->
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol sm="12">
                <CInput label="名称" placeholder="请输入组织名称" Max="10" />
              </CCol>
            </CRow>
            <CRow>
              <CCol sm="12">
                <CInput label="描述" placeholder="请输入组织描述" />
              </CCol>
            </CRow>
            <CRow>
              <CCol sm="6">
                <CInputCheckbox label="是否公开" />
              </CCol>
            </CRow>
            <CRow>
              <CCol sm="6">
                <CButton color="info" @click="subFun()">提交</CButton>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
    <CRow>
      <CCol sm="6">
        <CCard>
          <CCardHeader>
            <strong>Company </strong><small>Form</small>
          </CCardHeader>
          <CCardBody>
            <CInput label="Company" placeholder="Enter your company name" />
            <CInput label="VAT" placeholder="PL1234567890" />
            <CInput label="Street" placeholder="Enter street name" />
            <CRow>
              <CCol sm="8">
                <CInput label="City" placeholder="Enter your city" />
              </CCol>
              <CCol sm="4">
                <CInput label="Postal code" placeholder="Postal code" />
              </CCol>
            </CRow>
            <CInput label="Country" placeholder="Country name" />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>
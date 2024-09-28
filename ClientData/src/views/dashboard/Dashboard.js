import React, { useState } from 'react'
import { CCard, CCardBody, CCol, CRow, CFormSelect, CFormInput } from '@coreui/react'
import logo from '../../assets/images/logo.png' 

const Dashboard = () => {
  const [startTime, setStartTime] = useState('08:00 AM')
  const [endTime, setEndTime] = useState('05:00 PM')
  const [employees, setEmployees] = useState(10)
  const [sales, setSales] = useState(1000)

  const times = [
    '12:00 AM', '01:00 AM', '02:00 AM', '03:00 AM', '04:00 AM', '05:00 AM', '06:00 AM',
    '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM',
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM',
    '09:00 PM', '10:00 PM', '11:00 PM'
  ]

  const convertToNumber = (time) => {
    const [hours, minutes] = time.split(':')
    const period = time.slice(-2)
    let hourNum = parseInt(hours)

    if (period === 'PM' && hourNum !== 12) {
      hourNum += 12
    } else if (period === 'AM' && hourNum === 12) {
      hourNum = 0
    }

    return hourNum * 100 + parseInt(minutes.slice(0, 2))
  }

  const filteredEndTimes = times.filter(time => convertToNumber(time) > convertToNumber(startTime))

  return (
    <div>
      <CRow>
        <CCol xs={12}>
          <CCard>
            <CCardBody className="text-center">
              <h1>Client Data UI</h1>
              <p>Welcome to the NetMx´s client data interface, for us to be able to deliver predictions and data anaylisis for your buisness, please help us by inputting the data in the fields below. </p>

              {/* Operating Hours Section */}
              <div className="mt-4">
                <h5>Select Operating Hours</h5>

                <CRow className="justify-content-center mt-3">
                  <CCol xs={4}>
                    <CFormSelect
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                    >
                      {times.map((time, index) => (
                        <option key={index} value={time}>
                          {time}
                        </option>
                      ))}
                    </CFormSelect>
                  </CCol>

                  <CCol xs={4}>
                    <CFormSelect
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      disabled={filteredEndTimes.length === 0}
                    >
                      {filteredEndTimes.length > 0 ? (
                        filteredEndTimes.map((time, index) => (
                          <option key={index} value={time}>
                            {time}
                          </option>
                        ))
                      ) : (
                        <option>No available times</option>
                      )}
                    </CFormSelect>
                  </CCol>
                </CRow>

                <div className="mt-4">
                  <p>Operating Hours: {startTime} - {endTime}</p>
                </div>
              </div>

              {/* Number of Employees and Daily Sales */}
              <div className="mt-4">
                <h5>Enter Daily Metrics</h5>

                <CRow className="justify-content-center mt-3">
                  <CCol xs={4}>
                    <label htmlFor="employees">Number of Employees</label>
                    <CFormInput
                      type="number"
                      id="employees"
                      value={employees}
                      onChange={(e) => setEmployees(e.target.value)}
                      min="1"
                    />
                  </CCol>

                  <CCol xs={4}>
                    <label htmlFor="sales">Daily Sales ($)</label>
                    <CFormInput
                      type="number"
                      id="sales"
                      value={sales}
                      onChange={(e) => setSales(e.target.value)}
                      min="0"
                    />
                  </CCol>
                </CRow>

                <div className="mt-4">
                  <p>Employees: {employees}</p>
                  <p>Daily Sales: ${sales}</p>
                </div>
              </div>

              {/* New Row for Logo */}
              <CRow className="justify-content-end mt-4">
                <CCol xs={2} className="text-right">
                  <img
                    src={logo}
                    alt="Company Logo"
                    style={{
                      width: '150px',  // Adjust the size of the image
                      height: 'auto'
                    }}
                  />
                </CCol>
              </CRow>

              <CRow className="justify-content-end mt-5">
                <p>Remember your privacy is important for us, which is why none of this data will be shared with us. </p>
              </CRow>

            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  )
}

export default Dashboard

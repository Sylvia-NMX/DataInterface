import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';  
import { CCard, CCardBody, CCol, CRow, CFormSelect, CFormInput, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CFormCheck, CButton } from '@coreui/react';
import logo from '../../assets/images/logo.png';

const Dashboard = () => {
  const { t } = useTranslation();  
  const [startTime, setStartTime] = useState('08:00 AM');
  const [endTime, setEndTime] = useState('05:00 PM');
  const [employees, setEmployees] = useState(10);
  const [dailySales, setSales] = useState(1000);
  const [hourlySales, setHourlySales] = useState({});  
  const [breaks, setBreaks] = useState({});  
  const [submissionMessage, setSubmissionMessage] = useState('');  

  const times = [
    '12:00 AM', '01:00 AM', '02:00 AM', '03:00 AM', '04:00 AM', '05:00 AM', '06:00 AM',
    '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM',
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM',
    '09:00 PM', '10:00 PM', '11:00 PM'
  ];

  const convertToNumber = (time) => {
    const [hours, minutes] = time.split(':');
    const period = time.slice(-2);
    let hourNum = parseInt(hours);

    if (period === 'PM' && hourNum !== 12) {
      hourNum += 12;
    } else if (period === 'AM' && hourNum === 12) {
      hourNum = 0;
    }

    return hourNum * 100 + parseInt(minutes.slice(0, 2));
  };

  const filteredEndTimes = times.filter(time => convertToNumber(time) > convertToNumber(startTime));

  const selectedHours = times.filter(
    (time) => convertToNumber(time) >= convertToNumber(startTime) && convertToNumber(time) <= convertToNumber(endTime)
  );

  const handleHourlySalesChange = (hour, value) => {
    setHourlySales((prevSales) => ({
      ...prevSales,
      [hour]: value,
    }));
  };

  const handleBreakChange = (hour, isChecked) => {
    setBreaks((prevBreaks) => ({
      ...prevBreaks,
      [hour]: isChecked,
    }));

    // If checked, set sales to 0
    if (isChecked) {
      setHourlySales((prevSales) => ({
        ...prevSales,
        [hour]: 0,
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    // Convert the entry timestamp to a compatible format
    const entryTimestampFormatted = new Date().toISOString().slice(0, 19).replace('T', ' ');
  
    // Function to convert 12-hour format to 24-hour format
    const convertTo24Hour = (time) => {
      const [timePart, modifier] = time.split(' ');
      let [hours, minutes] = timePart.split(':');
      if (modifier === 'PM' && hours !== '12') {
        hours = parseInt(hours, 10) + 12;
      }
      if (modifier === 'AM' && hours === '12') {
        hours = '00';
      }
      return `${hours}:${minutes}:00`; // Return in HH:MM:SS format
    };
  
    // Convert opening and closing time to 24-hour format
    const openingTime24 = convertTo24Hour(startTime);
    const closingTime24 = convertTo24Hour(endTime);
  
    const clientData = {
      entryTimestamp: entryTimestampFormatted, // Use the formatted timestamp
      employees,
      dailySales,
      openingTime: openingTime24,
      closingTime: closingTime24,
    };
  
    try {
      // Submit client data
      const response = await fetch('http://localhost:5000/submit-client-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to submit client data');
      }
  
      const data = await response.json();
      const dailyDataId = data.dailyDataId; // Capture the returned ID
  
      // Prepare hourly sales data using the returned daily_data_id
      const hourlySalesData = Object.entries(hourlySales).map(([hour, hourlySales]) => ({
        dailyDataId: dailyDataId, // Use the captured ID
        hourlyTimestamp: convertTo24Hour(hour), // Make sure to provide the correct hour
        hourlySales: hourlySales,
        breaks: breaks[hour] || false,
      }));
  
      // Submit hourly sales data
      const hourlyResponse = await fetch('http://localhost:5000/submit-hourly-sales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ hourlySales: hourlySalesData }),
      });
  
      if (!hourlyResponse.ok) {
        throw new Error('Failed to submit hourly sales data');
      }
  
      // Handle success (e.g., show a success message, reset the form, etc.)
      console.log('Data submitted successfully!');
    } catch (error) {
      console.error('Error:', error);
      // Handle errors appropriately (e.g., show an error message)
    }
  };
  
  
  return (
    <div>
      <CRow>
        <CCol xs={12}>
          <CCard>
            <CCardBody className="text-center">
              <h1>{t('clientDataUI')}</h1>
              <p>{t('welcomeMessage')}</p>

              <div className="mt-4">
                <h5>{t('selectOperatingHours')}</h5>
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
                        <option>{t('noAvailableTimes')}</option>
                      )}
                    </CFormSelect>
                  </CCol>
                </CRow>
                <div className="mt-4">
                  <p>{t('operatingHours')}: {startTime} - {endTime}</p>
                </div>
              </div>

              <div className="mt-4">
                <h5>{t('enterDailyMetrics')}</h5>
                <CRow className="justify-content-center mt-3">
                  <CCol xs={4}>
                    <label htmlFor="employees">{t('numberOfEmployees')}</label>
                    <CFormInput
                      type="number"
                      id="employees"
                      value={employees}
                      onChange={(e) => setEmployees(e.target.value)}
                      min="1"
                    />
                  </CCol>
                  <CCol xs={4}>
                    <label htmlFor="sales">{t('dailySales')}</label>
                    <CFormInput
                      type="number"
                      id="sales"
                      value={dailySales}
                      onChange={(e) => setSales(e.target.value)}
                      min="0"
                    />
                  </CCol>
                </CRow>
                <div className="mt-4">
                  <p>{t('employees')}: {employees}</p>
                  <p>{t('dailySales')}: ${dailySales}</p>
                </div>
              </div>

              <div className="mt-4">
                <h5>{t('salesPerHour')}</h5>
                <CTable responsive>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>{t('hour')}</CTableHeaderCell>
                      <CTableHeaderCell>{t('sales')}</CTableHeaderCell>
                      <CTableHeaderCell>{t('inBreak')}</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {selectedHours.map((hour, index) => (
                      <CTableRow key={index}>
                        <CTableDataCell>{hour}</CTableDataCell>
                        <CTableDataCell>
                          <CFormInput
                            type="number"
                            placeholder={breaks[hour] ? '0' : t('enterSales')}
                            value={breaks[hour] ? 0 : hourlySales[hour] || ''}
                            onChange={(e) => handleHourlySalesChange(hour, e.target.value)}
                            min="0"
                            disabled={breaks[hour]} // Disable input if break is checked
                          />
                        </CTableDataCell>
                        <CTableDataCell>
                          <CFormCheck
                            id={`break-${index}`}
                            checked={breaks[hour] || false}
                            onChange={(e) => handleBreakChange(hour, e.target.checked)}
                          />
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              </div>

              <div className="mt-4">
                <CButton onClick={handleSubmit} color="primary">{t('submit')}</CButton>
                {submissionMessage && <p>{submissionMessage}</p>}
              </div>

              <CRow className="justify-content-end mt-4">
                <CCol xs={2} className="text-right">
                  <img
                    src={logo}
                    alt={t('companyLogo')}
                    style={{
                      width: '150px',
                      height: 'auto'
                    }}
                  />
                </CCol>
              </CRow>

              <CRow className="justify-content-end mt-5">
                <p>{t('privacyMessage')}</p>
              </CRow>

            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  );
};

export default Dashboard;

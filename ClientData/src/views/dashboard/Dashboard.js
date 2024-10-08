import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';  
import { CCard, CCardBody, CCol, CRow, CFormSelect, CFormInput, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CFormCheck, CButton } from '@coreui/react';
import logo from '../../assets/images/logo.png';

const Dashboard = () => {
  const { t } = useTranslation();  
  const [startTime, setStartTime] = useState('08:00 AM');
  const [endTime, setEndTime] = useState('05:00 PM');
  const [employees, setEmployees] = useState(10);
  const [sales, setSales] = useState(1000);
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

  const handleSubmit = () => {
    const data = {
      startTime,
      endTime,
      employees: parseInt(employees),  
      dailySales: parseFloat(sales),    
      hourlySales,                       
      breaks,                            
    };

    fetch('http://localhost:5000/submit-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setSubmissionMessage('Data saved successfully!'); 
      })
      .catch((error) => {
        console.error('Error:', error);
      });
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
                      value={sales}
                      onChange={(e) => setSales(e.target.value)}
                      min="0"
                    />
                  </CCol>
                </CRow>
                <div className="mt-4">
                  <p>{t('employees')}: {employees}</p>
                  <p>{t('dailySales')}: ${sales}</p>
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

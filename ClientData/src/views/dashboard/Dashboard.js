import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';  // Import the useTranslation hook
import { CCard, CCardBody, CCol, CRow, CFormSelect, CFormInput, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CFormCheck, CButton } from '@coreui/react';
import logo from '../../assets/images/logo.png'; // Import the logo image

const Dashboard = () => {
  const { t } = useTranslation();  // Access the t function to translate text
  // Define the state variables, set the default values
  const [startTime, setStartTime] = useState('08:00 AM');
  const [endTime, setEndTime] = useState('05:00 PM');
  const [employees, setEmployees] = useState(10);
  const [dailySales, setSales] = useState(1000);
  const [hourlySales, setHourlySales] = useState({});  
  const [breaks, setBreaks] = useState({});  
  const [submissionMessage, setSubmissionMessage] = useState('');  

  // Define the available times in 12-hour format
  const times = [
    '12:00 AM', '01:00 AM', '02:00 AM', '03:00 AM', '04:00 AM', '05:00 AM', '06:00 AM',
    '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM',
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM',
    '09:00 PM', '10:00 PM', '11:00 PM'
  ];
  // Function to convert the time to a number for comparison, used to filter the end times
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

  // Filter the end times based on the selected start time
  const filteredEndTimes = times.filter(time => convertToNumber(time) > convertToNumber(startTime));

  const selectedHours = times.filter(
    (time) => convertToNumber(time) >= convertToNumber(startTime) && convertToNumber(time) <= convertToNumber(endTime)
  );

  // Function to handle changes in hourly sales for the future table
  const handleHourlySalesChange = (hour, value) => {
    setHourlySales((prevSales) => ({
      ...prevSales,
      [hour]: value,
    }));
  };
// Function to handle changes in the break status
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

  const handleSubmit = async (event) => {// Function to handle form submission in order to send data to MySQL
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
        throw new Error('Failed to submit client data');// Handle errors so the user knows what went wrong
      }
  
      const data = await response.json();
      const dailyDataId = data.dailyDataId; // Capture the returned ID
  
      // Prepare hourly sales data using the returned daily_data_id
      const hourlySalesData = Object.entries(hourlySales).map(([hour, hourlySales]) => ({
        dailyDataId: dailyDataId, // Use the captured ID
        hourlyTimestamp: convertTo24Hour(hour), // Make sure to provide the correct hour
        hourlySales: hourlySales, // Use the sales value
        breaks: breaks[hour] || false,// Use the break status
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
  
    
      console.log('Data submitted successfully!');
    } catch (error) {
      console.error('Error:', error);
      
    }
  };
  
  // Render the dashboard UI
  return (
    <div>
      <CRow>
        <CCol xs={12}>
          <CCard>
            <CCardBody className="text-center">
              <h1>{t('clientDataUI')}</h1> {/* Translate the heading */}
              <p>{t('welcomeMessage')}</p> {/* Translate the welcome message */}

              <div className="mt-4">
                <h5>{t('selectOperatingHours')}</h5> {/* Translate the subheading */}
                <CRow className="justify-content-center mt-3">
                  <CCol xs={4}>
                    <CFormSelect
                      value={startTime} // Set the value of the select element
                      onChange={(e) => setStartTime(e.target.value)} // Handle changes so the value is updated
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
                      disabled={filteredEndTimes.length === 0} // Disable the select if there are no available times
                    >
                      {filteredEndTimes.length > 0 ? (
                        filteredEndTimes.map((time, index) => ( // Map the filtered times to options
                          <option key={index} value={time}>
                            {time}
                          </option>
                        ))
                      ) : (
                        <option>{t('noAvailableTimes')}</option> // Display a message if there are no available times
                      )}
                    </CFormSelect>
                  </CCol>
                </CRow>
                <div className="mt-4">
                  <p>{t('operatingHours')}: {startTime} - {endTime}</p> {/* Display the selected operating hours */}
                </div>
              </div>

              <div className="mt-4">
                <h5>{t('enterDailyMetrics')}</h5>
                <CRow className="justify-content-center mt-3">
                  <CCol xs={4}>
                    <label htmlFor="employees">{t('numberOfEmployees')}</label> {/* Translate the label */}
                    <CFormInput
                      type="number"
                      id="employees"
                      value={employees} // Set the value of the input
                      onChange={(e) => setEmployees(e.target.value)} // Handle changes to update the value
                      min="1"
                    />
                  </CCol>
                  <CCol xs={4}>
                    <label htmlFor="sales">{t('dailySales')}</label>
                    <CFormInput
                      type="number"
                      id="sales"
                      value={dailySales} // Set the value of the input
                      onChange={(e) => setSales(e.target.value)} // Handle changes to update the value
                      min="0"
                    />
                  </CCol>
                </CRow>
                <div className="mt-4">
                  <p>{t('employees')}: {employees}</p> {/* Display the number of employees */}
                  <p>{t('dailySales')}: ${dailySales}</p> {/* Display the daily sales */}
                </div>
              </div>

              <div className="mt-4">
                <h5>{t('salesPerHour')}</h5> {/* Translate the subheading */}
                <CTable responsive> {/* Create a responsive table */}
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>{t('hour')}</CTableHeaderCell>
                      <CTableHeaderCell>{t('sales')}</CTableHeaderCell>
                      <CTableHeaderCell>{t('inBreak')}</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {selectedHours.map((hour, index) => ( // Map the selected hours to table rows
                      <CTableRow key={index}>
                        <CTableDataCell>{hour}</CTableDataCell>
                        <CTableDataCell>
                          <CFormInput // Create an input field for sales
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
                <CButton onClick={handleSubmit} color="primary">{t('submit')}</CButton> {/* Translate the button text */}
                {submissionMessage && <p>{submissionMessage}</p>}
              </div>

              <CRow className="justify-content-end mt-4">
                <CCol xs={2} className="text-right">
                  <img
                    src={logo}
                    alt={t('companyLogo')} // Translate the alt text
                    style={{
                      width: '150px',
                      height: 'auto'
                    }}
                  />
                </CCol>
              </CRow>

              <CRow className="justify-content-end mt-5">
                <p>{t('privacyMessage')}</p> {/* Translate the privacy message */}
              </CRow>

            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  );
};
// Export the Dashboard component
export default Dashboard;


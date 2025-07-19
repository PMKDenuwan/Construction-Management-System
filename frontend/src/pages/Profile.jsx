import React, { useEffect, useState } from 'react';
import { Card } from 'flowbite-react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { FaFileDownload } from 'react-icons/fa';
import JsPDF from 'jspdf';

export default function Profile() {
  const [appointments, setAppointments] = useState([]);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get(`/api/appointment?userId=${currentUser._id}`);
        setAppointments(data.appointment); // Assuming response data has 'appointment' field
      } catch (error) {
        console.error(error);
      }
    };

    fetchAppointments();
  }, [currentUser._id]);

  const generatePDF = (name, company, date, time) => {
    const pdf = new JsPDF();

    pdf.setFontSize(18);
    pdf.text("SHAN Construction", 105, 30, { align: "center" });

    pdf.setLineWidth(1);
    pdf.rect(20, 35, pdf.internal.pageSize.getWidth() - 40, pdf.internal.pageSize.getHeight() - 50);

    pdf.setFontSize(14);
    pdf.text(`Subject: Appointment Confirmation of ${company}`, 25, 45);

    pdf.text(`Dear ${name},`, 25, 60);

    const introText = "We are pleased to confirm your appointment with us. Below are the details of your scheduled appointment:";
    const introTextLines = pdf.splitTextToSize(introText, 160);
    pdf.text(introTextLines, 25, 75);

    pdf.text(`Date: ${date}`, 45, 100);
    pdf.text(`Time: ${time}`, 45, 110);

    const outroText = "If you have any questions or need to make changes to your appointment, please feel free to contact us. We look forward to seeing you soon!";
    const outroTextLines = pdf.splitTextToSize(outroText, 160);
    pdf.text(outroTextLines, 25, 125);

    pdf.text("Best regards,", 25, 165);
    pdf.text("The Client Manager", 25, 175);
    pdf.text("Shan Construction", 25, 185);
    pdf.text("+94 1123079", 25, 195);

    pdf.save("booking-confirmation.pdf");
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8 text-left">My Appointments</h1>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {appointments.length > 0 ? (
          appointments.map((appointment, index) => (
            <AppointmentCard
              key={index}
              appointment={appointment}
              generatePDF={generatePDF}
            />
          ))
        ) : (
          <p className="text-lg text-gray-700">No appointments found.</p>
        )}
      </div>
    </div>
  );
};

const AppointmentCard = ({ appointment, generatePDF }) => (
  <Card className="p-6 rounded-lg shadow-md bg-white">
    <div className="flex justify-between items-center mb-4">
      <h5 className="text-xl font-bold text-gray-900">{appointment.date}</h5>
      {appointment.status === 'successful' && (
        <a
          onClick={() =>
            generatePDF(
              appointment.fullName,
              appointment.companyName,
              appointment.date,
              appointment.time
            )
          }
          className="text-red-600 hover:underline"
          title="Download Confirmation"
        >
          <FaFileDownload className="text-xl" />
        </a>
      )}
    </div>
    <AppointmentDetail label="Name" value={appointment.fullName} />
    <AppointmentDetail label="Contact Number" value={appointment.phone} />
    <AppointmentDetail label="Company Name" value={appointment.companyName} />
    <AppointmentDetail label="Message" value={appointment.message} />
    <div className={`inline-block px-2 py-1 rounded ${appointment.status === 'pending' ? 'bg-blue-200 text-blue-800' : 'bg-green-200 text-green-800'}`}>
      {appointment.status}
    </div>
  </Card>
);

const AppointmentDetail = ({ label, value }) => (
  <p className="text-sm text-gray-700 mb-2">
    <span className="font-medium">{label}:</span> {value}
  </p>
);


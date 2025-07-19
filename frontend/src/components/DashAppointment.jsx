import React, { useEffect, useState } from "react";
import { Button, Card, Table } from "flowbite-react"; // Replace with your UI library imports
import axios from "axios";
import Swal from "sweetalert2";
import { CgAlbum } from "react-icons/cg";
import { IoTrashBinOutline } from "react-icons/io5";
import { AiOutlineEye } from "react-icons/ai"; // Import the eye icon
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

export default function DashAppointment() {
  const [appointments, setAppointments] = useState([]);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [totalPendingAppointments, setTotalPendingAppointments] = useState(0);
  const [totalApprovedAppointments, setTotalApprovedAppointments] = useState(0);
  const [sortCriteria, setSortCriteria] = useState("total");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleAppointment, setVisibleAppointment] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get(`/api/appointment?name=${searchQuery}`);
        setAppointments(data.appointment);
        setTotalAppointments(data.totalAppointments);

        const pendingCount = data.appointment.filter((a) => a.status === "pending").length;
        const approvedCount = data.appointment.filter((a) => a.status === "successful").length;
        setTotalPendingAppointments(pendingCount);
        setTotalApprovedAppointments(approvedCount);

        initializeChart(pendingCount, approvedCount);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, [searchQuery]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this appointment?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "No, keep it",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`/api/appointment/${id}`);
        setAppointments((currentAppointments) =>
          currentAppointments.filter((a) => a._id !== id)
        );

        const pendingCount =
          totalPendingAppointments -
          (appointments.find((a) => a._id === id).status === "pending" ? 1 : 0);
        const approvedCount =
          totalApprovedAppointments -
          (appointments.find((a) => a._id === id).status === "successful" ? 1 : 0);
        setTotalPendingAppointments(pendingCount);
        setTotalApprovedAppointments(approvedCount);

        initializeChart(pendingCount, approvedCount);

        Swal.fire(
          "Deleted!",
          "The appointment has been deleted.",
          "success"
        );
      } catch (error) {
        console.error("Error deleting appointment:", error);
        Swal.fire("Error", "Failed to delete the appointment.", "error");
      }
    }
  };

  const handleUpdate = async (id) => {
    try {
      const formdata = { status: "successful" };
      await axios.put(`/api/appointment/${id}`, formdata);
      setAppointments((currentAppointments) =>
        currentAppointments.map((a) =>
          a._id === id ? { ...a, status: "successful" } : a
        )
      );

      const pendingCount = totalPendingAppointments - 1;
      const approvedCount = totalApprovedAppointments + 1;
      setTotalPendingAppointments(pendingCount);
      setTotalApprovedAppointments(approvedCount);

      initializeChart(pendingCount, approvedCount);

      Swal.fire(
        "Confirmed!",
        "The appointment has been confirmed.",
        "success"
      );
    } catch (error) {
      console.error("Error updating appointment:", error);
      Swal.fire(
        "Error",
        "Failed to update the appointment status.",
        "error"
      );
    }
  };

  const sortAppointments = (appointments, criteria) => {
    switch (criteria) {
      case "total":
        return [...appointments];
      case "pending":
        return [...appointments]
          .filter((a) => a.status === "pending")
          .sort((a, b) => new Date(b.date) - new Date(a.date));
      case "approved":
        return [...appointments]
          .filter((a) => a.status === "successful")
          .sort((a, b) => new Date(b.date) - new Date(a.date));
      default:
        return [...appointments];
    }
  };

  const sortedAppointments = sortAppointments(appointments, sortCriteria);

  const handleCardClick = (criteria) => {
    setSortCriteria(criteria);
  };

  const initializeChart = (pendingCount, approvedCount) => {
    const ctxB = document.getElementById("barChart");

    if (!ctxB) return;

    if (window.myBarChart) {
      window.myBarChart.destroy(); // Destroy existing chart instance
    }

    window.myBarChart = new Chart(ctxB, {
      type: "bar",
      data: {
        labels: ["Pending", "Approved"],
        datasets: [
          {
            label: "Appointments",
            data: [pendingCount, approvedCount],
            backgroundColor: [
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
            ],
            borderColor: ["rgba(255, 206, 86, 1)", "rgba(75, 192, 192, 1)"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            mode: "index",
            intersect: false,
          },
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: "Status",
              color: "#333",
              font: {
                weight: 1000,
              },
            },
            grid: {
              color: "rgba(0, 0, 0, 0.1)",
            },
            ticks: {
              color: "#333",
            },
          },
          y: {
            display: true,
            title: {
              display: true,
              text: "Count",
              color: "#333",
              font: {
                weight: 1000,
              },
            },
            grid: {
              color: "rgba(0, 0, 0, 0.1)",
            },
            ticks: {
              color: "#333",
            },
          },
        },
        animation: {
          duration: 1000,
          easing: "easeInOutQuart",
        },
      },
    });
  };

  const toggleAppointmentCard = (index) => {
    setVisibleAppointment(
      visibleAppointment === index ? null : index
    );
  };

  return (
    <div className="overflow-x-auto mx-auto w-full p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-900">Appointments</h1>
      </div>

      <div className="summary-cards-container flex flex-wrap gap-4">
        <Card
          onClick={() => handleCardClick("total")}
          className={`max-w-xs p-6 cursor-pointer shadow-lg transition-transform transform hover:scale-105 bg-white rounded-lg border ${
            sortCriteria === "total"
              ? "bg-gradient-to-r from-blue-500 to-green-500 text-white"
              : "border-gray-200 hover:bg-gray-100"
          }`}
        >
          <div className="flex justify-between items-center mb-4">
            <p className="font-medium text-lg">Total Appointments</p>
            <CgAlbum className="text-4xl" />
          </div>
          <h1 className="text-4xl font-bold">{totalAppointments}</h1>
        </Card>

        <Card
          onClick={() => handleCardClick("pending")}
          className={`max-w-xs p-6 cursor-pointer shadow-lg transition-transform transform hover:scale-105 bg-white rounded-lg border ${
            sortCriteria === "pending"
              ? "bg-gradient-to-r from-blue-500 to-yellow-500 text-white"
              : "border-gray-200 hover:bg-gray-100"
          }`}
        >
          <div className="flex justify-between items-center mb-4">
            <p className="font-medium text-lg">Total Pending Appointments</p>
            <CgAlbum className="text-4xl" />
          </div>
          <h1 className="text-4xl font-bold">{totalPendingAppointments}</h1>
        </Card>

        <Card
          onClick={() => handleCardClick("approved")}
          className={`max-w-xs p-6 cursor-pointer shadow-lg transition-transform transform hover:scale-105 bg-white rounded-lg border ${
            sortCriteria === "approved"
              ? "bg-gradient-to-r from-blue-500 to-green-500 text-white"
              : "border-gray-200 hover:bg-gray-100"
          }`}
        >
          <div className="flex justify-between items-center mb-4">
            <p className="font-medium text-lg">Total Approved Appointments</p>
            <CgAlbum className="text-4xl" />
          </div>
          <h1 className="text-4xl font-bold">{totalApprovedAppointments}</h1>
        </Card>
      </div>

      <canvas id="barChart" className="my-8 w-full"></canvas>

      <Table hoverable={true} className="w-full bg-white rounded-lg overflow-hidden">
        <Table.Head className="bg-gray-200">
          <Table.HeadCell className="px-6 py-3">Date</Table.HeadCell>
          <Table.HeadCell className="px-6 py-3">Time</Table.HeadCell>
          <Table.HeadCell className="px-6 py-3">Name</Table.HeadCell>
          <Table.HeadCell className="px-6 py-3">Contact Number</Table.HeadCell>
          <Table.HeadCell className="px-6 py-3">Company Name</Table.HeadCell>
          <Table.HeadCell className="px-6 py-3">Status</Table.HeadCell>
          <Table.HeadCell className="px-6 py-3">Actions</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {sortedAppointments.map((appointment, index) => (
            <>
              <Table.Row
                key={appointment._id}
                className="bg-white hover:bg-gray-300 transition-colors duration-200"
              >
                <Table.Cell className="px-6 py-4">{new Date(appointment.date).toLocaleDateString()}</Table.Cell>
                <Table.Cell className="px-6 py-4">{appointment.time}</Table.Cell>
                <Table.Cell className="px-6 py-4">{appointment.fullName}</Table.Cell>
                <Table.Cell className="px-6 py-4">{appointment.phone}</Table.Cell>
                <Table.Cell className="px-6 py-4">{appointment.companyName}</Table.Cell>
                <Table.Cell className="px-6 py-4">
                  <span className={`bg-${appointment.status === "pending" ? "yellow" : "green"}-200 text-${appointment.status === "pending" ? "yellow" : "green"}-800 py-1 px-3 rounded-full text-xs`}>
                    {appointment.status}
                  </span>
                </Table.Cell>
                <Table.Cell className="px-6 py-4 flex gap-4">
                  <Button color="gray" size="sm" onClick={() => toggleAppointmentCard(index)}>
                    <AiOutlineEye className="text-xl" />
                  </Button>
                  <Button
                    color="blue"
                    size="sm"
                    disabled={appointment.status === "successful"}
                    onClick={() => handleUpdate(appointment._id)}
                  >
                    Confirm
                  </Button>
                  <Button
                    color="red"
                    size="sm"
                    onClick={() => handleDelete(appointment._id)}
                  >
                    <IoTrashBinOutline className="text-xl" />
                  </Button>
                </Table.Cell>
              </Table.Row>
              {visibleAppointment === index && (
                <Table.Row>
                  <Table.Cell colSpan={7}>
                    <Card className="p-6 bg-white shadow-md rounded-lg border border-gray-200">
                      <p className="text-lg font-semibold mb-2">Appointment Details</p>
                      <p><span className="font-semibold">Date:</span> {new Date(appointment.date).toLocaleDateString()}</p>
                      <p><span className="font-semibold">Time:</span> {appointment.time}</p>
                      <p><span className="font-semibold">Name:</span> {appointment.fullName}</p>
                      <p><span className="font-semibold">Contact Number:</span> {appointment.phone}</p>
                      <p><span className="font-semibold">Company Name:</span> {appointment.companyName}</p>
                      <p><span className="font-semibold">Message:</span> {appointment.message}</p>
                    </Card>
                  </Table.Cell>
                </Table.Row>
              )}
            </>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}

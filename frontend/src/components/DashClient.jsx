import axios from "axios";
import { Button, Table, Card, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { HiMiniUserGroup } from "react-icons/hi2";
import { PiNotePencilBold } from "react-icons/pi";
import { IoTrashBinOutline } from "react-icons/io5";
import { AiOutlineSearch } from "react-icons/ai";

export default function DashClient() {
  const [clients, setClients] = useState([]);
  const [totalCount, setTotalCount] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const { data } = await axios.get(`/api/client?name=${searchQuery}`);
        setClients(data.client);
        setTotalCount(data.totalClients);
      } catch (error) {
        console.error(error);
      }
    };

    fetchClients();
  }, [searchQuery]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this Client Details?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "No, keep it",
    });

    if (result.isConfirmed) {
      try {
        const res = await axios.delete(`/api/client/${id}`);
        setClients((currentClients) =>
          currentClients.filter((p) => p._id !== id)
        );
        console.log(res);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="overflow-x-auto mx-auto w-full p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-900">Clients</h1>
        <Link to="/client">
          <Button className="flex items-center bg-blue-500 hover:bg-blue-600 text-white">
            <IoIosAddCircleOutline className="mr-2 text-xl" />
            New Client
          </Button>
        </Link>
      </div>

      <Card className="max-w-md mb-8 p-6 shadow-lg bg-gradient-to-r from-blue-500 to-green-500 text-white">
        <div className="flex justify-between items-center">
          <p className="text-lg">Clients</p>
          <HiMiniUserGroup className="text-6xl text-white" />
        </div>
        <h1 className="text-4xl font-bold mt-4">{totalCount}</h1>
      </Card>

      <div className="mb-8">
        <TextInput
          type="text"
          placeholder="Search By Client Name..."
          rightIcon={AiOutlineSearch}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full lg:w-96 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <Table className="w-full bg-black shadow-md rounded-lg overflow-hidden">
        <Table.Head className="bg-gradient-to-r from-blue-500 to-green-500 text-">
          <Table.HeadCell>ProjectID</Table.HeadCell>
          <Table.HeadCell>Name</Table.HeadCell>
          <Table.HeadCell>Company Name</Table.HeadCell>
          <Table.HeadCell>Address</Table.HeadCell>
          <Table.HeadCell>Contact Number</Table.HeadCell>
          <Table.HeadCell>Duration of Contract</Table.HeadCell>
          <Table.HeadCell>
            <span className="sr-only">Edit</span>
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y divide-gray-200">
          {clients.map((client, index) => (
            <Table.Row
              key={index}
              className={`${
                index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
              } hover:bg-gray-200 transition-colors`}
            >
              <Table.Cell className="px-6 py-4">{client.projectID}</Table.Cell>
              <Table.Cell className="px-6 py-4">{client.name}</Table.Cell>
              <Table.Cell className="px-6 py-4">{client.companyname}</Table.Cell>
              <Table.Cell className="px-6 py-4">{client.address}</Table.Cell>
              <Table.Cell className="px-6 py-4">{client.phone}</Table.Cell>
              <Table.Cell className="px-6 py-4">{client.duration}</Table.Cell>
              <Table.Cell className="px-6 py-4">
                <div className="flex gap-4">
                  <Link
                    to={`/update-client/${client._id}`}
                    className="text-blue-500 hover:underline"
                  >
                    <PiNotePencilBold className="text-2xl" />
                  </Link>
                  <button
                    onClick={() => handleDelete(client._id)}
                    className="text-red-500 hover:underline"
                  >
                    <IoTrashBinOutline className="text-2xl" />
                  </button>
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}

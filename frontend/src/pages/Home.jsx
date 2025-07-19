import React from "react";
import { Button } from "flowbite-react";
import heroimage from "../image/heroimage.jpg";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <div
        className="relative w-full h-screen flex items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${heroimage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="text-center text-white max-w-3xl mx-auto px-6">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            Diversified Services. Unvarying Quality.
          </h1>

          <p className="text-lg md:text-xl text-gray-200 mb-8">
            Welcome to Shan Construction Management System, your all-inclusive solution for efficient project management in the dynamic construction industry. Shan Construction empowers construction professionals, project managers, and stakeholders with robust tools and resources designed to streamline workflows, optimize scheduling, and foster seamless collaboration.
          </p>

          <Link to="/appointment">
            <Button className="px-8 py-4 text-lg md:text-xl bg-blue-500 hover:bg-blue-600 rounded-full shadow-lg">
              Make an Appointment
            </Button>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <section className="bg-gray-100 py-12">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            Our Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature Card 1: Project Management */}
            <div className="bg-white p-6 shadow-lg rounded-lg">
              <h3 className="text-2xl font-bold mb-4">Project Management</h3>
              <p className="text-gray-700">
                Streamline workflows and optimize scheduling with our robust project management tools.
              </p>
            </div>

            {/* Feature Card 2: Collaboration Tools */}
            <div className="bg-white p-6 shadow-lg rounded-lg">
              <h3 className="text-2xl font-bold mb-4">Collaboration Tools</h3>
              <p className="text-gray-700">
                Foster seamless collaboration among teams and stakeholders with our integrated tools.
              </p>
            </div>

            {/* Feature Card 3: Analytics & Reports */}
            <div className="bg-white p-6 shadow-lg rounded-lg">
              <h3 className="text-2xl font-bold mb-4">Analytics & Reports</h3>
              <p className="text-gray-700">
                Make data-driven decisions with our comprehensive analytics and reporting features.
              </p>
            </div>
          </div>
        </div>
      </section>

      

     
    </div>
  );
};

export default Home;
